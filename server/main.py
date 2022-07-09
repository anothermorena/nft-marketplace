#load the required modules or packages
import fastapi
from fastapi import status, HTTPException,File, UploadFile,Form
import sqlalchemy.orm as orm
from database import engine
import services, schemas, models
import fastapi.security as security
import passlib.hash as hash
from typing import Optional,List

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
    if not profile_image:
        #user did not upload an image: update first name and last name with incoming values  
        db_user.first_name = first_name
        db_user.last_name = last_name
        db.commit()
        db.refresh(db_user)
        
        #done: send feedback to the user
        return dict(message="Successfully Updated", status="SUCCESS", data=db_user)
    
    #user uploaded an image
    # check file type of the uploaded image
    if profile_image.content_type not in ['image/jpg','image/jpeg', 'image/png']:
        raise HTTPException(status_code=406, detail="Only .jpeg or .png  files allowed")     
    
    #upload the image to cloudinary
    result = services.upload_image(profile_image.file,profile_image.filename,unique_filename=False, overwrite=True)
        
    #get the url of the profile image
    profile_image_url = result.get("secure_url")

    #update user profile details
    db_user.first_name = first_name
    db_user.last_name = last_name
    db_user.profile_image = profile_image_url
    db.commit()
    db.refresh(db_user)
    
    #done: send feedback to the user
    return dict(message="Successfully Updated", status="SUCCESS", data=db_user)


#create nft end point
@app.post("/api/create_nft/")
async def create_nft(nft_title: str = Form(), nft_description: str = Form(),nft_image: UploadFile = File(...),nft_price: float = Form(),bidding_deadline: str = Form(),current_user:schemas.User = fastapi.Depends(services.get_current_user), db: orm.Session = fastapi.Depends(services.get_db)): 
    #check if a user with the provided email exists or not 
    db_user = await services.get_user_by_email(current_user.email, db)
 
    if not db_user:
        #user does not exists
        return dict(status_code=404, message="User not found", status="FAILED")
    
    # check file type of the uploaded image
    if nft_image.content_type not in ['image/jpg','image/jpeg', 'image/png']:
        raise HTTPException(status_code=406, detail="Only .jpeg or .png  files allowed")     
    
    #upload the image to cloudinary
    result = services.upload_image(nft_image.file,nft_image.filename,unique_filename=False, overwrite=True)
        
    #get the url of the profile image
    nft_image_url = result.get("secure_url")
    
    #convert the nft data to a dictionary
    nft_data = {
        "nft_title": nft_title,
        "nft_description": nft_description,
        "nft_image": nft_image_url,
        "nft_price": nft_price,
        "bidding_deadline": bidding_deadline
    }

    #save the nft to the database
    created_nft = await services.create_nft(user=db_user, db=db, nft_data=nft_data)
    
    #done: send feedback to the user
    return dict(message="Successfully created Nft", status="SUCCESS", data=created_nft)


#fetch nfts from the database
@app.get("/api/nfts/", response_model=List[schemas.Nft])
async def get_nfts(db: orm.Session = fastapi.Depends(services.get_db)):
    #get  all nfts
    nfts = await services.get_nfts(db=db)
    
    #get each nft's creator
    await services.get_creator(nfts,db)
    
    #done: send them back to the user
    return nfts


#add  nft to users wishlist api end point
@app.post("/api/add_nft_to_wish_list/")
async def add_nft_to_wish_list(wishlist: schemas.WishlistBase,db: orm.Session = fastapi.Depends(services.get_db)):
    #check if nft is not already in the users wish list
    nft = await services.check_wish_list_for_nft(wishlist.user_ip_address, wishlist.nft_id, db)
    
    if nft:
        return dict(message="This nft already in your wish list. 😒") 
    
    #nft is not in the users wish list : add it
    await services.add_nft_to_wish_list(wishlist.user_ip_address, wishlist.nft_id, db)
    
    #send feed back to the user
    return dict(message="Nft was successfully added your wish list. 😋")


#fetch users nft wishlist  from the database
@app.get("/api/get_users_wish_list/", response_model=List[schemas.WishList])
async def get_users_wish_list(user_ip_address: str, db: orm.Session = fastapi.Depends(services.get_db)):
    #get  all nfts in the users wishlist
    wishlist = await services.get_users_wish_list(user_ip_address=user_ip_address,db=db)
    
    #get the nft details
    await services.get_nft_details(wishlist,db)
        
    #get each nft's creator
    await services.get_creator(wishlist,db)
    
    #done: send them back to the user
    return wishlist


#delete nft from users wishlist
@app.delete("/api/delete_nft_from_users_wish_list/", status_code=204)
async def delete_nft_from_users_wish_list(nft: schemas.WishlistBase, db: orm.Session = fastapi.Depends(services.get_db)):
    await services.delete_nft_from_users_wish_list(nft.nft_id, nft.user_ip_address, db)
 
    

    


   
  

