## Persona 1 — RUT (mejora/arreglo de input RUT + integración entre módulos)

### Tarea 1.1 — Crear utilidad única de validación de RUT

- Crear módulo compartido (ej: `lib/rut/validar-rut.ts`).
- Exponer funciones: normalizar, validar formato, calcular DV, validar completo.
- Eliminar lógica duplicada de validación en componentes actuales.

### Tarea 1.2 — Crear estado global de RUT validado

- Crear store/context (ej: `hooks/use-rut-validado.ts` o `context/rut-context.tsx`).
- Guardar: `rutOriginal`, `rutNormalizado`, `esValido`, `fechaValidacion`.
- Persistir en `localStorage` para navegación entre páginas.

### Tarea 1.3 — Mover input de RUT a Conicas

- Agregar bloque “RUT” en sección cónicas.
- Conectar input al validador compartido.
- Mostrar estado visual: válido/inválido.

### Tarea 1.4 — Mover input de RUT a Límites

- Agregar bloque “RUT” en límites (misma UX de conicas).
- Reusar exactamente la misma validación compartida.
- Al validar, actualizar el estado global.

### Tarea 1.5 — Auto-reuso del RUT entre Conicas y Límites

- Si ya existe RUT válido en store, autocompletar input al entrar.
- Evitar pedir ingreso repetido del RUT.
- Botón secundario: “Cambiar RUT”.

### Tarea 1.6 — Eliminar navegación de página RUT

- Quitar item “RUT Validation” del sidebar.
- Redirigir rutas antiguas de `/rut` a `/conics` (o pantalla definida por equipo).
- Verificar que no queden links huérfanos.

### Tarea 1.7 — Actualizar textos de interfaz por cambio de flujo

- Cambiar textos donde diga que RUT se valida en módulo separado.
- Ajustar copy en conicas/límites indicando “usar RUT validado”.

---

## Persona 2 — Conicas (inputs pedagógicos vinculados a la gráfica, según feedback + imagen)

### Tarea 2.1 — Crear capa de “entradas manuales” dentro del card de visualización

- En card “Gráfica de la cónica”, agregar zona de inputs ligada al gráfico.
- Mantener misma estética oscura tipo imagen de referencia.

### Tarea 2.2 — Inputs manuales para círculo/elipse

- Campos: `centro`, `vértice superior`, `vértice inferior`, `vértice izquierdo`, `vértice derecho`, `foco 1`, `foco 2`.
- Dejar inicialmente vacíos (no autollenar).

### Tarea 2.3 — Inputs manuales para hipérbola/parábola

- Hipérbola: `centro`, `vértices`, `focos`, `asíntotas`.
- Parábola: `vértice`, `foco`, `directriz`.
- Mostrar/ocultar campos según tipo de cónica detectada.

### Tarea 2.4 — Ubicar visualmente los inputs “asociados” al área gráfica

- No dejarlos desconectados en otra sección.
- Mantener proximidad directa (debajo o lateral inmediata del canvas).

### Tarea 2.5 — Añadir marcadores visuales mínimos en gráfico

- Etiquetas tipo `C(...)`, `V1(...)`, `F1(...)` al estilo de la imagen.
- Leyenda inferior con colores por elemento (centro/vértice/focos/asíntotas-directriz).

### Tarea 2.6 — Trazas visuales para asíntotas/directriz

- Activar capa punteada para asíntotas/directriz.
- Control de visibilidad desde toggles ya existentes.

### Tarea 2.7 — Estado “modo defensa”

- Botón/toggle “Modo defensa”.
- En este modo: mantener inputs vacíos y ocultar resultados calculados automáticos.

### Tarea 2.8 — Validación visual de inputs pedagógicos

- Indicador simple por campo: pendiente/completado.
- No bloquear navegación, solo feedback de completitud.

---

## Persona 3 — Conicas (flujo de defensa) + cierre de interfaz de Límites

### Tarea 3.1 — Reorganizar panel de elementos cónicos para defensa

- Convertir panel actual en formato de “respuesta del estudiante”.
- Campos editables en lugar de solo lectura.

### Tarea 3.2 — Separar “resultado del sistema” vs “respuesta del estudiante”

- Dos vistas claras:
    - Vista A: solución calculada (docente/equipo).
    - Vista B: campos vacíos de defensa.
- Evitar mezclar ambas simultáneamente.

### Tarea 3.3 — Indicador de progreso de defensa en Conicas

- Checklist visual: centro, vértices, focos, ejes, asíntotas/directriz.
- Marcar automáticamente cada ítem cuando el input correspondiente tenga valor.

### Tarea 3.4 — Ajuste fino dark mode en card de gráfica de Conicas

- Verificar contraste en: grilla, puntos, etiquetas, leyenda, bordes punteados.
- Igualar sensación visual a referencia oscura entregada.

### Tarea 3.5 — Completar interfaz de página Límites (pendiente EID)

- Revisar que exista flujo completo visual:
    - función por tramos,
    - límites laterales,
    - clasificación de discontinuidad,
    - evidencia numérica,
    - modo defensa.
- Dejar todo consistente con el nuevo flujo de RUT reutilizable.

### Tarea 3.6 — Inputs de defensa en Límites (vacíos)

- Campos manuales: límite izquierdo, límite derecho, existencia del límite, tipo de discontinuidad, justificación.
- En modo defensa, no mostrar respuesta automática final.

### Tarea 3.7 — Alinear copy y etiquetas académicas en Límites

- Homogeneizar términos: “límite lateral izquierdo/derecho”, “existe/no existe”, “discontinuidad de salto/removible/infinita”.
- Mantener nomenclatura coherente con Conicas.

---

## Entregable final esperado (equipo completo)

- Sin página independiente de validación RUT.
- RUT validado una sola vez y reutilizado en Conicas/Límites.
- Conicas con inputs pedagógicos vacíos claramente vinculados a la gráfica.
- Interfaz de Límites completa para defensa.
- Consistencia visual (incluyendo dark mode) y foco pedagógico cumplido.