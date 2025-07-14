from fastapi import APIRouter, HTTPException
from app.Schemas.auth_schema import LoginWeb3Request, LoginWeb3Response
from app.Services.auth_service import login_with_wallet

router = APIRouter(prefix="/auth", tags=["Autenticación"])

# TODO : Remplazar con un nonce real generado por el servidor

FAKE_NONCE = "LOGIN_NONCE_EXAMPLE_123"

@router.post("/login", response_model=LoginWeb3Response)
def login(data: LoginWeb3Request):
    token = login_with_wallet(data.address, data.signature, FAKE_NONCE)
    if not token:
        raise HTTPException(status_code=401, detail="Firma inválida")
    return {"access_token": token, "token_type": "bearer"}
