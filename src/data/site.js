export const siteConfig = {
  brand: 'ROSÉ Gastro Bar',
  logo: '/Logo.png',
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
    whatsapp: '573000000000',
    phone: '+57 300 000 0000',
    email: 'contacto@rosegastrobar.com',
    reservationsUrl: '/reservar-mesa',
    menuUrl: '/menu',
    mapsUrl: 'https://maps.google.com/?q=Calle+14+%23+6-76,+La+Union,+Valle+del+Cauca',
    instagram: 'https://instagram.com/rosegastrobar',
    tiktok: '',
    siteUrl: 'https://rosegastrobar.com',
  },
  business: {
    cuisine: 'Gastro Bar',
    priceRange: '$$',
    heroImage: '/IMG_6523.JPG.jpeg',
    geo: {
      latitude: '4.5333',
      longitude: '-76.1000',
    },
    attributes: [
      'Terraza al aire libre',
      'Cócteles de autor',
      'Comida gourmet',
    ],
  },
}

export const quickActions = [
  {
    label: 'Reservar',
    href: siteConfig.contact.reservationsUrl,
    external: false,
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
        name: 'Nachos Rosé',
        description: 'Crujientes y perfectos para empezar la noche.',
        price: '$50.000',
      },
      {
        name: 'Cheesecake frutos rojos',
        description: 'Postre clásico con el toque de la casa.',
        price: '$15.000',
      },
    ],
  },
  {
    category: 'Fuertes',
    items: [
      {
        name: 'Rib Eye premium',
        description: 'Corte seleccionado a la perfección.',
        price: '$77.000',
      },
      {
        name: 'Salmón Rosé',
        description: 'Nuestra especialidad en pescados.',
        price: '$55.000',
      },
    ],
  },
  {
    category: 'Mixología',
    items: [
      {
        name: 'Margarita frutos rojos',
        description: 'Refrescante y con el balance perfecto.',
        price: '$29.000',
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
  rating: '4.7',
  reviewsCount: '354',
  reviews: [
    {
      author: 'Kmilo Rico',
      text: 'Excelente.',
      stars: 5,
      details: 'Food 5 / Service 5 / Atmosphere 5'
    },
    {
      author: 'Magally M.',
      text: 'Muy buen ambiente.',
      stars: 5,
      details: 'Food 5 / Service 5 / Atmosphere 4'
    },
    {
      author: 'Hector Eduardo Gonzalez Giraldo',
      text: 'Recomendado.',
      stars: 5,
      details: 'Food 5 / Service 4 / Atmosphere 5'
    }
  ]
};

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
