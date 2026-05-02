Perfecto. Este es el Patch 03A real: WhatsApp Cloud API en modo test + ngrok para que el link recibido en tu celular abra correctamente el portal cliente.

La idea es completar este flujo:

Cliente solicita acceso desde /mi-reserva
→ backend busca reservas activas
→ genera/reutiliza link único seguro
→ WhatsApp Cloud API envía el link
→ tú recibes el WhatsApp en tu celular
→ abres el link vía ngrok
→ entra al portal seguro de la reserva

Esto encaja directamente con la arquitectura del proyecto: el foco es reservas, CRM, portal cliente y operación del restaurante, no e-commerce.

Aquí tienes el prompt listo para Antigravity.

# PATCH 03A — WhatsApp Cloud API Test Mode + ngrok para portal cliente

Actúa como senior full-stack engineer dentro del repositorio ROSÉ Gastro Bar.

Quiero implementar el Patch 03A para conectar WhatsApp Cloud API en modo test y poder enviar links únicos del portal cliente por WhatsApp desde mi entorno local.

Venimos de:

- Patch 01: auth admin real, reservas transaccionales, normalización de teléfonos, horarios/capacidad estrictos, separación reserva/pago.
- Patch 02: portal cliente seguro con link único/token, endpoints antiguos por teléfono bloqueados y request-access sin enumeración.

Ahora necesitamos:

