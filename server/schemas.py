#This file contains pydantic models/schemas
#import required modules or packages
from pydantic import BaseModel
from typing import Optional,List

#CreateUser is the info we will be sending when creating a user
class CreateUser(BaseModel):
    first_name: str
    last_name: str
    email: str
    profile_image: Optional[str] = None
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
    
    
#view nft schema
class Nft(BaseModel):
    nft_id : int
    user_id: int 
    nft_title: str 
    nft_description: str 
    nft_image: str
    nft_price: float 
    bidding_deadline: str 
    creator : Optional[str] = None
    bids : Optional[List] = None
    
    class Config:
        orm_mode = True
        
  
#wishlist schema
class WishlistBase(BaseModel):
    nft_id : int
    user_ip_address: str
       
    
#view wishlist schema
class WishList(BaseModel):
    nft_id : int
    user_id: Optional[int] = None 
    nft_title: Optional[str] = None
    nft_description: Optional[str] = None 
    nft_image: Optional[str] = None
    nft_price: Optional[str] = None
    bidding_deadline: Optional[str] = None 
    creator : Optional[str] = None
    
    class Config:
        orm_mode = True
    
    
    


