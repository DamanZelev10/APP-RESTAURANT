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
          <div className="gallery-tile">Foto experiencia 1</div>
          <div className="gallery-tile">Foto experiencia 2</div>
          <div className="gallery-tile">Foto experiencia 3</div>
          <div className="gallery-tile">Foto experiencia 4</div>
        </div>
      </section>
    </>
  )
}
