from fastapi import FastAPI
from app.Routers import usuarios, licencias, transacciones, auth, roles
from app.database import engine, Base

# Importa todos los modelos para que Base los conozca
from app.Model import usuario, rol, licencia, transaccion, nonce # Se quita contrato al no ser un modelo de BD

# Crea todas las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Distribución de Software SaaS",
    description="Una API para gestionar licencias, usuarios y autenticación Web3.",
    version="1.0.0"
)

# Incluye los routers
app.include_router(auth.router)
app.include_router(roles.router)
app.include_router(usuarios.router, prefix="/usuarios", tags=["Usuarios"])
app.include_router(licencias.router, prefix="/licencias", tags=["Licencias"])
app.include_router(transacciones.router, prefix="/transacciones", tags=["Transacciones"])

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bienvenido a la API de Distribución de Software SaaS"}