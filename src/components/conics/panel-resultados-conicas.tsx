'use client';

import { CamposDefensa } from '@/components/CamposDefensa';
import { EcuacionPanel } from '@/components/EcuacionPanel';
import { TransformacionCanonica } from '@/components/TransformacionCanonica';
import { EquationForms } from './equation-forms';
import { ConicaResult, CoeficientesConica } from '@/lib/clasificarConica';

interface Props {
  resultado: ConicaResult;
  coeficientes: CoeficientesConica;
  pasosCoeficientes: string[];
}

export function PanelResultadosConicas({ resultado, coeficientes, pasosCoeficientes }: Props) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Análisis</p>
            <h2 className="text-xl font-bold text-foreground">Ecuación y forma canónica</h2>
          </div>
          <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
            {resultado.tipo}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <EquationForms resultado={resultado} coeficientes={coeficientes} />
          <div>
            <EcuacionPanel
              coeficientes={coeficientes}
              pasosConstruccion={pasosCoeficientes}
              tipoConica={resultado.tipo}
            />
          </div>
        </div>

        <div className="mt-5">
          <TransformacionCanonica resultado={resultado} />
        </div>
      </div>

      <CamposDefensa resultado={resultado} />
    </section>
  );
}