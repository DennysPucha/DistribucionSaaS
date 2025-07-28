from sqlalchemy.orm import Session
from app.Model.licencia import Licencia
from app.Model.usuario import Usuario
from app.Model.oferta_licencia import OfertaLicencia
from app.Schemas.licencia_schema import LicenciaCreate, AmpliarLicenciaRequest, LicenciaNueva
from app.Model.enums import EstadoLicencia
from fastapi import HTTPException
from datetime import date, timedelta
import uuid
from app.blockchain import send_transaction, DummyFunctionCall
from app.Model.Utils.utils import calcular_dias_oferta_licencia
import hashlib

def get_licencia(db: Session, licencia_id: int):
    return db.query(Licencia).filter(Licencia.id == licencia_id).first()


def get_licencias(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Licencia).offset(skip).limit(limit).all()


def emitir_licencia(db: Session, licencia: LicenciaCreate):
    db_usuario = db.query(Usuario).filter(Usuario.id == licencia.usuario_id).first()
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    db_oferta = db.query(OfertaLicencia).filter(OfertaLicencia.id == licencia.oferta_licencia_id).first()
    if not db_oferta:
        raise HTTPException(status_code=404, detail="Oferta no encontrada")

    db_distribuidor = db.query(Usuario).filter(Usuario.id == db_oferta.usuario_id).first()
    if not db_distribuidor:
        raise HTTPException(status_code=404, detail="Distribuidor no encontrado")

    clave = str(uuid.uuid4())
    fecha_emision = date.today()

    duracion_dias = calcular_dias_oferta_licencia(db_oferta.duracion_cantidad, db_oferta.duracion_unidad)

    try:
        function_call = DummyFunctionCall("emitirLicencia")
        receipt = send_transaction(function_call, from_address=db_distribuidor.direccion_wallet)
        if not receipt or receipt.status == 0:
            raise HTTPException(status_code=500, detail="Error en blockchain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain error: {e}")

    blockchain_index = 0

    hash_datos = {
    "from": db_distribuidor.direccion_wallet,
    "to": db_usuario.direccion_wallet,
    "func": "emitirLicencia",
    "fecha": str(fecha_emision),
    "clave": clave
    }
    
    hash = generar_hash_transaccion(hash_datos)

    db_licencia = Licencia(
        clave_licencia=clave,
        estadoLicencia=EstadoLicencia.Activa,
        fecha_emision=fecha_emision,
        fecha_expiracion=fecha_emision + timedelta(days=duracion_dias),
        usuario_id=licencia.usuario_id,
        oferta_licencia_id=db_oferta.id,
        blockchain_index=blockchain_index,
        hash=hash
    )
    db.add(db_licencia)
    db.commit()
    db.refresh(db_licencia)
    return db_licencia

#tambien cambia el estado a activa si ya esta revocada
def revocar_licencia(db: Session, licencia_id: int):
    db_licencia = get_licencia(db, licencia_id)
    if not db_licencia:
        raise HTTPException(status_code=404, detail="Licencia no encontrada")

    try:
        function_call = DummyFunctionCall("revocarLicencia")
        receipt = send_transaction(function_call)
        if not receipt or receipt.status == 0:
            raise HTTPException(status_code=500, detail="Error en blockchain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain error: {e}")

    
    if db_licencia.estadoLicencia == EstadoLicencia.Revocada:
        db_licencia.estadoLicencia = EstadoLicencia.Activa
    else:
        db_licencia.estadoLicencia = EstadoLicencia.Revocada
    
    hash_datos = {
    "func": "revocarLicencia",
    "licencia_id": licencia_id,
    "fecha": str(date.today())
    }

    hash = generar_hash_transaccion(hash_datos)

    db_licencia.hash = hash
    db.commit()
    db.refresh(db_licencia)
    return db_licencia


def ampliar_licencia(db: Session, licencia_id: int, data: AmpliarLicenciaRequest):
    db_licencia = get_licencia(db, licencia_id)
    if not db_licencia:
        raise HTTPException(status_code=404, detail="Licencia no encontrada")

    try:
        function_call = DummyFunctionCall("ampliarLicencia")
        receipt = send_transaction(function_call)
        if not receipt or receipt.status == 0:
            raise HTTPException(status_code=500, detail="Error en blockchain")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain error: {e}")

    db_licencia.fecha_expiracion += timedelta(days=data.dias_extra)
    
    hash_datos = {
    "func": "ampliarLicencia",
    "licencia_id": licencia_id,
    "dias_extra": data.dias_extra,
    "fecha": str(date.today())
    }

    hash = generar_hash_transaccion(hash_datos)

    db_licencia.hash = hash
    db.commit()
    db.refresh(db_licencia)
    return db_licencia

