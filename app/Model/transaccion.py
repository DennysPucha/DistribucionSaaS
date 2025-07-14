from sqlalchemy import Column, Integer, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from .enums import TipoTransaccion

class Transaccion(Base):
    __tablename__ = "transacciones"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, nullable=False)
    tipo = Column(Enum(TipoTransaccion), nullable=False)
    licencia_id = Column(Integer, ForeignKey("licencias.id"))

    licencia = relationship("Licencia", back_populates="transacciones")
