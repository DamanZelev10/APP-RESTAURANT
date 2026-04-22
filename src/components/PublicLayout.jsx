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

      <footer className="site-footer">
        <div className="container site-footer__grid">
          <div>
            <p className="site-footer__title">{siteConfig.brand}</p>
            <p>{siteConfig.concept}</p>
          </div>
          <div>
            <p className="site-footer__title">Ubicación</p>
            <p>{siteConfig.address}</p>
            <p>{siteConfig.city}, {siteConfig.region}</p>
          </div>
          <div>
            <p className="site-footer__title">Horario</p>
            <p>{siteConfig.hours.regularLabel}</p>
            <p>{siteConfig.hours.closedLabel}</p>
          </div>
          <div>
            <p className="site-footer__title">Contacto</p>
            <p><a href={`tel:${siteConfig.contact.phone}`}>{siteConfig.contact.phone}</a></p>
            <p><a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a></p>
          </div>
        </div>
      </footer >

      <MobileQuickBar />
    </div >
  )
}
