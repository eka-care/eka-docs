/**
 * How the panel talks to an assistant: a conversation held on the server,
 * which the panel starts or resumes, sends one question at a time to, and
 * listens to while the answer arrives.
 *
 * The shape follows Eka's Synapse SDK (`@eka-care/medassist-core`), so wiring
 * it in means replacing the throw in `createTransport` and nothing else:
 * `start` is its startSession, `send` its sendMessage, and the handlers its
 * MESSAGE_CHUNK, PROGRESS_MESSAGE, TIPS_MESSAGE, END_OF_STREAM and ERROR
 * events. Until then, a panel with no agent id talks to the mock.
 */
import {mockTransport} from './mock-transport';
import type {PageAttachment} from './types';

/** The pair that names a conversation on the server, kept to resume it. */
export type SessionRef = {sessionId: string; sessionToken: string};

export type TransportHandlers = {
  onText: (delta: string) => void;
  onProgress: (text: string) => void;
  onTips: (tips: string[]) => void;
  onDone: () => void;
  onError: (message: string) => void;
};

/** Only the new question: the server already holds the conversation. */
export type OutgoingMessage = {text: string; files: File[]; page?: PageAttachment};

export interface Transport {
  readonly isMock: boolean;
  start(existing?: SessionRef): Promise<SessionRef>;
  send(message: OutgoingMessage, handlers: TransportHandlers): void;
  /** Stops delivering the current reply. The backend may keep generating it. */
  detach(): void;
  end(): Promise<void>;
}

/** Fallback text when the assistant cannot be reached mid-answer. */
export const UNREACHABLE =
  'The assistant is unreachable right now. Try again shortly.';

export function createTransport(config: {agentId?: string; authToken?: string}): Transport {
  if (!config.agentId) return mockTransport();
  throw new Error('Synapse transport not wired yet');
}
