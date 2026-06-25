export type FormulaTramo =
  | { tipo: 'fraccion'; numerador: string; denominador: string }
  | { tipo: 'lineal'; expresion: string };

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
  formulaIzquierda: FormulaTramo;
  formulaDerecha: FormulaTramo;
};

export function calcularLimites(digitos: number[], v: number): ResultadoLimites {
  let a = v;
  if (v === 11) a = 2;
  else if (v === 10) a = 5;

  let a1 = digitos[0];
  if (a1 === 0) a1 = 1;
  const a2 = digitos[1];
  const b1 = digitos[2];
  let m = digitos[3];
  if (m === 0) m = 1; // Avoid trivial function
  const n = digitos[4];

  const d8 = digitos[7];
  const modulo3 = d8 % 3;

  let tipoDiscontinuidad: ResultadoLimites['tipoDiscontinuidad'] = 'continua';
  if (modulo3 === 0) {
    tipoDiscontinuidad = 'removible';
  } else if (modulo3 === 1) {
    tipoDiscontinuidad = 'salto';
  } else if (modulo3 === 2) {
    tipoDiscontinuidad = 'infinita';
  }

  let f1: (x: number) => number;
  let f2: (x: number) => number;
  let limIzquierda: number;
  let limDerecha: number;

  const formT = (coef: number, variable: string, isFirst: boolean = false) => {
    if (coef === 0) return '';
    const absCoef = Math.abs(coef);
    const sign = coef < 0 ? (isFirst ? '-' : ' - ') : (isFirst ? '' : ' + ');
    const numStr = absCoef === 1 && variable !== '' ? '' : absCoef.toString();
    return `${sign}${numStr}${variable}`;
  };

  let formulaIzquierda: FormulaTramo;
  let formulaDerecha: FormulaTramo;

  if (tipoDiscontinuidad === 'removible') {
    // f(x) = (x-a)(x+a1)/(x-a)
    f1 = (x: number) => x === a ? NaN : x + a1;
    f2 = f1;
    limIzquierda = a + a1;
    limDerecha = a + a1;

    const signoA = a < 0 ? `+ ${Math.abs(a)}` : `- ${a}`;
    const signoA1 = a1 < 0 ? `- ${Math.abs(a1)}` : `+ ${a1}`;
    const numStr = `(x ${signoA})(x ${signoA1})`;
    const denStr = `(x ${signoA})`;
    formulaIzquierda = { tipo: 'fraccion', numerador: numStr, denominador: denStr };
    formulaDerecha = formulaIzquierda;
  } else if (tipoDiscontinuidad === 'salto') {
    // Dos rectas: f1(x) = a1*x - b1, f2(x) = m*x + n
    f1 = (x: number) => a1 * x - b1;
    f2 = (x: number) => m * x + n;
    limIzquierda = a1 * a - b1;
    limDerecha = m * a + n;

    const expr1 = `${formT(a1, 'x', true)}${formT(-b1, '')}`.trim() || '0';
    const expr2 = `${formT(m, 'x', true)}${formT(n, '')}`.trim() || '0';
    formulaIzquierda = { tipo: 'lineal', expresion: expr1 };
    formulaDerecha = { tipo: 'lineal', expresion: expr2 };
  } else {
    // Infinita: f(x) = (n+1)/(x-a)
    const numerador = n + 1;
    f1 = (x: number) => numerador / (x - a);
    f2 = f1;
    limIzquierda = numerador > 0 ? -Infinity : Infinity;
    limDerecha = numerador > 0 ? Infinity : -Infinity;

    const signoA = a < 0 ? `+ ${Math.abs(a)}` : `- ${a}`;
    formulaIzquierda = { tipo: 'fraccion', numerador: String(numerador), denominador: `x ${signoA}` };
    formulaDerecha = formulaIzquierda;
  }

  const existeLimite = limIzquierda === limDerecha && Number.isFinite(limIzquierda);

  const evidenciaIzquierda = [0.30, 0.10, 0.01].map(delta => {
    const x = a - delta;
    const fx = f1(x);
    return {
      x: x.toFixed(4),
      fx: Number.isFinite(fx) ? fx.toFixed(4) : (fx > 0 ? '+∞' : '-∞'),
      observacion: `Se acerca por la izquierda`
    };
  });

  const evidenciaDerecha = [0.30, 0.10, 0.01].map(delta => {
    const x = a + delta;
    const fx = f2(x);
    return {
      x: x.toFixed(4),
      fx: Number.isFinite(fx) ? fx.toFixed(4) : (fx > 0 ? '+∞' : '-∞'),
      observacion: `Se acerca por la derecha`
    };
  });

  let justificacion = '';
  switch (tipoDiscontinuidad) {
    case 'continua':
      justificacion = 'La función es continua en este punto ya que ambos límites laterales son iguales y coinciden con el valor de la función.';
      break;
    case 'removible':
      justificacion = 'La discontinuidad es evitable/removible porque los límites laterales existen y son iguales, pero la función no está definida en el punto o tiene un valor distinto.';
      break;
    case 'salto':
      justificacion = 'La discontinuidad es de salto porque ambos límites laterales existen y son finitos, pero son diferentes entre sí.';
      break;
    case 'infinita':
      justificacion = 'La discontinuidad es infinita (o asintótica) porque al menos uno de los límites laterales tiende a infinito o no está definido de forma finita.';
      break;
  }

  return {
    a,
    coeficientes: { a1, a2, b1, m, n },
    limIzquierda,
    limDerecha,
    existeLimite,
    tipoDiscontinuidad,
    evidenciaIzquierda,
    evidenciaDerecha,
    justificacion,
    formulaIzquierda,
    formulaDerecha
  };
}
