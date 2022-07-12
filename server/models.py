#1. import required modules and packages
#=======================================
import datetime as dt
from database import Base
import sqlalchemy as  sql
import passlib.hash as hash
import sqlalchemy.orm as orm

#2. below we create our database tables and their columns
#========================================================
#3. users table
#==============
class User(Base):

    #3.1. name of the table
    #======================
    __tablename__ = "users"

    #3.2. create table columns
    #=========================
    user_id = sql.Column(sql.Integer, primary_key=True, index=True, nullable=False)
    first_name = sql.Column(sql.String(255), nullable=False)
    last_name = sql.Column(sql.String(255), nullable=False)
    email = sql.Column(sql.String(30), unique=True, index=True, nullable=False)
    profile_image = sql.Column(sql.String(255), nullable=True)
    hashed_password = sql.Column(sql.String(255), nullable=False)
    user_status = sql.Column(sql.String(255), nullable=False)
    date_created =sql.Column(sql.DateTime, default=dt.datetime.utcnow, nullable=False)
    
    
    #3.3. verify the password
    #========================
    def verify_password(self, password: str):
        #3.3.1 checks the password we sent for authentication vs the password stored in the DB
        #=====================================================================================
        return hash.bcrypt.verify(password, self.hashed_password)
    
    #3.4 users table relationships
    #=============================
    nfts = orm.relationship("Nft", back_populates="user")
    bids = orm.relationship("Bid", back_populates="user")


#4. one Time Pins Table
#=====================
class Otp(Base):

    #4.1. name of the table
    #======================
    __tablename__ = "otps"

    #4.2. create table columns
    #=========================
    otp_id = sql.Column(sql.Integer, primary_key=True, index=True, nullable=False)
    code = sql.Column(sql.Integer, nullable=False)
    email = sql.Column(sql.String(30), unique=True, index=True, nullable=False)
    date_created =sql.Column(sql.DateTime, default=dt.datetime.utcnow, nullable=False)

    
#5. nfts table
#=============
class Nft(Base):
    
    #5.1. name of the table
    #======================
    __tablename__ = "nfts"
    
    #5.2. create table columns
    nft_id = sql.Column(sql.Integer, primary_key=True, index=True)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.user_id"))
    nft_title = sql.Column(sql.String(255), nullable=False)
    nft_description = sql.Column(sql.String(1000), nullable=False)
    nft_image = sql.Column(sql.String(500),nullable=False)
    nft_price = sql.Column(sql.Float, nullable=False)
    bidding_deadline = sql.Column(sql.String(255),nullable=False)
    date_created = sql.Column(sql.DateTime, default=dt.datetime.utcnow, nullable=False)
    
    #5.3. nfts table relationships
    user = orm.relationship("User", back_populates="nfts")
    bids = orm.relationship("Bid", back_populates="nfts")


#6. wish list table
#==================
class Wishlist(Base):

    #6.1. name of the table
    #======================
    __tablename__ = "wishlist"

    #6.2. create table columns
    #=========================
    wishlist_id = sql.Column(sql.Integer, primary_key=True, index=True, nullable=False)
    nft_id = sql.Column(sql.Integer, nullable=False)
    user_ip_address = sql.Column(sql.String(255), index=True, nullable=False)
    date_created =sql.Column(sql.DateTime, default=dt.datetime.utcnow, nullable=False)
    
    
    
#7. bids table
#=============
class Bid(Base):

    #7.1. name of the table
    #======================
    __tablename__ = "bids"

    #7.2. create table columns
    #=========================
    bid_id = sql.Column(sql.Integer, primary_key=True, index=True, nullable=False)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.user_id"), index=True,)
    nft_id = sql.Column(sql.Integer, sql.ForeignKey("nfts.nft_id"), index=True,)
    bid_amount = sql.Column(sql.Float,  nullable=False)
    date_created =sql.Column(sql.DateTime, default=dt.datetime.utcnow, nullable=False)
    
    #7.3. bids table relationships
    #=============================
    user = orm.relationship("User", back_populates="bids")
    nfts = orm.relationship("Nft", back_populates="bids")
    
    


    
    
 
    