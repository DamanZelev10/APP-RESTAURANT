# Prompt maestro para Antigravity — Rediseño y carga completa del menú de ROSÉ

## Contexto del proyecto

Estamos trabajando la página **Menú** de la web de **ROSÉ Gastro Bar / Rosé Café - Restaurante**.  
La página actual ya existe, pero se ve **demasiado sobria, vacía y poco comercial**.  
Además, gran parte de las categorías aparecen con **“Próximamente…”**, aunque ya tenemos la carta completa.

Tu tarea es **rediseñar la experiencia UI/UX de la página de menú** e **incorporar el menú completo, producto por producto**, usando la información estructurada de este archivo.

---

## Objetivo principal

Quiero que conviertas la página de menú en una experiencia:

- más **elegante, moderna y premium**
- más **visual y apetecible**
- más **clara para navegar**
- más **rápida de escanear** por categorías
- más **útil en móvil**
- más **alineada con la identidad de ROSÉ**: sofisticada, cálida, romántica, nocturna, gastronómica y con toque premium

---

## Problemas actuales detectados en la página

Corrige estos problemas del diseño actual:

1. El **hero ocupa demasiado espacio vertical** y deja mucho vacío antes de mostrar productos.
2. La jerarquía visual es débil: el menú se siente como texto plano, sin suficiente intención comercial.
3. Las pestañas/categorías actuales se ven simples y poco refinadas.
4. Hay varias secciones con **“Próximamente…”** que deben ser reemplazadas por contenido real.
5. La navegación inferior flotante puede **interferir con el contenido** y debe convivir mejor con la lectura.
6. Falta diferenciación entre:
   - platos destacados
   - categorías premium
   - bebidas
   - coctelería
   - postres
7. Los precios y nombres necesitan mejor alineación visual y lectura rápida.
8. La experiencia móvil debe priorizar:
   - scroll cómodo
   - secciones compactas
   - lectura clara
   - CTA visibles sin tapar contenido

---

## Instrucciones de rediseño UI/UX

### Estilo visual deseado

Diseña una página con una línea visual:

- **premium**
- **romántica / nocturna**
- **minimalista pero no vacía**
- **gastronómica**
- con sensación de **restaurante instagrameable**
- con mejor balance entre elegancia y conversión

### Dirección visual sugerida

Usa una paleta inspirada en:

- **vinotinto / burgundy**
- **rosa viejo / dusty rose**
- **marfil / crema**
- **marrón espresso**
- acentos dorados suaves o champagne, si aportan elegancia sin exagerar

### Recomendaciones UX específicas

Implementa mejoras como estas:

- Hero más compacto y útil
- Una breve introducción del menú, pero sin desperdiciar altura
- Barra sticky de categorías con estilo tipo **chips / pills premium**
- Scroll suave a secciones
- Mejor separación entre bloques
- Tarjetas o filas de producto mejor diseñadas
- Precios alineados a la derecha con lectura limpia
- Descripciones cortas debajo del nombre
- Etiquetas visuales opcionales para:
  - premium
  - infantil
  - recomendado
  - bestseller
  - para compartir
  - licor
- Posibilidad de destacar algunas secciones con más protagonismo:
  - Cortes premium
  - Coctelería de la casa
  - Vinos
  - Platos fuertes
  - Postres / Malteadas
- En móvil, usar layout **muy limpio y escaneable**
- Evitar sensación de documento plano o PDF pegado
- Mantener CTA como **Reservar mesa** y **WhatsApp**, pero sin invadir la lectura

### Estructura de experiencia sugerida

Organiza el menú por grandes grupos:

1. **Comida**
2. **Bebidas & Café**
3. **Licores & Cócteles**
4. **Postres**

Dentro de cada grupo, usa subcategorías bien visibles.

### Comportamiento recomendado

- Mantener navegación superior elegante
- Añadir navegación interna sticky para categorías
- Mostrar una microinteracción o estado activo en la categoría seleccionada
- Mejorar ritmo visual con espacios, divisores, íconos sutiles y bloques destacados
- En desktop, se puede usar composición en 2 columnas o layout editorial
- En móvil, priorizar una columna bien optimizada

---

## Reglas de implementación

1. **No inventes productos ni precios.**
2. Usa exactamente la información de este archivo como base.
3. Donde falte una descripción clara, puedes:
   - dejarla vacía, o
   - redactar una versión breve y elegante **solo si está sustentada por el producto**
