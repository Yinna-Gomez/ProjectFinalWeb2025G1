import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Drawer from '@mui/material/Drawer';
import './Header.css';

const menuItems = [
  { label: 'Inicio', href: '#' },
  { label: 'Misión', href: '#' },
  { label: 'Visión', href: '#' },
  { label: 'Acerca de', href: '#' },
];

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <AppBar position="fixed" color="transparent" className="header-appbar" elevation={1}>
      <Toolbar className="header-toolbar">
        {/* Ícono hamburguesa solo visible en móvil */}
        <Box className="header-mobile-left">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            className="header-menu-icon"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Box className="header-inner">
          <Typography variant="h6" className="header-logo" noWrap>
            <img
              src="/logo.png" // Asegúrate que el archivo se llame logo.png y esté en la carpeta public
              alt="Logo institucional"
              className="header-logo-img"
            />
          </Typography>
          <Box className="header-menu">
            {menuItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                className="header-menu-btn"
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Button
            variant="contained"
            className="header-login-btn"
          >
            Iniciar Sesión
          </Button>
        </Box>
        {/* Ícono usuario solo visible en móvil */}
        <Box className="header-mobile-right">
          <IconButton color="inherit" className="header-login-icon">
            <AccountCircle />
          </IconButton>
        </Box>
        {/* Drawer para menú hamburguesa (solo estructura, sin contenido por ahora) */}
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerClose}>
          <Box sx={{ width: 250, p: 2 }} role="presentation" onClick={handleDrawerClose}>
            {menuItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                className="drawer-menu-btn"
                fullWidth
                sx={{
                  justifyContent: 'flex-start',
                  color: 'var(--color-text)',
                  fontWeight: 500,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: '6px',
                  mb: 1,
                  px: 2,
                  py: 1.5,
                  '&:hover': {
                    background: 'var(--color-hover)',
                    color: 'var(--color-accent)',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
