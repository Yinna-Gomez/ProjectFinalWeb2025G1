import React, { useState } from 'react';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import "./Header.css"; // Import your CSS file for styling

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} className="header-drawer">
      <List className="header-drawer-list">
        {["Home", "Misión", "Visión", "Acerca de"].map((item) => (
          <ListItem key={item} disablePadding className="header-drawer-item">
            <ListItemButton>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static" className="header-container">
        <Toolbar className="header-toolbar">
          <Box className="header-logo">
            <Typography variant="subtitle1">LOGO</Typography>
          </Box>

          {/* Menú de navegación para pantallas grandes */}
          <Box className="header-nav">
            {["Home", "Misión", "Visión", "Acerca de"].map((item) => (
              <a key={item} href="#" className="header-link">
                {item}
              </a>
            ))}
          </Box>

          {/* Botón de acción */}
          <Button className="header-button">Iniciar Sesión</Button>

          {/* Ícono del menú para pantallas pequeñas */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            className="header-menu-icon"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer para menú móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header;

