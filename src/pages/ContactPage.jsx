import SeoPage from '../components/SeoPage'
import ButtonLink from '../components/ButtonLink'
import { buildRestaurantSchema, siteConfig } from '../data/site'

export default function ContactPage() {
  return (
    <>
      <SeoPage
        title={`Contacto | ${siteConfig.brand}`}
        description={`Escríbenos, reserva o pide información sobre ${siteConfig.brand} desde una ruta clara y directa.`}
        canonical={`${siteConfig.contact.siteUrl}/contacto`}
        jsonLd={buildRestaurantSchema(`${siteConfig.contact.siteUrl}/contacto`)}
      />
      <section className="section page-hero">
        <div className="container narrow">
          <p className="eyebrow">Contacto</p>
          <h1>Conversemos</h1>
          <p className="lead">Contacto ligero, sin fricción y con preferencia por WhatsApp.</p>
          <div className="stack-actions">
            <ButtonLink href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Hola ROSÉ Gastro Bar, quiero recibir información.')}`} external>
              Escribir por WhatsApp
            </ButtonLink>
            <ButtonLink href={`mailto:${siteConfig.contact.email}`} external variant="secondary">
              Escribir por correo
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  )
}
