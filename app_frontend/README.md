# Frontend - Plataforma de Licencias

Esta aplicación, construida con **React** y **Vite**, proporciona la interfaz de usuario para interactuar con el sistema de distribución de licencias.

## Vistas y Funcionalidades

La aplicación ofrece dos experiencias principales según el rol del usuario:

### Vista de Administrador (Distribuidor)

-   **Panel de Ofertas**: Crear, visualizar, editar y eliminar las ofertas de licencias para sus productos SaaS.
-   **Panel de Licencias Emitidas**: Ver un listado de todas las licencias que ha emitido, incluyendo el estado, las fechas y el usuario final.
-   **Acciones de Gestión**: Revocar una licencia activa o ampliar su duración.

### Vista de Usuario (Cliente)

-   **Catálogo de Licencias**: Explorar todas las ofertas de licencias disponibles publicadas por los administradores.
-   **Adquisición de Licencias**: Comprar o adquirir una licencia de un producto SaaS.
-   **Mis Licencias**: Consultar un listado personal de todas las licencias adquiridas, su estado (activa, revocada, expirada) y su clave para activar el software.
-   **Gestión de Perfil**: Completar o actualizar su nombre y correo electrónico.

## Tecnologías y Librerías

-   **Framework**: React 19
-   **Bundler**: Vite
-   **Comunicación Blockchain**: ethers.js
-   **Routing**: React Router DOM
-   **Gestión de Formularios**: React Hook Form con Yup para validaciones.
-   **Estilos**: CSS plano con una arquitectura modular.

## Configuración y Puesta en Marcha

### Prerrequisitos

-   Node.js 18 o superior.
-   NPM o Yarn.
-   El backend (`/app`) debe estar en ejecución.

### Pasos

1.  **Navegar al Directorio**:
    ```bash
    cd app_frontend
    ```

2.  **Instalar Dependencias**:
    ```bash
    npm install
    ```

3.  **Ejecutar el Servidor de Desarrollo**:
    ```bash
    npm run dev
    ```

La aplicación estará disponible en `http://localhost:5173` (o el puerto que Vite asigne).

## Estructura del Código

-   `/src/hooks`: Contiene los custom hooks que encapsulan la lógica para comunicarse con la API del backend (ej: `useGetOfertaLicencias`, `useGetLicenciasbyCurrentUser`).
-   `/src/pages`: Componentes que representan las diferentes páginas o vistas de la aplicación (Login, AdminPanel, MisLicencias, etc.).
-   `/src/utils/methods`:
    -   `methods.js`: Funciones genéricas (GET, POST, PUT, DELETE) para realizar peticiones a la API.
    -   `session.js`: Utilidades para gestionar el token de sesión JWT en `localStorage`.
-   `/src/components`: Componentes reutilizables como botones, modales y alertas.