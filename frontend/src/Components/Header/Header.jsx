import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import './Header.css';

const Header = () => {
  const { rol, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <img src="/banner-1.jpg" alt="Logo" className="header-logo-img" />
        </Link>
        
        <nav className="header-nav">
          {rol && (
            <>
              <Link to="/visualiza" className="header-nav-link">
                Visualizar Proyectos
              </Link>
              {rol === 'docente' && (
                <Link to="/createproject" className="header-nav-link">
                  Crear Proyecto
                </Link>
              )}
              {rol === 'coordinador' && (
                <Link to="/seguimiento" className="header-nav-link">
                  Seguimiento
                </Link>
              )}
            </>
          )}
        </nav>

        <div className="header-auth">
          {rol ? (
            <button onClick={handleLogout} className="header-btn">
              Cerrar Sesión
            </button>
          ) : (
            <Link to="/login" className="header-btn">
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
