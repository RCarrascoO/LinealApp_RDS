'use client';

import React from 'react';
import { useLimitesContext } from './LimitesContext';

function formatearTermino(coef: number, variable: string, isFirst: boolean = false): string {
  if (coef === 0) return '';
  const absCoef = Math.abs(coef);
  const sign = coef < 0 ? (isFirst ? '-' : ' - ') : (isFirst ? '' : ' + ');
  const numStr = absCoef === 1 && variable !== '' ? '' : absCoef.toString();
  return `${sign}${numStr}${variable}`;
}

export function TarjetaFuncionPorTramos() {
  const context = useLimitesContext();
  const resultado = context?.resultado;

  if (!resultado) {
    return (
      <div className="flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden p-6 items-center justify-center text-muted-foreground">
        Ingresa un RUT para visualizar la función.
      </div>
    );
  }

  const { a, coeficientes } = resultado;
  const { a1, a2, b1, m, n } = coeficientes;

  // Construir tramo 1: a1 x^2 + a2 x - b1 (Note that in TareasLimites.md it says - b1, so coefficient is + b1 but formula is - b1)
  // Wait, if it's - b1, then the sign logic should just treat the term as negative or we just use formatearTermino with -b1.
  // Let's use formatearTermino
  const tramo1 = `${formatearTermino(a1, 'x²', true)}${formatearTermino(a2, 'x')}${formatearTermino(-b1, '')}`.trim() || '0';
  
  // Construir tramo 2: m x + n
  const tramo2 = `${formatearTermino(m, 'x', true)}${formatearTermino(n, '')}`.trim() || '0';

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2 sm:pb-4">
        <h3 className="text-lg font-semibold leading-none tracking-tight">
          Función a analizar
        </h3>
        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary font-mono transition-colors">
          x = {a}
        </span>
      </div>

      {/* Mathematical Block */}
      <div className="p-4 sm:p-6 pt-0 flex justify-center w-full">
        <div className="flex items-center text-sm sm:text-base md:text-lg font-mono bg-muted/40 p-4 sm:p-6 rounded-lg w-full max-w-2xl justify-center overflow-x-auto border border-border/50">
          <div className="whitespace-nowrap mr-2 sm:mr-4 font-semibold">f(x) =</div>
          <div className="text-4xl sm:text-5xl md:text-6xl font-light leading-none mr-2 sm:mr-4 text-muted-foreground">
            {'{'}
          </div>
          <div className="flex flex-col gap-2 sm:gap-3 whitespace-nowrap">
            <div>
              {tramo1} <span className="text-muted-foreground ml-2 sm:ml-4">, si x &lt; {a}</span>
            </div>
            <div>
              {tramo2} <span className="text-muted-foreground ml-2 sm:ml-4">, si x ≥ {a}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="bg-muted/50 p-3 sm:p-4 border-t border-border px-4 sm:px-6 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Punto crítico en evaluación:</span>
        <span className="text-sm font-bold font-mono text-foreground">x = {a}</span>
      </div>
    </div>
  );
}
