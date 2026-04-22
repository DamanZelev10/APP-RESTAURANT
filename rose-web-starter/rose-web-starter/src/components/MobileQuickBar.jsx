import { Link } from 'react-router-dom'
import { quickActions } from '../data/site'

export default function MobileQuickBar() {
  return (
    <nav className="mobile-quick-bar" aria-label="Acciones rápidas">
      {quickActions.map((action) => {
        if (action.external) {
          return (
            <a key={action.label} href={action.href} target="_blank" rel="noreferrer" className="mobile-quick-bar__item">
              <span aria-hidden="true">{action.icon}</span>
              <span>{action.label}</span>
            </a>
          )
        }

        return (
          <Link key={action.label} to={action.href} className="mobile-quick-bar__item">
            <span aria-hidden="true">{action.icon}</span>
            <span>{action.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
