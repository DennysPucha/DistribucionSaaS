from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.Schemas.auth_schema import LoginWeb3Request, LoginWeb3Response
from app.Services.auth_service import login_with_wallet
from app.Services import nonce_service
from app.Core.get_db import get_db

router = APIRouter(prefix="/auth", tags=["Autenticación"])

@router.post("/request-nonce")
def request_nonce(address_request: dict, db: Session = Depends(get_db)):
    """
    Paso 1: El cliente solicita un nonce para una dirección de wallet.
    El nonce se genera y se guarda en la base de datos.
    """
    address = address_request.get("address")
    if not address:
        raise HTTPException(status_code=400, detail="La dirección (address) es requerida.")
    
    # Genera y guarda el nonce en la base de datos
    nonce = nonce_service.create_or_update_nonce(db, address=address)
    return {"nonce": nonce}

@router.post("/login", response_model=LoginWeb3Response)
def login(data: LoginWeb3Request, db: Session = Depends(get_db)):
    """
    Paso 2: El cliente envía la firma del nonce para autenticarse.
    """
    # 1. Recupera y elimina el nonce de la BD para asegurar que solo se use una vez
    db_nonce = nonce_service.get_and_delete_nonce(db, address=data.address, received_nonce=data.nonce)

    print(f"db_nonce: {db_nonce}")
    if not db_nonce:
        print("Nonce no encontrado o ya utilizado.")
    else:
        print(f"Nonce encontrado: {db_nonce.nonce}")

    print(f"Verificando login: address={data.address}, nonce={data.nonce}")
    
    if not db_nonce:
        raise HTTPException(
            status_code=401, 
            detail="Nonce inválido, no encontrado o expirado. Por favor, solicita uno nuevo."
        )

    # 2. Verifica la firma usando el nonce que estaba en la BD
    token = login_with_wallet(data.address, data.signature, db_nonce.nonce, db)
    if not token:
        raise HTTPException(status_code=401, detail="Firma inválida.")
        
    return {"access_token": token, "token_type": "bearer"}
