from enum import Enum

class EstadoLicencia(str, Enum):
    Activa = "Activa"
    Revocada = "Revocada"
    Expirada = "Expirada"

class DuracionUnidad(str, Enum):
    DIAS = "dias"
    MESES = "meses"
    AÑOS = "años"