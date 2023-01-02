#1. import required modules and  packages
#========================================
import os
import cloudinary
import cloudinary.api
import cloudinary.uploader
from dotenv import load_dotenv
from fastapi_mail import ConnectionConfig

#2. load environment variables from .env
#=======================================
load_dotenv('./.env')

#3. create environment variables configuration class 
#===================================================
class Envs:
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = int(os.getenv('DB_PORT'))
    DB_NAME = os.getenv('DB_NAME')
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_FROM = os.getenv('MAIL_FROM')
    MAIL_PORT = int(os.getenv('MAIL_PORT'))
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_FROM_NAME = os.getenv('MAIN_FROM_NAME')
    SECRET = os.getenv('SECRET')
    ALGORITHM = os.getenv('ALGORITHM')
    CLOUDINARY_NAME = os.getenv('CLOUDINARY_NAME')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET')
    
    
#4. setup the email server configuration
#=======================================
email_conf = ConnectionConfig(
    MAIL_USERNAME=Envs.MAIL_USERNAME,
    MAIL_PASSWORD=Envs.MAIL_PASSWORD,
    MAIL_FROM=Envs.MAIL_FROM,
    MAIL_PORT=Envs.MAIL_PORT,
    MAIL_SERVER=Envs.MAIL_SERVER,
    MAIL_FROM_NAME=Envs.MAIL_FROM_NAME,
    MAIL_TLS=True,
    MAIL_SSL=False,
    USE_CREDENTIALS=True,
    TEMPLATE_FOLDER='./templates/email'
)


#5. set up clouditionary configuration: return "https" URLs by setting secure=True  
#=================================================================================
clouditionary_config = cloudinary.config(
            cloud_name= Envs.CLOUDINARY_NAME,
            api_key= Envs.CLOUDINARY_API_KEY,
            api_secret = Envs.CLOUDINARY_API_SECRET,
            secure=True
) 



