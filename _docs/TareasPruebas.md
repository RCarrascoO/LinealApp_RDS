# 🏁 Sprint — Módulo de Límites y Continuidad
### Scrum Master: Antigravity | Equipo: 3 personas | Proyecto: LinealApp_RDS

---

## 📐 Fase de Pruebas y Auditoría (QA) — Cónicas

A continuación se detallan las tareas de prueba para el módulo de Cónicas, divididas equitativamente para asegurar la cobertura total de las reglas matemáticas exigidas (Circunferencia, Elipse, Parábola, Hipérbola) y el funcionamiento del Modo Defensa.

### 👤 Persona 1 (Seba) (Backend/Lógica) — Pruebas de Elipse y Circunferencia
**Objetivo:** Verificar la generación y renderizado de elipses y circunferencias.
- [ ] **Caso de prueba 1 (Circunferencia):** Encontrar e ingresar un RUT válido donde `d1 = d2` (Ej: `11.XXX.XXX-X`).
- [ ] Verificar que la gráfica dibuje una circunferencia perfecta sin deformaciones (aspect ratio 1:1) y la leyenda dinámica indique "Centro" y "Línea Circunferencia".
- [ ] **Caso de prueba 2 (Elipse):** Encontrar e ingresar un RUT válido que no active las reglas de hipérbola (`d8` par) ni parábola (`d5+d6` no múltiplo de 3) ni circunferencia (`d1 != d2`).
- [ ] Verificar que el motor gráfico dibuje la elipse con sus **4 vértices** (2 del eje focal y 2 co-vértices del eje menor).
- [ ] Validar que el panel de Defensa Oral a la izquierda exija ingresar las coordenadas atómicas correctas (X e Y por separado) para Centro, Focos y Vértices, y no se rellene solo.

### 👤 Persona 2 (Renato) (Frontend) — Pruebas de Parábola (Vertical y Horizontal)
**Objetivo:** Verificar las dos orientaciones posibles de la parábola y sus elementos geométricos.
- [ ] **Caso de prueba 3 (Parábola Vertical):** Encontrar e ingresar un RUT válido donde `d5+d6` sea múltiplo de 3 y `d7` sea par.
- [ ] Verificar que la parábola abra hacia arriba o hacia abajo en el eje Y.
- [ ] Comprobar que el gráfico muestre correctamente el **Foco** (punto) y la **Directriz** (línea punteada horizontal).
- [ ] **Caso de prueba 4 (Parábola Horizontal):** Encontrar e ingresar un RUT válido donde `d5+d6` sea múltiplo de 3 y `d7` sea impar.
- [ ] Verificar que la parábola abra hacia la izquierda o derecha en el eje X, con su respectiva Directriz (línea punteada vertical).
- [ ] En el panel de Defensa Oral, probar forzar un error ingresando coordenadas invertidas y validar los mensajes de retroalimentación.

### 👤 Persona 3 (Daniel) (Matemático/UX) — Pruebas de Hipérbola y Casos Borde
**Objetivo:** Verificar la hipérbola y el sistema de jerarquía de reglas ante colisiones.
- [ ] **Caso de prueba 5 (Hipérbola):** Encontrar e ingresar un RUT válido donde `d8` sea impar.
- [ ] Verificar que se grafiquen correctamente las dos ramas de la hipérbola.
- [ ] Validar que el motor gráfico trace las dos **Asíntotas** en forma de cruz por el centro (líneas punteadas).
- [ ] **Caso de prueba 6 (Colisión de Reglas):** Ingresar un RUT "borde" que cumpla varias condiciones a la vez (ej: `d1=d2` para circunferencia y además `d5+d6` múltiplo de 3 para parábola).
- [ ] Comprobar en la interfaz de resultados que el sistema arroje una alerta pedagógica indicando qué regla jerárquica prevaleció sobre cuál (Ej: "Regla de Parábola aplicada por sobre Circunferencia").
- [ ] Activar/Desactivar el **Modo Defensa** en el gráfico (toggle switch) y verificar que todas las etiquetas de coordenadas textuales desaparezcan, dejando solo la figura y los puntos en el plano.

## 🧪 Fase de Pruebas y Auditoría (QA)

Para asegurar que nuestro sistema cumple con los requerimientos de la rúbrica y funciona en la defensa oral, cada integrante debe asumir el rol de QA (Quality Assurance) verificando escenarios matemáticos extremos usando RUTs específicos.

### 👤 Persona 1 (Seba) (Backend/Lógica) — Pruebas de Discontinuidad Removible
**Objetivo:** Verificar que el sistema maneje correctamente el caso de **Discontinuidad Removible** (`d8` múltiplo de 3).
- [ ] **Caso de prueba 1:** Encontrar e ingresar un RUT válido donde `d8` sea 0, 3, 6 o 9 (Ej: `XX.XXX.XX3-X`).
- [ ] Verificar que la tarjeta de Función por Tramos muestre correctamente la función racional de la forma `f1(x) = (x-a)(x+d1)/(x-a)`.
- [ ] Verificar que el límite por la izquierda y el límite por la derecha arrojen **el mismo valor numérico**.
- [ ] Comprobar que en la gráfica el punto en `x = a` tenga un "hueco" (punto vacío) y que no se rompa la continuidad visual (solo el punto excluido).
- [ ] Usar el "Modo Defensa" y llenar los campos manualmente para asegurar que el sistema valide que "El límite sí existe".

### 👤 Persona 2 (Renato) (Frontend) — Pruebas de Discontinuidad de Salto
**Objetivo:** Verificar que el sistema maneje correctamente el caso de **Discontinuidad de Salto** (`d8` con residuo 1).
- [ ] **Caso de prueba 2:** Encontrar e ingresar un RUT válido donde `d8` deje residuo 1 al dividir por 3 (Ej: `d8` = 1, 4, 7).
- [ ] Verificar que la tarjeta de Función por Tramos muestre un sistema de dos rectas.
- [ ] Validar que la **Tabla de Evidencia Numérica** refleje una ruptura evidente en los valores de `f(x)` al acercarse a `a` por la izquierda frente a la derecha.
- [ ] Verificar que el gráfico muestre **dos trazos claramente separados en el eje Y** en `x = a`, marcando correctamente un punto relleno (incluido) y un punto vacío (excluido) según las desigualdades.
- [ ] Usar el "Modo Defensa" para forzar respuestas incorrectas intencionalmente y asegurar que los mensajes de error guíen hacia la respuesta real.

### 👤 Persona 3 (Daniel) (Matemático/UX) — Pruebas de Discontinuidad Infinita
**Objetivo:** Verificar que el sistema maneje correctamente el caso de **Discontinuidad Infinita** (`d8` con residuo 2).
- [ ] **Caso de prueba 3:** Encontrar e ingresar un RUT válido donde `d8` deje residuo 2 al dividir por 3 (Ej: `d8` = 2, 5, 8).
- [ ] Verificar que la función generada sea del tipo racional `f(x) = (d5+1)/(x-a)`.
- [ ] Validar que la **Tabla de Evidencia Numérica** dispare sus valores hacia infinito positivo o negativo a medida que los `x` se acercan a `a` (ej: valores de 100, 1000, 10000, etc.).
- [ ] Comprobar que el gráfico logre renderizar la **asíntota vertical** en `x = a` y muestre cómo las curvas divergen sin chocar o distorsionar el layout de la app.
- [ ] Rellenar el "Modo Defensa" comprobando que justifique matemáticamente el límite como "No existe / infinito".


