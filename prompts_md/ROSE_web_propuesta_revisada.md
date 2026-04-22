# Propuesta Web Premium Revisada: ROSÉ Gastro Bar

## Diagnóstico Ejecutivo
La propuesta original está bien orientada en concepto, dirección visual y enfoque mobile-first, pero todavía mezcla:
- lenguaje de cliente con lenguaje de desarrollo,
- marca canónica con variantes de nombre,
- propuesta estratégica con notas internas,
- entregables cerrados con preguntas abiertas.

Conclusión: **sí sirve como base**, pero no conviene presentarla o construirla tal como está sin una depuración previa.

---

## Qué mantener

### 1) Dirección visual
La línea **Day-to-Night Editorial** es la mejor decisión para ROSÉ Gastro Bar.

**Por qué funciona:**
- conecta con el horario real del negocio,
- permite vender atmósfera, no solo comida o tragos,
- se siente premium sin caer en una estética fría,
- sirve tanto para SEO local como para conversión.

### 2) Prioridades de la home
Estas cuatro acciones deben seguir siendo el centro de la experiencia:
- Reservar mesa
- Ver menú
- Cómo llegar
- Escribir por WhatsApp

### 3) Estructura base del sitio
La base es correcta:
- Inicio
- Menú
- Reservas
- Ubicación
- Experiencias / Eventos
- Contacto

### 4) Menú en HTML
Esto debe mantenerse sí o sí. El PDF solo debe ser recurso secundario.

---

## Qué corregir antes de usarla en serio

### 1) Unificar el nombre de marca
Usar una sola versión en todo el sistema:

**ROSÉ Gastro Bar**

No mezclar con:
- ROSÉ Cafe Bar
- ROSÉ Café - Bar
- ROSÉ Gastrobar

### 2) Eliminar lenguaje interno de desarrollo
Quitar del documento final cualquier referencia como:
- "puerto 5173"
- "PWA mode"
- "Diseño Antigravity" en footer
- dudas técnicas internas dentro del entregable principal

Eso pertenece al documento técnico, no al documento estratégico o comercial.

### 3) Corregir el H1 principal
No conviene abrir solo con:

> Un lugar mágico en La Unión.

Es bonito, pero no es suficientemente claro para SEO ni para usuarios nuevos.

Mejor:

**ROSÉ Gastro Bar en La Unión, Valle del Cauca**

Subtítulo sugerido:

**Tardes de café, noches de gastro bar y una atmósfera pensada para compartir, disfrutar y volver.**

### 4) Separar propuesta al cliente de especificación de construcción
Debe haber dos niveles:

#### A. Documento cliente / dirección
Visual, estratégico y comercial.

#### B. Documento de implementación
Con componentes, rutas, tracking, schema, performance y stack.

No mezclar ambos en el mismo bloque.

### 5) Limpiar afirmaciones no verificadas
Evitar frases como:
- “70%+ de las búsquedas gastronómicas son móviles”
- “El algoritmo de Google Maps premia la frescura”

A menos que se cite una fuente concreta.

Mejor escribirlo así:
- La mayoría de búsquedas locales y gastronómicas ocurren desde móvil.
- Mantener horarios, fotos y datos actualizados ayuda a la visibilidad local y a la conversión.

### 6) Afinar sitemap
Recomendación final:
- `/` Inicio
- `/menu`
- `/reservas`
- `/ubicacion`
- `/experiencias`
- `/contacto`

Y dentro del home:
- hero
- experiencia
- preview menú
- prueba social
- ubicación
- CTA de reservas

### 7) Ajustar metadata SEO
Versión mejorada:

#### Inicio
**Title:** ROSÉ Gastro Bar | Reservas, menú y ubicación en La Unión, Valle del Cauca

**Meta description:** Descubre ROSÉ Gastro Bar en La Unión, Valle del Cauca. Consulta el menú, reserva tu mesa, encuentra cómo llegar y vive una experiencia única de tarde y noche.

#### Menú
**Title:** Menú | ROSÉ Gastro Bar en La Unión, Valle del Cauca

