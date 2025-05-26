import express from 'express';
import Proyecto from '../Models/proyecto.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los proyectos
router.get('/', verificarToken, async (req, res) => {
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
router.get('/:id', verificarToken, async (req, res) => {
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

// Crear un nuevo proyecto
router.post('/', verificarToken, async (req, res) => {
  try {
    const proyectoData = {
      ...req.body,
      creadoPor: req.usuario.usuario
    };
    const nuevoProyecto = new Proyecto(proyectoData);
    await nuevoProyecto.save();
    res.status(201).json({ mensaje: 'Proyecto creado', proyecto: nuevoProyecto });
  } catch (err) {
    console.error('Error al crear proyecto:', err);
    res.status(500).json({ mensaje: 'Error al crear proyecto', error: err.message, stack: err.stack });
  }
});

// Actualizar el estado de un proyecto
router.put('/:id/estado', verificarToken, async (req, res) => {
  const { id } = req.params;
  let { estado, observacion } = req.body;
  try {
    const ESTADOS = ['formulacion', 'evaluacion', 'activo', 'inactivo', 'finalizado'];
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }

    const estadoActual = (proyecto.estado || '').toLowerCase();
    const estadoNuevo = (estado || '').toLowerCase();
    const idxActual = ESTADOS.indexOf(estadoActual);
    const idxNuevo = ESTADOS.indexOf(estadoNuevo);

    if (idxNuevo === -1) {
      return res.status(400).json({ mensaje: 'Estado no válido' });
    }
    if (idxNuevo > idxActual + 1 || idxNuevo < idxActual) {
      return res.status(400).json({ mensaje: 'Transición de estado no permitida' });
    }

    const update = {
      estado: estadoNuevo,
      observacion,
      $push: {
        historialestado: {
          estado: estadoNuevo,
          fecha: new Date().toISOString(),
          observacion
        }
      }
    };

    const proyectoActualizado = await Proyecto.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    res.json({ mensaje: 'Estado actualizado exitosamente', proyecto: proyectoActualizado });
  } catch (err) {
    console.error('Error al actualizar estado:', err);
    res.status(500).json({ mensaje: 'Error al actualizar estado del proyecto', error: err.message });
  }
});

export default router;