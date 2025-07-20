from web3.auto import w3
from eth_account.messages import encode_defunct
from app.Core.jwt import create_access_token
from sqlalchemy.orm import Session
from app.Model.usuario import Usuario
from app.Model.rol import Rol
from web3 import Web3

def verify_signature(address: str, signature: str, nonce: str) -> bool:
    message = encode_defunct(text=nonce)
    recovered = w3.eth.account.recover_message(message, signature=signature)
    return recovered.lower() == address.lower()

def login_with_wallet(address: str, signature: str, nonce: str, db: Session):
    # 1. Verificar firma con Web3
    print("Nonce recibido:", nonce)
    print("Address recibida:", address)
    print("Signature recibida:", signature)
    message = encode_defunct(text=nonce)
    recovered_address = Web3().eth.account.recover_message(message, signature=signature)
    
    if Web3.to_checksum_address(recovered_address) != Web3.to_checksum_address(address):
        print(f"Firma verificada: {recovered_address} no coincide con {address}")
        return None

    print(f"Firma verificada: {recovered_address} coincide con {address}")

    rolUser = db.query(Rol).filter_by(nombre="Usuario").first()
    if not rolUser:
        db.add(Rol(nombre="Usuario"))
        db.commit()
        rolUser = db.query(Rol).filter_by(nombre="Usuario").first()

    # 2. Buscar o crear usuario
    user = db.query(Usuario).filter_by(direccion_wallet=address).first()
    if not user:
        user = Usuario(direccion_wallet=address, nombre=None, correo=None, rol_id=rolUser.id)
        db.add(user)
        db.commit()
        db.refresh(user)

    # 3. Crear token JWT
    token = create_access_token(data={"sub": user.id, "direccion_wallet": address})
    print(f"Token JWT creado: {token}")
    # 4. Retornar el token
    if not token:
        raise Exception("Error al crear el token JWT")
    if not isinstance(token, str):
        raise TypeError("El token JWT debe ser una cadena de texto")
    if not token:
        raise ValueError("El token JWT no puede ser vacío")

    return token
