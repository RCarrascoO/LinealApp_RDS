export type Punto = { x: number; y: number };

export type CoeficientesConica = {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
};

export type FormaCanonica = {
  centro: { h: number; k: number };
  radio?: number;
  a?: number;
  b?: number;
  c?: number;
  p?: number;
  eje?: 'horizontal' | 'vertical';
  vertices?: Punto[];
  focos?: Punto[];
  directriz?: string;
  directrices?: string[];
  ecuacion?: string;
};

export type ConicaResult = {
  tipo: 'circunferencia' | 'elipse' | 'hiperbola' | 'parabola' | 'ninguna';
  razon: string;
  formaCanonica: FormaCanonica;
  pasosGeneralACanonica: string[];
  pasosCanonicaAGeneral: string[];
};

const EPSILON = 1e-9;

function esCero(valor: number): boolean {
  return Math.abs(valor) < EPSILON;
}

function redondear(valor: number, decimales = 4): number {
  const factor = 10 ** decimales;
  return Math.round(valor * factor) / factor;
}

function formatear(valor: number): string {
  if (!Number.isFinite(valor)) {
    return '0';
  }

  const redondeado = redondear(valor, 4);
  return Number.isInteger(redondeado)
    ? String(redondeado)
    : redondeado.toFixed(4).replace(/\.0+$/, '').replace(/0+$/, '').replace(/\.$/, '');
}

function construirPasoEcuacion(coeficientes: CoeficientesConica): string {
  const { A, B, C, D, E } = coeficientes;

  return `${formatear(A)}x² ${B >= 0 ? '+' : '-'} ${formatear(Math.abs(B))}y² ${C >= 0 ? '+' : '-'} ${formatear(Math.abs(C))}x ${D >= 0 ? '+' : '-'} ${formatear(Math.abs(D))}y ${E >= 0 ? '+' : '-'} ${formatear(Math.abs(E))} = 0`;
}

function construirPuntosSimetricos(horizontal: boolean, centro: { h: number; k: number }, distancia: number): Punto[] {
  if (horizontal) {
    return [
      { x: centro.h - distancia, y: centro.k },
      { x: centro.h + distancia, y: centro.k }
    ];
  }

  return [
    { x: centro.h, y: centro.k - distancia },
    { x: centro.h, y: centro.k + distancia }
  ];
}

function completarCircunferencia(coeficientes: CoeficientesConica): FormaCanonica {
  const { A, C, D, E } = coeficientes;
  const h = -C / (2 * A);
  const k = -D / (2 * A);
  const radioAlCuadrado = h * h + k * k - E / A;
  const radio = Math.sqrt(Math.max(radioAlCuadrado, 0));

  return {
    centro: { h, k },
    radio,
    vertices: construirPuntosSimetricos(true, { h, k }, radio),
    focos: [],
    ecuacion: `(x - ${formatear(h)})² + (y - ${formatear(k)})² = ${formatear(radio * radio)}`
  };
}

function completarElipse(coeficientes: CoeficientesConica): FormaCanonica {
  const { A, B, C, D, E } = coeficientes;
  const h = -C / (2 * A);
  const k = -D / (2 * B);
  const rhs = C * C / (4 * A) + D * D / (4 * B) - E;
  const aDen = Math.abs(rhs / A);
  const bDen = Math.abs(rhs / B);
  const eje = aDen >= bDen ? 'horizontal' : 'vertical';
  const semiEjeMayor = Math.sqrt(Math.max(Math.max(aDen, bDen), 0));
  const semiEjeMenor = Math.sqrt(Math.max(Math.min(aDen, bDen), 0));
  const c = Math.sqrt(Math.max(semiEjeMayor * semiEjeMayor - semiEjeMenor * semiEjeMenor, 0));
  const focos = construirPuntosSimetricos(eje === 'horizontal', { h, k }, c);
  const vertices = construirPuntosSimetricos(eje === 'horizontal', { h, k }, semiEjeMayor);

  return {
    centro: { h, k },
    a: semiEjeMayor,
    b: semiEjeMenor,
    c,
    eje,
    focos,
    vertices,
    ecuacion: `((x - ${formatear(h)})² / ${formatear(semiEjeMayor * semiEjeMayor)}) + ((y - ${formatear(k)})² / ${formatear(semiEjeMenor * semiEjeMenor)}) = 1`
  };
}

