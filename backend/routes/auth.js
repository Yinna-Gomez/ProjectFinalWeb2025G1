import express from 'express';
import User from '../Models/user.js';
import { verificarToken, generarAccessToken, generarRefreshToken } from '../middleware/auth.js';

const router = express.Router();
const refreshTokens = new Set();

// Verificar token
router.get('/verify-token', verificarToken, (req, res) => {
  res.json({ valid: true, usuario: req.usuario });
});

// Login
router.post('/login', async (req, res) => {
  const { usuario, contrasenia } = req.body;
  try {
    const user = await User.findOne({ usuario });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (user.contrasenia !== contrasenia) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    
    const accessToken = generarAccessToken(user);
    const refreshToken = generarRefreshToken(user);
    refreshTokens.add(refreshToken);

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

// Refresh token
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken || !refreshTokens.has(refreshToken)) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
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

// Logout
router.post('/logout', (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens.delete(refreshToken);
  res.json({ message: 'Logout exitoso' });
});

export default router;