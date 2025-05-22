import React, { useState, useEffect } from 'react'
import './HomePage.css'


const banners = [
  {
    img: '/banner-1.jpg',
    title: 'Bienvenido al Portal Educativo',
    desc: 'Descubre recursos, noticias y más para tu formación.'
  },
  {
    img: '/banner-2.jpg',

  },
  {
    img: '/banner-3.jpg',
  }
];

const HomgePage = () => {
  const [current, setCurrent] = useState(0);

  const goTo = idx => setCurrent(idx);
  const prev = () => setCurrent((current - 1 + banners.length) % banners.length);
  const next = () => setCurrent((current + 1) % banners.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prevIdx) => (prevIdx + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <main>
        <section id="inicio" className="homepage-slider-section">
          <div className="homepage-slider-container">
            <img
              src={banners[current].img}
              alt={banners[current].title}
              className="homepage-slider-img"
            />
            <div className="homepage-slider-overlay">
              <h2 className="homepage-slider-title">{banners[current].title}</h2>
              <p className="homepage-slider-desc">{banners[current].desc}</p>
            </div>
          
            <button onClick={prev} className="homepage-slider-btn left" aria-label="Anterior">&#8592;</button>
            <button onClick={next} className="homepage-slider-btn right" aria-label="Siguiente">&#8594;</button>
        
            <div className="homepage-slider-indicators">
              {banners.map((_, idx) => (
                <span
                  key={idx}
                  onClick={() => goTo(idx)}
                  className={`homepage-slider-indicator${idx === current ? ' active' : ''}`}
                />
              ))}
            </div>
          </div>
        </section>

      
        <section id="mision" className="homepage-section">
          <h2 className="homepage-section-title">Misión</h2>
          <p>
            Nuestra misión es brindar una educación integral, innovadora y de calidad, formando ciudadanos comprometidos con el desarrollo social y tecnológico del país.
          </p>
        </section>

      
        <section id="vision" className="homepage-section">
          <h2 className="homepage-section-title">Visión</h2>
          <p>
            Ser reconocidos como una institución líder en educación superior, destacando por la excelencia académica, la investigación y la proyección social.
          </p>
        </section>

      
        <section id="acerca-de" className="homepage-section">
          <h2 className="homepage-section-title">Acerca de</h2>
          <p>
            Ondas es un programa de la Dirección de Vocaciones y Formación en CTel, del Viceministro de Talento y apropación social, que busca que los niños, niñas, adolescentes y jóvenes como tú se interesen por la investigación y desarrollen actitudes y habilidades para que encuentren en la ciencia y la investigación una pasión y un posible proyecto de vida.
          </p>
        </section>
      </main>
    </div>
  )
}

export default HomgePage
