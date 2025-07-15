from pydantic import BaseModel
from typing import List, Optional

class ContratoBase(BaseModel):
    nombre_saas: str
    terminos: str

class ContratoCreate(ContratoBase):
    pass

class Contrato(ContratoBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class ContratoResponse(BaseModel):
    contrato: Contrato
    code: int
    message: str

class ContratoListResponse(BaseModel):
    contratos: List[Contrato]
    code: int
    message: str
