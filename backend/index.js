import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import User from './Models/user.js';
import Proyecto from './Models/proyecto.js';

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/ondas-col');


// Ruta de login
app.post('/api/login', async (req, res) => {
  const { usuario, contrasenia } = req.body;
  try {
    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (user.contrasenia !== contrasenia) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    res.json({
      message: 'Login exitoso',
      usuario: user.usuario,
      rol: user.rol,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/api/usuarios', async (req, res) => {
  const usuarios = await User.find({});
  res.json(usuarios);
});

// Obtener todos los proyectos
app.get('/api/proyectos', async (req, res) => {
  try {
    const proyectos = await Proyecto.find({});
    res.json(proyectos);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
});

// Normaliza el estado para comparación (mayúsculas y tildes)
function normalizaEstado(estado) {
  if (!estado) return '';
  const map = {
    'activo': 'Activo',
    'formulacion': 'Formulación',
    'formulación': 'Formulación',
    'evaluacion': 'Evaluación',
    'evaluación': 'Evaluación',
    'finalizado': 'Finalizado',
  };
  const key = estado.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return map[key] || estado;
}

// Actualizar el estado de un proyecto (PUT /api/proyectos/:id/estado)
app.put('/api/proyectos/:id/estado', async (req, res) => {
  const { id } = req.params;
  let { estado, observacion } = req.body;
  try {
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) return res.status(404).json({ message: 'Proyecto no encontrado' });
    const ESTADOS = ['Activo', 'Formulación', 'Evaluación', 'Finalizado'];
    // Normaliza ambos estados
    const estadoActual = normalizaEstado(proyecto.estado);
    const estadoNuevo = normalizaEstado(estado);
    const idxActual = ESTADOS.indexOf(estadoActual);
    const idxNuevo = ESTADOS.indexOf(estadoNuevo);
    if (idxNuevo === -1 || idxNuevo > idxActual + 1 || idxNuevo < idxActual) {
      return res.status(400).json({ message: 'Transición de estado no permitida' });
    }
    proyecto.estado = estadoNuevo;
    if (observacion !== undefined) proyecto.observacion = observacion;
    await proyecto.save();
    res.json({ message: 'Estado actualizado', proyecto });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
});

app.listen(3001, () => console.log('Servidor backend en puerto 3001'));
