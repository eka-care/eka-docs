/**
 * Which turns the model is shown.
 *
 * Some exchanges are the panel talking to itself: its answer about what it
 * is. They are in the thread
 * because the reader had them, but they are not part of the conversation the
 * model answers, and the server wants roles that alternate strictly, user
 * first and user last. So a panel-only answer goes with the turn it answered,
 * as a pair, and what is left still alternates.
 */
type Said = {from: 'you' | 'assistant'; local?: boolean};

export function forModel<T extends Said>(turns: T[]): T[] {
  const out: T[] = [];
  for (const turn of turns) {
    if (turn.from === 'assistant' && turn.local) {
      if (out.length && out[out.length - 1].from === 'you') out.pop();
      continue;
    }
    out.push(turn);
  }
  return out;
}
