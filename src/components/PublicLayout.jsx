import { NavLink, Outlet } from 'react-router-dom'
import MobileQuickBar from './MobileQuickBar'
import { siteConfig } from '../data/site'

const navItems = [
  ['/', 'Inicio'],
  ['/menu', 'Menú'],
  ['/reservas', 'Reservas'],
  ['/ubicacion', 'Ubicación'],
  ['/experiencias', 'Experiencias'],
  ['/contacto', 'Contacto'],
]

export default function PublicLayout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <NavLink to="/" className="site-brand">
            <img src={siteConfig.logo} alt={siteConfig.brand} className="site-brand__logo" style={{ height: '50px', width: '50px', borderRadius: '50%', objectFit: 'cover' }} />
          </NavLink>

          <nav className="site-nav" aria-label="Principal">
            {navItems.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => (isActive ? 'site-nav__link is-active' : 'site-nav__link')}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <NavLink className="site-header__cta" to={siteConfig.contact.reservationsUrl}>
            Reservar mesa
          </NavLink>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer" style={{ background: 'var(--bg-card-elevated)', paddingTop: '5rem', paddingBottom: 'calc(var(--safe-area-bottom) + 2rem)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '3rem' }}>
            <h2 className="font-serif text-gold" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{siteConfig.brand}</h2>
            <p className="text-ash" style={{ maxWidth: '400px', fontSize: '1.1rem', marginBottom: '2rem' }}>{siteConfig.concept}</p>
            <a href={`https://wa.me/${siteConfig.contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '0.8rem 2rem', borderRadius: 'var(--radius-full)', background: 'var(--primary)', color: 'var(--text-dark)', fontWeight: '600', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Atención vía WhatsApp</span>
            </a>
          </div>

          <div className="site-footer__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left' }}>
            <div>
              <p className="site-footer__title font-serif text-pearl" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Ubicación</p>
              <p className="text-ash" style={{ margin: '0 0 0.5rem 0' }}>{siteConfig.address}</p>
              <p className="text-ash" style={{ margin: 0 }}>{siteConfig.city}, {siteConfig.region}</p>
            </div>
            <div>
              <p className="site-footer__title font-serif text-pearl" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Horario</p>
              <p className="text-ash" style={{ margin: '0 0 0.5rem 0' }}>{siteConfig.hours.regularLabel}</p>
              <p className="text-gold" style={{ margin: 0, fontSize: '0.9rem' }}>{siteConfig.hours.closedLabel}</p>
            </div>
            <div>
              <p className="site-footer__title font-serif text-pearl" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Contacto</p>
              <p className="text-ash" style={{ margin: '0 0 0.5rem 0' }}><a href={`tel:${siteConfig.contact.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteConfig.contact.phone}</a></p>
              <p className="text-ash" style={{ margin: 0 }}><a href={`mailto:${siteConfig.contact.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{siteConfig.contact.email}</a></p>
            </div>
          </div>
          
          <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            &copy; {new Date().getFullYear()} {siteConfig.brand}. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      <MobileQuickBar />
    </div >
  )
}
