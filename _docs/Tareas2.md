## Convención obligatoria para esta página (aplica a todos)

- Ruta objetivo: `app/(dashboard)/limites/page.tsx`
- Carpeta UI objetivo: `components/limites/`
- Componentes/funciones en español (ejemplos base):
    - `PaginaLimites`
    - `EncabezadoLimites`
    - `TarjetaFuncionPorTramos`
    - `PanelAnalisisLimites`
    - `PanelTipoDiscontinuidad`
    - `TablaEvidenciaNumerica`
    - `ModoDefensaLimites`
- No tocar topbar (ya implementada).
- Todo el trabajo es de **interfaz**.

---

## Persona 1 — Estructura principal y bloques superiores

### Tarea 1.1 — Crear la página base de Límites

- Crear `app/(dashboard)/limites/page.tsx`.
- Exportar `function PaginaLimites()`.
- Estructura vertical con `gap-6 p-6`.
- Orden de secciones:
    1. encabezado
    2. función por tramos
    3. grilla 2 columnas (discontinuidad + análisis de límites)
    4. tabla numérica
    5. modo defensa **Criterio:** la página renderiza el esqueleto completo en el orden exacto.

### Tarea 1.2 — Implementar encabezado de la página

- Crear `components/limites/encabezado-limites.tsx`.
- Exportar `EncabezadoLimites`.
- Título y subtítulo de límites (texto académico, una sola línea de subtítulo en desktop).
- Jerarquía tipográfica consistente con otras páginas. **Criterio:** header visualmente consistente y reutilizable.

### Tarea 1.3 — Implementar tarjeta “Función por tramos”

- Crear `components/limites/tarjeta-funcion-por-tramos.tsx`.
- Exportar `TarjetaFuncionPorTramos`.
- Incluir:
    - título de tarjeta
    - badge con punto crítico (ej. `x = 2`)
    - bloque matemático central de la función por tramos con llave visual
    - franja inferior resaltando “Punto crítico” **Criterio:** tarjeta completa con jerarquía clara y foco en el punto crítico.

### Tarea 1.4 — Integrar componentes en `PaginaLimites`

- Importar y montar `EncabezadoLimites` + `TarjetaFuncionPorTramos`.
- Dejar conectados los placeholders de los otros bloques para Persona 2 y 3. **Criterio:** layout principal funcional sin romper responsive.

### Tarea 1.5 — Ajuste responsive del bloque superior

- En móvil: reducir espacios internos del bloque de función.
- En desktop: mantener ancho máximo del contenido matemático centrado. **Criterio:** no hay desbordes horizontales en móvil.

---

## Persona 2 — Paneles de análisis (columna media)

### Tarea 2.1 — Implementar panel de tipo de discontinuidad

- Crear `components/limites/panel-tipo-discontinuidad.tsx`.
- Exportar `PanelTipoDiscontinuidad`.
- Lista de 3 opciones: removible, salto, infinita.
- Una opción activa con badge “Detectada”.
- Inactivas con menor opacidad. **Criterio:** panel visual listo con estados activo/inactivo.

### Tarea 2.2 — Implementar panel de análisis de límites

- Crear `components/limites/panel-analisis-limites.tsx`.
- Exportar `PanelAnalisisLimites`.
- Secciones internas obligatorias:
    1. límite por izquierda
    2. límite por derecha
    3. existencia del límite
    4. conclusión de continuidad
- Cada sección en tarjeta interna con color semántico. **Criterio:** panel completo con lectura paso a paso.

### Tarea 2.3 — Crear bloque de notación matemática consistente

- Dentro de `PanelAnalisisLimites`, estandarizar estilo de:
    - `lim x→a⁻`
    - `lim x→a⁺`
    - `lim x→a`
- Usar tipografía monoespaciada para expresiones. **Criterio:** notación homogénea en todo el panel.

### Tarea 2.4 — Integrar ambos paneles en grilla de 2 columnas

- En `PaginaLimites`, usar `grid gap-6 lg:grid-cols-2`.
- Columna izquierda: `PanelTipoDiscontinuidad`.
- Columna derecha: `PanelAnalisisLimites`. **Criterio:** en móvil apila; en desktop quedan lado a lado.

### Tarea 2.5 — Estados visuales de “resultado no existe”

- En panel de análisis, reforzar estado negativo con color destructivo.
- Mostrar texto de justificación corto debajo. **Criterio:** el estado “no existe” se identifica sin ambigüedad.

---

## Persona 3 — Evidencia numérica, modo defensa y tema oscuro de la página

### Tarea 3.1 — Implementar tabla de evidencia numérica

- Crear `components/limites/tabla-evidencia-numerica.tsx`.
- Exportar `TablaEvidenciaNumerica`.
- Dos bloques:
    - aproximación por izquierda
    - aproximación por derecha
- Fila final resumen con tendencia (`→`). **Criterio:** tabla clara, legible y separada por enfoque lateral.

### Tarea 3.2 — Implementar bloque de conclusión bajo tabla

- Dentro de `TablaEvidenciaNumerica`, agregar resumen textual final:
    - valor que se aproxima por izquierda
    - valor por derecha
    - conclusión de existencia **Criterio:** conclusión conectada directamente con los datos de la tabla.

### Tarea 3.3 — Implementar modo defensa de límites

- Crear `components/limites/modo-defensa-limites.tsx`.
- Exportar `ModoDefensaLimites`.
- Campos de interfaz:
    - límite izquierdo
    - límite derecho
    - ¿existe el límite?
    - tipo de discontinuidad
    - justificación escrita
- Botón de acción visual (sin lógica compleja). **Criterio:** formulario completo listo para uso en defensa oral.

### Tarea 3.4 — Integrar tabla + modo defensa en la página

- En `PaginaLimites`, montar:
    - `TablaEvidenciaNumerica`
    - `ModoDefensaLimites`
- Mantener separación vertical consistente con el resto. **Criterio:** flujo visual completo de arriba hacia abajo.

### Tarea 3.5 — Implementar tema oscuro específico para página de límites

- Revisar todos los componentes de `components/limites/` y reemplazar colores fijos por tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.).
- Ajustar badges/estados semánticos para contraste en oscuro.
- Verificar que bloques con color (izq/der/destructivo/advertencia) sigan legibles en dark. **Criterio:** página de límites usable en dark mode sin zonas lavadas ni texto de bajo contraste.

---

## Checklist final de validación (los 3)

- Solo se trabajó interfaz de la página de límites.
- Nombres de archivos y funciones en español.
- Responsive correcto (móvil y desktop).
- Topbar intacta.
- Tema oscuro validado específicamente en `/limites`.