# 🏁 Sprint — Módulo de Límites y Continuidad
### Scrum Master: Antigravity | Equipo: 3 personas | Proyecto: LinealApp_RDS

---

> [!IMPORTANT]
> **Estado actual diagnosticado:** Toda la sección de límites es **100% visual y hardcodeada**. Los valores mostrados (función por tramos, límites 4 y 7, discontinuidad de salto) son datos fijos que no se calculan a partir del RUT. El único componente funcional es el input del RUT. **El objetivo de este sprint es conectar el RUT al motor de cálculo de límites y hacer que todo el panel sea dinámico y real.**

---

## 🧠 Contexto del PDF (Actividad EID — Introducción al Cálculo)

La actividad exige que, a partir del RUT del alumno, la aplicación:
1. **Genere una función por tramos** derivada de los dígitos del RUT (con un punto crítico `a` también derivado del RUT).
2. **Calcule los límites laterales** (lim x→a⁻ y lim x→a⁺) evaluando cada tramo.
3. **Determine si el límite general existe** (si los laterales son iguales).
4. **Clasifique la discontinuidad**: evitable/removible, de salto, o infinita/asintótica.
5. **Genere la tabla de evidencia numérica** con valores reales calculados (no hardcodeados).
6. **Muestre la conclusión de continuidad** con justificación automática.
7. El **Modo Defensa** debe pre-llenarse con los resultados calculados y permitir que el alumno los edite para practicar su presentación oral.

---

## 📦 Dependencias entre tareas (orden crítico)

```
[P1-T1] → [P1-T2] → todos los demás
                  ↘ [P2-T1] → [P2-T2] → [P2-T3]
                  ↘ [P3-T1] → [P3-T2] → [P3-T3]
```

> [!WARNING]
> **P1-T1 y P1-T2 son la base de todo el sprint.** Nadie más puede empezar su trabajo funcional hasta que P1 termine la lógica de cálculo y exporte los datos correctamente. Mientras tanto, P2 y P3 pueden avanzar en las tareas de refactorización visual (marcadas con 🎨).

---

## 👤 PERSONA 1 — Motor de Cálculo (Backend/Lógica)

> **Rol:** Arquitecto de la lógica matemática. Su trabajo es el corazón del módulo. Sin esto, nada funciona.

---

### ✅ P1-T1 — Crear `src/lib/limites.ts` con la lógica completa de generación y cálculo

**Archivo a crear:** `/src/lib/limites.ts`  
**Archivos de referencia:** `/src/lib/rut.ts` (ver cómo retornar un objeto estructurado)

**Descripción exacta:**
Crear una función exportada `calcularLimites(digitos: number[], v: number)` que retorne un objeto tipado con todos los datos necesarios para renderizar la página. El algoritmo debe:

1. **Definir el punto crítico `a`:**
   - Usar el dígito verificador `v` (que ya viene calculado desde el RUT).
   - Si `v === 11` → `a = 2`; si `v === 10` → `a = 5`; de lo contrario → `a = v`.
   - Guardar `a` en el objeto resultado.

2. **Definir los coeficientes de la función por tramos a partir de los dígitos:**
   - **Tramo 1** (si x < a): `f1(x) = d1·x² + d2·x - d3` donde `d1 = digitos[0]`, `d2 = digitos[1]`, `d3 = digitos[2]`.
   - **Tramo 2** (si x ≥ a): `f2(x) = d4·x + d5` donde `d4 = digitos[3]`, `d5 = digitos[4]`.
   - Si algún coeficiente `d1 === 0`, reemplazar por `1` para evitar función trivial.
   - Guardar coeficientes: `{ a1, a2, b1, b2, c, m, n }` para renderizado de la ecuación.

3. **Calcular el límite por izquierda:**
   - Evaluar `f1(a)` (el tramo izquierdo evaluado en `x = a`): `limIzquierda = a1*a^2 + a2*a - b1`.

