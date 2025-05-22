import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Components/Header/Header';
import Footer from './Components/Footer/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        {/* Aquí irá el contenido principal */}
        <main>
          {/* Las rutas se agregarán aquí */}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;