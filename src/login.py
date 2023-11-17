from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class LoginData(BaseModel):
    email: str
    password: str


@app.post('/fastapi-endpoint')
def authenticate_user(login_data: LoginData):
    email = login_data.email
    password = login_data.password
    print(email)

    if email == "65011368@kmitl.ac.th" and password == "1234":
        return {"Successful"}
    else:
        return {"Failed"}