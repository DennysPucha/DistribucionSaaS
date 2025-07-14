from pydantic import BaseModel
from typing import Optional
from datetime import date
from app.Model.enums import EstadoLicencia

class LicenciaBase(BaseModel):
    clave_licencia: str
    fecha_emision: date
    fecha_expiracion: date
    usuario_id: int

class LicenciaCreate(LicenciaBase):
    pass

class LicenciaUpdate(BaseModel):
    estado: Optional[EstadoLicencia] = None

class Licencia(LicenciaBase):
    id: int
    estado: EstadoLicencia

    class Config:
        orm_mode = True
