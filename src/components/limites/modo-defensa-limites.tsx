import React from 'react';
import { PenSquare, ShieldCheck } from 'lucide-react';

export function ModoDefensaLimites() {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Modo Defensa de Límites</h3>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-success/20 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Formulario listo para exposición oral
        </span>
      </div>

      <p className="text-sm text-muted-foreground">
        Completa los datos clave para explicar el análisis del límite con claridad durante la defensa.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4">
          <span className="text-sm font-medium text-foreground">Límite izquierdo</span>
          <input
            type="text"
            defaultValue="4"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Límite izquierdo"
          />
        </label>

        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4">
          <span className="text-sm font-medium text-foreground">Límite derecho</span>
          <input
            type="text"
            defaultValue="7"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Límite derecho"
          />
        </label>

        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4 lg:col-span-2">
          <span className="text-sm font-medium text-foreground">¿Existe el límite?</span>
          <select
            defaultValue="no"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="¿Existe el límite?"
          >
            <option value="si">Sí, existe</option>
            <option value="no">No existe</option>
            <option value="parcial">Aún requiere verificación</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4 lg:col-span-2">
          <span className="text-sm font-medium text-foreground">Tipo de discontinuidad</span>
          <select
            defaultValue="salto"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Tipo de discontinuidad"
          >
            <option value="removible">Evitable / removible</option>
            <option value="salto">De salto</option>
            <option value="infinita">Infinita / asintótica</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4 lg:col-span-2">
          <span className="text-sm font-medium text-foreground">Justificación escrita</span>
          <textarea
            rows={4}
            defaultValue="Los límites laterales no coinciden, por lo que el límite general no existe y la función presenta una discontinuidad de salto en el punto analizado."
            className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Justificación escrita"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">Acción de defensa</p>
          <p className="text-xs text-muted-foreground">
            Usa este bloque como guion visual para explicar el resultado en voz alta.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <PenSquare className="h-4 w-4" />
          Preparar defensa
        </button>
      </div>
    </section>
  );
}