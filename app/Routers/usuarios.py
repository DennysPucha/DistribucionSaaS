from fastapi import APIRouter, Depends
from app.Model.usuario import Usuario
from app.Services.usuario_service import crear_usuario
from sqlalchemy.orm import Session
from app.Core.get_db import get_db


router = APIRouter()


@router.get("/")
def listar_usuarios(db: Session = Depends(get_db)): 
    return db.query(Usuario).all()

@router.post("/")
def registrar_usuario(usuario: Usuario):
    return crear_usuario(usuario)

