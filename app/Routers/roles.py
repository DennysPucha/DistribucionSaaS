from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.Core.get_db import get_db
from app.Services import rol_service
from app.Schemas import rol_schema

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=rol_schema.Rol)
def create_rol(rol: rol_schema.RolCreate, db: Session = Depends(get_db)):
    return rol_service.create_rol(db=db, rol=rol)

@router.get("/", response_model=List[rol_schema.Rol])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = rol_service.get_roles(db, skip=skip, limit=limit)
    return roles

@router.get("/{rol_id}", response_model=rol_schema.Rol)
def read_rol(rol_id: int, db: Session = Depends(get_db)):
    db_rol = rol_service.get_rol(db, rol_id=rol_id)
    if db_rol is None:
        raise HTTPException(status_code=404, detail="Rol no encontrado")
    return db_rol
