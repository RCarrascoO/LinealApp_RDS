'use client';

import React from 'react';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useLimitesContext } from './LimitesContext';

export function PanelTipoDiscontinuidad() {
  const context = useLimitesContext();
  const resultado = context?.resultado;

  if (!resultado) {
    return (
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm text-muted-foreground items-center justify-center">
        Esperando datos...
      </section>
    );
  }

  if (resultado.tipoDiscontinuidad === 'continua') {
    return (
      <section className="flex flex-col gap-4 rounded-xl border border-success/40 bg-success/10 p-6 shadow-sm">
        <div className="flex items-center gap-2 text-success">
          <CheckCircle2 className="h-6 w-6" />
          <h3 className="text-lg font-semibold">Función Continua — No hay discontinuidad</h3>
        </div>
        <p className="text-sm text-success/90">
          La función es continua en el punto crítico evaluado. Los límites laterales coinciden con el valor de la función.
        </p>
      </section>
    );
  }

  const opciones = [
    {
      id: 'removible',
      label: 'Discontinuidad Evitable (Removible)',
      desc: 'Los límites laterales son iguales, pero f(a) ≠ lím o no existe.',
      colorClass: 'text-success bg-success/10 border-success/20',
      activa: resultado.tipoDiscontinuidad === 'removible',
    },
    {
      id: 'salto',
      label: 'Discontinuidad de Salto',
      desc: 'Los límites laterales existen pero son diferentes entre sí.',
      colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      activa: resultado.tipoDiscontinuidad === 'salto',
    },
    {
      id: 'infinita',
      label: 'Discontinuidad Infinita (Asintótica)',
      desc: 'Al menos un límite lateral tiende a ±∞.',
      colorClass: 'text-destructive bg-destructive/10 border-destructive/20',
      activa: resultado.tipoDiscontinuidad === 'infinita',
    },
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
            className={`flex flex-col gap-1 rounded-lg border p-4 transition-colors ${
              opcion.activa
                ? 'border-primary/40 bg-primary/5'
                : 'border-border bg-muted/50 opacity-60'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-medium ${opcion.activa ? 'text-primary' : 'text-muted-foreground'}`}>
                {opcion.label}
              </span>
              {opcion.activa && (
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${opcion.colorClass}`}>
                  Detectada
                </span>
              )}
            </div>
            {opcion.activa && (
              <span className="text-xs text-muted-foreground mt-1">
                {opcion.desc}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
