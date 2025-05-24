import React, { useState, useContext, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Modal
} from '@mui/material';
import AddMember from '../AddMember/AddMember';
import './CreateProject.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Components/AuthContext';
import CronogramaModal from './CronogramaModal';
import './CronogramaModal.css';

// Utilidad para generar usuario y contraseña aleatorios
function randomString(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let str = '';
  for (let i = 0; i < length; i++) str += chars[Math.floor(Math.random() * chars.length)];
  return str;
}

const initialProject = {
  titulo: '',
  presupuesto: '',
  area: '',
  institucion: '',
  objetivos: '',
  cronograma: '',
  observaciones: '',
  integrantes: [],
};

const CreateProject = () => {
  // Estado del proyecto y de los integrantes
  const [project, setProject] = useState(initialProject);
  const [integrantes, setIntegrantes] = useState([]); // Array temporal de integrantes
  const [usuariosTemp, setUsuariosTemp] = useState([]); // Usuarios temporales
  const [cronograma, setCronograma] = useState([]); // Cronograma temporal
  const [modalOpen, setModalOpen] = useState(false); // Controla el modal de AddMember
  const [modalCronograma, setModalCronograma] = useState(false); // Modal de cronograma
  const [actividad, setActividad] = useState({ actividad: '', fechainicio: '', fechafin: '' });
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [confirmar, setConfirmar] = useState(false);
  const { rol } = useContext(AuthContext);
  const usuarioActual = localStorage.getItem('usuario');
  const navigate = useNavigate();

  // Protección de ruta: solo docente
  useEffect(() => {
    if (rol !== 'docente') {
      navigate('/login');
    }
  }, [rol, navigate]);

  // Maneja cambios en los campos del proyecto
  const handleChange = (e) => {
    setProject({
      ...project,
      [e.target.name]: e.target.value
    });
  };

  // Abre el modal para agregar integrante
  const handleOpenModal = () => {
    setModalOpen(true);
    setMensaje('');
    setError('');
  };
  // Cierra el modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Abre/cierra modal de cronograma
  const handleOpenCronograma = () => {
    setModalCronograma(true);
    setActividad({ actividad: '', fechainicio: '', fechafin: '' });
  };
  const handleCloseCronograma = () => {
    setModalCronograma(false);
  };

  // Agregar actividad al cronograma
  const handleAddActividad = () => {
    if (!actividad.actividad || !actividad.fechainicio || !actividad.fechafin) {
      alert('Todos los campos de la actividad son obligatorios');
      return;
    }
    if (new Date(actividad.fechainicio) > new Date(actividad.fechafin)) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin');
      return;
    }
    setCronograma(prev => [...prev, actividad]);
    setModalCronograma(false);
  };

  // Maneja la adición de un integrante desde el modal
  const handleAddIntegrante = async (integranteForm) => {
    setError('');
    setMensaje('');
    // Validación de campos del integrante
    if (!integranteForm.firstName || !integranteForm.lastName || !integranteForm.idType || !integranteForm.idNumber || !integranteForm.grade || !integranteForm.correo) {
      alert('Todos los campos del integrante son obligatorios');
      return;
    }
    // Genera usuario y contraseña únicos
    let usuario, existe;
    do {
      usuario = 'est' + randomString(4);
      existe = await fetch(`http://localhost:3001/api/usuarios/${usuario}`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null);
    } while (existe);
    const contrasenia = randomString(8);
    // Guarda el usuario temporalmente
    setUsuariosTemp(prev => [...prev, {
      usuario,
      contrasenia,
      nombre: integranteForm.firstName,
      apellido: integranteForm.lastName,
      correo: integranteForm.correo,
      rol: 'integrante',
      tipoIdentificacion: integranteForm.idType,
      identificacion: integranteForm.idNumber,
      gradoEscolar: integranteForm.grade,
    }]);
    // Agrega el integrante al array local (sin usuario/contraseña)
    setIntegrantes(prev => [...prev, {
      nombre: integranteForm.firstName,
      apellido: integranteForm.lastName,
      tipoidentificacion: integranteForm.idType,
      identificacion: integranteForm.idNumber,
      gradoEscolar: integranteForm.grade,
      correo: integranteForm.correo,
      observaciones: '',
      estado: 'activo',
    }]);
    setModalOpen(false);
    alert('Integrante agregado correctamente');
  };

  // Validación de campos del proyecto
  const validarProyecto = () => {
    if (!project.titulo || !project.presupuesto || !project.area || !project.institucion || !project.objetivos) {
      return 'Todos los campos del proyecto son obligatorios';
    }
    if (integrantes.length === 0) {
      return 'Debe agregar al menos un integrante';
    }
    if (cronograma.length < 3) {
      return 'Debe agregar al menos 3 actividades al cronograma';
    }
    return '';
  };

  // Maneja la creación del proyecto
  const handleSubmit = async () => {
    setError('');
    setMensaje('');
    const errorMsg = validarProyecto();
    if (errorMsg) {
      alert(errorMsg);
      setError(errorMsg);
      return;
    }
    // Confirmación antes de crear
    setConfirmar(true);
  };

  // Confirma y envía el proyecto a la base de datos y los usuarios
  const handleConfirmarCrear = async () => {
    setConfirmar(false);
    // Prepara el objeto proyecto para la base de datos
    const proyectoData = {
      titulo: project.titulo,
      presupuesto: project.presupuesto,
      area: project.area,
      institucion: project.institucion,
      objetivos: project.objetivos,
      cronograma,
      observaciones: project.observaciones,
      integrantes,
      historialestado: [{ estado: 'formulacion', fecha: new Date().toISOString(), observacion: '' }],
      archivos: [],
      estado: 'formulacion',
      creadoPor: usuarioActual || '',
    };
    // Envía el proyecto a la colección proyectos
    const res = await fetch('http://localhost:3001/api/proyectos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proyectoData),
    });
    if (res.ok) {
      // Envía cada usuario a la colección usuarios
      for (const usuario of usuariosTemp) {
        await fetch('http://localhost:3001/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(usuario),
        });
      }
      alert('Proyecto y usuarios creados exitosamente');
      setProject(initialProject);
      setIntegrantes([]);
      setUsuariosTemp([]);
      setCronograma([]);
    } else {
      alert('No se pudo crear el proyecto');
      setError('No se pudo crear el proyecto');
    }
  };

  return (
    <div className="createproject-container">
      {/* Botón Volver */}
      <button
        className="createproject-btn"
        style={{ marginBottom: 16, width: 120 }}
        onClick={() => navigate('/visualiza')}
      >
        Volver
      </button>
      {/* --- FLUJO: Formulario principal de proyecto --- */}
      <div className="createproject-form">
        <h2 className="createproject-title">Crear Proyecto</h2>
        {error && <div style={{ color: '#e74c3c', fontWeight: 600, marginBottom: 8 }}>{error}</div>}
        {mensaje && <div style={{ color: 'var(--color-accent)', fontWeight: 600, marginBottom: 8 }}>{mensaje}</div>}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Título"
              name="titulo"
              value={project.titulo}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Presupuesto"
              name="presupuesto"
              value={project.presupuesto}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Área"
              name="area"
              value={project.area}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Institución Educativa"
              name="institucion"
              value={project.institucion}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Objetivos"
              name="objetivos"
              value={project.objetivos}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <button
              className="createproject-btn"
              style={{ width: '100%', height: 48 }}
              onClick={handleOpenModal}
              type="button"
            >
              Agregar Integrantes
            </button>
          </Grid>
          <Grid item xs={12} md={6}>
            <button
              className="createproject-btn"
              style={{ width: '100%', height: 48 }}
              onClick={handleOpenCronograma}
              type="button"
            >
              Agregar Actividad al Cronograma
            </button>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Observaciones"
              name="observaciones"
              value={project.observaciones}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        {/* Lista de integrantes agregados */}
        {integrantes.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 className="createproject-title" style={{ fontSize: '1.1rem' }}>Integrantes agregados:</h3>
            <ul>
              {integrantes.map((i, idx) => (
                <li key={idx}>{i.nombre} {i.apellido} - {i.tipoidentificacion}: {i.identificacion} - Grado: {i.gradoEscolar} - Correo: {i.correo}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Lista de actividades del cronograma */}
        {cronograma.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 className="createproject-title" style={{ fontSize: '1.1rem' }}>Cronograma:</h3>
            <ul>
              {cronograma.map((a, idx) => (
                <li key={idx}>{a.actividad} | Inicio: {a.fechainicio} | Fin: {a.fechafin}</li>
              ))}
            </ul>
          </div>
        )}
        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <button
            className="createproject-btn"
            style={{ minWidth: 180 }}
            onClick={handleSubmit}
            type="button"
          >
            Crear Proyecto
          </button>
        </div>
      </div>
      {/* --- FLUJO: Modal para agregar integrantes --- */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 320,
          maxWidth: 400
        }}>
          <AddMember onAdd={handleAddIntegrante} onCancel={handleCloseModal} />
        </Box>
      </Modal>
      {/* --- FLUJO: Modal para agregar actividades al cronograma --- */}
      <CronogramaModal
        open={modalCronograma}
        onClose={handleCloseCronograma}
        onAdd={handleAddActividad}
        actividad={actividad}
        setActividad={setActividad}
      />
      {/* --- FLUJO: Confirmación antes de crear proyecto --- */}
      <Modal open={confirmar} onClose={() => setConfirmar(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 320,
          maxWidth: 400,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ mb: 2 }}>¿Está seguro de crear el proyecto con los integrantes y cronograma actuales?</Typography>
          <Button variant="contained" sx={{ mr: 2, backgroundColor: 'var(--color-primary)' }} onClick={handleConfirmarCrear}>Sí, crear</Button>
          <Button variant="outlined" className="visualiza-btn" onClick={() => setConfirmar(false)}>Cancelar</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateProject;