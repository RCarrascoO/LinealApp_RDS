// =========================================================================
// ⚠️ AVISO PARA PERSONA 3:
// Este archivo fue generado en una iteración temprana. 
// Corresponde a la Tarea 3.5 (Procedimiento Matemático / Acordeón).
// Revisa si necesitas integrar esta lógica en 'panel-procedimiento-matematico.tsx'
// o si lo ocuparás aquí antes de continuar.
// =========================================================================

import React from 'react';
import { ConicaResult } from '../lib/clasificarConica';

interface Props {
  resultado: ConicaResult;
}

export function TransformacionCanonica({ resultado }: Props) {
  return (
    <div className="p-4 border rounded shadow mt-6">
      <h2 className="text-xl font-bold mb-4">Transformación Canónica y Elementos Geométricos</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Forma Canónica:</h3>
        {/* Renderizado de la forma canónica dependiente del tipo */}
        <p className="font-mono bg-gray-100 p-2 rounded inline-block mt-2">
          {JSON.stringify(resultado.formaCanonica)}
        </p>
      </div>

      <details className="mb-4">
        <summary className="cursor-pointer font-semibold text-blue-600">General → Canónica</summary>
        <ol className="p-4 list-decimal list-inside bg-gray-50 rounded mt-2">
          {resultado.pasosGeneralACanonica.map((paso, idx) => (
            <li key={idx} className="mb-1">{paso}</li>
          ))}
        </ol>
      </details>

      <details className="mb-4">
        <summary className="cursor-pointer font-semibold text-purple-600">Canónica → General</summary>
        <ol className="p-4 list-decimal list-inside bg-gray-50 rounded mt-2">
          {resultado.pasosCanonicaAGeneral.map((paso, idx) => (
            <li key={idx} className="mb-1">{paso}</li>
          ))}
        </ol>
      </details>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Elementos Geométricos:</h3>
        <table className="min-w-full text-left bg-white border">
          <tbody>
            <tr>
              <th className="py-2 px-4 border-b">Centro / Vértice</th>
              <td className="py-2 px-4 border-b">...</td>
            </tr>
            {/* Otros elementos dependiendo de la cónica */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
