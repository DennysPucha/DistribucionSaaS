from fastapi import APIRouter
from app.Services.licencia_service import transacciones


router = APIRouter()

@router.get("/")
def listar_transacciones():
    return transacciones