'use client';

import { useState } from 'react';
import { PanelGraficaConicas } from './panel-grafica-conicas';
import { PanelEntradaConicas } from './panel-entrada-conicas';
import { PanelResultadosConicas } from './panel-resultados-conicas';
import { PanelProcedimientoMatematico } from './panel-procedimiento-matematico';
import { calcularCoeficientes } from '@/lib/calcularCoeficientes';
import { clasificarConica, CoeficientesConica, ConicaResult } from '@/lib/clasificarConica';

type EstadoFlujo = 'esperando' | 'calculando' | 'clasificando' | 'listo';

const demora = (milisegundos: number) => new Promise((resolver) => setTimeout(resolver, milisegundos));

export function PaginaConicas() {
  const [resultado, setResultado] = useState<ConicaResult | null>(null);
  const [coeficientes, setCoeficientes] = useState<CoeficientesConica | null>(null);
  const [pasosCoeficientes, setPasosCoeficientes] = useState<string[]>([]);
  const [estadoFlujo, setEstadoFlujo] = useState<EstadoFlujo>('esperando');

  const manejarValidated = async (digitos: number[], v: number) => {
    setEstadoFlujo('calculando');
    setResultado(null);
    setCoeficientes(null);
    setPasosCoeficientes([]);
    await demora(200);

    const generado = calcularCoeficientes(digitos, v);
    setCoeficientes(generado.coeficientes);
    setPasosCoeficientes(generado.pasos);

    setEstadoFlujo('clasificando');
    await demora(200);

    const analisis = clasificarConica(
      generado.coeficientes.A,
      generado.coeficientes.B,
      generado.coeficientes.C,
      generado.coeficientes.D,
      generado.coeficientes.E
    );

    setResultado(analisis);
    setEstadoFlujo('listo');
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.08),_transparent_35%),linear-gradient(180deg,_#f8fafc_0%,_#e2e8f0_100%)] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Cálculo I</p>
          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-5xl">
                Analizador de cónicas desde RUT
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Ingresa un RUT válido, construye la cónica a partir de sus dígitos, revisa la forma canónica, observa la gráfica y completa los campos de defensa oral.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-4 lg:min-w-[420px]">
              <EstadoChip activo={estadoFlujo === 'esperando'}>RUT</EstadoChip>
              <EstadoChip activo={estadoFlujo === 'calculando'}>Coeficientes</EstadoChip>
              <EstadoChip activo={estadoFlujo === 'clasificando'}>Clasificación</EstadoChip>
              <EstadoChip activo={estadoFlujo === 'listo'}>Análisis listo</EstadoChip>
            </div>
          </div>
        </header>

        <PanelEntradaConicas estadoFlujo={estadoFlujo} />

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            {resultado && coeficientes && (
              <PanelResultadosConicas
                resultado={resultado}
                coeficientes={coeficientes}
                pasosCoeficientes={pasosCoeficientes}
              />
            )}

            <PanelProcedimientoMatematico pasosCoeficientes={pasosCoeficientes} />
          </div>

          <PanelGraficaConicas resultado={resultado} />
        </div>

        {(estadoFlujo === 'calculando' || estadoFlujo === 'clasificando') && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 animate-pulse rounded-full bg-slate-900" />
              <p className="font-semibold text-slate-900">
                {estadoFlujo === 'calculando'
                  ? 'Calculando coeficientes desde el RUT...'
                  : 'Clasificando y reconstruyendo la forma canónica...'}
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className={`h-full rounded-full bg-slate-900 transition-all duration-300 ${estadoFlujo === 'calculando' ? 'w-1/2' : 'w-full'}`} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function EstadoChip({ children, activo }: { children: React.ReactNode; activo: boolean }) {
  return (
    <div
      className={`rounded-2xl border px-3 py-2 text-center text-sm font-medium transition-colors ${
        activo
          ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/20'
          : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}
    >
      {children}
    </div>
  );
}