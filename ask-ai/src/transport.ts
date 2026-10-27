/**
 * How the panel talks to an assistant: a conversation held on the server,
 * which the panel starts or resumes, sends one question at a time to, and
 * listens to while the answer arrives.
 *
 * With an agent id it talks to MedAssist through Eka's Synapse SDK
 * (`@eka-care/medassist-core`, the package `@eka-care/medassist-react` wraps):
 * `start` is its startSession, `send` its sendMessage, and the handlers its
 * MESSAGE_CHUNK, PROGRESS_MESSAGE, TOOL_START, TOOL_CALL, TIPS_MESSAGE, END_OF_STREAM
 * and ERROR events. The agent answers from the docs through Mintlify's MCP server
 * (https://developer.eka.care/mcp), which is attached to the agent, not here.
 * A panel with no agent id talks to the mock.
 */
import {SynapseSDK, SYNAPSE_REALTIME_EVENTS, type SynapseSDKConfig} from '@eka-care/medassist-core';
import {mockTransport} from './mock-transport';
import type {PageAttachment} from './types';

/**
 * What names a conversation on the server, kept to resume it: the session id,
 * and the tokens the SDK's token exchange issued for this reader (a guest),
 * so a reload reopens the same conversation for the same identity.
 */
export type SessionRef = {sessionId: string; sessionToken: string; refreshToken?: string; level?: 'user' | 'guest'};

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

/** The SDK surface the transport uses; a stand-in replaces it in tests. */
type Sdk = Pick<SynapseSDK, 'startSession' | 'sendMessage' | 'on' | 'off' | 'endSession'>;
type SdkFactory = (config: SynapseSDKConfig) => Sdk;

type Config = {agentId?: string; authToken?: string; environment?: 'production' | 'staging' | 'development'; sdkFactory?: SdkFactory};

export function createTransport(config: Config): Transport {
  if (!config.agentId) return mockTransport();
  return synapseTransport({...config, agentId: config.agentId});
}

const tipText = (tip: unknown): string =>
  typeof tip === 'string' ? tip : typeof (tip as {text?: unknown})?.text === 'string' ? (tip as {text: string}).text : '';

function synapseTransport({agentId, authToken, environment = 'production', sdkFactory = (c) => new SynapseSDK(c)}: Config & {agentId: string}): Transport {
  let sdk: Sdk | undefined;
  let tokens: {sessToken?: string; refreshToken?: string; level?: 'user' | 'guest'} = {};
  let listening: Array<[string, (data: unknown) => void]> = [];

  const detach = () => {
    for (const [event, fn] of listening) sdk?.off(event as never, fn);
    listening = [];
  };

  return {
    isMock: false,

    async start(existing) {
      detach();
      sdk = sdkFactory({
        agentId,
        environment,
        channel: 'widget',
        ...(authToken ? {authToken} : {}),
        // A reload resumes the same reader: seed the tokens the last exchange issued.
        ...(existing?.refreshToken
          ? {refreshToken: existing.refreshToken, sessToken: existing.sessionToken, level: existing.level ?? 'guest'}
          : {}),
        callbacks: {
          onTokenExchange: (t) => { tokens = {sessToken: t.sess_token, refreshToken: t.refresh_token, level: t.level}; },
        },
      });
      const session = await sdk.startSession(existing ? {session_id: existing.sessionId} : undefined);
      return {
        sessionId: session.session_id,
        sessionToken: tokens.sessToken ?? existing?.sessionToken ?? '',
        refreshToken: tokens.refreshToken ?? existing?.refreshToken,
        level: tokens.level ?? existing?.level,
      };
    },

    send(message, handlers) {
      detach();
      if (!sdk) { handlers.onError(UNREACHABLE); return; }
      const live = sdk;
      // Chunks are deltas. A tool call or progress step between them starts a new paragraph,
      // as medassist-react does.
      let wrote = false, broke = false;
      const on = (event: string, fn: (data: any) => void) => { live.on(event as never, fn); listening.push([event, fn]); };
      const finish = (then: () => void) => { detach(); then(); };
      on(SYNAPSE_REALTIME_EVENTS.MESSAGE_CHUNK, (d) => {
        const text = d?.data?.text;
        if (!text) return;
        handlers.onText((broke && wrote && !/\s$/.test(text) ? '\n\n' : '') + text);
        wrote = true; broke = false;
      });
      on(SYNAPSE_REALTIME_EVENTS.PROGRESS_MESSAGE, (d) => { broke = true; if (d?.data?.text) handlers.onProgress(d.data.text); });
      on(SYNAPSE_REALTIME_EVENTS.TOOL_START, () => { broke = true; handlers.onProgress('Searching the docs'); });
      // An agent can answer with a choice prompt (elicitation pills) instead of streamed text:
      // its text is the answer, and its options become the follow-ups the panel offers.
      on(SYNAPSE_REALTIME_EVENTS.TOOL_CALL, (d) => {
        const input = d?.data?.details?.input;
        if (typeof input?.text === 'string' && input.text) {
          handlers.onText((wrote ? '\n\n' : '') + input.text);
          wrote = true; broke = false;
        }
        const options = (Array.isArray(input?.options) ? input.options : [])
          .map((o: {label?: unknown; value?: unknown}) => (typeof o?.label === 'string' ? o.label : typeof o?.value === 'string' ? o.value : ''))
          .filter(Boolean);
        if (options.length) handlers.onTips(options);
      });
      on(SYNAPSE_REALTIME_EVENTS.TIPS_MESSAGE, (d) => {
        const tips = (Array.isArray(d?.data?.tips) ? d.data.tips : []).map(tipText).filter(Boolean);
        if (tips.length) handlers.onTips(tips);
      });
      on(SYNAPSE_REALTIME_EVENTS.END_OF_STREAM, () => finish(handlers.onDone));
      on(SYNAPSE_REALTIME_EVENTS.ERROR, (e) => finish(() => handlers.onError(e?.data?.msg || UNREACHABLE)));
      // The agent reads the docs through Mintlify's MCP server, so an attached page travels as its link.
      const text = message.page?.url ? `${message.text}\n\nI am reading this page: ${message.page.title} (${message.page.url})` : message.text;
      live.sendMessage({message: text, ...(message.files.length ? {files: message.files} : {})})
        .catch(() => finish(() => handlers.onError(UNREACHABLE)));
    },

    detach,

    async end() {
      detach();
      sdk?.endSession();
      sdk = undefined;
    },
  };
}
