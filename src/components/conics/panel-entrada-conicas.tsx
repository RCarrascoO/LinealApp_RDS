'use client';

import { useState } from 'react';
import { Info, Calculator, IterationCcw, CheckCircle2 } from 'lucide-react';
import { EstadoFlujo } from './pagina-conicas';
import { ConicaResult, CoeficientesConica } from '@/lib/clasificarConica';

interface Props {
  estadoFlujo: EstadoFlujo;
  onAnalyze: (rut: string) => void;
  coeficientes: CoeficientesConica | null;
  resultado: ConicaResult | null;
  digitos: number[] | null;
}

export function PanelEntradaConicas({ estadoFlujo, onAnalyze, coeficientes, resultado, digitos }: Props) {
  const [rutInput, setRutInput] = useState('');
  
  const handleAnalyze = () => {
    onAnalyze(rutInput);
  };

  return (
    <div className="space-y-6">
      
      {/* TAREA 2.2: Card Entrada de RUT */}
      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">Ingreso de RUT</h2>
          <p className="mt-1 text-sm text-muted-foreground">Ingresa un número de RUT chileno para generar una sección cónica</p>
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            className="flex-1 font-mono text-lg rounded-xl border border-border px-4 py-2 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
            placeholder="12.345.678-9"
            value={rutInput}
            onChange={(e) => setRutInput(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            className="rounded-xl bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Analizar
          </button>
        </div>
      </section>

      {/* TAREA 2.3: Card Dígitos Extraídos */}
      {digitos && digitos.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">Dígitos extraídos</h2>
          <div className="flex flex-wrap gap-2 text-center">
            {digitos.slice(0, 8).map((d, i) => (
              <div key={i} className="flex-1 min-w-[3rem] px-3 py-2 rounded-xl bg-muted border border-border">
                <div className="text-xs text-muted-foreground font-medium mb-1">d{i+1}</div>
                <div className="font-mono text-lg font-bold text-foreground">{d}</div>
              </div>
            ))}
            <div className="flex-1 min-w-[3rem] px-3 py-2 rounded-xl bg-primary/10 border-2 border-primary/20">
              <div className="text-xs text-primary font-medium mb-1">DV</div>
              <div className="font-mono text-lg font-bold text-primary">{digitos[8]}</div>
            </div>
          </div>
        </section>
      )}

      {/* TAREA 2.4: Card Coeficientes de la Ecuación */}
      {coeficientes && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Coeficientes de la ecuación</h2>
            <div className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              A𝑥² + B𝑦² + C𝑥 + D𝑦 + E = 0
            </div>
          </div>
          
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {[
              { label: 'A', desc: 'coef x²', val: coeficientes.A.toFixed(2) },
              { label: 'B', desc: 'coef y²', val: coeficientes.B.toFixed(2) },
              { label: 'C', desc: 'coef x', val: coeficientes.C.toFixed(2) },
              { label: 'D', desc: 'coef y', val: coeficientes.D.toFixed(2) },
              { label: 'E', desc: 'constante', val: coeficientes.E.toFixed(2) },
            ].map((coef, i) => (
              <div key={i} className="rounded-xl border border-border bg-muted p-3 text-center transition-colors hover:border-border">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{coef.desc}</div>
                <div className="font-bold text-foreground text-xl">{coef.label}</div>
                <div className="font-mono text-sm text-muted-foreground mt-1">{coef.val}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAREA 2.5: Card Clasificación Cónica */}
      {resultado && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="text-xl font-bold text-foreground mb-4">Clasificación de la cónica</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {['circunferencia', 'elipse', 'hipérbola', 'parábola'].map((type) => {
              const isActive = resultado.tipo === type.replace('ó', 'o').replace('á', 'a');
              
              return (
                <div 
                  key={type}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isActive 
                      ? 'border-primary/50 bg-primary/5 shadow-md shadow-none' 
                      : 'border-border/50 bg-card opacity-50 grayscale-[50%]'
                  }`}
                >
                  {isActive && (
                    <div className="absolute -top-2.5 -right-2.5">
                      <span className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Detectada
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-foreground capitalize text-center">{type}</h3>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground border border-border/50">
            <strong>Razón:</strong> {resultado.razon}
          </div>
        </section>
      )}

    </div>
  );
}
