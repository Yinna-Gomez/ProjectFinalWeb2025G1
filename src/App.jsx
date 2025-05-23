
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import HomgePage from './Pages/HomePage/HomgePage';
import SeguimientoPage from './Pages/SeguimientoPage/SeguimientoPage';
import React from 'react'
import Login from './Pages/Login/Login.jsx'
import CreateProject from './Pages/CreateProject/CreateProject.jsx'
import AddMember from './Pages/AddMember/AddMember.jsx'
import DetailProject from './Pages/DetailProject/DetailProject.jsx'
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomgePage />} />
            <Route path="/seguimiento" element={<SeguimientoPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createproject" element={<CreateProject />} />
            <Route path="/addmember" element={<AddMember />} />
            <Route path="/detailproject" element={<DetailProject />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;