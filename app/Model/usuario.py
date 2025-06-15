from pydantic import BaseModel

class Usuario(BaseModel):
    id: str
    direccionWallet: str
    nombre: str
    correo: str