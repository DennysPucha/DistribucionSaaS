from sqlalchemy import Column, Integer, String, Text, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from app.database import Base
from .enums import DuracionUnidad

class OfertaLicencia(Base):
    __tablename__ = "ofertas_licencia"

    id = Column(Integer, primary_key=True, index=True)
    nombre_saas = Column(String(100), nullable=False)
    terminos = Column(Text, nullable=False)
    duracion_cantidad = Column(Integer, nullable=False)
    duracion_unidad = Column(Enum(DuracionUnidad), nullable=False)
    img = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"))
    state = Column(Boolean, default=True, nullable=False)

    licencias = relationship("Licencia", back_populates="oferta_licencia")
    usuario = relationship("Usuario", back_populates="ofertas_licencia")
