from __future__ import annotations
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.Model.enums import EstadoLicencia, TipoTransaccion
from app.States.state_pattern import ILicenciaState
from app.Services.transaccion_service import create_transaccion
from app.Schemas.transaccion_schema import TransaccionCreate
from datetime import date

# Adelantamos la declaración de Licencia para evitar importación circular
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.Model.licencia import Licencia

# --- Estados Concretos ---

class EstadoActiva(ILicenciaState):
    def revocar(self, licencia: "Licencia", db: Session) -> None:
        licencia.estadoLicencia = EstadoLicencia.Revocada
        create_transaccion(db, TransaccionCreate(
            fecha=date.today(),
            tipo=TipoTransaccion.Revocacion,
            licencia_id=licencia.id
        ))
        print(f"Licencia {licencia.id} revocada.")

    def expirar(self, licencia: "Licencia", db: Session) -> None:
        licencia.estadoLicencia = EstadoLicencia.Expirada
        create_transaccion(db, TransaccionCreate(
            fecha=date.today(),
            tipo=TipoTransaccion.Expiracion,
            licencia_id=licencia.id
        ))
        print(f"Licencia {licencia.id} expirada.")

class EstadoRevocada(ILicenciaState):
    def revocar(self, licencia: "Licencia", db: Session) -> None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La licencia ya ha sido revocada.")

    def expirar(self, licencia: "Licencia", db: Session) -> None:
        # Una licencia revocada no puede expirar, ya está en un estado final.
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se puede expirar una licencia que ya fue revocada.")

class EstadoExpirada(ILicenciaState):
    def revocar(self, licencia: "Licencia", db: Session) -> None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No se puede revocar una licencia que ya ha expirado.")

    def expirar(self, licencia: "Licencia", db: Session) -> None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La licencia ya ha expirado.")

# --- Fábrica de Estados ---

class StateFactory:
    _states = {
        EstadoLicencia.Activa: EstadoActiva(),
        EstadoLicencia.Revocada: EstadoRevocada(),
        EstadoLicencia.Expirada: EstadoExpirada()
    }

    @staticmethod
    def get_state(estado: EstadoLicencia) -> ILicenciaState:
        return StateFactory._states.get(estado)
