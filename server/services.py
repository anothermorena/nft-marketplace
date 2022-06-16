#load the required modules or packages
import models, schemas 
import passlib.hash as hash
import sqlalchemy.orm as orm
        
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





