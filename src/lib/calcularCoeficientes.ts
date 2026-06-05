import { CoeficientesConica, clasificarTipoConica } from './clasificarConica';

export type ResultadoCoeficientes = {
  coeficientes: CoeficientesConica;
  clasificacion: 'circunferencia' | 'elipse' | 'hiperbola' | 'parabola' | 'ninguna';
  dv: string;
  digitos: number[];
  rutNormalizado: string;
  v: number;
  pasos: string[];
};

function extraerRut(rut: string): { digitos: number[]; dv: string; rutNormalizado: string } {
  const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();

  if (rutLimpio.length < 2) {
    return {
      digitos: [0, 0, 0, 0, 0, 0, 0, 0],
      dv: '0',
      rutNormalizado: '00000000-0'
    };
  }

  const dv = rutLimpio.slice(-1);
  const cuerpo = rutLimpio.slice(0, -1).padStart(8, '0').slice(-8);
  const digitos = cuerpo.split('').map((digito) => Number(digito));

  return {
    digitos,
    dv,
    rutNormalizado: `${cuerpo}-${dv}`
  };
}

function calcularV(dv: string): number {
  if (dv === 'K' || dv === 'k') {
    return 10;
  }

  if (dv === '0') {
    return 11;
  }

  return Number(dv);
}

export function calcularCoeficientes(rut: string): ResultadoCoeficientes {
  const { digitos, dv, rutNormalizado } = extraerRut(rut);
  const v = calcularV(dv);
  const [d1, d2, d3, d4, d5, d6, d7, d8] = digitos;
  const pasos: string[] = [];

  pasos.push(`RUT normalizado: ${rutNormalizado}`);
  pasos.push(`Dígitos extraídos: [${digitos.join(', ')}]`);
  pasos.push(`Dígito verificador: ${dv} → v = ${v}`);

  const coeficientesBase: CoeficientesConica = {
    A: (d1 + d2) / v,
    B: (d3 + d4) / v,
    C: -(d5 + d6),
    D: -(d7 + d8),
    E: d1 + d3 + d5 + d7
  };

  let { A, B, C, D, E } = coeficientesBase;

  pasos.push(`Coeficientes base: A = (${d1} + ${d2}) / ${v} = ${A}, B = (${d3} + ${d4}) / ${v} = ${B}`);
  pasos.push(`C = -(${d5} + ${d6}) = ${C}, D = -(${d7} + ${d8}) = ${D}, E = ${d1} + ${d3} + ${d5} + ${d7} = ${E}`);

  if (d8 % 2 !== 0) {
    B = -B;
    pasos.push(`Regla 1: d8 = ${d8} es impar, entonces B = -B → ${B}`);
  } else {
    pasos.push(`Regla 1: d8 = ${d8} es par, B no cambia.`);
  }

  if (d1 === d2) {
    B = A;
    pasos.push(`Regla 2: d1 === d2, entonces B = A → ${B}`);
  } else {
    pasos.push(`Regla 2: d1 !== d2, B no cambia.`);
  }

  if ((d5 + d6) % 3 === 0) {
    pasos.push(`Regla 3: d5 + d6 = ${d5 + d6} es múltiplo de 3.`);

    if (d7 % 2 === 0) {
      B = 0;
      pasos.push(`Regla 3.1: d7 = ${d7} es par, entonces B = 0.`);
    } else {
      pasos.push(`Regla 3.1: d7 = ${d7} es impar, B no cambia.`);
    }

    if (d7 % 2 !== 0) {
      A = 0;
      pasos.push(`Regla 4: d7 = ${d7} es impar, entonces A = 0.`);
    } else {
      pasos.push(`Regla 4: d7 = ${d7} es par, A no cambia.`);
    }
  } else {
    pasos.push(`Regla 3: d5 + d6 = ${d5 + d6} no es múltiplo de 3, no se aplican las reglas anidadas.`);
  }

  const clasificacion = clasificarTipoConica(A, B);

  pasos.push(`Coeficientes finales: A = ${A}, B = ${B}, C = ${C}, D = ${D}, E = ${E}`);
  pasos.push(`Clasificación final: ${clasificacion}`);

  const coeficientes = { A, B, C, D, E };

  return {
    coeficientes,
    clasificacion,
    dv,
    digitos,
    rutNormalizado,
    v,
    pasos
  };
}