4. **Calcular el límite por derecha:**
   - Evaluar `f2(a)` (el tramo derecho evaluado en `x = a`): `limDerecha = m*a + n`.

5. **Determinar existencia del límite:**
   - `existeLimite = limIzquierda === limDerecha`.

6. **Clasificar el tipo de discontinuidad:**
   - Si `existeLimite === true` y `f1(a) === f2(a)`: `tipo = 'continua'` (la función es continua, no hay discontinuidad).
   - Si `existeLimite === true` pero `f(a)` no está definida o difiere: `tipo = 'removible'`.
   - Si `existeLimite === false` y ambos límites son finitos: `tipo = 'salto'`.
   - Si algún límite es `±Infinity` o `NaN`: `tipo = 'infinita'`.

7. **Generar la tabla de evidencia numérica (6 filas):**
   - Para la izquierda: calcular `f1(a - 0.30)`, `f1(a - 0.10)`, `f1(a - 0.01)`.
   - Para la derecha: calcular `f2(a + 0.30)`, `f2(a + 0.10)`, `f2(a + 0.01)`.
   - Redondear a 4 decimales con `Number(x.toFixed(4))`.
   - Retornar como arrays de objetos `{ x: string, fx: string, observacion: string }`.

8. **Generar la justificación textual automática:**
   - Un string explicativo según el tipo de discontinuidad encontrado.

**Tipo de retorno a definir:**
```typescript
export type ResultadoLimites = {
  a: number;
  coeficientes: { a1: number; a2: number; b1: number; m: number; n: number };
  limIzquierda: number;
  limDerecha: number;
  existeLimite: boolean;
  tipoDiscontinuidad: 'continua' | 'removible' | 'salto' | 'infinita';
  evidenciaIzquierda: { x: string; fx: string; observacion: string }[];
  evidenciaDerecha: { x: string; fx: string; observacion: string }[];
  justificacion: string;
};

export function calcularLimites(digitos: number[], v: number): ResultadoLimites { ... }
```

**Criterio de aceptación:** Exportar la función y correr una prueba manual en `sandbox.ts` con un RUT de ejemplo, verificando que los valores retornados son matemáticamente correctos.

---

### ✅ P1-T2 — Crear contexto React `LimitesContext` y conectar el RUT al motor

**Archivos a crear:** `/src/components/limites/LimitesContext.tsx`  
**Archivos a modificar:** `/src/app/limites/page.tsx`  
**Archivos de referencia:** `/src/components/SidebarContext.tsx` (patrón de contexto ya existente en el proyecto)

**Descripción exacta:**

1. **Crear `LimitesContext.tsx`:**
   - Definir un contexto con `createContext` que almacene `ResultadoLimites | null`.
   - Proveer también una función `setResultado(r: ResultadoLimites)` y `rutIngresado: string`.
   - Exportar `useLimitesContext()` como hook.

2. **Modificar `page.tsx` (limites):**
   - Envolver todo el JSX en `<LimitesProvider>`.
   - Cambiar la firma de `onAnalyze` en `PanelEntradaLimites` para recibir `(rut: string, digitos: number[], v: number)`.
   - En el handler de `onAnalyze`, llamar a `calcularLimites(digitos, v)` e inyectar el resultado en el contexto.
   - El estado `mostrarAnalisis` se activa solo cuando el contexto tiene datos.

3. **Modificar `panel-entrada-limites.tsx`:**
   - La interfaz `Props.onAnalyze` debe cambiar a `(rut: string, digitos: number[], v: number) => void`.
   - Pasar los tres parámetros al `RutForm` ya existente: `onValidated` ya recibe `(rut, digitos, v)` — solo hay que propagarlos a `onAnalyze`.

**Criterio de aceptación:** Al validar el RUT, el contexto se llena con datos reales. Al hacer `console.log` del contexto en cualquier componente hijo, se ven los valores calculados.

---

## 👤 PERSONA 2 — Componentes de Análisis (Frontend dinámico)

