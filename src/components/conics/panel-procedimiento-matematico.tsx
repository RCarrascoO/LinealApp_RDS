'use client';

interface Props {
  pasosCoeficientes: string[];
}

export function PanelProcedimientoMatematico({ pasosCoeficientes }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Procedimiento</p>
        <h2 className="text-xl font-bold text-slate-900">Construcción matemática</h2>
        <p className="mt-1 text-sm text-slate-600">
          Desarrollo resumido de cómo se forman los coeficientes desde el RUT.
        </p>
      </div>

      <div className="space-y-3">
        {pasosCoeficientes.map((paso, index) => (
          <details key={index} className="group rounded-xl border border-slate-200 bg-slate-50 p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-800">
              Paso {index + 1}
            </summary>
            <p className="mt-2 text-sm leading-6 text-slate-600">{paso}</p>
          </details>
        ))}
      </div>
    </section>
  );
}