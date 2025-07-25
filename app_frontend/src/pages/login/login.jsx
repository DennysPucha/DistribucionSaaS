import './login.css';
import iconMetamask from '../../public/iconMetamask.png';
import { BrowserProvider } from 'ethers';
import { POST } from '../../utils/methods/methods.js';
import { useNavigate } from 'react-router-dom';
import AlertaOscura from '../componentes/alertas/alertaOscura.jsx';
import { setSession } from '../../utils/methods/session.js';
import { useState } from 'react';

function Login() {
  const navigate = useNavigate();

  const [alerta, setAlerta] = useState({
    visible: false,
    mensaje: '',
    tipo: 'info'
  });

  const mostrarAlerta = (mensaje, tipo = 'info') => {
    setAlerta({
      visible: true,
      mensaje,
      tipo
    });
  };

  const cerrarAlerta = () => {
    setAlerta({ ...alerta, visible: false });
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        mostrarAlerta('Instala MetaMask', 'error');
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const nonceResponse = await POST("auth/request-nonce", { address });
      const nonce = nonceResponse.nonce;
      if (!nonce) {
        mostrarAlerta('Error al obtener nonce', 'error');
        return;
      }
      const signature = await signer.signMessage(nonce);
      const loginRes = await POST("auth/login", { address, signature, nonce });


      if (loginRes.access_token) {
        setSession(loginRes.access_token);
        mostrarAlerta('Inicio de sesión exitoso', 'exito');
        setTimeout(() => navigate('/licencias'), 1500);
      } else {
        mostrarAlerta('Error al iniciar sesión', 'error');
      }
    } catch (error) {
      console.error("Error en el login:", error);
      mostrarAlerta('Error inesperado al iniciar sesión', 'error');
    }
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

      {/* Mostrar alerta si está visible */}
      <AlertaOscura
        visible={alerta.visible}
        mensaje={alerta.mensaje}
        tipo={alerta.tipo}
        onClose={cerrarAlerta}
      />
    </div>
  );
}

export default Login;
