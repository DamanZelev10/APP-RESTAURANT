import { Link } from 'react-router-dom'
import { Calendar, Utensils, MapPin, MessageCircle } from 'lucide-react'
import { quickActions } from '../data/site'

const getIcon = (label) => {
  switch (label) {
    case 'Reservar': return <Calendar size={20} />;
    case 'Menú': return <Utensils size={20} />;
    case 'Cómo llegar': return <MapPin size={20} />;
    case 'WhatsApp': return <MessageCircle size={20} />;
    default: return null;
  }
}

export default function MobileQuickBar() {
  return (
    <nav className="mobile-quick-bar" aria-label="Acciones rápidas">
      {quickActions.map((action) => {
        if (action.external) {
          return (
            <a key={action.label} href={action.href} target="_blank" rel="noreferrer" className="mobile-quick-bar__item">
              <span aria-hidden="true" className="mobile-quick-bar__icon">{getIcon(action.label)}</span>
              <span>{action.label}</span>
            </a>
          )
        }

        return (
          <Link key={action.label} to={action.href} className="mobile-quick-bar__item">
            <span aria-hidden="true" className="mobile-quick-bar__icon">{getIcon(action.label)}</span>
            <span>{action.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
