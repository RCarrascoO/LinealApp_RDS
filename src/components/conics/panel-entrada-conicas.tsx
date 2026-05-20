'use client';

import { useState } from 'react';
import { Info, Calculator, IterationCcw, CheckCircle2 } from 'lucide-react';
import { EstadoFlujo } from './pagina-conicas';
import { ConicaResult, CoeficientesConica } from '@/lib/clasificarConica';

interface Props {
  estadoFlujo: EstadoFlujo;
  onAnalyze: (digitos: number[], v: number) => void;
  coeficientes: CoeficientesConica | null;
  resultado: ConicaResult | null;
  digitos: number[] | null;
}

export function PanelEntradaConicas({ estadoFlujo, onAnalyze, coeficientes, resultado, digitos }: Props) {
  const [rutInput, setRutInput] = useState('');
  
  const handleAnalyze = () => {
    // Simple mock extraction for the UI (real validation logic is expected in the real app)
    const normalized = rutInput.replace(/[^0-9kK]/g, '').toUpperCase();
    if (normalized.length === 9) {
      const nums = normalized.split('').slice(0, 8).map(n => parseInt(n, 10));
      const dvChar = normalized.charAt(8);
      const v = dvChar === 'K' ? 10 : parseInt(dvChar, 10);
      onAnalyze(nums, v);
    } else {
      // fallback for testing
      onAnalyze([1,2,3,4,5,6,7,8], 9);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* TAREA 2.2: Card Entrada de RUT */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">Ingreso de RUT</h2>
          <p className="mt-1 text-sm text-slate-600">Ingresa un número de RUT chileno para generar una sección cónica</p>
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 font-mono text-lg rounded-xl border border-slate-300 px-4 py-2 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="12.345.678-9"
            value={rutInput}
            onChange={(e) => setRutInput(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            className="rounded-xl bg-slate-900 px-6 py-2 font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Analizar
          </button>
        </div>
      </section>

      {/* TAREA 2.3: Card Dígitos Extraídos */}
      {digitos && digitos.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Dígitos extraídos</h2>
          <div className="flex flex-wrap gap-2 text-center">
            {digitos.slice(0, 8).map((d, i) => (
              <div key={i} className="flex-1 min-w-[3rem] px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500 font-medium mb-1">d{i+1}</div>
                <div className="font-mono text-lg font-bold text-slate-900">{d}</div>
              </div>
            ))}
            <div className="flex-1 min-w-[3rem] px-3 py-2 rounded-xl bg-indigo-50 border-2 border-indigo-200">
              <div className="text-xs text-indigo-500 font-medium mb-1">DV</div>
              <div className="font-mono text-lg font-bold text-indigo-700">{digitos[8]}</div>
            </div>
          </div>
        </section>
      )}

      {/* TAREA 2.4: Card Coeficientes de la Ecuación */}
      {coeficientes && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Coeficientes de la ecuación</h2>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              A𝑥² + Bxy + C𝑦² + D𝑥 + E𝑦 + F = 0
            </div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'A', desc: 'coef x²', val: coeficientes.A.toFixed(2) },
              { label: 'B', desc: 'coef xy', val: '0.00' },
              { label: 'C', desc: 'coef y²', val: coeficientes.B.toFixed(2) },
              { label: 'D', desc: 'coef x', val: coeficientes.C.toFixed(2) },
              { label: 'E', desc: 'coef y', val: coeficientes.D.toFixed(2) },
              { label: 'F', desc: 'constante', val: coeficientes.E.toFixed(2) },
            ].map((coef, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center transition-colors hover:border-slate-300">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{coef.desc}</div>
                <div className="font-bold text-slate-900 text-xl">{coef.label}</div>
                <div className="font-mono text-sm text-slate-600 mt-1">{coef.val}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAREA 2.5: Card Clasificación Cónica */}
      {resultado && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Clasificación de la cónica</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {['circunferencia', 'elipse', 'hipérbola', 'parábola'].map((type) => {
              const isActive = resultado.tipo === type.replace('ó', 'o').replace('á', 'a');
              
              return (
                <div 
                  key={type}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isActive 
                      ? 'border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-100' 
                      : 'border-slate-100 bg-white opacity-50 grayscale-[50%]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute -top-2.5 -right-2.5">
                      <span className="flex items-center gap-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Detectada
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-slate-900 capitalize text-center">{type}</h3>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-slate-50 text-sm text-slate-600 border border-slate-100">
            <strong>Razón:</strong> {resultado.razon}
          </div>
        </section>
      )}

    </div>
  );
}
