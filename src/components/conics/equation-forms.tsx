"use client";

import React from "react";
import { ConicaResult, CoeficientesConica } from "@/lib/clasificarConica";

interface Props {
  resultado: ConicaResult;
  coeficientes: CoeficientesConica;
}

function fmt(n?: number) {
  if (n === undefined) return "0";
  if (Number.isInteger(n)) return String(n);
  return String(Number(n).toFixed(3));
}

export function EquationForms({ resultado, coeficientes }: Props) {
  const { A, B, C, D, E, F } = coeficientes;

  const general = `${fmt(A)}x² + ${fmt(B)}xy + ${fmt(C)}y² + ${fmt(D)}x + ${fmt(E)}y + ${fmt(F)} = 0`;

  const canonical =
    resultado.formaCanonica && Object.keys(resultado.formaCanonica).length > 0
      ? JSON.stringify(resultado.formaCanonica)
      : "(x - h)²/a² + (y - k)²/b² = 1";

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-gray-50 p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
          Forma General
        </p>
        <p className="font-mono text-lg text-slate-900">{general}</p>
      </div>

      <div className="rounded-lg border-2 border-indigo-300 bg-indigo-50 p-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-indigo-600">
          Forma Canónica
        </p>
        <p className="font-mono text-xl text-center py-2 text-indigo-900">{canonical}</p>
      </div>
    </div>
  );
}
