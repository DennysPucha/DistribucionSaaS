from web3 import Web3

# Configuración ACTUALIZADA con nueva dirección
WEB3_PROVIDER_URL = "http://localhost:8545"
PRIVATE_KEY = "0xae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f"  # Añade 0x
CONTRACT_ADDRESS = "0x446e083592d2dfa6661e20097f6898990c3cace5"  # NUEVA dirección del contrato

# ABI ACTUALIZADO (copia desde Remix después de compilar el nuevo contrato)
CONTRACT_ABI = [
	{
		"anonymous": False,
		"inputs": [
			{
				"indexed": False,
				"internalType": "address",
				"name": "usuario",
				"type": "address"
			},
			{
				"indexed": False,
				"internalType": "string",
				"name": "clave",
				"type": "string"
			}
		],
		"name": "LicenciaEmitida",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_usuario",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_clave",
				"type": "string"
			}
		],
		"name": "emitirLicenciaSimple",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

# Conexión
web3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))
cuenta = web3.eth.account.from_key(PRIVATE_KEY)

def prueba_definitiva():
    print("\n=== Prueba Definitiva ===")
    
    # 1. Verificar conexión
    assert web3.is_connected(), "No conectado a Ganache"
    print(f"Conectado a {web3.eth.chain_id}")

    # 2. Verificar contrato
    code = web3.eth.get_code(Web3.to_checksum_address(CONTRACT_ADDRESS))
    assert len(code) > 2, f"No hay contrato en {CONTRACT_ADDRESS}"
    print(f"Contrato verificado ({len(code)} bytes)")

    # 3. Instanciar contrato
    contrato = web3.eth.contract(
        address=Web3.to_checksum_address(CONTRACT_ADDRESS),
        abi=CONTRACT_ABI
    )

    # 4. Prueba simple
    print("\nPrueba básica:")
    try:
        print("Owner:", contrato.functions.owner().call())  # Si existe
    except:
        print("Función owner() no existe (esperado)")

    # 5. Llamada sin gas
    print("\nProbando llamada...")
    try:
        contrato.functions.emitirLicenciaSimple(cuenta.address, "test").call()
        print("✅ Llamada exitosa")
    except Exception as e:
        print(f"❌ Error en llamada: {str(e)}")
        return

    # 6. Transacción real
    print("\nEnviando transacción...")
    try:
        tx = contrato.functions.emitirLicenciaSimple(
            cuenta.address,
            "test-tx"
        ).build_transaction({
            'from': cuenta.address,
            'nonce': web3.eth.get_transaction_count(cuenta.address),
            'gas': 200000,
            'gasPrice': web3.eth.gas_price
        })

        signed_tx = cuenta.sign_transaction(tx)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        print(f"✅ Transacción enviada: {tx_hash.hex()}")

        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"📝 Recibo: Block {receipt.blockNumber}, Estado: {'Éxito' if receipt.status == 1 else 'Fallido'}")

        if receipt.status == 1:
            logs = contrato.events.LicenciaEmitida().process_receipt(receipt)
            if logs:
                print(f"🎉 Evento: Usuario={logs[0].args.usuario}, Clave={logs[0].args.clave}")
            else:
                print("⚠️ Evento no detectado")
    except Exception as e:
        print(f"❌ Error en transacción: {str(e)}")

if __name__ == "__main__":
    prueba_definitiva()