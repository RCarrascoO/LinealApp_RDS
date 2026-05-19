## 👤 PERSONA 1 — Sidebar + página RUT (idéntica)

### Tarea 1.1 — Configurar menú lateral con exactamente 3 entradas de producto

**Qué hacer (exacto):**

- Dejar visibles solo: `RUT Validation` (`/rut`), `Conic Sections` (`/conics`), `Limits` (`/limits` o ruta definida por ustedes).
- Mantener ícono por ítem y estado activo con indicador visual a la derecha.
- Quitar/ocultar del sidebar: Dashboard, Piecewise, Graphs, Procedures, Defense, Settings. **Se espera al completar:**
- Sidebar con solo esas 3 opciones y highlight correcto de ruta activa.

### Tarea 1.2 — Construir header de página RUT igual al actual

**Qué hacer (exacto):**

- Título: `RUT Validation`.
- Subtítulo: `Validate Chilean RUT numbers using the modulo 11 algorithm`.
- Separación vertical y padding equivalentes. **Se espera al completar:**
- Encabezado idéntico en texto, jerarquía tipográfica y espaciado.

### Tarea 1.3 — Construir card de input RUT con tooltip de formato

**Qué hacer (exacto):**

- Card “Enter RUT Number”.
- Ícono de info con tooltip: `Format: 12.345.678-9 or 12345678-9`.
- Input centrado, placeholder `12.345.678-9`, estilo monoespaciado grande.
- Botones: `Validate RUT` y `Clear`. **Se espera al completar:**
- Card visualmente igual (estructura, etiquetas, acciones y disposición).

### Tarea 1.4 — Construir panel de procedimiento RUT en 4 bloques

**Qué hacer (exacto):**

- Mostrar condicionalmente tras validar:
    1. `Step 1: Digits Extraction`
    2. `Step 2: Multiplication Table`
    3. `Step 3: Modulo 11 Calculation`
    4. `Step 4: Validation Result`
- Mantener tabla con columnas Position/Digit/Multiplier/Product.
- Mantener badge final `VALID RUT` / `INVALID RUT`. **Se espera al completar:**
- Flujo visual paso a paso idéntico al actual.

---

## 👤 PERSONA 2 — Página Cónicas: panel izquierdo (entrada y clasificación)

### Tarea 2.1 — Crear layout de página cónicas exacto

**Qué hacer (exacto):**

- Header:
    - Título: `Conic Sections Analysis`
    - Subtítulo: `Generate and analyze conic sections from RUT coefficient extraction`
- Grid principal de 2 columnas (input/results).
- Debajo: panel matemático completo. **Se espera al completar:**
- Distribución idéntica: cabecera + 2 paneles + procedimiento.

### Tarea 2.2 — Construir card “RUT Input” del panel izquierdo

**Qué hacer (exacto):**

- Input placeholder `12.345.678-9` + botón `Analyze`.
- Tipografía monoespaciada en el input. **Se espera al completar:**
- Primer bloque del panel izquierdo igual a referencia.

### Tarea 2.3 — Construir card “Extracted Digits”

**Qué hacer (exacto):**

- Renderizar chips `d1..d8` y `DV`.
- `DV` con estilo destacado (borde/color primario).
- Etiqueta arriba + valor monoespaciado. **Se espera al completar:**
- Visualización de dígitos idéntica (incluyendo el bloque especial DV).

### Tarea 2.4 — Construir card “Equation Coefficients”

**Qué hacer (exacto):**

- Tarjetas A,B,C,D,E,F con:
    - descripción corta (x² coefficient, etc.)
    - label coeficiente y valor destacado.
- Grid responsive (3 columnas en móvil, 6 en sm+). **Se espera al completar:**
- Bloque de coeficientes idéntico en estructura y densidad visual.

### Tarea 2.5 — Construir card “Conic Classification”

**Qué hacer (exacto):**

- 4 opciones: Circle, Ellipse, Hyperbola, Parabola.
- Una opción activa con badge `Detected`.
- Opciones inactivas con opacidad menor. **Se espera al completar:**
- Selector de tipo cónica visualmente idéntico.

---

## 👤 PERSONA 3 — Página Cónicas: panel derecho + Mafs + procedimiento

### Tarea 3.1 — Construir card “Equation Forms”

**Qué hacer (exacto):**

- Bloque `General Form` con ecuación completa y coeficientes resaltados.
- Bloque `Canonical Form` destacado con borde primario. **Se espera al completar:**
- Doble bloque de ecuaciones igual al diseño actual.

### Tarea 3.2 — Reemplazar placeholder SVG por Mafs en “Graph Visualization”

**Qué hacer (exacto):**

- Mantener card y toolbar visual (`ZoomIn`, `ZoomOut`, `Move`, `RotateCcw`).
- En el área de gráfico usar Mafs con:
    - ejes visibles,
    - rejilla visible,
    - curva principal de la cónica detectada. **Se espera al completar:**
- Mismo layout del panel actual, pero render real en Mafs.

### Tarea 3.3 — Implementar toggles del gráfico conectados a capas Mafs

**Qué hacer (exacto):**

- Toggles: Points, Asymptotes, Vertices, Foci, Directrix.
- Al activar/desactivar, mostrar/ocultar cada capa en Mafs. **Se espera al completar:**
- Controles funcionales con impacto visual inmediato.

### Tarea 3.4 — Construir card “Conic Elements”

**Qué hacer (exacto):**

- Campos: Center, Vertices, Foci, Major Axis, Minor Axis, Directrix.
- Placeholder de cada campo igual al actual.
- Texto auxiliar: “Fields are empty for manual completion during defense”. **Se espera al completar:**
- Formulario de elementos cónicos idéntico al panel de referencia.

### Tarea 3.5 — Construir panel “Mathematical Procedure” con acordeón de 6 pasos

**Qué hacer (exacto):**

- Acordeón con títulos:
    1. Coefficient Extraction
    2. Conic Classification
    3. Completing the Square (x terms)
    4. Completing the Square (y terms)
    5. Canonical Form Derivation
    6. Reverse Transformation Verification
- Cada paso con badge y bloques internos de fórmula.
- Resaltar visualmente las fórmulas finales de resultado. **Se espera al completar:**
- Acordeón matemático idéntico en jerarquía y comportamiento.

---

## Criterio de “idéntico” para todo el sprint

- Mismos textos visibles (en inglés como en referencia actual).
- Misma estructura de cards/orden de bloques.
- Misma lógica de estados visibles (mostrar/ocultar paneles).
- Misma disposición responsive (desktop/móvil).
- En gráfico: misma zona visual, pero render real con Mafs en vez de SVG mock.