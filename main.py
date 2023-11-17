from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey
from typing import List
from fastapi import HTTPException, Depends
from fastapi.templating import Jinja2Templates
import bcrypt
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import Path


app = FastAPI()
templates = Jinja2Templates(directory="templates")


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
    
    # Define a relationship to the Post model
    posts = relationship("Post", back_populates="user")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, ForeignKey("users.username"))
    content = Column(String)
    time = Column(String)
    
    # Define a relationship to the User model
    user = relationship("User", back_populates="posts")
    #comments = relationship("Comment", back_populates="post")
    
class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id"))
    username = Column(String)
    content = Column(String)
    time = Column(String)



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
    
class PostData(BaseModel):
    username: str
    content: str
    time: str
    
class CommentData(BaseModel):
    post_id: int  # Add this field to represent the associated post's ID
    username: str
    content: str
    time: str
    
class ReplyData(BaseModel):
    username: str
    content: str
    time: str

#when already sign in user try to log in 
@app.post('/submit')
def submit_form(data: LoginData):
    with SessionLocal() as session:
        print(f"Received login data: {data}")
        email = data.email
        password = data.password.encode('utf-8')
        print(f"Email: {email}, Password: {password}")
        user = session.query(User).filter(User.email == email).first()
        if user and bcrypt.checkpw(password, user.password.encode('utf-8')):
            print("Login successful")
            return {"message": "Login successful"}
        else:
            print("Login failed: User not found or incorrect credentials")
            raise HTTPException(status_code=400, detail="Login failed: User not found or incorrect credentials")

#when new users sign in
@app.post('/signUp')
def signUp_form(data: SignupData):
    with SessionLocal() as session:
        print(f"Received Sign in data: {data}")
        existing_user = session.query(User).filter(User.email == data.email).first()
        if existing_user:
            print("User with the same email already exists.")
            raise HTTPException(status_code=400, detail="User with the same email already exists")

        # Hash the password before storing it
        hashed_password = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
        
        user = User(username=data.username, email=data.email, password=hashed_password.decode('utf-8'))
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
    
#for getting username when log in so that to know username when current user create a new post    
@app.get('/get-username/{email}')
def get_username(email: str = Path(...)):
    with SessionLocal() as session:
        user = session.query(User).filter(User.email == email).first()
        if user:
            return {"username": user.username}
        else:
            raise HTTPException(status_code=404, detail="User not found")

#when user create a post in forum
@app.post('/create-post')
def create_post(post_data: PostData):
    with SessionLocal() as session:
        print(f"Recieved post data: {post_data}")
        post = Post(username=post_data.username, content=post_data.content, time=post_data.time)
        session.add(post)
        session.commit()
        print("Post stored successfully")
        return {"message": "Post created successfully"}

#to get all posts
@app.get('/get-posts')
def get_posts():
    with SessionLocal() as session:
        posts = session.query(Post).all()
        post_data = [{"id": post.id, "username": post.username, "content": post.content, "time": post.time} for post in posts]
        return post_data


#store comments in database 
@app.post('/create-comment')
def create_comment(comment_data: CommentData):
    with SessionLocal() as session:
        print(f"Recieved comment data: {comment_data}")
        comment = Comment(
            post_id=comment_data.post_id,
            username=comment_data.username,
            content=comment_data.content,
            time=comment_data.time,
        )
        session.add(comment)
        session.commit()
        return {"message": "Comment created successfully"}
    
#for retrieving comments with respecitve post_id
@app.get('/get-comments/{post_id}')
def get_comments(post_id: int):
    with SessionLocal() as session:
        comments = session.query(Comment).filter(Comment.post_id == post_id).all()
        comment_data = [{"username": comment.username, "content": comment.content, "time": comment.time} for comment in comments]
        return comment_data
    
# Delete a post by its ID and check ownership
@app.delete('/delete-post/{post_id}/{username}')
def delete_post(post_id: int, username: str):
    with SessionLocal() as session:
        post = session.query(Post).filter(Post.id == post_id).first()
        if post:
            if post.username == username:
                session.delete(post)
                session.commit()
                return {"message": "Post deleted successfully"}
            else:
                raise HTTPException(status_code=403, detail="Not authorized to delete this post")
        else:
            raise HTTPException(status_code=404, detail="Post not found")

        
# Update a post by its ID and check ownership
@app.put('/update-post/{post_id}/{username}')
def update_post(post_id: int, username: str, updated_post_data: PostData):
    with SessionLocal() as session:
        post = session.query(Post).filter(Post.id == post_id).first()
        if post:
            if post.username == username:
                post.username = updated_post_data.username
                post.content = updated_post_data.content
                post.time = updated_post_data.time
                session.commit()
                return {"message": "Post updated successfully"}
            else:
                raise HTTPException(status_code=403, detail="Not authorized to update this post")
        else:
            raise HTTPException(status_code=404, detail="Post not found")


@app.get('/profile/{username}')
def get_profile(request: Request, username: str):
    with SessionLocal() as session:
        # Retrieve user details
        user = session.query(User).filter(User.username == username).first()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Retrieve posts associated with the user
        posts = session.query(Post).filter(Post.username == username).all()

        # Convert user and posts data to dictionary
        user_data = {
            "username": user.username,
            "email": user.email,
            "password": user.password,
            "posts": [
                {"id": post.id, "content": post.content, "time": post.time}
                for post in posts
            ],
        }
        #return user_data
        return templates.TemplateResponse("profile.html", {"request": request, "user": user_data})



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

