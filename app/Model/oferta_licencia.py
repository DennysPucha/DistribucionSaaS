from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

class OfertaLicencia(Base):
    __tablename__ = "ofertas_licencia"

    id = Column(Integer, primary_key=True, index=True)
    nombre_saas = Column(String(100), nullable=False)
    terminos = Column(Text, nullable=False)
    tipo = Column(String(100), nullable=False)
    img = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=False)
    
    licencias = relationship("Licencia", back_populates="oferta_licencia")
