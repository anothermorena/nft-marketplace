#here we create our interface with the DB
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import Envs

#here we create our database connection 
#DB details
DB_USER = Envs.DB_USER
DB_PASSWORD = Envs.DB_PASSWORD
DB_HOST = Envs.DB_HOST
DB_PORT = Envs.DB_PORT
DB_NAME = Envs.DB_NAME

DB_URL = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(
    DB_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


