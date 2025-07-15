from pydantic import BaseModel
from typing import Optional, List

class RolBase(BaseModel):
    nombre: str

class RolCreate(RolBase):
    pass

class Rol(RolBase):
    id: int

    class Config:
        orm_mode = True

class RolResponse(BaseModel):
    rol: RolBase
    code: int
    message: str

class RolListResponse(BaseModel):
    roles: List[RolBase]
    code: int
    message: str