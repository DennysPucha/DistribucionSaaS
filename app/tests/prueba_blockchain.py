from web3 import Web3

# Configuración - reemplaza con tus valores
CONTRACT_ADDRESS = "0xb9a219631aed55ebc3d998f17c3840b7ec39c0cc"
CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "prueba",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	}
]

# Conexión a Ganache
WEB3_PROVIDER_URL = "http://127.0.0.1:8545"  # Asegúrate que es el puerto correcto
web3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))

def verificar_entorno():
    print("\n=== Diagnóstico Completo ===")
    
    # 1. Verificar conexión
    if not web3.is_connected():
        print("❌ No conectado a Ganache")
        return False
    
    print("✅ Conectado a Ganache")
    print(f"📦 Último bloque: {web3.eth.block_number}")
    print(f"🆔 Chain ID: {web3.eth.chain_id}")
    
    # 2. Verificar cuentas
    cuentas = web3.eth.accounts
    if not cuentas:
        print("❌ No hay cuentas disponibles")
        return False
    
    print(f"👤 Cuentas disponibles: {len(cuentas)}")
    print(f"💰 Saldo primera cuenta: {web3.from_wei(web3.eth.get_balance(cuentas[0]), 'ether')} ETH")
    
    # 3. Verificar contrato
    if not web3.is_address(CONTRACT_ADDRESS):
        print("❌ Dirección de contrato inválida")
        return False
    
    codigo = web3.eth.get_code(Web3.to_checksum_address(CONTRACT_ADDRESS))
    if len(codigo) <= 2:  # Solo '0x'
        print("❌ No hay código en la dirección del contrato")
        print("Posibles soluciones:")
        print("1. Verifica que el contrato se desplegó correctamente en Remix")
        print("2. Copia EXACTAMENTE la dirección del contrato desde Remix")
        print("3. Reinicia Ganache y vuelve a desplegar")
        return False
    
    print(f"📄 Código del contrato: {len(codigo)} bytes")
    return True

if __name__ == "__main__":
    if verificar_entorno():
        print("\n🎉 Entorno configurado correctamente!")
    else:
        print("\n🔴 Hay problemas con la configuración")