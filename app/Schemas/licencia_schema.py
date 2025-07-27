from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from app.Model.enums import EstadoLicencia
from app.Model.oferta_licencia import OfertaLicencia

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

class LicenciaNueva(BaseModel):
    id: int
    usuario_id: int
    oferta_licencia_id: int
    clave_licencia: str
    estadoLicencia: EstadoLicencia
    fecha_emision: date
    fecha_expiracion: date
    wallet_usuario: str
    wallet_administrador: str
    nombre_saas: str

class LicenciaOfertaResponse(BaseModel):
    licenciaNueva: LicenciaNueva
    code: int
    message: str

class LicenciaOfertaListResponse(BaseModel):
    licencias: List[LicenciaNueva]
    code: int
    message: str