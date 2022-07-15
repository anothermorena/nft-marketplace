#1. load the required modules and packages
#=========================================
import jwt
import random
import fastapi
import cloudinary
import models, schemas 
import cloudinary.uploader
import passlib.hash as hash
import sqlalchemy.orm as orm
from database import SessionLocal
import fastapi.security as security
from config import email_conf, Envs
from fastapi_mail import FastMail, MessageSchema

#2. we use oauth to issue a token when a user logs in
#====================================================
oauth2schema = security.OAuth2PasswordBearer(tokenUrl="/api/login")

#3. screct to be used when encoding and generating the token
#===========================================================
JWT_SECRET = Envs.SECRET

#4. create a local database session
#==================================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#5. get a user by a given email
#==============================
async def get_user_by_email(email: str, db: orm.Session):
    return db.query(models.User).filter(models.User.email == email).first()

#6. get an otp by a given email
#==============================
async def get_otp_by_email(email: str, otp: int, db: orm.Session):
    return db.query(models.Otp).filter(models.Otp.email == email).filter(models.Otp.code == otp).first()


#7. create a new user
#====================
async def create_user(user: schemas.CreateUser, db: orm.Session):
    user_obj = models.User(first_name= user.first_name,last_name= user.last_name,email=user.email, profile_image = "", user_status= "UNVERIFIED", hashed_password= hash.bcrypt.hash(user.hashed_password))  
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)


#8. delete an existing one time pin before creating another one
#==============================================================
async def delete_otp(email:str, db: orm.Session):
    old_otp = (db.query(models.Otp).filter(models.Otp.email == email) .first())
    
    if old_otp:
        db.delete(old_otp)
        db.commit()

    return "SUCCESS"


#9. creates a user's one time pin for account verification and password reset
#============================================================================
async def create_otp(email:str, db: orm.Session):
    delete_old_otp = await delete_otp(email,db)

    if delete_old_otp:
        new_otp = random.randint(1000,9999)
        otp_obj = models.Otp(code = new_otp, email = email)
        db.add(otp_obj)
        db.commit()
        db.refresh(otp_obj)
        
        return new_otp

#10. sends emails to the user
#============================
async def send_email_async(subject: str, email_to: str, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype='html',
    )
    
    fm = FastMail(email_conf)
    await fm.send_message(message, template_name='email.html')    
    return dict(message="Email sent successfully", status="SUCCESS", email= email_to)

#11. authenticate the user
#=========================
async def authenticate_user(email: str, password: str, db: orm.Session):
    user = await get_user_by_email(email=email, db=db)
    if not user:
        return dict(message="Username or password incorrect", status="FAILED")

    if not user.verify_password(password):
        return dict(message="Username or password incorrect", status="FAILED")

    return user


#12. create a new user password and stores it to the db
#======================================================
async def new_password(password:str, current_user:dict, db: orm.Session):      
    new_hashed_password = hash.bcrypt.using(rounds=13).hash(password)
    current_user.hashed_password = new_hashed_password
    db.commit()
    db.refresh(current_user)


#13. create a token
#==================
async def create_token(user: models.User,db: orm.Session):
    #13.1. take in our user model and map it to a user schema e.g. id->id
    #====================================================================
    user_obj = schemas.User.from_orm(user)

    #13.2. create the auth access token 
    #==================================
    token = jwt.encode(user_obj.dict(), JWT_SECRET)
    
    #13.3. count users nfts
    #======================
    user_nft_count = await count_users_nfts(user_obj.user_id, db)

    #13.4. send this token when a user needs to access any area in our app that requires authentication
    #==================================================================================================
    return dict(access_token=token,user=user_obj, nft_count=user_nft_count, status="SUCCESS", message="User was successfully authenticated")


#14. get the current logged in user
#==================================
async def get_current_user(db: orm.Session = fastapi.Depends(get_db), token: str = fastapi.Depends(oauth2schema)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=Envs.ALGORITHM)
        user = db.query(models.User).get(payload["user_id"])
    except:
        raise fastapi.HTTPException(status_code=401, detail="Invalid Email or Password")

    return schemas.User.from_orm(user)


#15. upload images to cloudinary
#===============================
def upload_image(image,image_name,unique_filename=False, overwrite=True):
  return cloudinary.uploader.upload(image, public_id=image_name, unique_filename = unique_filename, overwrite=overwrite)

#16. create a new nft
#====================
async def create_nft(user: schemas.User, nft_data: dict, db: orm.Session):
    nft = models.Nft(**nft_data, user_id=user.user_id) #** means unpacks the values contained in the nft dictionary. It is simillar to destructuring in JS
    db.add(nft)
    db.commit()
    db.refresh(nft)

    return schemas.Nft.from_orm(nft)


