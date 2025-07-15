from sqlalchemy.orm import Session
from app.Model.rol import Rol
from app.Schemas.rol_schema import RolCreate
from fastapi import HTTPException, status

def get_rol(db: Session, rol_id: int):
    return db.query(Rol).filter(Rol.id == rol_id).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Rol).offset(skip).limit(limit).all()

def create_rol(db: Session, rol: RolCreate):
    existing_rol = db.query(Rol).filter(Rol.nombre == rol.nombre).first()
    if existing_rol:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El rol ya existe")
    db_rol = Rol(nombre=rol.nombre)
    db.add(db_rol)
    db.commit()
    db.refresh(db_rol)
    return db_rol
