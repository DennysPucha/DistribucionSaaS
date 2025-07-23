from pydantic import BaseModel
from typing import List, Optional

class OfertaLicenciaBase(BaseModel):
    nombre_saas: str
    terminos: str
    tipo: str
    img: str
    descripcion: str

class OfertaLicenciaCreate(OfertaLicenciaBase):
    pass

class OfertaLicencia(OfertaLicenciaBase):
    id: int

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