import { Link } from 'react-router-dom'

export default function ButtonLink({ href, children, variant = 'primary', external = false, className = '' }) {
  const classes = ['button-link', `button-link--${variant}`, className].filter(Boolean).join(' ')

  if (external) {
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link className={classes} to={href}>
      {children}
    </Link>
  )
}
