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

function formatearNumero(valor: number): string {
  const redondeado = Math.round(valor * 1000) / 1000;
  return Number.isInteger(redondeado)
    ? String(redondeado)
    : redondeado.toFixed(3).replace(/\.0+$/, '').replace(/0+$/, '').replace(/\.$/, '');
}

export function clasificarConica(A: number, B: number, C: number, D: number, E: number): ConicaResult {
  let tipo: ConicaResult['tipo'] = clasificarTipoConica(A, B);
  let razon = '';
  let formaCanonica: any = {};
  const pasosGeneralACanonica: string[] = [];
  const pasosCanonicaAGeneral: string[] = [];

  if (tipo === 'circunferencia') {
    razon = `A = B = ${A} y ambos ≠ 0 → Circunferencia`;
    const h = -C / (2 * A);
    const k = -D / (2 * A);
    const r2 = h * h + k * k - E / A;
    const r = Math.sqrt(Math.max(0, r2));

    formaCanonica = {
      centro: { h, k },
      radio: r,
      r: r
    };

    pasosGeneralACanonica.push(`1. Agrupar términos: ${A}(x² + ${formatearNumero(C/A)}x) + ${A}(y² + ${formatearNumero(D/A)}y) = ${formatearNumero(-E)}`);
    pasosGeneralACanonica.push(`2. Completar cuadrados en x e y sumando ${formatearNumero(h*h)} y ${formatearNumero(k*k)} dentro de los paréntesis correspondientes.`);
    pasosGeneralACanonica.push(`3. Simplificar la ecuación dividiendo por ${A}: (x - ${formatearNumero(h)})² + (y - ${formatearNumero(k)})² = ${formatearNumero(r2)}`);
    pasosGeneralACanonica.push(`4. Forma canónica final: (x - ${formatearNumero(h)})² + (y - ${formatearNumero(k)})² = ${formatearNumero(r)}²`);

    pasosCanonicaAGeneral.push(`1. Partir de la forma canónica: (x - ${formatearNumero(h)})² + (y - ${formatearNumero(k)})² = ${formatearNumero(r)}²`);
    pasosCanonicaAGeneral.push(`2. Desarrollar binomios: x² - ${formatearNumero(2*h)}x + ${formatearNumero(h*h)} + y² - ${formatearNumero(2*k)}y + ${formatearNumero(k*k)} = ${formatearNumero(r2)}`);
    pasosCanonicaAGeneral.push(`3. Igualar a cero reuniendo términos constantes: x² + y² - ${formatearNumero(2*h)}x - ${formatearNumero(2*k)}y + ${formatearNumero(h*h + k*k - r2)} = 0`);
    pasosCanonicaAGeneral.push(`4. Multiplicar por coeficiente general A (${A}): ${A}x² + ${A}y² + ${formatearNumero(C)}x + ${formatearNumero(D)}y + ${formatearNumero(E)} = 0`);

  } else if (tipo === 'elipse') {
    razon = `A y B tienen el mismo signo, A ≠ B y ambos ≠ 0 → Elipse`;
    const h = -C / (2 * A);
    const k = -D / (2 * B);
    const M = A * h * h + B * k * k - E;
    const a = Math.sqrt(Math.abs(M / A));
    const b = Math.sqrt(Math.abs(M / B));
    const esHorizontal = a > b;
    const c = Math.sqrt(Math.max(0, esHorizontal ? a * a - b * b : b * b - a * a));

    const focos = esHorizontal
      ? [{ x: h - c, y: k }, { x: h + c, y: k }]
      : [{ x: h, y: k - c }, { x: h, y: k + c }];

    const vertices = esHorizontal
      ? [{ x: h - a, y: k }, { x: h + a, y: k }]
      : [{ x: h, y: k - b }, { x: h, y: k + b }];

    const coVertices = esHorizontal
      ? [{ x: h, y: k - b }, { x: h, y: k + b }]
      : [{ x: h - a, y: k }, { x: h + a, y: k }];

    formaCanonica = {
      centro: { h, k },
      a,
      b,
      focos,
      vertices,
      coVertices,
      eje: esHorizontal ? 'horizontal' : 'vertical'
    };

    pasosGeneralACanonica.push(`1. Agrupar términos: ${A}(x² + ${formatearNumero(C/A)}x) + ${B}(y² + ${formatearNumero(D/B)}y) = ${formatearNumero(-E)}`);
    pasosGeneralACanonica.push(`2. Completar los cuadrados sumando ${formatearNumero(h*h)} y ${formatearNumero(k*k)} dentro de los paréntesis: ${A}(x - ${formatearNumero(h)})² + ${B}(y - ${formatearNumero(k)})² = ${formatearNumero(M)}`);
    pasosGeneralACanonica.push(`3. Dividir por ${formatearNumero(M)} para igualar a 1: (x - ${formatearNumero(h)})² / ${formatearNumero(a*a)} + (y - ${formatearNumero(k)})² / ${formatearNumero(b*b)} = 1`);
    pasosGeneralACanonica.push(`4. Forma canónica final: (x - ${formatearNumero(h)})² / ${formatearNumero(a)}² + (y - ${formatearNumero(k)})² / ${formatearNumero(b)}² = 1`);

    pasosCanonicaAGeneral.push(`1. Partir de la forma canónica: (x - ${formatearNumero(h)})² / ${formatearNumero(a)}² + (y - ${formatearNumero(k)})² / ${formatearNumero(b)}² = 1`);
    pasosCanonicaAGeneral.push(`2. Multiplicar por denominador común (${formatearNumero(a*a * b*b)}): ${formatearNumero(b*b)}(x - ${formatearNumero(h)})² + ${formatearNumero(a*a)}(y - ${formatearNumero(k)})² = ${formatearNumero(a*a * b*b)}`);
    pasosCanonicaAGeneral.push(`3. Expandir binomios y simplificar: ${formatearNumero(b*b)}x² + ${formatearNumero(a*a)}y² - ${formatearNumero(2*h*b*b)}x - ${formatearNumero(2*k*a*a)}y + ${formatearNumero(h*h*b*b + k*k*a*a - a*a*b*b)} = 0`);
    pasosCanonicaAGeneral.push(`4. Escalar coeficientes por factor de normalización para retornar a: ${A}x² + ${B}y² + ${formatearNumero(C)}x + ${formatearNumero(D)}y + ${formatearNumero(E)} = 0`);

  } else if (tipo === 'hiperbola') {
    razon = `A y B tienen signos opuestos → Hipérbola`;
    const h = -C / (2 * A);
    const k = -D / (2 * B);
    const M = A * h * h + B * k * k - E;
    const esHorizontal = M / A > 0;
    const a = esHorizontal ? Math.sqrt(Math.abs(M / A)) : Math.sqrt(Math.abs(M / B));
    const b = esHorizontal ? Math.sqrt(Math.abs(M / B)) : Math.sqrt(Math.abs(M / A));
    const c = Math.sqrt(a * a + b * b);

    const focos = esHorizontal
      ? [{ x: h - c, y: k }, { x: h + c, y: k }]
      : [{ x: h, y: k - c }, { x: h, y: k + c }];

    const vertices = esHorizontal
      ? [{ x: h - a, y: k }, { x: h + a, y: k }]
      : [{ x: h, y: k - a }, { x: h, y: k + a }];

    formaCanonica = {
      centro: { h, k },
      a,
      b,
      focos,
      vertices,
      eje: esHorizontal ? 'horizontal' : 'vertical'
    };

    if (esHorizontal) {
      pasosGeneralACanonica.push(`1. Agrupar términos: ${A}(x² + ${formatearNumero(C/A)}x) + (${B})(y² + ${formatearNumero(D/B)}y) = ${formatearNumero(-E)}`);
      pasosGeneralACanonica.push(`2. Completar los cuadrados: ${A}(x - ${formatearNumero(h)})² - ${formatearNumero(Math.abs(B))}(y - ${formatearNumero(k)})² = ${formatearNumero(M)}`);
      pasosGeneralACanonica.push(`3. Dividir por ${formatearNumero(M)} para obtener lado derecho igual a 1: (x - ${formatearNumero(h)})² / ${formatearNumero(a*a)} - (y - ${formatearNumero(k)})² / ${formatearNumero(b*b)} = 1`);
      pasosGeneralACanonica.push(`4. Forma canónica final (eje horizontal): (x - ${formatearNumero(h)})² / ${formatearNumero(a)}² - (y - ${formatearNumero(k)})² / ${formatearNumero(b)}² = 1`);
    } else {
      pasosGeneralACanonica.push(`1. Agrupar términos: (${A})(x² + ${formatearNumero(C/A)}x) + ${B}(y² + ${formatearNumero(D/B)}y) = ${formatearNumero(-E)}`);
      pasosGeneralACanonica.push(`2. Completar los cuadrados: -${formatearNumero(Math.abs(A))}(x - ${formatearNumero(h)})² + ${B}(y - ${formatearNumero(k)})² = ${formatearNumero(M)}`);
      pasosGeneralACanonica.push(`3. Dividir por ${formatearNumero(M)} para obtener lado derecho igual a 1: (y - ${formatearNumero(k)})² / ${formatearNumero(a*a)} - (x - ${formatearNumero(h)})² / ${formatearNumero(b*b)} = 1`);
      pasosGeneralACanonica.push(`4. Forma canónica final (eje vertical): (y - ${formatearNumero(k)})² / ${formatearNumero(a)}² - (x - ${formatearNumero(h)})² / ${formatearNumero(b)}² = 1`);
    }

    if (esHorizontal) {
      pasosCanonicaAGeneral.push(`1. Partir de la forma canónica: (x - ${formatearNumero(h)})² / ${formatearNumero(a)}² - (y - ${formatearNumero(k)})² / ${formatearNumero(b)}² = 1`);
      pasosCanonicaAGeneral.push(`2. Multiplicar por denominador común (${formatearNumero(a*a * b*b)}): ${formatearNumero(b*b)}(x - ${formatearNumero(h)})² - ${formatearNumero(a*a)}(y - ${formatearNumero(k)})² = ${formatearNumero(a*a * b*b)}`);
      pasosCanonicaAGeneral.push(`3. Expandir binomios y simplificar: ${formatearNumero(b*b)}x² - ${formatearNumero(a*a)}y² - ${formatearNumero(2*h*b*b)}x + ${formatearNumero(2*k*a*a)}y + ${formatearNumero(h*h*b*b - k*k*a*a - a*a*b*b)} = 0`);
      pasosCanonicaAGeneral.push(`4. Escalar coeficientes para coincidir con la general original: ${A}x² + ${B}y² + ${formatearNumero(C)}x + ${formatearNumero(D)}y + ${formatearNumero(E)} = 0`);
    } else {
      pasosCanonicaAGeneral.push(`1. Partir de la forma canónica: (y - ${formatearNumero(k)})² / ${formatearNumero(a)}² - (x - ${formatearNumero(h)})² / ${formatearNumero(b)}² = 1`);
      pasosCanonicaAGeneral.push(`2. Multiplicar por denominador común (${formatearNumero(a*a * b*b)}): ${formatearNumero(b*b)}(y - ${formatearNumero(k)})² - ${formatearNumero(a*a)}(x - ${formatearNumero(h)})² = ${formatearNumero(a*a * b*b)}`);
      pasosCanonicaAGeneral.push(`3. Expandir binomios y simplificar: -${formatearNumero(a*a)}x² + ${formatearNumero(b*b)}y² + ${formatearNumero(2*h*a*a)}x - ${formatearNumero(2*k*b*b)}y + ${formatearNumero(k*k*b*b - h*h*a*a - a*a*b*b)} = 0`);
      pasosCanonicaAGeneral.push(`4. Escalar coeficientes para coincidir con la general original: ${A}x² + ${B}y² + ${formatearNumero(C)}x + ${formatearNumero(D)}y + ${formatearNumero(E)} = 0`);
    }

  } else if (tipo === 'parabola') {
    razon = `Exactamente uno de A o B es 0 → Parábola`;
    if (A !== 0) {
      const h = -C / (2 * A);
      const p = D !== 0 ? -D / (4 * A) : 0;
      const k = D !== 0 ? (A * h * h - E) / D : 0;
      const directriz = `y = ${formatearNumero(k - p)}`;
      
      formaCanonica = {
        centro: { h, k },
        p,
        eje: 'vertical',
        vertices: [{ x: h, y: k }],
        focos: [{ x: h, y: k + p }],
        directriz
      };

      pasosGeneralACanonica.push(`1. Agrupar términos cuadráticos y lineales en x: ${A}(x² + ${formatearNumero(C/A)}x) = ${formatearNumero(-D)}y - ${formatearNumero(E)}`);
      pasosGeneralACanonica.push(`2. Completar el cuadrado en x: ${A}(x - ${formatearNumero(h)})² = ${formatearNumero(-D)}y - ${formatearNumero(E)} + ${formatearNumero(A*h*h)}`);
      pasosGeneralACanonica.push(`3. Simplificar factorizando el lado derecho: ${A}(x - ${formatearNumero(h)})² = ${formatearNumero(-D)}(y - ${formatearNumero(k)})`);
      pasosGeneralACanonica.push(`4. Forma canónica final (eje vertical): (x - ${formatearNumero(h)})² = 4 · (${formatearNumero(p)}) · (y - ${formatearNumero(k)})`);

      pasosCanonicaAGeneral.push(`1. Partir de la forma canónica: (x - ${formatearNumero(h)})² = 4 · (${formatearNumero(p)}) · (y - ${formatearNumero(k)})`);
      pasosCanonicaAGeneral.push(`2. Desarrollar el binomio a la izquierda y el producto a la derecha: x² - ${formatearNumero(2*h)}x + ${formatearNumero(h*h)} = ${formatearNumero(4*p)}y - ${formatearNumero(4*p*k)}`);
      pasosCanonicaAGeneral.push(`3. Igualar a cero pasando todo a la izquierda: x² - ${formatearNumero(2*h)}x - ${formatearNumero(4*p)}y + ${formatearNumero(h*h + 4*p*k)} = 0`);
      pasosCanonicaAGeneral.push(`4. Multiplicar por A (${A}): ${A}x² + ${formatearNumero(C)}x + ${formatearNumero(D)}y + ${formatearNumero(E)} = 0`);
    } else {
      const k = -D / (2 * B);
      const p = C !== 0 ? -C / (4 * B) : 0;
      const h = C !== 0 ? (B * k * k - E) / C : 0;
      const directriz = `x = ${formatearNumero(h - p)}`;

      formaCanonica = {
        centro: { h, k },
        p,
        eje: 'horizontal',
        vertices: [{ x: h, y: k }],
        focos: [{ x: h + p, y: k }],
        directriz
      };

      pasosGeneralACanonica.push(`1. Agrupar términos cuadráticos y lineales en y: ${B}(y² + ${formatearNumero(D/B)}y) = ${formatearNumero(-C)}x - ${formatearNumero(E)}`);
      pasosGeneralACanonica.push(`2. Completar el cuadrado en y: ${B}(y - ${formatearNumero(k)})² = ${formatearNumero(-C)}x - ${formatearNumero(E)} + ${formatearNumero(B*k*k)}`);
      pasosGeneralACanonica.push(`3. Simplificar factorizando el lado derecho: ${B}(y - ${formatearNumero(k)})² = ${formatearNumero(-C)}(x - ${formatearNumero(h)})`);
      pasosGeneralACanonica.push(`4. Forma canónica final (eje horizontal): (y - ${formatearNumero(k)})² = 4 · (${formatearNumero(p)}) · (x - ${formatearNumero(h)})`);

      pasosCanonicaAGeneral.push(`1. Partir de la forma canónica: (y - ${formatearNumero(k)})² = 4 · (${formatearNumero(p)}) · (x - ${formatearNumero(h)})`);
      pasosCanonicaAGeneral.push(`2. Desarrollar el binomio a la izquierda y el producto a la derecha: y² - ${formatearNumero(2*k)}y + ${formatearNumero(k*k)} = ${formatearNumero(4*p)}x - ${formatearNumero(4*p*h)}`);
      pasosCanonicaAGeneral.push(`3. Igualar a cero pasando todo a la izquierda: -${formatearNumero(4*p)}x + y² - ${formatearNumero(2*k)}y + ${formatearNumero(k*k + 4*p*h)} = 0`);
      pasosCanonicaAGeneral.push(`4. Multiplicar por B (${B}): ${formatearNumero(C)}x + ${B}y² + ${formatearNumero(D)}y + ${formatearNumero(E)} = 0`);
    }
  } else {
    razon = `Los coeficientes finales no cumplen las reglas de clasificación solicitadas`;
  }

  return {
    tipo,
    razon,
    formaCanonica,
    pasosGeneralACanonica,
    pasosCanonicaAGeneral
  };
}