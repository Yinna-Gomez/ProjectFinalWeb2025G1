import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import HomgePage from './Pages/HomePage/HomgePage';
import SeguimientoPage from './Pages/SeguimientoPage/SeguimientoPage';
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;