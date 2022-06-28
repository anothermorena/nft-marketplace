#This file contains pydantic models/schemas
#import required modules or packages
from pydantic import BaseModel
from typing import Optional

#this is the parent class that we use to inherit
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    profile_image: Optional[str] = None
    user_status: str
    

#inherits from UserBase
#UserCreate is the info we will be sending when creating a user
class UserCreate(UserBase):
    hashed_password: str

    #sets up extra configuration for this class
    class Config:
        orm_mode = True


#inherits from UserBase
class User(UserBase):
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
