'''from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ZODB, ZODB.FileStorage
import persistent
import BTrees.OOBTree
import transaction

app = FastAPI()

class LoginData(BaseModel):
    email: str
    password: str
    
class SignupData(BaseModel):
    email: str
    password: str
    username: str
    
storage = ZODB.FileStorage.FileStorage('mydata.fs')
db = ZODB.DB(storage)
connection = db.open()
root = connection.root

class User(persistent.Persistent):
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password
        
    def printUserInfo(self):
        print("Username: ",self.username)
        print("Email: ", self.email)
        print("Password: ", self.password)
        
    
        
root.User = BTrees.OOBTree.BTree()


root.users = {}
    
# Configure CORS to allow requests from your frontend origin (http://127.0.0.1:5500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/submit')
def submit_form(data: LoginData):
    
    print("Log in successful")
    # Log the received data
    print(f"Received form data: {data}")
    # Your existing code
    return {"message": "Form data received successfully"}

@app.post('/signUp')
async def signUp_form(data: SignupData):
        print("Sign up successful")
        # Log the received data
        print(f"Received form data: {data}")
        if data.email not in root.users:
            user = User(data.username, data.email, data.password)
            root.User[data.email] = user
            root.users[data.email] = user
            print("User added successfully.")
        else:
            print("User with the same email already exists.")

        return {"message": "Sign up successful"}

@app.get('/')
def read_main():
    users = root.users
    print(users)
    return {'gg'}

if root.users:
    for email, user in root.users.items():
        print("User Email:", email)
        print("User Username:", user.username)
        print("User Password:", user.password)
else:
    print("No users in the database")

transaction.commit()


    '''
    
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

app = FastAPI()

# SQLAlchemy database connection (SQLite)
DATABASE_URL = "sqlite:///mydata.db"
engine = create_engine(DATABASE_URL)

# SQLAlchemy model
Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# SQLAlchemy session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Configure CORS to allow requests from your frontend origin (http://127.0.0.1:5500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginData(BaseModel):
    email: str
    password: str

class SignupData(BaseModel):
    email: str
    password: str
    username: str

@app.post('/submit')
def submit_form(data: LoginData):
    with SessionLocal() as session:
        print(f"Received login data: {data}")
        '''user = session.query(User).filter(User.email == data.email, User.password == data.password).first()
        if user:
            print("Login successful")
            return {"message": "Login successful"}
        else:
            print("Login failed: User not found or incorrect credentials")
            raise HTTPException(status_code=400, detail="Login failed: User not found or incorrect credentials")'''



@app.post('/signUp')
def signUp_form(data: SignupData):
    with SessionLocal() as session:
        print(f"Recieved Sign in data: {data}")
        existing_user = session.query(User).filter(User.email == data.email).first()
        if existing_user:
            print("User with the same email already exists.")
            raise HTTPException(status_code=400, detail="User with the same email already exists")
        
        user = User(username=data.username, email=data.email, password=data.password)
        session.add(user)
        session.commit()
        print("Sign up successful")
        return {"message": "Sign up successful"}

@app.get('/')
def read_main():
    with SessionLocal() as session:
        users = session.query(User).all()
        user_info = [{"Username": user.username, "Email": user.email, "Password": user.password} for user in users]
        print(user_info)
        return user_info

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

