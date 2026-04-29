import SeoPage from '../components/SeoPage'
import { buildRestaurantSchema, siteConfig } from '../data/site'

export default function ExperiencesPage() {
  return (
    <>
      <SeoPage
        title={`Experiencias | ${siteConfig.brand}`}
        description={`Una vitrina para tardes, noches y momentos que definen la atmósfera de ${siteConfig.brand}.`}
        canonical={`${siteConfig.contact.siteUrl}/experiencias`}
        jsonLd={buildRestaurantSchema(`${siteConfig.contact.siteUrl}/experiencias`)}
      />
      <section className="section page-hero">
        <div className="container narrow">
          <p className="eyebrow">Experiencias</p>
          <h1>Tardes cálidas. Noches memorables.</h1>
          <p className="lead">Usa esta ruta para editorializar la marca: galería real, eventos, cócteles, ambiente y momentos.</p>
        </div>
      </section>
      <section className="section">
        <div className="container gallery-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '400px', position: 'relative' }}>
            <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/images/VIDEO PLAZA ROSE ENTRADA.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: 'white', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Plaza ROSÉ</div>
          </div>
          
          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '400px', position: 'relative' }}>
            <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="/images/VIDEO MESAS PARA HERO.mp4" type="video/mp4" />
            </video>
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', color: 'white', zIndex: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>Atmósfera Interior</div>
          </div>

          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '400px' }}>
            <img src="/images/PATIO ROSE.png" alt="Patio" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
          
          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '400px' }}>
            <img src="/images/BAR PRINCIPAL ENTRADA.png" alt="Bar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>

          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '400px' }}>
            <img src="/images/ZONA DE HELADOS.png" alt="Helados" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>

          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '400px' }}>
            <img src="/images/ZONA DE CANTO.png" alt="Canto" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>

          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', height: '400px', gridColumn: '1 / -1' }}>
            <img src="/images/FACHADA PRINCIPAL.png" alt="Fachada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
        </div>
      </section>
    </>
  )
}
