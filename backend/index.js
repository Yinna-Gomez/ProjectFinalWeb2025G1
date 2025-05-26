/**
 * @fileoverview Servidor backend para la aplicación de gestión de proyectos
 * @requires express
 * @requires mongoose
 * @requires cors
 * @requires jsonwebtoken
 * @requires dotenv
 * @requires https
 * @requires fs
 */

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from './Models/user.js';
import Proyecto from './Models/proyecto.js';
import avancesRoutes from './routes/avances.js';
import proyectosRoutes from './routes/proyectos.js';
import usuariosRoutes from './routes/usuarios.js';
import authRoutes from './routes/auth.js';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS para desarrollo
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/proyectos', avancesRoutes);

// Constantes de configuración
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const TOKEN_EXPIRATION = '1h';
const REFRESH_EXPIRATION = '7d';

// Almacén temporal de refresh tokens (en producción usar Redis)
const refreshTokens = new Set();

/**
 * Middleware para verificar el token JWT
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

/**
 * Genera un nuevo token de acceso
 * @param {Object} user - Objeto usuario
 * @returns {String} Token JWT
 */
const generarAccessToken = (user) => {
  return jwt.sign(
    { 
      usuario: user.usuario,
      rol: user.rol,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION }
  );
};

/**
 * Genera un refresh token
 * @param {Object} user - Objeto usuario
 * @returns {String} Refresh token
 */
const generarRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { usuario: user.usuario },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRATION }
  );
  refreshTokens.add(refreshToken);
  return refreshToken;
};

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ondas-col')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

/**
 * @route GET /api/verify-token
 * @desc Verificar validez del token
 * @access Private
 */
app.get('/api/verify-token', verificarToken, (req, res) => {
  res.json({ valid: true, usuario: req.usuario });
});

// Rutas protegidas
app.get('/api/usuarios', verificarToken, async (req, res) => {
  const usuarios = await User.find({});
  res.json(usuarios);
});

app.get('/api/proyectos', verificarToken, async (req, res) => {
  try {
    const proyectos = await Proyecto.find({})
      .select({
        titulo: 1,
        area: 1,
        objetivos: 1,
        cronograma: 1,
        presupuesto: 1,
        institucion: 1,
        integrantes: 1,
        historialestado: 1,
        avances: 1,
        estado: 1,
        observacion: 1,
        creadoPor: 1
      })
      .lean();
    
    res.json(proyectos);
  } catch (err) {
    console.error('Error al obtener proyectos:', err);
    res.status(500).json({ mensaje: 'Error al obtener proyectos' });
  }
});

// Obtener un proyecto específico
app.get('/api/proyectos/:id', verificarToken, async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }
    res.json(proyecto);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener el proyecto' });
  }
});

// Actualizar el estado de un proyecto
app.put('/api/proyectos/:id/estado', verificarToken, async (req, res) => {
  const { id } = req.params;
  let { estado, observacion } = req.body;
  try {
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    
    const ESTADOS = ['formulacion', 'evaluacion', 'activo', 'inactivo', 'finalizado'];
    const estadoActual = (proyecto.estado || '').toLowerCase();
    const estadoNuevo = (estado || '').toLowerCase();
    const idxActual = ESTADOS.indexOf(estadoActual);
    const idxNuevo = ESTADOS.indexOf(estadoNuevo);
    
    if (idxNuevo === -1 || idxNuevo > idxActual + 1 || idxNuevo < idxActual) {
      return res.status(400).json({ mensaje: 'Transición de estado no permitida' });
    }

    proyecto.estado = estadoNuevo;
    proyecto.observacion = observacion;
    proyecto.historialestado.push({
      estado: estadoNuevo,
      fecha: new Date().toISOString(),
      observacion
    });

    await proyecto.save();
    res.json({ mensaje: 'Estado actualizado', proyecto });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar estado' });
  }
});

// Crear usuario
app.post('/api/usuarios', async (req, res) => {
  try {
    let { usuario, contrasenia, nombre, apellido, correo, rol, tipoIdentificacion, identificacion, gradoEscolar } = req.body;
    usuario = usuario.trim().toLowerCase();
    correo = correo.trim().toLowerCase();
    rol = rol.trim().toLowerCase();
    // Verifica que usuario y correo sean únicos
    const existeUsuario = await User.findOne({ usuario });
    const existeCorreo = await User.findOne({ correo });
    if (existeUsuario) return res.status(400).json({ message: 'El usuario ya existe' });
    if (existeCorreo) return res.status(400).json({ message: 'El correo ya existe' });
    const nuevo = new User({ usuario, contrasenia, nombre, apellido, correo, rol, tipoIdentificacion, identificacion, gradoEscolar });
    await nuevo.save();
    res.status(201).json({ message: 'Usuario creado', usuario: nuevo });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario' });
  }
});

// Actualizar usuario por id
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    let { usuario, contrasenia, nombre, apellido, correo, rol, tipoIdentificacion, identificacion, gradoEscolar } = req.body;
    if (usuario) usuario = usuario.trim().toLowerCase();
    if (correo) correo = correo.trim().toLowerCase();
    if (rol) rol = rol.trim().toLowerCase();
    const actualizado = await User.findByIdAndUpdate(
      req.params.id,
      { usuario, contrasenia, nombre, apellido, correo, rol, tipoIdentificacion, identificacion, gradoEscolar },
      { new: true }
    );
    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado', usuario: actualizado });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
});

// Obtener usuario por nombre de usuario
app.get('/api/usuarios/:usuario', async (req, res) => {
  try {
    const usuario = req.params.usuario.trim().toLowerCase();
    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar usuario' });
  }
});

// Eliminar usuario por id
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const eliminado = await User.findByIdAndDelete(req.params.id);
    if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
});

// Crear un nuevo proyecto
app.post('/api/proyectos', verificarToken, async (req, res) => {
  try {
    const proyectoData = {
      ...req.body,
      creadoPor: req.usuario.usuario
    };
    const nuevoProyecto = new Proyecto(proyectoData);
    await nuevoProyecto.save();
    res.status(201).json({ mensaje: 'Proyecto creado', proyecto: nuevoProyecto });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear proyecto', error: err.message });
  }
});

// Log global para cada petición entrante
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Configuración de manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ 
    mensaje: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Manejo global de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo de promesa no manejado:', reason);
});

app.get('/', (req, res) => {
  res.send('API corriendo correctamente');
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Servidor HTTP corriendo en puerto ${process.env.PORT || 3001}`);
});
