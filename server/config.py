#import required modules or packages
import os
from dotenv import load_dotenv

# load environment variables from .env
load_dotenv('./../.env')

#create environment variables configuration class 
class Envs:
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = int(os.getenv('DB_PORT'))
    DB_NAME = os.getenv('DB_NAME')

