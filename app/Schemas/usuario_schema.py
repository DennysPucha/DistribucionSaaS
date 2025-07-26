from pydantic import BaseModel, EmailStr
from typing import Optional

class UsuarioBase(BaseModel):
    direccion_wallet: str
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    rol_id: Optional[int] = None

class UsuarioCreate(UsuarioBase):
    pass

class UsuarioCompletarPerfil(BaseModel):
    nombre: str
    correo: EmailStr

class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    correo: Optional[EmailStr] = None
    rol_id: Optional[int] = None

class Usuario(UsuarioBase):
    id: int

    model_config = {
        "from_attributes": True
    }

class UsuarioResponse(BaseModel):
    usuario: Usuario
    code: int
    message: str

class UsuarioListResponse(BaseModel):
    usuarios: list[Usuario]
    code: int
    message: str
