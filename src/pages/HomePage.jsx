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
            <div className="hero__media-card" style={{ padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
              <img src="/images/hero-pergola.png" alt="ROSÉ Gastro Bar principal" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="two-columns" style={{ marginBottom: '3rem' }}>
            <div>
              <p className="eyebrow">La experiencia ROSÉ</p>
              <h2>De la tarde a la noche, sin perder elegancia.</h2>
            </div>
            <div>
              <p>
                La atmósfera se transforma con el día. Desde una tarde soleada con aire fresco en nuestro patio floral,
                hasta una noche vibrante bajo luces de neón en el bar principal.
              </p>
            </div>
          </div>

          <div className="bento-gallery" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            gridAutoRows: '250px'
          }}>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', gridRow: 'span 2' }}>
              <img src="/images/outdoor-swing.png" alt="Tardes en ROSÉ" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
            </div>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <img src="/images/neon-wings-stage.png" alt="Noches de Neón" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
            </div>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <img src="/images/main-bar-indoor.png" alt="Bar principal" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
            </div>
            <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', gridColumn: '1 / -1', height: '200px' }}>
              <img src="/images/patio-signpost.png" alt="Ambiente local" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
            </div>
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
            <p style={{ marginBottom: '1rem' }}>Calificación: {socialProof.rating} · Reseñas: {socialProof.reviewsCount}</p>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {socialProof.reviews.map((rev) => (
                <div key={rev.author} style={{ padding: '1rem', background: 'rgba(0,0,0,0.03)', borderRadius: '8px' }}>
                  <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>{rev.author} {'⭐'.repeat(rev.stars)}</p>
                  <p style={{ fontStyle: 'italic', margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>"{rev.text}"</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rev.details}</p>
                </div>
              ))}
            </div>
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