4. Si hay nombres con ortografía mejorable para interfaz, puedes normalizarlos visualmente sin alterar el producto.
5. Mantén el tono de marca refinado y comercial.
6. La página debe sentirse lista para un restaurante real, no como demo genérica.
7. Prioriza mucho la versión móvil.
8. Mejora la legibilidad, la jerarquía y la intención de compra.
9. Si conviene, puedes transformar la data en una estructura tipo JSON/TS para renderizar el menú dinámicamente.
10. Los bloques “Próximamente…” deben desaparecer y ser reemplazados por contenido real.

---

## Entregables esperados del agente

Quiero que generes y/o actualices la página de menú con lo siguiente:

- rediseño completo de la UI/UX de la página de menú
- estructura limpia y renderizable
- categorías + subcategorías completas
- productos cargados producto por producto
- experiencia responsive cuidada
- enfoque premium/comercial
- base preparada para mantenimiento futuro

Si lo consideras mejor, crea:

- un archivo de datos del menú
- componentes reutilizables por categoría
- tarjetas o filas de producto consistentes
- navegación interna de categorías
- badges/etiquetas visuales elegantes

---

# Base de datos editorial del menú ROSÉ

> **Nota:** esta estructura está pensada para que puedas convertirla fácilmente a JSON, TypeScript, CMS o componentes renderizables.

---

## 1) COMIDA

### Entradas

| Producto | Descripción | Precio |
|---|---|---:|
| Deditos de queso | 5 unidades acompañados de arequipe | $22.000 |
| Nachos | Acompañados de pico de gallo y guacamole | $17.000 |
| Mini gyros | 3 unidades rellenas de carne, verduras y guacamole | $24.000 |
| Combo de empanadas | 6 unidades acompañadas de ají y salsa de la casa | $22.000 |
| Combo mini aborrajados | 5 unidades acompañados de salsa de la casa | $32.000 |
| Choricostilla | Chorizo, costilla ahumada, patacón, tomate, lechuga, papa criolla y arepa | $33.000 |
| Queso frito | Acompañado de salsa frutos rojos | $23.000 |
| Mini burguer Rosé x3 uds | Cada mini burguer contiene 60 gr de carne, tocineta, lechuga, tomate, queso, salsa chipotle, bbq de la casa y pepinillos. Acompañadas de papas a la francesa | $39.000 |
| Chicharrón caramelizado | Acompañado con salsa de panela y mini patacones | $30.000 |

### Adiciones

| Producto | Precio |
|---|---:|
| Guacamole | $4.500 |
| Huevo | $4.000 |
| Queso | $6.000 |
| Maicitos | $6.000 |
| Tocineta | $9.000 |
| Cebolla | $2.000 |
| Pollo | $12.000 |
| Champiñones | $6.500 |
| Chorizo | $10.000 |
| Ceviche de chicharrón | $13.000 |
| Ceviche de camarón | $14.000 |
| Costilla | $13.000 |
| Yuca | $8.500 |
| Jamón | $4.000 |
| Ensalada | $7.000 |
| Lomo (250 gr) | $38.000 |
| Mini burguer | $15.000 |
| Jalapeños | $6.500 |
| Papa francesa | $9.000 |
| Papa criolla | $9.000 |
| Empaque para llevar | $2.000 |
| Pepinillos | $4.500 |
| Piña | $4.500 |
| Salchicha ranchera | $10.000 |
| Carne de hamburguesa | $14.000 |
| 4 tenders de pollo | $15.000 |
| 4 patacones con hogao | $7.500 |

### Platos gourmet

