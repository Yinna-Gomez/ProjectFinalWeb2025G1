import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Crea el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    usuario: localStorage.getItem('usuario') || '',
    rol: localStorage.getItem('rol') || '',
    nombre: localStorage.getItem('nombre') || '',
    apellido: localStorage.getItem('apellido') || '',
    correo: localStorage.getItem('correo') || '',
    id: localStorage.getItem('id') || ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/verify-token`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // Si el token no es válido, intentar refresh
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken) {
            const refreshResponse = await fetch(`${API_URL}/api/refresh`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ refreshToken })
            });

            if (refreshResponse.ok) {
              const { accessToken } = await refreshResponse.json();
              localStorage.setItem('token', accessToken);
              return;
            }
          }
          // Si no hay refresh token o falla, cerrar sesión
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    verificarToken();
  }, []);

  const login = (data) => {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('usuario', data.usuario);
    localStorage.setItem('rol', data.rol);
    localStorage.setItem('nombre', data.nombre);
    localStorage.setItem('apellido', data.apellido);
    localStorage.setItem('correo', data.correo);
    localStorage.setItem('id', data.id);

    setAuth({
      usuario: data.usuario,
      rol: data.rol,
      nombre: data.nombre,
      apellido: data.apellido,
      correo: data.correo,
      id: data.id
    });
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await fetch(`${API_URL}/api/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ refreshToken })
        });
      }
    } catch (error) {
      // Ignorar errores en el logout
    } finally {
      localStorage.clear();
      setAuth({
        usuario: '',
        rol: '',
        nombre: '',
        apellido: '',
        correo: '',
        id: ''
      });
      navigate('/login');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
