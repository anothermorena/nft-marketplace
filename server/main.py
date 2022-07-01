#load the required modules or packages
import fastapi
from fastapi import status, HTTPException,File, UploadFile,Form
import sqlalchemy.orm as orm
from database import engine
import services, schemas, models
import fastapi.security as security
import passlib.hash as hash
from typing import Optional
import pathlib
import uuid
import os

#create the app object
app = fastapi.FastAPI()

#create all our db tables
models.Base.metadata.create_all(engine)

#create a user end point
@app.post("/api/users")
async def create_user(user: schemas.CreateUser, db: orm.Session = fastapi.Depends(services.get_db)):
   #check if a user with the provided email exists or not 
    db_user = await services.get_user_by_email(user.email, db)
 
    if db_user:
        #user already exists
        return dict(message="Email already in use", status="FAILED", email=user.email)

    #user does not exists, create the user
    await services.create_user(user, db)
 
    #create a new one time pin for account verification
    otp_code = await services.create_otp(user.email,db)

    #send an account verification email to the user
    subject = "Account Created Successfully"
    body = 'Hi! Welcome to NFT Market Place. Your account verification OTP code is: ' + str(otp_code) + '.\nPlease use it to activate your account 😜.'

    email_status = await services.send_email_async(subject, user.email, body)

    #send back the email status and message
    return email_status

#send otp end point
@app.post("/api/send_otp")
async def send_otp(email: schemas.Otp, db: orm.Session = fastapi.Depends(services.get_db)):
   #check if a user withthe provided email exists or not 
   db_user = await services.get_user_by_email(email.email, db)
 
   if not db_user:
       #user already exists
       return dict(message="User with that email address does not exist", status="FAILED")

   #create a new one time pin
   otp_code = await services.create_otp(email.email,db)

   #send otp
   subject = "New OTP"
   body = 'Your OTP code is: ' + str(otp_code)

   email_status = await services.send_email_async(subject, email.email, body)

   #send back the email status and message
   return email_status


#verify account end point
@app.patch("/api/verify_otp")
async def verify_otp(user: schemas.VerifyOtp, db: orm.Session = fastapi.Depends(services.get_db)):
    #first check if a user with given email exist
     db_user = await services.get_user_by_email(user.email, db)

    #check if the user account was found
     if not db_user:
        #user not found
        return dict(message="Invalid email or otp.", status="FAILED")

     #user exists
     #check if the user have a valid otp
     otp = await services.get_otp_by_email(user.email, user.otp, db)

     if not otp:
         return dict(message="The provided OTP is invalid. Please try again.", status="FAILED")
    #An otp with that user email exists: process the incoming request
     else:
        #check the type of process the use executed: account verification or request password reset
        #if the request is for resetting user password then execute the if block below
        if user.request_type == "RESET_PASSWORD_REQUEST":
            #done: send feedback to the user
            return dict(message="OTP and user verification successful. Proceed to reset your password.", status="SUCCESS")

        #request is for account verification
        else:
            # verify the users account and update its status
            if db_user.user_status == "UNVERIFIED":
                db_user.user_status = "VERIFIED"
                db.commit()
                db.refresh(db_user)

                #delete the otp used for verification
                await services.delete_otp(user.email, db)

                #account verification was successful: send back feedback
                return dict(message="User account verification successful.", status="SUCCESS")

            #user account already verified
            return dict(message="User account already verified.", status="SUCCESS")
            

#user login end point
@app.post("/api/login")
async def user_login(form_data: security.OAuth2PasswordRequestForm = fastapi.Depends(), db: orm.Session = fastapi.Depends(services.get_db)):
    #authenticate the user using the provided credentials
    user = await services.authenticate_user(form_data.username, form_data.password, db)

    #create an access token for the user
    return await services.create_token(user)

#reset password end point
@app.patch("/api/reset_password")
async def reset_password(user: schemas.ResetPassword, db: orm.Session = fastapi.Depends(services.get_db)):
      #first check if a user with given email exist
     db_user = await services.get_user_by_email(user.email, db)

    #check if the user account was found
     if not db_user:
        #user not found
        return dict(message="Invalid email or otp.", status="FAILED")

     #user exists
     #check if the user have a valid otp
     otp = await services.get_otp_by_email(user.email, user.otp, db)

     if not otp:
         return dict(message="The provided OTP is invalid. Please try again.", status="FAILED")
        
     #everything seems okay: Proceed to reset the user password
     await services.new_password(user.password,db_user,db)

     #delete the otp used for password reset
     await services.delete_otp(user.email, db)

     #password reset was successful: tell the user
     return dict(message="Your password was reset successfully. You may now log into your account 🙃", status="SUCCESS")


#change authenticated user password end point
@app.patch("/api/change_password/")
async def change_password(change_password: schemas.ChangePassword, current_user:schemas.User = fastapi.Depends(services.get_current_user), db: orm.Session = fastapi.Depends(services.get_db)):
    #check if a user with the provided email exists or not 
    db_user = await services.get_user_by_email(current_user.email, db)
 
    if not db_user:
        #user does not exists
        return dict(status_code= status.HTTP_404_NOT_FOUND, message="User not found", status="FAILED")

    #verify current password
    if not hash.bcrypt.verify(change_password.current_password, db_user.hashed_password):
        return dict(message="Your current password is incorrect", status="FAILED")

    #verify if new and confirm password match
    if change_password.new_password != change_password.confirm_password:
        return dict(message="Your passwords do not match", status="FAILED")

    #everything is okay! Change the users password
    await services.new_password(change_password.new_password,db_user,db)


    #done: send feedback to the user
    return dict(message="Successfully Updated", status="SUCCESS")


#update user profile end point
@app.patch("/api/update_profile_details/")
async def update_profile_details(first_name: str = Form(), last_name: str = Form(), profile_image: Optional[UploadFile] = File(None),current_user:schemas.User = fastapi.Depends(services.get_current_user), db: orm.Session = fastapi.Depends(services.get_db)):
    
    #check if a user with the provided email exists or not 
    db_user = await services.get_user_by_email(current_user.email, db)
 
    if not db_user:
        #user does not exists
        return dict(status_code=404, message="User not found", status="FAILED")

    #check if user uploaded a new profile image
    if profile_image:
        #delete old profile image
        #get current image name
        current_profile_image = db_user.profile_image

        #deletion path
        current_profile_image_location = f"uploaded_images/user_profile_images/{current_profile_image}"

        #try to delete the file 
        try:
            os.remove(current_profile_image_location)
        except OSError as e:  # failed, report it back to the user 
            print ("Error: %s - %s." % (e.filename, e.strerror))
        
        #check file type of the uploaded image
        if profile_image.content_type not in ['image/jpg','image/jpeg', 'image/png']:
            raise HTTPException(status_code=406, detail="Only .jpeg or .png  files allowed")

        #rename uploaded file
        file_ext = pathlib.Path(profile_image.filename).suffix
        random_file_name = f'{uuid.uuid4().hex}{file_ext}'


        #update user profile details
        db_user.first_name = first_name
        db_user.last_name = last_name
        db_user.profile_image = random_file_name
        db.commit()
        db.refresh(db_user)

        #upload the file to the server
        file_location = f"uploaded_images/user_profile_images/{random_file_name}"

        with open(file_location, "wb+") as file_object:
            file_object.write(profile_image.file.read())
            return {"info": f"file '{random_file_name}' saved at '{file_location}'"}


 
    

    


   
  

