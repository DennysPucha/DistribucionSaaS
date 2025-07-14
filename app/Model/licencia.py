from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from .enums import EstadoLicencia

class Licencia(Base):
    __tablename__ = "licencias"

    id = Column(Integer, primary_key=True, index=True)
    clave_licencia = Column(String(255), unique=True, index=True, nullable=False)
    estado = Column(Enum(EstadoLicencia), nullable=False, default=EstadoLicencia.Activa)
    fecha_emision = Column(Date, nullable=False)
    fecha_expiracion = Column(Date, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))

    usuario = relationship("Usuario", back_populates="licencias")
    transacciones = relationship("Transaccion", back_populates="licencia")
