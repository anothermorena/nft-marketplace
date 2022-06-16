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
    db_user = await services.get_user_by_email(user.email, db)
    #check if a user with the provided email exists or not 
    if db_user:
        #user already exists so raise an exception
        raise fastapi.HTTPException(status_code=400, detail="Email already in use") 

    #user does not exists, create the user
    user = await services.create_user(user, db)
    
    #send feedback back 😁
    return user
  
    

