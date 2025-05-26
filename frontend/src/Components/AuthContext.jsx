import React, { createContext, useState, useEffect, useContext } from 'react';

// Crea el contexto
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [rol, setRol] = useState(localStorage.getItem('rol') || '');
  const [usuario, setUsuario] = useState(localStorage.getItem('usuario') || '');
  const [correo, setCorreo] = useState(localStorage.getItem('correo') || '');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');

  // Función para iniciar sesión
  const login = (userData) => {
    setRol(userData.rol);
    setUsuario(userData.usuario);
    setCorreo(userData.correo);
    setToken(userData.accessToken);
    setRefreshToken(userData.refreshToken);

    localStorage.setItem('rol', userData.rol);
    localStorage.setItem('usuario', userData.usuario);
    localStorage.setItem('correo', userData.correo);
    localStorage.setItem('token', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken);
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Intentar invalidar el refresh token en el servidor
      if (refreshToken) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar estado local
      setRol('');
      setUsuario('');
      setCorreo('');
      setToken('');
      setRefreshToken('');

      // Limpiar localStorage
      localStorage.removeItem('rol');
      localStorage.removeItem('usuario');
      localStorage.removeItem('correo');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  };

  // Verificar token al cargar
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const verificarToken = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          // Si el token no es válido, intentar renovar
          const refreshRes = await fetch(`${API_URL}/api/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            setToken(data.accessToken);
            localStorage.setItem('token', data.accessToken);
          } else {
            // Si no se puede renovar, cerrar sesión
            logout();
          }
        }
      } catch (error) {
        console.error('Error verificando token:', error);
        logout();
      }
    };

    verificarToken();
  }, [token, refreshToken]);

  return (
    <AuthContext.Provider value={{ rol, usuario, correo, token, refreshToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
