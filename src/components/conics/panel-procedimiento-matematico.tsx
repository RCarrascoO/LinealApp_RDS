'use client';

import { useMemo, useState } from 'react';
import { CoeficientesConica, ConicaResult } from '@/lib/clasificarConica';

interface Props {
  pasosCoeficientes?: string[];
  coeficientes?: CoeficientesConica | null;
  resultado?: ConicaResult | null;
}

function formatNumber(value: number | undefined, digits = 4) {
  if (value === undefined || Number.isNaN(value)) {
    return 'n/d';
  }

  const rounded = Number(value.toFixed(digits));
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function extractStep(pasos: string[], prefix: string, fallback: string) {
  return pasos.find((paso) => paso.startsWith(prefix)) ?? fallback;
}

function parseRutFromStep(rawStep: string) {
  const value = rawStep.replace('RUT normalizado:', '').trim();
  return value || 'n/d';
}

function parseDigitsFromStep(rawStep: string) {
  const match = rawStep.match(/\[(.*?)\]/);

  if (!match) {
    return [] as number[];
  }

  return match[1]
    .split(',')
    .map((chunk) => Number(chunk.trim()))
    .filter((value) => Number.isFinite(value));
}

function parseVerifierFromStep(rawStep: string) {
  const match = rawStep.match(/Dígito verificador:\s*([^\s]+)\s*→\s*v\s*=\s*(\d+)/i);

  if (!match) {
    return { dv: 'n/d', v: 'n/d' };
  }

  return { dv: match[1], v: match[2] };
}

type FormulaBlock = {
  label: string;
  formula: string;
  highlight?: boolean;
};

type StepConfig = {
  title: string;
  badge: string;
  blocks: FormulaBlock[];
};

export function PanelProcedimientoMatematico({ pasosCoeficientes = [], coeficientes, resultado }: Props) {
  const pasoExtraccion = extractStep(
    pasosCoeficientes,
    'RUT normalizado:',
    'RUT normalizado: n/d'
  );
  const pasoDigitos = extractStep(
    pasosCoeficientes,
    'Dígitos extraídos:',
    'Dígitos extraídos: n/d'
  );
  const pasoDv = extractStep(
    pasosCoeficientes,
    'Dígito verificador:',
    'Dígito verificador: n/d'
  );

  const rutNormalizado = parseRutFromStep(pasoExtraccion);
  const digitos = parseDigitsFromStep(pasoDigitos);
  const dvInfo = parseVerifierFromStep(pasoDv);

  const d1 = digitos[0];
  const d2 = digitos[1];
  const d3 = digitos[2];
  const d4 = digitos[3];
  const d5 = digitos[4];
  const d6 = digitos[5];
  const d7 = digitos[6];
  const d8 = digitos[7];

  const [openSteps, setOpenSteps] = useState<number[]>([0, 1, 2, 3, 4, 5]);

  const discriminante = useMemo(() => {
    if (!coeficientes) {
      return null;
    }

    const valor = -4 * coeficientes.A * coeficientes.B;
    return {
      formula: `Δ = 0² - 4(${formatNumber(coeficientes.A)})(${formatNumber(coeficientes.B)})`,
      value: valor
    };
  }, [coeficientes]);

  const desarrolloX = useMemo(() => {
    if (!coeficientes || coeficientes.A === 0) {
      return null;
    }

    const { A, C } = coeficientes;
    const p = C / A;
    const q = p / 2;
    const q2 = q * q;
    const ajusteConstante = A * q2;

    return {
      original: `${formatNumber(A)}x² ${C < 0 ? '-' : '+'} ${formatNumber(Math.abs(C))}x`,
      factorizado: `${formatNumber(A)}(x² ${p < 0 ? '-' : '+'} ${formatNumber(Math.abs(p))}x)`,
      completado: `${formatNumber(A)}(x² ${p < 0 ? '-' : '+'} ${formatNumber(Math.abs(p))}x + ${formatNumber(q2)} - ${formatNumber(q2)})`,
      cuadradoPerfecto: `${formatNumber(A)}((x ${q < 0 ? '-' : '+'} ${formatNumber(Math.abs(q))})² - ${formatNumber(q2)})`,
      constanteAjuste: ajusteConstante
    };
  }, [coeficientes]);

  const desarrolloY = useMemo(() => {
    if (!coeficientes || coeficientes.B === 0) {
      return null;
    }

    const { B, D } = coeficientes;
    const p = D / B;
    const q = p / 2;
    const q2 = q * q;
    const ajusteConstante = B * q2;

    return {
      original: `${formatNumber(B)}y² ${D < 0 ? '-' : '+'} ${formatNumber(Math.abs(D))}y`,
      factorizado: `${formatNumber(B)}(y² ${p < 0 ? '-' : '+'} ${formatNumber(Math.abs(p))}y)`,
      completado: `${formatNumber(B)}(y² ${p < 0 ? '-' : '+'} ${formatNumber(Math.abs(p))}y + ${formatNumber(q2)} - ${formatNumber(q2)})`,
      cuadradoPerfecto: `${formatNumber(B)}((y ${q < 0 ? '-' : '+'} ${formatNumber(Math.abs(q))})² - ${formatNumber(q2)})`,
      constanteAjuste: ajusteConstante
    };
  }, [coeficientes]);

  const derivacionCanonica = useMemo(() => {
    if (!coeficientes || !desarrolloX || !desarrolloY) {
      return null;
    }

    const { A, B, C, D, E } = coeficientes;
    const h = C / (2 * A);
    const k = D / (2 * B);
    const rhs = desarrolloX.constanteAjuste + desarrolloY.constanteAjuste - E;
    const denomX = rhs / A;
    const denomY = rhs / B;

    return {
      combinacion: `${formatNumber(A)}(x ${h < 0 ? '-' : '+'} ${formatNumber(Math.abs(h))})² + ${formatNumber(B)}(y ${k < 0 ? '-' : '+'} ${formatNumber(Math.abs(k))})² = ${formatNumber(rhs)}`,
      normalizada: rhs !== 0
        ? `(x ${h < 0 ? '-' : '+'} ${formatNumber(Math.abs(h))})²/${formatNumber(denomX)} + (y ${k < 0 ? '-' : '+'} ${formatNumber(Math.abs(k))})²/${formatNumber(denomY)} = 1`
        : 'No es posible normalizar a 1 porque el lado derecho es 0.',
      canonica: rhs !== 0
        ? `(x ${h < 0 ? '-' : '+'} ${formatNumber(Math.abs(h))})²/${formatNumber(Math.abs(denomX))} ${denomY < 0 ? '-' : '+'} (y ${k < 0 ? '-' : '+'} ${formatNumber(Math.abs(k))})²/${formatNumber(Math.abs(denomY))} = 1`
        : 'Forma canónica degenerada (sin normalización).'
    };
  }, [coeficientes, desarrolloX, desarrolloY]);

  const verificacionInversa = useMemo(() => {
    if (!coeficientes || !derivacionCanonica || !desarrolloX || !desarrolloY) {
      return null;
    }

    const { A, B, C, D, E } = coeficientes;
    const lhs = `${formatNumber(A)}x² ${C < 0 ? '-' : '+'} ${formatNumber(Math.abs(C))}x ${B >= 0 ? '+' : '-'} ${formatNumber(Math.abs(B))}y² ${D < 0 ? '-' : '+'} ${formatNumber(Math.abs(D))}y ${E < 0 ? '-' : '+'} ${formatNumber(Math.abs(E))}`;

    return {
      desdeCanonica: derivacionCanonica.canonica,
      expandirX: desarrolloX.original,
      expandirY: desarrolloY.original,
      recombinada: `${lhs} = 0`
    };
  }, [coeficientes, derivacionCanonica, desarrolloX, desarrolloY]);

  const pasos: StepConfig[] = [
    {
      title: 'Paso 1: Extracción de coeficientes',
      badge: 'RUT → Coeficientes',
      blocks: [
        { label: 'Mapeo de dígitos', formula: `d1=${d1 ?? 'n/d'}, d2=${d2 ?? 'n/d'}, d3=${d3 ?? 'n/d'}, d4=${d4 ?? 'n/d'}, d5=${d5 ?? 'n/d'}, d6=${d6 ?? 'n/d'}, d7=${d7 ?? 'n/d'}, d8=${d8 ?? 'n/d'}, DV=${dvInfo.dv}` },
        { label: 'RUT normalizado', formula: rutNormalizado },
        { label: 'Coeficiente A', formula: coeficientes ? `A = ${formatNumber(coeficientes.A)}` : 'A = n/d' },
        { label: 'Coeficiente B', formula: coeficientes ? `B = ${formatNumber(coeficientes.B)}` : 'B = n/d' },
        { label: 'Coeficiente C', formula: coeficientes ? `C = ${formatNumber(coeficientes.C)}` : 'C = n/d' },
        { label: 'Coeficiente D', formula: coeficientes ? `D = ${formatNumber(coeficientes.D)}` : 'D = n/d' },
        { label: 'Coeficiente E', formula: coeficientes ? `E = ${formatNumber(coeficientes.E)}` : 'E = n/d' },
        { label: 'Conversión de DV', formula: `v = ${dvInfo.v}` }
      ]
    },
    {
      title: 'Paso 2: Clasificación de la cónica',
      badge: 'Discriminante',
      blocks: [
        { label: 'Fórmula de discriminante', formula: 'Δ = Bxy^2 - 4AC, con Bxy = 0 en este modelo.' },
        { label: 'Sustitución sin término xy', formula: discriminante ? `${discriminante.formula} = ${formatNumber(discriminante.value)}` : 'Δ = n/d' },
        { label: 'Regla de clasificación', formula: coeficientes ? `A = ${formatNumber(coeficientes.A)}, B = ${formatNumber(coeficientes.B)} → ${resultado?.razon ?? 'sin clasificación'}` : 'Esperando coeficientes.' },
        { label: 'Resultado', formula: resultado ? `La sección cónica es ${resultado.tipo.toUpperCase()}` : 'Aún no se puede determinar.', highlight: true }
      ]
    },
    {
      title: 'Paso 3: Completar el cuadrado (términos en x)',
      badge: 'Transformación',
      blocks: desarrolloX
        ? [
            { label: 'Términos originales en x', formula: desarrolloX.original },
            { label: 'Factorizar coeficiente', formula: desarrolloX.factorizado },
            { label: 'Completar cuadrado', formula: desarrolloX.completado },
            { label: 'Cuadrado perfecto', formula: desarrolloX.cuadradoPerfecto }
          ]
        : [
            { label: 'Términos originales en x', formula: 'No aplica: A = 0 (caso parabólico o degenerado).' }
          ]
    },
    {
      title: 'Paso 4: Completar el cuadrado (términos en y)',
      badge: 'Transformación',
      blocks: desarrolloY
        ? [
            { label: 'Términos originales en y', formula: desarrolloY.original },
            { label: 'Factorizar coeficiente', formula: desarrolloY.factorizado },
            { label: 'Completar cuadrado', formula: desarrolloY.completado },
            { label: 'Cuadrado perfecto', formula: desarrolloY.cuadradoPerfecto }
          ]
        : [
            { label: 'Términos originales en y', formula: 'No aplica: B = 0 (caso parabólico o degenerado).' }
          ]
    },
    {
      title: 'Paso 5: Derivación de la forma canónica',
      badge: 'Forma canónica',
      blocks: derivacionCanonica
        ? [
            { label: 'Combinar términos', formula: derivacionCanonica.combinacion },
            { label: 'Normalizar a 1', formula: derivacionCanonica.normalizada },
            { label: 'Forma canónica', formula: derivacionCanonica.canonica, highlight: true }
          ]
        : [
            { label: 'Estado', formula: 'Se requieren coeficientes cuadráticos en x e y para esta derivación.' }
          ]
    },
    {
      title: 'Paso 6: Verificación inversa de la transformación',
      badge: 'Verificación',
      blocks: verificacionInversa
        ? [
            { label: 'Desde la canónica', formula: verificacionInversa.desdeCanonica },
            { label: 'Expandir bloque en x', formula: verificacionInversa.expandirX },
            { label: 'Expandir bloque en y', formula: verificacionInversa.expandirY },
            { label: 'Combinación final', formula: verificacionInversa.recombinada, highlight: true }
          ]
        : [
            { label: 'Estado', formula: 'No hay forma canónica suficiente para verificar en reversa.' }
          ]
    }
  ];

  const toggleStep = (index: number) => {
    setOpenSteps((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  const expandAll = () => setOpenSteps([0, 1, 2, 3, 4, 5]);
  const collapseAll = () => setOpenSteps([]);

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">PROCEDIMIENTO MATEMÁTICO</p>
          <h2 className="text-xl font-bold text-foreground">Derivación paso a paso</h2>
          <p className="mt-1 text-sm text-muted-foreground">Pasos matemáticos detallados para transformar y verificar la cónica.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={expandAll}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
          >
            Expandir todo
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted"
          >
            Contraer todo
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {pasos.map((paso, idx) => {
          const isOpen = openSteps.includes(idx);

          return (
            <article
              key={paso.title}
              className={`overflow-hidden rounded-2xl border transition-all ${isOpen ? 'border-primary/35 bg-muted/60 shadow-[0_12px_28px_rgba(2,132,199,0.15)]' : 'border-border bg-muted/35'}`}
            >
              <button
                type="button"
                onClick={() => toggleStep(idx)}
                aria-expanded={isOpen}
                className="flex w-full items-start justify-between gap-4 p-4 text-left"
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${isOpen ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'}`}>
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{paso.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-md bg-background px-2 py-1 text-xs font-semibold text-foreground">
                    {paso.badge}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {isOpen ? '⌃' : '⌄'}
                  </span>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border/70 px-4 pb-4 pt-3">
                  <div className="space-y-3">
                    {paso.blocks.map((bloque, bloqueIndex) => (
                      <div
                        key={`${paso.title}-${bloqueIndex}`}
                        className={`rounded-xl border p-3 ${bloque.highlight ? 'border-primary/50 bg-primary/10' : 'border-border/70 bg-background/40'}`}
                      >
                        <p className="mb-2 text-xs font-semibold text-muted-foreground">{bloque.label}</p>
                        <p className={`font-mono text-[1.06rem] ${bloque.highlight ? 'font-semibold text-primary' : 'text-foreground'}`}>
                          {bloque.formula}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}