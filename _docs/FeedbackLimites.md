# 🐛 Reporte de QA: Módulo de Límites y Continuidad

Se realizó una auditoría visual y funcional en la ruta `http://localhost:3000/limites` ejecutando el flujo completo de validación de RUT ("12.345.678-5") y analizando todos los componentes dinámicos de la página, con especial enfoque en los desarrollados por la **Persona 3**.

A continuación, el detalle de los hallazgos para que el equipo pueda organizar la corrección.

---

## ✅ 1. Tabla de Evidencia Numérica
**Estado:** Funciona correctamente.
**Detalles:**
- La tabla se renderiza sin problemas.
- Calcula y muestra aproximaciones precisas con 4 decimales tanto por la izquierda (ej. `x = 4.7000`, `4.9000`, `4.9900` → `32.0000`) como por la derecha (ej. `x = 5.3000`, `5.1000`, `5.0100` → `25.0000`).
- No se detectaron anomalías visuales ni funcionales.

---

## ❌ 2. Gráfico de la Función
**Estado:** **Error Crítico (Bug Visual)**
**Detalles:**
- **Tramo 1 (Izquierdo):** La curva correspondiente a la primera parte de la función por tramos (para $x < a$) **no se está dibujando en absoluto**. En la gráfica, el espacio aparece vacío y únicamente es visible el punto circular (marcador) en las coordenadas del límite evaluado (ej. `(5, 32.00)`).
- **Tramo 2 (Derecho):** Se renderiza correctamente la línea desde el punto crítico hacia la derecha.
- **Acción sugerida:** La Persona 3 debe revisar la generación de los puntos (`x, y`) en el array del gráfico para el Tramo 1 en `grafico-funcion-limites.tsx` o verificar cómo recharts/SVG está interpretando la data.

---

## ✅ 3. Modo Defensa
**Estado:** Funciona correctamente.
**Detalles:**
- **Pre-llenado:** Al iniciar, los valores se precargan exitosamente desde el contexto (ej. `32`, `25`, `No existe`, `De salto`).
- **Validación de Errores:** Al intentar hacer trampa y modificar un valor correcto por uno incorrecto (ej. cambiar el límite a `99`), al hacer click en "Preparar defensa", el sistema atrapa el error, tiñe el input de rojo y muestra el valor correcto debajo.
- **Restauración:** El botón "Restaurar valores calculados" resetea la información correctamente.
- **Éxito:** Si los valores coinciden, despliega correctamente la alerta verde de éxito.

---

## ⚠️ 4. Metadatos de la Página (Title)
**Estado:** **Incongruencia Menor**
**Detalles:**
- La pestaña del navegador dice `"Analizador de Cónicas"` estando en la ruta `/limites`. 
- **Acción sugerida:** Actualizar el metadata `title` en `/src/app/limites/page.tsx` para que diga `"Análisis de Límites y Continuidad"`.

---

> **Próximos pasos recomendados:**
> 1. Priorizar la resolución de la falla de renderizado en el `grafico-funcion-limites.tsx`.
> 2. Corregir el `<title>` de la página.
> 3. Hacer merge a la rama principal una vez solventados.