| Producto | Descripción | Precio |
|---|---|---:|
| Tenders de pollo | 5 unidades acompañados de papas a la francesa | $27.000 |
| Hot Dog Rosé | Queso mozzarella, tocineta, maduritos triturados, salsa de la casa | $21.000 |
| Hot Dog Ranchero | Ranchera, queso, papa fosforito, tocineta, salsa de tomate y de la casa | $24.000 |
| Hot Dog Berlín | Pimentón, champiñones, maicitos, papitas, piña, tocineta, queso mozzarella, guacamole, chicharrón y salsas de la casa | $25.000 |
| Salchipapa gratinada | Salchicha ranchera y americana, papa criolla y francesa, tocineta, queso mozzarella, salsa de la casa | $34.000 |
| Desgranado gratinado | Papas fosforito, lechuga, jamón, pollo, maicitos, salsa de la casa | $34.000 |
| Ceviche de chicharrón x3 uds | Canastas de plátano rellenas de ceviche con trozos de chicharrón tostado (contiene champiñones) | $35.000 |
| Copa ceviche de camarón | Acompañada de mini patacones | $36.000 |
| Quesadilla gratinada | Tortilla de harina, pollo, nachos triturados, salchicha ranchera, queso, jamón, salsa de la casa | $34.000 |
| Quesadilla de carne | Tortilla de harina, carne desmechada con hogao, jamón, queso, salsa de la casa | $34.000 |
| Menú infantil | Puedes escoger entre nuggets o mini burger; incluye papas a la francesa, jugo y sorpresa | $29.500 |
| Lomo a la parrilla infantil | 150 gr de lomo biche acompañado de papas a la francesa | $29.500 |
| Alitas | 4 alitas + bomboncitos acompañados de papa criolla y una salsa a tu elección (miel mostaza o bbq) | $33.000 |
| Nachos Beef Rosé | Acompañados de carne molida, pico de gallo, guacamole, salsa de queso cheddar, cascos de tomate y cascos de limón | $50.000 |
| Pan Cook de pollo | Pollo, crema de leche, queso mozzarella, tocineta, pan | $35.000 |
| Pan Cook lomito stroganoff | Lomo de res, salsa demiglace, crema de leche, queso mozzarella, pan | $35.000 |

### Hamburguesas

> Todas las hamburguesas van acompañadas de papas a la francesa, salvo donde se especifica otra guarnición.

| Producto | Descripción | Precio |
|---|---|---:|
| Hamburguesa Rosé | Carne angus, lechuga, tomate, queso mozzarella, tocineta | $31.000 |
| Champion burger | Carne angus, carne de cerdo desmechada, lechuga, tomate, cebolla, pimentón, salsa de tomate y mayonesa | $38.000 |
| Mega hamburguesa Rosé | Carne angus, filete de pollo a la parrilla, doble tocineta, queso mozzarella, pepinillo, cebolla, lechuga, tomate, salsa chipotle, mostaza y salsa de tomate | $38.000 |
| Hamburguesa mexicana | Carne angus, lechuga, tomate, queso cheddar, guacamole picante, tocineta, cebolla y jalapeños | $35.000 |
| Hamburguesa criolla | Carne angus, lechuga, tomate, queso cheddar, huevo frito y hogao. Acompañada de papa criolla | $35.000 |
| Hamburguesa tenders de pollo | Lechuga, tomate, salsa de la casa | $35.000 |
| Hamburguesa de pollo | Filete de pollo a la parrilla, lechuga, tomate, queso mozzarella, tocineta | $35.000 |
| Hamburguesa Paisita | Carne angus, lechuga, tomate, queso mozzarella, maicitos, plátano maduro y salsa de maíz | $35.000 |
| Hamburguesa Angus | Certified Angus Beef, tocineta, lechuga, tomate, queso cheddar, salsa de tomate y mostaza | $35.000 |
| Hamburguesa de costilla | Lechuga, tomate, queso mozzarella, costilla ahumada en salsa bbq y tocineta | $35.000 |

### Platos fuertes

| Producto | Descripción | Precio |
|---|---|---:|
| Punta de anca nacional | 300 gr acompañada de papas a la francesa y ensalada mixta | $52.000 |
| Baby Beef | 250 gr acompañada de papas a la francesa y ensalada mixta | $52.000 |
| Churrasco | 300 gr acompañada de papas a la francesa y ensalada mixta | $52.000 |
| Pechuga a la parrilla | 300 gr acompañada de papas a la francesa y ensalada mixta | $42.000 |
| Filet Mignon | 2 medallones de carne de 130 gr c/u envueltos en tocineta, acompañados de ensalada y papa rústica | $57.000 |
| Cordon Blue | Acompañado de papas a la francesa y ensalada mixta | $43.000 |
| Costillas BBQ | Bañadas en salsa bbq, acompañadas de papa criolla | $45.000 |
| Costillas St Louis | A la parrilla, bañadas en salsa bbq a base de Jack Daniel’s, acompañadas de croquetas de yuca y ensalada mixta | $55.000 |
| Picada de la casa | Lomo biche, costilla, chorizo coctelero, nuggets, croquetas de yuca, patacones, arepa, papa rústica, tomate y limón. Recomendada para 3 personas | $80.000 |

