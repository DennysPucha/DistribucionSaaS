from fastapi import FastAPI
from app.Routers import usuarios, licencias, transacciones, auth, roles, contratos
from app.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware
# Importa todos los modelos para que Base los conozca
from app.Model import usuario, rol, licencia, transaccion, nonce, contrato

# Crea todas las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API de Distribución de Software SaaS",
    description="Una API para gestionar licencias, usuarios y autenticación Web3.",
    version="1.0.0"
)

app.add_middleware(CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluye los routers
app.include_router(auth.router)
app.include_router(roles.router)
app.include_router(usuarios.router)
app.include_router(contratos.router)
app.include_router(licencias.router)
app.include_router(transacciones.router)

@app.get("/", tags=["Root"])
def read_root():
    return {"message": "Bienvenido a la API de Distribución de Software SaaS"}