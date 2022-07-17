#1. load the required modules and packages
#=========================================
import fastapi
from database import engine
import passlib.hash as hash
import sqlalchemy.orm as orm
import services, schemas, models
from typing import Optional,List
import fastapi.security as security
from fastapi import HTTPException,File, UploadFile,Form

#2. create the app object
#========================
app = fastapi.FastAPI()

#3. create all our db tables
#===========================
models.Base.metadata.create_all(engine)

#4. create a user end point
#==========================
@app.post("/api/users",status_code=201)
async def create_user(user: schemas.CreateUser, db: orm.Session = fastapi.Depends(services.get_db)):
    db_user = await services.get_user_by_email(user.email, db)
 
    if db_user:
        return dict(message="Email already in use", status="FAILED", email=user.email)

    await services.create_user(user, db)
 
    otp_code = await services.create_otp(user.email,db)

    subject = "Account Created Successfully"
    body = 'Hi! Welcome to NFT Market Place. Your account verification OTP code is: ' + str(otp_code) + '.\nPlease use it to activate your account 😜.'

    email_status = await services.send_email_async(subject, user.email, body)

    return email_status

#5. send otp end point
#=====================
@app.post("/api/send_otp",status_code=200)
async def send_otp(otp_request: schemas.Otp, db: orm.Session = fastapi.Depends(services.get_db)):
   db_user = await services.get_user_by_email(otp_request.email, db)

   if not db_user:
       return dict(status_code=404,message="User with that email address does not exist", status="FAILED")

   otp_code = await services.create_otp(otp_request.email,db)
   subject = "New OTP"
   body = 'Your OTP code is: ' + str(otp_code)
   email_status = await services.send_email_async(subject, otp_request.email, body)
   
   return email_status


#6. verify account end point
#===========================
@app.patch("/api/verify_otp", status_code=200)
async def verify_otp(user: schemas.VerifyOtp, db: orm.Session = fastapi.Depends(services.get_db)):
    db_user = await services.get_user_by_email(user.email, db)
    if not db_user:
        return dict(message="Invalid email or otp.", status="FAILED")
    
    otp = await services.get_otp_by_email(user.email, user.otp, db)

    if not otp:
         return dict(message="The provided OTP is invalid. Please try again.", status="FAILED")
   
    if user.request_type == "RESET_PASSWORD_REQUEST":
        return dict(message="OTP and user verification successful. Proceed to reset your password.", status="SUCCESS")

    if db_user.user_status == "UNVERIFIED":
        db_user.user_status = "VERIFIED"
        db.commit()
        db.refresh(db_user)

        await services.delete_otp(user.email, db)

        return dict(message="User account verification successful.", status="SUCCESS")

    return dict(message="User account already verified.", status="SUCCESS")
            

#7. user login end point
#=======================
@app.post("/api/login",status_code=200)
async def user_login(form_data: security.OAuth2PasswordRequestForm = fastapi.Depends(), db: orm.Session = fastapi.Depends(services.get_db)):
    user = await services.authenticate_user(form_data.username, form_data.password, db)
    return await services.create_token(user,db)

#8. reset password end point
#===========================
@app.patch("/api/reset_password", status_code=200)
async def reset_password(reset_pass: schemas.ResetPassword, db: orm.Session = fastapi.Depends(services.get_db)):
    db_user = await services.get_user_by_email(reset_pass.email, db)
    if not db_user:
       return dict(message="Invalid email or otp.", status="FAILED")

    otp = await services.get_otp_by_email(reset_pass.email, reset_pass.otp, db)

    if not otp:
        return dict(message="The provided OTP is invalid. Please try again.", status="FAILED")
    
    if reset_pass.password != reset_pass.confirm_password:
        return dict(message="Your passwords do not match", status="FAILED")
  
    await services.new_password(reset_pass.password,db_user,db)

    await services.delete_otp(reset_pass.email, db)

    return dict(message="Your password was reset successfully. You may now log into your account 🙃", status="SUCCESS")


#9. change authenticated user password end point
#===============================================
@app.patch("/api/change_password/",status_code=200)
async def change_password(change_password: schemas.ChangePassword, current_user:schemas.User = fastapi.Depends(services.get_current_user), db: orm.Session = fastapi.Depends(services.get_db)):
    db_user = await services.get_user_by_email(current_user.email, db)
 
    if not db_user:
        return dict(status_code=404, message="User not found", status="FAILED")

    if not hash.bcrypt.verify(change_password.current_password, db_user.hashed_password):
        return dict(message="Your current password is incorrect", status="FAILED")

    if change_password.new_password != change_password.confirm_password:
        return dict(message="Your passwords do not match", status="FAILED")

    await services.new_password(change_password.new_password,db_user,db)

    return dict(message="Successfully Updated", status="SUCCESS")


