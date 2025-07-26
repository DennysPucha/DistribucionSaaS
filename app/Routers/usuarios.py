from fastapi import APIRouter, Depends, HTTPException, status
from app.Schemas.usuario_schema import UsuarioCreate, UsuarioCompletarPerfil, UsuarioResponse
from app.Services import usuario_service
from sqlalchemy.orm import Session
from app.Core.get_db import get_db

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])



@router.post("/", response_model=UsuarioCreate, status_code=status.HTTP_201_CREATED)
def registrar_usuario(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    try:
        nuevo_usuario = usuario_service.crear_usuario(db, usuario)
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
        usuarios = usuario_service.obtener_usuarios(db)
        if not usuarios:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron usuarios")
    
    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise Exception(f"Error al listar usuarios: {str(e)}")
    
    return {"usuarios": usuarios, "code": status.HTTP_200_OK, "message": "Usuarios listados correctamente"}

@router.post("/completar-perfil/{usuario_id}", response_model=UsuarioResponse, status_code=status.HTTP_200_OK)
def completar_perfil_user(usuario_id: int, datos_perfil: UsuarioCompletarPerfil, db: Session = Depends(get_db)):
    try:
        usuario_actualizado = usuario_service.completar_perfil(db, usuario_id, datos_perfil)
        if not usuario_actualizado:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise Exception(f"Error al completar perfil: {str(e)}")
    
    return {"usuario": usuario_actualizado, "code": status.HTTP_200_OK, "message": "Perfil completado correctamente"}

@router.get("/{usuario_id}", response_model=UsuarioResponse, status_code=status.HTTP_200_OK)
def obtener_usuario(usuario_id: int, db: Session = Depends(get_db)):
    try:
        usuario = usuario_service.obtener_usuario(db, usuario_id)
        if not usuario:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    except HTTPException as http_exc:
        raise http_exc

    except Exception as e:
        raise Exception(f"Error al obtener usuario: {str(e)}")
    
    return {"usuario": usuario, "code": status.HTTP_200_OK, "message": "Usuario obtenido correctamente"}