#debe devolver las licencias con su oferta de licencia asociada
#este metodo debe cambiar el estado de las licencias si ya expiraron
def obtener_licencias_por_usuario(db: Session, usuario_id: int) -> list[LicenciaNueva]:
    db_licencias = db.query(Licencia).filter(Licencia.usuario_id == usuario_id).all()
    if not db_licencias:
        raise []

    licencias_resultado = []
    for licencia in db_licencias:
        oferta = db.query(OfertaLicencia).filter(OfertaLicencia.id == licencia.oferta_licencia_id).first()
        if not oferta:
            raise HTTPException(status_code=404, detail="Oferta de licencia no encontrada")

        user = db.query(Usuario).filter(Usuario.id == oferta.usuario_id).first()

        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # Verificar si la licencia ya ha expirado
        if licencia.fecha_expiracion < date.today():
            licencia.estadoLicencia = EstadoLicencia.Expirada
            db.commit()


        licencia_nueva = LicenciaNueva(
            id=licencia.id,
            usuario_id=licencia.usuario_id,
            oferta_licencia_id=licencia.oferta_licencia_id,
            clave_licencia=licencia.clave_licencia,
            estadoLicencia=licencia.estadoLicencia,
            fecha_emision=licencia.fecha_emision,
            fecha_expiracion=licencia.fecha_expiracion,
            wallet_usuario=user.direccion_wallet,
            wallet_administrador=user.direccion_wallet,  
            nombre_saas=oferta.nombre_saas,
            hash=licencia.hash
        )
        licencias_resultado.append(licencia_nueva)

    return licencias_resultado

# este nuevo metodo debe devolver las licencias emitidas por usuario desde la otra relacion
# es decir desde la oferta de licencia toma el usuario_id y devuelve las licencias

#este metodo debe cambiar el estado de las licencias si ya expiraron
def obtener_licencias_emitidas_por_usuario(db: Session, usuario_id: int) -> list[LicenciaNueva]:
    db_ofertas = db.query(OfertaLicencia).filter(OfertaLicencia.usuario_id == usuario_id).all()
    if not db_ofertas:
        return []
    licencias_resultado = []
    for oferta in db_ofertas:
        db_licencias = db.query(Licencia).filter(Licencia.oferta_licencia_id == oferta.id).all()
        if not db_licencias:
            continue  # Si no hay licencias para esta oferta, saltar a la siguiente

        for licencia in db_licencias:
            user = db.query(Usuario).filter(Usuario.id == licencia.usuario_id).first()


            if not user:
                continue
                
            # Verificar si la licencia ya ha expirado
            if licencia.fecha_expiracion < date.today():
                licencia.estadoLicencia = EstadoLicencia.Expirada
                db.commit()

            licencia_nueva = LicenciaNueva(
                id=licencia.id,
                usuario_id=licencia.usuario_id,
                oferta_licencia_id=licencia.oferta_licencia_id,
                clave_licencia=licencia.clave_licencia,
                estadoLicencia=licencia.estadoLicencia,
                fecha_emision=licencia.fecha_emision,
                fecha_expiracion=licencia.fecha_expiracion,
                wallet_usuario=user.direccion_wallet,
                wallet_administrador=oferta.usuario.direccion_wallet,  
                nombre_saas=oferta.nombre_saas,
                hash=licencia.hash
            )
            licencias_resultado.append(licencia_nueva)
    if not licencias_resultado:
        return []
    return licencias_resultado


# Este metodo permitira a los administradores saber si una licencia aun  esta activa
# recibira la clave de la licencia y devolvera un booleano

def verificar_licencia_activa(db: Session, clave_licencia: str) -> bool:
    db_licencia = db.query(Licencia).filter(Licencia.clave_licencia == clave_licencia).first()
    if not db_licencia:
        raise HTTPException(status_code=404, detail="Licencia no encontrada")

    # Verificar si la licencia ya ha expirado
    if db_licencia.fecha_expiracion < date.today():
        return False

    return db_licencia.estadoLicencia == EstadoLicencia.Activa

def generar_hash_transaccion(data: dict) -> str:
    concatenado = "|".join(str(data[key]) for key in sorted(data))
    return hashlib.sha256(concatenado.encode()).hexdigest()

