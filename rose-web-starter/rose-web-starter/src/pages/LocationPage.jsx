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
            <p>{siteConfig.address}</p>
            <p>{siteConfig.city}, {siteConfig.region}, {siteConfig.country}</p>
            <p>{siteConfig.hours.regularLabel}</p>
            <p>{siteConfig.hours.closedLabel}</p>
            <ButtonLink href={siteConfig.contact.mapsUrl} external>Cómo llegar</ButtonLink>
          </article>
          <article className="info-card info-card--map">
            <h2>Mapa</h2>
            <p>Inserta aquí un mapa ligero o una imagen estática con enlace a Google Maps.</p>
          </article>
        </div>
      </section>
    </>
  )
}
