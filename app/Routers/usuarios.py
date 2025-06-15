from fastapi import APIRouter
from Model.usuario import Usuario
from Services.usuario_service import crear_usuario

router = APIRouter()

@router.post("/")
def registrar_usuario(usuario: Usuario):
    return crear_usuario(usuario)