// Generates src/orb/eka-shapes.ts: the single lines the Eka orb transforms between, each sampled into N points spaced
// evenly by arc length from the line's start to its end, in units of the orb's size, centred on 0,0 (y down).
// The mark and the heart run down the middle of the Eka mark's one stroke; the lotus draws the ABDM lotus's petals.
// The audio wave moves, so the orb draws it live.
// Run: node eka-shapes.mjs
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';

const N = 240;
const rad = (d) => (d * Math.PI) / 180;
const line = (a, b, steps = 40) => Array.from({length: steps + 1}, (_, i) => [a[0] + ((b[0] - a[0]) * i) / steps, a[1] + ((b[1] - a[1]) * i) / steps]);
const join_ = (...parts) => parts.flatMap((p, i) => (i ? p.slice(1) : p));

/** A smooth line through the given points (uniform Catmull-Rom), from the first to the last. */
function spline(pts, steps = 24) {
  const out = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 1; k <= steps; k++) {
      const t = k / steps, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map((c) => 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3)));
    }
  }
  return out;
}
const ellipse = (cx, cy, rx, ry, from, to, steps = 160) =>
  Array.from({length: steps + 1}, (_, i) => {
    const a = rad(from + ((to - from) * i) / steps);
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
/** Centre a line on 0,0 and scale it so its larger side is `span` of the orb. */
function fit(pts, span) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = span / Math.max(x1 - x0, y1 - y0);
  return pts.map(([x, y]) => [(x - (x0 + x1) / 2) * k, (y - (y0 + y1) / 2) * k]);
}

// The Eka mark is already one stroke. These points run down its middle, in the mark's own units (the landing's
// watermark path, viewBox 4.5 4 23 24): from the upper ear knob, curled in at the heart's dip, round the heart's top lobe, down the band that passes
// under to the lower right, round the ring through the bottom, left and top, in at the upper right, down the band that
// passes over, round the bottom lobe to the lower ear knob. The two bands cross at the heart's tip.
const MID = 15.97; // the mark is symmetric about this line
const TOP_LOBE = [[13.2, 15.25], [12.35, 14.5], [12.05, 13.2], [12.5, 12.1], [13.2, 11.3], [15.22, 10.74], [17.47, 11.63]];
const TIP = [21.96, MID];
const BOTTOM_LOBE = TOP_LOBE.map(([x, y]) => [x, 2 * MID - y]).reverse();
const RING = ellipse(16.97, 15.97, 10.85, 10.42, 42.3, 318);

// 1. The Eka mark, the whole stroke.
function eka() {
  return fit(join_(
    spline(TOP_LOBE),
    line(TOP_LOBE.at(-1), [24.9, 18.78]),
    spline([[24.9, 18.78], [25.6, 20.9], RING[0]]),
    RING,
    spline([RING.at(-1), [25.8, 10.3], [25.83, 11.4], [24.9, 2 * MID - 18.78]]),
    line([24.9, 2 * MID - 18.78], BOTTOM_LOBE[0]),
    spline(BOTTOM_LOBE),
  ), 0.62);
}

// 2. The heart at the middle of the mark, turned upright: the ear knobs meet at the dip, the lobes round out above,
// and the two bands meet at the tip. It is the stethoscope's heart on the landing.
function heart() {
  const sideways = join_(spline(TOP_LOBE), line(TOP_LOBE.at(-1), TIP), line(TIP, BOTTOM_LOBE[0]), spline(BOTTOM_LOBE));
  return fit(sideways.map(([x, y]) => [-y, x]), 0.5);
}

/** The circular arc from a through m to b. */
function arc3(a, m, b, steps = 48) {
  const [ax, ay] = a, [bx, by] = b, [cx, cy] = m;
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  const ux = ((ax ** 2 + ay ** 2) * (by - cy) + (bx ** 2 + by ** 2) * (cy - ay) + (cx ** 2 + cy ** 2) * (ay - by)) / d;
  const uy = ((ax ** 2 + ay ** 2) * (cx - bx) + (bx ** 2 + by ** 2) * (ax - cx) + (cx ** 2 + cy ** 2) * (bx - ax)) / d;
  const r = Math.hypot(ax - ux, ay - uy), ang = (p) => Math.atan2(p[1] - uy, p[0] - ux);
  const a0 = ang(a), am = ang(m), TAU = 2 * Math.PI;
  let sweep = ((ang(b) - a0) % TAU + TAU) % TAU;
  if ((((am - a0) % TAU) + TAU) % TAU > sweep) sweep -= TAU; // go the way that passes through m
  return Array.from({length: steps + 1}, (_, i) => [ux + r * Math.cos(a0 + (sweep * i) / steps), uy + r * Math.sin(a0 + (sweep * i) / steps)]);
}

// 3. The ABDM lotus: the five petals of the landing's #lotus symbol (viewBox 0 0 18 16), each a leaf of two arcs from
// the shared base point to its tip. One line draws them in turn, left to right, out and back through the base, so the
// petals overlap the way they do in the logo.
const BASE = [9, 11.3];
// [tip, a point on the edge drawn out, a point on the edge drawn back]
const PETALS = [
  [[0.45, 11.31], [4.72, 13.24], [4.72, 9.38]], // left outer
  [[3.06, 5.28], [3.62, 8.08], [7.27, 8.48]], // left side
  [[9.03, 2.86], [7.08, 7.0], [10.93, 7.0]], // centre
  [[14.94, 5.28], [10.73, 8.48], [14.38, 8.08]], // right side
  [[17.55, 11.31], [13.28, 9.38], [13.28, 13.24]], // right outer
];
function lotus() {
  return fit(join_(...PETALS.flatMap(([tip, out, back]) => [arc3(BASE, out, tip), arc3(tip, back, BASE)])), 0.74);
}

function resample(poly, n) {
  const L = [0];
  for (let i = 1; i < poly.length; i++) L.push(L[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
  const total = L.at(-1), out = [];
  let s = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / (n - 1)) * total;
    while (s < L.length - 2 && L[s + 1] < target) s++;
    const f = (target - L[s]) / (L[s + 1] - L[s] || 1);
    out.push([poly[s][0] + (poly[s + 1][0] - poly[s][0]) * f, poly[s][1] + (poly[s + 1][1] - poly[s][1]) * f]);
  }
  return out;
}

const shapes = {EKA: resample(eka(), N), HEART: resample(heart(), N), LOTUS: resample(lotus(), N)};
const fmt = (pts) => '[' + pts.map(([x, y]) => `[${x.toFixed(4)},${y.toFixed(4)}]`).join(',') + ']';
writeFileSync(join(import.meta.dirname, 'src/orb/eka-shapes.ts'),
  '// Generated by ask-ai/eka-shapes.mjs. Do not edit.\n' +
  "// Single lines for the Eka orb, start to end, in units of the orb's size, centred on 0,0 (y down).\n" +
  'type Pt = [number, number];\n' +
  Object.entries(shapes).map(([k, v]) => `export const ${k}: Pt[] = ${fmt(v)};`).join('\n') + '\n');
console.log('wrote', Object.entries(shapes).map(([k, v]) => `${k} ${v.length}`).join(', '));
