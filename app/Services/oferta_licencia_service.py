from sqlalchemy.orm import Session
from app.Model.oferta_licencia import OfertaLicencia
from app.Schemas.oferta_licencia_schema import OfertaLicenciaCreate
from fastapi import HTTPException, status

def get_oferta_licencia(db: Session, oferta_licencia_id: int):
    return db.query(OfertaLicencia).filter(OfertaLicencia.id == oferta_licencia_id).first()

def get_ofertas_licencia(db: Session, skip: int = 0, limit: int = 100):
    return db.query(OfertaLicencia).offset(skip).limit(limit).all()

def create_oferta_licencia(db: Session, oferta_licencia: OfertaLicenciaCreate):
    db_oferta_licencia = OfertaLicencia(**oferta_licencia.dict())
    db.add(db_oferta_licencia)
    db.commit()
    db.refresh(db_oferta_licencia)
    return db_oferta_licencia
