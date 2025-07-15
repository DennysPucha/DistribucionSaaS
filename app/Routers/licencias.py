from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.Core.get_db import get_db
from app.Services import licencia_service
from app.Schemas import licencia_schema

router = APIRouter(prefix="/licencias", tags=["Licencias"])

@router.post("/", response_model=licencia_schema.LicenciaResponse, status_code=status.HTTP_201_CREATED)
def create_licencia(licencia: licencia_schema.LicenciaCreate, db: Session = Depends(get_db)):
    try:
        new_licencia = licencia_service.emitir_licencia(db, licencia)
        if not new_licencia:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al emitir la licencia")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al emitir licencia: {str(e)}")
    return {"licencia": new_licencia, "code": status.HTTP_201_CREATED, "message": "Licencia emitida correctamente"}

@router.get("/", response_model=licencia_schema.LicenciaListResponse, status_code=status.HTTP_200_OK)
def read_licencias(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        licencias = licencia_service.get_licencias(db, skip=skip, limit=limit)
        if not licencias:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron licencias")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al listar licencias: {str(e)}")
    return {"licencias": licencias, "code": status.HTTP_200_OK, "message": "Licencias listadas correctamente"}

@router.get("/{licencia_id}", response_model=licencia_schema.LicenciaResponse)
def read_licencia(licencia_id: int, db: Session = Depends(get_db)):
    try:
        licencia = licencia_service.get_licencia(db, licencia_id=licencia_id)
        if not licencia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Licencia no encontrada")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al obtener licencia: {str(e)}")
    return {"licencia": licencia, "code": status.HTTP_200_OK, "message": "Licencia obtenida correctamente"}

@router.put("/{licencia_id}/revocar", response_model=licencia_schema.LicenciaResponse)
def revocar_licencia_endpoint(licencia_id: int, db: Session = Depends(get_db)):
    try:
        licencia_revocada = licencia_service.revocar_licencia(db, licencia_id)
        if not licencia_revocada:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Licencia no encontrada")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al revocar licencia: {str(e)}")
    return {"licencia": licencia_revocada, "code": status.HTTP_200_OK, "message": "Licencia revocada correctamente"}