from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    direccion_wallet = Column(String(42), unique=True, index=True, nullable=False)
    nombre = Column(String(100), nullable=True)
    correo = Column(String(100), unique=True, index=True, nullable=True)
    rol_id = Column(Integer, ForeignKey("roles.id"))

    rol = relationship("Rol")
    licencias = relationship("Licencia", back_populates="usuario")
    ofertas_licencia = relationship("OfertaLicencia", back_populates="usuario")
