from web3 import Web3
import json
import os
from dotenv import load_dotenv
import random
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
print("\n=== Diagnóstico Completo ===")
print(f"Conectado: {web3.is_connected()}")
print(f"Último bloque: {web3.eth.block_number}")
print(f"Chain ID: {web3.eth.chain_id}")
print(f"Cuentas disponibles: {web3.eth.accounts}")
print(f"Saldo primera cuenta: {web3.from_wei(web3.eth.get_balance(web3.eth.accounts[0]), 'ether')} ETH")

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

def send_transaction(function_call, from_address=None, private_key=None):
    class DummyReceipt:
        def __init__(self):
            self.status = 1
            self.blockNumber = random.randint(1000000, 9999999)
            self.transactionHash = b'\x12' * 32

    return DummyReceipt()

class DummyFunctionCall:
    def __init__(self, fn_name):
        self.fn_name = fn_name
