import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import Login from './Pages/Login/Login';
import Unauthorized from './Pages/Unauthorized/Unauthorized';
import HomgePage from './Pages/HomePage/HomePage';
import VisualizaPage from './Pages/VisualizaPage/VisualizaPage';
import DetailProject from './Pages/DetailProject/DetailProject';
import SeguimientoPage from './Pages/SeguimientoPage/SeguimientoPage';
import GestionUsuarios from './Pages/VisualizaPage/GestionUsuarios';
import "./App.css";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Página pública de inicio */}
          <Route path="/" element={<HomgePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Rutas protegidas */}
          <Route
            path="/visualiza"
            element={
              <ProtectedRoute>
                <VisualizaPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/proyecto/:id"
            element={
              <ProtectedRoute>
                <DetailProject />
              </ProtectedRoute>
            }
          />

          <Route
            path="/seguimiento/:id"
            element={
              <ProtectedRoute allowedRoles={['integrante']}>
                <SeguimientoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/gestion-usuarios"
            element={
              <ProtectedRoute allowedRoles={['coordinador']}>
                <GestionUsuarios />
              </ProtectedRoute>
            }
          />

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;