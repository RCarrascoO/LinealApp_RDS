'use client';

import { CamposDefensa } from '@/components/CamposDefensa';
import { EcuacionPanel } from '@/components/EcuacionPanel';
import { TransformacionCanonica } from '@/components/TransformacionCanonica';
import { ConicaResult, CoeficientesConica } from '@/lib/clasificarConica';

interface Props {
  resultado: ConicaResult;
  coeficientes: CoeficientesConica;
  pasosCoeficientes: string[];
}

export function PanelResultadosConicas({ resultado, coeficientes, pasosCoeficientes }: Props) {
  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Análisis</p>
            <h2 className="text-xl font-bold text-slate-900">Ecuación y forma canónica</h2>
          </div>
          <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {resultado.tipo}
          </span>
        </div>

        <EcuacionPanel
          coeficientes={coeficientes}
          pasosConstruccion={pasosCoeficientes}
          tipoConica={resultado.tipo}
        />

        <div className="mt-5">
          <TransformacionCanonica resultado={resultado} />
        </div>
      </div>

      <CamposDefensa resultado={resultado} />
    </section>
  );
}