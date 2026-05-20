"use client";

import { useState } from 'react';
import { GraficaConica } from '@/components/GraficaConica';
import { ConicaResult } from '@/lib/clasificarConica';

interface Props {
  resultado: ConicaResult | null;
}

export function PanelGraficaConicas({ resultado }: Props) {
  const graphToggles = [
    { id: 'points', label: 'Puntos', defaultChecked: true },
    { id: 'asymptotes', label: 'Asíntotas', defaultChecked: false },
    { id: 'vertices', label: 'Vértices', defaultChecked: true },
    { id: 'foci', label: 'Focos', defaultChecked: true },
    { id: 'directrix', label: 'Directriz', defaultChecked: false }
  ];

  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>(Object.fromEntries(graphToggles.map(t => [t.id, t.defaultChecked])));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Visualización</p>
          <h2 className="text-xl font-bold text-slate-900">Gráfica de la cónica</h2>
        </div>
        <div className="flex gap-2 text-xs font-semibold text-slate-500">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">+</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">−</span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1">↺</span>
        </div>
      </div>

      {resultado ? (
        <>
          <GraficaConica resultado={resultado} toggles={toggleStates} />

          <div className="mt-4 flex flex-wrap gap-3">
            {graphToggles.map(toggle => (
              <label key={toggle.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!toggleStates[toggle.id]}
                  onChange={(e) => setToggleStates(prev => ({ ...prev, [toggle.id]: e.target.checked }))}
                />
                <span className="text-slate-600">{toggle.label}</span>
              </label>
            ))}
          </div>
        </>
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-center text-sm text-slate-500">
          Espera a validar un RUT para renderizar la gráfica.
        </div>
      )}
    </section>
  );
}