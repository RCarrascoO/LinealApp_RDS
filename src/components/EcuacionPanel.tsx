// =========================================================================
// ⚠️ AVISO PARA PERSONA 3:
// Este archivo fue generado en una iteración temprana. 
// Actualmente tus responsabilidades (Tarea 3.1) se están manejando en el 
// panel derecho. Revisa si necesitas integrar este panel en tus componentes
// o si prefieres eliminarlo y usar 'panel-resultados-conicas.tsx'.
// =========================================================================

import React from 'react';

type Coeficientes = { A: number; B: number; C: number; D: number; E: number };

interface Props {
  coeficientes: Coeficientes;
  pasosConstruccion: string[];
  tipoConica?: string;
}

export function EcuacionPanel({ coeficientes, pasosConstruccion, tipoConica }: Props) {
  const { A, B, C, D, E } = coeficientes;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ecuación General</h2>
      <div className="text-2xl mb-4 font-mono">
        <span style={{ color: A === 0 ? 'red' : 'inherit' }}>{A}x²</span> +{' '}
        <span style={{ color: B === 0 ? 'blue' : 'inherit' }}>{B}y²</span> + {C}x + {D}y + {E} = 0
      </div>
      
      {tipoConica && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 rounded bg-gray-200 text-gray-800 font-semibold uppercase text-sm">
            {tipoConica}
          </span>
        </div>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer font-semibold text-blue-600">Ver construcción paso a paso</summary>
        <ol className="p-4 list-decimal list-inside bg-gray-50 rounded mt-2">
          {pasosConstruccion.map((paso, idx) => (
            <li key={idx} className="mb-1">{paso}</li>
          ))}
        </ol>
      </details>
    </div>
  );
}
