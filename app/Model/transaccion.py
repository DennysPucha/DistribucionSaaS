from pydantic import BaseModel
from datetime import date
from .enums import TipoTransaccion

class Transaccion(BaseModel):
    id: str
    fecha: date
    tipo: TipoTransaccion