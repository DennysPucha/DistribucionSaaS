from sqlalchemy.orm import Session
from app.Model.licencia import Licencia
from app.Model.usuario import Usuario
from app.Model.oferta_licencia import OfertaLicencia
from app.Schemas.licencia_schema import LicenciaCreate, AmpliarLicenciaRequest
from app.Model.enums import EstadoLicencia
from fastapi import HTTPException, status
from datetime import date, timedelta
import uuid
from app.blockchain import contract, send_transaction, web3

def get_licencia(db: Session, licencia_id: int):
    return db.query(Licencia).filter(Licencia.id == licencia_id).first()

def get_licencias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Licencia).offset(skip).limit(limit).all()

def emitir_licencia(db: Session, licencia: LicenciaCreate):
    db_usuario = db.query(Usuario).filter(Usuario.id == licencia.usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    db_oferta_licencia = db.query(OfertaLicencia).filter(OfertaLicencia.id == licencia.oferta_licencia_id).first()
    if not db_oferta_licencia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Oferta de licencia no encontrada")

    clave = str(uuid.uuid4())
    fecha_emision = date.today()
    fecha_expiracion = fecha_emision + timedelta(days=licencia.dias_de_validez)

    # Interacción con el contrato
    try:
        function_call = contract.functions.emitirLicencia(
            db_usuario.direccion_wallet,
            clave,
            licencia.dias_de_validez
        )
        receipt = send_transaction(function_call)
        if not receipt or receipt.status == 0:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al registrar la licencia en la blockchain")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error de blockchain: {e}")

    # Guardar en la base de datos
    db_licencia = Licencia(
        clave_licencia=clave,
        estadoLicencia=EstadoLicencia.Activa,
        fecha_emision=fecha_emision,
        fecha_expiracion=fecha_expiracion,
        usuario_id=licencia.usuario_id,
        oferta_licencia_id=licencia.oferta_licencia_id,
        blockchain_index=contract.functions.totalLicencias(db_usuario.direccion_wallet).call() - 1
    )
    db.add(db_licencia)
    db.commit()
    db.refresh(db_licencia)

    return db_licencia

def revocar_licencia(db: Session, licencia_id: int):
    db_licencia = get_licencia(db, licencia_id)
    if not db_licencia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Licencia no encontrada")

    db_usuario = db.query(Usuario).filter(Usuario.id == db_licencia.usuario_id).first()

    # Interacción con el contrato
    try:
        function_call = contract.functions.revocarLicencia(db_usuario.direccion_wallet, db_licencia.blockchain_index)
        receipt = send_transaction(function_call)
        if not receipt or receipt.status == 0:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al revocar la licencia en la blockchain")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error de blockchain: {e}")

    db_licencia.estadoLicencia = EstadoLicencia.Revocada
    db.commit()
    db.refresh(db_licencia)

    return db_licencia

def ampliar_licencia(db: Session, licencia_id: int, data: AmpliarLicenciaRequest):
    db_licencia = get_licencia(db, licencia_id)
    if not db_licencia:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Licencia no encontrada")

    db_usuario = db.query(Usuario).filter(Usuario.id == db_licencia.usuario_id).first()

    # Interacción con el contrato
    try:
        function_call = contract.functions.ampliarLicencia(db_usuario.direccion_wallet, db_licencia.blockchain_index, data.dias_extra)
        receipt = send_transaction(function_call)
        if not receipt or receipt.status == 0:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al ampliar la licencia en la blockchain")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error de blockchain: {e}")

    db_licencia.fecha_expiracion += timedelta(days=data.dias_extra)
    db.commit()
    db.refresh(db_licencia)

    return db_licencia

def get_licencia_from_blockchain(usuario_id: int, licencia_index: int, db: Session):
    db_usuario = db.query(Usuario).filter(Usuario.id == usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    try:
        licencia_data = contract.functions.obtenerLicencia(db_usuario.direccion_wallet, licencia_index).call()
        return {
            "clave_licencia": licencia_data[0],
            "estado": EstadoLicencia.Activa if licencia_data[1] == 0 else (EstadoLicencia.Revocada if licencia_data[1] == 1 else EstadoLicencia.Expirada),
            "fecha_emision": date.fromtimestamp(licencia_data[2]),
            "fecha_expiracion": date.fromtimestamp(licencia_data[3])
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error de blockchain: {e}")
