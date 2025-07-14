from sqlalchemy.orm import Session
from app.Model.nonce import Nonce
import secrets
from datetime import datetime, timedelta

# --- Configuración ---
NONCE_EXPIRATION_MINUTES = 5

def create_or_update_nonce(db: Session, address: str) -> str:
    """
    Genera un nuevo nonce para una dirección, lo guarda en la BD y lo retorna.
    Si ya existe un nonce para esa dirección, lo actualiza.
    También limpia los nonces expirados de toda la tabla.
    """
    # Limpia los nonces expirados para mantener la tabla limpia
    try:
        db.query(Nonce).filter(Nonce.expires_at < datetime.utcnow()).delete(synchronize_session=False)
        db.commit()
    except Exception:
        db.rollback() # En caso de error, revierte para no dejar la sesión en un estado inconsistente

    # Genera un nuevo nonce seguro y la fecha de expiración
    new_nonce = secrets.token_hex(16)
    expires_at = datetime.utcnow() + timedelta(minutes=NONCE_EXPIRATION_MINUTES)

    # Busca si ya existe un nonce para esta dirección
    db_nonce = db.query(Nonce).filter(Nonce.address == address.lower()).first()

    if db_nonce:
        # Si existe, lo actualiza
        db_nonce.nonce = new_nonce
        db_nonce.expires_at = expires_at
    else:
        # Si no existe, crea uno nuevo
        db_nonce = Nonce(
            address=address.lower(),
            nonce=new_nonce,
            expires_at=expires_at
        )
        db.add(db_nonce)
    
    db.commit()
    db.refresh(db_nonce)
    
    return db_nonce.nonce

def get_and_delete_nonce(db: Session, address: str, received_nonce: str) -> Nonce | None:
    """
    Busca un nonce para una dirección y, si coincide y no ha expirado, lo elimina y lo retorna.
    Esto asegura que el nonce se use una sola vez.
    """
    address_lower = address.lower()
    
    # Busca el nonce en la base de datos
    db_nonce = db.query(Nonce).filter(
        Nonce.address == address_lower,
        Nonce.nonce == received_nonce
    ).first()

    if not db_nonce:
        return None # No se encontró el nonce o no coincide

    # Verifica si ha expirado
    if db_nonce.expires_at < datetime.utcnow():
        db.delete(db_nonce) # Limpia el nonce expirado
        db.commit()
        return None # El nonce ha expirado

    # Si es válido, lo eliminamos para que no se pueda volver a usar
    db.delete(db_nonce)
    db.commit()

    return db_nonce