**Meta description:** Explora el menú de ROSÉ Gastro Bar. Una propuesta pensada para disfrutar tardes, encuentros y noches especiales en La Unión, Valle del Cauca.

#### Reservas
**Title:** Reservar mesa | ROSÉ Gastro Bar La Unión, Valle del Cauca

**Meta description:** Reserva tu mesa en ROSÉ Gastro Bar. Vive una experiencia cálida, elegante y local en La Unión, Valle del Cauca.

#### Ubicación
**Title:** Ubicación y horarios | ROSÉ Gastro Bar en La Unión, Valle del Cauca

**Meta description:** Encuentra la dirección, horarios y formas de contacto de ROSÉ Gastro Bar en La Unión, Valle del Cauca. Llegar, reservar y escribir es fácil.

### 8) Mejorar el bloque local
El bloque local debe verse así:
- Dirección completa
- Horarios
- Botón “Cómo llegar”
- Botón “Reservar mesa”
- Botón “WhatsApp”
- Referencia local si existe
- Mapa incrustado o enlace limpio a Google Maps

### 9) Hacer más fuerte la sección de experiencia
La sección “La experiencia ROSÉ” debe vender uso real del espacio:
- tardes de encuentro,
- celebraciones,
- planes en pareja,
- salida con amigos,
- noche tranquila con cocteles.

### 10) Definir mejor la prueba social
Si aún no hay reseñas confirmadas, no inventarlas.

Usar placeholders como:
- `[CALIFICACION_GOOGLE]`
- `[NUMERO_DE_RESEÑAS]`
- `[TESTIMONIO_REAL_1]`

---

## Estructura Final Recomendada

## 1. Home
### Header sticky
- Logo
- Menú
- Reservar mesa

### Hero
**H1:** ROSÉ Gastro Bar en La Unión, Valle del Cauca

**Texto:**
Un lugar mágico para disfrutar tardes de café, encuentros especiales y noches con atmósfera.

**CTAs:**
- Reservar mesa
- Ver menú

### Barra rápida mobile
- Reservar
- Menú
- Cómo llegar
- WhatsApp

### Sección: La experiencia ROSÉ
Texto emocional y breve, apoyado por fotografía real.

### Sección: Menú destacado
Preview en HTML con categorías reales.

### Sección: Vive ROSÉ
Galería ligera y editorial.

### Sección: Ubicación
- Calle 14 # 6-76
- La Unión, Valle del Cauca
- Martes a domingo, 3:30 p. m. a 10:30 p. m.
- Lunes cerrado, excepto festivos

### FAQ
- ¿Se puede reservar por WhatsApp?
- ¿Cuál es el horario?
- ¿Dónde están ubicados?
- ¿Tienen menú disponible en línea?

### Footer
- NAP canónico
- Redes
- Horarios
- Reservas
- Menú
- Contacto

---

## CTAs finales recomendados
### Principales
- Reservar mesa
- Ver menú
- Cómo llegar
- Escríbenos por WhatsApp

### Secundarios
- Conoce la experiencia
- Explora la carta
- Planea tu visita

---

## Recomendación de estilo final
### Principal
**Day-to-Night Editorial**

### Paleta sugerida
- crema suave
- rosé empolvado
- burgundy / vino
- espresso
- champagne cálido

### Tipografía sugerida
- Serif editorial para titulares
- Sans limpia para navegación, botones y textos funcionales

### Sensación buscada
- cálida
- elegante
- local
- sensorial
- clara

---

## Qué haría inmediatamente después
1. Confirmar nombre oficial definitivo.
2. Confirmar WhatsApp, Instagram, enlace de reservas y Google Maps.
3. Pedir menú en texto, no solo en imagen o PDF.
4. Pedir 12–20 fotos reales del lugar y producto.
5. Construir primero la home y la página de menú.
6. Integrar reservas y tracking después del layout principal.

---

## Veredicto final
**Sí, la propuesta va bien. Pero no la presentaría ni la desarrollaría sin antes hacer estas correcciones.**

Con esta revisión, la idea deja de verse como un borrador híbrido y pasa a verse como una **propuesta premium, clara y lista para ejecución comercial y técnica**.
