from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.Core.get_db import get_db
from app.Services import rol_service
from app.Schemas import rol_schema

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=rol_schema.RolResponse, status_code=status.HTTP_201_CREATED)
def create_rol(rol: rol_schema.RolCreate, db: Session = Depends(get_db)):
    try:
        new_rol = rol_service.create_rol(db, rol)
        if not new_rol:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el rol")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al crear rol: {str(e)}")
    return {"rol": new_rol, "code": status.HTTP_201_CREATED, "message": "Rol creado correctamente"}

@router.get("/", response_model=rol_schema.RolListResponse, status_code=status.HTTP_200_OK)
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        roles = rol_service.get_roles(db, skip=skip, limit=limit)
        if not roles:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron roles")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al listar roles: {str(e)}")
    return {"roles": roles, "code": status.HTTP_200_OK, "message": "Roles listados correctamente"}


@router.get("/{rol_id}", response_model=rol_schema.RolResponse)
def read_rol(rol_id: int, db: Session = Depends(get_db)):
    try:
        rol = rol_service.get_rol(db, rol_id=rol_id)
        if not rol:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rol no encontrado")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al obtener rol: {str(e)}")
    return {"rol": rol, "code": status.HTTP_200_OK, "message": "Rol obtenido correctamente"}