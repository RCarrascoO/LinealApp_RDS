export type ConicaResult = {
  tipo: 'circunferencia' | 'elipse' | 'hiperbola' | 'parabola' | 'ninguna';
  razon: string;
  formaCanonica: any;
  pasosGeneralACanonica: string[];
  pasosCanonicaAGeneral: string[];
};

export type CoeficientesConica = {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F?: number;
};

export function clasificarTipoConica(A: number, B: number): ConicaResult['tipo'] {
  if (A === B && A !== 0) {
    return 'circunferencia';
  }

  if ((A === 0 && B !== 0) || (A !== 0 && B === 0)) {
    return 'parabola';
  }

  if (A !== 0 && B !== 0 && A * B > 0 && A !== B) {
    return 'elipse';
  }

  if (A * B < 0 && A !== B) {
    return 'hiperbola';
  }

  return 'ninguna';
}

export function clasificarConica(A: number, B: number, C: number, D: number, E: number): ConicaResult {
  let tipo: ConicaResult['tipo'] = clasificarTipoConica(A, B);
  let razon = '';

  if (tipo === 'circunferencia') {
    razon = `A = B = ${A} y ambos ≠ 0 → Circunferencia`;
  } else if (tipo === 'elipse') {
    razon = `A y B tienen el mismo signo, A ≠ B y ambos ≠ 0 → Elipse`;
  } else if (tipo === 'hiperbola') {
    razon = `A y B tienen signos opuestos → Hipérbola`;
  } else if (tipo === 'parabola') {
    razon = `Exactamente uno de A o B es 0 → Parábola`;
  } else {
    razon = `Los coeficientes finales no cumplen las reglas de clasificación solicitadas`;
  }

  const pasosGeneralACanonica = ['Paso 1: Agrupar términos', 'Paso 2: Completar cuadrados'];
  const pasosCanonicaAGeneral = ['Paso 1: Desarrollar binomios', 'Paso 2: Igualar a cero'];

  return {
    tipo,
    razon,
    formaCanonica: {}, 
    pasosGeneralACanonica,
    pasosCanonicaAGeneral
  };
}