### Sandwiches

> Todos los sándwiches van acompañados de papas a la francesa.

| Producto | Descripción | Precio |
|---|---|---:|
| Pollo gratinado | Descripción no visible con claridad en la carta original | $31.000 |
| Pollo a la parrilla | Queso mozzarella, lechuga, tomate, salsa de la casa y salsa de ajo | $31.000 |
| Jamón Serrano | Queso mozzarella, aguacate y tomate | $31.000 |
| Atún y maicitos | Lechuga, tomate y salsa de la casa | $31.000 |
| Aloha | Jamón, queso mozzarella, piña, lechuga, tomate y salsa de ajo | $31.000 |
| Lomo | Lomo biche, pimentón, cebolla caramelizada y papa rústica | $36.000 |
| Vegetal | Zanahoria, pimentón, cebolla, lechuga, pepinillos, aceitunas, maicitos, queso y champiñones | $31.000 |

### Ensaladas

| Producto | Descripción | Precio |
|---|---|---:|
| Elegant gourmet | Tomate cherry, lechuga, maicitos, champiñones, crutones de pan, salsa de la casa o vinagreta | $25.000 |
| César | Lechuga, crotones de pan, pollo, maicitos y salsa césar | $32.000 |
| Tropical | Pollo, jamón, queso, tomate, lechuga, maicitos, piña y salsa de la casa | $32.000 |

### Cortes premium

> Todos los cortes vienen acompañados de papas a la francesa y ensalada de la casa.

| Producto | Descripción | Precio |
|---|---|---:|
| Rib Eye premium | 350 gr a 400 gr | $77.000 |
| New York Steak premium | 300 gr | $77.000 |
| Punta de anca premium | 280 gr a 300 gr | $63.000 |
| Entrañita selecta del chef | 300 gr | $63.000 |

### Especial

| Producto | Descripción | Precio |
|---|---|---:|
| Salmón Rosé | Exquisito salmón sobre una cama de salsa estilo marinero con crema de coco y hierbas del azotea del pacífico, acompañado de puré al parmesano y ensalada fresca | $55.000 |

### Pastas

| Producto | Descripción | Precio |
|---|---|---:|
| Carbonara | Cebolla, tocineta, ajo, champiñones, crema de leche y queso parmesano | $38.000 |
| Boloñesa | Carne molida, cebolla, ajo y queso parmesano | $38.000 |
| Brisa marina | Camarones en crema, vegetales y queso parmesano | $42.000 |
| Gratinado | Adicional | + $8.000 |

### Súper combos

> Los súper combos van acompañados de papas a la francesa y limonada natural o Coca-Cola mini.

| Producto | Descripción | Precio |
|---|---|---:|
| Hamburguesa con carne artesanal | Acompañada de papas a la francesa | $23.500 |
| Sandwich de pollo gratinado | Acompañado de papas a la francesa | $23.500 |
| Gyro | Tortilla de harina, carne desmechada (res y pollo), chorizo, pimentón, papa francesa por dentro y salsa de ajo | $23.500 |
| Super Gyro | Tortilla de harina, julianas de pollo y res a la plancha, chorizo, pimentón, papa francesa por dentro y salsa de ajo | $32.000 |

---

## 2) BEBIDAS & CAFÉ

### Limonadas

| Producto | Precio |
|---|---:|
| Natural | $9.500 |
| Lychee | $14.000 |
| Coco-hierbabuena | $14.000 |
| Vino tinto | $14.000 |
| Hierbabuena | $14.000 |
| Coco | $14.000 |
| Frutos rojos | $14.000 |
| Cherry | $15.000 |
| Colores | $16.500 |
| Jarra de limonada natural | $24.000 |
| Jarra de limonada hierbabuena | $25.000 |
| Jarra de limonada de coco | $37.000 |

### Sodas italianas

| Producto | Precio |
|---|---:|
| Uva | $15.000 |
| Piña | $15.000 |
| Maracuyá-tamarindo | $15.000 |
| Kiwi-hierbabuena | $15.000 |
| Fresa | $15.000 |
| Sandía | $15.000 |
| Lychee | $15.000 |
| Lulo | $17.000 |
| Guayaba coronilla | $17.000 |
| Especial frutos rojos | $17.000 |
| Especial frutos amarillos | $17.000 |
| Soda Hatsu de sandía, albahaca y pepino | $17.000 |
| Soda especial mango biche | $17.000 |

