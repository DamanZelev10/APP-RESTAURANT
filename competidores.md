# Análisis de Competidores y Casos de Uso (Reservas de Restaurantes)

Este documento resume la investigación sobre las aplicaciones de gestión de reservas más populares del mercado, diseñado para guiar el desarrollo de nuestra Single-Page Application (SPA).

## 🏆 Principales Competidores en el Mercado

1. **OpenTable**: El gigante de la industria. Alto costo, pero excelente red de adquisición de clientes.
2. **Resy (Amex)**: Preferido por restaurantes de alta gama. Diseño moderno y funcionalidades analíticas profundas.
3. **Tock**: Especializado en eventos cerrados, menús degustación y reducir los *no-shows* cobrando por adelantado.
4. **Yelp Guest Manager**: Muy fuerte en gestión de listas de espera (Waitlists).
5. **SevenRooms**: Alta prioridad en la retención del huésped, CRM avanzado y reservas directas (sin comisiones de terceros).
6. **Eat App**: Solución basada en la nube ágil y perfecta para tablets/móviles.

---

## ⚙️ Características Comunes (El Estándar)

Todos los sistemas modernos comparten estas funcionalidades como base:

- **Plano Visual Interactivos**: "Drag and drop" para sentar comensales en las mesas.
- **Listas de Espera Digitales**: Estimación de tiempos para "Walk-ins" (clientes sin reserva).
- **Widget de Reserva Online**: Un botón en la web o RRSS para captar reservas 24/7 sin que el personal intervenga.
- **CRM/Base de Datos de Huéspedes**: Perfiles enriquecidos con alergias, historial de gasto y preferencias.
- **SMS / Emails Automatizados**: Confirmaciones y recordatorios.
- **Integración TPV/POS**: Conectar lo que gasta el cliente con la reserva.

---

## 🎯 El "Núcleo de Valor" (Regla de Pareto 80/20)

Para nuestra aplicación, el verdadero retorno de inversión se encuentra en implementar de forma excelente el 20% de las funciones que resuelven el 80% de los problemas de un restaurante. 

### Características Acciónables para nuestro MVP:

#### 1. Gestión Visual del Plano de Mesas
*   **Problema**: Caos de ocupación durante horas pico.
*   **Acción**: Desarrollar en la SPA una vista que muestre rápidamente el estado de cada mesa (Disponible, Ocupada, Por Pagar, Reservada) en lugar de una simple lista de texto.

#### 2. Recordatorios de Reservas y Confirmación (Notificaciones)
*   **Problema**: Los temidos "No-Shows" (El cliente no acude y se pierde la capacidad de esa mesa).
*   **Acción**: Incluir en nuestro sistema alertas tempranas para confirmar asistencia. Si es posible, integraciones básicas de mensajería o estados visuales (`[Pendiente]` -> `[Confirmada]`).

#### 3. Widget de Formulario Ágil (Self-Service 24/7)
*   **Problema**: Empleados perdiendo tiempo registrando reservas telefónicas. 
*   **Acción**: Optimizar el formulario de creación de reservas. Debe ser lo suficientemente fluido para que un comensal lo haga desde su móvil en menos de 30 segundos.

#### 4. CRM Simplificado de Comensales (Etiquetas y Notas)
*   **Problema**: Servicio impersonal.
*   **Acción**: Agregar campos rápidos en las notas de reserva o perfiles: *Alérgico al gluten*, *VIP*, o *Aniversario*. Esto eleva la percepción del servicio inmediatamente sin necesidad de bases de datos masivas.

---

> **Conclusión para el Desarrollo:** No necesitamos construir decenas de integraciones al inicio. Si perfeccionamos (1) la cuadrícula visual de mesas orientada a la operación diaria de los camareros y (2) la recolección rápida de datos relevantes del cliente, el módulo de reservas tendrá más utilidad práctica que la mayoría del software heredado.
