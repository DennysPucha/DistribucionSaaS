from pydantic import BaseModel
from datetime import date
from app.Model.enums import TipoTransaccion

class TransaccionBase(BaseModel):
    tipo: TipoTransaccion
    licencia_id: int

class TransaccionCreate(TransaccionBase):
    fecha: date

class Transaccion(TransaccionBase):
    id: int
    fecha: date

    class Config:
        orm_mode = True
