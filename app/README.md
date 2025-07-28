# Backend - API de Distribución de Licencias

Este directorio contiene el código fuente del backend, una API desarrollada con **FastAPI** que sirve como el núcleo del sistema de distribución de licencias.

## Características Principales

-   **Autenticación Web3**: Implementa un flujo de autenticación seguro sin contraseñas, utilizando firmas digitales de una billetera de criptomonedas (MetaMask).
-   **Gestión de Roles**: Diferencia entre usuarios "Administradores" (distribuidores) y "Usuarios" (clientes finales).
-   **CRUD de Ofertas**: Permite a los administradores crear, leer, actualizar y eliminar las ofertas de licencias que publican.
-   **Ciclo de Vida de Licencias**: Gestiona la emisión, revocación, ampliación y verificación de licencias.
-   **Integración con Blockchain**: Interactúa con un contrato inteligente (simulado en desarrollo) para registrar las operaciones críticas sobre las licencias, garantizando la integridad a través de hashes de transacción.

## Estructura de la API

La API está organizada en los siguientes módulos y routers:

-   `/auth`: Endpoints para el flujo de autenticación Web3 (`/request-nonce`, `/login`).
-   `/roles`: Gestión de roles de usuario.
-   `/usuarios`: Gestión de perfiles de usuario.
-   `/ofertas-licencia`: CRUD para las ofertas de licencias creadas por los administradores.
-   `/licencias`: Endpoints para emitir, revocar, ampliar, consultar y verificar el estado de las licencias.

## Configuración y Puesta en Marcha

### Prerrequisitos

-   Python 3.8 o superior.
-   Una instancia de MySQL en ejecución.
-   Una instancia de Ganache (o un nodo Ethereum de prueba) para la simulación de la blockchain.

### Pasos

1.  **Navegar al Directorio**:
    ```bash
    cd app
    ```

2.  **Crear y Activar un Entorno Virtual**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # En Windows: venv\Scripts\activate
    ```

3.  **Instalar Dependencias**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configurar Variables de Entorno**:
    -   Crea un archivo `.env` en la raíz del directorio `/app`.
    -   Copia el contenido de `.env.example` (si existe) o añade las siguientes variables:
        ```env
        # Base de Datos
        DB_USER=tu_usuario_mysql
        DB_PASSWORD=tu_contraseña_mysql
        DB_HOST=localhost
        DB_PORT=3306
        DB_NAME=tu_base_de_datos

        # JWT
        SECRET_KEY=tu_clave_secreta_para_jwt

        # Blockchain
        WEB3_PROVIDER_URL=http://127.0.0.1:8545 # URL de tu nodo Ganache
        CONTRACT_ADDRESS=la_direccion_de_tu_contrato_desplegado
        DEPLOYER_PRIVATE_KEY=la_clave_privada_de_la_cuenta_desplegadora
        ```

5.  **Ejecutar la Aplicación**:
    ```bash
    uvicorn app.main:app --reload
    ```

La API estará disponible en `http://localhost:8000`.
