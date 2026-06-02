import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function PanelAnalisisLimites() {
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">Análisis de Límites</h3>
      <p className="text-sm text-muted-foreground">
        Evaluación detallada de los límites laterales y la existencia del límite general.
      </p>

      <div className="mt-2 flex flex-col gap-4">
        {/* 1. Límite por izquierda */}
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Aproximación por izquierda</span>
            <div className="rounded border border-primary/20 bg-primary/10 px-2 py-1">
              <span className="font-mono text-sm font-semibold text-primary">L = 4</span>
            </div>
          </div>
          <div className="mt-1 font-mono text-sm text-muted-foreground">
            lim x→a⁻ f(x)
          </div>
        </div>

        {/* 2. Límite por derecha */}
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Aproximación por derecha</span>
            <div className="rounded border border-primary/20 bg-primary/10 px-2 py-1">
              <span className="font-mono text-sm font-semibold text-primary">L = 7</span>
            </div>
          </div>
          <div className="mt-1 font-mono text-sm text-muted-foreground">
            lim x→a⁺ f(x)
          </div>
        </div>

        {/* 3. Existencia del límite (No Existe) */}
        <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Existencia del límite</span>
            </div>
            <div className="rounded border border-destructive/20 bg-destructive/10 px-2 py-1 text-destructive">
              <span className="font-mono text-sm font-semibold">No existe</span>
            </div>
          </div>
          <div className="mt-1 font-mono text-sm text-destructive/80">
            lim x→a f(x)
          </div>
          <p className="mt-2 text-xs text-destructive/70">
            El límite no existe porque los límites laterales no coinciden (4 ≠ 7).
          </p>
        </div>

        {/* 4. Conclusión de continuidad */}
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-foreground">
            <span className="text-sm font-medium">Conclusión de continuidad</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            La función presenta una discontinuidad en el punto crítico evaluado, ya que el límite general no existe y, por tanto, no se cumple la condición de continuidad.
          </p>
        </div>
      </div>
    </section>
  );
}
