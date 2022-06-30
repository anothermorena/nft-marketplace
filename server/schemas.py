#This file contains pydantic models/schemas
#import required modules or packages
from pydantic import BaseModel


#CreateUser is the info we will be sending when creating a user
class CreateUser(BaseModel):
    first_name: str
    last_name: str
    email: str
    profile_image: str
    user_status: str
    hashed_password: str

    #sets up extra configuration for this class
    class Config:
        orm_mode = True
    

#inherits from UserBase
class User(CreateUser):
    user_id: int
    
    class Config:
        orm_mode = True


#One time pin schema
class Otp(BaseModel):
    email: str

#verify OTP Schema
class VerifyOtp(Otp):
    otp: int
    request_type: str

#reset password schema
class ResetPassword(Otp):
    otp: int
    password: str

#change authenticated user password
class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str


