from sqlalchemy.orm import Session
from app.Model.oferta_licencia import OfertaLicencia
from app.Model.usuario import Usuario
from app.Schemas.oferta_licencia_schema import OfertaLicenciaCreate
from fastapi import HTTPException, status

def get_oferta_licencia(db: Session, oferta_licencia_id: int):
    return db.query(OfertaLicencia).filter(OfertaLicencia.id == oferta_licencia_id, OfertaLicencia.state == True).first()

def get_ofertas_licencia(db: Session, skip: int = 0, limit: int = 100):
    return db.query(OfertaLicencia).filter(OfertaLicencia.state == True).offset(skip).limit(limit).all()

def create_oferta_licencia(db: Session, oferta_licencia: OfertaLicenciaCreate):
    db_usuario = db.query(Usuario).filter(Usuario.id == oferta_licencia.usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    db_oferta_licencia = OfertaLicencia(**oferta_licencia.dict())
    db.add(db_oferta_licencia)
    db.commit()
    db.refresh(db_oferta_licencia)
    return db_oferta_licencia

def deactivate_oferta_licencia(db: Session, oferta_licencia_id: int):
    db_oferta_licencia = get_oferta_licencia(db, oferta_licencia_id)
    if not db_oferta_licencia:
        return None
    db_oferta_licencia.state = False
    db.commit()
    db.refresh(db_oferta_licencia)
    return db_oferta_licencia


def get_oferta_licencia_by_user_id(db: Session, usuario_id: int):
    return db.query(OfertaLicencia).filter(OfertaLicencia.usuario_id == usuario_id).all()


def update_oferta_licencia(db: Session, oferta_licencia_id: int, oferta_licencia_data: OfertaLicenciaCreate):
    db_oferta_licencia = db.query(OfertaLicencia).filter(OfertaLicencia.id == oferta_licencia_id).first()
    if not db_oferta_licencia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")
    for key, value in oferta_licencia_data.dict().items():
        setattr(db_oferta_licencia, key, value)
    db.commit()
    db.refresh(db_oferta_licencia)
    return db_oferta_licencia

def delete_oferta_licencia(db: Session, oferta_licencia_id: int):
    db_oferta_licencia = db.query(OfertaLicencia).filter(OfertaLicencia.id == oferta_licencia_id).first()
    if not db_oferta_licencia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")
    db.delete(db_oferta_licencia)
    db.commit()
    return {"message": "Oferta de licencia eliminada exitosamente"}

def get_oferta_licencia_by_name(db: Session, nombre_saas: str):
    db_oferta_licencia = db.query(OfertaLicencia).filter(OfertaLicencia.nombre_saas == nombre_saas).first()
    if not db_oferta_licencia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")
    return db_oferta_licencia