"use client";

import React from "react";
import { ConicaResult, CoeficientesConica } from "@/lib/clasificarConica";

interface Props {
  resultado: ConicaResult;
  coeficientes: CoeficientesConica;
}

function fmt(n?: number) {
  if (n === undefined) return "0";
  if (Number.isInteger(n)) return String(n);
  return String(Number(n).toFixed(3));
}

export function EquationForms({ resultado, coeficientes }: Props) {
  const { A, B, C, D, E } = coeficientes;

  const canonicalRaw =
    resultado.formaCanonica && Object.keys(resultado.formaCanonica).length > 0
      ? resultado.formaCanonica
      : null;

  const renderTerm = (coef: number, term: string, color: string, isFirst = false) => {
    if (coef === 0) return null;

    const numeric = fmt(Math.abs(coef));
    const sign = coef < 0 ? '−' : isFirst ? '' : '+';

    return (
      <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
        {sign && <span className="text-muted-foreground">{sign}</span>}
        <span className={`${color} font-semibold`}>{numeric}</span>
        {term ? <span className="ml-0.5">{term}</span> : null}
      </span>
    );
  };

  const renderGeneral = () => (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Forma general</p>
        <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">Coeficientes</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border bg-muted px-4 py-3">
        <div className="flex min-w-max items-center gap-4 font-mono text-lg text-foreground whitespace-nowrap">
          {renderTerm(A, 'x²', 'text-primary', true)}
          {renderTerm(B, 'y²', 'text-success')}
          {renderTerm(C, 'x', 'text-warning')}
          {renderTerm(D, 'y', 'text-destructive')}
          {renderTerm(E, '', 'text-muted-foreground')}
          <span className="pl-2 text-muted-foreground">= 0</span>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">Lectura directa de la ecuación general con cada coeficiente destacado para evitar ruido visual.</p>
    </div>
  );

  const renderCanonical = () => {
    if (canonicalRaw) {
      const { h, k, a, b, r, p } = canonicalRaw as any;
      return (
        <div className="rounded-2xl border border-border bg-muted p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Forma canónica</p>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">Parámetros</span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 rounded-xl border border-border bg-card px-4 py-3">
              <div className="font-mono text-lg leading-8 text-foreground">
                {r !== undefined && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>(x -</span>
                    <span className="font-semibold text-warning">{fmt(h)}</span>
                    <span>)² + (y -</span>
                    <span className="font-semibold text-warning">{fmt(k)}</span>
                    <span>)² =</span>
                    <span className="font-semibold text-destructive">{fmt(r)}²</span>
                  </div>
                )}

                {(a !== undefined || b !== undefined) && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>(x -</span>
                    <span className="font-semibold text-warning">{fmt(h)}</span>
                    <span>)² /</span>
                    <span className="font-semibold text-destructive">{fmt(a)}²</span>
                    <span>+ (y -</span>
                    <span className="font-semibold text-warning">{fmt(k)}</span>
                    <span>)² /</span>
                    <span className="font-semibold text-success">{fmt(b)}²</span>
                    <span>= 1</span>
                  </div>
                )}

                {p !== undefined && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>(x -</span>
                    <span className="font-semibold text-warning">{fmt(h)}</span>
                    <span>)² =</span>
                    <span className="font-semibold text-destructive">{fmt(4 * p)}</span>
                    <span>(y -</span>
                    <span className="font-semibold text-warning">{fmt(k)}</span>
                    <span>)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-[180px] rounded-xl border border-border bg-card px-4 py-3 text-sm leading-6 text-muted-foreground lg:max-w-xs">
              <p className="font-semibold text-foreground">Lectura rápida</p>
              <p>
                Centro <span className="font-medium text-foreground">({fmt(h)}, {fmt(k)})</span>, con parámetros principales resaltados para no perder la estructura.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-border bg-muted p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Forma canónica</p>
          <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">Plantilla</span>
        </div>
        <div className="rounded-xl border border-border bg-card px-4 py-3 font-mono text-lg leading-8 text-foreground">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>(x -</span>
            <span className="font-semibold text-warning">h</span>
            <span>)² /</span>
            <span className="font-semibold text-destructive">a²</span>
            <span>+ (y -</span>
            <span className="font-semibold text-warning">k</span>
            <span>)² /</span>
            <span className="font-semibold text-success">b²</span>
            <span>= 1</span>
          </div>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Estructura canónica centrada, compacta y fácil de leer.</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {renderGeneral()}
        {renderCanonical()}
      </div>
    </div>
  );
}
