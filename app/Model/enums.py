from enum import Enum

class EstadoLicencia(str, Enum):
    Activa = "Activa"
    Revocada = "Revocada"
    Expirada = "Expirada"