```txt
Cliente entra a /mi-reserva
→ escribe teléfono
→ backend genera/reutiliza link único seguro
→ backend envía WhatsApp real usando Cloud API
→ mensaje llega al número de prueba configurado
→ link abre el frontend mediante ngrok
→ portal cliente carga la reserva
Datos ya configurados por el usuario

La app de Meta Developers ya está creada.

Datos de WhatsApp Cloud API:

Graph API Version: v25.0
Phone Number ID: 1091634064033152
WhatsApp Business Account ID: 1687772892249898
Número test destino: 573112905666
País: Colombia
Número personal verificado: Sí
hello_world recibido: Sí
El usuario respondió “ok” desde WhatsApp al número test: Sí

El usuario ya pegó el access token y las variables en server/.env.

IMPORTANTE:

No mostrar el access token completo.
No imprimirlo en consola.
No subirlo al repo.
No moverlo al frontend.
No copiarlo a README.
No loguearlo.
Objetivo exacto del Patch 03A

Implementar un motor de notificaciones mínimo con WhatsApp Cloud API en modo test.

Debe permitir:

Probar envío directo desde backend.
Enviar links únicos del portal cliente desde /api/customer-portal/request-access.
Usar WHATSAPP_DEV_RECIPIENT_PHONE como destinatario forzado en modo test.
Usar ngrok para que el link recibido en el celular abra el portal.
Mantener la seguridad del Patch 02:
no enumerar teléfonos;
no revelar si hay reservas;
no devolver links públicamente en producción;
no exponer tokenHash;
no mezclar JWT admin con token de cliente.
Reglas estrictas

NO implementar todavía:

WhatsApp producción para clientes reales.
Templates personalizados aprobados.
Recordatorios automáticos.
Webhook completo de estados.
Chatbot.
Bandeja de entrada.
OTP.
Pagos.
Rediseño visual.
Tailwind.
TypeScript.
Campañas o marketing.

SÍ implementar:

Provider WhatsApp Cloud API.
Provider mock.
Notification service.
Script de prueba WhatsApp.
Integración con POST /api/customer-portal/request-access.
Configuración ngrok-friendly.
Logs seguros en NotificationLog, si el schema lo permite.
README con instrucciones claras.
Pruebas manuales y demo gráfica.

No hagas commit automático.

Rama de trabajo

Crear rama:

git checkout -b patch-03a-whatsapp-cloud-ngrok

Antes de modificar, inspeccionar:

git status --short
git branch --show-current
rg "NotificationLog|request-access|customer-portal|portal.url|CustomerPortalToken|WHATSAPP|CLIENT_ORIGIN|VITE_API_URL|normalizePhone|tokenHash" server src vite.config.js package.json

Revisar especialmente:

server/routes/customerPortal.js
server/routes/reservations.js
server/prisma/schema.prisma
server/.env.example
server/index.js
src/lib/api.js
src/App.jsx
vite.config.js
README.md
Parte 1 — Estrategia ngrok para móvil

Necesitamos que el link de WhatsApp abra desde el celular.

Problema:

http://localhost:5173/mi-reserva?token=...

no sirve desde el celular porque localhost apunta al celular, no al computador.

Estrategia preferida

Usar ngrok para el frontend y hacer que el frontend llame al backend mediante proxy local de Vite.

Flujo:

Celular
→ https://xxxx.ngrok-free.app/mi-reserva
→ Vite dev server local
→ /api se proxya a http://localhost:3001
→ backend Express

Esto permite usar un solo link público de ngrok para abrir el portal desde WhatsApp.

Validar si vite.config.js ya tiene proxy

Abrir vite.config.js.

Si no existe proxy, agregar uno para desarrollo:

server: {
  host: '0.0.0.0',
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
      secure: false
    }
  }
}

Cuidado:

No romper configuración existente.
Si ya hay server, integrar ahí.
No cambiar build de producción innecesariamente.
Revisar src/lib/api.js

Si el frontend usa:

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

Debe soportar VITE_API_URL=/api.

Crear o actualizar archivo raíz:

.env.local

con:

VITE_API_URL=/api

Esto hace que, cuando el celular abra la app vía ngrok, las llamadas API vayan a:

https://xxxx.ngrok-free.app/api/...

y Vite las proxyee al backend local.

Backend CORS

Si usamos proxy /api, CORS no debería ser problema porque el navegador ve el mismo origen.

Pero mantener en server/.env:

CORS_ORIGIN=http://localhost:5173

Si se decide usar backend con ngrok separado, entonces habría que agregar la URL ngrok del frontend al CORS. Pero la estrategia preferida es un solo ngrok para frontend + proxy.

Parte 2 — Verificar variables de entorno

El usuario ya pegó variables en server/.env.

Validar que existan sin mostrar secretos:

WHATSAPP_PROVIDER=cloud_api
WHATSAPP_SEND_ENABLED=true
WHATSAPP_SEND_MODE=test

WHATSAPP_API_VERSION=v25.0
WHATSAPP_PHONE_NUMBER_ID=1091634064033152
WHATSAPP_BUSINESS_ACCOUNT_ID=1687772892249898
WHATSAPP_ACCESS_TOKEN=...

WHATSAPP_DEV_RECIPIENT_PHONE=573112905666

CLIENT_ORIGIN=https://REEMPLAZAR_CON_URL_NGROK
WHATSAPP_WEBHOOK_ENABLED=false
WHATSAPP_VERIFY_TOKEN=rose_local_verify_token_123

Si CLIENT_ORIGIN todavía está como:

CLIENT_ORIGIN=http://localhost:5173

explicar que para WhatsApp móvil debe cambiarse a la URL pública de ngrok.

No mostrar WHATSAPP_ACCESS_TOKEN.

Actualizar server/.env.example con defaults seguros:

# WhatsApp Cloud API — Patch 03A
WHATSAPP_PROVIDER=mock
WHATSAPP_SEND_ENABLED=false
WHATSAPP_SEND_MODE=test

WHATSAPP_API_VERSION=v25.0
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_ACCESS_TOKEN=

# En modo test, todos los mensajes se fuerzan a este número
WHATSAPP_DEV_RECIPIENT_PHONE=

# Debe ser la URL del frontend; para pruebas móviles usar ngrok
CLIENT_ORIGIN=http://localhost:5173

# Webhooks opcionales para futuros patches
WHATSAPP_WEBHOOK_ENABLED=false
WHATSAPP_VERIFY_TOKEN=
Parte 3 — Crear estructura de Notification Engine

Crear carpetas y archivos:

server/services/notifications/
server/services/notifications/providers/
server/services/notifications/templates/

Crear:

server/services/notifications/notificationService.js
server/services/notifications/providers/mockProvider.js
server/services/notifications/providers/whatsappCloudProvider.js
server/services/notifications/templates/reservationMessages.js
server/scripts/test-whatsapp.js

No instalar SDK externo de WhatsApp.

Usar fetch nativo de Node si está disponible.

Si el Node local no soporta fetch, verificar versión con:

node -v

Si es Node 18+, usar fetch.

Si es menor, documentar que se requiere Node 18+ o pedir permiso antes de instalar dependencia.

No agregar dependencias innecesarias.

Parte 4 — WhatsApp Cloud Provider

En:

server/services/notifications/providers/whatsappCloudProvider.js

Implementar:

export async function sendWhatsAppText({ to, body, previewUrl = true }) {}

Comportamiento:

Leer variables:
WHATSAPP_API_VERSION
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_ACCESS_TOKEN
Validar que existan.
Construir URL:
https://graph.facebook.com/{WHATSAPP_API_VERSION}/{WHATSAPP_PHONE_NUMBER_ID}/messages

Con este entorno será:

https://graph.facebook.com/v25.0/1091634064033152/messages
Hacer POST con:
{
  "messaging_product": "whatsapp",
  "to": "573112905666",
  "type": "text",
  "text": {
    "preview_url": true,
    "body": "mensaje..."
  }
}
Headers:
Authorization: Bearer <WHATSAPP_ACCESS_TOKEN>
Content-Type: application/json
Nunca imprimir el token.
Si Meta responde OK:
{
  success: true,
  provider: 'cloud_api',
  providerMessageId: 'wamid...'
}
Si Meta responde error:
{
  success: false,
  provider: 'cloud_api',
  status,
  errorCode,
  errorMessage
}
No lanzar stack traces al cliente.
Loguear errores internos con cuidado, sin token ni link completo si incluye token.
Parte 5 — Mock Provider

En:

server/services/notifications/providers/mockProvider.js

Implementar:

export async function sendWhatsAppText({ to, body, previewUrl = true }) {}

Debe:

No enviar WhatsApp real.
Loguear seguro:
proveedor mock;
teléfono enmascarado;
longitud del mensaje;
si contiene link, sanitizar token.

No imprimir links con token completo.

Sanitizar cualquier URL así:

token=VALOR_REAL → token=[REDACTED]

Retornar:

{
  success: true,
  provider: 'mock',
  providerMessageId: `mock_${Date.now()}`
}
Parte 6 — Template del mensaje

En:

server/services/notifications/templates/reservationMessages.js

Implementar:

export function buildReservationAccessMessage({
  customerName,
  portalUrl,
  restaurantName = 'ROSÉ Gastro Bar'
}) {}

Texto sugerido:

Hola {customerName} 👋

Recibimos tu solicitud de acceso a tu reserva en {restaurantName}.

Gestiona tu reserva aquí:
{portalUrl}

Por seguridad, no compartas este enlace.

Si no hay nombre:

Hola 👋

Recibimos tu solicitud de acceso a tu reserva en ROSÉ Gastro Bar.

Gestiona tu reserva aquí:
{portalUrl}

Por seguridad, no compartas este enlace.

No meter marketing.

No meter promociones.

No usar lenguaje de campaña.

Esto es mensaje transaccional de acceso a reserva.

Parte 7 — Notification Service

En:

server/services/notifications/notificationService.js

Implementar:

export async function sendReservationAccessLinks({
  prisma,
  restaurantId,
  reservationsWithLinks,
  requestedPhone
}) {}

Donde reservationsWithLinks contiene:

{
  reservation,
  portalUrl,
  expiresAt
}

Reglas:

Selección de provider
WHATSAPP_PROVIDER=mock → mockProvider
WHATSAPP_PROVIDER=cloud_api → whatsappCloudProvider
Activación

Si:

WHATSAPP_SEND_ENABLED !== 'true'

entonces:

No enviar WhatsApp real.
Usar mock o registrar como skipped.
No romper el flujo.
Destinatario

Si:

WHATSAPP_SEND_MODE=test

usar siempre:

process.env.WHATSAPP_DEV_RECIPIENT_PHONE

Si:

WHATSAPP_SEND_MODE=production

usar el teléfono normalizado real del cliente.

Para Patch 03A, validar y recomendar:

WHATSAPP_SEND_MODE=test
Logs

Buscar modelo real:

rg "model NotificationLog" server/prisma/schema.prisma

Adaptarse a los campos existentes.

Por cada reserva/link:

Crear NotificationLog pending si el schema lo permite.
Enviar WhatsApp.
Si éxito:
actualizar log a sent;
guardar provider;
guardar providerMessageId si hay campo.
Si falla:
actualizar log a failed;
guardar errorMessage si hay campo.

Nunca guardar:

WHATSAPP_ACCESS_TOKEN
token crudo del portal
tokenHash

Si el modelo tiene campo para mensaje, guardar versión sanitizada:

/mi-reserva?token=[REDACTED]
Seguridad

Aunque falle WhatsApp:

El endpoint público no debe revelar si el teléfono existe.
No debe devolver detalles de error de Meta al cliente.
Debe seguir respondiendo con mensaje genérico.
Parte 8 — Integrar con request-access

En:

server/routes/customerPortal.js

Localizar:

POST /api/customer-portal/request-access

Debe mantener el comportamiento de Patch 02:

Normaliza teléfono.
Busca reservas activas.
Genera/reutiliza links.
Responde siempre mensaje genérico.
No enumera.
No devuelve cantidad de reservas.
No devuelve nombres/fechas/horas públicamente.
En dev puede devolver links solo si PORTAL_TOKEN_DEV_RETURN=true, pero eso no debe ser requisito para WhatsApp.

Agregar llamada:

await sendReservationAccessLinks({
  prisma: req.prisma,
  restaurantId: restaurant.id,
  reservationsWithLinks,
  requestedPhone: normalizedPhone
});

Pero solo si hay reservas activas.

Si no hay reservas:

No enviar WhatsApp.
Responder igual genérico.

Si WhatsApp falla:

Registrar internamente.
Responder igual genérico.

Importante:

No revelar al frontend si WhatsApp se envió o falló.
No revelar al frontend si el teléfono tenía reservas.
Parte 9 — Script de prueba backend

Crear:

server/scripts/test-whatsapp.js

Debe permitir:

cd server
node scripts/test-whatsapp.js

Debe enviar un mensaje simple:

Hola Cristian 👋 Este es un mensaje de prueba desde el backend local de ROSÉ Gastro Bar usando WhatsApp Cloud API.

Debe usar:

WHATSAPP_DEV_RECIPIENT_PHONE

Debe imprimir:

Provider: cloud_api/mock
Recipient: 573****5666
Result: success/failure
ProviderMessageId: ...

No imprimir token.

No imprimir access token.

Si falta configuración, mostrar error claro:

Faltan variables WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_DEV_RECIPIENT_PHONE
Parte 10 — ngrok y ejecución local
Paso A — levantar backend

Terminal 1:

cd server
npm run start

Confirmar:

Backend running on http://localhost:3001
Paso B — levantar frontend con host abierto

Terminal 2, desde raíz:

npm run dev -- --host 0.0.0.0

Confirmar que Vite corre en:

http://localhost:5173
Paso C — levantar ngrok para frontend

Terminal 3:

ngrok http 5173

Tomar la URL HTTPS, ejemplo:

https://abc123.ngrok-free.app

Actualizar en server/.env:

CLIENT_ORIGIN=https://abc123.ngrok-free.app

Actualizar o confirmar en raíz .env.local:

VITE_API_URL=/api

Reiniciar backend después de cambiar CLIENT_ORIGIN.

Reiniciar frontend si se cambia .env.local.

Paso D — probar portal desde celular

El link que llegue por WhatsApp debe verse así:

https://abc123.ngrok-free.app/mi-reserva?token=...

Al abrirlo en el celular:

Debe cargar la app.
Debe cargar la reserva.
Debe limpiar la URL a /mi-reserva.
Debe llamar APIs mediante /api proxied por Vite.

Si falla la API desde el celular:

Revisar VITE_API_URL=/api.
Revisar proxy en vite.config.js.
Revisar backend corriendo.
Revisar consola/network del navegador móvil si es posible.
Revisar logs del backend.
Parte 11 — Prueba directa contra Meta

Antes de probar el flujo completo, ejecutar el script:

cd server
node scripts/test-whatsapp.js

Resultado esperado:

Result: success
ProviderMessageId: wamid...

Y debe llegar WhatsApp al número:

573112905666

Si falla:

Revisar access token.
Revisar que el usuario respondió “ok” al hello_world.
Revisar Phone Number ID.
Revisar número destino.
Revisar que WHATSAPP_SEND_ENABLED=true.
Revisar que WHATSAPP_PROVIDER=cloud_api.
Parte 12 — Prueba gráfica desde /mi-reserva

Con backend, frontend y ngrok corriendo:

Abrir en navegador local:
http://localhost:5173
Crear una reserva futura con un teléfono conocido:
Nombre: Cliente WhatsApp Demo
Teléfono: +57 300 123 4567
Fecha: futura y válida
Hora: slot disponible
Personas: 2
Ocasión: prueba WhatsApp
Ir a:
https://abc123.ngrok-free.app/mi-reserva
Solicitar link con el teléfono:
+57 300 123 4567
El frontend debe mostrar mensaje genérico:
Si tienes reservas activas con el número..., te enviaremos los links de acceso seguro por WhatsApp en breve.
Confirmar que llega WhatsApp al número test:
573112905666
El mensaje debe incluir un link:
https://abc123.ngrok-free.app/mi-reserva?token=...
Abrir el link desde el celular.
Validar:
La reserva carga
La URL se limpia
El token queda en sessionStorage
No se muestra tokenHash
No se muestra restaurantId
No se muestra customerId
No se muestran logs internos
Parte 13 — Prueba contra enumeración

Probar desde /mi-reserva con un teléfono inexistente:

+57 399 999 9999

Resultado esperado:

Mismo mensaje genérico.
No dice “no encontrado”.
No dice “sin reservas”.
No dice cantidad de reservas.
No devuelve datos.
No debe llegar WhatsApp si no hay reservas.
El usuario no puede saber si el teléfono existe.
Parte 14 — Prueba de endpoints antiguos

Confirmar que los endpoints antiguos siguen bloqueados:

curl -i "http://localhost:3001/api/reservations/customer-search?phone=3001234567"

Esperado:

410, 401 o 403

No debe devolver reservas.

curl -i -X PATCH http://localhost:3001/api/reservations/RESERVATION_ID/customer-action \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"cancel\"}"

Esperado:

No cancela nada
No devuelve datos sensibles
Parte 15 — Seguridad de logs

Buscar riesgos:

rg "WHATSAPP_ACCESS_TOKEN|token=|tokenHash|wamid|console.log|NotificationLog" server/services server/routes server/scripts

Validar:

No se imprime access token.
No se imprime token crudo del portal.
No se guarda token crudo en NotificationLog.
Si hay logs, el token aparece como [REDACTED].
wamid sí puede guardarse como providerMessageId.
Parte 16 — Build y Prisma

Ejecutar:

Desde raíz:

npm run build

Desde server:

npx prisma generate

Resultado esperado:

build exitoso;
Prisma Client generado.

Si falla build por VITE_API_URL=/api, corregir de forma compatible.

Parte 17 — README

Actualizar README con sección:

## Patch 03A — WhatsApp Cloud API en modo test

### Objetivo

Permite enviar links únicos del portal cliente por WhatsApp usando Cloud API en entorno local.

### Variables

WHATSAPP_PROVIDER
WHATSAPP_SEND_ENABLED
WHATSAPP_SEND_MODE
WHATSAPP_API_VERSION
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_BUSINESS_ACCOUNT_ID
WHATSAPP_ACCESS_TOKEN
WHATSAPP_DEV_RECIPIENT_PHONE
CLIENT_ORIGIN
VITE_API_URL

### Modo test

En `WHATSAPP_SEND_MODE=test`, todos los mensajes se fuerzan a `WHATSAPP_DEV_RECIPIENT_PHONE`.

### ngrok

Para abrir links desde el celular:

1. Ejecutar frontend:
   `npm run dev -- --host 0.0.0.0`

2. Ejecutar:
   `ngrok http 5173`

3. Copiar URL HTTPS de ngrok.

4. Configurar:
   `CLIENT_ORIGIN=https://xxxx.ngrok-free.app`

