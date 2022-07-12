#1. create our interface with the DB
#===================================
from config import Envs
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

#2. create our database connection 
#=================================
#2.1. DB details
DB_USER = Envs.DB_USER
DB_HOST = Envs.DB_HOST
DB_PORT = Envs.DB_PORT
DB_NAME = Envs.DB_NAME
DB_PASSWORD = Envs.DB_PASSWORD

DB_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(
    DB_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


