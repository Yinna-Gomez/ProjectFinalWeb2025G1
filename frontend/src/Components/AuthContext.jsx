import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto
export const AuthContext = createContext({ rol: null, setRol: () => {} });

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  // Por defecto, rol null. Inicializa desde localStorage si existe
  const [rol, setRol] = useState(localStorage.getItem('rol') || null);

  // Cuando el rol cambie, actualiza localStorage o lo elimina si es null
  const handleSetRol = (nuevoRol) => {
    setRol(nuevoRol);
    if (nuevoRol) {
      localStorage.setItem('rol', nuevoRol);
    } else {
      localStorage.removeItem('rol');
    }
  };

  // Limpiar sesión al recargar la página
  useEffect(() => {
    localStorage.removeItem('rol');
    setRol(null);
  }, []);

  return (
    <AuthContext.Provider value={{ rol, setRol: handleSetRol }}>
      {children}
    </AuthContext.Provider>
  );
};