> **Rol:** Conectar los componentes visuales de la columna de análisis al contexto. Depende de que P1 termine P1-T2 para trabajar en las tareas funcionales. Puede avanzar en las tareas 🎨 mientras tanto.

---

### 🎨 P2-T1 — Refactorizar `tarjeta-funcion-por-tramos.tsx` para renderizado dinámico

**Archivo a modificar:** `/src/components/limites/tarjeta-funcion-por-tramos.tsx`  
**Depende de:** P1-T2 (contexto listo)

**Descripción exacta:**

1. Convertir el componente a `'use client'` y consumir `useLimitesContext()`.
2. Reemplazar los textos hardcodeados (`x² - 4`, `2x + 1`, `x = 2`) por valores dinámicos del contexto:
   - El tramo 1 debe renderizar: `{a1}x² + {a2}x - {b1}` construyendo el string correctamente (omitir términos con coeficiente 0, usar `- ` si el coeficiente es negativo).
   - El tramo 2 debe renderizar: `{m}x + {n}`.
   - El badge del punto crítico debe mostrar `x = {a}`.
   - La franja inferior debe mostrar `Punto crítico en evaluación: x = {a}`.
3. Agregar una función auxiliar local `formatearTermino(coef: number, variable: string): string` que genere el texto del término matemático correctamente (ej: coef=1 → no mostrar el 1, coef=-1 → mostrar solo el negativo).

**Criterio de aceptación:** Al cambiar el RUT, la función por tramos se actualiza automáticamente con los valores correctos del nuevo RUT.

---

### ✅ P2-T2 — Conectar `panel-tipo-discontinuidad.tsx` al contexto

**Archivo a modificar:** `/src/components/limites/panel-tipo-discontinuidad.tsx`  
**Depende de:** P1-T2

**Descripción exacta:**

1. Agregar `'use client'` y consumir `useLimitesContext()`.
2. Eliminar el array `opciones` hardcodeado.
3. Generar dinámicamente las 3 opciones (evitable, salto, infinita) y marcar como `activa: true` solo la que coincida con `resultado.tipoDiscontinuidad`.
4. Agregar un cuarto caso: si `tipoDiscontinuidad === 'continua'`, mostrar una sección especial con fondo verde indicando "Función Continua — No hay discontinuidad".
5. Cada opción debe tener también una descripción corta:
   - **Evitable:** "Los límites laterales son iguales, pero f(a) ≠ lím o no existe."
   - **Salto:** "Los límites laterales existen pero son diferentes entre sí."
   - **Infinita:** "Al menos un límite lateral tiende a ±∞."
6. El badge "Detectada" debe cambiar a color destructive si el tipo es infinita, a amber si es salto, y a verde si es evitable.

**Criterio de aceptación:** El panel muestra automáticamente el tipo correcto resaltado con la descripción adecuada.

---

### ✅ P2-T3 — Conectar `panel-analisis-limites.tsx` al contexto

**Archivo a modificar:** `/src/components/limites/panel-analisis-limites.tsx`  
**Depende de:** P1-T2

**Descripción exacta:**

1. Agregar `'use client'` y consumir `useLimitesContext()`.
2. Reemplazar los valores hardcodeados `L = 4` y `L = 7` con los valores reales `resultado.limIzquierda` y `resultado.limDerecha`.
3. La sección "Existencia del límite" debe cambiar dinámicamente:
   - Si `existeLimite === true`: fondo verde, ícono `CheckCircle2`, texto `"Existe"`, valor `L = {limIzquierda}`.
   - Si `existeLimite === false`: fondo destructive, ícono `AlertCircle`, texto `"No existe"`.
4. La "Conclusión de continuidad" debe mostrar la `resultado.justificacion` (string generado en P1-T1, paso 8).
5. Las notaciones matemáticas `lim x→a⁻ f(x)` y `lim x→a⁺ f(x)` deben reemplazar `a` por el valor real `resultado.a`.

**Criterio de aceptación:** Al cambiar de RUT, todos los valores del panel se actualizan correctamente.

---

