
# MODO AGENTE — Demo gráfica y validación completa de Patch 01 + Patch 02

Actúa como senior full-stack engineer, QA técnico y guía didáctico.

Quiero que pruebes delante de mí, en modo agente, todas las funcionalidades mejoradas en:

- Patch 01: estabilización de reservas + auth backend.
- Patch 02: portal cliente seguro con link único/token.

No quiero solo pruebas por terminal.  
Quiero ver gráficamente cómo se ejecutan estas funcionalidades en el navegador, como si estuviéramos haciendo una demo funcional del producto.

Explícame cada paso de forma sencilla, como si yo no tuviera mucha experiencia técnica.

---

# Objetivo de esta sesión

Validar visualmente y técnicamente que ROSÉ Gastro Bar ahora funciona como una plataforma operativa más segura:

1. El sitio público carga correctamente.
2. El login admin ya no usa `admin/admin`.
3. El dashboard/admin está protegido.
4. Las reservas públicas funcionan sin login.
5. Los teléfonos se normalizan y no duplican clientes.
6. El backend bloquea reservas fuera de horario.
7. Confirmar reserva no la marca como pagada.
8. El portal cliente funciona con link único seguro.
9. El token del portal se limpia de la URL.
10. El cliente solo puede ver/gestionar su reserva específica.
11. Un token no sirve para otra reserva.
12. La búsqueda antigua por teléfono está bloqueada.
13. La solicitud de enlace no permite enumerar clientes.
14. El build final sigue pasando.

---

# Reglas importantes

No hagas nuevas features.

No rediseñes la interfaz.

No hagas refactors grandes.

No hagas commit automático.

No borres migraciones.

No borres datos sin preguntarme, salvo que sea una base local claramente descartable y me expliques antes.

Si encuentras un error menor que bloquea la demo, explícame qué pasa y dime la corrección mínima.

Si encuentras un error de seguridad, detente y explícame el riesgo antes de tocar código.

Durante la demo:

- Muéstrame el navegador.
- Muéstrame el frontend.
- Muéstrame el admin.
- Muéstrame el portal cliente.
- Muéstrame la terminal solo cuando haga falta.
- Explica cada resultado en lenguaje simple.
- Usa datos de prueba claros.
- No expongas secretos completos en pantalla.
- No muestres completo el `JWT_SECRET`.
- No muestres completo el `ADMIN_PASSWORD_HASH`.
- No pegues tokens en logs más de lo necesario.

---

# Datos de prueba sugeridos

Usa estos datos durante la demo:

