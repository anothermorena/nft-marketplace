#1. import required modules and  packages
#========================================
import os
import cloudinary
import cloudinary.api
import cloudinary.uploader
from fastapi_mail import ConnectionConfig


#2. create environment variables configuration class 
#===================================================
class Envs:
    DB_USER = os.environ.get('DB_USER')
    DB_PASSWORD = os.environ.get('DB_PASSWORD')
    DB_HOST = os.environ.get('DB_HOST')
    DB_PORT = int(os.environ.get('DB_PORT'))
    DB_NAME = os.environ.get('DB_NAME')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_FROM = os.environ.get('MAIL_FROM')
    MAIL_PORT = int(os.environ.get('MAIL_PORT'))
    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_FROM_NAME = os.environ.get('MAIN_FROM_NAME')
    SECRET = os.environ.get('SECRET')
    ALGORITHM = os.environ.get('ALGORITHM')
    CLOUDINARY_NAME = os.environ.get('CLOUDINARY_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')
    
    
#3. setup the email server configuration
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


#4. set up clouditionary configuration: return "https" URLs by setting secure=True  
#=================================================================================
clouditionary_config = cloudinary.config(
            cloud_name= Envs.CLOUDINARY_NAME,
            api_key= Envs.CLOUDINARY_API_KEY,
            api_secret = Envs.CLOUDINARY_API_SECRET,
            secure=True
) 



