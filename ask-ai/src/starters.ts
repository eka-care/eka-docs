/**
 * The empty state's openers, shown as pills under the greeting.
 *
 * A pill carries a short label and the full question it asks, because a pill
 * has room for two or three words and a good question needs more. A blank
 * chat box is the hardest question a reader answers; these teach the panel's
 * range in one glance, and each is one the docs genuinely answer.
 */
export type Starter = {label: string; prompt: string};

export const DEFAULT_STARTERS: Starter[] = [
  {label: 'Get an API key', prompt: 'How do I get a client ID and secret to call Eka APIs?'},
  {label: 'Start an EkaScribe session', prompt: 'How do I create an EkaScribe session and upload audio?'},
  {label: 'Parse a lab report', prompt: 'How do I upload a lab report for parsing?'},
  {label: 'Verify a webhook', prompt: 'How do I verify an Eka webhook signature?'},
  {label: 'Learn about Ask AI', prompt: 'What can the Ask AI assistant do?'},
];

/**
 * Reads the host's `starters` attribute: one opener per line, at most five.
 * A line may be `label | prompt`; a line with no bar is its own label, which
 * is how every host wrote them before pills had labels.
 */
export function startersFrom(given: string): Starter[] {
  const lines = given
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (!lines.length) return DEFAULT_STARTERS;
  return lines.slice(0, 5).map((line) => {
    const bar = line.indexOf('|');
    if (bar < 0) return {label: line, prompt: line};
    const label = line.slice(0, bar).trim();
    const prompt = line.slice(bar + 1).trim();
    return {label: label || prompt, prompt: prompt || label};
  });
}
