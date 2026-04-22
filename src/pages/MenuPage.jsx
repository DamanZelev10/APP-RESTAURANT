import React, { useState, useEffect } from 'react';
import SeoPage from '../components/SeoPage';
import ButtonLink from '../components/ButtonLink';
import { buildRestaurantSchema, siteConfig } from '../data/site';
import { roseMenu } from '../data/roseMenu';
import { Link as ScrollLink } from 'react-scroll';

export default function MenuPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <SeoPage
        title={`Menú Premium | ${siteConfig.brand}`}
        description={`Explora la carta gastronómica de ${siteConfig.brand}. Descubre nuestros platos gourmet, coctelería de autor y postres.`}
        canonical={`${siteConfig.contact.siteUrl}/menu`}
        jsonLd={buildRestaurantSchema(`${siteConfig.contact.siteUrl}/menu`)}
      />

      <section className="section page-hero menu-hero">
        <div className="container narrow text-center">
          <p className="eyebrow eyebrow--light">Experiencia Gastronómica</p>
          <h1 className="menu-title">Menú ROSÉ</h1>
          <p className="lead text-center mx-auto" style={{ margin: '0 auto', opacity: 0.9 }}>
            Una selección meticulosa de sabores intensos, texturas delicadas y coctelería de autor, diseñada para acompañar tardes cálidas y noches memorables.
          </p>
        </div>
      </section>

      <div className={`menu-sticky-nav ${isScrolled ? 'nav-shadow' : ''}`}>
        <div className="container">
          <ul className="menu-nav-list">
            {roseMenu.map(category => (
              <li key={category.id}>
                <ScrollLink 
                  to={category.id} 
                  spy={true} 
                  smooth={true} 
                  offset={-140} 
                  duration={600}
                  className="menu-nav-link"
                  activeClass="menu-nav-link--active"
                >
                  {category.title}
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="menu-wrapper">
        <div className="container narrow">
          {roseMenu.map((category) => (
            <article key={category.id} id={category.id} className="menu-category">
              <div className="menu-category-header">
                <h2>{category.title}</h2>
                <div className="floral-divider"></div>
              </div>

              {category.sections.map(section => (
                <section key={section.id} className="menu-subsection">
                  <header className="menu-subsection-header">
                    <h3>{section.title}</h3>
                    {section.note && <p className="menu-note">{section.note}</p>}
                  </header>

                  <div className="menu-grid">
                    {section.items.map((item, idx) => (
                      <div key={idx} className={`menu-item ${item.featured ? 'menu-item--featured' : ''}`}>
                        <div className="menu-item-header">
                          <h4 className="menu-item-name">
                            {item.name}
                            {item.tags && item.tags.map(tag => (
                              <span key={tag} className={`menu-badge badge-${tag.toLowerCase()}`}>{tag}</span>
                            ))}
                          </h4>
                          <span className="menu-item-dotleader"></span>
                          <span className="menu-item-price">{item.formattedPrice}</span>
                        </div>
                        {item.description && (
                          <p className="menu-item-desc">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </article>
          ))}
          
          <div className="menu-footer-cta">
            <p className="eyebrow">Asegura tu experiencia</p>
            <h3>¿Listo para disfrutar?</h3>
            <div className="stack-actions" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
              <ButtonLink href="/reservas" external={false}>Reservar mesa en línea</ButtonLink>
              <ButtonLink href={siteConfig.contact.whatsappUrl} external={true} className="button-link--secondary">
                Contactar WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
