import React from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-info">
        <h3 className="footer-title">Información de contacto</h3>
        <div className="footer-row"><LocationOnIcon className="footer-icon" /><span>Av. Calle 26 No. 57 - 83</span></div>
        <div className="footer-row"><ApartmentIcon className="footer-icon" /><span>Torre 8 - Pisos del 2 al 6</span></div>
        <div className="footer-row"><span className="footer-label">Código postal:</span> 111321</div>
        <div className="footer-row"><MarkunreadIcon className="footer-icon" /><span>Correo: <a href="mailto:ondas@minciencias.gov.co" className="footer-link">ondas@minciencias.gov.co</a></span></div>
        <div className="footer-row"><LocalPhoneIcon className="footer-icon" /><span>Tel: (57) (1) 6258480 ext. 5405</span></div>
      </div>
      <div className="footer-separator" />
      <div className="footer-hours">
        <h4 className="footer-hours-title"><AccessTimeIcon className="footer-icon" /> HORARIO</h4>
        <div className="footer-row">Lunes a jueves 8:00 a.m. - 5:00 p.m.</div>
        <div className="footer-row">Viernes 7:00 a.m. - 4:00 p.m.</div>
      </div>
    </div>
  </footer>
);

export default Footer; 