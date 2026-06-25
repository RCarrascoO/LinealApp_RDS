'use client';

import React, { useMemo } from 'react';
import { useLimitesContext } from './LimitesContext';

// ─── Funciones auxiliares matemáticas ─────────────────────────────────────────

function buildPoints(
  a: number,
  a1: number,
  a2: number,
  b1: number,
  m: number,
  n: number,
  tipoDiscontinuidad: string
) {
  let f1: (x: number) => number;
  let f2: (x: number) => number;

  if (tipoDiscontinuidad === 'removible') {
    f1 = (x: number) => x === a ? NaN : x + a1;
    f2 = f1;
  } else if (tipoDiscontinuidad === 'salto') {
    f1 = (x: number) => a1 * x - b1;
    f2 = (x: number) => m * x + n;
  } else if (tipoDiscontinuidad === 'infinita') {
    const numerador = n + 1;
    f1 = (x: number) => numerador / (x - a);
    f2 = f1;
  } else {
    // por defecto
    f1 = (x: number) => a1 * x * x + a2 * x - b1;
    f2 = (x: number) => m * x + n;
  }

  const leftPts: { x: number; y: number }[] = [];
  const rightPts: { x: number; y: number }[] = [];

  const STEPS = 60; // covers [a-3, a+3] in 0.1 increments → 60 intervals
  for (let i = 0; i <= STEPS; i++) {
    const xi = Math.round((a - 3 + i * 0.1) * 1e9) / 1e9;
    if (xi < a) {
      leftPts.push({ x: xi, y: f1(xi) });
    } else {
      rightPts.push({ x: xi, y: f2(xi) });
    }
  }
  return { leftPts, rightPts, f1, f2 };
}

// ─── Auxiliares de coordenadas SVG ──────────────────────────────────────────

function toSVG(
  x: number,
  y: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  svgW: number,
  svgH: number,
  pad: number
) {
  const plotW = svgW - 2 * pad;
  const plotH = svgH - 2 * pad;
  const sx = pad + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = pad + ((yMax - y) / (yMax - yMin)) * plotH;
  return { sx, sy };
}

function pointsToPolyline(
  pts: { x: number; y: number }[],
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  svgW: number,
  svgH: number,
  pad: number
) {
  return pts
    .filter(p => Number.isFinite(p.y))
    .map(({ x, y }) => {
      // Limitar Y fuertemente para que no rompa el viewBox del SVG si es asintótica
      const clampedY = Math.max(yMin - 100, Math.min(yMax + 100, y));
      const { sx, sy } = toSVG(x, clampedY, xMin, xMax, yMin, yMax, svgW, svgH, pad);
      return `${sx},${sy}`;
    })
    .join(' ');
}

// ─── Componente ───────────────────────────────────────────────────────────────

const SVG_W = 600;
const SVG_H = 300;
const PAD = 48;

