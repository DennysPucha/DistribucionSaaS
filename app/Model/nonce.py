from sqlalchemy import Column, String, DateTime
from app.database import Base
import datetime

class Nonce(Base):
    """
    Modelo para almacenar nonces de un solo uso para la autenticación Web3.
    """
    __tablename__ = "nonces"

    address = Column(String(42), primary_key=True, index=True, comment="Dirección de la wallet (Ethereum)")
    nonce = Column(String(32), unique=True, index=True, nullable=False, comment="Nonce único generado para la firma")
    expires_at = Column(DateTime, nullable=False, comment="Fecha y hora de expiración del nonce")
