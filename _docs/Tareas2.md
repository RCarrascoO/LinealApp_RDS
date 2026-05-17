### 👤 PERSONA 2

---

#### 🔧 TAREA 2.1 — Implementar la clasificación automática del tipo de cónica y sus propiedades geométricas

**Archivo:** `src/lib/clasificarConica.ts`

**Qué hacer:** Crear la función `clasificarConica(A: number, B: number, C: number, D: number, E: number): ConicaResult` donde `ConicaResult` es un tipo con:

- `tipo`: `'circunferencia' | 'elipse' | 'hiperbola' | 'parabola'`
- `razon`: string explicando por qué (ej: `"A = B = 3 y ambos ≠ 0 → Circunferencia"`)
- `formaCanonica`: objeto con los parámetros calculados (centro `(h, k)`, radio `r` para circunferencia; semiejes `a`, `b` para elipse/hipérbola; vértice y `p` para parábola)
- `pasosGeneralACanonica`: `string[]` con cada paso algebraico de completar el cuadrado manualmente
- `pasosCanónicaAGeneral`: `string[]` con el procedimiento inverso

La clasificación sigue las reglas del PDF:

- Circunferencia: `A === B && A !== 0`
- Elipse: mismo signo, `A !== B`, ambos ≠ 0
- Hipérbola: signos opuestos
- Parábola: exactamente uno de A o B es 0

Implementar "completar el cuadrado" manualmente para cada tipo de cónica sin usar ninguna librería.

**Se espera al completar:**  
Dado cualquier conjunto de coeficientes, la función retorna el tipo correcto, los parámetros geométricos calculados manualmente, y el desarrollo paso a paso de ambas transformaciones (general → canónica y canónica → general).

---

#### 🎨 TAREA 2.2 — Construir el panel de visualización de la ecuación general y el desarrollo de coeficientes

**Archivo:** `src/components/EcuacionPanel.tsx`

**Qué hacer:** Crear el componente `<EcuacionPanel coeficientes={...} pasosConstruccion={...} />` que:

- Muestre la ecuación general `Ax² + By² + Cx + Dy + E = 0` con los valores reales sustituidos, renderizada de forma legible (puede usar template strings con superíndices HTML o una representación clara sin LaTeX).
- Incluya un botón "Ver construcción paso a paso" que expanda un panel mostrando cada paso del array `pasosConstruccion` (proveniente de `calcularCoeficientes`), explicando cómo se llegó a cada coeficiente desde el RUT.
- Resalte visualmente el coeficiente A en rojo si A=0, B en azul si B=0, para facilitar la comprensión de parábolas.
- Muestre el tipo de cónica identificado con un badge de color (ej: verde para circunferencia, azul para elipse, naranja para hipérbola, morado para parábola).

**Se espera al completar:**  
El usuario ve claramente la ecuación general con sus coeficientes reales, entiende cómo se construyó desde el RUT y conoce el tipo de cónica antes de ver la gráfica.

---

#### 🎨 TAREA 2.3 — Construir el panel de transformación canónica con pasos matemáticos expandibles

**Archivo:** `src/components/TransformacionCanonica.tsx`

**Qué hacer:** Crear el componente `<TransformacionCanonica resultado={ConicaResult} />` que:

- Muestre la **forma canónica** de la ecuación (ej: `(x-h)²/a² + (y-k)²/b² = 1` para elipse) con los valores reales.
- Tenga dos secciones expandibles con acordeón:
    - "General → Canónica": lista los `pasosGeneralACanonica[]` paso a paso, numerados.
    - "Canónica → General": lista los `pasosCanónicaAGeneral[]` paso a paso, numerados.
- Para cada tipo de cónica, muestre una tabla con los **elementos geométricos** calculados: centro `(h, k)`, y según el tipo: radio, semiejes `a` y `b`, focos `(h±c, k)` o `(h, k±c)`, vértices, directriz.
- Los valores de esa tabla deben provenir de los `formaCanonica` calculados en la lógica, no hardcodeados.

**Se espera al completar:**  
El usuario puede ver la forma canónica, navegar por el desarrollo matemático completo en ambas direcciones y consultar todos los elementos geométricos de su cónica.