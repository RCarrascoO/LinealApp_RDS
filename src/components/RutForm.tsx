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
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Validación de RUT</h2>
      
      <form onSubmit={manejarValidacion} className="space-y-4">
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-gray-700 mb-1">
            Ingresa tu RUT
          </label>
          <input
            id="rut"
            type="text"
            value={rutInput}
            onChange={manejarCambioDeTexto}
            placeholder="Ej: 12.345.678-9"
            maxLength={12}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none transition-colors
              ${esValido === true ? 'border-green-500 focus:border-green-600 bg-green-50 text-green-900' : ''}
              ${esValido === false ? 'border-red-500 focus:border-red-600 bg-red-50 text-red-900' : ''}
              ${esValido === null ? 'border-gray-300 focus:border-blue-500 bg-white text-gray-900' : ''}
            `}
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors font-medium border border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
        >
          Validar
        </button>

        {/* Mensajes de retroalimentación principal */}
        {error && <p className="text-red-600 text-sm font-medium mt-2">❌ {error}</p>}
        {esValido === true && <p className="text-green-600 text-sm font-medium mt-2">✅ RUT válido. Generando cónica...</p>}
      </form>

      {/* Acordeón para los Pasos del Módulo 11 */}
      {pasos.length > 0 && (
        <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => setMostrarPasos(!mostrarPasos)}
            className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span>Ver algoritmo Módulo 11 paso a paso</span>
            <span>{mostrarPasos ? '▲' : '▼'}</span>
          </button>
          
          {mostrarPasos && (
            <div className="px-4 py-3 bg-white text-sm text-gray-600 border-t border-gray-200 max-h-60 overflow-y-auto">
              <ul className="list-disc pl-5 space-y-1">
                {pasos.map((paso, index) => (
                  <li key={index} className="font-mono text-xs">{paso}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
