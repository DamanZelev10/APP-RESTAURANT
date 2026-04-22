import { Link } from 'react-router-dom'

export default function ButtonLink({ href, children, variant = 'primary', external = false, className = '' }) {
  const classes = ['button-link', `button-link--${variant}`, className].filter(Boolean).join(' ')

  const handleClick = () => {
    if (href === '/reservar-mesa' || href.includes('wa.me')) {
      console.log(`[Tracking] Reserva iniciada via: ${href}`);
      // Aquí se puede inyectar window.dataLayer.push({ event: 'reserva_iniciada' })
    }
  };

  if (external) {
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer" onClick={handleClick}>
        {children}
      </a>
    )
  }

  return (
    <Link className={classes} to={href} onClick={handleClick}>
      {children}
    </Link>
  )
}
