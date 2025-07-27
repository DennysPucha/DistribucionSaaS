import './topbar.css';

function Topbar({ onToggleSidebar }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-toggle" onClick={onToggleSidebar}>☰</button>
        <span className="topbar-title">Distribución de licencias SaaS</span>
      </div>
    </header>
  );
}

export default Topbar;
