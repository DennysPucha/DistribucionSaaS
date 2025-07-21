from abc import ABC, abstractmethod
from sqlalchemy.orm import Session

# Adelantamos la declaración de Licencia para evitar importación circular
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.Model.licencia import Licencia

class ILicenciaState(ABC):
    @abstractmethod
    def revocar(self, licencia: "Licencia", db: Session) -> None:
        pass

    @abstractmethod
    def expirar(self, licencia: "Licencia", db: Session) -> None:
        pass
