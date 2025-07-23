// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ContratoLicencia {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "No autorizado");
        _;
    }

    enum EstadoLicencia { Activa, Revocada, Expirada }

    struct Licencia {
        string claveLicencia;
        EstadoLicencia estado;
        uint256 fechaEmision;
        uint256 fechaExpiracion;
    }

    mapping(address => Licencia[]) public licenciasPorUsuario;

    event LicenciaEmitida(address indexed usuario, string claveLicencia);
    event LicenciaAmpliada(address indexed usuario, uint index, uint256 nuevaFecha);
    event LicenciaRevocada(address indexed usuario, uint index);
    event LicenciaCancelada(address indexed usuario, uint index);
    event LicenciaSubidaDesdeBD(address indexed usuario, string claveLicencia);

    // Emitir nueva licencia (modo normal)
    function emitirLicencia(address _usuario, string memory _claveLicencia, uint256 _diasDuracion) public onlyOwner {
        uint256 fechaActual = block.timestamp;
        Licencia memory nueva = Licencia({
            claveLicencia: _claveLicencia,
            estado: EstadoLicencia.Activa,
            fechaEmision: fechaActual,
            fechaExpiracion: fechaActual + (_diasDuracion * 1 days)
        });

        licenciasPorUsuario[_usuario].push(nueva);
        emit LicenciaEmitida(_usuario, _claveLicencia);
    }

    // Subir licencia ya registrada en backend (por fecha)
    function subirLicenciaDesdeBD(
        address _usuario,
        string memory _claveLicencia,
        uint256 _fechaEmision,
        uint256 _fechaExpiracion,
        EstadoLicencia _estado
    ) public onlyOwner {
        Licencia memory lic = Licencia({
            claveLicencia: _claveLicencia,
            estado: _estado,
            fechaEmision: _fechaEmision,
            fechaExpiracion: _fechaExpiracion
        });

        licenciasPorUsuario[_usuario].push(lic);
        emit LicenciaSubidaDesdeBD(_usuario, _claveLicencia);
    }

    // Ampliar vigencia
    function ampliarLicencia(address _usuario, uint _index, uint256 _diasExtra) public onlyOwner {
        require(_index < licenciasPorUsuario[_usuario].length, "Index invalid");
        Licencia storage lic = licenciasPorUsuario[_usuario][_index];
        require(lic.estado == EstadoLicencia.Activa, "No activa");
        lic.fechaExpiracion += _diasExtra * 1 days;
        emit LicenciaAmpliada(_usuario, _index, lic.fechaExpiracion);
    }

    // Revocar (admin)
    function revocarLicencia(address _usuario, uint _index) public onlyOwner {
        require(_index < licenciasPorUsuario[_usuario].length, "Index invalid");
        licenciasPorUsuario[_usuario][_index].estado = EstadoLicencia.Revocada;
        emit LicenciaRevocada(_usuario, _index);
    }

    // Usuario cancela su licencia
    function cancelarLicenciaPropia(uint _index) public {
        require(_index < licenciasPorUsuario[msg.sender].length, "Index invalid");
        Licencia storage lic = licenciasPorUsuario[msg.sender][_index];
        require(lic.estado == EstadoLicencia.Activa, "No activa");
        lic.estado = EstadoLicencia.Revocada;
        emit LicenciaCancelada(msg.sender, _index);
    }

    // Obtener todas las licencias de un usuario
    function obtenerTodasLicencias(address _usuario) public view returns (Licencia[] memory) {
        return licenciasPorUsuario[_usuario];
    }

    // Obtener una licencia específica
    function obtenerLicencia(address _usuario, uint _index) public view returns (
        string memory claveLicencia,
        EstadoLicencia estado,
        uint256 fechaEmision,
        uint256 fechaExpiracion
    ) {
        require(_index < licenciasPorUsuario[_usuario].length, "Index invalid");
        Licencia storage lic = licenciasPorUsuario[_usuario][_index];
        return (lic.claveLicencia, lic.estado, lic.fechaEmision, lic.fechaExpiracion);
    }

    // Total de licencias de un usuario
    function totalLicencias(address _usuario) public view returns (uint) {
        return licenciasPorUsuario[_usuario].length;
    }
}
