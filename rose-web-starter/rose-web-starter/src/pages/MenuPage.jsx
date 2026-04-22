import SeoPage from '../components/SeoPage'
import ButtonLink from '../components/ButtonLink'
import { buildRestaurantSchema, menuPreview, siteConfig } from '../data/site'

export default function MenuPage() {
  return (
    <>
      <SeoPage
        title={`Menú y cócteles | ${siteConfig.brand} ${siteConfig.city}`}
        description={`Explora la carta de ${siteConfig.brand}. Un menú en HTML preparado para móvil, SEO local y una lectura clara.`}
        canonical={`${siteConfig.contact.siteUrl}/menu`}
        jsonLd={buildRestaurantSchema(`${siteConfig.contact.siteUrl}/menu`)}
      />
      <section className="section page-hero">
        <div className="container narrow">
          <p className="eyebrow">Carta</p>
          <h1>Menú ROSÉ</h1>
          <p className="lead">Usa esta página como HTML principal. El PDF, si existe, debe ser secundario.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          {menuPreview.map((group) => (
            <article key={group.category} className="menu-section">
              <h2>{group.category}</h2>
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
          <ButtonLink href={siteConfig.contact.reservationsUrl} external>Reservar mesa</ButtonLink>
        </div>
      </section>
    </>
  )
}
