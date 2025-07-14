from sqlalchemy.orm import Session
from app.Model.transaccion import Transaccion
from app.Schemas.transaccion_schema import TransaccionCreate

def get_transaccion(db: Session, transaccion_id: int):
    return db.query(Transaccion).filter(Transaccion.id == transaccion_id).first()

def get_transacciones(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Transaccion).offset(skip).limit(limit).all()

def create_transaccion(db: Session, transaccion: TransaccionCreate):
    db_transaccion = Transaccion(**transaccion.dict())
    db.add(db_transaccion)
    db.commit()
    db.refresh(db_transaccion)
    return db_transaccion
