# AI Project Context — Rose Gastrobar Platform

## 1. Resumen ejecutivo del proyecto
La plataforma de ROSÉ Gastro Bar es un sistema integral diseñado no solo como la presencia web pública del restaurante, sino como una herramienta completa para la automatización de procesos operativos. Su objetivo principal es ofrecer una experiencia "Premium" (estilo Dark Luxury / Day-to-Night) orientada a la conversión, eliminando la gestión manual de reservas mediante un sistema automatizado que valida la capacidad, gestiona clientes, y centraliza la administración operativa.

## 2. Contexto del negocio
ROSÉ Gastro Bar es un establecimiento físico de hostelería que requiere una solución digital dual:
1. **Página Web Pública / Landing:** Para mostrar el menú, la ubicación, las experiencias y atraer al cliente con un fuerte impacto visual.
2. **Sistema de Reservas y CRM:** Un motor de reservas automatizado (con portal para clientes) y un panel administrativo (Dashboard) para que el staff gestione el calendario, la disponibilidad de mesas, la fidelización de usuarios y métricas operativas.
*Nota importante:* Aunque existan referencias a "Shopify" (ej. `ShopifyStore.jsx`), la integración de un e-commerce convencional **no es el objetivo actual**. El enfoque es 100% en el ecosistema del restaurante (reservas, clientes, menú digital).

## 3. Estado actual del proyecto
El proyecto se encuentra en una etapa de desarrollo activa con gran parte de su arquitectura base implementada, pero aún sujeto a refinamientos visuales y de lógica de negocio.

- **Implementado:**
  - Estructura base del monorepo (Frontend Vite/React y Backend Node/Express).
  - Vistas públicas principales (Home, Menu, Experiences, Location, Contact).
  - Flujo de reservas frontend (`/reservar-mesa`) y componentes de calendario (`DatePicker`).
  - Panel de administración base (Dashboard, Reservations, Customers, Settings).
  - Base de datos relacional (Prisma + SQLite) con esquema multi-tenant preparado.
- **Parcialmente implementado:**
  - Portal del cliente (`/mi-reserva` o `/cliente`) para autogestión.
  - Diseño responsivo y estética "Premium / Dark Luxury" (necesita mantenimiento y consistencia visual en algunas áreas).
  - Autenticación: Existe un componente `Login.jsx` pero la infraestructura de seguridad/auth backend está en estado básico.
- **Pendiente:**
  - Integración de pasarelas de pago reales (existe un sandbox de pagos preparado).
  - Sistema de notificaciones automáticas (WhatsApp/Email) para reservas (modelo de base de datos preparado, pero lógica por terminar).
- **No identificado en el proyecto actual:**
  - Plataforma de despliegue configurada (Docker, Vercel, Railway, etc.).
  - Tests automatizados (scripts de test vacíos en el backend).

## 4. Stack técnico
- **Framework frontend:** React.js (v18.3.1) construido y empaquetado con Vite (v5.4.10).
- **Framework backend:** Node.js con Express.js (v5.2.1).
- **Lenguaje principal:** JavaScript / JSX (No se usa TypeScript de forma estricta en todo el proyecto, aunque Prisma genera tipos y hay algunas definiciones).
- **Librerías principales:**
  - Frontend: `react-router-dom` (v7) para rutas, `lucide-react` para iconografía, `recharts` para gráficos, `react-scroll`.
  - Backend: `cors`, `dotenv`, `uuid`.
- **Gestor de paquetes:** `npm` (se utiliza `package-lock.json`).
- **Herramientas de build:** Vite. Se utiliza `concurrently` para correr frontend y backend al mismo tiempo.
- **Herramientas de linting/formateo:** ESLint (v9) con plugins de React.
- **Estilos:** CSS Vanilla / Nativo. **No se usa TailwindCSS** ni otras librerías de utilidades, se sigue una arquitectura de componentes y CSS modular/global (`index.css`, `App.css`, `*.css`).
- **Base de datos:** SQLite en el entorno local (`dev.db`).
- **ORM:** Prisma Client (v6.19.2).
- **Sistema de autenticación:** Implementación propia / simple en progreso (basado en `Login.jsx`).
- **Servicios externos:** Pendiente por definir (sandbox de pagos preparado para Wompi/MercadoPago, notificaciones por WhatsApp planeadas).
- **Plataforma de despliegue:** No identificado en el proyecto actual.

## 5. Estructura del repositorio
El proyecto usa una arquitectura de monorepo simplificada.

```txt
/ (Raíz del proyecto)
├── package.json               # Dependencias de frontend y scripts concurrentes
├── vite.config.js             # Configuración de Vite para el frontend
├── PROJECT_CONTEXT.md         # Documentación previa de contexto del sistema
├── /public/                   # Archivos estáticos accesibles públicamente
├── /server/                   # [BACKEND] Node.js + Express
│   ├── index.js               # Punto de entrada del servidor API
│   ├── package.json           # Dependencias específicas del backend
│   ├── /prisma/               # ORM, migraciones y esquema (schema.prisma)
│   ├── /routes/               # Controladores y endpoints de la API
│   ├── /services/             # Lógica de negocio 
│   └── /utils/                # Utilidades compartidas del backend
└── /src/                      # [FRONTEND] React.js + Vite
    ├── main.jsx               # Punto de entrada de React
    ├── App.jsx                # Enrutador principal de React
    ├── index.css / App.css    # Estilos globales y variables (Dark Luxury)
    ├── /assets/               # Imágenes, fuentes y recursos multimedia
    ├── /components/           # Componentes reutilizables, UI del Admin, Layouts
    ├── /pages/                # Vistas principales del sitio público (Home, Menu, etc.)
    ├── /data/                 # Datos mockeados / información estática
    ├── /hooks/                # Custom React Hooks
    ├── /lib/                  # Configuraciones y utilidades de terceros
    └── /utils/                # Funciones auxiliares de frontend
```

### Próximos pasos recomendados (para asistentes de IA):
1. **Respetar el sistema visual:** Cualquier modificación en la interfaz debe seguir utilizando CSS Vanilla y apegarse a la paleta Dark Luxury y la tipografía actual, evitando introducir Tailwind o librerías externas innecesarias.
2. **Priorizar operaciones sobre e-commerce:** Al añadir funcionalidades, enfocarse en la mejora del flujo de reservas, el portal del cliente y el panel administrativo antes que en soluciones de tienda virtual.
3. **Mantenibilidad Multi-Tenant:** Si se modifica la base de datos a través de Prisma, respetar siempre el campo `restaurantId` ya que el esquema está pensado para ser escalable (SaaS) a futuro.
