'use client';

import React, { useMemo } from 'react';
import { useLimitesContext } from './LimitesContext';

// ─── Math helpers ─────────────────────────────────────────────────────────────

function buildPoints(
  a: number,
  a1: number,
  a2: number,
  b1: number,
  m: number,
  n: number
) {
  const f1 = (x: number) => a1 * x * x + a2 * x - b1;
  const f2 = (x: number) => m * x + n;

  const leftPts: { x: number; y: number }[] = [];
  const rightPts: { x: number; y: number }[] = [];

  // Use integer steps to avoid floating-point drift that caused leftPts to be
  // empty: instead of accumulating xi += 0.1 (which drifts), compute each xi
  // from scratch using an integer index so the split at `a` is always exact.
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

// ─── SVG coordinate helpers ───────────────────────────────────────────────────

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
    .map(({ x, y }) => {
      const { sx, sy } = toSVG(x, y, xMin, xMax, yMin, yMax, svgW, svgH, pad);
      return `${sx},${sy}`;
    })
    .join(' ');
}

// ─── Component ────────────────────────────────────────────────────────────────

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

    const { leftPts, rightPts } = buildPoints(a, a1, a2, b1, m, n);

    const allY = [...leftPts, ...rightPts].map((p) => p.y);
    const rawYMin = Math.min(...allY, limIzquierda, limDerecha);
    const rawYMax = Math.max(...allY, limIzquierda, limDerecha);
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

  // Convert function points to polyline strings
  const leftLine = pointsToPolyline(leftPts, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);
  const rightLine = pointsToPolyline(rightPts, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);

  // Critical vertical line x = a
  const { sx: critX } = toSVG(a, 0, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);

  // X-axis (y = 0) — clamp if 0 not in range
  const axisY0 = yMin <= 0 && yMax >= 0
    ? toSVG(0, 0, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD).sy
    : SVG_H - PAD;

  // Limit points
  const leftPt = toSVG(a, limIzquierda, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);
  const rightPt = toSVG(a, limDerecha, xMin, xMax, yMin, yMax, SVG_W, SVG_H, PAD);

  // X-axis tick labels
  const xTicks = [-3, -2, -1, 0, 1, 2, 3].map((d) => a + d);

  // Y-axis tick labels (5 evenly spaced)
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

      {/* SVG Graph */}
      <div className="w-full overflow-x-auto rounded-xl border border-border bg-muted/40 p-2">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ height: 300 }}
          aria-label="Gráfico de la función por tramos"
        >
          {/* ── Grid lines (light) ── */}
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

          {/* ── X axis ── */}
          <line
            x1={PAD}
            y1={axisY0}
            x2={SVG_W - PAD}
            y2={axisY0}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />

          {/* ── Y axis (at x = xMin for simplicity, i.e., left edge) ── */}
          <line
            x1={PAD}
            y1={PAD}
            x2={PAD}
            y2={SVG_H - PAD}
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />

          {/* ── X-axis tick labels ── */}
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

          {/* ── Y-axis tick labels ── */}
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

          {/* ── Critical vertical dashed line ── */}
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

          {/* ── Tramo 1 (f1, x < a) — blue ── */}
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

          {/* ── Tramo 2 (f2, x ≥ a) — violet/secondary ── */}
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

          {/* ── Limit points ── */}
          {isContinua ? (
            // Both filled green
            <circle cx={leftPt.sx} cy={leftPt.sy} r={6} fill="hsl(142 71% 45%)" stroke="white" strokeWidth={2} />
          ) : (
            <>
              {/* Left limit: open circle */}
              <circle
                cx={leftPt.sx}
                cy={leftPt.sy}
                r={6}
                fill="var(--card)"
                stroke="var(--primary)"
                strokeWidth={2.5}
              />
              {/* Right limit: filled */}
              <circle
                cx={rightPt.sx}
                cy={rightPt.sy}
                r={6}
                fill="oklch(0.6 0.18 280)"
                stroke="white"
                strokeWidth={2}
              />
            </>
          )}

          {/* ── Limit value labels near points ── */}
          {!modoDefensa && (
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
          {!isContinua && !modoDefensa && (
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

      {/* ── Legend ── */}
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