```txt
Cliente principal:
Nombre: Cliente Demo ROSÉ
Teléfono formato 1: +57 300 123 4567
Teléfono formato 2: 3001234567
Teléfono formato 3: 57 300 123 4567
Personas: 2
Ocasión: cumpleaños

Cliente secundario:
Nombre: Cliente Segundo ROSÉ
Teléfono: +57 301 222 3344
Personas: 2
Ocasión: aniversario

Admin:
Usuario: admin
Contraseña de prueba local: MiPasswordSegura123

Para la fecha de reserva:

Usa una fecha futura.
Primero consulta slots disponibles.
Usa una hora disponible real.
No fuerces una fecha/hora si el backend la rechaza por reglas de horario.
Para la prueba negativa de horario, usa una hora claramente inválida como 03:00.
Fase 0 — Confirmación inicial del repositorio

Antes de levantar nada, ejecuta:

git branch --show-current
git status --short
git diff --stat

Explícame:

En qué rama estamos.
Si parece que estamos en la rama del Patch 01 o Patch 02.
Qué archivos están modificados.
Si hay cambios sospechosos o fuera de alcance.

Resultado esperado:

La rama debería ser algo como:
patch-01-core-reservations-auth, o
patch-02-secure-customer-portal, o
una rama que ya contenga ambos patches.

No hagas commit.

Fase 1 — Verificación rápida de archivos clave

Ejecuta:

rg "admin/admin|authenticated|ADMIN_PASSWORD|customer-search|customer-action|tokenHash|CustomerPortalToken|customer-portal|bcryptjs|jsonwebtoken" src server

Explícame el resultado.

Validaciones esperadas:

admin/admin no debe existir.
No debe existir login falso basado en authenticated.
No debe existir ADMIN_PASSWORD en texto plano.
bcryptjs y jsonwebtoken deben existir para auth backend.
CustomerPortalToken o una implementación equivalente debe existir para Patch 02.
customer-search y customer-action pueden aparecer, pero solo si están bloqueados, deprecados o migrados a token.
tokenHash puede aparecer internamente, pero jamás debe devolverse en responses públicas.

Si aparece algo peligroso, detente y explícame.

Fase 2 — Instalar dependencias

Desde la raíz del proyecto:

npm install

Luego:

cd server
npm install
cd ..

Explícame:

Que la raíz corresponde al frontend React/Vite.
Que /server corresponde al backend Express.
Que ambos tienen dependencias propias.
Si hay warnings, dime si bloquean o no.

No intentes arreglar warnings de npm que no bloqueen la demo.

Fase 3 — Revisar variables de entorno

Verifica que existan:

server/.env
server/.env.example

Si server/.env no existe, créalo desde el ejemplo:

Mac/Linux:

cp server/.env.example server/.env

Windows:

copy server\.env.example server\.env

Luego verifica que server/.env tenga estas variables:

DATABASE_URL="file:./dev.db"
PORT=3001
CORS_ORIGIN=http://localhost:5173
CLIENT_ORIGIN=http://localhost:5173

JWT_SECRET=...
JWT_EXPIRES_IN=8h

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=...
ADMIN_DISPLAY_NAME=ROSÉ Admin

PORTAL_TOKEN_DEV_RETURN=true
CUSTOMER_PORTAL_REQUEST_LIMIT=5
CUSTOMER_PORTAL_REQUEST_WINDOW_MINUTES=15
CUSTOMER_PORTAL_ACTION_CUTOFF_HOURS=2

No muestres valores completos de secretos.

Solo dime:

JWT_SECRET: configurado / no configurado
ADMIN_PASSWORD_HASH: configurado / no configurado
CLIENT_ORIGIN: configurado / no configurado
PORTAL_TOKEN_DEV_RETURN: true/false
Fase 4 — Preparar contraseña admin local

Si ADMIN_PASSWORD_HASH está vacío, incompleto o es placeholder, genera uno.

Desde /server:

node scripts/hash-password.js "MiPasswordSegura123"

Pega el resultado en server/.env.

Explícame de forma simple:

La contraseña real no se guarda.
Se guarda un hash.
El login compara la contraseña escrita contra ese hash.
Para la demo usaremos:
usuario: admin
contraseña: MiPasswordSegura123
Fase 5 — Preparar Prisma y base de datos

Desde /server, ejecuta:

npx prisma generate

Luego:

npx prisma migrate dev

Explícame:

Prisma Client permite que el backend hable con la base de datos.
Las migraciones crean o actualizan las tablas.
SQLite usa un archivo local, normalmente dev.db.

Si aparece error EPERM en Windows:

Explica que probablemente hay un proceso Node bloqueando Prisma.
Lista procesos si hace falta.
Detén solo procesos Node relacionados con este proyecto.
Vuelve a ejecutar npx prisma generate.

No borres la base de datos sin pedirme permiso.

Fase 6 — Levantar backend

En una terminal, entra a /server:

cd server
npm run start

Confirma que el backend corre en:

http://localhost:3001

Prueba health si existe:

curl -i http://localhost:3001/api/health

Si /api/health no existe, no pasa nada. Lo validamos luego con endpoints reales.

Explícame:

El backend es la API.
Aquí viven login, reservas, portal cliente y admin.
Debe quedar corriendo mientras hacemos la demo.
Fase 7 — Levantar frontend

En otra terminal, desde la raíz:

npm run dev

Confirma que Vite corre en:

http://localhost:5173

Abre el navegador en:

http://localhost:5173

Validación visual:

La página pública de ROSÉ carga.
No hay pantalla blanca.
No hay errores evidentes en consola.
El estilo Dark Luxury sigue intacto.
El sitio se siente como landing premium de restaurante.

Explícame visualmente lo que estás viendo.

Fase 8 — Demo gráfica del sitio público

En el navegador, recorre brevemente:

Home
Menú
Experiencias
Ubicación
Contacto
Reservar mesa

No profundices demasiado en diseño.

Solo confirma:

Las rutas cargan.
La navegación funciona.
No se rompió la estética pública.
No hay errores críticos en consola.

Esto prueba que los patches de backend no rompieron la web pública.

Fase 9 — Patch 01: login admin gráfico

Abre:

http://localhost:5173/login

Haz login con:

Usuario: admin
Contraseña: MiPasswordSegura123

Validación visual esperada:

El formulario acepta las credenciales.
No aparece error.
Redirige al dashboard/admin.
Se ve el panel administrativo.

Ahora cierra sesión si existe botón de logout y vuelve a entrar.

Luego prueba credenciales incorrectas:

Usuario: admin
Contraseña: password-incorrecto

Resultado esperado:

No entra.
Muestra error claro.
No redirige al admin.

Explícame:

Antes había riesgo de login falso.
Ahora el frontend habla con /api/auth/login.
El backend valida con bcrypt + JWT.
Fase 10 — Patch 01: protección admin por API

En terminal, prueba reservas admin sin token:

curl -i http://localhost:3001/api/reservations

Resultado esperado:

401 Unauthorized

Explícame:

Esto es bueno.
Significa que nadie puede listar reservas admin sin sesión.

Ahora haz login por API:

curl -i -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"password\":\"MiPasswordSegura123\"}"

Copia el token, pero no lo muestres completo innecesariamente.

Prueba /auth/me:

curl -i http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TOKEN_ADMIN"

Resultado esperado:

200 OK

Prueba reservas admin con token:

curl -i http://localhost:3001/api/reservations \
  -H "Authorization: Bearer TOKEN_ADMIN"

Resultado esperado:

200 OK

Explícame:

Sin token: bloqueado.
Con token válido: permitido.
Esa es la protección real del panel admin.
Fase 11 — Patch 01: crear reserva pública gráficamente

En navegador abre:

http://localhost:5173/reservar-mesa

Antes de llenar el formulario, consulta slots disponibles para elegir una hora válida:

curl -i "http://localhost:3001/api/reservations/slots?date=2026-05-15"

Si esa fecha no sirve, prueba otra fecha futura.

Elige una hora disponible.

En el formulario gráfico de reserva usa:

Nombre: Cliente Demo ROSÉ
Teléfono: +57 300 123 4567
Fecha: fecha futura disponible
Hora: primera hora disponible razonable
Personas: 2
Ocasión: cumpleaños
Notas: Mesa tranquila si es posible

Validación visual esperada:

El cliente puede reservar sin login.
Se muestra confirmación.
Si Patch 02 está implementado, aparece botón o enlace tipo:
Gestionar mi reserva
Copiar enlace
Ir a mi reserva

Explícame:

Este endpoint debe ser público porque un cliente externo necesita reservar.
Público no significa inseguro: el backend valida horario, capacidad y datos.

Guarda el reservationId y el link del portal si aparece.

Fase 12 — Patch 01: crear reserva por API y capturar link del portal

Ejecuta:

curl -i -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Cliente Demo API ROSÉ\",
    \"phone\": \"+57 300 123 4567\",
    \"reservationDate\": \"2026-05-16\",
    \"reservationTime\": \"19:00\",
    \"partySize\": 2,
    \"occasion\": \"cumpleaños\",
    \"specialRequests\": \"Mesa cerca de la barra\"
  }"

Si la fecha/hora falla por horario o capacidad, usa una fecha/hora disponible consultando /slots.

Resultado esperado:

201 Created.
Devuelve datos de reserva.
Si Patch 02 está completo, devuelve portal.url.

Guarda:

RESERVATION_ID_1
CUSTOMER_ID_1, si aparece
PORTAL_URL_1
RAW_TOKEN_1, extraído del portal.url

No escribas el token en archivos.

Solo úsalo para pruebas.

Fase 13 — Patch 01: normalización de teléfonos

Crea una segunda reserva con el mismo cliente pero teléfono en formato distinto:

curl -i -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Cliente Demo API ROSÉ\",
    \"phone\": \"3001234567\",
    \"reservationDate\": \"2026-05-17\",
    \"reservationTime\": \"19:00\",
    \"partySize\": 2,
    \"occasion\": \"cena\"
  }"

Si falla por horario, usa una fecha/hora válida.

Resultado esperado:

201 Created.
No crea un cliente duplicado.
Reutiliza el mismo customer si el sistema lo devuelve.
El teléfono queda normalizado a:
+573001234567

Después entra visualmente al admin:

http://localhost:5173/admin/customers

o la ruta real de clientes.

Busca Cliente Demo.

Validación visual esperada:

No aparecen varios clientes duplicados por el mismo número.
El historial o contador de reservas refleja más de una reserva para el mismo cliente, si la UI lo muestra.

Explícame:

Antes el sistema podía buscar con teléfono crudo y guardar normalizado.
Ahora busca y guarda siempre normalizado.
Eso mejora CRM y evita duplicados.
Fase 14 — Patch 01: validación de horarios

Primero muestra una reserva válida en slots:

curl -i "http://localhost:3001/api/reservations/slots?date=2026-05-18"

Luego intenta crear una reserva claramente inválida a las 03:00:

curl -i -X POST http://localhost:3001/api/reservations \
  -H "Content-Type: application/json" \
  -d "{
    \"fullName\": \"Cliente Fuera de Horario\",
    \"phone\": \"+57 300 999 9999\",
    \"reservationDate\": \"2026-05-18\",
    \"reservationTime\": \"03:00\",
    \"partySize\": 2,
    \"occasion\": \"prueba\"
  }"

Resultado esperado:

Error controlado.
No crea reserva.
Mensaje claro en español.
No muestra stack trace.

También intenta, si puedes, una hora demasiado cerca del cierre.

Ejemplo conceptual:

Si el restaurante cierra a las 23:00 y la duración es 120 minutos,
una reserva a las 22:30 debe bloquearse.

Explícame:

El frontend puede equivocarse o ser manipulado.
El backend es quien debe bloquear definitivamente.
Esto protege la operación real del restaurante.
Fase 15 — Patch 01: confirmar reserva no marca pago

Desde el admin visual:

Entra al dashboard/admin.
Abre reservas.
Busca una reserva pendiente.
Confírmala desde la UI si existe botón.

Validación visual esperada:

Estado cambia a confirmed.

Luego confirma técnicamente por API si necesitas:

curl -i -X PATCH http://localhost:3001/api/reservations/RESERVATION_ID_1/status \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"confirmed\"}"

Resultado esperado:

status = confirmed.
confirmedAt se llena.
isPaid sigue en false.
paidAt sigue en null.

Explícame:

Confirmar reserva es una acción operativa.
Pago es una acción financiera.
No deben mezclarse.
Fase 16 — Patch 02: abrir portal cliente con link único gráficamente

Toma PORTAL_URL_1.

Abre en navegador:

http://localhost:5173/mi-reserva?token=RAW_TOKEN_1

Validación visual esperada:

Se carga la reserva correcta.
La URL se limpia automáticamente y queda:
http://localhost:5173/mi-reserva
El token queda en sessionStorage, no en localStorage.
La pantalla muestra solo información segura:
nombre;
fecha;
hora;
personas;
estado;
teléfono parcialmente oculto;
botón de cancelar si aplica.

No debe mostrar:

restaurantId
customerId
tokenHash
adminNotes
auditLogs
notificationLogs
JWT admin
datos internos de pago

Abre DevTools si hace falta y verifica:

Application → Session Storage

Debe existir algo como:

rose_customer_portal_token

Y en Local Storage no debe guardarse el token del portal cliente.

Explícame:

El token identifica una reserva específica.
No es una sesión admin.
Se guarda temporalmente para esa pestaña/sesión.
Limpiar la URL reduce filtraciones.
Fase 17 — Patch 02: consultar portal por API

Con RAW_TOKEN_1, ejecuta:

curl -i http://localhost:3001/api/customer-portal/reservation \
  -H "X-Portal-Token: RAW_TOKEN_1"

Resultado esperado:

200 OK.
Devuelve reserva sanitizada.
Incluye phoneMasked.
No devuelve tokenHash.
No devuelve restaurantId.
No devuelve customerId.
No devuelve logs internos.

Ahora prueba token inválido:

curl -i http://localhost:3001/api/customer-portal/reservation \
  -H "X-Portal-Token: token-invalido-demo"

Resultado esperado:

401, 403 o 410.
No devuelve datos.
No revela si alguna reserva existe.

Explícame:

El sistema ya no confía en teléfono.
Confía en un token de alta entropía.
En DB solo se guarda hash, no token crudo.
Fase 18 — Patch 02: cancelar reserva desde portal gráfico

En el navegador, estando en /mi-reserva, presiona el botón de cancelar reserva.

Si aparece modal o confirmación:

Escribe una razón:
No puedo asistir
Confirma.

Validación visual esperada:

La reserva cambia a cancelled.
El botón de cancelar desaparece o queda deshabilitado.
Se muestra mensaje de cancelación exitosa.
No permite cancelar dos veces.

Luego entra al admin visual:

http://localhost:5173/admin/reservations

Valida:

La reserva aparece como cancelada.
El cambio se refleja para el staff.

Explícame:

Esta acción viene del cliente.
Debe auditarse.
No debe tocar pagos.
Fase 19 — Patch 02: cancelar por API con token válido

Si la reserva anterior ya fue cancelada, crea otra reserva para esta prueba.

Con RESERVATION_ID_2 y RAW_TOKEN_2, ejecuta:

curl -i -X PATCH http://localhost:3001/api/customer-portal/reservations/RESERVATION_ID_2/action \
  -H "Content-Type: application/json" \
  -H "X-Portal-Token: RAW_TOKEN_2" \
  -d "{\"action\":\"cancel\",\"reason\":\"No puedo asistir\"}"

Resultado esperado:

200 OK.
Estado pasa a cancelled.
cancelledAt se llena.
Se crea AuditLog.
isPaid no cambia.
paidAt no cambia.

Explícame:

Este es el endpoint seguro nuevo.
Requiere token.
El token debe pertenecer exactamente a esa reserva.
Fase 20 — Patch 02: un token no sirve para otra reserva

Crea dos reservas:

Reserva A → RAW_TOKEN_A
Reserva B → RESERVATION_ID_B

Intenta cancelar la Reserva B usando el token de la Reserva A:

curl -i -X PATCH http://localhost:3001/api/customer-portal/reservations/RESERVATION_ID_B/action \
  -H "Content-Type: application/json" \
  -H "X-Portal-Token: RAW_TOKEN_A" \
  -d "{\"action\":\"cancel\",\"reason\":\"prueba maliciosa\"}"

Resultado esperado:

403 o 404.
La Reserva B no cambia.
No se crea cancelación.
No se filtran datos sensibles.

Luego revisa visualmente en admin que la Reserva B sigue activa.

Explícame claramente:

Esta prueba demuestra que un link robado no sirve para manipular otras reservas.
El token tiene alcance limitado.
Fase 21 — Patch 02: endpoints antiguos inseguros bloqueados

Prueba búsqueda antigua por teléfono:

curl -i "http://localhost:3001/api/reservations/customer-search?phone=3001234567"

Resultado esperado:

410 Gone, 401 Unauthorized o 403 Forbidden.
No devuelve reservas.
No dice si el teléfono existe.

Prueba acción antigua sin token:

curl -i -X PATCH http://localhost:3001/api/reservations/RESERVATION_ID_1/customer-action \
  -H "Content-Type: application/json" \
  -d "{\"action\":\"cancel\",\"reason\":\"ataque simulado\"}"

Resultado esperado:

No cancela nada.
No devuelve datos sensibles.
Devuelve error controlado o endpoint deprecado.

Explícame:

Antes, buscar/cancelar por teléfono era el mayor riesgo del portal.
Ahora está eliminado o bloqueado.
Fase 22 — Patch 02: request-access sin enumeración

Abre en navegador:

http://localhost:5173/mi-reserva

Sin token, debe aparecer formulario:

Solicitar enlace de acceso
Teléfono

Prueba con teléfono existente:

+57 300 123 4567

Resultado visual esperado:

Si encontramos reservas activas asociadas a este teléfono, enviaremos un enlace de acceso.

Luego prueba con teléfono inexistente:

+57 399 999 9999

Resultado visual esperado:

El mismo mensaje genérico.

No debe decir:

Teléfono no encontrado
Reserva encontrada
Tienes 2 reservas
Cliente existente
Cliente no existe

Si PORTAL_TOKEN_DEV_RETURN=true y estás en desarrollo, puede mostrar links en una caja claramente marcada:

Solo desarrollo

Explícame:

Responder igual evita que alguien use el formulario para descubrir quién tiene reservas.
Es una protección contra enumeración.
Fase 23 — Patch 02: rate limit básico

Prueba varias veces seguidas el endpoint de request-access.

Ejemplo:

curl -i -X POST http://localhost:3001/api/customer-portal/request-access \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+57 300 123 4567\"}"

Repítelo más veces que el límite configurado.

Resultado esperado:

Al principio responde 200.
Después debe responder algo como 429 Too Many Requests.

Explícame:

Esto evita abuso automatizado.
Es rate limiting básico en memoria.
En producción se recomienda algo más robusto como Redis o gateway/proxy.
Fase 24 — Inspección visual de almacenamiento del navegador

Abre DevTools:

Application → Local Storage
Application → Session Storage

Valida:

Local Storage

Debe contener, si aplica:

admin JWT / user admin

No debe contener:

portal token cliente
Session Storage

Debe contener:

token del portal cliente

Explícame:

Admin JWT y token cliente son cosas distintas.
No deben mezclarse.
El token del cliente se guarda en sessionStorage para reducir exposición.
Fase 25 — Revisar responses públicas

Ejecuta:

rg "include:|select:|adminNotes|audit|notification|restaurantId|customerId|tokenHash|isPaid|paidAt" server/routes

Luego inspecciona específicamente rutas públicas del portal:

server/routes/customerPortal.js
server/routes/reservations.js

Valida:

Las responses públicas usan datos sanitizados.
No devuelven modelos completos con datos internos.
No devuelven tokenHash.
No devuelven logs internos.
No devuelven notas admin.

Explícame cualquier punto sospechoso.

Fase 26 — Build final

Detén servidores si hace falta o abre una nueva terminal.

Desde la raíz:

npm run build

Resultado esperado:

Build exitoso.
No hay errores que bloqueen producción.

Desde /server:

npx prisma generate

Resultado esperado:

Prisma Client generado correctamente.

Si falla:

Explícame qué falló.
Dime si es frontend, backend, Prisma o entorno.
No hagas cambios grandes sin explicarme.
Fase 27 — Demo final resumida en navegador

Haz una mini demo final, rápida y visual:

Abre home.
Abre reservar mesa.
Crea o muestra una reserva existente.
Abre admin.
Muestra reservas.
Abre portal cliente con link.
Muestra que el token se limpió de la URL.
Muestra que el cliente puede ver solo su reserva.
Muestra que no hay acceso por teléfono abierto.
Muestra que admin sigue protegido.

Quiero ver el flujo completo como producto:

Cliente reserva → recibe link → gestiona su reserva → staff lo ve en admin
Reporte final obligatorio

Al terminar, entrégame un reporte con esta estructura:

Resultado general

Indica uno:

Aprobado
Aprobado con observaciones
No aprobado
Patch 01 — Resultado

Confirma:

Login admin real con JWT: sí/no.
Login falso eliminado: sí/no.
Rutas admin protegidas: sí/no.
Reservas públicas funcionando: sí/no.
Teléfono normalizado: sí/no.
Sin clientes duplicados por formato de teléfono: sí/no.
Horarios bloqueantes: sí/no.
Confirmar reserva no marca pago: sí/no.
Transacciones Prisma funcionando: sí/no.
Multi-tenant safety básico: sí/no.
Patch 02 — Resultado

Confirma:

Link único por reserva: sí/no.
Token crudo no se guarda en DB: sí/no.
DB guarda hash: sí/no.
Portal carga con token: sí/no.
URL limpia token: sí/no.
Token en sessionStorage: sí/no.
Portal no expone datos internos: sí/no.
Cliente puede cancelar con token válido: sí/no.
Token no sirve para otra reserva: sí/no.
Endpoints antiguos bloqueados: sí/no.
Request-access no enumera: sí/no.
Rate limit básico funcionando: sí/no.
Evidencias

Incluye:

Comandos ejecutados.
Códigos HTTP relevantes.
Capturas textuales breves.
Rutas vistas en navegador.
Resultados de build.
Resultado de Prisma generate.
Errores encontrados

Para cada error:

Qué pasó:
Dónde pasó:
Impacto:
Cómo se resolvió o qué queda pendiente:
Riesgos pendientes

Lista riesgos para futuros patches:

WhatsApp/email real.
Rate limit productivo con Redis/gateway.
Tests automatizados.
Deploy.
Pagos reales.
Responsive polish.
Observabilidad/logs.
Portal con OTP futuro si se quiere historial de cliente.
Recomendación

Dime claramente:

Patch 01 y Patch 02 pueden considerarse cerrados.

o:

Patch 01 aprobado, Patch 02 requiere correcciones.

o:

No aprobar todavía.