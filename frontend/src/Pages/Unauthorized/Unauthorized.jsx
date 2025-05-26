import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <h1>Acceso No Autorizado</h1>
        <p>Lo sentimos, no tienes permiso para acceder a esta página.</p>
        <button onClick={() => navigate(-1)}>Volver atrás</button>
      </div>
    </div>
  );
};

export default Unauthorized; 