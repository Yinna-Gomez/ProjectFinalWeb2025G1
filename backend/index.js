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
import avancesRoutes from './routes/avances.js';
import proyectosRoutes from './routes/proyectos.js';
import usuariosRoutes from './routes/usuarios.js';
import authRoutes from './routes/auth.js';

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS para desarrollo y producción
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
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

// Configuración de CORS y middlewares
app.use(cors(corsOptions));
app.use(express.json());

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas
app.use('/api/usuarios', verificarToken, usuariosRoutes);
app.use('/api/proyectos', verificarToken, proyectosRoutes);
app.use('/api/proyectos', verificarToken, avancesRoutes);

// Ruta de prueba opcional
app.get('/', (req, res) => {
  res.send('API corriendo correctamente');
});

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
mongoose.connect(process.env.MONGODB_URI)
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
      correo: user.correo.toLowerCase(),
      id: user._id
    });
  } catch (err) {
    console.error('Error en login:', err);
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

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error en el servidor:', err);
  res.status(500).json({ 
    mensaje: 'Error interno del servidor', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.error('Excepción no capturada:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Rechazo de promesa no manejado:', reason);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor HTTP corriendo en puerto ${PORT}`);
});
