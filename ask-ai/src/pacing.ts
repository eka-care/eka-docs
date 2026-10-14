/**
 * How fast an answer is revealed.
 *
 * A stream does not arrive evenly: a tool call, a second of silence, then a
 * whole paragraph in one packet. Rendering each packet the moment it lands is
 * what makes a streamed answer stutter, and it is why a chat panel can feel
 * slower than it is. Text is buffered instead and drained on the display's own
 * clock, a share of the backlog per frame, so the answer reads at an even pace
 * whatever the network did.
 */

/** The panel thinks for at least this long before it shows a word. */
export const THINKING_HOLD = 550;
/** Unless this much is already waiting, in which case it gets on with it. */
export const THINKING_BURST = 220;
/** Share of the waiting text taken each frame: a sixth drains in ~100ms. */
const REVEAL_SHARE = 6;
/** Never fewer than this many characters a frame, or a long tail crawls. */
const REVEAL_FLOOR = 2;

/**
 * How many characters to reveal this frame. Zero means hold: either nothing
 * has arrived, or the panel is still visibly thinking and a fast first token
 * would otherwise flash a word up in place of the indicator.
 */
export function revealStep(
  backlog: number,
  sinceAsk: number,
  revealing: boolean,
  atOnce: boolean,
): number {
  if (backlog <= 0) return 0;
  if (!revealing && sinceAsk < THINKING_HOLD && backlog < THINKING_BURST) {
    return 0;
  }
  if (atOnce) return backlog;
  return Math.min(backlog, Math.max(REVEAL_FLOOR, Math.ceil(backlog / REVEAL_SHARE)));
}

/** How long the reveal loop waits for a frame before stepping anyway. */
export const FRAME_FALLBACK = 100;

type Clock = Pick<
  typeof globalThis,
  'requestAnimationFrame' | 'cancelAnimationFrame' | 'setTimeout' | 'clearTimeout'
>;

/**
 * Runs `run` on the next frame, or after a short wait where no frame comes.
 *
 * A page that is not being shown gets no animation frames at all, so a
 * reveal loop driven only by them stops dead: the answer never finishes, the
 * panel never goes idle, and the conversation is never saved. A reader who
 * asks and switches tab, or a page loaded in the background, lost the
 * exchange on the next load. The timer is the floor under that. Returns a
 * function that cancels whichever has not run yet.
 */
export function nextFrame(run: () => void, clock: Clock = globalThis): () => void {
  let settled = false;
  const cancel = () => {
    settled = true;
    clock.cancelAnimationFrame(raf);
    clock.clearTimeout(timer);
  };
  const go = () => {
    if (settled) return;
    cancel();
    run();
  };
  const raf = clock.requestAnimationFrame(go);
  const timer = clock.setTimeout(go, FRAME_FALLBACK);
  return cancel;
}
