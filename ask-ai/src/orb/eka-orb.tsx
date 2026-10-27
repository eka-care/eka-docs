/**
 * The Eka orb: one line of dots that transforms from the Eka mark into a
 * stethoscope in the shape of a heart, the lotus of ABDM, the audio wave of
 * Scribe, and back to the mark. It follows the "shaping" state of
 * thinking-orbs (MIT, Copyright (c) 2026 Jakub Antalik; licence in
 * ask-ai/licenses/): every frame blends the two neighbouring lines point by
 * point, then lays the dots evenly along the blend from its start to its end,
 * so spacing stays uniform through holds and morphs alike. The heart beats,
 * the wave moves, the rest breathe.
 *
 * Small orbs (inline, beside "Thinking") cannot resolve the mark or the
 * lotus, so they move between the heart and the wave only. One clock
 * (performance.now) keeps every orb in phase; each pauses offscreen and in
 * hidden tabs, and reduced motion gets one still frame of the mark.
 */
import {useEffect, useRef} from 'preact/hooks';
import {EKA, HEART, LOTUS} from './eka-shapes';

type Pt = [number, number];
export type Dot = {x: number; y: number; r: number; a: number};

export const SHAPES = {eka: EKA, heart: HEART, lotus: LOTUS};

/** A moment inside the large cycle's hold on the mark: the reduced-motion frame. */
export const STILL = 1;

const N = EKA.length;

/** The Scribe wave at time t: a voice-shaped envelope over two moving sines, left to right. */
export function waveAt(t: number): Pt[] {
  return Array.from({length: N}, (_, i) => {
    const x = -0.26 + (0.52 * i) / (N - 1);
    const env = 0.11 * Math.exp(-((x / 0.15) ** 2)) + 0.012;
    const y = env * (0.65 * Math.sin(x * 58 - t * 7) + 0.35 * Math.sin(x * 23 + t * 4.3));
    return [x, y];
  });
}

type Shape = Pt[] | ((t: number) => Pt[]);
type Step = {shape: Shape; hold: number; morph: number};
const LARGE: Step[] = [
  {shape: EKA, hold: 2, morph: 1},
  {shape: HEART, hold: 2.2, morph: 1},
  {shape: LOTUS, hold: 1.8, morph: 1},
  {shape: waveAt, hold: 2, morph: 1},
];
const SMALL: Step[] = [
  {shape: HEART, hold: 2.2, morph: 0.8},
  {shape: waveAt, hold: 1.8, morph: 0.8},
];

const smooth = (x: number) => x * x * (3 - 2 * x);
const bump = (p: number, at: number, w: number) => Math.exp(-(((p - at) / w) ** 2));
const at = (shape: Shape, t: number) => (typeof shape === 'function' ? shape(t) : shape);

/** Lub-dub: a strong beat then a softer one, every 1.1 seconds. */
function heartbeat(t: number): number {
  const p = (t % 1.1) / 1.1;
  return 1 + 0.08 * bump(p, 0.12, 0.05) + 0.05 * bump(p, 0.32, 0.05);
}

/** Where the cycle is at t: the two lines, how far between them, and how much of the heart is showing. */
function phase(steps: Step[], t: number) {
  const cycle = steps.reduce((s, x) => s + x.hold + x.morph, 0);
  let local = ((t % cycle) + cycle) % cycle;
  for (let k = 0; k < steps.length; k++) {
    const {hold, morph} = steps[k];
    if (local < hold + morph) {
      const m = local > hold ? smooth((local - hold) / morph) : 0;
      const a = steps[k].shape, b = steps[(k + 1) % steps.length].shape;
      const heart = (a === HEART ? 1 - m : 0) + (b === HEART ? m : 0);
      return {a: at(a, t), b: at(b, t), m, heart};
    }
    local -= hold + morph;
  }
  return {a: at(steps[0].shape, t), b: at(steps[0].shape, t), m: 0, heart: 0};
}

/** One frame of dots for an orb `size` CSS px across, at time `t` seconds. Pure: no canvas, no clock. */
export function ekaFrame(size: number, t: number): Dot[] {
  const large = size >= 40;
  const {a, b, m, heart} = phase(large ? LARGE : SMALL, t);
  const rDot = large ? size * 0.018 : size * 0.05;
  const scale = heart * heartbeat(t) + (1 - heart) * (1 + 0.02 * Math.sin(t * 2.4));

  // Blend the lines point by point, then measure the blend from its start to its end. It is open: no wrap.
  const pts = a.map(([ax, ay], i) => [ax + (b[i][0] - ax) * m, ay + (b[i][1] - ay) * m] as Pt);
  const L: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    L.push(l);
    total += l;
  }

  // Spacing is fixed, so the count follows the line's length.
  const n = Math.max(large ? 30 : 9, Math.round((total * size) / (rDot * (large ? 2.4 : 2.6))) + 1);
  const dots: Dot[] = [];
  const c = size / 2;
  let seg = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / (n - 1)) * total;
    while (seg < L.length - 1 && acc + L[seg] < target) {
      acc += L[seg];
      seg++;
    }
    const p = pts[seg], q = pts[seg + 1];
    const f = L[seg] ? Math.min(1, (target - acc) / L[seg]) : 0;
    const x = (p[0] + (q[0] - p[0]) * f) * scale, y = (p[1] + (q[1] - p[1]) * f) * scale;
    // A slow shimmer runs along the line, so a held shape still reads as working.
    const a2 = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(2 * Math.PI * ((k / n) * 2 - t * 0.5)));
    dots.push({x: c + x * size, y: c + y * size, r: Math.max(0.5, rDot), a: a2});
  }
  return dots;
}

function paint(ctx: CanvasRenderingContext2D, dots: Dot[], color: string) {
  ctx.fillStyle = color;
  for (const d of dots) {
    ctx.globalAlpha = d.a;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** The orb, drawn in the element's `color` (set it from CSS). */
export function EkaOrb({size = 64, label = 'Thinking', class: className}: {size?: number; label?: string; class?: string}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    const draw = (t: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      paint(ctx, ekaFrame(size, t), getComputedStyle(canvas).color);
    };

    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(STILL);
      return;
    }
    let raf = 0, running = false, visible = true;
    const loop = () => {
      draw(performance.now() / 1000);
      if (running) raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    draw(performance.now() / 1000);
    const io = typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(([e]) => {
          visible = e.isIntersecting;
          if (visible && document.visibilityState !== 'hidden') start(); else stop();
        })
      : null;
    io?.observe(canvas);
    const onVis = () => (document.visibilityState === 'hidden' ? stop() : visible && start());
    document.addEventListener('visibilitychange', onVis);
    if (!io) start();
    return () => {
      stop();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [size]);

  return (
    <canvas
      ref={ref}
      class={className ? `ask-ai__eka-orb ${className}` : 'ask-ai__eka-orb'}
      role="img"
      aria-label={label}
      style={{width: `${size}px`, height: `${size}px`, display: 'block'}}
    />
  );
}