export function GraficoFuncionLimites() {
  const { resultado } = useLimitesContext();
  const [modoDefensa, setModoDefensa] = React.useState(true);

  const data = useMemo(() => {
    if (!resultado) return null;
    const { a, coeficientes, limIzquierda, limDerecha, tipoDiscontinuidad } = resultado;
    const { a1, a2, b1, m, n } = coeficientes;

    const { leftPts, rightPts } = buildPoints(a, a1, a2, b1, m, n, tipoDiscontinuidad);

    // Limitar el rango Y fuertemente si es infinita para evitar perder el zoom
    let allY = [...leftPts, ...rightPts].map((p) => p.y).filter(Number.isFinite);
    if (tipoDiscontinuidad === 'infinita') {
       allY = allY.filter(y => y > -200 && y < 200); // Excluir asíntotas extremas del cuadro delimitador
    }

    const validLimI = Number.isFinite(limIzquierda) ? limIzquierda : null;
    const validLimD = Number.isFinite(limDerecha) ? limDerecha : null;
    
    if (validLimI !== null) allY.push(validLimI);
    if (validLimD !== null) allY.push(validLimD);

    if (allY.length === 0) {
      allY = [-10, 10];
    }

    const rawYMin = Math.min(...allY);
    const rawYMax = Math.max(...allY);
    const yPad = Math.max((rawYMax - rawYMin) * 0.15, 1);

    return {
      a,
      leftPts,
      rightPts,
      limIzquierda,
      limDerecha,
      tipoDiscontinuidad,
      xMin: a - 3,
      xMax: a + 3,
      yMin: rawYMin - yPad,
      yMax: rawYMax + yPad,
    };
  }, [resultado]);

  if (!data) {
    return (
      <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">Gráfico de la Función por Tramos</h3>
          <p className="text-sm text-muted-foreground">Ingresa un RUT para visualizar la gráfica.</p>
        </div>
        <div className="flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/50 py-10">
          <p className="text-sm text-muted-foreground">Esperando análisis de RUT…</p>
        </div>
      </section>
    );
  }

  const { a, leftPts, rightPts, limIzquierda, limDerecha, tipoDiscontinuidad, xMin, xMax, yMin, yMax } = data;
  const isContinua = tipoDiscontinuidad === 'continua';

  // Convertir los puntos de la función a cadenas para polyline
  const leftLine = pointsToPolyline(leftPts, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);
  const rightLine = pointsToPolyline(rightPts, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);

  // Línea vertical crítica x = a
  const { sx: critX } = toSVG(a, 0, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);

  // Eje X (y = 0) — limitar si 0 no está en el rango
  const axisY0 = yMin <= 0 && yMax >= 0
    ? toSVG(0, 0, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD).sy
    : SVG_H - PAD;

  // Puntos de límite
  const leftPt = toSVG(a, limIzquierda, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);
  const rightPt = toSVG(a, limDerecha, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);

  // Etiquetas del eje X
  const xTicks = [-3, -2, -1, 0, 1, 2, 3].map((d) => a + d);

  // Etiquetas del eje Y (5 espaciadas uniformemente)
  const yRange = yMax - yMin;
  const yStep = yRange / 4;
  const yTicks = [0, 1, 2, 3, 4].map((i) => yMin + i * yStep);

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">Gráfico de la Función por Tramos</h3>
          <p className="text-sm text-muted-foreground">
            Visualización de ambos tramos con el punto crítico{' '}
            <span className="font-mono font-semibold text-primary">x = {a}</span> marcado.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm cursor-pointer hover:bg-primary/10 transition-colors">
            <input 
              type="checkbox" 
              checked={modoDefensa}
              onChange={(e) => setModoDefensa(e.target.checked)}
              className="accent-primary"
            />
            <span className="font-medium text-primary">Modo Defensa</span>
          </label>
        </div>
      </div>

      {/* Gráfico SVG */}
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-muted/40 p-2">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ height: 300 }}
          aria-label="Gráfico de la función por tramos"
        >
          {/* ── Líneas de cuadrícula (claras) ── */}
          {yTicks.map((yv) => {
            const { sy } = toSVG(0, yv, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);
            return (
              <line
                key={`grid-y-${yv}`}
                x1={PAD}
                y1={sy}
                x2={SVG_W - PAD}
                y2={sy}
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={1}
              />
            );
          })}

          {/* ── Eje X ── */}
          <line
            x1={PAD}
            y1={axisY0}
            x2={SVG_W - PAD}
            y2={axisY0}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />

          {/* ── Eje Y (en x = xMin para simplicidad, i.e., borde izquierdo) ── */}
          <line
            x1={PAD}
            y1={PAD}
            x2={PAD}
            y2={SVG_H - PAD}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />

          {/* ── Etiquetas del eje X ── */}
          {xTicks.map((xv) => {
            const { sx } = toSVG(xv, 0, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);
            return (
              <g key={`xtick-${xv}`}>
                <line x1={sx} y1={axisY0 - 3} x2={sx} y2={axisY0 + 3} stroke="currentColor" strokeOpacity={0.3} />
                {!modoDefensa && (
                  <text
                    x={sx}
                    y={axisY0 + 14}
                    textAnchor="middle"
                    fontSize={9}
                    fill="currentColor"
                    fillOpacity={0.5}
                  >
                    {Number(xv.toFixed(2))}
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Etiquetas del eje Y ── */}
          {!modoDefensa && yTicks.map((yv) => {
            const { sy } = toSVG(0, yv, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);
            return (
              <text
                key={`ytick-${yv}`}
                x={PAD - 6}
                y={sy + 3}
                textAnchor="end"
                fontSize={9}
                fill="currentColor"
                fillOpacity={0.5}
              >
                {yv.toFixed(1)}
              </text>
            );
          })}

          {/* ── Línea punteada vertical crítica ── */}
          <line
            x1={critX}
            y1={PAD}
            x2={critX}
            y2={SVG_H - PAD}
            stroke="var(--primary)"
            strokeOpacity={0.4}
            strokeWidth={1.5}
            strokeDasharray="5,4"
          />
          {!modoDefensa && (
            <text
              x={critX + 4}
              y={PAD + 12}
              fontSize={9}
              fill="var(--primary)"
              fillOpacity={0.8}
            >
              x = {a}
            </text>
          )}

          {/* ── Tramo 1 (f1, x < a) — azul ── */}
          {leftPts.length > 1 && (
            <polyline
              points={leftLine}
              fill="none"
              stroke="var(--primary)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* ── Tramo 2 (f2, x ≥ a) — violeta/secundario ── */}
          {rightPts.length > 1 && (
            <polyline
              points={rightLine}
              fill="none"
              stroke="var(--secondary-foreground, #a855f7)"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{ stroke: 'oklch(0.6 0.18 280)' }}
            />
          )}

          {/* ── Puntos límite ── */}
          {isContinua ? (
            // Ambos rellenos de verde
            Number.isFinite(limIzquierda) && <circle cx={leftPt.sx} cy={leftPt.sy} r={6} fill="hsl(142 71% 45%)" stroke="white" strokeWidth={2} />
          ) : (
            <>
              {/* Límite izquierdo: círculo abierto */}
              {Number.isFinite(limIzquierda) && <circle
                cx={leftPt.sx}
                cy={leftPt.sy}
                r={6}
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth={2.5}
              />}
              {/* Límite derecho: relleno */}
              {Number.isFinite(limDerecha) && <circle
                cx={rightPt.sx}
                cy={rightPt.sy}
                r={6}
                fill="oklch(0.6 0.18 280)"
                stroke="white"
                strokeWidth={2}
              />}
            </>
          )}

          {/* ── Etiquetas de valor de límite cerca de los puntos ── */}
          {!modoDefensa && Number.isFinite(limIzquierda) && (
            <text
              x={leftPt.sx - 10}
              y={leftPt.sy - 10}
              fontSize={9}
              fill="var(--primary)"
              textAnchor="middle"
            >
              {limIzquierda.toFixed(2)}
            </text>
          )}
          {!isContinua && !modoDefensa && Number.isFinite(limDerecha) && (
            <text
              x={rightPt.sx + 10}
              y={rightPt.sy - 10}
              fontSize={9}
              fill="oklch(0.6 0.18 280)"
              textAnchor="middle"
            >
              {limDerecha.toFixed(2)}
            </text>
          )}
        </svg>
      </div>

      {/* ── Leyenda ── */}
      <div className="flex flex-wrap items-center gap-4 px-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-6 rounded bg-primary" />
          Tramo 1 (x &lt; {a})
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-0.5 w-6 rounded" style={{ background: 'oklch(0.6 0.18 280)' }} />
          Tramo 2 (x ≥ {a})
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-full border-2"
            style={{ borderColor: 'var(--primary)', background: 'transparent' }}
          />
          Límite por izquierda
        </span>
        {!isContinua && (
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-full border-2"
              style={{ background: 'oklch(0.6 0.18 280)', borderColor: 'oklch(0.6 0.18 280)' }}
            />
            Límite por derecha
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-0 border-r-2 border-dashed border-primary/60" />
          Punto crítico x = {a}
        </span>
      </div>
    </section>
  );
}
