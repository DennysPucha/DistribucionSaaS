from fastapi import APIRouter
from Services.licencia_service import emitir_licencia, revocar_licencia, listar_licencias

router = APIRouter()

@router.post("/emitir/{usuario_id}")
def emitir(usuario_id: str):
    return emitir_licencia(usuario_id)

@router.post("/revocar/{licencia_id}")
def revocar(licencia_id: str):
    return revocar_licencia(licencia_id)

@router.get("/")
def listar():
    return listar_licencias()