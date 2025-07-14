from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioBase(BaseModel):
    direccion_wallet: str
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    rol_id: Optional[int] = None

class UsuarioCreate(UsuarioBase):
    pass

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    rol_id: Optional[int] = None

class Usuario(UsuarioBase):
    id: int

    class Config:
        orm_mode = True
