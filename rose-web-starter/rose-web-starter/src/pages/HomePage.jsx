import ButtonLink from '../components/ButtonLink'
import SeoPage from '../components/SeoPage'
import { buildRestaurantSchema, faqs, menuPreview, siteConfig, socialProof } from '../data/site'

export default function HomePage() {
  return (
    <>
      <SeoPage
        title={`ROSÉ Gastro Bar | Un lugar mágico en ${siteConfig.city}, ${siteConfig.region}`}
        description={`Descubre ${siteConfig.brand} en ${siteConfig.city}. Tardes de café, noches con atmósfera y una experiencia local diseñada para reservar, compartir y volver.`}
        canonical={siteConfig.contact.siteUrl}
        jsonLd={buildRestaurantSchema(siteConfig.contact.siteUrl)}
      />

      <section className="hero">
        <div className="container hero__grid">
          <div>
            <p className="eyebrow">{siteConfig.city}, {siteConfig.region}</p>
            <h1>ROSÉ Gastro Bar en La Unión, Valle del Cauca</h1>
            <p className="lead">
              Un lugar mágico para disfrutar tardes de café, encuentros especiales y noches con atmósfera.
            </p>
            <div className="hero__actions">
              <ButtonLink href={siteConfig.contact.reservationsUrl} external>Reservar mesa</ButtonLink>
              <ButtonLink href="/menu" variant="secondary">Ver menú</ButtonLink>
            </div>
            <ul className="hero__meta" aria-label="Información clave">
              <li>{siteConfig.address}</li>
              <li>{siteConfig.hours.regularLabel}</li>
              <li>{siteConfig.hours.closedLabel}</li>
            </ul>
          </div>
          <div className="hero__media" aria-hidden="true">
            <div className="hero__media-card">Espacio para foto o video principal</div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-columns">
          <div>
            <p className="eyebrow">La experiencia ROSÉ</p>
            <h2>De la tarde a la noche, sin perder elegancia.</h2>
          </div>
          <div>
            <p>
              La web debe vender atmósfera, facilidad y deseo de visita. Por eso el recorrido combina claridad local,
              acceso inmediato a reservas y una narrativa visual que se siente cálida de día y sofisticada de noche.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--tinted">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Carta</p>
              <h2>Un preview legible, útil y listo para SEO.</h2>
            </div>
            <ButtonLink href="/menu" variant="secondary">Explorar la carta</ButtonLink>
          </div>

          <div className="menu-preview-grid">
            {menuPreview.map((group) => (
              <article key={group.category} className="menu-card">
                <h3>{group.category}</h3>
                <ul className="menu-card__list">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <div className="menu-card__row">
                        <strong>{item.name}</strong>
                        <span>{item.price}</span>
                      </div>
                      <p>{item.description}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-columns">
          <article className="info-card">
            <p className="eyebrow">Confianza</p>
            <h2>Prueba social sin exagerar.</h2>
            <p>Calificación: {socialProof.rating} · Reseñas: {socialProof.reviewsCount}</p>
            <blockquote>{socialProof.testimonial}</blockquote>
          </article>
          <article className="info-card">
            <p className="eyebrow">Ubicación</p>
            <h2>Fácil de encontrar. Fácil de elegir.</h2>
            <p>{siteConfig.address}, {siteConfig.city}, {siteConfig.region}</p>
            <p>{siteConfig.hours.regularLabel}</p>
            <div className="stack-actions">
              <ButtonLink href={siteConfig.contact.mapsUrl} external>Cómo llegar</ButtonLink>
              <ButtonLink href="/ubicacion" variant="secondary">Ver ubicación</ButtonLink>
            </div>
          </article>
        </div>
      </section>

      <section className="section section--dark">
        <div className="container">
          <p className="eyebrow eyebrow--light">Preguntas frecuentes</p>
          <h2>Todo lo que el usuario local quiere resolver rápido.</h2>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.question} className="faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
