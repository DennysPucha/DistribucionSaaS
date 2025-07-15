from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.Model.usuario import Usuario
from app.Schemas.usuario_schema import UsuarioCreate

def crear_usuario(db: Session, usuario: UsuarioCreate):
    # Verificar si el usuario ya existe
    existing_user = db.query(Usuario).filter(Usuario.correo == usuario.correo).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El usuario ya existe")
    nuevo_usuario = Usuario(**usuario.dict())
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

def obtener_usuarios(db: Session):
    usuarios = db.query(Usuario).all()
    return usuarios
