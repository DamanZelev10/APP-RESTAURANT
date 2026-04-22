export const siteConfig = {
  brand: 'ROSÉ Gastro Bar',
  concept: 'Un lugar mágico ✨',
  city: 'La Unión',
  region: 'Valle del Cauca',
  country: 'Colombia',
  address: 'Calle 14 # 6-76',
  hours: {
    regularDays: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    regularLabel: 'Martes a Domingo · 3:30 p. m. - 10:30 p. m.',
    closedLabel: 'Lunes cerrado · excepto festivos',
    opens: '15:30',
    closes: '22:30',
  },
  contact: {
    whatsapp: '[WHATSAPP_OFICIAL]',
    phone: '[TELEFONO_OFICIAL]',
    email: '[EMAIL_OFICIAL]',
    reservationsUrl: '[URL_RESERVAS]',
    menuUrl: '[URL_MENU]',
    mapsUrl: '[URL_GOOGLE_MAPS]',
    instagram: '[INSTAGRAM_OFICIAL]',
    tiktok: '[TIKTOK_OFICIAL]',
    siteUrl: '[URL_OFICIAL]',
  },
  business: {
    cuisine: '[TIPO_DE_COCINA_CONFIRMADO]',
    priceRange: '[RANGO_DE_PRECIOS_CONFIRMADO]',
    heroImage: '[URL_IMAGEN_PRINCIPAL]',
    geo: {
      latitude: '[LATITUD]',
      longitude: '[LONGITUD]',
    },
    attributes: [
      '[ATRIBUTO_REAL_1]',
      '[ATRIBUTO_REAL_2]',
      '[ATRIBUTO_REAL_3]',
    ],
  },
}

export const quickActions = [
  {
    label: 'Reservar',
    href: siteConfig.contact.reservationsUrl,
    external: true,
    icon: '📅',
  },
  {
    label: 'Menú',
    href: '/menu',
    external: false,
    icon: '🍽️',
  },
  {
    label: 'Cómo llegar',
    href: siteConfig.contact.mapsUrl,
    external: true,
    icon: '📍',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
      'Hola ROSÉ Gastro Bar, me gustaría recibir información.'
    )}`,
    external: true,
    icon: '💬',
  },
]

export const menuPreview = [
  {
    category: 'Para compartir',
    items: [
      {
        name: '[PLATO_1]',
        description: '[DESCRIPCION_1]',
        price: '[PRECIO_1]',
      },
    ],
  },
  {
    category: 'Mixología',
    items: [
      {
        name: '[BEBIDA_1]',
        description: '[DESCRIPCION_2]',
        price: '[PRECIO_2]',
      },
    ],
  },
  {
    category: 'Café',
    items: [
      {
        name: '[CAFE_1]',
        description: '[DESCRIPCION_3]',
        price: '[PRECIO_3]',
      },
    ],
  },
]

export const faqs = [
  {
    question: '¿Cómo puedo reservar?',
    answer: 'Puedes reservar desde la web o escribirnos por WhatsApp para recibir ayuda directa.',
  },
  {
    question: '¿Dónde están ubicados?',
    answer: 'Estamos en Calle 14 # 6-76, La Unión, Valle del Cauca.',
  },
  {
    question: '¿Cuál es el horario?',
    answer: 'Martes a Domingo de 3:30 p. m. a 10:30 p. m. Lunes cerrado, excepto festivos.',
  },
]

export const socialProof = {
  rating: '[CALIFICACION_GOOGLE]',
  reviewsCount: '[NUMERO_RESEÑAS]',
  testimonial: '[TESTIMONIO_REAL_1]',
}

export function buildRestaurantSchema(pageUrl = siteConfig.contact.siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: siteConfig.brand,
    image: siteConfig.business.heroImage,
    url: pageUrl,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: 'CO',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.business.geo.latitude,
      longitude: siteConfig.business.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: siteConfig.hours.regularDays,
        opens: siteConfig.hours.opens,
        closes: siteConfig.hours.closes,
      },
    ],
    servesCuisine: siteConfig.business.cuisine,
    priceRange: siteConfig.business.priceRange,
    menu: siteConfig.contact.menuUrl,
    sameAs: [siteConfig.contact.instagram, siteConfig.contact.tiktok].filter(Boolean),
  }
}
