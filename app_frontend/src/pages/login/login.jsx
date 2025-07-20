import './styles.css';
import iconMetamask from '../../public/iconMetamask.png';

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Distribución de licencias SaaS</h1>
        <p className="login-subtitle">Conecta tu billetera para acceder</p>

        <div className="metamask-button" onClick={() => alert('Conectar MetaMask')}>
          <img src={iconMetamask} />
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
