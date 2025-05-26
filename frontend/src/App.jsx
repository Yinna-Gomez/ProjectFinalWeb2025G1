import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import HomgePage from "./Pages/HomePage/HomePage";
import SeguimientoPage from "./Pages/SeguimientoPage/SeguimientoPage";
import Login from "./Pages/Login/Login";
import CreateProject from "./Pages/CreateProject/CreateProject";
import AddMember from "./Pages/AddMember/AddMember.jsx";
import DetailProject from "./Pages/DetailProject/DetailProject";
import VisualizaPage from './Pages/VisualizaPage/VisualizaPage';
import "./App.css";

// Componente para proteger rutas
const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/" }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(rol)) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomgePage />} />
              <Route path="/login" element={<Login />} />
              {/* Ruta para estudiantes */}
              <Route 
                path="/seguimiento" 
                element={
                  <ProtectedRoute allowedRoles={['integrante', 'docente']}>
                    <SeguimientoPage />
                  </ProtectedRoute>
                } 
              />
              {/* Ruta para visualización de proyectos */}
              <Route 
                path="/visualiza" 
                element={
                  <ProtectedRoute>
                    <VisualizaPage />
                  </ProtectedRoute>
                } 
              />
              {/* Ruta para crear proyectos (solo docentes) */}
              <Route 
                path="/createproject" 
                element={
                  <ProtectedRoute allowedRoles={['docente']} redirectTo="/visualiza">
                    <CreateProject />
                  </ProtectedRoute>
                } 
              />
              {/* Ruta para detalles del proyecto */}
              <Route 
                path="/detailproject/:id" 
                element={
                  <ProtectedRoute>
                    <DetailProject />
                  </ProtectedRoute>
                } 
              />
              {/* Ruta para agregar miembros */}
              <Route 
                path="/addmember" 
                element={
                  <ProtectedRoute allowedRoles={['docente']} redirectTo="/visualiza">
                    <AddMember />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;