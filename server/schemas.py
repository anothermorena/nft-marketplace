#1. This file contains pydantic models/schemas
#=============================================

#2. import required modules and packages
#=======================================
from pydantic import BaseModel
from typing import Optional,List

class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    profile_image: Optional[str] = None
    user_status: str  

#3. required fields when creating a user
#=======================================
class CreateUser(UserBase):
    hashed_password: str

    class Config:
        orm_mode = True

#4. info sent back with user profile data
#========================================
class User(UserBase):
    user_id: int
    
    class Config:
        orm_mode = True


#5. required fields when creating a one time pin
#===============================================
class Otp(BaseModel):
    email: str

#6. required fields to verify an otp
#===================================
class VerifyOtp(Otp):
    otp: int
    request_type: str

#7. required fields when resetting a user password
#=================================================
class ResetPassword(Otp):
    otp: int
    password: str
    confirm_password: str

#8. required fields when changing a logged in user's password
#============================================================
class ChangePassword(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str
    
    
#9. required fields when creating an nft
#=======================================
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
        
  
#10.required fields when adding an nft to a wish list
#====================================================
class WishlistBase(BaseModel):
    nft_id : int
    user_ip_address: str
       
    
#11. required fields when viewing a users nft wish list
#======================================================
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
        
#12. required fields when bidding for an nft
#===========================================
class PlaceBid(BaseModel):
    nft_id: int
    bid_amount: float
    
    
    
    


