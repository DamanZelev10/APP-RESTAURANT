# 🍷 Contexto del Proyecto: APP RESTAURANT (ROSÉ Gastro Bar)

Este documento es la **fuente de verdad principal** para entender la arquitectura, el propósito y el estado actual del proyecto "APP RESTAURANT", diseñado específicamente para **ROSÉ Gastro Bar**. 

**Propósito de este documento:** Servir como contexto base y entrenamiento para asistentes de Inteligencia Artificial y desarrolladores. Si eres una IA leyendo esto, asume que tu objetivo es orientar, mejorar y escalar este sistema basándote en la información aquí contenida.

---

## 1. Visión General y Objetivos de Negocio

El proyecto no es solo una página web transaccional; es un **centro de presencia online y un automatizador de procesos** para el restaurante.

**Objetivos Core:**
1. **Presencia Premium:** Reflejar la identidad exclusiva y cálida de ROSÉ Gastro Bar mediante un diseño "Day-to-Night", atractivo y enfocado en la conversión.
2. **Solución a Problemas Reales:** Eliminar la gestión manual de reservas mediante un sistema automatizado que valide horarios, capacidades, y mantenga al cliente informado.
3. **Nuevas Fuentes de Ingreso:** A través de una mejor gestión del cliente, upselling en el menú, y una plataforma preparada para pagos, el sistema debe abrir vías para que el restaurante genere más ingresos.

*(Nota Importante: Aunque existen archivos llamados `ShopifyStore.jsx`, la integración de una tienda de Shopify **NO es parte de los objetivos del sistema actual**. El enfoque es 100% en el ecosistema del restaurante).*

---

## 2. Stack Tecnológico

El proyecto está dividido en un Frontend y un Backend con la siguiente pila:

- **Frontend:** React.js, Vite, React Router DOM, CSS nativo (sin Tailwind, usando una arquitectura de diseño propia), Lucide React (iconografía) y Recharts (gráficos en dashboard).
- **Backend:** Node.js, Express.js.
- **Base de Datos:** SQLite (archivo `dev.db` en el entorno local), interactuando a través de **Prisma ORM** (`server/prisma/schema.prisma`). *Nota de arquitectura: El esquema está diseñado para ser multi-tenant, permitiendo escalar el SaaS a más restaurantes en el futuro.*

---

## 3. Estructura del Directorio Principal

El repositorio sigue una arquitectura de monorepo simplificada:

```text
/APP RESTAURANT
│
├── /server                 # BACKEND
│   ├── /prisma             # Schema de BD, migraciones y seeders
│   ├── /routes             # Controladores y rutas de Express API
│   ├── /services           # Lógica de negocio pesada
│   ├── /utils              # Utilidades compartidas del backend
│   └── index.js            # Punto de entrada del servidor
│
├── /src                    # FRONTEND
│   ├── /assets             # Imágenes y recursos estáticos
│   ├── /components         # Componentes React reutilizables y layout de admin
│   ├── /data               # Datos simulados/estáticos
│   ├── /pages              # Vistas completas del sitio público
│   ├── /styles             # Archivos CSS globales
│   ├── App.jsx             # Enrutador principal de React
│   └── main.jsx            # Punto de entrada de Vite
│
├── package.json            # Dependencias del proyecto raíz y scripts de inicio
└── vite.config.js          # Configuración del bundler frontend
```

---

## 4. Arquitectura de Datos (Prisma Schema)

El sistema de base de datos se basa en los siguientes modelos clave:

