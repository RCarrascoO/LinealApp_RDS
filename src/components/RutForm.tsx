"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { Info } from 'lucide-react';
import { validarRUT, ValidacionRutResult } from '../lib/rut';

interface RutFormProps {
  // onValidated recibe los dígitos del RUT (rellenados con ceros a la izquierda si son menos de 8) y el valor v.
  onValidated: (digitos: number[], v: number) => void;
}

export function RutForm({ onValidated }: RutFormProps) {
  const [rutInput, setRutInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [esValido, setEsValido] = useState<boolean | null>(null);
  const [detallesAlgoritmo, setDetallesAlgoritmo] = useState<ValidacionRutResult['detalles'] | null>(null);

  // Se ejecuta cada vez que el usuario presiona una tecla
  const manejarCambioDeTexto = (evento: ChangeEvent<HTMLInputElement>) => {
    // 1. Tomamos lo que el usuario escribió y borramos cualquier letra o símbolo (excepto números y K)
    let textoEscrito = evento.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
    
    // Si borró todo, dejamos el formulario limpio
    if (textoEscrito.length === 0) {
      setRutInput('');
      setEsValido(null);
      setDetallesAlgoritmo(null);
      setError('');
      return;
    }

    // 2. Si hay más de un número, le ponemos formato bonito (puntos y guion)
    if (textoEscrito.length > 1) {
      const cuerpo = textoEscrito.slice(0, -1);
      const digitoVerificador = textoEscrito.slice(-1);
      
      // Esta expresión busca grupos de 3 números para colocarles un punto
      const cuerpoConPuntos = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      textoEscrito = `${cuerpoConPuntos}-${digitoVerificador}`;
    }

    // 3. Guardamos el texto formateado en la memoria de la pantalla
    setRutInput(textoEscrito);
    
    // 4. Si el usuario vuelve a escribir, borramos el mensaje de error o éxito anterior
    setEsValido(null);
    setDetallesAlgoritmo(null);
    setError('');
  };

  // Se ejecuta cuando el usuario presiona el botón "Validar"
  const handleClear = () => {
    setRutInput('');
    setEsValido(null);
    setDetallesAlgoritmo(null);
    setError('');
  };

  const manejarValidacion = (evento: FormEvent) => {
    // Evitamos que la página web recargue por defecto
    evento.preventDefault();

    // Verificamos que no esté vacío
    if (!rutInput || rutInput.length < 3) {
      setError('Por favor, ingresa un RUT completo.');
      setEsValido(false);
      return;
    }

    // 1. Usamos nuestra función matemática para validar el RUT
    const resultado = validarRUT(rutInput);
    
    // 2. Guardamos los resultados para que se muestren en pantalla
    setDetallesAlgoritmo(resultado.detalles || null);
    setEsValido(resultado.valido);

    // 3. Si es matemáticamente correcto, preparamos los datos para la siguiente fase
    if (resultado.valido) {
      setError(''); // Borramos errores viejos
      
      // Tomamos el RUT ingresado, borramos puntos/guion y le quitamos el dígito verificador
      const soloNumeros = rutInput.replace(/[^0-9kK]/g, '').slice(0, -1);
      
      // Si el RUT es corto (ej: un millón), rellenamos con ceros a la izquierda hasta tener siempre 8 números
      const ochoNumeros = soloNumeros.padStart(8, '0');
      
      // Convertimos el texto "12345678" en una lista matemática de números: [1, 2, 3, 4, 5, 6, 7, 8]
      const listaDeDigitos = ochoNumeros.split('').map((letra: string) => parseInt(letra, 10));

      // 4. Enviamos esta lista y el valor 'v' hacia afuera para construir la cónica más adelante
      onValidated(listaDeDigitos, resultado.v);
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
          <form onSubmit={manejarValidacion} className="flex flex-col items-center space-y-6">
            <input
              id="rut"
              type="text"
              value={rutInput}
              onChange={manejarCambioDeTexto}
              placeholder="12.345.678-9"
              maxLength={12}
              className={`w-full max-w-[320px] bg-transparent text-center font-mono text-3xl font-medium tracking-wider outline-none transition-colors border-b-2 placeholder:text-muted-foreground/40
                ${esValido === true ? 'border-success text-success focus:border-success' : ''}
                ${esValido === false ? 'border-destructive text-destructive focus:border-destructive' : ''}
                ${esValido === null ? 'border-border text-foreground focus:border-primary' : ''}
              `}
            />

            {error && <p className="text-sm font-medium text-destructive">❌ {error}</p>}
            
            <div className="flex w-full max-w-[320px] gap-3">
              <button 
                type="button" 
                onClick={handleClear}
                className="w-1/2 rounded-[10px] border border-border bg-transparent px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted active:scale-[0.99]"
              >
                Limpiar Rut
              </button>
              <button 
                type="submit" 
                className="w-1/2 rounded-[10px] border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#1D4ED8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Validar Rut
              </button>
            </div>
            
            {esValido === true && <p className="text-sm font-medium text-success">✅ RUT válido. Generando cónica...</p>}
          </form>
        </div>
      </div>

      {detallesAlgoritmo && (
        <div className="flex flex-col gap-4">
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
        </div>
      )}
    </div>
  );
}