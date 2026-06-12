'use client';

import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLimitesContext } from './LimitesContext';

export function PanelAnalisisLimites() {
  const context = useLimitesContext();
  const resultado = context?.resultado;

  if (!resultado) {
    return (
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm items-center justify-center text-muted-foreground">
        Esperando datos...
      </section>
    );
  }

  const { a, limIzquierda, limDerecha, existeLimite, justificacion } = resultado;

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground">Análisis de Límites</h3>
      <p className="text-sm text-muted-foreground">
        Evaluación detallada de los límites laterales y la existencia del límite general.
      </p>

      <div className="mt-2 flex flex-col gap-4">
        {/* 1. Límite por izquierda */}
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Aproximación por izquierda</span>
            <div className="rounded border border-primary/30 bg-primary/10 px-2 py-1">
              <span className="font-mono text-sm font-semibold text-primary">L = {limIzquierda}</span>
            </div>
          </div>
          <div className="mt-1 font-mono text-sm text-muted-foreground">
            lim x→{a}⁻ f(x)
          </div>
        </div>

        {/* 2. Límite por derecha */}
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Aproximación por derecha</span>
            <div className="rounded border border-primary/30 bg-primary/10 px-2 py-1">
              <span className="font-mono text-sm font-semibold text-primary">L = {limDerecha}</span>
            </div>
          </div>
          <div className="mt-1 font-mono text-sm text-muted-foreground">
            lim x→{a}⁺ f(x)
          </div>
        </div>

        {/* 3. Existencia del límite */}
        {existeLimite ? (
          <div className="flex flex-col gap-2 rounded-lg border border-success/40 bg-success/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Existencia del límite</span>
              </div>
              <div className="rounded border border-success/30 bg-success/15 px-2 py-1 text-success">
                <span className="font-mono text-sm font-semibold">Existe</span>
              </div>
            </div>
            <div className="mt-1 font-mono text-sm text-success">
              lim x→{a} f(x) = {limIzquierda}
            </div>
            <p className="mt-2 text-xs text-success/90">
              El límite existe porque los límites laterales coinciden (L = {limIzquierda}).
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Existencia del límite</span>
              </div>
              <div className="rounded border border-destructive/30 bg-destructive/15 px-2 py-1 text-destructive">
                <span className="font-mono text-sm font-semibold">No existe</span>
              </div>
            </div>
            <div className="mt-1 font-mono text-sm text-destructive">
              lim x→{a} f(x)
            </div>
            <p className="mt-2 text-xs text-destructive/90">
              El límite no existe porque los límites laterales no coinciden ({limIzquierda} ≠ {limDerecha}).
            </p>
          </div>
        )}

        {/* 4. Conclusión de continuidad */}
        <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-4">
          <div className="flex items-center gap-2 text-foreground">
            <span className="text-sm font-medium">Conclusión de continuidad</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {justificacion}
          </p>
        </div>
      </div>
    </section>
  );
}
