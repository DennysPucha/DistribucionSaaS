import './styles.css';
import iconMetamask from '../../public/iconMetamask.png';
import { BrowserProvider } from 'ethers';
import {POST} from '../../utils/methods/methods.js';

function Login() {

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Instala MetaMask");

    // 1. Crear provider usando BrowserProvider
    const provider = new BrowserProvider(window.ethereum);

    // 2. Solicitar cuentas (pedir permiso)
    await provider.send("eth_requestAccounts", []);

    // 3. Obtener signer (cuenta activa)
    const signer = await provider.getSigner();

    // 4. Obtener dirección
    const address = await signer.getAddress();

    // 5. Solicitar nonce al backend
    
    const nonce = await POST("auth/request-nonce", { address });

    // 6. Firmar nonce con el signer
    const signature = await signer.signMessage(nonce);

    // 7. Mandar login al backend
    const loginRes = await POST("auth/login", {
      address,
      signature,
      nonce
    });

    const loginData = await loginRes.json();
    console.log("Token recibido:", loginData.access_token);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Distribución de licencias SaaS</h1>
        <p className="login-subtitle">Conecta tu billetera para acceder</p>

        <div className="metamask-button" onClick={connectWallet}>
          <img src={iconMetamask} alt="MetaMask" />
          <span>Conectar con MetaMask</span>
        </div>

        <div className="terminos">
          <p>
            Al hacer clic en "Conectar con MetaMask", aceptas nuestros{' '}
            <a href="https://example.com/terminos" target="_blank" rel="noopener noreferrer">
              términos y condiciones
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