function completarHiperbola(coeficientes: CoeficientesConica): FormaCanonica {
  const { A, B, C, D, E } = coeficientes;
  const h = -C / (2 * A);
  const k = -D / (2 * B);
  const rhs = C * C / (4 * A) + D * D / (4 * B) - E;
  const esHorizontal = A > 0 && B < 0;
  const aCuadrado = esHorizontal ? rhs / A : rhs / B;
  const bCuadrado = esHorizontal ? -rhs / B : -rhs / A;
  const a = Math.sqrt(Math.max(aCuadrado, 0));
  const b = Math.sqrt(Math.max(bCuadrado, 0));
  const c = Math.sqrt(Math.max(a * a + b * b, 0));
  const focos = construirPuntosSimetricos(esHorizontal, { h, k }, c);
  const vertices = construirPuntosSimetricos(esHorizontal, { h, k }, a);

  return {
    centro: { h, k },
    a,
    b,
    c,
    eje: esHorizontal ? 'horizontal' : 'vertical',
    focos,
    vertices,
    directrices: esHorizontal
      ? [`x = ${formatear(h - a * a / c)}`, `x = ${formatear(h + a * a / c)}`]
      : [`y = ${formatear(k - a * a / c)}`, `y = ${formatear(k + a * a / c)}`],
    ecuacion: esHorizontal
      ? `((x - ${formatear(h)})² / ${formatear(a * a)}) - ((y - ${formatear(k)})² / ${formatear(b * b)}) = 1`
      : `((y - ${formatear(k)})² / ${formatear(a * a)}) - ((x - ${formatear(h)})² / ${formatear(b * b)}) = 1`
  };
}

function completarParabola(coeficientes: CoeficientesConica): FormaCanonica {
  const { A, B, C, D, E } = coeficientes;

  if (esCero(A)) {
    const k = -D / (2 * B);
    const p = -C / (4 * B);
    const h = (B * k * k - E) / C;

    return {
      centro: { h, k },
      p,
      eje: 'horizontal',
      focos: [{ x: h + p, y: k }],
      vertices: [{ x: h, y: k }],
      directriz: `x = ${formatear(h - p)}`,
      ecuacion: `(y - ${formatear(k)})² = ${formatear(4 * p)}(x - ${formatear(h)})`
    };
  }

  const h = -C / (2 * A);
  const p = -D / (4 * A);
  const k = (A * h * h - E) / D;

  return {
    centro: { h, k },
    p,
    eje: 'vertical',
    focos: [{ x: h, y: k + p }],
    vertices: [{ x: h, y: k }],
    directriz: `y = ${formatear(k - p)}`,
    ecuacion: `(x - ${formatear(h)})² = ${formatear(4 * p)}(y - ${formatear(k)})`
  };
}

export function clasificarConica(A: number, B: number, C: number, D: number, E: number): ConicaResult {
  let tipo: ConicaResult['tipo'] = 'ninguna';
  let razon = '';
  let formaCanonica: FormaCanonica = { centro: { h: 0, k: 0 } };
  const coeficientes: CoeficientesConica = { A, B, C, D, E };

  if (!esCero(A) && !esCero(B) && Math.abs(A - B) < EPSILON) {
    tipo = 'circunferencia';
    razon = `A = B = ${formatear(A)} y ambos ≠ 0 → Circunferencia`;
    formaCanonica = completarCircunferencia(coeficientes);
  } else if (!esCero(A) && !esCero(B) && A * B > 0 && Math.abs(A - B) >= EPSILON) {
    tipo = 'elipse';
    razon = `A y B tienen mismo signo, A ≠ B, ambos ≠ 0 → Elipse`;
    formaCanonica = completarElipse(coeficientes);
  } else if (!esCero(A) && !esCero(B) && A * B < 0) {
    tipo = 'hiperbola';
    razon = `A y B tienen signos opuestos → Hipérbola`;
    formaCanonica = completarHiperbola(coeficientes);
  } else if ((esCero(A) && !esCero(B)) || (!esCero(A) && esCero(B))) {
    tipo = 'parabola';
    razon = `Exactamente uno de A o B es 0 → Parábola`;
    formaCanonica = completarParabola(coeficientes);
  }

  const pasosGeneralACanonica = [
    `Ecuación de partida: ${construirPasoEcuacion(coeficientes)}`,
    'Identificar el tipo de cónica a partir de los coeficientes cuadráticos A y B.',
    'Completar el cuadrado para aislar centro, vértices, focos y directriz según corresponda.'
  ];

  const pasosCanonicaAGeneral = [
    'Sustituir la forma canónica con los parámetros geométricos obtenidos.',
    'Desarrollar los binomios al cuadrado.',
    'Reunir términos semejantes hasta recuperar la ecuación general.'
  ];

  return {
    tipo,
    razon,
    formaCanonica,
    pasosGeneralACanonica,
    pasosCanonicaAGeneral
  };
}
