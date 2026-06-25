/**
 * @param n - Número al que calcular la raíz
 * @param tolerancia - Precisión de convergencia (por defecto 1e-10)
 * @returns Raíz cuadrada aproximada de n
 */
export function raizCuadrada(n: number, tolerancia: number = 1e-10): number {
  if (n < 0) return Number.NaN;
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Adivinanza inicial: n/2 es una buena aproximación inicial
  let x = n / 2;
  let prev = 0;

  // Iteraciones hasta convergencia: x_{n+1} = (x_n + n/x_n) / 2
  let iteraciones = 0;
  const maxIteraciones = 100; // Evitar loops infinitos

  while (iteraciones < maxIteraciones) {
    // Nueva aproximación
    const xNuevo = (x + n / x) / 2;

    // Verificar convergencia
    const diferencia = xNuevo > prev ? xNuevo - prev : prev - xNuevo;
    if (diferencia < tolerancia) {
      return xNuevo;
    }

    prev = x;
    x = xNuevo;
    iteraciones++;
  }

  return x;
}

export function absoluto(n: number): number {
  return n < 0 ? -n : n;
}


export type PuntosGrafica = {
  centro?: { x: number; y: number };
  radio?: number;
  semiEjeMayor?: number;
  semiEjeMenor?: number;
  eje?: 'horizontal' | 'vertical';
  puntos?: Array<{ x: number; y: number }>;
};

/** 
 * @param h - Centro x
 * @param k - Centro y
 * @param r - Radio
 * @returns Objeto con centro y radio
 */
export function puntosCircunferencia(
  h: number,
  k: number,
  r: number
): PuntosGrafica {
  return {
    centro: { x: h, y: k },
    radio: r
  };
}

/**
 * @param h - Centro x
 * @param k - Centro y
 * @param a - Semieje en x (si horizontal es el mayor)
 * @param b - Semieje en y (si horizontal es el mayor)
 * @returns Objeto con parámetros para Ellipse de Mafs
 */
export function puntosElipse(
  h: number,
  k: number,
  a: number,
  b: number
): PuntosGrafica {
  // a es el semieje mayor, b es el semieje menor
  const semiEjeMayor = a > b ? a : b;
  const semiEjeMenor = a < b ? a : b;
  const esHorizontal = a > b;

  return {
    centro: { x: h, y: k },
    semiEjeMayor,
    semiEjeMenor,
    eje: esHorizontal ? 'horizontal' : 'vertical'
  };
}

/**

 * @param h - Centro x
 * @param k - Centro y
 * @param a - Parámetro a
 * @param b - Parámetro b
 * @param horizontal - true si es horizontal (ramas a izquierda/derecha), false si es vertical
 * @param rango - Rango de x para calcular puntos (por defecto 50)
 * @param paso - Incremento en x entre puntos (por defecto 0.1)
 * @returns Array de puntos {x, y} para las dos ramas
 */
export function puntosHiperbola(
  h: number,
  k: number,
  a: number,
  b: number,
  horizontal: boolean = true,
  rango: number = 50,
  paso: number = 0.1
): PuntosGrafica {
  const puntos: Array<{ x: number; y: number }> = [];

  if (horizontal) {

    for (let x = h + a; x <= h + rango; x += paso) {
      const relativo = (x - h) / a;
      const discriminante = relativo * relativo - 1; // x²/a² - 1

      if (discriminante >= 0) {
        const raiz = raizCuadrada(discriminante);
        const y1 = k + b * raiz;
        const y2 = k - b * raiz;
        puntos.push({ x, y: y1 });
        puntos.push({ x, y: y2 });
      }
    }

    // Rama izquierda (x <= h - a)
    for (let x = h - a; x >= h - rango; x -= paso) {
      const relativo = (x - h) / a;
      const discriminante = relativo * relativo - 1;

      if (discriminante >= 0) {
        const raiz = raizCuadrada(discriminante);
        const y1 = k + b * raiz;
        const y2 = k - b * raiz;
        puntos.push({ x, y: y1 });
        puntos.push({ x, y: y2 });
      }
    }
  } else {

    for (let y = k + a; y <= k + rango; y += paso) {
      const relativo = (y - k) / a;
      const discriminante = relativo * relativo - 1;

      if (discriminante >= 0) {
        const raiz = raizCuadrada(discriminante);
        const x1 = h + b * raiz;
        const x2 = h - b * raiz;
        puntos.push({ x: x1, y });
        puntos.push({ x: x2, y });
      }
    }

    // Rama inferior (y <= k - a)
    for (let y = k - a; y >= k - rango; y -= paso) {
      const relativo = (y - k) / a;
      const discriminante = relativo * relativo - 1;

      if (discriminante >= 0) {
        const raiz = raizCuadrada(discriminante);
        const x1 = h + b * raiz;
        const x2 = h - b * raiz;
        puntos.push({ x: x1, y });
        puntos.push({ x: x2, y });
      }
    }
  }

  return {
    centro: { x: h, y: k },
    eje: horizontal ? 'horizontal' : 'vertical',
    puntos
  };
}

/**

 * @param h - Vértice x
 * @param k - Vértice y
 * @param p - Parámetro focal (distancia vértice a foco)
 * @param vertical - true si eje es vertical (apertura arriba/abajo), false si es horizontal
 * @param rango - Rango de variable independiente (por defecto 50)
 * @param paso - Incremento entre puntos (por defecto 0.1)
 * @returns Array de puntos {x, y} para la parábola
 */
export function puntosParabola(
  h: number,
  k: number,
  p: number,
  vertical: boolean = true,
  rango: number = 50,
  paso: number = 0.1
): PuntosGrafica {
  const puntos: Array<{ x: number; y: number }> = [];

  if (vertical) {

    const inicio = p > 0 ? k : k - rango;
    const fin = p > 0 ? k + rango : k;
    const incremento = p > 0 ? paso : -paso;

    for (
      let y = inicio;
      (p > 0 && y <= fin) || (p < 0 && y >= fin);
      y += incremento
    ) {
      const discriminante = 4 * p * (y - k);

      if (discriminante >= 0) {
        const raiz = raizCuadrada(discriminante);
        const x1 = h + raiz;
        const x2 = h - raiz;
        puntos.push({ x: x1, y });
        if (raiz !== 0) {
          puntos.push({ x: x2, y });
        }
      }
    }
  } else {

    const inicio = p > 0 ? h : h - rango;
    const fin = p > 0 ? h + rango : h;
    const incremento = p > 0 ? paso : -paso;

    for (
      let x = inicio;
      (p > 0 && x <= fin) || (p < 0 && x >= fin);
      x += incremento
    ) {
      const discriminante = 4 * p * (x - h);

      if (discriminante >= 0) {
        const raiz = raizCuadrada(discriminante);
        const y1 = k + raiz;
        const y2 = k - raiz;
        puntos.push({ x, y: y1 });
        if (raiz !== 0) {
          puntos.push({ x, y: y2 });
        }
      }
    }
  }

  return {
    centro: { x: h, y: k },
    eje: vertical ? 'vertical' : 'horizontal',
    puntos
  };
}
