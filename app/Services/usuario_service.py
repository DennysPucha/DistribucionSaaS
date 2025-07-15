from sqlalchemy.orm import Session
from app.Model.usuario import Usuario
from app.Schemas.usuario_schema import UsuarioCreate

def crear_usuario(db: Session, usuario: UsuarioCreate):
    nuevo_usuario = Usuario(**usuario.dict())
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    return nuevo_usuario

def obtener_usuarios(db: Session):
    usuarios = db.query(Usuario).all()
    return usuarios