#17. get all nfts in the database
#================================
async def get_nfts(db: orm.Session):
    nfts = db.query(models.Nft)
    
    #the map functions, maps each of our nfts. 
    # It basically saves us from writing a for loop where we will have to go through each nft and turns it into an nft schema object. 
    # Its simillar to map in JS
    return list(map(schemas.Nft.from_orm, nfts))

#18. get nft creator
#===================
async def get_creator(nfts:list, db: orm.Session):
    for nft in nfts:
        nft_creator =  db.query(models.User).filter(models.User.user_id == nft.user_id).first()
        nft_creator_full_name = nft_creator.first_name + " " + nft_creator.last_name
        nft.creator = nft_creator_full_name
        
#19. get nft details
#===================
async def get_nft_details(nfts:list, db: orm.Session):
    for nft in nfts:
        nft_details =  db.query(models.Nft).filter(models.Nft.nft_id == nft.nft_id).first()
        nft.nft_title = nft_details.nft_title
        nft.nft_description = nft_details.nft_description
        nft.nft_image = nft_details.nft_image
        nft.nft_price = nft_details.nft_price
        nft.bidding_deadline = nft_details.bidding_deadline
        nft.user_id = nft_details.user_id 
        
    
#20. get nft bidder details
#==========================
async def get_nft_bidder_details(nfts:list, db: orm.Session):
    for nft in nfts:
        #20.1. only run this for loop if an nft has bid(s)
        #=================================================
            for bid in nft.bids:
                if bid is not None:
                    nft_bidder =  db.query(models.User).filter(models.User.user_id == bid.user_id).first()
                    nft_bidder_full_name = nft_bidder.first_name + " " + nft_bidder.last_name
                    bid.bidder = nft_bidder_full_name
                    bid.bidder_image = nft_bidder.profile_image

   
#21. check if nft exists in users wish list
#==========================================
async def check_wish_list_for_nft(user_ip_address: str, nft_id:int, db: orm.Session):
    return db.query(models.Wishlist).filter(models.Wishlist.user_ip_address == user_ip_address).filter(models.Wishlist.nft_id == nft_id).first()

#22. add nft to users wish list
#==============================
async def add_nft_to_wish_list(user_ip_address: str, nft_id:int, db: orm.Session):
    wishlist_obj = models.Wishlist(user_ip_address = user_ip_address, nft_id = nft_id)
    db.add(wishlist_obj)
    db.commit()
    db.refresh(wishlist_obj)
    
#23. get users nft wishlist
#==========================
async def get_users_wish_list(user_ip_address:str, db: orm.Session):
    wishlist = db.query(models.Wishlist).filter(models.Wishlist.user_ip_address == user_ip_address)
    return list(map(schemas.WishList.from_orm, wishlist))


#24. get the nft in the wishlist
#===============================
async def nft_selector(nft_id: int, user_ip_address: str, db: orm.Session):
    wishlist_item = (db.query(models.Wishlist)
        .filter_by(user_ip_address=user_ip_address) #gets all the lead by the specified user first
        .filter(models.Wishlist.nft_id == nft_id) #from the returned wishlist, return the one with the specified ID
        .first() 
    )

    if wishlist_item is None:
        raise fastapi.HTTPException(status_code=404, detail="Nft not found in the users wish list")

    return wishlist_item

#25. delete nft from users wish list
#===================================
async def delete_nft_from_users_wish_list(nft_id: int, user_ip_address: str, db: orm.Session):
    nft_to_delete = await nft_selector(nft_id, user_ip_address, db)
    db.delete(nft_to_delete)
    db.commit()  
    
#26. get nft by id
#=================
async def get_nft_by_id(nft_id: int, db: orm.Session):
    return db.query(models.Nft).filter(models.Nft.nft_id == nft_id).first()


#27. add nft bid to db
#====================
async def create_nft_bid(user_id: int, nft_id:int, bid_amount: float, db: orm.Session):
    bid_obj = models.Bid(user_id = user_id, nft_id = nft_id,bid_amount=bid_amount)
    db.add(bid_obj)
    db.commit()
    db.refresh(bid_obj)
    
#28. count users nfts
#====================
async def count_users_nfts(user_id: int, db: orm.Session):
    return db.query(models.Nft).filter(models.Nft.user_id == user_id).count()

#29. count nfts in users wish list
#================================
async def count_nfts_in_users_wish_list(user_ip_address: str, db: orm.Session):
    return db.query(models.Wishlist).filter(models.Wishlist.user_ip_address == user_ip_address).count()
   





 









