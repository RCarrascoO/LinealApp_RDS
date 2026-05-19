'use client';

import { useMemo, useState } from 'react';
import { ConicaResult } from '../lib/clasificarConica';

type ResultadoCampo = {
  correcto: boolean;
  esperado: string;
};

type CamposVerificados = Record<string, ResultadoCampo>;

interface Props {
  resultado: ConicaResult;
}

function normalizarNumero(valor: string): number | null {
  const limpio = valor.trim().replace(',', '.');

  if (limpio === '') {
    return null;
  }

  const numero = Number(limpio);
  return Number.isFinite(numero) ? numero : null;
}

function formatearNumero(valor: number): string {
  const redondeado = Math.round(valor * 1000) / 1000;
  return Number.isInteger(redondeado)
    ? String(redondeado)
    : redondeado.toFixed(3).replace(/\.0+$/, '').replace(/0+$/, '').replace(/\.$/, '');
}

function esCercano(a: number | null, b: number, tolerancia = 0.05): boolean {
  if (a === null) {
    return false;
  }

  return Math.abs(a - b) <= tolerancia;
}

function Campo({
  label,
  value,
  onChange,
  status,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  status?: ResultadoCampo;
  placeholder?: string;
}) {
  const borde = status
    ? status.correcto
      ? 'border-green-500 bg-green-50 text-green-900'
      : 'border-red-500 bg-red-50 text-red-900'
    : 'border-slate-300 bg-white text-slate-900';

  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? '___'}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-slate-400 ${borde}`}
      />
      {status && (
        <p className={`mt-1 text-xs font-medium ${status.correcto ? 'text-green-700' : 'text-red-700'}`}>
          {status.correcto ? 'Correcto' : `Esperado: ${status.esperado}`}
        </p>
      )}
    </label>
  );
}

export function CamposDefensa({ resultado }: Props) {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [verificado, setVerificado] = useState(false);
  const [resultadoCampos, setResultadoCampos] = useState<CamposVerificados>({});

  const tipo = resultado.tipo;
  const forma = resultado.formaCanonica;

  const tituloSeccion = useMemo(() => {
    switch (tipo) {
      case 'circunferencia':
        return 'Defensa oral: circunferencia';
      case 'elipse':
        return 'Defensa oral: elipse';
      case 'hiperbola':
        return 'Defensa oral: hipérbola';
      case 'parabola':
        return 'Defensa oral: parábola';
      default:
        return 'Defensa oral';
    }
  }, [tipo]);

  const actualizar = (campo: string, valor: string) => {
    setValores((actuales) => ({ ...actuales, [campo]: valor }));
    setVerificado(false);
  };

  const verificar = () => {
    const nuevosResultados: CamposVerificados = {};

    const registrar = (campo: string, correcto: boolean, esperado: string) => {
      nuevosResultados[campo] = { correcto, esperado };
    };

    if (tipo === 'circunferencia') {
      registrar('centroH', esCercano(normalizarNumero(valores.centroH ?? ''), forma.centro.h), formatearNumero(forma.centro.h));
      registrar('centroK', esCercano(normalizarNumero(valores.centroK ?? ''), forma.centro.k), formatearNumero(forma.centro.k));
      registrar('radio', esCercano(normalizarNumero(valores.radio ?? ''), forma.radio ?? 0), formatearNumero(forma.radio ?? 0));
    }

    if (tipo === 'elipse' || tipo === 'hiperbola') {
      registrar('centroH', esCercano(normalizarNumero(valores.centroH ?? ''), forma.centro.h), formatearNumero(forma.centro.h));
      registrar('centroK', esCercano(normalizarNumero(valores.centroK ?? ''), forma.centro.k), formatearNumero(forma.centro.k));

      const foco1 = forma.focos?.[0] ?? { x: 0, y: 0 };
      const foco2 = forma.focos?.[1] ?? { x: 0, y: 0 };
      const vertice1 = forma.vertices?.[0] ?? { x: 0, y: 0 };
      const vertice2 = forma.vertices?.[1] ?? { x: 0, y: 0 };

      registrar('foco1X', esCercano(normalizarNumero(valores.foco1X ?? ''), foco1.x), formatearNumero(foco1.x));
      registrar('foco1Y', esCercano(normalizarNumero(valores.foco1Y ?? ''), foco1.y), formatearNumero(foco1.y));
      registrar('foco2X', esCercano(normalizarNumero(valores.foco2X ?? ''), foco2.x), formatearNumero(foco2.x));
      registrar('foco2Y', esCercano(normalizarNumero(valores.foco2Y ?? ''), foco2.y), formatearNumero(foco2.y));

      registrar('vertice1X', esCercano(normalizeNumber(valores.vertice1X ?? ''), vertice1.x), formatearNumero(vertice1.x));
      registrar('vertice1Y', esCercano(normalizeNumber(valores.vertice1Y ?? ''), vertice1.y), formatearNumero(vertice1.y));
      registrar('vertice2X', esCercano(normalizeNumber(valores.vertice2X ?? ''), vertice2.x), formatearNumero(vertice2.x));
      registrar('vertice2Y', esCercano(normalizeNumber(valores.vertice2Y ?? ''), vertice2.y), formatearNumero(vertice2.y));

      registrar('a', esCercano(normalizarNumero(valores.a ?? ''), forma.a ?? 0), formatearNumero(forma.a ?? 0));
      registrar('b', esCercano(normalizarNumero(valores.b ?? ''), forma.b ?? 0), formatearNumero(forma.b ?? 0));
    }

    if (tipo === 'parabola') {
      const vertice = forma.vertices?.[0] ?? { x: 0, y: 0 };
      const foco = forma.focos?.[0] ?? { x: 0, y: 0 };

      registrar('verticeX', esCercano(normalizarNumero(valores.verticeX ?? ''), vertice.x), formatearNumero(vertice.x));
      registrar('verticeY', esCercano(normalizarNumero(valores.verticeY ?? ''), vertice.y), formatearNumero(vertice.y));
      registrar('focoX', esCercano(normalizarNumero(valores.focoX ?? ''), foco.x), formatearNumero(foco.x));
      registrar('focoY', esCercano(normalizarNumero(valores.focoY ?? ''), foco.y), formatearNumero(foco.y));
      registrar('p', esCercano(normalizarNumero(valores.p ?? ''), forma.p ?? 0), formatearNumero(forma.p ?? 0));
      registrar('directriz', (valores.directriz ?? '').trim().toLowerCase() === (forma.directriz ?? '').trim().toLowerCase(), forma.directriz ?? '');
    }

    setResultadoCampos(nuevosResultados);
    setVerificado(true);
  };

  if (tipo === 'ninguna') {
    return null;
  }

  const seccionComun = tipo === 'parabola'
    ? null
    : (
      <div className="grid gap-4 md:grid-cols-2">
        <Campo
          label="Centro: h"
          value={valores.centroH ?? ''}
          onChange={(valor) => actualizar('centroH', valor)}
          status={verificado ? resultadoCampos.centroH : undefined}
        />
        <Campo
          label="Centro: k"
          value={valores.centroK ?? ''}
          onChange={(valor) => actualizar('centroK', valor)}
          status={verificado ? resultadoCampos.centroK : undefined}
        />
      </div>
    );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">{tituloSeccion}</h2>
          <p className="mt-1 text-sm text-slate-600">
            Completa los campos vacíos como si estuvieras explicando el desarrollo en una defensa oral.
          </p>
        </div>
        <button
          type="button"
          onClick={verificar}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
        >
          Verificar respuestas
        </button>
      </div>

      <div className="space-y-5">
        {seccionComun}

        {tipo === 'circunferencia' && (
          <div className="grid gap-4 md:grid-cols-2">
            <Campo label="Radio" value={valores.radio ?? ''} onChange={(valor) => actualizar('radio', valor)} status={verificado ? resultadoCampos.radio : undefined} />
          </div>
        )}

        {(tipo === 'elipse' || tipo === 'hiperbola') && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Foco 1: x" value={valores.foco1X ?? ''} onChange={(valor) => actualizar('foco1X', valor)} status={verificado ? resultadoCampos.foco1X : undefined} />
              <Campo label="Foco 1: y" value={valores.foco1Y ?? ''} onChange={(valor) => actualizar('foco1Y', valor)} status={verificado ? resultadoCampos.foco1Y : undefined} />
              <Campo label="Foco 2: x" value={valores.foco2X ?? ''} onChange={(valor) => actualizar('foco2X', valor)} status={verificado ? resultadoCampos.foco2X : undefined} />
              <Campo label="Foco 2: y" value={valores.foco2Y ?? ''} onChange={(valor) => actualizar('foco2Y', valor)} status={verificado ? resultadoCampos.foco2Y : undefined} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Vértice 1: x" value={valores.vertice1X ?? ''} onChange={(valor) => actualizar('vertice1X', valor)} status={verificado ? resultadoCampos.vertice1X : undefined} />
              <Campo label="Vértice 1: y" value={valores.vertice1Y ?? ''} onChange={(valor) => actualizar('vertice1Y', valor)} status={verificado ? resultadoCampos.vertice1Y : undefined} />
              <Campo label="Vértice 2: x" value={valores.vertice2X ?? ''} onChange={(valor) => actualizar('vertice2X', valor)} status={verificado ? resultadoCampos.vertice2X : undefined} />
              <Campo label="Vértice 2: y" value={valores.vertice2Y ?? ''} onChange={(valor) => actualizar('vertice2Y', valor)} status={verificado ? resultadoCampos.vertice2Y : undefined} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Semieje mayor / a" value={valores.a ?? ''} onChange={(valor) => actualizar('a', valor)} status={verificado ? resultadoCampos.a : undefined} />
              <Campo label="Semieje menor / b" value={valores.b ?? ''} onChange={(valor) => actualizar('b', valor)} status={verificado ? resultadoCampos.b : undefined} />
            </div>
          </>
        )}

        {tipo === 'parabola' && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Vértice: x" value={valores.verticeX ?? ''} onChange={(valor) => actualizar('verticeX', valor)} status={verificado ? resultadoCampos.verticeX : undefined} />
              <Campo label="Vértice: y" value={valores.verticeY ?? ''} onChange={(valor) => actualizar('verticeY', valor)} status={verificado ? resultadoCampos.verticeY : undefined} />
              <Campo label="Foco: x" value={valores.focoX ?? ''} onChange={(valor) => actualizar('focoX', valor)} status={verificado ? resultadoCampos.focoX : undefined} />
              <Campo label="Foco: y" value={valores.focoY ?? ''} onChange={(valor) => actualizar('focoY', valor)} status={verificado ? resultadoCampos.focoY : undefined} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Campo label="Parámetro p" value={valores.p ?? ''} onChange={(valor) => actualizar('p', valor)} status={verificado ? resultadoCampos.p : undefined} />
              <Campo label="Directriz" value={valores.directriz ?? ''} onChange={(valor) => actualizar('directriz', valor)} status={verificado ? resultadoCampos.directriz : undefined} placeholder={forma.directriz ?? 'x = ___ / y = ___'} />
            </div>
          </>
        )}
      </div>

      {verificado && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          Revisa los campos coloreados. En rojo aparece la respuesta esperada para corregir rápidamente.
        </div>
      )}
    </section>
  );
}

function normalizeNumber(valor: string): number | null {
  return normalizarNumero(valor);
}