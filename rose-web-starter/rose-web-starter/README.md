# ROSÉ Gastro Bar - Starter público para Vite + React

Este starter implementa la base pública de la web de ROSÉ Gastro Bar con:

- 6 rutas públicas
- Layout sticky + barra móvil de acciones rápidas
- Tokens visuales `Day-to-Night Editorial`
- Gestión simple de SEO sin dependencias extra
- Inyección de JSON-LD para SEO local
- Estructura lista para conectar reservas reales, WhatsApp y menú HTML

## Estructura sugerida

```txt
src/
  components/
  data/
  hooks/
  pages/
  styles/
  App.jsx
  main.jsx
```

## Instalación

1. Copia `src/` dentro de tu proyecto Vite + React.
2. Asegúrate de tener `react-router-dom` instalado.
3. Sustituye tus `main.jsx` y `App.jsx` por los de este starter, o integra el router manualmente.
4. Reemplaza los placeholders en `src/data/site.js`.
5. Añade imágenes reales y optimizadas.

## Decisiones técnicas

- **Sin `react-helmet`**: este starter usa un hook ligero (`useSeo`) para `title`, `meta description`, `canonical` y JSON-LD.
- **Sin Google Fonts por defecto**: se dejan stacks seguras para evitar depender de terceros. Si luego decides usar fuentes externas, mejor autoalojarlas.
- **JSON-LD por ruta**: se inyecta desde el cliente; válido para Vite CSR, pero hay que probarlo con Rich Results Test.

## Reemplazos obligatorios

Busca estos campos en `src/data/site.js`:

- `[WHATSAPP_OFICIAL]`
- `[TELEFONO_OFICIAL]`
- `[EMAIL_OFICIAL]`
- `[URL_RESERVAS]`
- `[URL_MENU]`
- `[URL_GOOGLE_MAPS]`
- `[INSTAGRAM_OFICIAL]`
- `[TIKTOK_OFICIAL]`
- `[URL_OFICIAL]`
- `[URL_IMAGEN_PRINCIPAL]`
- `[LATITUD]`
- `[LONGITUD]`
- `[TIPO_DE_COCINA_CONFIRMADO]`
- `[RANGO_DE_PRECIOS_CONFIRMADO]`

## Siguiente sprint recomendado

1. Integrar activos reales.
2. Conectar CTA de reservas al flujo existente.
3. Medir eventos GA4: reservar, WhatsApp, menú, llegar.
4. Añadir imágenes WebP/AVIF con dimensiones explícitas.
5. Validar JSON-LD y metadata.
