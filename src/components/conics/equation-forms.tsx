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
  const { A, B, C, D, E, F = 0 } = coeficientes;

  const canonicalRaw =
    resultado.formaCanonica && Object.keys(resultado.formaCanonica).length > 0
      ? resultado.formaCanonica
      : null;

  const terms = [
    { coef: A, term: 'x²', color: 'text-rose-600' },
    { coef: B, term: 'xy', color: 'text-purple-600' },
    { coef: C, term: 'y²', color: 'text-emerald-600' },
    { coef: D, term: 'x', color: 'text-amber-600' },
    { coef: E, term: 'y', color: 'text-sky-600' },
    { coef: F, term: '', color: 'text-slate-600' },
  ];

  const formatSigned = (value: number) => {
    if (value === 0) return '0';
    return value > 0 ? `+ ${fmt(value)}` : `- ${fmt(Math.abs(value))}`;
  };

  const renderTerm = (coef: number, term: string, color: string, last = false) => {
    if (coef === 0) return null;

    const sign = last ? '' : formatSigned(coef).startsWith('+') ? '+' : coef < 0 ? '−' : '';
    const numeric = fmt(Math.abs(coef));

    return (
      <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
        {!last && sign && <span className="text-muted-foreground">{sign}</span>}
        <span className={`${color} font-semibold`}>{numeric}</span>
        {term ? <span className="ml-0.5">{term}</span> : null}
      </span>
    );
  };

  const renderGeneral = () => (
    <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Forma general</p>
        <span className="rounded-full bg-rose-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-rose-600">Coeficientes</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border/70 bg-card/70 px-4 py-3">
        <div className="flex min-w-max items-center gap-4 font-mono text-lg text-foreground whitespace-nowrap">
          {renderTerm(A, 'x²', 'text-rose-600')}
          {renderTerm(B, 'xy', 'text-purple-600')}
          {renderTerm(C, 'y²', 'text-emerald-600')}
          {renderTerm(D, 'x', 'text-amber-600')}
          {renderTerm(E, 'y', 'text-sky-600')}
          {F !== 0 ? renderTerm(F, '', 'text-slate-600', true) : null}
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
        <div className="rounded-2xl border border-indigo-400/70 bg-indigo-500/10 p-5 shadow-sm dark:border-indigo-700 dark:bg-indigo-950/30">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">Forma canónica</p>
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Parámetros</span>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 rounded-xl border border-border/70 bg-card/70 px-4 py-3">
              <div className="font-mono text-lg leading-8 text-indigo-900 dark:text-indigo-100">
                {r !== undefined && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>(x -</span>
                    <span className="font-semibold text-amber-600">{fmt(h)}</span>
                    <span>)² + (y -</span>
                    <span className="font-semibold text-amber-600">{fmt(k)}</span>
                    <span>)² =</span>
                    <span className="font-semibold text-rose-600">{fmt(r)}²</span>
                  </div>
                )}

                {(a !== undefined || b !== undefined) && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>(x -</span>
                    <span className="font-semibold text-amber-600">{fmt(h)}</span>
                    <span>)² /</span>
                    <span className="font-semibold text-rose-600">{fmt(a)}²</span>
                    <span>+ (y -</span>
                    <span className="font-semibold text-amber-600">{fmt(k)}</span>
                    <span>)² /</span>
                    <span className="font-semibold text-emerald-600">{fmt(b)}²</span>
                    <span>= 1</span>
                  </div>
                )}

                {p !== undefined && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span>(x -</span>
                    <span className="font-semibold text-amber-600">{fmt(h)}</span>
                    <span>)² =</span>
                    <span className="font-semibold text-rose-600">{fmt(4 * p)}</span>
                    <span>(y -</span>
                    <span className="font-semibold text-amber-600">{fmt(k)}</span>
                    <span>)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="min-w-[180px] rounded-xl border border-indigo-500/20 bg-white/40 px-4 py-3 text-sm leading-6 text-muted-foreground dark:bg-black/10 lg:max-w-xs">
              <p className="font-semibold text-indigo-700 dark:text-indigo-300">Lectura rápida</p>
              <p>
                Centro <span className="font-medium text-foreground">({fmt(h)}, {fmt(k)})</span>, con parámetros principales resaltados para no perder la estructura.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-indigo-400/70 bg-indigo-500/10 p-5 shadow-sm dark:border-indigo-700 dark:bg-indigo-950/30">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-500 dark:text-indigo-300">Forma canónica</p>
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Plantilla</span>
        </div>
        <div className="rounded-xl border border-border/70 bg-card/70 px-4 py-3 font-mono text-lg leading-8 text-indigo-900 dark:text-indigo-100">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>(x -</span>
            <span className="font-semibold text-amber-600">h</span>
            <span>)² /</span>
            <span className="font-semibold text-rose-600">a²</span>
            <span>+ (y -</span>
            <span className="font-semibold text-amber-600">k</span>
            <span>)² /</span>
            <span className="font-semibold text-emerald-600">b²</span>
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
