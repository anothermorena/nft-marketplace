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

    #delete existing one time pin before creating a new one
    await services.delete_otp(user.email,db)
    
    #create a one time pin
    #TODO: create the user before you create the OTP. 
    otp_code = await services.create_otp(user.email,db)

    #send an account verification email to the user
    subject = 'Account Created Successfully'
    body = {'title':'Account Verification', 'message':'Hi! Welcome to NFT Market Place. Your account verification OTP code is: ' + str(otp_code) + '\n\n  Please use it to activate your account 😜.'}

    await services.send_email_async(subject, user.email, body)

  
    #user does not exists, create the user
    user = await services.create_user(user, db)

    #both user and otp are created, send feed back
    return user
 
        
  
    

