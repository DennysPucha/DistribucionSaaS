import '../login/login.css';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Página no encontrada</h1>
        <p className="login-subtitle">Lo sentimos, la página que buscas no existe.</p>

        <button
          className="metamask-button"
          style={{ justifyContent: 'center' }}
          onClick={() => navigate('/')}
        >
          <span>Volver al inicio</span>
        </button>
      </div>
    </div>
  );
}

export default NotFound;
