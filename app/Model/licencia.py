from pydantic import BaseModel
from datetime import date
from .enums import EstadoLicencia

class Licencia(BaseModel):
    id: str
    estado: EstadoLicencia
    fechaEmision: date
    fechaExpiracion: date