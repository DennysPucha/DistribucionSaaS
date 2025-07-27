from pydantic import BaseModel
from typing import List, Optional
from app.Model.enums import DuracionUnidad

class OfertaLicenciaBase(BaseModel):
    nombre_saas: str
    terminos: str
    duracion_cantidad: int
    duracion_unidad: DuracionUnidad
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
