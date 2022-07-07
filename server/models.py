#import required modules and packages
import datetime as dt
import sqlalchemy as  sql
import passlib.hash as hash
from database import Base
import sqlalchemy.orm as orm

#Below we create our database tables and their columns
#1.Users Tables
class User(Base):

    #name of the table
    __tablename__ = "users"

    #create table columns
    user_id = sql.Column(sql.Integer, primary_key=True, index=True, nullable=False)
    first_name = sql.Column(sql.String(255), nullable=False)
    last_name = sql.Column(sql.String(255), nullable=False)
    email = sql.Column(sql.String(30), unique=True, index=True, nullable=False)
    profile_image = sql.Column(sql.String(255), nullable=True)
    hashed_password = sql.Column(sql.String(255), nullable=False)
    user_status = sql.Column(sql.String(255), nullable=False)
    date_created =sql.Column(sql.DateTime, default=dt.datetime.utcnow, nullable=False)
    
    
    #this function verifies the password
    def verify_password(self, password: str):
        #checks the password we sent for authentication vs the password stored in the DB
        return hash.bcrypt.verify(password, self.hashed_password)


#2.One Time Pins Table
class Otp(Base):

    #name of the table
    __tablename__ = "otps"

    #create table columns
    otp_id = sql.Column(sql.Integer, primary_key=True, index=True, nullable=False)
    code = sql.Column(sql.Integer, nullable=False)
    email = sql.Column(sql.String(30), unique=True, index=True, nullable=False)
    date_created =sql.Column(sql.DateTime, default=dt.datetime.utcnow, nullable=False)
    
    
    nfts = orm.relationship("Nft", back_populates="owner")
    
#3.Nfts Table
class Nft(Base):
    __tablename__ = "nfts"
    nft_id = sql.Column(sql.Integer, primary_key=True, index=True)
    user_id = sql.Column(sql.Integer, sql.ForeignKey("users.user_id"), index=True)
    nft_title = sql.Column(sql.String(255), nullable=False)
    nft_description = sql.Column(sql.String, nullable=False)
    nft_image = sql.Column(sql.String, index=True)
    nft_price = sql.Column(sql.Float, index=True)
    bidding_deadline = sql.Column(sql.String)
    date_created = sql.Column(sql.DateTime, default=dt.datetime.utcnow, nullable=False)
    
    owner = orm.relationship("User", back_populates="nfts")




    
    
 
    