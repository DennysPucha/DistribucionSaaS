from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.Core.get_db import get_db
from app.Services import oferta_licencia_service
from app.Schemas import oferta_licencia_schema

router = APIRouter(prefix="/ofertas-licencia", tags=["Ofertas de Licencia"])

@router.post("/", response_model=oferta_licencia_schema.OfertaLicenciaResponse, status_code=status.HTTP_201_CREATED)
def create_oferta_licencia(oferta_licencia: oferta_licencia_schema.OfertaLicenciaCreate, db: Session = Depends(get_db)):
    try:
        new_oferta_licencia = oferta_licencia_service.create_oferta_licencia(db, oferta_licencia)
        if not new_oferta_licencia:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear la oferta de licencia")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al crear oferta de licencia: {str(e)}")
    return {"oferta_licencia": new_oferta_licencia, "code": status.HTTP_201_CREATED, "message": "Oferta de licencia creada correctamente"}

@router.get("/", response_model=oferta_licencia_schema.OfertaLicenciaListResponse, status_code=status.HTTP_200_OK)
def read_ofertas_licencia(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    try:
        ofertas_licencia = oferta_licencia_service.get_ofertas_licencia(db, skip=skip, limit=limit)
        if not ofertas_licencia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron ofertas de licencia")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al listar ofertas de licencia: {str(e)}")
    return {"ofertas_licencia": ofertas_licencia, "code": status.HTTP_200_OK, "message": "Ofertas de licencia listadas correctamente"}

@router.get("/{oferta_licencia_id}", response_model=oferta_licencia_schema.OfertaLicenciaResponse)
def read_oferta_licencia(oferta_licencia_id: int, db: Session = Depends(get_db)):
    try:
        oferta_licencia = oferta_licencia_service.get_oferta_licencia(db, oferta_licencia_id=oferta_licencia_id)
        if not oferta_licencia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al obtener oferta de licencia: {str(e)}")
    return {"oferta_licencia": oferta_licencia, "code": status.HTTP_200_OK, "message": "Oferta de licencia obtenida correctamente"}

@router.delete("/{oferta_licencia_id}", response_model=oferta_licencia_schema.OfertaLicenciaResponse)
def deactivate_oferta_licencia(oferta_licencia_id: int, db: Session = Depends(get_db)):
    try:
        oferta_licencia = oferta_licencia_service.deactivate_oferta_licencia(db, oferta_licencia_id)
        if not oferta_licencia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al desactivar oferta de licencia: {str(e)}")
    return {"oferta_licencia": oferta_licencia, "code": status.HTTP_200_OK, "message": "Oferta de licencia desactivada correctamente"}


@router.get("/usuario/{usuario_id}", response_model=oferta_licencia_schema.OfertaLicenciaListResponse)
def read_ofertas_licencia_by_user(usuario_id: int, db: Session = Depends(get_db)):
    try:
        ofertas_licencia = oferta_licencia_service.get_oferta_licencia_by_user_id(db, usuario_id=usuario_id)
        if not ofertas_licencia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron ofertas de licencia para este usuario")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al obtener ofertas de licencia por usuario: {str(e)}")
    return {"ofertas_licencia": ofertas_licencia, "code": status.HTTP_200_OK, "message": "Ofertas de licencia obtenidas correctamente"}


@router.put("/{oferta_licencia_id}", response_model=oferta_licencia_schema.OfertaLicenciaResponse)
def update_oferta_licencia(oferta_licencia_id: int, oferta_licencia: oferta_licencia_schema.OfertaLicenciaCreate, db: Session = Depends(get_db)):
    try:
        updated_oferta_licencia = oferta_licencia_service.update_oferta_licencia(db, oferta_licencia_id=oferta_licencia_id, oferta_licencia_data=oferta_licencia)
        if not updated_oferta_licencia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al actualizar oferta de licencia: {str(e)}")
    return {"oferta_licencia": updated_oferta_licencia, "code": status.HTTP_200_OK, "message": "Oferta de licencia actualizada correctamente"}

@router.delete("/{oferta_licencia_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_oferta_licencia(oferta_licencia_id: int, db: Session = Depends(get_db)):
    try:
        result = oferta_licencia_service.delete_oferta_licencia(db, oferta_licencia_id=oferta_licencia_id)
        if not result:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al eliminar oferta de licencia: {str(e)}")
    return {"code": status.HTTP_204_NO_CONTENT, "message": "Oferta de licencia eliminada correctamente"}

@router.get("/nombre/{nombre_saas}", response_model=oferta_licencia_schema.OfertaLicenciaResponse)
def read_oferta_licencia_by_name(nombre_saas: str, db: Session = Depends(get_db)):
    try:
        oferta_licencia = oferta_licencia_service.get_oferta_licencia_by_name(db, nombre_saas=nombre_saas)
        if not oferta_licencia:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise Exception(f"Error al obtener oferta de licencia por nombre: {str(e)}")
    return {"oferta_licencia": oferta_licencia, "code": status.HTTP_200_OK, "message": "Oferta de licencia obtenida correctamente"}