## 👤 PERSONA 3 — Evidencia Numérica y Modo Defensa (Frontend dinámico)

> **Rol:** Conectar los dos paneles inferiores al contexto. Son independientes entre sí una vez disponible el contexto.

---

### 🎨 P3-T1 — Refactorizar `tabla-evidencia-numerica.tsx` para datos dinámicos

**Archivo a modificar:** `/src/components/limites/tabla-evidencia-numerica.tsx`  
**Depende de:** P1-T2

**Descripción exacta:**

1. Agregar `'use client'` y consumir `useLimitesContext()`.
2. Eliminar los arrays hardcodeados `evidenciaIzquierda` y `evidenciaDerecha`.
3. Usar directamente `resultado.evidenciaIzquierda` y `resultado.evidenciaDerecha` del contexto.
4. Las variables `limiteIzquierda` y `limiteDerecha` deben venir de `resultado.limIzquierda.toFixed(4)` y `resultado.limDerecha.toFixed(4)`.
5. El badge de tendencia (ej: `→ 4`) debe ser dinámico: `→ {resultado.limIzquierda}` y `→ {resultado.limDerecha}`.
6. La conclusión textual en la sección inferior debe usar la misma lógica ya existente pero con datos reales.
7. Agregar formato condicional en las filas de la tabla: si el valor `fx` se acerca al límite (diferencia < 0.1), resaltar la fila con fondo `bg-primary/5`.

**Criterio de aceptación:** La tabla muestra los 6 valores calculados matemáticamente desde el RUT, sin ningún dato hardcodeado.

---

### ✅ P3-T2 — Refactorizar `modo-defensa-limites.tsx` para pre-llenado + validación

**Archivo a modificar:** `/src/components/limites/modo-defensa-limites.tsx`  
**Depende de:** P1-T2

**Descripción exacta:**

1. Agregar `'use client'` y convertir el componente a un componente con estado (`useState`).
2. Consumir `useLimitesContext()` para pre-llenar los campos.
3. Pre-llenar los campos al montar el componente (o cuando cambia el resultado del contexto) usando `useEffect`:
   - `limiteIzquierdo`: `resultado.limIzquierda.toString()`
   - `limiteDerecho`: `resultado.limDerecha.toString()`
   - `¿Existe el límite?`: el select debe pre-seleccionar `"si"` o `"no"` según `resultado.existeLimite`.
   - `Tipo de discontinuidad`: pre-seleccionar según `resultado.tipoDiscontinuidad`.
   - `Justificación escrita`: pre-llenar con `resultado.justificacion`.
4. Todos los inputs/selects deben ser controlados (usar `value` + `onChange`, no `defaultValue`).
5. El botón `"Preparar defensa"` debe activar un modo de revisión:
   - Al hacer click, comparar los valores actuales del formulario con los valores del contexto.
   - Si todos coinciden: mostrar un alert/toast verde "✅ ¡Respuestas correctas! Estás listo para la defensa."
   - Si alguno difiere: resaltar el campo incorrecto con borde rojo y mostrar el valor correcto debajo.
6. El estado del formulario debe tener un botón "Restaurar valores calculados" que resetea todo a los valores del contexto.

**Criterio de aceptación:** Al validar el RUT, el formulario se pre-llena. Al hacer click en "Preparar defensa", se validan las respuestas contra los cálculos reales.

---

### ✅ P3-T3 — Agregar gráfico de la función por tramos con punto crítico marcado

**Archivo a crear:** `/src/components/limites/grafico-funcion-limites.tsx`  
**Archivo a modificar:** `/src/app/limites/page.tsx` (agregar el componente entre `TarjetaFuncionPorTramos` y la grilla)  
**Depende de:** P1-T2  
**Librería disponible:** revisar `package.json` si ya existe `recharts` o similar. Si no, usar SVG puro con cálculo de puntos.

**Descripción exacta:**

