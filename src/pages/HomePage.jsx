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

      <section className="hero" style={{ 
        position: 'relative', 
        minHeight: '90vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center', 
        overflow: 'hidden',
        paddingTop: 'calc(var(--header-height) + 2rem)'
      }}>
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src="/images/VIDEO MESAS PARA HERO.mp4" type="video/mp4" />
        </video>
        
        {/* Cinematic Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(11,11,11,0.3), rgba(11,11,11,0.95))',
          zIndex: 1
        }}></div>

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: '900px', margin: '0 auto', textAlign: 'center', paddingBottom: '6rem' }}>
          <p className="eyebrow text-gold font-serif" style={{ fontSize: '1rem', letterSpacing: '0.15em', marginBottom: '1.5rem' }}>{siteConfig.city}, {siteConfig.region}</p>
          <h1 className="font-serif text-pearl" style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', marginBottom: '1.5rem', lineHeight: '1.05', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>ROSÉ Gastro Bar</h1>
          <p className="lead text-ash" style={{ fontSize: '1.15rem', marginBottom: '3rem', maxWidth: '650px', margin: '0 auto 3rem auto', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Un refugio íntimo de alta coctelería y gastronomía local. Tardes de café y noches memorables.
          </p>
          
          {/* Quick Reservation Card - Above the fold */}
          <div className="quick-reservation-card" style={{
            background: 'var(--bg-glass)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-gold)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 24px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{ flex: '1 1 200px', textAlign: 'left', borderRight: '1px solid var(--border)', paddingRight: '1rem' }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Reserva tu mesa</p>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-pearl)', fontWeight: '500' }}>Experiencia ROSÉ</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: '2 1 300px', justifyContent: 'center' }}>
              <ButtonLink href={siteConfig.contact.reservationsUrl} external variant="primary" className="btn-primary" style={{ width: '100%', maxWidth: '280px', height: '54px', fontSize: '1.1rem' }}>Encontrar Mesa</ButtonLink>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <ButtonLink href="/menu" variant="outline" className="btn-outline" style={{ border: 'none', borderBottom: '1px solid var(--primary)', borderRadius: 0, padding: '0.5rem 1rem' }}>Explorar la carta</ButtonLink>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-dark)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="two-columns" style={{ marginBottom: '4rem', alignItems: 'center' }}>
            <div>
              <p className="eyebrow text-gold font-serif" style={{ fontSize: '0.9rem' }}>Nuestra Experiencia</p>
              <h2 className="font-serif text-pearl" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1' }}>De la tarde a la noche,<br/><span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>elegancia atemporal.</span></h2>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-gold)', paddingLeft: '2rem' }}>
              <p className="text-ash" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
                La atmósfera se transforma con el paso de las horas. Desde una tarde soleada con café de origen en nuestro patio floral, 
                hasta una noche vibrante bajo luces cálidas, coctelería de autor y la mejor compañía.
              </p>
            </div>
          </div>

          <div className="bento-gallery" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            gridAutoRows: '300px'
          }}>
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', gridRow: 'span 2', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,11,11,0.8), transparent)', zIndex: 1 }}></div>
              <img src="/images/PATIO ROSE.png" alt="Patio ROSÉ" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              <p className="font-serif text-pearl" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '1.5rem', zIndex: 2 }}>Tardes de Café</p>
            </div>
            
            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
              <video autoPlay muted loop playsInline style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src="/images/VIDEO PLAZA ROSE ENTRADA.mp4" type="video/mp4" />
              </video>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(94, 26, 45, 0.6), transparent)', zIndex: 1 }}></div>
              <p className="font-serif text-pearl" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '1.5rem', zIndex: 2 }}>Plaza ROSÉ</p>
            </div>

            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,11,11,0.8), transparent)', zIndex: 1 }}></div>
              <img src="/images/BAR PRINCIPAL ENTRADA.png" alt="Bar principal" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              <p className="font-serif text-pearl" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '1.5rem', zIndex: 2 }}>Coctelería</p>
            </div>

            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,11,11,0.8), transparent)', zIndex: 1 }}></div>
              <img src="/images/ZONA DE CANTO.png" alt="Noches de Canto" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              <p className="font-serif text-pearl" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '1.5rem', zIndex: 2 }}>Noches de Música</p>
            </div>

            <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', gridColumn: '1 / -1', height: '250px', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,11,11,0.9), transparent)', zIndex: 1 }}></div>
              <img src="/images/FACHADA PRINCIPAL.png" alt="Fachada ROSÉ" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
              <p className="font-serif text-pearl" style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', fontSize: '1.5rem', zIndex: 2 }}>El Corazón de La Unión</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div className="section-heading" style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <p className="eyebrow text-gold font-serif" style={{ fontSize: '0.9rem' }}>Nuestra Cocina</p>
            <h2 className="font-serif text-pearl" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', marginBottom: '1.5rem' }}>Gastronomía de Autor.</h2>
            <ButtonLink href="/menu" variant="outline" className="btn-outline" style={{ display: 'inline-flex', margin: '0 auto' }}>Explorar la Carta Completa</ButtonLink>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem', 
            marginBottom: '4rem' 
          }}>
            <div style={{ 
              gridColumn: '1 / -1', 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden', 
              height: '350px', 
              position: 'relative',
              marginBottom: '1rem'
            }}>
              <img src="/images/ZONA DE HELADOS.png" alt="Zona de Helados" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,11,11,0.9), transparent)', display: 'flex', alignItems: 'center', padding: '3rem' }}>
                <div style={{ maxWidth: '450px' }}>
                  <p className="eyebrow text-gold">Dulces Momentos</p>
                  <h3 className="font-serif text-pearl" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Zona de Helados & Postres</h3>
                  <p className="text-ash" style={{ fontSize: '1.1rem' }}>Descubre nuestra selección artesanal de helados y repostería fina, el complemento perfecto para tu tarde en ROSÉ.</p>
                </div>
              </div>
            </div>

            {menuPreview.map((group) => (
              <article key={group.category} className="menu-card" style={{ background: 'var(--bg-card-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
                <h3 className="font-serif text-gold" style={{ borderBottom: '1px solid var(--border-gold)', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>{group.category}</h3>
                <ul className="menu-card__list" style={{ listStyle: 'none', padding: 0 }}>
                  {group.items.map((item) => (
                    <li key={item.name} style={{ marginBottom: '1.5rem' }}>
                      <div className="menu-card__row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px dotted var(--border)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <strong className="text-pearl" style={{ fontSize: '1.1rem', fontWeight: '500' }}>{item.name}</strong>
                        <span className="text-gold font-serif" style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>{item.price}</span>
                      </div>
                      <p className="text-ash" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>{item.description}</p>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-dark)' }}>
        <div className="container two-columns" style={{ alignItems: 'start', gap: '4rem' }}>
          <article className="info-card" style={{ background: 'transparent', border: 'none', padding: 0, boxShadow: 'none' }}>
            <p className="eyebrow text-gold font-serif" style={{ fontSize: '0.9rem' }}>Opiniones Reales</p>
            <h2 className="font-serif text-pearl" style={{ marginBottom: '1rem', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>El veredicto.</h2>
            <p className="text-ash" style={{ marginBottom: '2.5rem', fontSize: '1.1rem' }}>Calificación: <strong className="text-pearl" style={{ fontSize: '1.3rem' }}>{socialProof.rating}</strong> / 5.0 <br/><span style={{ fontSize: '0.9rem' }}>Basado en {socialProof.reviewsCount} reseñas de Google</span></p>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {socialProof.reviews.map((rev) => (
                <div key={rev.author} style={{ padding: '1.8rem', background: 'rgba(94, 26, 45, 0.15)', border: '1px solid rgba(212, 175, 55, 0.1)', borderRadius: 'var(--radius-lg)' }}>
                  <p className="text-pearl font-serif" style={{ margin: '0 0 0.8rem 0', fontSize: '1.1rem', fontStyle: 'italic' }}>"{rev.text}"</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className="text-gold" style={{ fontWeight: '600', margin: 0, fontSize: '0.9rem' }}>{rev.author}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{'⭐'.repeat(rev.stars)}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
          
          <article className="info-card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-lg)', padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '220px', overflow: 'hidden' }}>
              <img src="/images/FACHADA PRINCIPAL.png" alt="Fachada ROSÉ" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '3rem' }}>
              <p className="eyebrow text-gold font-serif" style={{ fontSize: '0.9rem' }}>Encuéntranos</p>
              <h2 className="font-serif text-pearl" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Visítanos.</h2>
              <div style={{ marginBottom: '2rem' }}>
                <p className="text-pearl" style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}><strong>Ubicación</strong></p>
                <p className="text-ash">{siteConfig.address}<br/>{siteConfig.city}, {siteConfig.region}</p>
              </div>
              <div style={{ background: 'var(--bg-card-elevated)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
                <p className="text-pearl" style={{ marginBottom: '0.5rem' }}><strong>Horario de Apertura</strong></p>
                <p className="text-ash" style={{ margin: 0 }}>{siteConfig.hours.regularLabel}</p>
                <p className="text-gold" style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem' }}>{siteConfig.hours.closedLabel}</p>
              </div>
              <div className="stack-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <ButtonLink href={siteConfig.contact.mapsUrl} external className="btn-primary" style={{ width: '100%' }}>Cómo llegar (Google Maps)</ButtonLink>
                <ButtonLink href="/ubicacion" variant="outline" className="btn-outline" style={{ width: '100%', border: 'none', borderBottom: '1px solid var(--primary)', borderRadius: 0 }}>Detalles de parqueo y zonas</ButtonLink>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-card-elevated)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p className="eyebrow text-gold font-serif" style={{ fontSize: '0.9rem' }}>Preguntas Frecuentes</p>
          <h2 className="font-serif text-pearl" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '3rem' }}>Antes de tu visita.</h2>
          <div className="faq-list" style={{ textAlign: 'left' }}>
            {faqs.map((item) => (
              <details key={item.question} className="faq-item" style={{ borderBottom: '1px solid var(--border)', padding: '1.5rem 0', background: 'transparent' }}>
                <summary style={{ fontSize: '1.1rem', color: 'var(--text-pearl)', outline: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {item.question}
                </summary>
                <p className="text-ash" style={{ marginTop: '1rem', lineHeight: '1.6' }}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
