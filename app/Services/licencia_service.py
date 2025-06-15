from datetime import date, timedelta
from Model.licencia import Licencia
from Model.enums import EstadoLicencia, TipoTransaccion
from Model.transaccion import Transaccion
import uuid

licencias = []
transacciones = []

def emitir_licencia(usuario_id: str):
    licencia = Licencia(
        id=str(uuid.uuid4()),
        estado=EstadoLicencia.Activa,
        fechaEmision=date.today(),
        fechaExpiracion=date.today() + timedelta(days=365)
    )
    licencias.append(licencia)
    transacciones.append(Transaccion(id=str(uuid.uuid4()), fecha=date.today(), tipo=TipoTransaccion.Emision))
    return {"mensaje": "Licencia emitida", "licencia": licencia}

def revocar_licencia(licencia_id: str):
    for l in licencias:
        if l.id == licencia_id:
            l.estado = EstadoLicencia.Revocada
            transacciones.append(Transaccion(id=str(uuid.uuid4()), fecha=date.today(), tipo=TipoTransaccion.Revocacion))
            return {"mensaje": "Licencia revocada", "licencia": l}
    return {"error": "Licencia no encontrada"}

def listar_licencias():
    return licencias