import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
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

export const generarAccessToken = (user) => {
  return jwt.sign(
    { 
      usuario: user.usuario,
      rol: user.rol,
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const generarRefreshToken = (user) => {
  const refreshToken = jwt.sign(
    { usuario: user.usuario },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return refreshToken;
}; 