import SeoPage from '../components/SeoPage'
import ButtonLink from '../components/ButtonLink'
import { buildRestaurantSchema, siteConfig } from '../data/site'

export default function LocationPage() {
  return (
    <>
      <SeoPage
        title={`Ubicación y horarios | ${siteConfig.brand} ${siteConfig.city}`}
        description={`Encuentra ${siteConfig.brand} en ${siteConfig.city}. Dirección completa, horarios, mapa y accesos rápidos.`}
        canonical={`${siteConfig.contact.siteUrl}/ubicacion`}
        jsonLd={buildRestaurantSchema(`${siteConfig.contact.siteUrl}/ubicacion`)}
      />
      <section className="section page-hero">
        <div className="container narrow">
          <p className="eyebrow">Ubicación</p>
          <h1>Cómo llegar a ROSÉ</h1>
          <p className="lead">Dirección clara, horario completo y accesos rápidos para usuarios locales.</p>
        </div>
      </section>
      <section className="section">
        <div className="container two-columns">
          <article className="info-card">
            <h2>Datos clave</h2>
            <p><strong>Dirección:</strong> {siteConfig.address}, {siteConfig.city}, {siteConfig.region}, {siteConfig.country}</p>
            <p><strong>Horarios:</strong></p>
            <ul>
              <li>{siteConfig.hours.regularLabel}</li>
              <li>{siteConfig.hours.closedLabel}</li>
            </ul>
            <div style={{ background: 'rgba(209, 174, 170, 0.2)', padding: '1rem', borderRadius: '8px', margin: '1rem 0' }}>
              <strong>Nota:</strong> Domingos y lunes festivos desde las 12:00 m.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '1.5rem 0' }}>
              {siteConfig.business.attributes.map(attr => (
                <span key={attr} style={{ background: 'var(--rose-burgundy)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '16px', fontSize: '0.85rem' }}>
                  {attr}
                </span>
              ))}
            </div>
            
            <div className="stack-actions" style={{ marginTop: '2rem' }}>
              <ButtonLink href={siteConfig.contact.mapsUrl} external>Cómo llegar</ButtonLink>
              <ButtonLink href={siteConfig.contact.reservationsUrl} external={false} variant="secondary">Reservar mesa</ButtonLink>
              <ButtonLink href={`https://wa.me/${siteConfig.contact.whatsapp}`} external variant="secondary">WhatsApp</ButtonLink>
            </div>
          </article>
          <article className="info-card info-card--map" style={{ padding: 0, overflow: 'hidden' }}>
            <iframe 
              title="Mapa de ROSÉ Gastro Bar"
              src={`https://maps.google.com/maps?q=Calle+14+%23+6-76,+La+Union,+Valle+del+Cauca&t=&z=15&ie=UTF8&iwloc=&output=embed`} 
              width="100%" 
              height="100%" 
              style={{ border: 0, minHeight: '400px' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </article>
        </div>
      </section>
    </>
  )
}
