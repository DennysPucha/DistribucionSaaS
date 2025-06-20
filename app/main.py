from fastapi import FastAPI
from Routers import usuarios, licencias, transacciones

app = FastAPI()

app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(licencias.router, prefix="/licencias", tags=["Licencias"])
app.include_router(transacciones.router, prefix="/transacciones", tags=["Transacciones"])