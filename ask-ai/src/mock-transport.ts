/**
 * The assistant the panel talks to until a real one is connected.
 *
 * It behaves like a session on the server: it starts, resumes, streams a
 * reply in pieces with a progress line first and tips last. What it says is
 * that it is a mock, because a convincing mock of an assistant that cannot
 * answer is worse than no assistant at all.
 */
import type {OutgoingMessage, SessionRef, Transport, TransportHandlers} from './transport';

const TIPS = ['What can the Ask AI assistant do?', 'How do I get an API key?'];

/** The reply, in about six pieces, so the panel's pacing has something to pace. */
function replyTo(message: OutgoingMessage): string[] {
  const asked = message.text.replace(/\s+/g, ' ').trim();
  const pieces = [
    'This is a mock reply. ',
    'No agent is connected to this panel yet, ',
    'so nothing here can answer that. ',
    `You asked: "${asked}". `,
  ];
  // The page and the files are acknowledged, not read: what the real agent
  // does with them is for the agent to decide.
  const extras = [
    message.page ? `the page "${message.page.title}"` : '',
    ...message.files.map((file) => `the file ${file.name}`),
  ].filter(Boolean);
  if (extras.length) pieces.push(`It came with ${extras.join(' and ')}. `);
  // Ends on what was said, the last piece carrying no trailing space.
  pieces[pieces.length - 1] = pieces[pieces.length - 1].trimEnd();
  return pieces;
}

/** The tips, less any that is the question just asked. */
export function tipsAfter(asked: string): string[] {
  const plain = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();
  return TIPS.filter((tip) => plain(tip) !== plain(asked));
}

export function mockTransport(opts: {delayMs?: number} = {}): Transport {
  const delay = opts.delayMs ?? 40;
  let timers: ReturnType<typeof setTimeout>[] = [];

  const clear = () => {
    for (const timer of timers) clearTimeout(timer);
    timers = [];
  };

  return {
    isMock: true,

    async start(existing?: SessionRef): Promise<SessionRef> {
      if (existing) return existing;
      const id = Math.random().toString(36).slice(2, 10);
      return {sessionId: `mock-${id}`, sessionToken: `mock-token-${id}`};
    },

    send(message: OutgoingMessage, handlers: TransportHandlers): void {
      clear();
      const steps: (() => void)[] = [
        () => handlers.onProgress('Searching the Eka docs'),
        ...replyTo(message).map((piece) => () => handlers.onText(piece)),
        () => handlers.onTips(tipsAfter(message.text)),
        () => handlers.onDone(),
      ];
      steps.forEach((step, index) => {
        timers.push(setTimeout(step, delay * (index + 1)));
      });
    },

    detach: clear,

    async end(): Promise<void> {
      clear();
    },
  };
}