1. Crear el componente `GraficoFuncionLimites` que consuma `useLimitesContext()`.
2. Generar un arreglo de puntos para el eje X desde `a - 3` hasta `a + 3` con paso `0.1`.
3. Para cada `x`:
   - Si `x < a`: evaluar con `f1(x) = a1·x² + a2·x - b1`.
   - Si `x >= a`: evaluar con `f2(x) = m·x + n`.
4. Renderizar usando la librería de gráficos disponible o SVG. La gráfica debe:
   - Mostrar una línea para `f1` (color azul primario) y una línea para `f2` (color violeta/secondary).
   - Marcar el punto crítico `x = a` con una línea vertical punteada.
   - Marcar con un punto vacío (círculo sin relleno) el límite por izquierda `(a, limIzquierda)`.
   - Marcar con un punto relleno el límite por derecha `(a, limDerecha)`.
   - Incluir ejes X e Y con etiquetas.
   - Leyenda: "Tramo 1 (x < a)", "Tramo 2 (x ≥ a)", "Punto crítico".
5. Si `tipoDiscontinuidad === 'continua'`: ambos puntos son el mismo y se muestran rellenos en verde.
6. El contenedor debe tener `height: 300px` y ser responsive.

**Criterio de aceptación:** La gráfica se renderiza correctamente para cualquier RUT y muestra la discontinuidad visualmente.

---

## 📋 Tabla Resumen de Tareas

| ID | Persona | Tipo | Tarea | Depende de | Prioridad |
|----|---------|------|-------|------------|-----------|
| P1-T1 | Persona 1 | Backend | Crear `limites.ts` con motor de cálculo | — | 🔴 CRÍTICA |
| P1-T2 | Persona 1 | Backend/Context | Crear `LimitesContext` y conectar `page.tsx` | P1-T1 | 🔴 CRÍTICA |
| P2-T1 | Persona 2 | Frontend | Dinamizar `tarjeta-funcion-por-tramos.tsx` | P1-T2 | 🟡 ALTA |
| P2-T2 | Persona 2 | Frontend | Conectar `panel-tipo-discontinuidad.tsx` | P1-T2 | 🟡 ALTA |
| P2-T3 | Persona 2 | Frontend | Conectar `panel-analisis-limites.tsx` | P1-T2 | 🟡 ALTA |
| P3-T1 | Persona 3 | Frontend | Dinamizar `tabla-evidencia-numerica.tsx` | P1-T2 | 🟡 ALTA |
| P3-T2 | Persona 3 | Frontend | Refactorizar `modo-defensa-limites.tsx` | P1-T2 | 🟡 ALTA |
| P3-T3 | Persona 3 | Frontend | Crear `grafico-funcion-limites.tsx` | P1-T2 | 🟠 MEDIA |

---

## ⏱️ Orden de ejecución recomendado

```
DÍA 1 — MAÑANA
  └─ Persona 1: Trabaja en P1-T1 (motor de cálculo)
  └─ Persona 2: Puede preparar el entorno, revisar el código actual
  └─ Persona 3: Puede preparar el entorno, revisar el código actual

DÍA 1 — TARDE (o cuando P1-T1 esté listo)
  └─ Persona 1: Trabaja en P1-T2 (contexto React)
  └─ Personas 2 y 3: DESBLOQUEDAS → inician sus tareas en paralelo

DÍA 2
  └─ Persona 2: P2-T1 → P2-T2 → P2-T3 (en ese orden, son independientes entre sí)
  └─ Persona 3: P3-T1 → P3-T2 (paralelo a P2)
  └─ Persona 3: P3-T3 (puede hacerse al final si hay tiempo)

DÍA 3 — INTEGRACIÓN
  └─ Todos: revisión cruzada, pruebas con distintos RUTs, pulir detalles visuales
```

---

> [!NOTE]
> **Convención de branches Git recomendada:**  
> - `feat/limites-engine` → Persona 1  
> - `feat/limites-analisis-ui` → Persona 2  
> - `feat/limites-evidencia-defensa` → Persona 3  
> Hacer merge a `main` solo cuando P1 haya terminado sus dos tareas.
