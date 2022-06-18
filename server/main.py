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
        raise fastapi.HTTPException(status_code=400, detail="Email already in use") 

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

 
        
  
    

