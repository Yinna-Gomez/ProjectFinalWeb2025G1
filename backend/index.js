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
import https from 'https';
import fs from 'fs';
import User from './Models/user.js';
import Proyecto from './Models/proyecto.js';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS para desarrollo
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173'], // Permitir ambos puertos en desarrollo
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
app.use(express.json());

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
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
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

/**
 * @route POST /api/login
 * @desc Autenticar usuario y generar tokens
 * @access Public
 */
app.post('/api/login', async (req, res) => {
  const { usuario, contrasenia } = req.body;
  try {
    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (user.contrasenia !== contrasenia) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    
    const accessToken = generarAccessToken(user);
    const refreshToken = generarRefreshToken(user);

    res.json({
      message: 'Login exitoso',
      accessToken,
      refreshToken,
      usuario: user.usuario,
      rol: user.rol,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      id: user._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

/**
 * @route POST /api/refresh
 * @desc Renovar token de acceso usando refresh token
 * @access Public
 */
app.post('/api/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    User.findOne({ usuario: decoded.usuario })
      .then(user => {
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        const accessToken = generarAccessToken(user);
        res.json({ accessToken });
      });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

/**
 * @route POST /api/logout
 * @desc Invalidar refresh token
 * @access Public
 */
app.post('/api/logout', (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens.delete(refreshToken);
  res.json({ message: 'Logout exitoso' });
});

// Rutas protegidas
app.get('/api/usuarios', verificarToken, async (req, res) => {
  const usuarios = await User.find({});
  res.json(usuarios);
});

app.get('/api/proyectos', verificarToken, async (req, res) => {
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
    const ESTADOS = ['formulacion', 'evaluacion', 'activo', 'inactivo', 'finalizado'];
    // Normaliza ambos estados
    const estadoActual = (proyecto.estado || '').toLowerCase();
    const estadoNuevo = (estado || '').toLowerCase();
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
      creadoPor: req.usuario.usuario // Usar el usuario del token
    };
    const nuevoProyecto = new Proyecto(proyectoData);
    await nuevoProyecto.save();
    res.status(201).json({ message: 'Proyecto creado', proyecto: nuevoProyecto });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear proyecto', error: err.message });
  }
});

// Configuración de HTTPS para producción
if (process.env.NODE_ENV === 'production') {
  const httpsOptions = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH)
  };
  
  https.createServer(httpsOptions, app)
    .listen(process.env.PORT || 3001, () => {
      console.log(`Servidor HTTPS corriendo en puerto ${process.env.PORT || 3001}`);
    });
} else {
  app.listen(process.env.PORT || 3001, () => {
    console.log(`Servidor HTTP corriendo en puerto ${process.env.PORT || 3001}`);
  });
}
