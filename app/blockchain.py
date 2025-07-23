from web3 import Web3
import json
import os
from dotenv import load_dotenv

load_dotenv()

WEB3_PROVIDER = os.getenv("WEB3_PROVIDER")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS")

# Cargar el ABI (Application Binari Interface)
with open("app/Contracts/ContratoLicencia.json", "r") as f:
    abi_json = json.load(f)
    CONTRACT_ABI = abi_json["abi"]  # solo la propiedad ABI

# Conectar a la red
web3 = Web3(Web3.HTTPProvider(WEB3_PROVIDER))

# Crear instancia del contrato
contract = web3.eth.contract(address=Web3.to_checksum_address(CONTRACT_ADDRESS), abi=CONTRACT_ABI)
