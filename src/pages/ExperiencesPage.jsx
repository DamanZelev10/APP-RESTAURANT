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
        <div className="container gallery-grid">
          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/images/neon-wings-stage.png" alt="Stage Neon Wings" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/images/ice-cream-station.png" alt="Helados" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/images/patio-signpost.png" alt="Patio Directional Sign" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/images/outdoor-swing.png" alt="Swing Chair" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
          <div className="gallery-tile" style={{ padding: 0, overflow: 'hidden' }}>
            <img src="/images/hero-pergola.png" alt="Pergola" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
        </div>
      </section>
    </>
  )
}
