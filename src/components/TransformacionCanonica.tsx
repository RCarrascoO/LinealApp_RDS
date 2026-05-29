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
    <div className="p-4 border border-border rounded shadow mt-6 bg-card text-card-foreground">
      <h2 className="text-xl font-bold mb-4">Transformación Canónica y Elementos Geométricos</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Forma Canónica:</h3>
        {/* Renderizado de la forma canónica dependiente del tipo */}
        <p className="font-mono bg-muted p-2 rounded inline-block mt-2 text-foreground">
          {JSON.stringify(resultado.formaCanonica)}
        </p>
      </div>

      <details className="mb-4">
        <summary className="cursor-pointer font-semibold text-blue-600 dark:text-blue-400">General → Canónica</summary>
        <ol className="p-4 list-decimal list-inside bg-muted rounded mt-2 text-foreground">
          {resultado.pasosGeneralACanonica.map((paso, idx) => (
            <li key={idx} className="mb-1">{paso}</li>
          ))}
        </ol>
      </details>

      <details className="mb-4">
        <summary className="cursor-pointer font-semibold text-purple-600 dark:text-purple-400">Canónica → General</summary>
        <ol className="p-4 list-decimal list-inside bg-muted rounded mt-2 text-foreground">
          {resultado.pasosCanonicaAGeneral.map((paso, idx) => (
            <li key={idx} className="mb-1">{paso}</li>
          ))}
        </ol>
      </details>

      <div className="mt-4">
        <h3 className="font-semibold text-lg mb-2">Elementos Geométricos:</h3>
        <table className="min-w-full text-left bg-background border border-border">
          <tbody>
            <tr>
              <th className="py-2 px-4 border-b border-border text-foreground">Centro / Vértice</th>
              <td className="py-2 px-4 border-b border-border text-foreground">...</td>
            </tr>
            {/* Otros elementos dependiendo de la cónica */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
