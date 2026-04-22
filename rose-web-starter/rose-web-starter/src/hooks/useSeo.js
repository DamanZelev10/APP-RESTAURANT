import { useEffect } from 'react'

function upsertMeta(name, content) {
  if (!content) return
  let element = document.querySelector(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function upsertCanonical(href) {
  if (!href) return
  let element = document.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

function upsertJsonLd(id, schema) {
  if (!schema) return
  let element = document.getElementById(id)
  if (!element) {
    element = document.createElement('script')
    element.type = 'application/ld+json'
    element.id = id
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(schema)
}

export function useSeo({ title, description, canonical, jsonLd }) {
  useEffect(() => {
    if (title) document.title = title
    upsertMeta('description', description)
    upsertCanonical(canonical)
    if (jsonLd) upsertJsonLd('rose-jsonld', jsonLd)

    return () => {
      // Deliberadamente no limpiamos title/description/canonical:
      // cada ruta reescribe sus propios metadatos.
    }
  }, [title, description, canonical, jsonLd])
}
