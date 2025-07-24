from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from app.Model.enums import EstadoLicencia

class LicenciaBase(BaseModel):
    clave_licencia: str
    estadoLicencia: EstadoLicencia
    fecha_emision: date
    fecha_expiracion: date
    usuario_id: int
    oferta_licencia_id: int
    blockchain_index: Optional[int] = None

class LicenciaCreate(BaseModel):
    usuario_id: int
    oferta_licencia_id: int
    dias_de_validez: int = 365

class LicenciaUpdate(BaseModel):
    estadoLicencia: EstadoLicencia

class AmpliarLicenciaRequest(BaseModel):
    dias_extra: int

class Licencia(LicenciaBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class LicenciaResponse(BaseModel):
    licencia: Licencia
    code: int
    message: str

class LicenciaListResponse(BaseModel):
    licencias: List[Licencia]
    code: int
    message: str

class LicenciaBlockchainResponse(BaseModel):
    clave_licencia: str
    estado: str
    fecha_emision: date
    fecha_expiracion: date
