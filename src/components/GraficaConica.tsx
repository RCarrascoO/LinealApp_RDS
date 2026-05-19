'use client';

import { Mafs, Coordinates, Plot, Circle, Ellipse, Point, Text } from 'mafs';
import { ConicaResult } from '../lib/clasificarConica';
import {
  puntosCircunferencia,
  puntosElipse,
  puntosHiperbola,
  puntosParabola,
  raizCuadrada
} from '../lib/puntosGrafica';

interface Props {
  resultado: ConicaResult;
}

/**
 * Componente que renderiza la gráfica de una cónica usando Mafs
 */
export function GraficaConica({ resultado }: Props) {
  const { tipo, formaCanonica } = resultado;

  // Extraer parámetros de la forma canónica
  const h = formaCanonica.centro?.h ?? 0;
  const k = formaCanonica.centro?.k ?? 0;

  /**
   * Calcula los límites del viewBox basándose en la cónica
   */
  function calcularLimites() {
    let margin = 2;
    let maxDim = 10;

    switch (tipo) {
      case 'circunferencia': {
        const r = formaCanonica.radio ?? 5;
        maxDim = r + 3;
        break;
      }
      case 'elipse': {
        const a = formaCanonica.semiEjeMayor ?? 5;
        maxDim = a + 2;
        break;
      }
      case 'hiperbola': {
        const a = formaCanonica.a ?? 3;
        maxDim = a * 3;
        margin = 3;
        break;
      }
      case 'parabola': {
        const p = formaCanonica.p ?? 1;
        maxDim = Math.abs(p) * 10 + 5;
        break;
      }
    }

    return {
      xMin: h - maxDim - margin,
      xMax: h + maxDim + margin,
      yMin: k - maxDim - margin,
      yMax: k + maxDim + margin
    };
  }

  const limites = calcularLimites();

  /**
   * Renderiza una circunferencia
   */
  function renderCircunferencia() {
    const puntos = puntosCircunferencia(h, k, formaCanonica.radio ?? 5);
    const radio = puntos.radio ?? 5;

    return (
      <>
        <Circle center={[h, k]} radius={radio} color="#2563eb" strokeOpacity={0.8} />
        {/* Centro */}
        <Point x={h} y={k} color="#f97316" />
        <Text x={h} y={k + 0.8} size={14} color="#f97316">
          C({h.toFixed(1)}, {k.toFixed(1)})
        </Text>
      </>
    );
  }

  /**
   * Renderiza una elipse
   */
  function renderElipse() {
    const puntos = puntosElipse(h, k, formaCanonica.a ?? 5, formaCanonica.b ?? 3);
    const a = formaCanonica.a ?? 5;
    const b = formaCanonica.b ?? 3;
    const c = raizCuadrada(a * a - b * b);

    return (
      <>
        <Ellipse center={[h, k]} radius={[a, b]} color="#2563eb" strokeOpacity={0.8} />

        {/* Centro */}
        <Point x={h} y={k} color="#f97316" />
        <Text x={h - 1.5} y={k - 1} size={12} color="#f97316">
          C({h.toFixed(1)}, {k.toFixed(1)})
        </Text>

        {/* Focos */}
        {puntos.eje === 'horizontal' ? (
          <>
            <Point x={h + c} y={k} color="#dc2626" />
            <Point x={h - c} y={k} color="#dc2626" />
            <Text x={h + c} y={k - 0.8} size={11} color="#dc2626">
              F({(h + c).toFixed(1)}, {k.toFixed(1)})
            </Text>
          </>
        ) : (
          <>
            <Point x={h} y={k + c} color="#dc2626" />
            <Point x={h} y={k - c} color="#dc2626" />
            <Text x={h + 0.8} y={k + c} size={11} color="#dc2626">
              F({h.toFixed(1)}, {(k + c).toFixed(1)})
            </Text>
          </>
        )}

        {/* Vértices */}
        {puntos.eje === 'horizontal' ? (
          <>
            <Point x={h + a} y={k} color="#0ea5e9" />
            <Point x={h - a} y={k} color="#0ea5e9" />
          </>
        ) : (
          <>
            <Point x={h} y={k + a} color="#0ea5e9" />
            <Point x={h} y={k - a} color="#0ea5e9" />
          </>
        )}
      </>
    );
  }

  /**
   * Renderiza una hipérbola con asíntotas
   */
  function renderHiperbola() {
    const a = formaCanonica.a ?? 3;
    const b = formaCanonica.b ?? 2;
    const c = raizCuadrada(a * a + b * b);
    const puntos = puntosHiperbola(h, k, a, b, formaCanonica.eje === 'horizontal', 40, 0.1);

    // Asíntotas
    const pendiente1 = puntos.eje === 'horizontal' ? b / a : a / b;
    const pendiente2 = -pendiente1;

    return (
      <>
        {/* Asíntotas punteadas */}
        <Plot.OfX
          y={(x) => k + pendiente1 * (x - h)}
          color="#9ca3af"
          opacity={0.5}
        />
        <Plot.OfX
          y={(x) => k + pendiente2 * (x - h)}
          color="#9ca3af"
          opacity={0.5}
        />

        {/* Ramas de la hipérbola */}
        <Plot.OfX
          y={(x) => {
            if (puntos.eje !== 'horizontal') {
              return Number.NaN;
            }
            const relativo = (x - h) / a;
            const discriminante = relativo * relativo - 1;
            if (discriminante < 0) return Number.NaN;
            const raiz = raizCuadrada(discriminante);
            return k + b * raiz;
          }}
          color="#2563eb"
          opacity={0.8}
        />

        <Plot.OfX
          y={(x) => {
            if (puntos.eje !== 'horizontal') {
              return Number.NaN;
            }
            const relativo = (x - h) / a;
            const discriminante = relativo * relativo - 1;
            if (discriminante < 0) return Number.NaN;
            const raiz = raizCuadrada(discriminante);
            return k - b * raiz;
          }}
          color="#2563eb"
          opacity={0.8}
        />

        <Plot.OfY
          x={(y) => {
            if (puntos.eje !== 'vertical') {
              return Number.NaN;
            }
            const relativo = (y - k) / a;
            const discriminante = relativo * relativo - 1;
            if (discriminante < 0) return Number.NaN;
            const raiz = raizCuadrada(discriminante);
            return h + b * raiz;
          }}
          color="#2563eb"
          opacity={0.8}
        />

        <Plot.OfY
          x={(y) => {
            if (puntos.eje !== 'vertical') {
              return Number.NaN;
            }
            const relativo = (y - k) / a;
            const discriminante = relativo * relativo - 1;
            if (discriminante < 0) return Number.NaN;
            const raiz = raizCuadrada(discriminante);
            return h - b * raiz;
          }}
          color="#2563eb"
          opacity={0.8}
        />

        {/* Centro */}
        <Point x={h} y={k} color="#f97316" />

        {/* Focos */}
        {puntos.eje === 'horizontal' ? (
          <>
            <Point x={h + c} y={k} color="#dc2626" />
            <Point x={h - c} y={k} color="#dc2626" />
          </>
        ) : (
          <>
            <Point x={h} y={k + c} color="#dc2626" />
            <Point x={h} y={k - c} color="#dc2626" />
          </>
        )}

        {/* Vértices */}
        {puntos.eje === 'horizontal' ? (
          <>
            <Point x={h + a} y={k} color="#0ea5e9" />
            <Point x={h - a} y={k} color="#0ea5e9" />
          </>
        ) : (
          <>
            <Point x={h} y={k + a} color="#0ea5e9" />
            <Point x={h} y={k - a} color="#0ea5e9" />
          </>
        )}
      </>
    );
  }

  /**
   * Renderiza una parábola con directriz
   */
  function renderParabola() {
    const p = formaCanonica.p ?? 1;
    const esVertical = formaCanonica.eje === 'vertical';
    puntosParabola(h, k, p, esVertical, 40, 0.1);

    // Foco
    const focoX = esVertical ? h : h + p;
    const focoY = esVertical ? k + p : k;

    // Directriz
    const directrizX = esVertical ? h : h - p;
    const directrizY = esVertical ? k - p : k;

    return (
      <>
        {/* Parábola */}
        {esVertical ? (
          <Plot.OfX
            y={(x) => {
              return k + ((x - h) * (x - h)) / (4 * p);
            }}
            color="#2563eb"
            opacity={0.8}
          />
        ) : (
          <Plot.OfY
            x={(y) => {
              return h + ((y - k) * (y - k)) / (4 * p);
            }}
            color="#2563eb"
            opacity={0.8}
          />
        )}

        {/* Directriz punteada */}
        {esVertical ? (
          <Plot.OfX
            y={() => directrizY}
            color="#9ca3af"
            opacity={0.5}
          />
        ) : (
          <Plot.OfY
            x={() => directrizX}
            color="#9ca3af"
            opacity={0.5}
          />
        )}

        {/* Vértice */}
        <Point x={h} y={k} color="#f97316" />
        <Text x={h} y={k + 0.8} size={12} color="#f97316">
          V({h.toFixed(1)}, {k.toFixed(1)})
        </Text>

        {/* Foco */}
        <Point x={focoX} y={focoY} color="#dc2626" />
        <Text x={focoX + 0.5} y={focoY + 0.8} size={11} color="#dc2626">
          F({focoX.toFixed(1)}, {focoY.toFixed(1)})
        </Text>
      </>
    );
  }

  /**
   * Renderiza la cónica según su tipo
   */
  function renderConica() {
    switch (tipo) {
      case 'circunferencia':
        return renderCircunferencia();
      case 'elipse':
        return renderElipse();
      case 'hiperbola':
        return renderHiperbola();
      case 'parabola':
        return renderParabola();
      default:
        return null;
    }
  }

  return (
    <div className="academic-card space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Visualización</p>
          <h2 className="text-2xl font-bold text-foreground">Gráfica de la cónica</h2>
        </div>
        <div className="flex gap-2 text-xs font-semibold text-muted-foreground">
          <span className="rounded-full border border-border bg-muted px-2.5 py-1">+</span>
          <span className="rounded-full border border-border bg-muted px-2.5 py-1">−</span>
          <span className="rounded-full border border-border bg-muted px-2.5 py-1">↺</span>
        </div>
      </div>

      <div className="relative h-96 w-full overflow-hidden rounded-xl border border-border bg-muted/20 graph-grid">
        <Mafs
          viewBox={{
            x: [limites.xMin, limites.xMax],
            y: [limites.yMin, limites.yMax]
          }}
          preserveAspectRatio="contain"
        >
          <Coordinates.Cartesian />
          {renderConica()}
        </Mafs>
      </div>

      {/* Leyenda de colores */}
      <div className="grid grid-cols-2 gap-4 text-sm text-foreground">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
          <span>Centro/Vértice</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-600 rounded-full"></span>
          <span>Focos</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-sky-500 rounded-full"></span>
          <span>Vértices</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-gray-400" style={{ borderStyle: 'dashed' }}></span>
          <span>Asíntotas / Directriz</span>
        </div>
      </div>
    </div>
  );
}
