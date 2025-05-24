import React from 'react';
import './GestionUsuarios.css';

const GestionUsuarios = () => {
  return (
    <div className="visualiza-admin-panel">
      <h3 className="visualiza-admin-title">Gestión de usuarios</h3>
      <div className="visualiza-admin-acciones">
        <button className="visualiza-btn visualiza-btn-admin">Crear usuario</button>
        <button className="visualiza-btn visualiza-btn-admin">Editar usuario</button>
        <button className="visualiza-btn visualiza-btn-admin">Eliminar usuario</button>
      </div>
    </div>
  );
};

export default GestionUsuarios;