5. Configurar frontend:
   `VITE_API_URL=/api`

6. Asegurar proxy `/api` en Vite hacia `http://localhost:3001`.

### Seguridad

- No subir `server/.env`.
- No exponer `WHATSAPP_ACCESS_TOKEN`.
- No guardar tokens crudos del portal en logs.
- No usar producción hasta tener templates aprobados y número real.
- El modo test fuerza mensajes al número de desarrollo.
Criterios de aceptación

Patch 03A está completo solo si:

 Existe whatsappCloudProvider.
 Existe mockProvider.
 Existe notificationService.
 Existe template de mensaje de acceso a reserva.
 Existe server/scripts/test-whatsapp.js.
 server/.env.example documenta variables WhatsApp.
 WHATSAPP_ACCESS_TOKEN no aparece en frontend.
 WHATSAPP_ACCESS_TOKEN no se loguea.
 En modo test, todos los mensajes van a WHATSAPP_DEV_RECIPIENT_PHONE.
 /api/customer-portal/request-access envía WhatsApp si existen reservas activas.
 /api/customer-portal/request-access mantiene respuesta genérica.
 Teléfono inexistente no revela nada.
 El mensaje llega al WhatsApp de prueba.
 El link recibido usa CLIENT_ORIGIN de ngrok.
 El link abre el portal desde el celular.
 El portal carga la reserva.
 El portal limpia el token de la URL.
 No se guarda token crudo del portal en NotificationLog.
 No se rompe Patch 01 ni Patch 02.
 npm run build pasa.
 npx prisma generate pasa.
 README actualizado.
 No se implementan templates personalizados ni producción real.
Entregable final

Al terminar, responder con:

Rama actual.
Archivos modificados/creados.
Variables agregadas o verificadas.
URL ngrok usada, sin tokens.
Resultado de node server/scripts/test-whatsapp.js.
Confirmación de si llegó WhatsApp al número test.
Resultado de prueba desde /mi-reserva.
Confirmación de que el link recibido abrió en celular.
Confirmación de que el portal cargó la reserva.
Confirmación de que el token se limpió de la URL.
Confirmación de que teléfono inexistente no enumera.
Resultado de build.
Resultado de Prisma generate.
Riesgos pendientes para Patch 03B.
Recomendación del siguiente paso.

No hacer commit automático.


---

Antes de ejecutarlo, ten lista esta secuencia mental:

```txt
1. Backend en localhost:3001
2. Frontend en localhost:5173 con --host 0.0.0.0
3. ngrok apuntando a 5173
4. CLIENT_ORIGIN = URL HTTPS de ngrok
5. VITE_API_URL = /api
6. Request access desde /mi-reserva
7. WhatsApp llega a tu celular
8. Link abre portal desde el celular