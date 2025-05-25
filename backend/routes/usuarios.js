import express from 'express';
import User from '../Models/user.js';
import { verificarToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los usuarios
router.get('/', verificarToken, async (req, res) => {
  const usuarios = await User.find({});
  res.json(usuarios);
});

// Crear usuario
router.post('/', async (req, res) => {
  try {
    let { usuario, contrasenia, nombre, apellido, correo, rol, tipoIdentificacion, identificacion, gradoEscolar } = req.body;
    usuario = usuario.trim().toLowerCase();
    correo = correo.trim().toLowerCase();
    rol = rol.trim().toLowerCase();
    
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

// Actualizar usuario
router.put('/:id', async (req, res) => {
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
    if (!actualizado) {
      return res.status(404).json({ 
        mensaje: 'Usuario no encontrado',
        tipo: 'error'
      });
    }
    res.json({ 
      mensaje: 'Usuario actualizado exitosamente',
      tipo: 'success',
      usuario: actualizado 
    });
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(500).json({ 
      mensaje: 'Error al actualizar usuario',
      tipo: 'error',
      error: err.message 
    });
  }
});

// Obtener usuario por nombre
router.get('/:usuario', async (req, res) => {
  try {
    const usuario = req.params.usuario.trim().toLowerCase();
    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const eliminado = await User.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ 
        mensaje: 'Usuario no encontrado',
        tipo: 'error'
      });
    }
    res.json({ 
      mensaje: 'Usuario eliminado exitosamente',
      tipo: 'success'
    });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ 
      mensaje: 'Error al eliminar usuario',
      tipo: 'error',
      error: err.message 
    });
  }
});

export default router; 