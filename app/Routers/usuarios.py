from fastapi import APIRouter, Depends, HTTPException, status
from app.Schemas.usuario_schema import UsuarioCreate
from app.Services.usuario_service import crear_usuario, obtener_usuarios
from sqlalchemy.orm import Session
from app.Core.get_db import get_db

router = APIRouter()

@router.post("/", response_model=UsuarioCreate, status_code=status.HTTP_201_CREATED)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        nuevo_usuario = crear_usuario(db, usuario)
        if not nuevo_usuario:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el usuario")
    
    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise Exception(f"Error al registrar usuario: {str(e)}")
    
    return {"usuario": nuevo_usuario, "code": status.HTTP_201_CREATED, "message": "Usuario creado correctamente"}

@router.get("/", response_model=list[UsuarioCreate], status_code=status.HTTP_200_OK)
def listar_usuarios(db: Session = Depends(get_db)):
    try:
        usuarios = obtener_usuarios(db)
        if not usuarios:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron usuarios")
    
    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise Exception(f"Error al listar usuarios: {str(e)}")
    
    return {"usuarios": usuarios, "code": status.HTTP_200_OK, "message": "Usuarios listados correctamente"}