import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Components/AuthContext';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import HomgePage from "./Pages/HomePage/HomgePage";
import SeguimientoPage from "./Pages/SeguimientoPage/SeguimientoPage";
import Login from "./Pages/Login/Login";
import CreateProject from "./Pages/CreateProject/CreateProject";
import AddMember from "./Pages/AddMember/AddMember.jsx";
import DetailProject from "./Pages/DetailProject/DetailProject";
import VisualizaPage from './Pages/VisualizaPage/VisualizaPage';
import "./App.css";

// Componente para proteger rutas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(rol)) {
    return <Navigate to="/visualiza" />;
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
              <Route path="/seguimiento" element={<SeguimientoPage />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/visualiza" 
                element={
                  <ProtectedRoute>
                    <VisualizaPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/createproject" 
                element={
                  <ProtectedRoute allowedRoles={['docente']}>
                    <CreateProject />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/detailproject" 
                element={
                  <ProtectedRoute>
                    <DetailProject />
                  </ProtectedRoute>
                } 
              />
              <Route path="/addmember" element={<AddMember />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;