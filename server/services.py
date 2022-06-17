#load the required modules or packages
import models, schemas 
import passlib.hash as hash
import sqlalchemy.orm as orm
import random 
from fastapi_mail import FastMail, MessageSchema
from config import email_conf

#this function gets a user by a given email
async def get_user_by_email(email: str, db: orm.Session):
    #if there is a user with the specified email return that user
    return db.query(models.User).filter(models.User.email == email).first()


#this function creates a new user
async def create_user(user: schemas.UserCreate, db: orm.Session):
    #create the user data to be stored in the database
    user_obj = models.User(first_name= user.first_name,last_name= user.last_name,email=user.email, profile_image = "", user_status= "UNVERIFIED", hashed_password= hash.bcrypt.hash(user.hashed_password))  

    #save the user to the database
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)

    #send back the user and a success message
    return dict(message="User created successfully", status="SUCCESS", data=user_obj)


#this function creates a user's one time pin for account verification and password reset
async def create_otp(email:str, db: orm.Session):
    #generate a random 4 digit code
    code = random.randint(1000,9999)
    otp_obj = models.Otp(code = code, email = email)

    #save the otp to the database
    db.add(otp_obj)
    db.commit()
    db.refresh(otp_obj)

    #send back the code to send it ton the user.
    return code


#this function deletes an existing one time pin before creating another one
async def delete_otp(email:str, db: orm.Session):
    old_otp = (db.query(models.Otp)
        .filter(models.Otp.email == email) #return the one with the specified email
        .first() #get the first object that comes from it
    )

    if old_otp:
        db.delete(old_otp)
        db.commit()

#this function sends emails to the user
async def send_email_async(subject: str, email_to: str, body: dict):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype='html',
    )
    
    fm = FastMail(email_conf)
    await fm.send_message(message, template_name='email.html') 










