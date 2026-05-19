'use client';

import { RutForm } from '@/components/RutForm';

type EstadoFlujo = 'esperando' | 'calculando' | 'clasificando' | 'listo';

interface Props {
  estadoFlujo: EstadoFlujo;
  onValidated: (digitos: number[], v: number) => void | Promise<void>;
}

const etapas = [
  { id: 'esperando', label: 'RUT' },
  { id: 'calculando', label: 'Coeficientes' },
  { id: 'clasificando', label: 'Clasificación' },
  { id: 'listo', label: 'Análisis listo' }
] as const;

export function PanelEntradaConicas({ estadoFlujo, onValidated }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Entrada</p>
          <h2 className="text-xl font-bold text-slate-900">Validación y extracción desde RUT</h2>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          Flujo guiado
        'use client';

        type EstadoFlujo = 'esperando' | 'calculando' | 'clasificando' | 'listo';

        interface Props {
          estadoFlujo: EstadoFlujo;
        }

        const etapas = [
          { id: 'esperando', label: 'RUT' },
          { id: 'calculando', label: 'Coeficientes' },
          { id: 'clasificando', label: 'Clasificación' },
          { id: 'listo', label: 'Análisis listo' }
        ] as const;

        export function PanelEntradaConicas({ estadoFlujo }: Props) {
          return (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Entrada</p>
                  <h2 className="text-xl font-bold text-slate-900">Validación y extracción desde RUT</h2>
                </div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                  Flujo guiado
                </div>
              </div>

              <div className="mb-4 rounded-md border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                La entrada de RUT ahora se realiza en la página principal. Ve a la vista <strong>Validación RUT</strong> para introducir y validar tu RUT.
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                {etapas.map((etapa) => {
                  const activo = etapa.id === estadoFlujo;

                  return (
                    <div
                      key={etapa.id}
                      className={`rounded-xl border px-3 py-2 text-center text-xs font-semibold tracking-wide transition-colors ${
                        activo
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-500'
                      }`}>
                      {etapa.label}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }