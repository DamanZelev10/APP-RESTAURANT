# 🍷 ROSÉ Gastro Bar — Plataforma Operativa

Plataforma integral para ROSÉ Gastro Bar. Incluye sitio público premium, motor de reservas, portal de cliente y panel administrativo (CRM).

## 🚀 Instalación y Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   cd server && npm install
   cd ..
   ```

2. **Configuración de variables de entorno (Backend):**
   Copia el archivo de ejemplo:
   ```bash
   cp server/.env.example server/.env
   ```
   
   Genera un hash para tu contraseña de administrador:
   ```bash
   node server/scripts/hash-password.js "tu-password-super-seguro"
   ```
   
   Copia el hash generado y pégalo en `server/.env` en la variable `ADMIN_PASSWORD_HASH`. Configura también tu `JWT_SECRET`.

3. **Base de datos:**
   Asegúrate de sincronizar el schema de Prisma:
   ```bash
   cd server
   npx prisma db push
   npx prisma generate
   ```

4. **Iniciar Servidores:**
   Vuelve a la raíz y corre el proyecto completo (frontend + backend simultáneamente):
   ```bash
   npm run start
   ```

## 🔐 Endpoints y Seguridad

- **Rutas Públicas:** 
  - `/api/reservations/slots` y `/api/reservations/capacity`: Visualizar disponibilidad.
  - `POST /api/reservations`: Crear nueva reserva.
  - `GET /api/reservations/customer-search` y `PATCH /api/reservations/:id/customer-action`: Acciones del portal de clientes.
- **Rutas Administrativas (Protegidas por JWT):**
  - Todas las mutaciones de reservas (`PUT`, `PATCH /status`, `DELETE`, `POST /whatsapp`).
  - Listado completo de reservas (`GET /api/reservations`).
  - Todo bajo `/api/dashboard`, `/api/settings`, `/api/customers`, `/api/alerts`.

*Autenticación en Frontend:* El frontend maneja la autenticación a través de `/login`. Un token JWT es almacenado y validado en cada recarga mediante `GET /api/auth/me` para proteger el layout `/admin`.

## 🛠 Próximos Parches (Roadmap)
- Integración de pasarela de pagos reales (remplazo de Sandbox).
- Envío automático y notificaciones reales de WhatsApp en producción.

---

## Patch 03A — WhatsApp Cloud API en modo test

### Objetivo

Permite enviar links únicos del portal cliente por WhatsApp usando Cloud API en entorno local.

### Variables (`server/.env`)

\`\`\`env
WHATSAPP_PROVIDER=cloud_api
WHATSAPP_SEND_ENABLED=true
WHATSAPP_SEND_MODE=test
WHATSAPP_API_VERSION=v25.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_DEV_RECIPIENT_PHONE=
CLIENT_ORIGIN=
\`\`\`

> **Nota:** En `WHATSAPP_SEND_MODE=test`, todos los mensajes se fuerzan a `WHATSAPP_DEV_RECIPIENT_PHONE`.

### ngrok (Pruebas en Celular)

Para abrir links desde el celular y probar el flujo real:

1. Ejecutar frontend abriendo el host:
   \`\`\`bash
   npm run dev -- --host 0.0.0.0
   \`\`\`

2. Ejecutar ngrok apuntando al puerto del servidor unificado (3001):
   \`\`\`bash
   ngrok http 3001
   \`\`\`

3. Copiar URL HTTPS de ngrok (ej. `https://xxxx.ngrok-free.app`).

4. Configurar en `server/.env`:
   \`\`\`env
   CLIENT_ORIGIN=https://xxxx.ngrok-free.app
   \`\`\`

5. Configurar frontend (en `.env.local` de la raíz):
   \`\`\`env
   VITE_API_URL=/api
   \`\`\`

6. Asegurar proxy `/api` en `vite.config.js` apuntando hacia `http://localhost:3001` (ya configurado por defecto).

### Seguridad

- No subir `server/.env`.
- No exponer `WHATSAPP_ACCESS_TOKEN`.
- No guardar tokens crudos del portal en logs (están sanitizados).
- No usar producción hasta tener templates aprobados y número real.
- El modo test fuerza todos los mensajes al número de desarrollo.
