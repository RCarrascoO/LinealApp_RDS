"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { validarRUT } from '../lib/rut';

interface RutFormProps {
  // onValidated recibe los dígitos del RUT (rellenados con ceros a la izquierda si son menos de 8) y el valor v.
  onValidated: (digitos: number[], v: number) => void;
}

export function RutForm({ onValidated }: RutFormProps) {
  const [rutInput, setRutInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [esValido, setEsValido] = useState<boolean | null>(null);
  const [pasos, setPasos] = useState<string[]>([]);
  const [mostrarPasos, setMostrarPasos] = useState<boolean>(false);

  // Se ejecuta cada vez que el usuario presiona una tecla
  const manejarCambioDeTexto = (evento: ChangeEvent<HTMLInputElement>) => {
    // 1. Tomamos lo que el usuario escribió y borramos cualquier letra o símbolo (excepto números y K)
    let textoEscrito = evento.target.value.replace(/[^0-9kK]/g, '').toUpperCase();
    
    // Si borró todo, dejamos el formulario limpio
    if (textoEscrito.length === 0) {
      setRutInput('');
      setEsValido(null);
      setPasos([]);
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
    setPasos([]);
    setError('');
  };

  // Se ejecuta cuando el usuario presiona el botón "Validar"
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
    setPasos(resultado.pasos);
    setEsValido(resultado.valido);
    setMostrarPasos(true); // Abrimos el acordeón automáticamente

    // 3. Si es matemáticamente correcto, preparamos los datos para la siguiente fase
    if (resultado.valido) {
      setError(''); // Borramos errores viejos
      
      // Tomamos el RUT ingresado, borramos puntos/guion y le quitamos el dígito verificador
      const soloNumeros = rutInput.replace(/[^0-9kK]/g, '').slice(0, -1);
      
      // Si el RUT es corto (ej: un millón), rellenamos con ceros a la izquierda hasta tener siempre 8 números
      const ochoNumeros = soloNumeros.padStart(8, '0');
      
      // Convertimos el texto "12345678" en una lista matemática de números: [1, 2, 3, 4, 5, 6, 7, 8]
      const listaDeDigitos = ochoNumeros.split('').map((letra) => parseInt(letra, 10));

      // 4. Enviamos esta lista y el valor 'v' hacia afuera para construir la cónica más adelante
      onValidated(listaDeDigitos, resultado.v);
    } else {
      setError('El RUT ingresado no es válido según el algoritmo (Módulo 11).');
    }
  };

  return (
    <div className="w-full rounded-[14px] border border-border bg-card p-6 shadow-[0_8px_24px_rgba(17,24,39,0.08)]">
      <h2 className="mb-4 text-center text-[24px] font-bold leading-8 text-foreground">Validación de RUT</h2>
      
      <form onSubmit={manejarValidacion} className="space-y-4">
        <div>
          <label htmlFor="rut" className="mb-1 block text-sm font-medium text-muted-foreground">
            Ingresa tu RUT
          </label>
          <input
            id="rut"
            type="text"
            value={rutInput}
            onChange={manejarCambioDeTexto}
            placeholder="Ej: 12.345.678-9"
            maxLength={12}
            className={`w-full rounded-[10px] border px-4 py-2 text-sm outline-none transition-colors focus:ring-2
              ${esValido === true ? 'border-success bg-green-50 text-foreground focus:border-success focus:ring-success/20' : ''}
              ${esValido === false ? 'border-destructive bg-red-50 text-foreground focus:border-destructive focus:ring-destructive/20' : ''}
              ${esValido === null ? 'border-input bg-card text-foreground focus:border-primary focus:ring-primary/20' : ''}
            `}
          />
        </div>

        <button 
          type="submit" 
          className="w-full rounded-[10px] border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#1D4ED8] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          Validar
        </button>

        {/* Mensajes de retroalimentación principal */}
        {error && <p className="mt-2 text-sm font-medium text-destructive">❌ {error}</p>}
        {esValido === true && <p className="mt-2 text-sm font-medium text-success">✅ RUT válido. Generando cónica...</p>}
      </form>

      {/* Acordeón para los Pasos del Módulo 11 */}
      {pasos.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-[14px] border border-border">
          <button
            type="button"
            onClick={() => setMostrarPasos(!mostrarPasos)}
            className="flex w-full items-center justify-between bg-muted px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-[#E5E7EB]"
          >
            <span>Ver algoritmo Módulo 11 paso a paso</span>
            <span className={`transition-transform ${mostrarPasos ? 'rotate-180' : ''}`}>▼</span>
          </button>
          
          {mostrarPasos && (
            <div className="max-h-60 overflow-y-auto border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              <ul className="list-disc space-y-1 pl-5">
                {pasos.map((paso, index) => (
                  <li key={index} className="font-mono text-xs text-foreground">{paso}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
