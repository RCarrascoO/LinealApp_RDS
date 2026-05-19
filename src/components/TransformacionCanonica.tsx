import React from 'react';
import { ConicaResult } from '../lib/clasificarConica';

interface Props {
  resultado: ConicaResult;
}

export function TransformacionCanonica({ resultado }: Props) {
  const { tipo, formaCanonica } = resultado;
  const centro = formaCanonica.centro;

  const formato = (valor: number | undefined) => {
    if (typeof valor !== 'number' || !Number.isFinite(valor)) {
      return '—';
    }

    const redondeado = Math.round(valor * 1000) / 1000;
    return Number.isInteger(redondeado)
      ? String(redondeado)
      : redondeado.toFixed(3).replace(/\.0+$/, '').replace(/0+$/, '').replace(/\.$/, '');
  };

  const renderTabla = () => {
    if (tipo === 'circunferencia') {
      return (
        <tbody>
          <tr><th className="border-b py-2 px-4">Centro</th><td className="border-b py-2 px-4">({formato(centro.h)}, {formato(centro.k)})</td></tr>
          <tr><th className="border-b py-2 px-4">Radio</th><td className="border-b py-2 px-4">{formato(formaCanonica.radio)}</td></tr>
        </tbody>
      );
    }

    if (tipo === 'elipse') {
      return (
        <tbody>
          <tr><th className="border-b py-2 px-4">Centro</th><td className="border-b py-2 px-4">({formato(centro.h)}, {formato(centro.k)})</td></tr>
          <tr><th className="border-b py-2 px-4">Semieje mayor</th><td className="border-b py-2 px-4">{formato(formaCanonica.a)}</td></tr>
          <tr><th className="border-b py-2 px-4">Semieje menor</th><td className="border-b py-2 px-4">{formato(formaCanonica.b)}</td></tr>
          <tr><th className="border-b py-2 px-4">Foco 1</th><td className="border-b py-2 px-4">({formato(formaCanonica.focos?.[0]?.x)}, {formato(formaCanonica.focos?.[0]?.y)})</td></tr>
          <tr><th className="border-b py-2 px-4">Foco 2</th><td className="border-b py-2 px-4">({formato(formaCanonica.focos?.[1]?.x)}, {formato(formaCanonica.focos?.[1]?.y)})</td></tr>
          <tr><th className="border-b py-2 px-4">Vértice 1</th><td className="border-b py-2 px-4">({formato(formaCanonica.vertices?.[0]?.x)}, {formato(formaCanonica.vertices?.[0]?.y)})</td></tr>
          <tr><th className="py-2 px-4">Vértice 2</th><td className="py-2 px-4">({formato(formaCanonica.vertices?.[1]?.x)}, {formato(formaCanonica.vertices?.[1]?.y)})</td></tr>
        </tbody>
      );
    }

    if (tipo === 'hiperbola') {
      return (
        <tbody>
          <tr><th className="border-b py-2 px-4">Centro</th><td className="border-b py-2 px-4">({formato(centro.h)}, {formato(centro.k)})</td></tr>
          <tr><th className="border-b py-2 px-4">a</th><td className="border-b py-2 px-4">{formato(formaCanonica.a)}</td></tr>
          <tr><th className="border-b py-2 px-4">b</th><td className="border-b py-2 px-4">{formato(formaCanonica.b)}</td></tr>
          <tr><th className="border-b py-2 px-4">Foco 1</th><td className="border-b py-2 px-4">({formato(formaCanonica.focos?.[0]?.x)}, {formato(formaCanonica.focos?.[0]?.y)})</td></tr>
          <tr><th className="border-b py-2 px-4">Foco 2</th><td className="border-b py-2 px-4">({formato(formaCanonica.focos?.[1]?.x)}, {formato(formaCanonica.focos?.[1]?.y)})</td></tr>
          <tr><th className="border-b py-2 px-4">Vértice 1</th><td className="border-b py-2 px-4">({formato(formaCanonica.vertices?.[0]?.x)}, {formato(formaCanonica.vertices?.[0]?.y)})</td></tr>
          <tr><th className="border-b py-2 px-4">Vértice 2</th><td className="border-b py-2 px-4">({formato(formaCanonica.vertices?.[1]?.x)}, {formato(formaCanonica.vertices?.[1]?.y)})</td></tr>
          <tr><th className="py-2 px-4">Directrices</th><td className="py-2 px-4">{formaCanonica.directrices?.join(' y ') ?? '—'}</td></tr>
        </tbody>
      );
    }

    if (tipo === 'parabola') {
      return (
        <tbody>
          <tr><th className="border-b py-2 px-4">Vértice</th><td className="border-b py-2 px-4">({formato(centro.h)}, {formato(centro.k)})</td></tr>
          <tr><th className="border-b py-2 px-4">Foco</th><td className="border-b py-2 px-4">({formato(formaCanonica.focos?.[0]?.x)}, {formato(formaCanonica.focos?.[0]?.y)})</td></tr>
          <tr><th className="border-b py-2 px-4">p</th><td className="border-b py-2 px-4">{formato(formaCanonica.p)}</td></tr>
          <tr><th className="py-2 px-4">Directriz</th><td className="py-2 px-4">{formaCanonica.directriz ?? '—'}</td></tr>
        </tbody>
      );
    }

    return (
      <tbody>
        <tr><td className="py-4 px-4">Sin datos geométricos disponibles.</td></tr>
      </tbody>
    );
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-slate-900">Transformación Canónica y Elementos Geométricos</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Forma Canónica</h3>
        <p className="mt-2 inline-block rounded-xl bg-slate-100 px-3 py-2 font-mono text-sm text-slate-800">
          {formaCanonica.ecuacion ?? JSON.stringify(formaCanonica)}
        </p>
      </div>

      <details className="mb-4">
        <summary className="cursor-pointer font-semibold text-slate-700">General → Canónica</summary>
        <ol className="mt-2 list-inside list-decimal rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          {resultado.pasosGeneralACanonica.map((paso, idx) => (
            <li key={idx} className="mb-1">{paso}</li>
          ))}
        </ol>
      </details>

      <details className="mb-4">
        <summary className="cursor-pointer font-semibold text-slate-700">Canónica → General</summary>
        <ol className="mt-2 list-inside list-decimal rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          {resultado.pasosCanonicaAGeneral.map((paso, idx) => (
            <li key={idx} className="mb-1">{paso}</li>
          ))}
        </ol>
      </details>

      <div className="mt-4">
        <h3 className="mb-2 text-lg font-semibold text-slate-800">Elementos Geométricos</h3>
        <table className="min-w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left text-sm">
          {renderTabla()}
        </table>
      </div>
    </div>
  );
}
