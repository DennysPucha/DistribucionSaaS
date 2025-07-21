from enum import Enum

class EstadoLicencia(str, Enum):
    Activa = "Activa"
    Revocada = "Revocada"
    Expirada = "Expirada"

class TipoTransaccion(str, Enum):
    Emision = "Emision"
    Validacion = "Validacion"
    Revocacion = "Revocacion"
    Expiracion = "Expiracion"