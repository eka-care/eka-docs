/**
 * The Eka orb: a dotted outline that morphs between a circle, the Eka mark and
 * the heart at the mark's centre, after the "shaping" state of thinking-orbs
 * (MIT, Copyright (c) 2026 Jakub Antalik; licence in ask-ai/licenses/). Every frame blends the two neighbouring outlines and
 * then lays the dots evenly along the blend, so spacing stays uniform through
 * holds and morphs alike. The mark and the circle breathe; the heart beats.
 *
 * Small orbs (inline, beside "Thinking") cannot resolve the mark, so they
 * pulse between the circle and the heart only. One clock (performance.now)
 * keeps every orb in phase; each pauses offscreen and in hidden tabs, and
 * reduced motion gets one still frame of the mark.
 */
import {useEffect, useRef} from 'preact/hooks';
import {CIRCLE, EKA, HEART} from './eka-shapes';

type Pt = [number, number];
export type Dot = {x: number; y: number; r: number; a: number};

export const SHAPES = {circle: CIRCLE, eka: EKA, heart: HEART};

/** A moment inside the large cycle's hold on the mark: the reduced-motion frame. */
export const STILL = 1;

type Step = {shape: Pt[]; hold: number; morph: number};
const LARGE: Step[] = [
  {shape: EKA, hold: 2.2, morph: 0.9},
  {shape: HEART, hold: 2.2, morph: 0.9},
  {shape: CIRCLE, hold: 1.1, morph: 0.9},
];
const SMALL: Step[] = [
  {shape: HEART, hold: 2.2, morph: 0.8},
  {shape: CIRCLE, hold: 1, morph: 0.8},
];

const smooth = (x: number) => x * x * (3 - 2 * x);
const bump = (p: number, at: number, w: number) => Math.exp(-(((p - at) / w) ** 2));

/** Lub-dub: a strong beat then a softer one, every 1.1 seconds. */
function heartbeat(t: number): number {
  const p = (t % 1.1) / 1.1;
  return 1 + 0.08 * bump(p, 0.12, 0.05) + 0.05 * bump(p, 0.32, 0.05);
}

/** Where the cycle is at t: the two outlines, how far between them, and how much of the heart is showing. */
function phase(steps: Step[], t: number) {
  const cycle = steps.reduce((s, x) => s + x.hold + x.morph, 0);
  let local = ((t % cycle) + cycle) % cycle;
  for (let k = 0; k < steps.length; k++) {
    const {hold, morph} = steps[k];
    if (local < hold + morph) {
      const m = local > hold ? smooth((local - hold) / morph) : 0;
      const a = steps[k].shape, b = steps[(k + 1) % steps.length].shape;
      const heart = (a === HEART ? 1 - m : 0) + (b === HEART ? m : 0);
      return {a, b, m, heart};
    }
    local -= hold + morph;
  }
  return {a: steps[0].shape, b: steps[0].shape, m: 0, heart: 0};
}

/** One frame of dots for an orb `size` CSS px across, at time `t` seconds. Pure: no canvas, no clock. */
export function ekaFrame(size: number, t: number): Dot[] {
  const large = size >= 40;
  const {a, b, m, heart} = phase(large ? LARGE : SMALL, t);
  const rDot = large ? size * 0.016 : size * 0.055;
  const scale = heart * heartbeat(t) + (1 - heart) * (1 + 0.025 * Math.sin(t * 2.4));

  // Blend the outlines point by point, then measure the blend.
  const pts = a.map(([ax, ay], i) => [ax + (b[i][0] - ax) * m, ay + (b[i][1] - ay) * m] as Pt);
  const L: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length];
    const l = Math.hypot(q[0] - p[0], q[1] - p[1]);
    L.push(l);
    total += l;
  }

  // Spacing is fixed, so the count follows the outline: the long, doubled-back mark gets many more dots than the
  // circle, which is what lets it read as the mark rather than a scatter.
  const n = Math.max(large ? 24 : 10, Math.round((total * size) / (rDot * (large ? 2.7 : 2.6))));
  const dots: Dot[] = [];
  const c = size / 2;
  let seg = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total;
    while (acc + L[seg] < target && seg < pts.length - 1) {
      acc += L[seg];
      seg++;
    }
    const p = pts[seg], q = pts[(seg + 1) % pts.length];
    const f = L[seg] ? Math.min(1, (target - acc) / L[seg]) : 0;
    const x = (p[0] + (q[0] - p[0]) * f) * scale, y = (p[1] + (q[1] - p[1]) * f) * scale;
    // A slow shimmer travels round the outline, so a held shape still reads as working.
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
