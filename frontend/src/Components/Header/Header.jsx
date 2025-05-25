import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import './Header.css';

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const Header = () => {
  const { rol, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Botón flotante para volver al panel
  const handleGoToPanel = () => {
    if (rol === 'docente' || rol === 'coordinador') {
      navigate('/visualiza');
    } else if (rol === 'integrante') {
      const correo = localStorage.getItem('correo')?.toLowerCase();
      // Los estudiantes serán redirigidos automáticamente desde VisualizaPage
      navigate('/visualiza');
    }
  };

  // Menú para móvil
  const mobileMenu = (
    <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
      <List sx={{ minWidth: 220 }}>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/" onClick={() => setDrawerOpen(false)}>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { scrollToSection('mision'); setDrawerOpen(false); }}>
            <ListItemText primary="Misión" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { scrollToSection('vision'); setDrawerOpen(false); }}>
            <ListItemText primary="Visión" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => { scrollToSection('acerca-de'); setDrawerOpen(false); }}>
            <ListItemText primary="Acerca de" />
          </ListItemButton>
        </ListItem>
        {rol && (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={() => {
                handleGoToPanel();
                setDrawerOpen(false);
              }}>
                <ListItemIcon><DashboardIcon color="primary" /></ListItemIcon>
                <ListItemText primary="Mi Panel" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => { handleLogout(); setDrawerOpen(false); }}>
                <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </ListItem>
          </>
        )}
        {!rol && (
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login" onClick={() => setDrawerOpen(false)}>
              <ListItemIcon><LoginIcon color="primary" /></ListItemIcon>
              <ListItemText primary="Iniciar Sesión" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );

  // Menú de navegación principal
  const navLinks = [
    { label: 'Inicio', to: '/', onClick: null },
    { label: 'Misión', to: '#mision', onClick: () => scrollToSection('mision') },
    { label: 'Visión', to: '#vision', onClick: () => scrollToSection('vision') },
    { label: 'Acerca de', to: '#acerca-de', onClick: () => scrollToSection('acerca-de') },
  ];

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <img src="/logo.png" alt="Logo" className="header-logo-img" />
          </Link>

          {/* Menú escritorio */}
          <nav className="header-nav">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="header-nav-link"
                onClick={e => {
                  if (isHomePage && link.onClick) {
                    e.preventDefault();
                    link.onClick();
                  }
                }}
              >
                {link.label}
              </a>
            ))}
            {rol && (
              <>
                <Button
                  className="header-nav-link"
                  onClick={handleGoToPanel}
                  startIcon={<DashboardIcon />}
                >
                  Mi Panel
                </Button>
              </>
            )}
          </nav>

          {/* Botones de sesión */}
          <div className="header-auth">
            {rol ? (
              <Button
                variant="contained"
                color="primary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                className="header-btn"
                sx={{ ml: 1 }}
              >
                Salir
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                component={Link}
                to="/login"
                className="header-btn"
                sx={{ ml: 1 }}
              >
                Iniciar Sesión
              </Button>
            )}
            {/* Menú hamburguesa solo en móvil */}
            <IconButton
              className="header-menu-btn"
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { md: 'none' } }}
              size="large"
              color="primary"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </header>
      {mobileMenu}
      {/* Botón flotante para volver al panel */}
      {isHomePage && rol && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<DashboardIcon />}
          className="floating-panel-btn"
          onClick={handleGoToPanel}
        >
          Volver a mi panel
        </Button>
      )}
    </>
  );
};

export default Header;
