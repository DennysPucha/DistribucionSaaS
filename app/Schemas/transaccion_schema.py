from pydantic import BaseModel
from datetime import date
from typing import List
from app.Model.enums import TipoTransaccion

class TransaccionBase(BaseModel):
    fecha: date
    tipo: TipoTransaccion
    licencia_id: int

class TransaccionCreate(TransaccionBase):
    pass

class Transaccion(TransaccionBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class TransaccionResponse(BaseModel):
    transaccion: Transaccion
    code: int
    message: str

class TransaccionListResponse(BaseModel):
    transacciones: List[Transaccion]
    code: int
    message: str