import React from 'react';
import { ShieldAlert } from 'lucide-react';

export function PanelTipoDiscontinuidad() {
  const opciones = [
    { id: 'removible', label: 'Discontinuidad Evitable (Removible)', activa: false },
    { id: 'salto', label: 'Discontinuidad de Salto', activa: true },
    { id: 'infinita', label: 'Discontinuidad Infinita (Asintótica)', activa: false },
  ];

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">Tipo de Discontinuidad</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Clasificación del comportamiento de la función en el punto crítico evaluado.
      </p>

      <div className="mt-2 flex flex-col gap-3">
        {opciones.map((opcion) => (
          <div
            key={opcion.id}
            className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
              opcion.activa
                ? 'border-primary/40 bg-primary/10'
                : 'border-border bg-muted text-muted-foreground'
            }`}
          >
            <span className={`font-medium ${opcion.activa ? 'text-primary' : 'text-muted-foreground'}`}>
              {opcion.label}
            </span>
            {opcion.activa && (
              <span className="rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                Detectada
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
