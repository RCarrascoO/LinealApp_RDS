

function buildPoints(a, a1, a2, b1, m, n) {
  const f1 = (x) => a1 * x * x + a2 * x - b1;
  const f2 = (x) => m * x + n;

  const leftPts = [];
  const rightPts = [];

  const STEPS = 60;
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

function toSVG(x, y, xMin, xMax, yMin, yMax, svgW, svgH, pad) {
  const plotW = svgW - 2 * pad;
  const plotH = svgH - 2 * pad;
  const sx = pad + ((x - xMin) / (xMax - xMin)) * plotW;
  const sy = pad + ((yMax - y) / (yMax - yMin)) * plotH;
  return { sx, sy };
}

function pointsToPolyline(pts, xMin, xMax, yMin, yMax, svgW, svgH, pad) {
  return pts
    .map(({ x, y }) => {
      const { sx, sy } = toSVG(x, y, xMin, xMax, yMin, yMax, svgW, svgH, pad);
      return `${sx},${sy}`;
    })
    .join(' ');
}

const a = 3;
const a1 = 9, a2 = 8, b1 = 7, m = 6, n = 5;
const limIzquierda = 9*3*3 + 8*3 - 7;
const limDerecha = 6*3 + 5;

const { leftPts, rightPts } = buildPoints(a, a1, a2, b1, m, n);
const allY = [...leftPts, ...rightPts].map((p) => p.y);
const rawYMin = Math.min(...allY, limIzquierda, limDerecha);
const rawYMax = Math.max(...allY, limIzquierda, limDerecha);
const yPad = Math.max((rawYMax - rawYMin) * 0.15, 1);

const data = {
  a, leftPts, rightPts, limIzquierda, limDerecha,
  xMin: a - 3, xMax: a + 3,
  yMin: rawYMin - yPad, yMax: rawYMax + yPad,
};

console.log('leftPts length:', leftPts.length);
console.log('rightPts length:', rightPts.length);
console.log('yMin:', data.yMin, 'yMax:', data.yMax);

const SVG_W = 600;
const SVG_H = 300;
const PAD = 48;

const leftLine = pointsToPolyline(leftPts, data.xMin, data.xMax, data.yMin, data.yMax, SVG_W, SVG_H, PAD);
console.log('leftLine points:');
console.log(leftLine);
