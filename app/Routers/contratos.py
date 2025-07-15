from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.Core.get_db import get_db
from app.Services import contrato_service
from app.Schemas import contrato_schema

router = APIRouter(prefix="/contratos", tags=["Contratos"])

@router.post("/", response_model=contrato_schema.ContratoResponse, status_code=status.HTTP_201_CREATED)
def create_contrato(contrato: contrato_schema.ContratoCreate, db: Session = Depends(get_db)):
    try:
        new_contrato = contrato_service.create_contrato(db, contrato)
        if not new_contrato:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el contrato")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al crear contrato: {str(e)}")
    return {"contrato": new_contrato, "code": status.HTTP_201_CREATED, "message": "Contrato creado correctamente"}

@router.get("/", response_model=contrato_schema.ContratoListResponse, status_code=status.HTTP_200_OK)
def read_contratos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        contratos = contrato_service.get_contratos(db, skip=skip, limit=limit)
        if not contratos:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron contratos")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al listar contratos: {str(e)}")
    return {"contratos": contratos, "code": status.HTTP_200_OK, "message": "Contratos listados correctamente"}

@router.get("/{contrato_id}", response_model=contrato_schema.ContratoResponse)
def read_contrato(contrato_id: int, db: Session = Depends(get_db)):
    try:
        contrato = contrato_service.get_contrato(db, contrato_id=contrato_id)
        if not contrato:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contrato no encontrado")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al obtener contrato: {str(e)}")
    return {"contrato": contrato, "code": status.HTTP_200_OK, "message": "Contrato obtenido correctamente"}
