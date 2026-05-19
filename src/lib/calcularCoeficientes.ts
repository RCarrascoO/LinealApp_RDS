import { CoeficientesConica } from './clasificarConica';

export type ResultadoCoeficientes = {
  coeficientes: CoeficientesConica;
  pasos: string[];
};

function sumaDigitos(digitos: number[]): number {
  return digitos.reduce((total, digito) => total + digito, 0);
}

function baseCentro(digitos: number[]): { h: number; k: number } {
  const h = ((digitos[0] ?? 0) * 10 + (digitos[1] ?? 0)) % 7 - 3;
  const k = ((digitos[2] ?? 0) * 10 + (digitos[3] ?? 0)) % 7 - 3;

  return { h, k };
}

export function calcularCoeficientes(digitos: number[], v: number): ResultadoCoeficientes {
  const suma = sumaDigitos(digitos);
  const { h, k } = baseCentro(digitos);
  const variante = Math.abs(v) % 4;
  const pasos: string[] = [];

  pasos.push(`Dígitos del RUT recibidos: [${digitos.join(', ')}]`);
  pasos.push(`Valor auxiliar v: ${v}`);
  pasos.push(`Centro de trabajo derivado del RUT: (${h}, ${k})`);

  if (variante === 0) {
    const radio = 2 + (suma % 4);
    const factor = 1 / (radio * radio);
    const coeficientes = {
      A: factor,
      B: factor,
      C: -2 * factor * h,
      D: -2 * factor * k,
      E: factor * (h * h + k * k - radio * radio)
    };

    pasos.push(`Se genera una circunferencia de radio ${radio}.`);
    pasos.push('La ecuación canónica usada es (x - h)² + (y - k)² = r².');

    return { coeficientes, pasos };
  }

  if (variante === 1) {
    const ejeHorizontal = (suma + v) % 2 === 0;
    const semiejeMayor = 4 + (suma % 3);
    const semiejeMenor = 2 + (digitos[4] ?? 0) % 2;
    const denomX = ejeHorizontal ? semiejeMayor : semiejeMenor;
    const denomY = ejeHorizontal ? semiejeMenor : semiejeMayor;
    const A = 1 / (denomX * denomX);
    const B = 1 / (denomY * denomY);

    const coeficientes = {
      A,
      B,
      C: -2 * A * h,
      D: -2 * B * k,
      E: A * h * h + B * k * k - 1
    };

    pasos.push(`Se genera una elipse con eje ${ejeHorizontal ? 'horizontal' : 'vertical'}.`);
    pasos.push(`Semiejes de trabajo: ${denomX} y ${denomY}.`);
    pasos.push('La ecuación canónica usada es (x - h)²/a² + (y - k)²/b² = 1.');

    return { coeficientes, pasos };
  }

  if (variante === 2) {
    const ejeHorizontal = (suma + v) % 2 === 0;
    const a = 3 + (suma % 3);
    const b = 2 + (digitos[5] ?? 0) % 2;
    const A = ejeHorizontal ? 1 / (a * a) : -1 / (b * b);
    const B = ejeHorizontal ? -1 / (b * b) : 1 / (a * a);

    const coeficientes = {
      A,
      B,
      C: -2 * A * h,
      D: -2 * B * k,
      E: A * h * h + B * k * k - 1
    };

    pasos.push(`Se genera una hipérbola con eje ${ejeHorizontal ? 'horizontal' : 'vertical'}.`);
    pasos.push(`Parámetros de trabajo: a = ${a}, b = ${b}.`);
    pasos.push('La ecuación canónica usada es (x - h)²/a² - (y - k)²/b² = 1 o su versión vertical.');

    return { coeficientes, pasos };
  }

  const pBase = 1 + (suma % 3);
  const p = (digitos[7] ?? 0) % 2 === 0 ? pBase : -pBase;
  const esVertical = (v + suma) % 2 === 0;
  let coeficientes: CoeficientesConica;

  if (esVertical) {
    coeficientes = {
      A: 1,
      B: 0,
      C: -2 * h,
      D: -4 * p,
      E: h * h + 4 * p * k
    };
    pasos.push('Se genera una parábola vertical.');
    pasos.push(`Parámetro focal p = ${p}.`);
    pasos.push('La ecuación canónica usada es (x - h)² = 4p(y - k).');
  } else {
    coeficientes = {
      A: 0,
      B: 1,
      C: -4 * p,
      D: -2 * k,
      E: k * k + 4 * p * h
    };
    pasos.push('Se genera una parábola horizontal.');
    pasos.push(`Parámetro focal p = ${p}.`);
    pasos.push('La ecuación canónica usada es (y - k)² = 4p(x - h).');
  }

  return { coeficientes, pasos };
}