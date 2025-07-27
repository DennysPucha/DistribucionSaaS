// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ContratoLicenciaDistribuida {
    address public superAdmin;

    constructor() {
        superAdmin = msg.sender;
    }

    enum EstadoLicencia { Activa, Revocada, Expirada }

    struct Licencia {
        string claveLicencia;
        EstadoLicencia estado;
        uint256 fechaEmision;
        uint256 fechaExpiracion;
        uint256 ofertaId;
        address usuarioFinal;
        address distribuidor; // quien emitió la licencia
    }

    mapping(address => Licencia[]) private licenciasPorUsuario;

    event LicenciaEmitida(address indexed usuario, string claveLicencia, uint256 ofertaId, address distribuidor);
    event LicenciaRevocada(address indexed usuario, uint256 index, address distribuidor);
    event LicenciaAmpliada(address indexed usuario, uint256 index, uint256 nuevaFecha, address distribuidor);
    event LicenciaCancelada(address indexed usuario, uint256 index);

    // Emitir licencia sin validaciones
    function emitirLicencia(
        address _usuario,
        string memory _claveLicencia,
        uint256 _ofertaId,
        uint256 _duracionDias
    ) public {
        uint256 fechaActual = block.timestamp;
        Licencia memory nueva = Licencia({
            claveLicencia: _claveLicencia,
            estado: EstadoLicencia.Activa,
            fechaEmision: fechaActual,
            fechaExpiracion: fechaActual + (_duracionDias * 1 days),
            ofertaId: _ofertaId,
            usuarioFinal: _usuario,
            distribuidor: msg.sender
        });

        licenciasPorUsuario[_usuario].push(nueva);
        emit LicenciaEmitida(_usuario, _claveLicencia, _ofertaId, msg.sender);
    }

    // Revocar licencia sin validaciones
    function revocarLicencia(address _usuario, uint256 _index) public {
        Licencia storage lic = licenciasPorUsuario[_usuario][_index];
        lic.estado = EstadoLicencia.Revocada;
        emit LicenciaRevocada(_usuario, _index, msg.sender);
    }

    // Ampliar licencia sin validaciones
    function ampliarLicencia(address _usuario, uint256 _index, uint256 _diasExtra) public {
        Licencia storage lic = licenciasPorUsuario[_usuario][_index];
        lic.fechaExpiracion += _diasExtra * 1 days;
        emit LicenciaAmpliada(_usuario, _index, lic.fechaExpiracion, msg.sender);
    }

    // Cancelar licencia propia sin validaciones
    function cancelarLicenciaPropia(uint256 _index) public {
        Licencia storage lic = licenciasPorUsuario[msg.sender][_index];
        lic.estado = EstadoLicencia.Revocada;
        emit LicenciaCancelada(msg.sender, _index);
    }

    // Obtener licencias de un usuario
    function obtenerLicencias(address _usuario) public view returns (Licencia[] memory) {
        return licenciasPorUsuario[_usuario];
    }
}
