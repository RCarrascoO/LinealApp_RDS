'use client';

import { useMemo, useState } from 'react';
import { ConicaResult, CoeficientesConica } from '../lib/clasificarConica';

type ResultadoCampo = {
  correcto: boolean;
  esperado: string;
};

type CamposVerificados = Record<string, ResultadoCampo>;

interface Props {
  resultado: ConicaResult;
  coeficientes: CoeficientesConica;
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
      ? 'border-success bg-success/10 text-success-foreground'
      : 'border-destructive bg-destructive/10 text-destructive-foreground'
    : 'border-border bg-background text-foreground';

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder ?? '___'}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 ${borde}`}
      />
      {status && (
        <p className={`mt-1 text-xs font-medium ${status.correcto ? 'text-success font-semibold' : 'text-destructive font-semibold'}`}>
          {status.correcto ? '✓ Correcto' : `✗ Esperado: ${status.esperado}`}
        </p>
      )}
    </label>
  );
}

export function CamposDefensa({ resultado, coeficientes }: Props) {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [verificado, setVerificado] = useState(false);
  const [resultadoCampos, setResultadoCampos] = useState<CamposVerificados>({});

  const tipo = resultado.tipo;
  const forma = resultado.formaCanonica;
  const { A, B, C, D, E } = coeficientes;

  const renderTerm = (coef: number, term: string, color: string, isFirst = false) => {
    if (coef === 0) return null;

    const numeric = formatearNumero(Math.abs(coef));
    const sign = coef < 0 ? '−' : isFirst ? '' : '+';

    return (
      <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
        {sign && <span className="text-muted-foreground">{sign}</span>}
        <span className={`${color} font-semibold`}>{numeric}</span>
        {term ? <span className="ml-0.5">{term}</span> : null}
      </span>
    );
  };

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
      const coVertice1 = forma.coVertices?.[0] ?? { x: 0, y: 0 };
      const coVertice2 = forma.coVertices?.[1] ?? { x: 0, y: 0 };

      registrar('foco1X', esCercano(normalizarNumero(valores.foco1X ?? ''), foco1.x), formatearNumero(foco1.x));
      registrar('foco1Y', esCercano(normalizarNumero(valores.foco1Y ?? ''), foco1.y), formatearNumero(foco1.y));
      registrar('foco2X', esCercano(normalizarNumero(valores.foco2X ?? ''), foco2.x), formatearNumero(foco2.x));
      registrar('foco2Y', esCercano(normalizarNumero(valores.foco2Y ?? ''), foco2.y), formatearNumero(foco2.y));

      registrar('vertice1X', esCercano(normalizarNumero(valores.vertice1X ?? ''), vertice1.x), formatearNumero(vertice1.x));
      registrar('vertice1Y', esCercano(normalizarNumero(valores.vertice1Y ?? ''), vertice1.y), formatearNumero(vertice1.y));
      registrar('vertice2X', esCercano(normalizarNumero(valores.vertice2X ?? ''), vertice2.x), formatearNumero(vertice2.x));
      registrar('vertice2Y', esCercano(normalizarNumero(valores.vertice2Y ?? ''), vertice2.y), formatearNumero(vertice2.y));

      if (tipo === 'elipse') {
        registrar('coVertice1X', esCercano(normalizarNumero(valores.coVertice1X ?? ''), coVertice1.x), formatearNumero(coVertice1.x));
        registrar('coVertice1Y', esCercano(normalizarNumero(valores.coVertice1Y ?? ''), coVertice1.y), formatearNumero(coVertice1.y));
        registrar('coVertice2X', esCercano(normalizarNumero(valores.coVertice2X ?? ''), coVertice2.x), formatearNumero(coVertice2.x));
        registrar('coVertice2Y', esCercano(normalizarNumero(valores.coVertice2Y ?? ''), coVertice2.y), formatearNumero(coVertice2.y));
      }

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

  // Helper for inline inputs in the formula template
  function InlineCampo({
    keyName,
    placeholder,
    className = 'w-14'
  }: {
    keyName: string;
    placeholder: string;
    className?: string;
  }) {
    const status = resultadoCampos[keyName];
    const borderStyle = verificado
      ? status?.correcto
        ? 'border-success text-success bg-success/10 font-bold focus:ring-success/20'
        : 'border-destructive text-destructive bg-destructive/10 font-bold focus:ring-destructive/20'
      : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20 bg-background/50 text-foreground';

    return (
      <span className="inline-flex flex-col items-center align-middle mx-1">
        <input
          type="text"
          id={`inline-input-${keyName}`}
          inputMode="decimal"
          value={valores[keyName] ?? ''}
          onChange={(event) => actualizar(keyName, event.target.value)}
          placeholder={placeholder}
          className={`h-7 rounded border px-1 text-center text-xs outline-none transition-all placeholder:text-muted-foreground/60 ${className} ${borderStyle}`}
        />
        {verificado && status && !status.correcto && (
          <span className="text-[10px] text-destructive font-semibold mt-0.5 whitespace-nowrap leading-none">
            {status.esperado}
          </span>
        )}
      </span>
    );
  }

  const renderFormulaCanonicaEditable = () => {
    switch (tipo) {
      case 'circunferencia':
        return (
          <div className="flex flex-wrap items-center justify-center gap-1 font-mono text-base md:text-lg text-foreground bg-muted/40 py-4 px-3 rounded-xl border border-border/40">
            <span>(x -</span>
            <InlineCampo keyName="centroH" placeholder="h" />
            <span>)² + (y -</span>
            <InlineCampo keyName="centroK" placeholder="k" />
            <span>)² =</span>
            <InlineCampo keyName="radio" placeholder="R" />
            <span>²</span>
          </div>
        );
      case 'elipse':
        return (
          <div className="flex items-center justify-center gap-3 font-mono text-base md:text-lg text-foreground bg-muted/40 py-4 px-3 rounded-xl border border-border/40">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5 border-b border-foreground/40 pb-1.5">
                <span>(x -</span>
                <InlineCampo keyName="centroH" placeholder="h" />
                <span>)²</span>
              </div>
              <div className="pt-1.5 flex items-center gap-0.5">
                <InlineCampo keyName="a" placeholder="a" />
                <span>²</span>
              </div>
            </div>

            <span className="text-xl font-medium">+</span>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-0.5 border-b border-foreground/40 pb-1.5">
                <span>(y -</span>
                <InlineCampo keyName="centroK" placeholder="k" />
                <span>)²</span>
              </div>
              <div className="pt-1.5 flex items-center gap-0.5">
                <InlineCampo keyName="b" placeholder="b" />
                <span>²</span>
              </div>
            </div>

            <span className="text-xl font-medium">= 1</span>
          </div>
        );
      case 'hiperbola': {
        const esHorizontal = forma.eje === 'horizontal';
        return (
          <div className="flex items-center justify-center gap-3 font-mono text-base md:text-lg text-foreground bg-muted/40 py-4 px-3 rounded-xl border border-border/40">
            {esHorizontal ? (
              <>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5 border-b border-foreground/40 pb-1.5">
                    <span>(x -</span>
                    <InlineCampo keyName="centroH" placeholder="h" />
                    <span>)²</span>
                  </div>
                  <div className="pt-1.5 flex items-center gap-0.5">
                    <InlineCampo keyName="a" placeholder="a" />
                    <span>²</span>
                  </div>
                </div>

                <span className="text-xl font-medium">−</span>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5 border-b border-foreground/40 pb-1.5">
                    <span>(y -</span>
                    <InlineCampo keyName="centroK" placeholder="k" />
                    <span>)²</span>
                  </div>
                  <div className="pt-1.5 flex items-center gap-0.5">
                    <InlineCampo keyName="b" placeholder="b" />
                    <span>²</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5 border-b border-foreground/40 pb-1.5">
                    <span>(y -</span>
                    <InlineCampo keyName="centroK" placeholder="k" />
                    <span>)²</span>
                  </div>
                  <div className="pt-1.5 flex items-center gap-0.5">
                    <InlineCampo keyName="a" placeholder="a" />
                    <span>²</span>
                  </div>
                </div>

                <span className="text-xl font-medium">−</span>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-0.5 border-b border-foreground/40 pb-1.5">
                    <span>(x -</span>
                    <InlineCampo keyName="centroH" placeholder="h" />
                    <span>)²</span>
                  </div>
                  <div className="pt-1.5 flex items-center gap-0.5">
                    <InlineCampo keyName="b" placeholder="b" />
                    <span>²</span>
                  </div>
                </div>
              </>
            )}

            <span className="text-xl font-medium">= 1</span>
          </div>
        );
      }
      case 'parabola': {
        const esVertical = forma.eje === 'vertical';
        return (
          <div className="flex flex-wrap items-center justify-center gap-1 font-mono text-base md:text-lg text-foreground bg-muted/40 py-4 px-3 rounded-xl border border-border/40">
            {esVertical ? (
              <>
                <span>(x -</span>
                <InlineCampo keyName="verticeX" placeholder="h" />
                <span>)² = 4 · (</span>
                <InlineCampo keyName="p" placeholder="p" />
                <span>) · (y -</span>
                <InlineCampo keyName="verticeY" placeholder="k" />
                <span>)</span>
              </>
            ) : (
              <>
                <span>(y -</span>
                <InlineCampo keyName="verticeY" placeholder="k" />
                <span>)² = 4 · (</span>
                <InlineCampo keyName="p" placeholder="p" />
                <span>) · (x -</span>
                <InlineCampo keyName="verticeX" placeholder="h" />
                <span>)</span>
              </>
            )}
          </div>
        );
      }
      default:
        return null;
    }
  };

  const renderElementosGrid = () => {
    if (tipo === 'circunferencia') {
      return (
        <div className="grid gap-4 sm:grid-cols-3">
          <Campo label="Centro: h" value={valores.centroH ?? ''} onChange={(valor) => actualizar('centroH', valor)} status={verificado ? resultadoCampos.centroH : undefined} />
          <Campo label="Centro: k" value={valores.centroK ?? ''} onChange={(valor) => actualizar('centroK', valor)} status={verificado ? resultadoCampos.centroK : undefined} />
          <Campo label="Radio" value={valores.radio ?? ''} onChange={(valor) => actualizar('radio', valor)} status={verificado ? resultadoCampos.radio : undefined} />
        </div>
      );
    }

    if (tipo === 'elipse' || tipo === 'hiperbola') {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Centro: h" value={valores.centroH ?? ''} onChange={(valor) => actualizar('centroH', valor)} status={verificado ? resultadoCampos.centroH : undefined} />
            <Campo label="Centro: k" value={valores.centroK ?? ''} onChange={(valor) => actualizar('centroK', valor)} status={verificado ? resultadoCampos.centroK : undefined} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Semieje mayor / a" value={valores.a ?? ''} onChange={(valor) => actualizar('a', valor)} status={verificado ? resultadoCampos.a : undefined} />
            <Campo label="Semieje menor / b" value={valores.b ?? ''} onChange={(valor) => actualizar('b', valor)} status={verificado ? resultadoCampos.b : undefined} />
          </div>

          <div className="border-t border-border/50 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Focos Geométricos</h4>
            <div className="grid gap-4 sm:grid-cols-4">
              <Campo label="Foco 1: x" value={valores.foco1X ?? ''} onChange={(valor) => actualizar('foco1X', valor)} status={verificado ? resultadoCampos.foco1X : undefined} />
              <Campo label="Foco 1: y" value={valores.foco1Y ?? ''} onChange={(valor) => actualizar('foco1Y', valor)} status={verificado ? resultadoCampos.foco1Y : undefined} />
              <Campo label="Foco 2: x" value={valores.foco2X ?? ''} onChange={(valor) => actualizar('foco2X', valor)} status={verificado ? resultadoCampos.foco2X : undefined} />
              <Campo label="Foco 2: y" value={valores.foco2Y ?? ''} onChange={(valor) => actualizar('foco2Y', valor)} status={verificado ? resultadoCampos.foco2Y : undefined} />
            </div>
          </div>

          <div className="border-t border-border/50 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Vértices Principales</h4>
            <div className="grid gap-4 sm:grid-cols-4">
              <Campo label="Vértice 1: x" value={valores.vertice1X ?? ''} onChange={(valor) => actualizar('vertice1X', valor)} status={verificado ? resultadoCampos.vertice1X : undefined} />
              <Campo label="Vértice 1: y" value={valores.vertice1Y ?? ''} onChange={(valor) => actualizar('vertice1Y', valor)} status={verificado ? resultadoCampos.vertice1Y : undefined} />
              <Campo label="Vértice 2: x" value={valores.vertice2X ?? ''} onChange={(valor) => actualizar('vertice2X', valor)} status={verificado ? resultadoCampos.vertice2X : undefined} />
              <Campo label="Vértice 2: y" value={valores.vertice2Y ?? ''} onChange={(valor) => actualizar('vertice2Y', valor)} status={verificado ? resultadoCampos.vertice2Y : undefined} />
            </div>
          </div>

          {tipo === 'elipse' && (
            <div className="border-t border-border/50 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Co-Vértices (Eje Menor)</h4>
              <div className="grid gap-4 sm:grid-cols-4">
                <Campo label="Co-Vértice 1: x" value={valores.coVertice1X ?? ''} onChange={(valor) => actualizar('coVertice1X', valor)} status={verificado ? resultadoCampos.coVertice1X : undefined} />
                <Campo label="Co-Vértice 1: y" value={valores.coVertice1Y ?? ''} onChange={(valor) => actualizar('coVertice1Y', valor)} status={verificado ? resultadoCampos.coVertice1Y : undefined} />
                <Campo label="Co-Vértice 2: x" value={valores.coVertice2X ?? ''} onChange={(valor) => actualizar('coVertice2X', valor)} status={verificado ? resultadoCampos.coVertice2X : undefined} />
                <Campo label="Co-Vértice 2: y" value={valores.coVertice2Y ?? ''} onChange={(valor) => actualizar('coVertice2Y', valor)} status={verificado ? resultadoCampos.coVertice2Y : undefined} />
              </div>
            </div>
          )}
        </div>
      );
    }

    if (tipo === 'parabola') {
      return (
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Vértice: x" value={valores.verticeX ?? ''} onChange={(valor) => actualizar('verticeX', valor)} status={verificado ? resultadoCampos.verticeX : undefined} />
            <Campo label="Vértice: y" value={valores.verticeY ?? ''} onChange={(valor) => actualizar('verticeY', valor)} status={verificado ? resultadoCampos.verticeY : undefined} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Foco: x" value={valores.focoX ?? ''} onChange={(valor) => actualizar('focoX', valor)} status={verificado ? resultadoCampos.focoX : undefined} />
            <Campo label="Foco: y" value={valores.focoY ?? ''} onChange={(valor) => actualizar('focoY', valor)} status={verificado ? resultadoCampos.focoY : undefined} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo label="Parámetro p" value={valores.p ?? ''} onChange={(valor) => actualizar('p', valor)} status={verificado ? resultadoCampos.p : undefined} />
            <Campo label="Directriz" value={valores.directriz ?? ''} onChange={(valor) => actualizar('directriz', valor)} status={verificado ? resultadoCampos.directriz : undefined} placeholder="Ej: x = 5" />
          </div>
        </div>
      );
    }

    return null;
  };

  const renderGeneralForm = () => {
    return (
      <div className="overflow-x-auto rounded-xl border border-border bg-muted/60 px-4 py-3">
        <div className="flex min-w-max items-center justify-center gap-4 font-mono text-base md:text-lg text-foreground whitespace-nowrap">
          {renderTerm(A, 'x²', 'text-primary', true)}
          {renderTerm(B, 'y²', 'text-success')}
          {renderTerm(C, 'x', 'text-warning')}
          {renderTerm(D, 'y', 'text-destructive')}
          {renderTerm(E, '', 'text-muted-foreground')}
          <span className="pl-2 text-muted-foreground">= 0</span>
        </div>
      </div>
    );
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground capitalize">{tituloSeccion}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Dada la ecuación general, calcula los parámetros de la forma canónica y los elementos geométricos correspondientes.
          </p>
        </div>
        <button
          type="button"
          onClick={verificar}
          className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary/20 cursor-pointer self-start"
        >
          Verificar respuestas
        </button>
      </div>

      {/* Referencia: Ecuación General */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Ecuación General de Referencia</h3>
        {renderGeneralForm()}
      </div>

      {/* Forma Canónica Editable */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Ecuación Canónica (Completa la Fórmula)</h3>
        {renderFormulaCanonicaEditable()}
      </div>

      {/* Elementos Geométricos Editables */}
      <div className="space-y-3 pt-2 border-t border-border/50">
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground">Elementos Geométricos</h3>
        {renderElementosGrid()}
      </div>

      {verificado && (
        <div className="rounded-xl border border-border bg-muted/50 p-4 text-xs text-foreground space-y-1">
          <p className="font-semibold text-foreground">Revisión de respuestas completada:</p>
          <p className="text-muted-foreground">
            Los campos correctos se marcan en <span className="text-success font-semibold">verde</span>. Los incorrectos en <span className="text-destructive font-semibold">rojo</span> con su valor esperado abajo para corregir rápidamente.
          </p>
        </div>
      )}

      {/* Accordion for the solution/steps */}
      <div className="mt-6 border-t border-border/50 pt-4">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer font-bold text-xs uppercase tracking-wider text-primary hover:text-primary/80 transition-colors list-none">
            <span>Ver desarrollo paso a paso (Solución de Defensa)</span>
            <span className="transition-transform group-open:rotate-180 text-sm">⌄</span>
          </summary>
          <div className="mt-4 space-y-4 rounded-xl bg-muted/60 p-4 text-xs text-foreground border border-border/30">
            <div>
              <h4 className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Transformación: General → Canónica</h4>
              <ol className="list-decimal list-inside space-y-1.5 pl-2 font-medium">
                {resultado.pasosGeneralACanonica.map((paso, idx) => (
                  <li key={idx} className="text-muted-foreground"><span className="text-foreground">{paso}</span></li>
                ))}
              </ol>
            </div>
            <div className="border-t border-border/40 pt-3">
              <h4 className="font-semibold text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Transformación: Canónica → General</h4>
              <ol className="list-decimal list-inside space-y-1.5 pl-2 font-medium">
                {resultado.pasosCanonicaAGeneral.map((paso, idx) => (
                  <li key={idx} className="text-muted-foreground"><span className="text-foreground">{paso}</span></li>
                ))}
              </ol>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}