### Fusiones y jugos

| Producto | Precio |
|---|---:|
| Mango mini | $10.000 |
| Mango maracuyá | $12.000 |
| Mora | $12.000 |
| Mango | $12.000 |
| Maracuyá | $12.000 |
| Fresa-hierbabuena | $15.000 |
| En leche | + $3.500 |

### Batidos

| Producto | Precio |
|---|---:|
| Fresa | $14.000 |
| Mango/banano | $14.000 |

### Malteadas

| Producto | Precio |
|---|---:|
| Vainilla | $20.000 |
| Chocolate | $20.000 |
| Fresa | $20.000 |
| Café | $20.000 |
| Maracululo | $20.000 |
| Jumbo Maní | $22.000 |
| Milo Nutella | $22.000 |
| Oreo | $22.000 |
| 3 Cordilleras Rosé | $23.000 |
| Especial Red Velvet | $28.000 |

### Bebidas frías

| Producto | Precio |
|---|---:|
| Agua | $7.000 |
| Soda escarchada | $8.000 |
| Jugo Hit 500 ml | $8.000 |
| Coca-Cola (normal / zero) | $8.000 |
| Sprite | $8.000 |
| Quatro | $8.000 |
| Manzana / Uva | $8.000 |
| Basil Sky (con semillas de albahaca) | $8.000 |
| Néctar Campofrut | $8.000 |
| Limonada de hierbabuena | $8.000 |
| Agua saborizada Sky | $6.000 |
| Ginger escarchada | $9.000 |
| Tamarindo escarchado | $9.000 |
| Soda Hatsu | $10.000 |
| Milo | $15.000 |
| Té Hatsu | $10.000 |
| Granizado de cerveza | $12.000 |

### Bebidas frías a base de café

| Producto | Precio |
|---|---:|
| Latte vainilla o caramelo | $12.000 |
| Latte con licor (Baileys, amaretto o licor de café) | $16.000 |
| Granizado de café | $12.000 |
| Granizado Mocca | $12.000 |
| Frapuchino | $12.000 |
| Frapuchino Tropical | $15.000 |
| Té Chai | $13.500 |

### Espresso

| Producto | Precio |
|---|---:|
| Clásico | $7.000 |
| Largo | $7.000 |
| Doble | $8.000 |
| Cortado | $9.000 |
| Bombóm | $9.500 |
| Macciato | $9.500 |

### Capuchino

| Producto | Precio |
|---|---:|
| Clásico | $10.000 |
| Masmelos | $13.500 |
| Chantilly | $13.500 |
| Vainilla | $13.500 |
| Con licor (Baileys, amaretto o licor de café) | $18.000 |

### Bebidas calientes

| Producto | Precio |
|---|---:|
| Latte clásico | $10.000 |
| Latte vainilla o caramelo | $13.500 |
| Latte Ferrero | $14.500 |
| Affogato | $14.000 |
| Té Chai | $13.500 |
| Chocolate | $11.000 |
| Chocolate masmelos o chantilly | $13.500 |
| Milo | $15.000 |

### Aromáticas

| Producto | Precio |
|---|---:|
| Especial frutos rojos | $9.000 |
| Especial frutos amarillos | $9.000 |
| Hierbabuena | $6.000 |
| Toronjil | $6.000 |
| Cidrón | $6.000 |
| Limoncillo | $6.000 |
| Anís | $6.000 |
| Manzanilla | $6.000 |
| Romero | $6.000 |

### Americano

| Presentación | Precio |
|---|---:|
| Pequeño | $7.000 |
| Grande | $7.000 |

### Campesino

| Presentación | Precio |
|---|---:|
| Pequeño | $7.000 |
| Grande | $7.000 |

### Adiciones para bebidas

| Producto | Precio |
|---|---:|
| Mango biche | $5.000 |
| Shot de limón | $3.500 |
| Fruta para sangría | $5.000 |
| Lychee | $5.000 |
| Bola de helado | $3.000 |
| Cereza (2 uds) | $4.500 |
| Masmelos | $3.000 |
| Chantilly | $6.000 |
| Globo en helio | $5.500 |

---

## 3) LICORES & CÓCTELES

