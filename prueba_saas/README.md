# Simulación de Software SaaS

Esta es una aplicación cliente simple, desarrollada con **HTML y JavaScript**, que simula un producto de software (SaaS) que requiere una licencia para ser utilizado.

## Funcionalidad

El propósito de esta simulación es demostrar el paso final del ciclo de vida de una licencia: la **validación**.

1.  **Página de Acceso (`index.html`)**:
    -   Presenta un formulario donde el usuario debe ingresar la clave de licencia que obtuvo desde la plataforma principal (`app_frontend`).
    -   Al enviar el formulario, realiza una petición `fetch` al endpoint `http://localhost:8000/licencias/verificar/{clave_licencia}` del backend.

2.  **Validación**:
    -   Si el backend responde que la licencia es **válida y activa**, guarda la clave en `sessionStorage` y redirige al usuario a la página principal del software (`main.html`).
    -   Si la licencia es inválida, expirada, revocada o no existe, muestra un mensaje de error.

3.  **Página Principal (`main.html`)**:
    -   Simula la interfaz del software licenciado.
    -   Antes de mostrar el contenido, verifica que exista una clave de licencia en `sessionStorage`. Si no existe, redirige inmediatamente al usuario de vuelta a `index.html`.
    -   Incluye una opción para "Cerrar Sesión", que limpia el `sessionStorage` y redirige al login.

## Cómo Utilizar

### Prerrequisitos

-   El backend (`/app`) debe estar en ejecución en `http://localhost:8000`.
-   Haber obtenido una clave de licencia válida a través de la aplicación frontend (`/app_frontend`).

### Pasos

1.  **Abrir la Aplicación**:
    -   Abre el archivo `index.html` directamente en tu navegador web.
    -   Opcionalmente, puedes usar una extensión como "Live Server" en VSCode para servir los archivos.

2.  **Validar la Licencia**:
    -   Copia una clave de licencia de la sección "Mis Licencias" de la aplicación principal.
    -   Pégala en el campo de texto y haz clic en "Validar Licencia".

3.  **Acceder al Software**:
    -   Si la validación es exitosa, serás redirigido a `main.html`, que representa el acceso al software premium.