#10. update user profile end point
#=================================
@app.patch("/api/update_profile_details/",status_code=200)
async def update_profile_details(first_name: str = Form(), last_name: str = Form(), profile_image: Optional[UploadFile] = File(None),current_user:schemas.User = fastapi.Depends(services.get_current_user), db: orm.Session = fastapi.Depends(services.get_db)): 
    db_user = await services.get_user_by_email(current_user.email, db)
 
    if not db_user:
        return dict(status_code=404, message="User not found", status="FAILED")

    if not profile_image:
        #10.1. user did not upload an image: update first name and last name with incoming values 
        #======================================================================================== 
        db_user.first_name = first_name
        db_user.last_name = last_name
        db.commit()
        db.refresh(db_user)
        
        return dict(message="Successfully Updated", status="SUCCESS", data=db_user)
    
    #10.2. user uploaded an image
    #===========================
    if profile_image.content_type not in ['image/jpg','image/jpeg', 'image/png']:
        raise HTTPException(status_code=406, detail="Only .jpeg or .png  files allowed")     
    
    #10.3. upload the image to cloudinary
    #====================================
    result = services.upload_image(profile_image.file,profile_image.filename,unique_filename=False, overwrite=True)
        
    profile_image_url = result.get("secure_url")

    db_user.first_name = first_name
    db_user.last_name = last_name
    db_user.profile_image = profile_image_url
    db.commit()
    db.refresh(db_user)

    return dict(message="Successfully Updated", status="SUCCESS", data=db_user)


#11. create nft end point
#========================
@app.post("/api/create_nft/",status_code=201)
async def create_nft(nft_title: str = Form(), nft_description: str = Form(),nft_image: UploadFile = File(...),nft_price: float = Form(),bidding_deadline: str = Form(),current_user:schemas.User = fastapi.Depends(services.get_current_user), db: orm.Session = fastapi.Depends(services.get_db)): 
    db_user = await services.get_user_by_email(current_user.email, db)
 
    if not db_user:
        return dict(status_code=404, message="User not found", status="FAILED")
    
    if nft_image.content_type not in ['image/jpg','image/jpeg', 'image/png']:
        raise HTTPException(status_code=406, detail="Only .jpeg or .png  files allowed")     
    
    result = services.upload_image(nft_image.file,nft_image.filename,unique_filename=False, overwrite=True)
        
    nft_image_url = result.get("secure_url")
    
    #11.1. convert the nft data to a dictionary
    #==========================================
    nft_data = {
        "nft_title": nft_title,
        "nft_description": nft_description,
        "nft_image": nft_image_url,
        "nft_price": nft_price,
        "bidding_deadline": bidding_deadline
    }

    created_nft = await services.create_nft(user=db_user, db=db, nft_data=nft_data)

    return dict(message="Successfully created Nft", status="SUCCESS", data=created_nft)


#12. fetch nfts from the database
#================================
@app.get("/api/nfts/", response_model=List[schemas.Nft],status_code=200)
async def get_nfts(db: orm.Session = fastapi.Depends(services.get_db)):
    nfts = await services.get_nfts(db=db)
    
    #12.1 get each nft's creator
    #===========================
    await services.get_creator(nfts,db)
    
    await services.get_nft_bidder_details(nfts,db)
    
    return nfts


#13. add  nft to users wishlist api end point
#===========================================
@app.post("/api/add_nft_to_wish_list/",status_code=201)
async def add_nft_to_wish_list(wishlist: schemas.WishlistBase,db: orm.Session = fastapi.Depends(services.get_db)):
    nft = await services.check_wish_list_for_nft(wishlist.user_ip_address, wishlist.nft_id, db)
    
    if nft:
        return dict(message="This nft already in your wish list. 😒", status="FAILED") 
    
    await services.add_nft_to_wish_list(wishlist.user_ip_address, wishlist.nft_id, db)
    
    return dict(message="Nft was successfully added to your wish list. 😋", status="SUCCESS")


#14. fetch users nft wishlist  from the database
#===============================================
@app.get("/api/get_users_wish_list/", response_model=List[schemas.WishList],status_code=200)
async def get_users_wish_list(user_ip_address: str, db: orm.Session = fastapi.Depends(services.get_db)):
    wishlist = await services.get_users_wish_list(user_ip_address=user_ip_address,db=db)
    await services.get_nft_details(wishlist,db)
    await services.get_creator(wishlist,db)
    return wishlist


#15. delete nft from users wishlist
#==================================
@app.delete("/api/delete_nft_from_users_wish_list/", status_code=204)
async def delete_nft_from_users_wish_list(nft: schemas.WishlistBase, db: orm.Session = fastapi.Depends(services.get_db)):
    await services.delete_nft_from_users_wish_list(nft.nft_id, nft.user_ip_address, db)
 
  
#16. place  bid api end
#======================
@app.post("/api/place_bid/",status_code=201)
async def place_bid(bid: schemas.PlaceBid,current_user:schemas.User = fastapi.Depends(services.get_current_user), db: orm.Session = fastapi.Depends(services.get_db)): 
    db_user = await services.get_user_by_email(current_user.email, db)
 
    if not db_user:
        return dict(status_code=404, message="User not found", status="FAILED")
    
    db_nft = await services.get_nft_by_id(bid.nft_id, db)
    
    if not db_nft:
        return dict(status_code=404, message="Nft not found.", status="FAILED")
    
    #16.1 check if user is not bidding on thier own nft
    #==================================================
    if db_nft.user_id ==  db_user.user_id:

        return dict(status_code=405, message="You cannot bid on your own nft.", status="FAILED")

    await services.create_nft_bid(user_id=db_user.user_id, nft_id=bid.nft_id, bid_amount=bid.bid_amount,db=db)
    
    return dict(message="Your bid was successfully placed", status="SUCCESS")


#17. fetch users nft wishlist count
#==================================
@app.get("/api/get_users_wish_list_count/",status_code=200)
async def get_users_wish_list(user_ip_address: str, db: orm.Session = fastapi.Depends(services.get_db)):
    wish_list_nft_count = await services.count_nfts_in_users_wish_list(user_ip_address=user_ip_address,db=db)
    return dict(wish_list_nft_count=wish_list_nft_count, status="SUCCESS")
