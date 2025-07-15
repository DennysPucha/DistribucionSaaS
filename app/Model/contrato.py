from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base

class Contrato(Base):
    __tablename__ = "contratos"

    id = Column(Integer, primary_key=True, index=True)
    nombre_saas = Column(String(100), nullable=False)
    terminos = Column(Text, nullable=False)
    
    licencias = relationship("Licencia", back_populates="contrato")