- **`Restaurant` & `RestaurantSettings`**: Define la entidad comercial. Tiene su zona horaria, colores de marca, horarios de apertura (`BusinessHours`) y reglas de reservas (capacidad, tiempo de duración, horas de anticipación).
- **`Reservation`**: El corazón del sistema. Almacena fecha, hora, tamaño del grupo, estado (pending, confirmed, cancelled, completed), y origen de la reserva (web, admin, whatsapp).
- **`Customer`**: Se crea/actualiza con cada reserva. Guarda el historial de reservas de un cliente para fidelización.
- **`Payment`**: Tabla preparada para integración con pasarelas de pago (Sandbox, Wompi, etc.) asociadas a una reserva (ej. pago de anticipos o experiencias).
- **`NotificationLog` & `AuditLog`**: Tablas para trazabilidad de eventos (cambios de estado) y registro de notificaciones enviadas a clientes (ej. mensajes de WhatsApp).

---

## 5. Módulos y Navegación del Sistema (`src/App.jsx`)

La aplicación se divide en tres grandes áreas o módulos funcionales:

### A. Sitio Web Público (`/`)
Diseñado para el cliente final del restaurante.
- **`/` (Home):** Vista principal con impacto visual, hero section y llamado a la acción.
- **`/menu`:** Menú interactivo y responsivo.
- **`/reservas` y `/reservar-mesa`:** Flujos para crear una reserva nueva directamente conectada con la API.
- **`/experiencias`, `/ubicacion`, `/contacto`:** Secciones informativas para agregar valor a la presencia online.

### B. Portal del Cliente (`/mi-reserva` o `/cliente`)
Un área donde el cliente final puede acceder, mediante un identificador o número de teléfono, para ver el estado de su reserva, cancelarla o añadir peticiones especiales sin tener que contactar al restaurante manualmente.

### C. Panel de Administración (`/admin/*`)
Área protegida para el staff y gerencia del restaurante.
- **`/admin/dashboard`:** Métricas generales, reservas del día, gráficas de ocupación.
- **`/admin/reservations`:** Vista de calendario/lista para gestionar (confirmar/cancelar/modificar) todas las reservas, con reglas de negocio aplicadas.
- **`/admin/customers`:** Base de datos de clientes y su nivel de fidelización.
- **`/admin/settings`:** Ajustes operativos del restaurante (horarios, capacidades máximas).

---

## 6. Flujo Principal de Negocio: Las Reservas

El proceso automatizado más importante funciona así:
1. El usuario entra a `/reservar-mesa`.
2. El sistema consulta en la API del backend la disponibilidad de horarios basándose en la configuración (`RestaurantSettings`) y las reservas ya existentes para esa fecha (`Reservation`).
3. El usuario completa el formulario. Se genera la reserva en estado "pending".
4. El sistema crea o actualiza el perfil del `Customer`.
5. *(A futuro)* El sistema envía una notificación (WhatsApp/Email) automática al cliente confirmando la recepción.
6. El staff en el `/admin` aprueba la reserva (pasa a "confirmed") o el cliente confirma por un link que recibió, cerrando el ciclo.

---

## 7. Directrices para la IA

Cuando seas invocada para ayudar en este proyecto, sigue estas reglas:

1. **Enfoque en Solución Real:** Antes de sugerir código complejo, piensa en cómo esa mejora automatiza un proceso u optimiza la operación del personal del restaurante.
2. **Mantén el Estilo Premium:** Cualquier componente visual que desarrolles debe tener un estilo sofisticado ("Day-to-Night", negro, rosa/oro), usando CSS limpio y moderno. No sugieras Tailwind a menos que se te pida.
3. **Escalabilidad Multi-Tenant:** Si modificas el backend o la base de datos, recuerda que en la arquitectura la tabla `Restaurant` existe para que el sistema sea un SaaS a futuro. Respeta el campo `restaurant_id` en las entidades dependientes.
4. **Respeta lo Existente:** Utiliza las librerías actuales (Lucide para iconos, Recharts para gráficos, Fetch API o Axios para llamadas de red).
5. **No pierdas el enfoque:** No desvíes el desarrollo hacia integraciones de e-commerce convencionales (como Shopify), mantén el enfoque en operaciones de hostelería y gastronomía.
