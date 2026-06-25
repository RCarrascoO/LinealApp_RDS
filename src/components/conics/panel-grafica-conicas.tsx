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
  const [modoDefensa, setModoDefensa] = useState(true);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(z => Math.max(0.2, z - 0.2));
  const handleZoomOut = () => setZoom(z => Math.min(5, z + 0.2));
  const handleZoomReset = () => setZoom(1);

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-6 flex flex-col">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Visualización</p>
          <h2 className="text-xl font-bold text-foreground">Gráfica de la cónica</h2>
        </div>
        <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm cursor-pointer hover:bg-primary/10 transition-colors">
            <input 
              type="checkbox" 
              checked={modoDefensa}
              onChange={(e) => setModoDefensa(e.target.checked)}
              className="accent-primary"
            />
            <span className="font-medium text-primary">Modo Defensa</span>
          </label>
          <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
            <button onClick={handleZoomIn} className="rounded-full border border-border bg-muted px-2.5 py-1 hover:bg-muted-foreground/20 active:bg-muted-foreground/30 transition-colors cursor-pointer">+</button>
            <button onClick={handleZoomOut} className="rounded-full border border-border bg-muted px-2.5 py-1 hover:bg-muted-foreground/20 active:bg-muted-foreground/30 transition-colors cursor-pointer">−</button>
            <button onClick={handleZoomReset} className="rounded-full border border-border bg-muted px-2.5 py-1 hover:bg-muted-foreground/20 active:bg-muted-foreground/30 transition-colors cursor-pointer">↺</button>
          </div>
        </div>
      </div>

      {resultado ? (
        <>
          <div className="transition-opacity">
            <GraficaConica resultado={resultado} toggles={toggleStates} modoDefensa={modoDefensa} zoom={zoom} />
          </div>

          <div className="mt-6 flex flex-wrap gap-4 pt-2 border-t border-border/50">
            {graphToggles.map(toggle => (
              <label key={toggle.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                <input
                  type="checkbox"
                  checked={!!toggleStates[toggle.id]}
                  onChange={(e) => setToggleStates(prev => ({ ...prev, [toggle.id]: e.target.checked }))}
                  className="accent-primary"
                />
                <span className="text-muted-foreground font-medium">{toggle.label}</span>
              </label>
            ))}
          </div>
        </>
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-2xl border border-dashed border-border bg-muted text-center text-sm text-muted-foreground">
          Espera a validar un RUT para renderizar la gráfica.
        </div>
      )}
    </section>
  );
}