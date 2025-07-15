from sqlalchemy.orm import Session
from app.Model.contrato import Contrato
from app.Schemas.contrato_schema import ContratoCreate
from fastapi import HTTPException, status

def get_contrato(db: Session, contrato_id: int):
    return db.query(Contrato).filter(Contrato.id == contrato_id).first()

def get_contratos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Contrato).offset(skip).limit(limit).all()

def create_contrato(db: Session, contrato: ContratoCreate):
    db_contrato = Contrato(**contrato.dict())
    db.add(db_contrato)
    db.commit()
    db.refresh(db_contrato)
    return db_contrato
