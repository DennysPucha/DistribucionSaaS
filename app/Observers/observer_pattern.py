from abc import ABC, abstractmethod
from typing import List, Any
from app.Model.licencia import Licencia

class IObserver(ABC):
    @abstractmethod
    def update(self, event: str, licencia: Licencia) -> None:
        pass

class ISubject(ABC):
    @abstractmethod
    def attach(self, observer: IObserver) -> None:
        pass

    @abstractmethod
    def detach(self, observer: IObserver) -> None:
        pass

    @abstractmethod
    def notify(self, event: str, licencia: Licencia) -> None:
        pass
