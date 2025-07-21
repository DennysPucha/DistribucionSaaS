from typing import List
from app.Observers.observer_pattern import IObserver, ISubject
from app.Model.licencia import Licencia

# --- Observadores Concretos ---

class LogNotifier(IObserver):
    def update(self, event: str, licencia: Licencia) -> None:
        print(f"[LOG] Evento '{event}' ocurrido para la licencia ID: {licencia.id} del usuario ID: {licencia.usuario_id}")

class EmailNotifier(IObserver):
    def update(self, event: str, licencia: Licencia) -> None:
        if licencia.usuario and licencia.usuario.correo:
            print(f"[EMAIL] Simulando envío de email a {licencia.usuario.correo} sobre el evento '{event}' para la licencia '{licencia.clave_licencia}'.")
        else:
            print(f"[EMAIL] No se pudo enviar email: el usuario o su correo no están disponibles para la licencia ID {licencia.id}.")


class LicenciaNotifier(ISubject):
    _observers: List[IObserver] = []

    def attach(self, observer: IObserver) -> None:
        if observer not in self._observers:
            self._observers.append(observer)

    def detach(self, observer: IObserver) -> None:
        self._observers.remove(observer)

    def notify(self, event: str, licencia: Licencia) -> None:
        for observer in self._observers:
            observer.update(event, licencia)

# --- Instancia del Notificador ---
# Se puede manejar como un singleton
licencia_notifier = LicenciaNotifier()
licencia_notifier.attach(LogNotifier())
licencia_notifier.attach(EmailNotifier())
