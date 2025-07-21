from sqlalchemy.orm import Session
from app.Model.licencia import Licencia
from app.Model.usuario import Usuario
from app.Model.contrato import Contrato
from app.Schemas.licencia_schema import LicenciaCreate
from app.Services.transaccion_service import create_transaccion
from app.Schemas.transaccion_schema import TransaccionCreate
from app.Model.enums import EstadoLicencia, TipoTransaccion
from fastapi import HTTPException, status
from datetime import date, timedelta
import uuid
from app.Observers.notification_service import licencia_notifier
from app.States.licencia_states import StateFactory

def get_licencia(db: Session, licencia_id: int):
    return db.query(Licencia).filter(Licencia.id == licencia_id).first()

def get_licencias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Licencia).offset(skip).limit(limit).all()

def emitir_licencia(db: Session, licencia: LicenciaCreate):
    db_usuario = db.query(Usuario).filter(Usuario.id == licencia.usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    db_contrato = db.query(Contrato).filter(Contrato.id == licencia.contrato_id).first()
    if not db_contrato:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contrato no encontrado")

    clave = str(uuid.uuid4())
    fecha_emision = date.today()
    fecha_expiracion = fecha_emision + timedelta(days=licencia.dias_de_validez)

    db_licencia = Licencia(
        clave_licencia=clave,
        estadoLicencia=EstadoLicencia.Activa,
        fecha_emision=fecha_emision,
        fecha_expiracion=fecha_expiracion,
        usuario_id=licencia.usuario_id,
        contrato_id=licencia.contrato_id
    )
    db.add(db_licencia)
    db.commit()
    db.refresh(db_licencia)

    create_transaccion(db, TransaccionCreate(
        fecha=date.today(),
        tipo=TipoTransaccion.Emision,
        licencia_id=db_licencia.id
    ))

    # Notificar a los observadores
    licencia_notifier.notify("licencia_emitida", db_licencia)

    return db_licencia

def revocar_licencia(db: Session, licencia_id: int):
    db_licencia = get_licencia(db, licencia_id)
    if not db_licencia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Licencia no encontrada")

    # Obtener el estado actual y delegar la acción
    state = StateFactory.get_state(db_licencia.estadoLicencia)
    state.revocar(db_licencia, db)

    db.commit()
    db.refresh(db_licencia)

    # Notificar a los observadores
    licencia_notifier.notify("licencia_revocada", db_licencia)

    return db_licencia