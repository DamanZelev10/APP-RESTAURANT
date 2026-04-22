import SeoPage from '../components/SeoPage'
import ButtonLink from '../components/ButtonLink'
import { buildRestaurantSchema, siteConfig } from '../data/site'

export default function ReservationsPage() {
  return (
    <>
      <SeoPage
        title={`Reservar mesa | ${siteConfig.brand}`}
        description={`Reserva tu mesa en ${siteConfig.brand}. Una ruta pensada para convertir sin fricción en móvil y escritorio.`}
        canonical={`${siteConfig.contact.siteUrl}/reservas`}
        jsonLd={buildRestaurantSchema(`${siteConfig.contact.siteUrl}/reservas`)}
      />
      <section className="section page-hero">
        <div className="container narrow">
          <p className="eyebrow">Reservas</p>
          <h1>Reserva tu mesa</h1>
          <p className="lead">Conecta aquí el flujo real de reservas. Mientras tanto, deja una salida limpia por WhatsApp.</p>
          <div className="stack-actions">
            <ButtonLink href={siteConfig.contact.reservationsUrl} external>Ir al sistema de reservas</ButtonLink>
            <ButtonLink href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Hola ROSÉ Gastro Bar, quiero reservar una mesa.')}`} external variant="secondary">
              Reservar por WhatsApp
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
