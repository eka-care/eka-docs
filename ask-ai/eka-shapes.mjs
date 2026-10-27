// Generates src/orb/eka-shapes.ts: the outlines the Eka orb morphs between, each sampled into N points spaced evenly by
// arc length, centred, scaled to the orb's frame and walked clockwise from the top centre, like thinking-orbs' shapes.
// Run: node eka-shapes.mjs
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';

const N = 240;
// The Eka mark, from the landing page's watermark (one closed outline: absolute M, C, L, Z only).
const MARK = 'M26.9947 11.186C26.9328 12.1964 26.4991 13.1473 25.7246 13.8902L18.2898 21.022C18.1039 21.2003 17.8871 21.3786 17.6392 21.5271C15.9354 22.6266 13.612 22.4186 12.156 21.022C11.2577 20.1602 10.793 18.9419 10.9169 17.6938C10.9479 16.9509 11.5984 16.3863 12.3729 16.3863C13.1783 16.3863 13.8289 17.0103 13.8289 17.7829C13.8289 18.199 13.643 18.5556 13.3642 18.823C13.4571 19.0607 13.612 19.2984 13.8289 19.4767C14.2006 19.8333 14.7273 20.0413 15.2539 20.0413C15.5947 20.0413 15.9044 19.9819 16.1832 19.8333C16.3691 19.7442 16.524 19.6253 16.6789 19.4767L20.3344 15.9703L18.8164 14.5142L16.6479 12.4341C16.2762 12.0775 15.7495 11.8695 15.2229 11.8695C14.6963 11.8695 14.1696 12.0775 13.7979 12.4341C13.5501 12.6718 13.3642 12.969 13.2713 13.2661C13.612 13.5336 13.8599 13.9199 13.8599 14.3656C13.8599 15.1382 13.2093 15.7623 12.4039 15.7623C11.6604 15.7623 11.0098 15.1977 10.9479 14.4845C10.7 13.1473 11.1337 11.8101 12.156 10.8295C12.9615 10.0568 14.0457 9.61111 15.2229 9.61111C16.3691 9.61111 17.4843 10.0568 18.2898 10.8295L20.4583 12.9096L21.9762 14.3656L24.0828 12.345C24.4855 11.9587 24.6714 11.4832 24.6714 10.9483C24.6714 10.4729 24.4855 10.0271 24.1447 9.70026C23.2463 8.74935 22.1621 8.00646 20.9539 7.47158C19.6838 6.93669 18.3517 6.63954 16.9577 6.63954C14.3555 6.63954 11.9392 7.62015 10.0805 9.37338C8.25274 11.1266 7.23045 13.4742 7.23045 15.9703C7.23045 18.4664 8.25274 20.7842 10.0805 22.5672C11.9082 24.3204 14.3555 25.301 16.9577 25.301C18.3517 25.301 19.6838 25.0336 20.9539 24.469C22.1621 23.9341 23.2463 23.1912 24.1447 22.2403C24.8572 21.4677 24.8262 20.3088 24.0828 19.5659L22.5338 18.0801L24.1757 16.5052L25.7246 17.991C27.3665 19.5659 27.4284 22.062 25.8795 23.7261C24.7643 24.9147 23.4322 25.8359 21.9452 26.4897C20.3963 27.1731 18.7235 27.5 16.9887 27.5C15.3778 27.5 13.7979 27.2028 12.3109 26.6085C10.8859 26.0142 9.58482 25.1822 8.50057 24.1421C7.38534 23.0724 6.51795 21.854 5.92936 20.4871C5.30979 19.0607 5 17.5452 5 16C5 14.4548 5.30979 12.9393 5.92936 11.5129C6.54893 10.146 7.41632 8.89793 8.50057 7.85788C9.6158 6.78811 10.8859 5.95607 12.3109 5.39147C13.7979 4.79716 15.3778 4.5 16.9887 4.5C18.7235 4.5 20.3653 4.85659 21.9452 5.51033C23.4632 6.16408 24.7643 7.08527 25.8795 8.2739C26.3442 8.77907 26.7159 9.4031 26.8708 10.0568C26.9638 10.3243 26.9947 10.77 26.9947 11.186Z';

function markPolyline(d) {
  const nums = (s) => s.trim().split(/[\s,]+/).filter(Boolean).map(Number);
  const out = [];
  let cur = [0, 0];
  for (const [, cmd, args] of d.matchAll(/([MCLZ])([^MCLZ]*)/g)) {
    const a = nums(args);
    if (cmd === 'M' || cmd === 'L') { cur = [a[0], a[1]]; out.push(cur); }
    if (cmd === 'C') {
      const [x1, y1, x2, y2, x, y] = a;
      for (let i = 1; i <= 40; i++) {
        const t = i / 40, u = 1 - t;
        out.push([u * u * u * cur[0] + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x,
                  u * u * u * cur[1] + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y]);
      }
      cur = [x, y];
    }
  }
  return out;
}

const heartPolyline = () => Array.from({length: 4000}, (_, i) => {
  const t = (i / 4000) * 2 * Math.PI;
  return [16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))];
});

function resample(poly, n) {
  const L = [0];
  for (let i = 1; i <= poly.length; i++) {
    const a = poly[i - 1], b = poly[i % poly.length];
    L.push(L[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = L[L.length - 1], out = [];
  let s = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total;
    while (L[s + 1] < target) s++;
    const a = poly[s], b = poly[(s + 1) % poly.length], f = (target - L[s]) / (L[s + 1] - L[s] || 1);
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
  }
  return out;
}

function frame(pts, extent) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const k = extent / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  let out = pts.map(([x, y]) => [(x - cx) * k, (y - cy) * k]);
  // Clockwise on screen (y down) has a positive shoelace area.
  const area = out.reduce((a, p, i) => a + p[0] * out[(i + 1) % out.length][1] - out[(i + 1) % out.length][0] * p[1], 0);
  if (area < 0) out = out.reverse();
  // Start at the point nearest the top centre, so blends between shapes pair up their tops.
  let best = 0;
  out.forEach(([x, y], i) => { if (y < 0 && Math.abs(Math.atan2(y, x) + Math.PI / 2) < Math.abs(Math.atan2(out[best][1], out[best][0]) + Math.PI / 2)) best = i; });
  return out.slice(best).concat(out.slice(0, best));
}

const circle = Array.from({length: N}, (_, i) => {
  const a = -Math.PI / 2 + (i / N) * 2 * Math.PI;
  return [Math.cos(a) * 0.24, Math.sin(a) * 0.24];
});
const shapes = {CIRCLE: circle, EKA: frame(resample(markPolyline(MARK), N), 0.56), HEART: frame(resample(heartPolyline(), N), 0.5)};
const fmt = (pts) => '[' + pts.map(([x, y]) => `[${x.toFixed(4)},${y.toFixed(4)}]`).join(',') + ']';
writeFileSync(join(import.meta.dirname, 'src/orb/eka-shapes.ts'),
  '// Generated by ask-ai/eka-shapes.mjs. Do not edit.\n' +
  '// Outlines for the Eka orb, in units of the orb\'s size, centred on 0,0, clockwise from the top centre.\n' +
  'type Pt = [number, number];\n' +
  Object.entries(shapes).map(([k, v]) => `export const ${k}: Pt[] = ${fmt(v)};`).join('\n') + '\n');
console.log('wrote', Object.entries(shapes).map(([k, v]) => `${k} ${v.length}`).join(', '));
