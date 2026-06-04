"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';
import { validarRUT, ValidacionRutResult } from '../lib/rut';

interface RutFormProps {
  onValidated: (rut: string, digitos: number[], v: number) => void;
  onContinue?: () => void;
  onClear?: () => void; // <-- NUEVO: Prop para avisar que se limpió
  textContinue?: string;
}

export function RutForm({ onValidated, onContinue, onClear, textContinue }: RutFormProps) {
  const [rutInput, setRutInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [esValido, setEsValido] = useState<boolean | null>(null);
  const [detallesAlgoritmo, setDetallesAlgoritmo] = useState<ValidacionRutResult['detalles'] | null>(null);
  const [mostrarPasos, setMostrarPasos] = useState<boolean>(false);

  const manejarCambioDeTexto = (evento: ChangeEvent<HTMLInputElement>) => {
    let textoEscrito = evento.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
    
    if (textoEscrito.length === 0) {
      setRutInput('');
      setEsValido(null);
      setDetallesAlgoritmo(null);
      setError('');
      if (onClear) onClear(); // <-- Avisar al padre si borran todo manualmente
      return;
    }

    if (textoEscrito.length > 1) {
      const cuerpo = textoEscrito.slice(0, -1);
      const digitoVerificador = textoEscrito.slice(-1);
      
      const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      textoEscrito = `${cuerpoConPuntos}-${digitoVerificador}`;
    }

    setRutInput(textoEscrito);
    setEsValido(null);
    setDetallesAlgoritmo(null);
    setError('');
  };

  const handleClear = () => {
    setRutInput('');
    setEsValido(null);
    setDetallesAlgoritmo(null);
    setError('');
    if (onClear) onClear(); // <-- NUEVO: Avisamos al componente padre
  };

  const manejarValidacion = (evento: FormEvent) => {
    evento.preventDefault();

    if (!rutInput || rutInput.length < 3) {
      setError('Por favor, ingresa un RUT completo.');
      setEsValido(false);
      return;
    }

    const resultado = validarRUT(rutInput);
    
    setDetallesAlgoritmo(resultado.detalles || null);
    setEsValido(resultado.valido);

    if (resultado.valido) {
      setError(''); 
      
      const soloNumeros = rutInput.replace(/[^0-9kK]/g, '').slice(0, -1);
      const ochoNumeros = soloNumeros.padStart(8, '0');
      const listaDeDigitos = ochoNumeros.split('').map((letra: string) => parseInt(letra, 10));

      onValidated(rutInput, listaDeDigitos, resultado.v);
    } else {
      setError('El RUT ingresado no es válido según el algoritmo (Módulo 11).');
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full rounded-[14px] border border-border bg-card shadow-[0_8px_24px_rgba(17,24,39,0.08)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-lg font-semibold text-foreground">Ingresa el Rut</h2>
          <div className="text-muted-foreground transition-colors hover:text-primary" title="Format: 12.345.678-9 or 12345678-9">
            <Info className="h-5 w-5" />
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={manejarValidacion} className="flex flex-col items-center space-y-6 w-full">
            <div className="flex gap-3 w-full">
              <input
                id="rut"
                type="text"
                value={rutInput}
                onChange={manejarCambioDeTexto}
                placeholder="12.345.678-9"
                maxLength={12}
                className={`flex-1 font-mono text-lg rounded-xl border border-border px-4 py-2 focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-colors bg-transparent text-center tracking-wider outline-none
                  ${esValido === true ? 'border-success text-success focus:border-success focus:ring-success' : ''}
                  ${esValido === false ? 'border-destructive text-destructive focus:border-destructive focus:ring-destructive' : ''}
                  ${esValido === null ? 'border-border text-foreground' : ''}
                `}
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive">❌ {error}</p>}

            <div className="flex w-full max-w-[320px] gap-3 pt-2">
              <button 
                type="button" 
                onClick={handleClear}
                className="w-1/2 rounded-[10px] border border-border bg-transparent px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.99]"
              >
                Limpiar
              </button>
              <button 
                type="submit" 
                className="w-1/2 rounded-[10px] border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#1D4ED8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Validar
              </button>
            </div>
            
            {esValido === true && <p className="text-sm font-medium text-success">✅ RUT válido. Procesando parámetros...</p>}
          </form>
        </div>
      </div>

      {detallesAlgoritmo && (
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setMostrarPasos(!mostrarPasos)}
            className="flex w-full items-center justify-between rounded-[14px] border border-border bg-card p-4 shadow-sm hover:bg-muted/50 transition-colors"
          >
            <span className="font-semibold text-foreground">Pasos del Algoritmo Módulo 11</span>
            {mostrarPasos ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
          </button>

          {mostrarPasos && (
            <>
              <div className="rounded-[14px] border border-border bg-card p-6 shadow-[0_8px_24px_rgba(17,24,39,0.08)]">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground border-b border-border pb-2">Paso 1: Extracción de Digitos</h3>
            <div className="flex flex-wrap gap-2 text-sm font-mono items-center">
              <span className="text-muted-foreground">Original:</span>
              <span className="font-semibold">{detallesAlgoritmo.cuerpo}-{detallesAlgoritmo.dvIngresado}</span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span className="text-muted-foreground">Dígitos para cálculo:</span>
              <div className="flex gap-1">
                {detallesAlgoritmo.digitos.map((d, i) => (
                  <span key={i} className="flex h-6 w-6 items-center justify-center rounded bg-muted text-foreground border border-border">{d}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-card shadow-[0_8px_24px_rgba(17,24,39,0.08)] overflow-hidden">
            <div className="p-6">
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground border-b border-border pb-2">Paso 2: Tabla de multiplicación</h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm text-left font-mono">
                  <thead className="bg-muted text-muted-foreground">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Posicion</th>
                      <th className="px-4 py-2 font-semibold">Digito</th>
                      <th className="px-4 py-2 font-semibold">Multiplicador</th>
                      <th className="px-4 py-2 text-right font-semibold">Producto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detallesAlgoritmo.digitos.map((d, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                        <td className="px-4 py-2 text-muted-foreground">d{8 - i}</td>
                        <td className="px-4 py-2">{d}</td>
                        <td className="px-4 py-2">{detallesAlgoritmo.multiplicadores[i]}</td>
                        <td className="px-4 py-2 text-right font-semibold">{detallesAlgoritmo.productos[i]}</td>
                      </tr>
                    ))}
                    <tr className="bg-card font-bold border-t-2 border-border">
                      <td colSpan={3} className="px-4 py-3 text-right">Sumatoria Total</td>
                      <td className="px-4 py-3 text-right text-primary">{detallesAlgoritmo.sumaTotal}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-card p-6 shadow-[0_8px_24px_rgba(17,24,39,0.08)]">
            <h3 className="mb-4 text-sm font-semibold text-muted-foreground border-b border-border pb-2">Paso 3: Calculo Modulo 11</h3>
            <div className="flex flex-col gap-3 text-sm font-mono">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">1. Calcular residuo (Sumatoria % 11)</span>
                <span>{detallesAlgoritmo.sumaTotal} % 11 = <strong className="text-amber-500">{detallesAlgoritmo.residuo}</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">2. Restar de 11 (11 - Residuo)</span>
                <span>11 - {detallesAlgoritmo.residuo} = <strong>{11 - detallesAlgoritmo.residuo}</strong></span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-muted-foreground font-semibold">Dígito Verificador Esperado</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary font-bold">
                  {detallesAlgoritmo.dvEsperado}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-card p-6 shadow-[0_8px_24px_rgba(17,24,39,0.08)] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground">Paso 4: Resultado de la Validacion</h3>
              <p className="text-sm font-mono mt-1 text-muted-foreground">
                Ingresado: <strong className="text-foreground">{detallesAlgoritmo.dvIngresado}</strong> vs Esperado: <strong className="text-foreground">{detallesAlgoritmo.dvEsperado}</strong>
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold text-sm border shadow-sm ${esValido ? 'bg-success/10 text-success border-success/30' : 'bg-destructive/10 text-destructive border-destructive/30'}`}>
              {esValido ? 'RUT VALIDO' : 'RUT INVALIDO'}
            </div>
          </div>
            </>
          )}
        </div>
      )}

      {esValido && onContinue && (
        <div className="mt-2 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button
            type="button"
            onClick={onContinue}
            className="w-full rounded-[14px] bg-primary px-8 py-4 text-lg font-bold text-primary-foreground hover:bg-[#1D4ED8] transition-all shadow-[0_8px_24px_rgba(37,99,235,0.2)] hover:shadow-[0_12px_28px_rgba(37,99,235,0.3)] active:scale-[0.98]"
          >
            {textContinue || 'Continuar al Análisis'}
          </button>
        </div>
      )}
    </div>
  );
}