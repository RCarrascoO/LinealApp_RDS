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

export function clasificarConica(A: number, B: number, C: number, D: number, E: number): ConicaResult {
  let tipo: ConicaResult['tipo'] = 'ninguna';
  let razon = '';

  if (A === B && A !== 0) {
    tipo = 'circunferencia';
    razon = `A = B = ${A} y ambos ≠ 0 → Circunferencia`;
  } else if (A !== 0 && B !== 0 && A * B > 0 && A !== B) {
    tipo = 'elipse';
    razon = `A y B tienen mismo signo, A ≠ B, ambos ≠ 0 → Elipse`;
  } else if (A * B < 0) {
    tipo = 'hiperbola';
    razon = `A y B tienen signos opuestos → Hipérbola`;
  } else if ((A === 0 && B !== 0) || (A !== 0 && B === 0)) {
    tipo = 'parabola';
    razon = `Exactamente uno de A o B es 0 → Parábola`;
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