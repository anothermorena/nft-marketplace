#load the required modules or packages
import fastapi as fastapi 
import sqlalchemy.orm as orm
from database import engine, get_db
import services, schemas, models

#create the app object
app = fastapi.FastAPI()

#create all our db tables
models.Base.metadata.create_all(engine)

#create a user end point
@app.post("/api/users")
async def create_user(user: schemas.UserCreate, db: orm.Session = fastapi.Depends(get_db)):
   #check if a user with the provided email exists or not 
    db_user = await services.get_user_by_email(user.email, db)
 
    if db_user:
        #user already exists so raise an exception
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
async def send_otp(email: schemas.Otp, db: orm.Session = fastapi.Depends(get_db)):
   #create a new one time pin
   otp_code = await services.create_otp(email.email,db)

   #send otp
   subject = "New OTP"
   body = 'Your OTP code is: ' + str(otp_code)

   email_status = await services.send_email_async(subject, email.email, body)

   #send back the email status and message
   return email_status


#verify account end point
@app.patch("/api/verify_account")
async def verify_account(user: schemas.VerifyOtp, db: orm.Session = fastapi.Depends(get_db)):
    #first check if a user with given email exist
     db_user = await services.get_user_by_email(user.email, db)

    #found the user account
     if db_user:
        #check if they have a valid otp
        otp = await services.get_otp_by_email(user.email, user.otp, db)

        if not otp:
            return dict(message="The provided OTP is invalid. Please try again", status="FAILED")
        else:
            #An otp with that user email exists: verify the users account and update its status
            if db_user.user_status == "UNVERIFIED":
                db_user.user_status = "VERIFIED"
                db.commit()
                db.refresh(db_user)

                #delete the otp used for verification
                await services.delete_otp(user.email, db)

                #send back feedback
                return dict(message="User account verification Successful", status="SUCCESS")

            #user account already verified
            return dict(message="User account already verified", status="FAILED")
            


        
  
    

