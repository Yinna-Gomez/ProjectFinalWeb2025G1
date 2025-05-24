import React, { useState, useContext, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { AuthContext } from '../../Components/AuthContext';
import GestionUsuarios from './GestionUsuarios';
import { useNavigate } from 'react-router-dom';
import './VisualizaPage.css';

const ESTADOS = [
  'Activo',
  'Formulación',
  'Evaluación',
  'Finalizado'
];

function VisualizaPage() {
  const [tab, setTab] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const { rol } = useContext(AuthContext);
  const [proyectos, setProyectos] = useState([]);
  const [estadosProyectos, setEstadosProyectos] = useState({});
  const navigate = useNavigate();

  // Redirección si no hay sesión iniciada
  useEffect(() => {
    if (!rol || rol === 'null' || rol === '') {
      navigate('/login');
    }
  }, [rol, navigate]);

  // Fetch proyectos desde backend
  useEffect(() => {
    fetch('http://localhost:3001/api/proyectos')
      .then(res => res.json())
      .then(data => {
        setProyectos(data);
        // Inicializa estadosProyectos con los estados actuales de la BD
        const estados = {};
        data.forEach(p => {
          estados[p._id] = { estado: p.estado || '', observacion: '' };
        });
        setEstadosProyectos(estados);
      });
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  // Abrir detalle de proyecto
  const handleProyectoClick = (proyecto) => {
    navigate(`/detailproject?id=${proyecto._id}`);
  };

  const handleEstadoChange = (id, nuevoEstado) => {
    setEstadosProyectos(prev => ({
      ...prev,
      [id]: { ...prev[id], estado: nuevoEstado }
    }));
  };
  const handleObsChange = (id, obs) => {
    setEstadosProyectos(prev => ({
      ...prev,
      [id]: { ...prev[id], observacion: obs }
    }));
  };

  const handleGuardarEstado = async (proy) => {
    const nuevoEstado = estadosProyectos[proy._id]?.estado || proy.estado || 'Activo';
    const observacion = estadosProyectos[proy._id]?.observacion || '';
    // Actualiza en backend
    await fetch(`http://localhost:3001/api/proyectos/${proy._id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado, observacion })
    });
    // Refresca proyectos
    fetch('http://localhost:3001/api/proyectos')
      .then(res => res.json())
      .then(data => setProyectos(data));
  };

  // Renderiza la lista de proyectos
  const renderProyectos = (proyectosMostrar) => {
    if (!proyectosMostrar || proyectosMostrar.length === 0) {
      return (
        <div style={{ color: 'var(--color-muted)', textAlign: 'center', margin: '2rem 0' }}>
          No hay proyectos para mostrar.
        </div>
      );
    }
    return (
      <div className="visualiza-proyectos-grid">
        {proyectosMostrar.map(proy => {
          // Estado actual
          const estadoActual = estadosProyectos[proy._id]?.estado || proy.estado || 'Activo';
          const idxActual = ESTADOS.indexOf(estadoActual);
          return (
            <div key={proy._id} className="visualiza-proyecto-card">
              <div className="visualiza-proyecto-header">
                <span className="visualiza-proyecto-titulo" onClick={() => handleProyectoClick(proy)}>
                  {proy.titulo || <span style={{ color: 'var(--color-muted)' }}>[Sin título]</span>}
                </span>
                <span className={`visualiza-estado-label visualiza-estado-${estadoActual.toLowerCase()}`}>{estadoActual}</span>
              </div>
              {/* Solo el coordinador puede cambiar el estado y observación */}
              {rol === 'coordinador' && (
                <div className="visualiza-estado-form-row visualiza-estado-form-row-inline">
                  <select
                    className="visualiza-select-estado"
                    value={estadoActual}
                    onChange={e => handleEstadoChange(proy._id, e.target.value)}
                  >
                    {ESTADOS.map((op, idx) => (
                      <option key={op} value={op} disabled={idx > idxActual + 1 || idx < idxActual}>
                        {op}
                      </option>
                    ))}
                  </select>
                  <textarea
                    className="visualiza-textarea-observacion"
                    placeholder="Observación del cambio de estado"
                    value={estadosProyectos[proy._id]?.observacion || ''}
                    onChange={e => handleObsChange(proy._id, e.target.value)}
                  />
                  <button
                    className="visualiza-btn visualiza-btn-admin visualiza-btn-guardar-estado"
                    onClick={async () => {
                      const nuevoEstado = estadosProyectos[proy._id]?.estado || proy.estado || 'Activo';
                      const observacion = estadosProyectos[proy._id]?.observacion || '';
                      // Lógica de guardado con control de error
                      const res = await fetch(`http://localhost:3001/api/proyectos/${proy._id}/estado`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ estado: nuevoEstado, observacion })
                      });
                      if (res.ok) {
                        // Solo refresca si el backend responde OK
                        fetch('http://localhost:3001/api/proyectos')
                          .then(res => res.json())
                          .then(data => setProyectos(data));
                      } else {
                        // Si falla, NO cambia el estado en UI y muestra alerta
                        alert('No se pudo actualizar el estado en la base de datos.');
                        // Opcional: refresca para mantener sincronizado
                        fetch('http://localhost:3001/api/proyectos')
                          .then(res => res.json())
                          .then(data => setProyectos(data));
                      }
                    }}
                  >
                    Guardar
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Filtrado por búsqueda (nombre de proyecto)
  const proyectosFiltrados = proyectos.filter(p =>
    p.titulo && p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Para el coordinador, mostrar una sola lista general
  return (
    <div className="visualiza-panel-container visualiza-panel-wide visualiza-panel-flex">
      <div className="visualiza-panel visualiza-panel-main">
        <div className="visualiza-header-row">
          <div className="visualiza-buscador">
            <input
              type="text"
              placeholder="Buscar proyecto..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              className="visualiza-input-busqueda"
            />
          </div>
        </div>
        {rol === 'coordinador' ? (
          // Solo una lista general para coordinador
          <div className="visualiza-tab-content">
            {renderProyectos(proyectosFiltrados)}
          </div>
        ) : (
          // Tabs para otros roles
          <>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              className="visualiza-tabs"
              variant="fullWidth"
            >
              <Tab label="Mis proyectos" />
              <Tab label="Otros proyectos" />
            </Tabs>
            <div className="visualiza-tab-content">
              {tab === 0 && (
                <>
                  {renderProyectos(proyectosFiltrados)}
                  <div className="visualiza-acciones">
                    <button className="visualiza-btn">Registrar avance</button>
                    <button className="visualiza-btn">Generar reportes</button>
                  </div>
                </>
              )}
              {tab === 1 && renderProyectos([])}
            </div>
          </>
        )}
      </div>
      {/* Panel lateral solo para coordinador */}
      {rol === 'coordinador' && (
        <aside className="visualiza-panel visualiza-panel-lateral">
          <GestionUsuarios />
        </aside>
      )}
    </div>
  );
}

export default VisualizaPage;
