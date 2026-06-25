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
  toggles?: Record<string, boolean>;
  modoDefensa?: boolean;
  zoom?: number;
}

/**
 * Componente que renderiza la gráfica de una cónica usando Mafs
 */
export function GraficaConica({ resultado, toggles, modoDefensa, zoom }: Props) {
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
        const a = Math.max(formaCanonica.a ?? 5, formaCanonica.b ?? 5);
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

    const currentZoom = zoom ?? 1;
    const halfWidth = (maxDim + margin) * currentZoom;

    return {
      xMin: h - halfWidth,
      xMax: h + halfWidth,
      yMin: k - halfWidth,
      yMax: k + halfWidth
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
        {toggles?.points ?? true ? (
          <>
            <Point x={h} y={k} color="#f97316" />
            {!modoDefensa && (
              <Text x={h} y={k + 0.8} size={14} color="#f97316">
                C({h.toFixed(1)}, {k.toFixed(1)})
              </Text>
            )}
          </>
        ) : null}
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
        {toggles?.points ?? true ? (
          <>
            <Point x={h} y={k} color="#f97316" />
            {!modoDefensa && (
              <Text x={h - 1.5} y={k - 1} size={12} color="#f97316">
                C({h.toFixed(1)}, {k.toFixed(1)})
              </Text>
            )}
          </>
        ) : null}

        {/* Focos */}
        {toggles?.foci ?? true ? (
          puntos.eje === 'horizontal' ? (
            <>
              <Point x={h + c} y={k} color="#dc2626" />
              <Point x={h - c} y={k} color="#dc2626" />
              {!modoDefensa && (
                <>
                  <Text x={h + c} y={k - 0.8} size={11} color="#dc2626">
                    F({(h + c).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                  <Text x={h - c} y={k - 0.8} size={11} color="#dc2626">
                    F({(h - c).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                </>
              )}
            </>
          ) : (
            <>
              <Point x={h} y={k + c} color="#dc2626" />
              <Point x={h} y={k - c} color="#dc2626" />
              {!modoDefensa && (
                <>
                  <Text x={h + 0.8} y={k + c} size={11} color="#dc2626">
                    F({h.toFixed(1)}, {(k + c).toFixed(1)})
                  </Text>
                  <Text x={h + 0.8} y={k - c} size={11} color="#dc2626">
                    F({h.toFixed(1)}, {(k - c).toFixed(1)})
                  </Text>
                </>
              )}
            </>
          )
        ) : null}

        {/* Vértices Mayores y Menores */}
        {toggles?.vertices ?? true ? (
          puntos.eje === 'horizontal' ? (
            <>
              {/* Eje Mayor */}
              <Point x={h + a} y={k} color="#0ea5e9" />
              <Point x={h - a} y={k} color="#0ea5e9" />
              {/* Eje Menor */}
              <Point x={h} y={k + b} color="#0ea5e9" />
              <Point x={h} y={k - b} color="#0ea5e9" />
              
              {!modoDefensa && (
                <>
                  <Text x={h + a} y={k + 0.8} size={11} color="#0ea5e9">
                    V({(h + a).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                  <Text x={h - a} y={k + 0.8} size={11} color="#0ea5e9">
                    V({(h - a).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                  <Text x={h + 0.8} y={k + b} size={11} color="#0ea5e9">
                    V({h.toFixed(1)}, {(k + b).toFixed(1)})
                  </Text>
                  <Text x={h + 0.8} y={k - b} size={11} color="#0ea5e9">
                    V({h.toFixed(1)}, {(k - b).toFixed(1)})
                  </Text>
                </>
              )}
            </>
          ) : (
            <>
              {/* Eje Mayor */}
              <Point x={h} y={k + a} color="#0ea5e9" />
              <Point x={h} y={k - a} color="#0ea5e9" />
              {/* Eje Menor */}
              <Point x={h + b} y={k} color="#0ea5e9" />
              <Point x={h - b} y={k} color="#0ea5e9" />
              
              {!modoDefensa && (
                <>
                  <Text x={h + 0.8} y={k + a} size={11} color="#0ea5e9">
                    V({h.toFixed(1)}, {(k + a).toFixed(1)})
                  </Text>
                  <Text x={h + 0.8} y={k - a} size={11} color="#0ea5e9">
                    V({h.toFixed(1)}, {(k - a).toFixed(1)})
                  </Text>
                  <Text x={h + b} y={k + 0.8} size={11} color="#0ea5e9">
                    V({(h + b).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                  <Text x={h - b} y={k + 0.8} size={11} color="#0ea5e9">
                    V({(h - b).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                </>
              )}
            </>
          )
        ) : null}
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
    // Determinar orientación directamente desde formaCanonica para evitar closures obsoletos
    const esHorizontal = formaCanonica.eje === 'horizontal';

    // Asíntotas: pendiente depende del eje
    // Horizontal: y = ±(b/a)(x-h)+k  |  Vertical: y = ±(a/b)(x-h)+k
    const pendiente1 = esHorizontal ? b / a : a / b;
    const pendiente2 = -pendiente1;

    return (
      <>
        {/* Asíntotas punteadas */}
        {toggles?.asymptotes ?? false ? (
          <>
            <Plot.OfX
              y={(x) => k + pendiente1 * (x - h)}
              color="#9ca3af"
              opacity={0.5}
              style="dashed"
            />
            <Plot.OfX
              y={(x) => k + pendiente2 * (x - h)}
              color="#9ca3af"
              opacity={0.5}
              style="dashed"
            />
          </>
        ) : null}

        {/* Ramas de la hipérbola */}

        {/* --- HIPÉRBOLA HORIZONTAL: (x-h)²/a² - (y-k)²/b² = 1 --- */}
        {/* Rama derecha: x = h + a·√(1 + (y-k)²/b²) */}
        <Plot.OfY
          x={(y) => {
            if (!esHorizontal) return Number.NaN;
            const relativo = (y - k) / b;
            return h + a * raizCuadrada(1 + relativo * relativo);
          }}
          color="#2563eb"
          opacity={0.8}
        />
        {/* Rama izquierda: x = h - a·√(1 + (y-k)²/b²) */}
        <Plot.OfY
          x={(y) => {
            if (!esHorizontal) return Number.NaN;
            const relativo = (y - k) / b;
            return h - a * raizCuadrada(1 + relativo * relativo);
          }}
          color="#2563eb"
          opacity={0.8}
        />

        {/* --- HIPÉRBOLA VERTICAL: (y-k)²/a² - (x-h)²/b² = 1 --- */}
        {/* Rama superior: y = k + a·√(1 + (x-h)²/b²) */}
        <Plot.OfX
          y={(x) => {
            if (esHorizontal) return Number.NaN;
            const relativo = (x - h) / b;
            return k + a * raizCuadrada(1 + relativo * relativo);
          }}
          color="#2563eb"
          opacity={0.8}
        />
        {/* Rama inferior: y = k - a·√(1 + (x-h)²/b²) */}
        <Plot.OfX
          y={(x) => {
            if (esHorizontal) return Number.NaN;
            const relativo = (x - h) / b;
            return k - a * raizCuadrada(1 + relativo * relativo);
          }}
          color="#2563eb"
          opacity={0.8}
        />

        {/* Centro */}
        {toggles?.points ?? true ? (
          <>
            <Point x={h} y={k} color="#f97316" />
            {!modoDefensa && (
              <Text x={h - 1.5} y={k - 1} size={12} color="#f97316">
                C({h.toFixed(1)}, {k.toFixed(1)})
              </Text>
            )}
          </>
        ) : null}

        {/* Focos */}
        {toggles?.foci ?? true ? (
          esHorizontal ? (
            <>
              <Point x={h + c} y={k} color="#dc2626" />
              <Point x={h - c} y={k} color="#dc2626" />
              {!modoDefensa && (
                <>
                  <Text x={h + c} y={k - 0.8} size={11} color="#dc2626">
                    F({(h + c).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                  <Text x={h - c} y={k - 0.8} size={11} color="#dc2626">
                    F({(h - c).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                </>
              )}
            </>
          ) : (
            <>
              <Point x={h} y={k + c} color="#dc2626" />
              <Point x={h} y={k - c} color="#dc2626" />
              {!modoDefensa && (
                <>
                  <Text x={h + 0.8} y={k + c} size={11} color="#dc2626">
                    F({h.toFixed(1)}, {(k + c).toFixed(1)})
                  </Text>
                  <Text x={h + 0.8} y={k - c} size={11} color="#dc2626">
                    F({h.toFixed(1)}, {(k - c).toFixed(1)})
                  </Text>
                </>
              )}
            </>
          )
        ) : null}

        {/* Vértices */}
        {toggles?.vertices ?? true ? (
          esHorizontal ? (
            <>
              <Point x={h + a} y={k} color="#0ea5e9" />
              <Point x={h - a} y={k} color="#0ea5e9" />
              {!modoDefensa && (
                <>
                  <Text x={h + a} y={k + 0.8} size={11} color="#0ea5e9">
                    V({(h + a).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                  <Text x={h - a} y={k + 0.8} size={11} color="#0ea5e9">
                    V({(h - a).toFixed(1)}, {k.toFixed(1)})
                  </Text>
                </>
              )}
            </>
          ) : (
            <>
              <Point x={h} y={k + a} color="#0ea5e9" />
              <Point x={h} y={k - a} color="#0ea5e9" />
              {!modoDefensa && (
                <>
                  <Text x={h + 0.8} y={k + a} size={11} color="#0ea5e9">
                    V({h.toFixed(1)}, {(k + a).toFixed(1)})
                  </Text>
                  <Text x={h + 0.8} y={k - a} size={11} color="#0ea5e9">
                    V({h.toFixed(1)}, {(k - a).toFixed(1)})
                  </Text>
                </>
              )}
            </>
          )
        ) : null}
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
        {toggles?.directrix ?? false ? (
          esVertical ? (
            <Plot.OfX
              y={() => directrizY}
              color="#9ca3af"
              opacity={0.5}
              style="dashed"
            />
          ) : (
            <Plot.OfY
              x={() => directrizX}
              color="#9ca3af"
              opacity={0.5}
              style="dashed"
            />
          )
        ) : null}

        {/* Vértice */}
        {toggles?.points ?? true ? (
          <>
            <Point x={h} y={k} color="#f97316" />
            {!modoDefensa && (
              <Text x={h} y={k + 0.8} size={12} color="#f97316">
                V({h.toFixed(1)}, {k.toFixed(1)})
              </Text>
            )}
          </>
        ) : null}

        {/* Foco */}
        {toggles?.foci ?? true ? (
          <>
            <Point x={focoX} y={focoY} color="#dc2626" />
            {!modoDefensa && (
              <Text x={focoX + 0.5} y={focoY + 0.8} size={11} color="#dc2626">
                F({focoX.toFixed(1)}, {focoY.toFixed(1)})
              </Text>
            )}
          </>
        ) : null}
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


      <div className="relative h-96 w-full overflow-hidden rounded-xl border border-border bg-muted graph-grid">
        <Mafs
          viewBox={{
            x: [limites.xMin, limites.xMax],
            y: [limites.yMin, limites.yMax]
          }}
          preserveAspectRatio={true}
        >
          <Coordinates.Cartesian />
          {renderConica()}
        </Mafs>
      </div>

      {/* Leyenda de colores dinámica */}
      <div className="grid grid-cols-2 gap-4 text-sm text-foreground">
        {tipo === 'circunferencia' && (
          <>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#f97316]"></span>
              <span>Centro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#2563eb]"></span>
              <span>Línea Circunferencia</span>
            </div>
          </>
        )}
        
        {(tipo === 'elipse' || tipo === 'hiperbola') && (
          <>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#f97316]"></span>
              <span>Centro</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-destructive"></span>
              <span>Focos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#0ea5e9]"></span>
              <span>Vértices</span>
            </div>
          </>
        )}

        {tipo === 'hiperbola' && (
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-muted-foreground" style={{ borderStyle: 'dashed' }}></span>
            <span>Asíntotas</span>
          </div>
        )}

        {tipo === 'parabola' && (
          <>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-[#f97316]"></span>
              <span>Vértice</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-destructive"></span>
              <span>Foco</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-muted-foreground" style={{ borderStyle: 'dashed' }}></span>
              <span>Directriz</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
