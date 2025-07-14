from web3.auto import w3
from eth_account.messages import encode_defunct
from app.Core.jwt import create_access_token

def verify_signature(address: str, signature: str, nonce: str) -> bool:
    message = encode_defunct(text=nonce)
    recovered = w3.eth.account.recover_message(message, signature=signature)
    return recovered.lower() == address.lower()

def login_with_wallet(address: str, signature: str, nonce: str):
    if not verify_signature(address, signature, nonce):
        return None
    return create_access_token(data={"sub": address})
