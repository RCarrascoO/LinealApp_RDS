import React from 'react';

type Coeficientes = { A: number; B: number; C: number; D: number; E: number };

interface Props {
  coeficientes: Coeficientes;
  pasosConstruccion: string[];
  tipoConica?: string;
}

export function EcuacionPanel({ coeficientes, pasosConstruccion, tipoConica }: Props) {
  const { A, B, C, D, E } = coeficientes;
  const badgeClases = {
    circunferencia: 'bg-emerald-100 text-emerald-800',
    elipse: 'bg-sky-100 text-sky-800',
    hiperbola: 'bg-amber-100 text-amber-800',
    parabola: 'bg-violet-100 text-violet-800',
    ninguna: 'bg-slate-100 text-slate-700'
  } as const;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-900">Ecuación General</h2>
      <div className="mb-4 rounded-xl bg-slate-950 px-4 py-3 font-mono text-sm text-slate-50 md:text-base">
        <span className={A === 0 ? 'text-red-300' : ''}>{A}x²</span> {' '}
        <span className={B === 0 ? 'text-sky-300' : ''}>{B >= 0 ? '+' : '-'} {Math.abs(B)}y²</span> {' '}
        <span>{C >= 0 ? '+' : '-'} {Math.abs(C)}x</span> {' '}
        <span>{D >= 0 ? '+' : '-'} {Math.abs(D)}y</span> {' '}
        <span>{E >= 0 ? '+' : '-'} {Math.abs(E)}</span> = 0
      </div>
      
      {tipoConica && (
        <div className="mb-4">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${badgeClases[tipoConica as keyof typeof badgeClases] ?? badgeClases.ninguna}`}>
            {tipoConica}
          </span>
        </div>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer font-semibold text-slate-700">Ver construcción paso a paso</summary>
        <ol className="mt-2 list-inside list-decimal rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          {pasosConstruccion.map((paso, idx) => (
            <li key={idx} className="mb-1">{paso}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
