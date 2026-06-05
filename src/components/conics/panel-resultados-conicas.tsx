'use client';

import { CamposDefensa } from '@/components/CamposDefensa';
import { EquationForms } from './equation-forms';
import { ConicaResult, CoeficientesConica } from '@/lib/clasificarConica';

interface Props {
  resultado: ConicaResult;
  coeficientes: CoeficientesConica;
  pasosCoeficientes: string[];
}

export function PanelResultadosConicas({ resultado, coeficientes }: Props) {
  return (
    <section className="space-y-6">
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