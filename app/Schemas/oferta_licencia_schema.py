from pydantic import BaseModel
from typing import List, Optional

class OfertaLicenciaBase(BaseModel):
    nombre_saas: str
    terminos: str
    tipo: str
    img: str
    descripcion: str
    state: bool = True

class OfertaLicenciaCreate(OfertaLicenciaBase):
    usuario_id: int

class OfertaLicencia(OfertaLicenciaBase):
    id: int
    usuario_id: int

    model_config = {
        "from_attributes": True
    }

class OfertaLicenciaResponse(BaseModel):
    oferta_licencia: OfertaLicencia
    code: int
    message: str

class OfertaLicenciaListResponse(BaseModel):
    ofertas_licencia: List[OfertaLicencia]
    code: int
    message: str
