from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.Core.get_db import get_db
from app.Services import transaccion_service
from app.Schemas import transaccion_schema

router = APIRouter(prefix="/transacciones", tags=["Transacciones"])

@router.get("/", response_model=transaccion_schema.TransaccionListResponse, status_code=status.HTTP_200_OK)
def read_transacciones(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        transacciones = transaccion_service.get_transacciones(db, skip=skip, limit=limit)
        if not transacciones:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron transacciones")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al listar transacciones: {str(e)}")
    return {"transacciones": transacciones, "code": status.HTTP_200_OK, "message": "Transacciones listadas correctamente"}

@router.get("/{transaccion_id}", response_model=transaccion_schema.TransaccionResponse)
def read_transaccion(transaccion_id: int, db: Session = Depends(get_db)):
    try:
        transaccion = transaccion_service.get_transaccion(db, transaccion_id=transaccion_id)
        if not transaccion:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transacción no encontrada")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al obtener transacción: {str(e)}")
    return {"transaccion": transaccion, "code": status.HTTP_200_OK, "message": "Transacción obtenida correctamente"}