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
- Envío automático y notificaciones reales de WhatsApp.
- Endurecimiento de la seguridad en el portal del cliente (autenticación vía OTP o link seguro en lugar de búsqueda abierta por teléfono).