### Cervezas importadas

| Producto | Descripción | Precio |
|---|---|---:|
| Cerveza Envenenada | Stella o Corona + tequila o jagger | $29.000 |
| Corona Rosé | Contiene tequila. Verde: sirup de kiwi y sal limón / roja: sirup de sandía y tajín | $20.000 |
| Preparada especial Rosé |  | $16.000 |
| Corona Extra |  | $11.000 |
| Corona Cero |  | $11.000 |
| Stella Artois |  | $11.000 |
| Heiniken |  | $7.000 |

### Cervezas nacionales

| Producto | Descripción | Precio |
|---|---|---:|
| BBC | Cajicá / Monserrate / Lager / Chapinero / Rosé | $10.500 |
| 3 Cordilleras Rosé |  | $8.500 |
| Club Colombia | Dorada / Roja | $8.000 |
| Club Trigo |  | $8.000 |
| Poker |  | $7.500 |
| Aguila Light |  | $7.500 |
| Redd’s Rosé |  | $6.500 |
| Redd’s limón |  | $6.500 |
| Escarchada | Adicional | + $2.000 |
| Escarchada con tajín | Adicional | + $3.000 |

### Cerveza de barril

| Presentación | Precio |
|---|---:|
| Jarra | $42.500 |
| Pinta | $15.500 |

### Margaritas

> Base: tequila José Cuervo, triple sec y limón.

| Producto | Precio |
|---|---:|
| Frutos rojos | $29.000 |
| Maracuyá | $29.000 |
| Mango biche | $29.000 |
| Lychee | $29.000 |
| Blue | $25.000 |
| Tradicional | $25.000 |

### Mojitos

> Base: ron Bacardí, hierbabuena y limón.

| Producto | Precio |
|---|---:|
| Lychee | $25.000 |
| Piña | $25.000 |
| Maracuyá | $25.000 |
| Tradicional | $23.000 |

### Coctelería de la casa

| Producto | Descripción | Precio |
|---|---|---:|
| Granizado del día | Con licor | $16.000 |
| Granizado del día | Sin licor | $12.000 |
| Long Island | Bacardí, tequila, vodka, ginebra y triple sec | $35.000 |
| Moscow Mule | Vodka, limón, hierbabuena, agua tónica, sirup de jengibre, chorro de cerveza | $32.000 |
| Picante | José Cuervo, sirup de tamarindo, gotas de tabasco, coronita y mango | $32.000 |
| Gin tradicional | Ginebra y tónica | $30.000 |
| Gin lychee | Ginebra, tónica y sirup de lychee | $30.000 |
| Gin fresa | Ginebra, tónica y sirup de fresa | $30.000 |
| Gin kiwi y uva | Ginebra, tónica, sirup de kiwi y uva | $30.000 |
| Gin kiwi y fresa | Ginebra, tónica, sirup de kiwi y fresa | $30.000 |
| Orgasmo | Crema de whiskey, amaretto, licor de café, crema de leche y leche condensada | $30.000 |
| Daiquiri de maracuyá | Mini botella de vodka, coulie de maracuyá y limón | $30.000 |
| Dry Martini | Cinzano, aceitunas, ginebra | $30.000 |
| Caipiriña | Cachaça, limón, azúcar | $28.000 |
| Piña Colada | Ron, licor de coco, crema de coco y piña | $28.000 |
| Beso frío | Helado de vainilla, licor de café y crema de leche | $25.000 |
| Canario | Aguardiente amarillo de Manzanares, jengibre y sirup de piña | $25.000 |
| Alexander | Brandy, licor de café, crema de leche, canela en polvo y leche condensada | $17.000 |

### Vinos

#### De la casa — Santa Helena Varietal

| Producto | Precio |
|---|---:|
| Merlot | $85.000 |
| Blanco | $85.000 |
| Cabernet Sauvignon | $85.000 |
| Copa | $19.000 |

#### Ramón Bilbao

| Producto | Precio |
|---|---:|
| Crianza - Joven | $110.000 |
| Copa | $22.000 |

#### Finca Las Moras

| Producto | Precio |
|---|---:|
| Malbec Reserva | $100.000 |
| Copa | $21.000 |
| Malbec Varietal | $85.000 |
| Copa | $19.000 |
| Cabernet Sauvignon | $85.000 |
| Copa | $19.000 |

#### Lambrusco

