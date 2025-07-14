from pydantic import BaseModel

class LoginWeb3Request(BaseModel):
    address: str
    signature: str
    nonce: str

class LoginWeb3Response(BaseModel):
    access_token: str
    token_type: str = "bearer"
