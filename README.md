# Proyecto de Distribución de SaaS con Blockchain

Este proyecto es una plataforma completa para la distribución y gestión de licencias de software (SaaS), utilizando una blockchain para asegurar la transparencia y la inmutabilidad de las transacciones de licencias. La aplicación se divide en un backend con FastAPI, un frontend con React y una simulación de un software cliente.

## Arquitectura del Proyecto

El proyecto está compuesto por tres módulos principales:

-   **/app**: El backend de la aplicación, construido con **FastAPI**. Gestiona la lógica de negocio, la interacción con la base de datos y la comunicación con la blockchain.
-   **/app_frontend**: La interfaz de usuario, desarrollada con **React**. Permite a los administradores (distribuidores) y a los usuarios finales interactuar con la plataforma.
-   **/prueba_saas**: Una aplicación simple en **HTML y JavaScript** que simula ser un software que requiere una licencia para funcionar, validándola contra el backend.

## Flujo de Funcionamiento

1.  **Autenticación Web3**: Los usuarios (tanto administradores como clientes) se conectan a la aplicación a través de su billetera MetaMask.
2.  **Gestión de Ofertas (Administrador)**: Un usuario con rol de "Administrador" puede crear, editar y publicar ofertas de licencias para diferentes productos SaaS.
3.  **Adquisición de Licencias (Usuario)**: Un usuario con rol de "Usuario" puede navegar por el catálogo de ofertas y "adquirir" una licencia.
4.  **Emisión y Registro**: Al adquirir una licencia, el sistema:
    -   Genera una clave de licencia única.
    -   Registra la transacción en la base de datos (MySQL).
    -   Simula una transacción en la blockchain (usando Ganache para desarrollo) para registrar la emisión, revocación o extensión de la licencia, generando un hash de transacción.
5.  **Validación de Licencia**: La aplicación `prueba_saas` solicita una clave de licencia. Esta clave se envía al endpoint `/licencias/verificar/{clave_licencia}` del backend para confirmar su validez y estado antes de conceder el acceso.

## Tecnologías Utilizadas

-   **Backend**: Python, FastAPI, SQLAlchemy, Web3.py, JWT.
-   **Frontend**: React, Vite, ethers.js, React Router, React Hook Form.
-   **Base de Datos**: MySQL.
-   **Blockchain**: Solidity, Ganache (para desarrollo local).

## Cómo Empezar

Para poner en marcha el proyecto, sigue las instrucciones de configuración detalladas en los archivos `README.md` de cada subdirectorio:

-   [Instrucciones del Backend](./app/README.md)
-   [Instrucciones del Frontend](./app_frontend/README.md)
-   [Instrucciones de la Simulación SaaS](./prueba_saas/README.md)