| Producto | Precio |
|---|---:|
| Tinto | $75.000 |
| Rosado | $75.000 |

#### Casa Grajales

| Producto | Precio |
|---|---:|
| Abocado | $75.000 |
| Valtier tinto semi seco | $75.000 |
| Valtier Rosé semi seco | $75.000 |
| Valtier semi seco blanco | $75.000 |
| Don Gerardo seco fino | $75.000 |
| Blanco de misa | $75.000 |
| Tinto seco reservado | $80.000 |
| Copa | $17.000 |

### Sangría

| Producto | Descripción | Precio |
|---|---|---:|
| Vino tinto jarra |  | $72.000 |
| Vino blanco jarra |  | $72.000 |
| Vino rosado jarra |  | $72.000 |
| Sangría 1/2 jarra |  | $58.000 |
| Copa sangría |  | $19.000 |
| Tinto de verano | Vino tinto, refresco y naranja | $19.000 |
| Sangría de cava jarra | Lambrusco y mix de frutas | $85.000 |

### Shots

| Producto | Precio |
|---|---:|
| Tequila Don Julio 70 | $45.000 |
| Whiskey Old Parr 18 años | $45.000 |
| Tequila Don Julio añejo | $40.000 |
| Tequila Patrón reposado y silver | $40.000 |
| Tequila Patrón añejo | $40.000 |
| Whiskey Buchanans 18 años | $38.000 |
| Tequila 1800 reposado | $26.000 |
| Whiskey Old Parr 12 años | $25.000 |
| Copa de Baileys | $23.000 |
| Copa de crema de whisky artesanal | $10.000 |
| Tequila Jose Cuervo | $17.500 |
| Jagermeister | $15.000 |
| Vodka Absolut | $15.000 |
| Ron Viejo de Caldas | $8.500 |
| Aguardiente Blanco | $8.500 |

> La crema de whisky artesanal aparece en sabores: tradicional, coco o café.

### Botellas

| Producto | Precio |
|---|---:|
| Tequila Don Julio 70 | $500.000 |
| Whiskey Old Parr 18 años | $470.000 |
| Tequila Don Julio añejo | $450.000 |
| Tequila Patrón reposado y silver | $410.000 |
| Tequila 1800 reposado | $320.000 |
| Whiskey Old Parr 12 años | $270.000 |
| Tequila Jose Cuervo | $165.000 |
| Baileys 750 ml | $160.000 |
| Crema de whisky artesanal | $30.000 |
| Ron Viejo de Caldas | $90.000 |
| Aguardiente Blanco | $85.000 |

### 1/2 botella

| Producto | Precio |
|---|---:|
| Ron Viejo de Caldas | $50.000 |
| Aguardiente blanco | $45.000 |

---

## 4) POSTRES

### Postres

| Producto | Precio |
|---|---:|
| Cheesecake frutos rojos | $15.000 |
| Torta especial fin de semana | $15.000 |
| Torta Red Velvet | $15.000 |
| Brownie con helado | $17.000 |
| Bola de helado | $5.000 |
| 2 bolas de helado | $7.000 |
| Plato decorado | $4.000 + |

---

## Observaciones y pendientes para el agente

Ten en cuenta estas observaciones al implementar:

1. **Pollo gratinado (sandwich)** tiene descripción no visible completamente en la carta original.
2. **Americano** aparece con el mismo precio en pequeño y grande.
3. **Campesino** aparece con el mismo precio en pequeño y grande.
4. En la carta original aparecen algunos nombres con posible ortografía variable:
   - Heiniken / Heineken
   - Bombóm / Bombón
   - Macciato / Macchiato
   - Frapuchino / Frappuccino
   - coulie / coulis
5. Si haces corrección ortográfica para UI, intenta no alterar el producto ni el precio.
6. Evita mostrar el menú como una tabla literal en el frontend.  
   **Usa esta tabla solo como base de datos editorial.**
7. Convierte esta información en una experiencia visual refinada, escaneable y comercial.

---

## Prioridades de diseño finales

Al implementar la página, prioriza esto en orden:

1. Claridad de navegación
2. Mejor jerarquía visual
3. Reducción del espacio vacío innecesario
4. Carga real del menú completo
5. Experiencia premium y moderna
6. Excelente mobile UX
7. CTA visibles sin tapar el contenido
8. Diseño con identidad propia para ROSÉ