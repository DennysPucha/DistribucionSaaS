from web3 import Web3
import json
import os
from dotenv import load_dotenv

load_dotenv()

# --- Configuración ---
WEB3_PROVIDER_URL = os.getenv("WEB3_PROVIDER_URL")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")
DEPLOYER_PRIVATE_KEY = os.getenv("DEPLOYER_PRIVATE_KEY")

# --- Cargar ABI ---
try:
    with open("app/Model/Contracts/ContratoLicencia.json", "r") as f:
        CONTRACT_ABI = json.load(f)
except (FileNotFoundError, json.JSONDecodeError) as e:
    raise RuntimeError(f"Error al cargar el ABI del contrato: {e}")

# --- Conexión Web3 ---
if not WEB3_PROVIDER_URL:
    raise ValueError("La URL del proveedor Web3 no está configurada (WEB3_PROVIDER_URL)")

web3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER_URL))

if not web3.is_connected():
    raise ConnectionError("No se pudo conectar al proveedor Web3")

# --- Instancia del Contrato ---
if not CONTRACT_ADDRESS:
    raise ValueError("La dirección del contrato no está configurada (CONTRACT_ADDRESS)")

try:
    checksum_address = Web3.to_checksum_address(CONTRACT_ADDRESS)
    contract = web3.eth.contract(address=checksum_address, abi=CONTRACT_ABI)
except Exception as e:
    raise TypeError(f"Error al instanciar el contrato: {e}")

# --- Configuración de la cuenta del desplegador ---
if not DEPLOYER_PRIVATE_KEY:
    raise ValueError("La clave privada del desplegador no está configurada (DEPLOYER_PRIVATE_KEY)")

try:
    deployer_account = web3.eth.account.from_key(DEPLOYER_PRIVATE_KEY)
    web3.eth.default_account = deployer_account.address
except Exception as e:
    raise ValueError(f"Clave privada inválida: {e}")

def send_transaction(function_call):
    """
    Construye, firma y envía una transacción al contrato.
    """
    try:
        gas_estimate = function_call.estimate_gas({'from': deployer_account.address})
        tx = function_call.build_transaction({
            'from': deployer_account.address,
            'nonce': web3.eth.get_transaction_count(deployer_account.address),
            'gas': gas_estimate,
            'gasPrice': web3.eth.gas_price,
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key=DEPLOYER_PRIVATE_KEY)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)
        tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        return tx_receipt
    except Exception as e:
        print(f"Error en la transacción: {e}")
        return None