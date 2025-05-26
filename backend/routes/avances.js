import express from 'express';
import Proyecto from '../Models/proyecto.js';
import upload from '../middleware/upload.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import jwt from 'jsonwebtoken';

const unlinkAsync = promisify(fs.unlink);
const router = express.Router();

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

// Middleware para verificar si el usuario es parte del proyecto
const verificarMiembroProyecto = async (req, res, next) => {
  try {
    const proyecto = await Proyecto.findById(req.params.proyectoId);
    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }

    const usuarioActual = req.usuario.usuario;
    const esMiembro = proyecto.integrantes.some(i => i.correo === req.usuario.correo) || 
                     proyecto.creadoPor === usuarioActual;

    if (!esMiembro) {
      return res.status(403).json({ mensaje: 'No tienes permiso para realizar esta acción' });
    }
    
    req.proyecto = proyecto;
    next();
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al verificar permisos', error: error.message });
  }
};

// Obtener un proyecto específico
router.get('/:proyectoId', verificarToken, async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.proyectoId);
    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }
    res.json(proyecto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el proyecto', error: error.message });
  }
});

// Obtener avances de un proyecto
router.get('/:proyectoId/avances', verificarToken, verificarMiembroProyecto, async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.proyectoId);
    res.json(proyecto.avances);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener avances', error: error.message });
  }
});

// Crear un nuevo avance con archivos
router.post('/:proyectoId/avances', verificarToken, verificarMiembroProyecto, upload.array('archivos', 5), async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion || descripcion.trim() === '') {
      return res.status(400).json({ mensaje: 'La descripción es requerida' });
    }

    const archivos = [];

    console.log('Archivos recibidos:', req.files);

    // Subir archivos a Cloudinary si existen
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        console.log('Subiendo archivo:', file.path);
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "proyectos_avances"
          });

          archivos.push({
            tipo: path.extname(file.originalname).toLowerCase(),
            url: result.secure_url,
            nombre: file.originalname,
            observacion: '',
          });

          // Eliminar archivo temporal
          await unlinkAsync(file.path);
          console.log('Resultado Cloudinary:', result);
        } catch (uploadError) {
          console.error('Error subiendo archivo a Cloudinary:', uploadError);
          // Continuar con el siguiente archivo
        }
      }
    }

    const nuevoAvance = {
      descripcion,
      archivos,
      creadoPor: req.usuario.usuario,
      fecha: new Date()
    };

    const proyecto = await Proyecto.findByIdAndUpdate(
      req.params.proyectoId,
      { $push: { avances: nuevoAvance } },
      { new: true, runValidators: true }
    );

    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }

    res.status(201).json(proyecto.avances[proyecto.avances.length - 1]);
  } catch (error) {
    console.error('Error al crear avance:', error);
    // Si hay error, eliminar archivos temporales si existen
    if (req.files) {
      for (const file of req.files) {
        try {
          await unlinkAsync(file.path);
        } catch (err) {
          console.error('Error eliminando archivo temporal:', err);
        }
      }
    }
    res.status(500).json({ 
      mensaje: 'Error al crear avance', 
      error: error.message || 'Error interno del servidor' 
    });
  }
});

export default router; 