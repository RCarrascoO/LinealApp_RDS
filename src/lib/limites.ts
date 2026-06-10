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

  const limIzquierda = a1 * a * a + a2 * a - b1;
  const limDerecha = m * a + n;

  const existeLimite = limIzquierda === limDerecha;

  let tipoDiscontinuidad: 'continua' | 'removible' | 'salto' | 'infinita' = 'continua';
  
  if (
    !Number.isFinite(limIzquierda) || 
    !Number.isFinite(limDerecha) || 
    Number.isNaN(limIzquierda) || 
    Number.isNaN(limDerecha)
  ) {
    tipoDiscontinuidad = 'infinita';
  } else if (!existeLimite) {
    tipoDiscontinuidad = 'salto';
  } else {
    tipoDiscontinuidad = 'continua';
  }

  const f1 = (x: number) => a1 * x * x + a2 * x - b1;
  const f2 = (x: number) => m * x + n;

  const evidenciaIzquierda = [0.30, 0.10, 0.01].map(delta => {
    const x = a - delta;
    const fx = f1(x);
    return {
      x: x.toFixed(4),
      fx: fx.toFixed(4),
      observacion: `Se acerca por la izquierda`
    };
  });

  const evidenciaDerecha = [0.30, 0.10, 0.01].map(delta => {
    const x = a + delta;
    const fx = f2(x);
    return {
      x: x.toFixed(4),
      fx: fx.toFixed(4),
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
    justificacion
  };
}
