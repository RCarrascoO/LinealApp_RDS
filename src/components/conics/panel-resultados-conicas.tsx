'use client';

import { CamposDefensa } from '@/components/CamposDefensa';
import { EquationForms } from './equation-forms';
import { ConicaResult, CoeficientesConica } from '@/lib/clasificarConica';

interface Props {
  resultado: ConicaResult;
  coeficientes: CoeficientesConica;
  pasosCoeficientes: string[];
  colisionReglas?: boolean;
  reglasDescartadas?: string[];
}

export function PanelResultadosConicas({ resultado, coeficientes, colisionReglas, reglasDescartadas }: Props) {
  const nombreDescartadas = reglasDescartadas && reglasDescartadas.length > 0
    ? reglasDescartadas.join(' y ')
    : 'otras cónicas';

  return (
    <section className="space-y-6">
      {colisionReglas && (
        <div className="rounded-xl border border-warning/50 bg-warning/10 p-5 text-warning-foreground shadow-sm">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-warning text-sm font-bold text-white shadow-sm">!</span>
            <p className="text-sm font-medium leading-relaxed">
              <strong>¡Atención!</strong> Este RUT cumple condiciones para múltiples cónicas simultáneamente. El sistema ha priorizado automáticamente <strong>{resultado.tipo}</strong> por sobre <strong>{nombreDescartadas}</strong> para mantener la consistencia matemática.
            </p>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Análisis</p>
            <h2 className="text-xl font-bold text-foreground">Ecuación General de la Cónica</h2>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {resultado.tipo}
          </span>
        </div>

        <div className="space-y-4">
          <EquationForms resultado={resultado} coeficientes={coeficientes} />
        </div>
      </div>

      <CamposDefensa resultado={resultado} coeficientes={coeficientes} />
    </section>
  );
}