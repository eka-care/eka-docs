import {Fragment, render} from 'preact';
import {useEffect, useMemo, useRef, useState} from 'preact/hooks';
import ChatMarkdown, {CopyButton, absolute, headings} from './markdown';
import {ChevronRight, FileText, Paperclip, Plus, Sparkles, X} from './icons';
import {createTransport, UNREACHABLE, type SessionRef} from './transport';
import {revealStep} from './pacing';
import {
  clearCurrentId,
  currentId,
  forget,
  forgetOne,
  load as loadHistory,
  remember,
  resumable,
  save as saveHistory,
  setCurrentId,
  titleOf,
  type Session,
} from './history';
import {ABOUT, isAboutQuestion} from './about';
import {Composer, type Menu} from './Composer';
import {HistoryList} from './HistoryList';
import {Welcome} from './Welcome';
import {ThinkingOrb} from './orb/frosted-orb';
import {startersFrom, type Starter} from './starters';
import {isHtmlDocument, markdownUrl, pageUrl, type PageEntry} from './pages';
import type {Attached, PageAttachment, Source} from './types';

export type {PageAttachment} from './types';
import css from './styles.css';

declare const __EKA_ACCENT__: string;
declare const __EKA_ACCENT_DARK__: string;

/** Enough to tell one conversation from another in this browser's list. */
const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

type Turn = {
  from: 'you' | 'assistant';
  text: string;
  sources?: Source[];
  /** Follow-up questions the assistant suggested after this answer. */
  tips?: string[];
  /** The file that went with this question, named in the reader's bubble. */
  file?: Attached;
  /** The panel's own turn, never sent to the assistant: its answer about itself. */
  local?: boolean;
};

/**
 * What may be attached, and how much of it.
 *
 * Text only, and read here before it is sent, so a file that is not text or
 * is too long is refused here, where the reader can see why.
 */
const ATTACH_TYPES = '.json,.txt,.log,.csv,.xml,.yaml,.yml,.md,.har';
const ATTACH_MAX_CHARS = 20000;
const ATTACH_MAX_BYTES = 256 * 1024;
const ATTACH_REFUSED =
  'Only text files can be attached here: JSON, text, logs, CSV, XML, YAML, Markdown or HAR.';

type Setter = (update: (prior: Turn[]) => Turn[]) => void;

/** Appends a text delta onto the last turn in the thread. */
function appendToLastTurn(setTurns: Setter, delta: string) {
  setTurns((prior) => {
    const last = prior[prior.length - 1];
    return [...prior.slice(0, -1), {...last, text: last.text + delta}];
  });
}

/** What belongs under an answer and waits for it to finish. */
type Extras = Pick<Turn, 'sources' | 'tips'>;

/** Puts the citation chips and the tips on the last turn in the thread. */
function attachExtras(setTurns: Setter, extras: Extras) {
  setTurns((prior) => {
    const last = prior[prior.length - 1];
    return [...prior.slice(0, -1), {...last, ...extras}];
  });
}

type PanelProps = {
  agentId: string;
  authToken: string;
  docsOrigin: string;
  open: boolean;
  onClose: () => void;
  question: string;
  send: boolean;
  starters: Starter[];
  /** False where the host asked not to keep conversations in its origin. */
  keepHistory: boolean;
  supportUrl: string;
  page: PageAttachment | null;
  onDetach: () => void;
  /** Puts a page the reader found in the page search on the conversation. */
  onAttach: (page: PageAttachment) => void;
};

/**
 * The conversation itself.
 *
 * Without an agent configured (`agentId` is empty), the transport is a
 * labelled mock: the welcome says so, the reply says so, and the badge in the
 * header repeats it, because a convincing mock of an assistant that cannot
 * answer is worse than no assistant at all.
 *
 * The panel is a native modal dialog, so it lands in the browser's top layer.
 * That is what keeps it above a host page's own stacking contexts without the
 * widget knowing anything about them, and it brings Escape, the backdrop and
 * focus containment with it.
 */
/** How wide the panel may be dragged, in pixels. */
const PANEL_MIN = 320;
const PANEL_MAX = 960;
const PANEL_WIDTH_KEY = 'eka-ask-ai-width';

/**
 * The remembered width, or 0 where there is none. Storage can be blocked
 * outright (Safari's private mode, a sandboxed frame), and the panel then
 * opens at its default width rather than not at all.
 */
function savedWidth(): number {
  try {
    return Number(localStorage.getItem(PANEL_WIDTH_KEY)) || 0;
  } catch {
    return 0;
  }
}

function keepWidth(width: number): void {
  try {
    localStorage.setItem(PANEL_WIDTH_KEY, String(width));
  } catch {
    // Blocked: the width holds for this visit and is not remembered.
  }
}

/**
 * True while the left edge is being dragged, and for the click that ends the
 * drag. The panel closes on a click that lands on the dialog itself, which is
 * how a click on the backdrop dismisses it, and a drag that finishes anywhere
 * left of the panel ends exactly there: mouse down on the handle, mouse up on
 * the page, and the click goes to their common ancestor, which is the dialog.
 * So narrowing the panel used to shut it.
 */
let resizing = false;

/**
 * The panel's left edge, as something you can pull.
 *
 * The panel is a fixed 26rem, which is the right width for a paragraph and
 * the wrong width for the things it also shows: a sequence diagram, a curl
 * command with a long URL, a table of headers. Rather than guess a wider
 * default and make every short answer sit in a column of whitespace, the
 * reader sets it, and the width they set is remembered for their next visit.
 *
 * Pointer events rather than mouse events, so a pen and a trackpad work the
 * same way, with a capture so the drag survives the pointer leaving the
 * handle. There is no handle on a touch screen: the panel is the full width
 * of the viewport there, and there is nothing to drag it to.
 */
function ResizeGrip({dialog}: {dialog: {current: HTMLDialogElement | null}}) {
  const [dragging, setDragging] = useState(false);

  // The width is written onto the element rather than held in state, because
  // a re-render per pointer move is a re-render of everything in the panel,
  // and one of the things in the panel is a diagram.
  useEffect(() => {
    const saved = savedWidth();
    if (saved >= PANEL_MIN && dialog.current) {
      dialog.current.style.setProperty('--aa-panel-width', `${saved}px`);
    }
  }, []);

  const start = (event: PointerEvent) => {
    const panel = dialog.current;
    if (!panel) return;
    event.preventDefault();
    resizing = true;
    setDragging(true);
    (event.target as Element).setPointerCapture(event.pointerId);
    const move = (moved: PointerEvent) => {
      // The panel is docked right, so its width is whatever is left of the
      // viewport once the pointer has taken its share.
      const wanted = window.innerWidth - moved.clientX;
      const width = Math.min(
        Math.max(wanted, PANEL_MIN),
        Math.min(PANEL_MAX, window.innerWidth),
      );
      panel.style.setProperty('--aa-panel-width', `${Math.round(width)}px`);
    };
    const stop = () => {
      // Cleared after the click this pointer up is about to produce, not
      // before it.
      setTimeout(() => {
        resizing = false;
      }, 0);
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
      const set = panel.style.getPropertyValue('--aa-panel-width');
      if (set) keepWidth(parseInt(set, 10));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
  };

  return (
    <div
      class={`ask-ai__grip${dragging ? ' ask-ai__grip--dragging' : ''}`}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize the panel"
      tabIndex={0}
      onPointerDown={start}
      onKeyDown={(event) => {
        // The keyboard reaches it too: a control only a pointer can work is
        // a control some readers do not have.
        const step =
          event.key === 'ArrowLeft' ? 32 : event.key === 'ArrowRight' ? -32 : 0;
        if (!step || !dialog.current) return;
        event.preventDefault();
        const now = dialog.current.getBoundingClientRect().width;
        const width = Math.min(Math.max(now + step, PANEL_MIN), PANEL_MAX);
        dialog.current.style.setProperty('--aa-panel-width', `${width}px`);
        keepWidth(width);
      }}>
      <span class="ask-ai__grip-bar" aria-hidden="true" />
    </div>
  );
}

function Panel({
  agentId,
  authToken,
  docsOrigin,
  open,
  onClose,
  page,
  onDetach,
  onAttach,
  question,
  send,
  starters,
  keepHistory,
  supportUrl,
}: PanelProps) {
  // Empty until the reader asks something: the welcome stands in for an
  // opening line, so no turn is spent saying hello.
  const [turns, setTurns] = useState<Turn[]>([]);
  // An attached page names its own sections, and a section heading is a
  // better opener than a guess. Where there is no page, or the page carries
  // no headings, the host's own openers stand.
  const pageOpeners = page ? headings(page.markdown).slice(0, 4) : [];
  const openers: Starter[] = pageOpeners.length
    ? pageOpeners.map((heading) => ({label: heading, prompt: heading}))
    : starters;
  const [draft, setDraft] = useState('');
  // The file as the reader chose it, which is what is sent, and what was read
  // from it, which is what the composer and the thread show.
  const [chosen, setChosen] = useState<{attached: Attached; file: File} | null>(null);
  const [attachError, setAttachError] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'streaming'>('idle');
  const [activity, setActivity] = useState<string | null>(null);
  // Past conversations, read from this browser once the panel is built, and
  // the list of them that the head can drop down.
  const [history, setHistory] = useState<Session<Turn>[]>([]);
  // Which of the two views is showing: the conversation, or the list of
  // past ones. Then the add menu, and the title of a page on its way in from
  // the page search.
  const [view, setView] = useState<'chat' | 'history'>('chat');
  const [menu, setMenu] = useState<Menu>('closed');
  const [attaching, setAttaching] = useState<string | null>(null);
  const conversation = useRef(newId());
  // One transport for the panel. The assistant holds the conversation; the
  // panel holds the pair that names it, and whether it has been started (or
  // resumed) since this conversation came on screen.
  const transport = useMemo(
    () => createTransport({agentId, authToken}),
    [agentId, authToken],
  );
  const session = useRef<SessionRef | undefined>(undefined);
  const started = useRef(false);
  const autoAsked = useRef<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const thread = useRef<HTMLDivElement>(null);
  const composer = useRef<HTMLTextAreaElement>(null);
  const busy = phase !== 'idle';
  // A page with no markdown is one the host could not fetch. It still shows,
  // as a failure, because a reader who asked for the page to be attached has
  // to be told it was not.
  const attached = page !== null && page.markdown !== '';

  // Text that has arrived but has not been shown yet, and the frame loop that
  // shows it. Both are refs: the loop runs from a callback the browser holds,
  // outside any one render, so state it read would be the state of the render
  // that started it.
  const pending = useRef('');
  const revealing = useRef(false);
  const netDone = useRef(true);
  const askedAt = useRef(0);
  const atOnce = useRef(false);
  const frame = useRef(0);
  const extras = useRef<Extras | null>(null);
  // Which question the transport's handlers belong to. Stop, New and
  // resuming move it on, so a late event from an answer the reader left is
  // dropped rather than written into the next one.
  const asking = useRef(0);

  const drain = () => {
    frame.current = requestAnimationFrame(drain);
    const backlog = pending.current.length;

    if (backlog === 0) {
      if (!netDone.current) return;
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      revealing.current = false;
      if (extras.current) {
        attachExtras(setTurns, extras.current);
        extras.current = null;
      }
      setPhase('idle');
      return;
    }

    const take = revealStep(
      backlog,
      performance.now() - askedAt.current,
      revealing.current,
      atOnce.current,
    );
    // Zero is the thinking hold: the indicator stands rather than a first word
    // flashing up in its place.
    if (take === 0) return;
    if (!revealing.current) {
      revealing.current = true;
      setPhase('streaming');
    }
    appendToLastTurn(setTurns, pending.current.slice(0, take));
    pending.current = pending.current.slice(take);
  };

  /** Queues text for the reveal loop rather than rendering it directly. */
  const emit = (text: string) => {
    pending.current += text;
  };

  /**
   * Holds the tips until the answer they belong to has finished: attaching
   * them while the text is still revealing would sit them under half a reply.
   */
  const queueTips = (tips: string[]) => {
    extras.current = {...extras.current, tips};
  };

  const stopDrain = () => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    revealing.current = false;
    pending.current = '';
    extras.current = null;
    netDone.current = true;
    asking.current += 1;
  };

  // A host that already knows what the reader was typing, the docs site's
  // search box being the one that does, hands it over in `question`. It
  // seeds the composer and is never sent: the reader still decides whether
  // that is the question, and can edit it first. An empty box only, so
  // reopening the panel never writes over what they were part way through.
  useEffect(() => {
    if (!open || !question) return;
    if (!send) {
      setDraft((prior) => prior || question);
      return;
    }
    // Asked outright, once. The host says the reader has finished asking, so
    // pressing send again would be asking them to say it twice; the guard is
    // what stops a re-render or a second opening from asking it again.
    if (autoAsked.current === question) return;
    autoAsked.current = question;
    void ask(question);
  }, [open, question, send]);

  // The dialog's own state is the source of truth for the browser; the `open`
  // prop drives it. Escape and the backdrop fire "close", which is where the
  // host is told the panel went away.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    // Opening the panel is the reader saying they have something to ask, so
    // the caret starts in the composer and they do not have to click the box
    // first. The dialog's own autofocus would be the way to say that, but it
    // leaves focus on the dialog itself here, so the composer is focused by
    // hand once the panel is actually showing.
    if (open && !el.open) {
      el.showModal();
      composer.current?.focus();
    }
    if (!open && el.open) el.close();
  }, [open]);

  // Escape closes it, from wherever focus happens to be. The dialog's own
  // close request would do this, but only when focus is inside the panel, and
  // it takes the panel away without telling this state it went. Catching the
  // key first, in the capture phase, keeps one source of truth and beats any
  // handler the host page has bound to Escape for itself.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      // An open menu is the nearer thing to put away.
      if (menu !== 'closed') setMenu('closed');
      else onClose();
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [open, onClose, menu]);

  // Follow the answer as it streams, and stop the moment the reader scrolls
  // away to re-read something earlier. Yanking them back down mid-sentence is
  // the rudest thing a chat panel can do.
  //
  // The intent is tracked rather than inferred from distance: measuring the
  // gap on each render looks equivalent but is not, because until the answer
  // is taller than the panel the browser clamps scrollTop to 0, and the first
  // answer that overflows then reads as "the reader has scrolled up" and
  // following stops for good. A scroll listener sees the difference, since
  // pinning to the bottom lands at a gap of zero and leaves the flag set.
  const stick = useRef(true);
  const onThreadScroll = () => {
    const el = thread.current;
    if (!el) return;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  };

  useEffect(() => {
    const el = thread.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [turns, phase, activity]);

  // The composer grows with what is pasted into it, up to a point: developers
  // arrive with a whole error body to paste, and a one line box hides all but
  // the last line of it.
  useEffect(() => {
    const el = composer.current;
    if (!el) return;
    el.style.height = 'auto';
    const height = Math.min(el.scrollHeight, 160);
    el.style.height = `${height}px`;
    // A scrollbar only once there is something to scroll to. Left on auto,
    // a platform with classic scrollbars paints one against a single line of
    // text, because the box's own minimum height and the text's height round
    // apart by a pixel.
    el.style.overflowY = el.scrollHeight > height ? 'auto' : 'hidden';
  }, [draft]);

  // A new transport (the agent or its token changed) has never been started,
  // so the next question starts or resumes the session on it. Leaving the
  // page mid-answer stops the delivery rather than leaving it to run against
  // a component nobody is watching.
  useEffect(() => {
    started.current = false;
    return () => {
      transport.detach();
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [transport]);

  /**
   * Writes the conversation on screen into this browser's history, once it
   * has a question and an answer in it and the answer has finished.
   *
   * An attachment's text is dropped on the way in. It can be twenty thousand
   * characters, ten of those would not fit the quota, and the point of the
   * list is finding the question again rather than replaying the file with
   * it. A restored conversation keeps the file's name and loses its body.
   * The session pair is kept with it, so a follow-up resumes the same
   * conversation on the assistant's side.
   */
  const keep = (said: Turn[]) => {
    if (!keepHistory) return;
    // A question is enough. An answer abandoned in its first second leaves
    // an assistant turn with nothing in it, and the thread already draws
    // nothing for those, so what comes back is the question on its own.
    if (!said.some((turn) => turn.from === 'you')) return;
    const entry: Session<Turn> = {
      id: conversation.current,
      at: Date.now(),
      title: titleOf(said),
      turns: said.map((turn) =>
        turn.file ? {...turn, file: {...turn.file, text: ''}} : turn,
      ),
      ...(session.current ? {session: session.current} : {}),
    };
    setHistory((held) => {
      const next = remember(held, entry);
      saveHistory(next);
      return next;
    });
    setCurrentId(conversation.current);
  };

  useEffect(() => {
    if (phase === 'idle') keep(turns);
  }, [phase, turns]);

  useEffect(() => {
    if (!keepHistory) return;
    const held = loadHistory<Turn>();
    setHistory(held);
    // Back from a page with no panel, or from a reload: the conversation
    // this tab was in comes back, where the reader left it.
    const left = resumable(held, currentId());
    if (left) {
      conversation.current = left.id;
      session.current = left.session;
      started.current = false;
      setTurns((now) => (now.length ? now : left.turns));
    }
  }, [keepHistory]);

  /** Puts a past conversation back on screen, where it can be carried on. */
  const resume = (saved: Session<Turn>) => {
    keep(turns);
    transport.detach();
    stopDrain();
    stick.current = true;
    conversation.current = saved.id;
    // Resumed on the assistant's side when the reader asks a follow-up.
    session.current = saved.session;
    started.current = false;
    setTurns(saved.turns);
    setView('chat');
    setDraft('');
    setChosen(null);
    setAttachError(null);
    setActivity(null);
    setPhase('idle');
  };

  const reset = () => {
    // A half finished answer is still a question somebody asked, so the
    // conversation being left goes into the list before it is cleared.
    keep(turns);
    conversation.current = newId();
    clearCurrentId();
    // The assistant's session ends with the conversation; the next question
    // starts a fresh one.
    void transport.end();
    session.current = undefined;
    started.current = false;
    setView('chat');
    setMenu('closed');
    stopDrain();
    stick.current = true;
    setTurns([]);
    setDraft('');
    setChosen(null);
    setAttachError(null);
    setActivity(null);
    setPhase('idle');
  };

  /**
   * Reads a chosen file into the composer's attachment slot.
   *
   * The reading happens here, in the reader's own browser, before anything
   * is sent. Anything that is not a text file, a file that is too large, or
   * one that turns out to be binary once read, is refused with a line saying
   * so rather than sent for the model to guess at.
   */
  const takeFile = async (file: File | undefined) => {
    if (!file) return;
    setAttachError(null);
    const ext = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? '';
    if (!ATTACH_TYPES.split(',').includes(ext)) {
      setAttachError(ATTACH_REFUSED);
      return;
    }
    if (file.size > ATTACH_MAX_BYTES) {
      setAttachError('That file is too large. Attach the failing part of it.');
      return;
    }
    let text: string;
    try {
      text = await file.text();
    } catch {
      setAttachError('That file could not be read.');
      return;
    }
    // A replacement character is what a decoder leaves behind when the bytes
    // were never text, which is the cheap way to catch a binary renamed .txt.
    if (text.includes('\uFFFD')) {
      setAttachError('That looks like a binary file. Text and JSON only.');
      return;
    }
    if (text.length > ATTACH_MAX_CHARS) {
      setAttachError(
        `That file is ${text.length.toLocaleString()} characters. Attach at most ${ATTACH_MAX_CHARS.toLocaleString()}.`,
      );
      return;
    }
    if (!text.trim()) {
      setAttachError('That file is empty.');
      return;
    }
    setChosen({attached: {name: file.name, text}, file});
    composer.current?.focus();
  };

  /** Stops the answer and keeps every word of it that had arrived. */
  const stop = () => {
    asking.current += 1;
    transport.detach();
    if (pending.current) appendToLastTurn(setTurns, pending.current);
    pending.current = '';
    netDone.current = true;
    setActivity(null);
  };

  /** Asks a question. */
  const ask = async (asked: string) => {
    if (!asked || busy) return;
    const file = chosen;
    setDraft('');
    setChosen(null);
    setAttachError(null);
    setMenu('closed');
    setView('chat');

    // A question about the panel itself is the panel's to answer, the same
    // on every page, and it is never sent to the assistant.
    if (!file && isAboutQuestion(asked)) {
      setTurns((prior) => [
        ...prior,
        {from: 'you', text: asked},
        {from: 'assistant', text: ABOUT, local: true},
      ]);
      return;
    }

    setTurns((prior) => [
      ...prior,
      {from: 'you', text: asked, file: file?.attached},
      {from: 'assistant', text: ''},
    ]);

    // Every answer, mock or live, goes through the same reveal loop, so the
    // preview shows the pacing the real thing has.
    pending.current = '';
    extras.current = null;
    revealing.current = false;
    netDone.current = false;
    askedAt.current = performance.now();
    atOnce.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    setPhase('thinking');
    setActivity('Thinking');
    if (!frame.current) frame.current = requestAnimationFrame(drain);

    const mine = ++asking.current;
    const live = () => asking.current === mine;
    const finish = () => {
      netDone.current = true;
      setActivity(null);
    };
    try {
      // The first question of a conversation starts its session, or resumes
      // the one a saved conversation already had.
      if (!started.current) {
        const ref = await transport.start(session.current);
        // Stopped, or left for another conversation, while it was starting.
        if (!live()) return;
        session.current = ref;
        started.current = true;
      }
      transport.send(
        {
          text: asked,
          files: file ? [file.file] : [],
          // An attached page goes as the page, not as something the reader
          // typed. A page that could not be fetched does not go at all.
          ...(attached ? {page: page!} : {}),
        },
        {
          onText: (delta) => live() && emit(delta),
          onProgress: (text) => live() && setActivity(text),
          onTips: (tips) => live() && queueTips(tips),
          onDone: () => live() && finish(),
          onError: (message) => {
            if (!live()) return;
            emit(message || UNREACHABLE);
            finish();
          },
        },
      );
    } catch {
      if (!live()) return;
      emit(UNREACHABLE);
      finish();
    }
  };

  /** Attaches a page found in the page search, the same way the host would. */
  const attachFromSearch = async (entry: PageEntry) => {
    setAttaching(entry.title);
    const markdown = await fetch(markdownUrl(docsOrigin, entry.path))
      .then((res) => (res.ok ? res.text() : ''))
      .catch(() => '');
    setAttaching(null);
    onAttach({title: entry.title, url: pageUrl(docsOrigin, entry.path), markdown});
    composer.current?.focus();
  };

  const forgetSession = (id: string) =>
    setHistory((held) => {
      const next = forgetOne(held, id);
      saveHistory(next);
      return next;
    });

  const clearHistory = () => {
    forget();
    setHistory([]);
  };

  // The indicator stands until the first word is actually shown, not until
  // the first byte lands. A reader watching it needs to know the panel is
  // working; what it says comes from the assistant's progress messages once
  // those start arriving.
  const showActivity = phase === 'thinking';

  return (
    <dialog
      class="ask-ai"
      ref={dialog}
      aria-label="Ask AI"
      onClose={onClose}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialog.current && !resizing) onClose();
      }}>
      <ResizeGrip dialog={dialog} />
      <div class="ask-ai__head">
        {/* New always starts a new conversation, the way Claude's "New chat"
            does; the one being left is saved first. History lists them all,
            and picking one there is how the reader goes back to it. */}
        <div class="ask-ai__tabs" role="group" aria-label="Conversations">
          <button
            type="button"
            class="ask-ai__tab"
            aria-pressed={view === 'chat'}
            aria-label="New conversation"
            title="Start a new conversation"
            onClick={reset}>
            <Plus />
            New
          </button>
          <button
            type="button"
            class="ask-ai__tab"
            aria-pressed={view === 'history'}
            onClick={() => {
              setMenu('closed');
              setView('history');
            }}>
            History
          </button>
        </div>
        {transport.isMock && <span class="ask-ai__badge">Mock</span>}
        <span class="ask-ai__grow" />
        <button
          type="button"
          class="ask-ai__close"
          onClick={onClose}
          aria-label="Close">
          <X />
        </button>
      </div>

      {view === 'history' ? (
        <HistoryList
          sessions={history}
          currentId={conversation.current}
          onOpen={resume}
          onForget={forgetSession}
          onClearAll={clearHistory}
        />
      ) : (
      <>
      {/* A log rather than a live region per turn: the reader's screen reader
          holds the announcement while aria-busy is set and reads the answer
          once, when it has finished arriving, instead of word by word. */}
      <div
        class="ask-ai__thread"
        ref={thread}
        role="log"
        aria-live="polite"
        aria-busy={busy}
        onScroll={onThreadScroll}>
        {turns.length === 0 && (
          <Welcome
            starters={openers}
            mock={transport.isMock}
            supportUrl={supportUrl}
            onPick={(prompt) => void ask(prompt)}
          />
        )}
        {turns.map((turn, index) => (
          <Fragment key={index}>
          {/* An answer with nothing in it yet is not a bubble. The thinking
              indicator below stands in its place until the first word. */}
          {turn.from === 'assistant' && turn.text === '' ? null : (
          <div
            class={`ask-ai__turn ask-ai__turn--${turn.from}${
              phase === 'streaming' && index === turns.length - 1
                ? ' ask-ai__turn--streaming'
                : ''
            }`}>
            {turn.from === 'assistant' ? (
              <ChatMarkdown text={turn.text} docsOrigin={docsOrigin} />
            ) : (
              turn.text
            )}
            {/* The file that went with the question, named in the reader's
                own bubble so what was sent is on the record they can see. */}
            {turn.file && (
              <span class="ask-ai__turn-file">
                <Paperclip />
                {turn.file.name}
              </span>
            )}
            {turn.from === 'assistant' &&
              index > 0 &&
              turn.text !== '' &&
              !(busy && index === turns.length - 1) && (
                <CopyButton
                  text={turn.text}
                  label="Copy answer"
                  className="ask-ai__turn-copy"
                />
              )}
            {/* One line until the reader asks for them, as Stripe's
                assistant does: "Used 5 sources", which opens to the list.
                A native details element, so it opens from the keyboard and
                announces its state with no script of its own. Below the
                answer rather than above it, because the sources land when
                the answer ends, and a line appearing above would push the
                text the reader is on down the panel. */}
            {turn.sources && turn.sources.length > 0 && (
              <details class="ask-ai__sources">
                <summary class="ask-ai__sources-toggle">
                  <ChevronRight />
                  Used {turn.sources.length}{' '}
                  {turn.sources.length === 1 ? 'source' : 'sources'}
                </summary>
                <ul class="ask-ai__source-list">
                  {turn.sources.map((source) => (
                    <li key={source.id}>
                      <a
                        href={absolute(source.url, docsOrigin) ?? source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="ask-ai__source-link">
                        <FileText />
                        <span class="ask-ai__source-title">
                          {source.title}
                          {source.status !== 'verified' ? ' (spec)' : ''}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            )}
            {/* What the assistant suggests asking next, under the latest
                answer once it has finished. A pill asks it. */}
            {turn.tips &&
              turn.tips.length > 0 &&
              index === turns.length - 1 &&
              !busy && (
                <div class="ask-ai__tips" role="group" aria-label="Suggested questions">
                  {turn.tips.map((tip) => (
                    <button
                      key={tip}
                      type="button"
                      class="ask-ai__pill"
                      onClick={() => void ask(tip)}>
                      {tip}
                    </button>
                  ))}
                </div>
              )}
          </div>
          )}
          </Fragment>
        ))}
        {showActivity && (
          <p class="ask-ai__activity">
            <ThinkingOrb />
            {activity ?? 'Thinking'}
          </p>
        )}

      </div>

      <Composer
        draft={draft}
        onDraft={setDraft}
        field={composer}
        busy={busy}
        onSend={() => void ask(draft.trim())}
        onStop={stop}
        menu={menu}
        onMenu={setMenu}
        accept={ATTACH_TYPES}
        onFile={(file) => void takeFile(file)}
        file={chosen?.attached ?? null}
        fileError={attachError}
        onRemoveFile={() => setChosen(null)}
        docsOrigin={docsOrigin}
        page={page}
        attaching={attaching}
        onPage={(entry) => void attachFromSearch(entry)}
        onRemovePage={onDetach}
      />
      </>
      )}
    </dialog>
  );
}

function Widget({
  host,
  agentId,
  authToken,
  docsOrigin,
  supportUrl,
  launcher,
  shortcut,
  open,
  page,
  onDetach,
  onAttach,
  question,
  send,
  starters,
  keepHistory,
}: {
  host: HTMLElement;
  agentId: string;
  authToken: string;
  docsOrigin: string;
  supportUrl: string;
  launcher: boolean;
  shortcut: string;
  open: boolean;
  page: PageAttachment | null;
  onDetach: () => void;
  onAttach: (page: PageAttachment) => void;
  question: string;
  send: boolean;
  starters: Starter[];
  /** False where the host asked not to keep conversations in its origin. */
  keepHistory: boolean;
}) {
  const close = () => {
    host.removeAttribute('open');
    host.dispatchEvent(new CustomEvent('close', {bubbles: true, composed: true}));
  };
  return (
    <>
      {launcher && (
        <button
          type="button"
          class="ask-ai__launcher"
          aria-label="Ask AI"
          onClick={() => {
            // Re-asserted rather than simply set: a browser can honour its
            // own close request for the dialog and leave this attribute
            // standing, and a launcher that then sets what is already set
            // would change nothing and open nothing.
            host.removeAttribute('open');
            host.setAttribute('open', '');
          }}>
          <Sparkles />
          {/* The label goes when the bar gets narrow; the mark carries it. */}
          <span class="ask-ai__launcher-label">Ask AI</span>
          {/* The host's own key for this, if it has bound one. A reader who
              never looks in a menu learns the shortcut from the thing it
              opens or not at all. */}
          {shortcut && <kbd class="ask-ai__launcher-key">{shortcut}</kbd>}
        </button>
      )}
      <Panel
        agentId={agentId}
        authToken={authToken}
        docsOrigin={docsOrigin}
        supportUrl={supportUrl}
        open={open}
        question={question}
        send={send}
        starters={starters}
        keepHistory={keepHistory}
        onClose={close}
        page={page}
        onDetach={onDetach}
        onAttach={onAttach}
      />
    </>
  );
}

/**
 * `<eka-ask-ai>`: the whole assistant, on any page, from one script
 * tag. Configuration is by attribute so an embedder needs no build step:
 *
 *   agent-id     the assistant to talk to; absent keeps the panel a mock
 *   auth-token   the token that assistant is reached with
 *   docs-origin  where citations resolve, since "/docs/..." is wrong on
 *                every host except the docs site itself
 *   launcher     "none" to supply your own trigger and drive `open`
 *   shortcut     the key the host has bound to open the panel, shown on the
 *                launcher; the host binds it, this only says what it is
 *   open         present while the panel is showing; the element removes it
 *                and fires a "close" event when the reader dismisses it
 *   question     seeds the composer when the panel opens with an empty box,
 *                for a host that already has the reader's words
 *   send         present alongside `question` to ask it outright rather than
 *                leave it in the composer for the reader to press
 *   starters     the empty state's opening questions, one per line, for a
 *                page that knows what its reader came to do
 *   history      "off" stops past conversations being kept. They are kept in
 *                localStorage, which belongs to the page doing the embedding
 *                and not to this element, so a host whose origin should not
 *                hold what readers type turns the list off here. Off also
 *                means a reload starts a fresh conversation
 *
 * One thing is set by method rather than attribute: attachPage({title, url,
 * markdown}) gives the conversation the page the reader is looking at, and
 * attachPage(null) takes it off again. A page of Markdown does not belong in
 * an attribute, and the host is the only one that knows where its own pages
 * are published, so it fetches and hands over the text.
 *
 * Everything renders in a shadow root, so the host page's styles cannot reach
 * in and the widget's cannot leak out. Colour is taken from the host's own
 * tokens where it defines them (see styles.css). One thing does reach the
 * host page's storage: the recent conversations list, and the panel width
 * with it. Both are localStorage on the embedding origin, which is why
 * history="off" exists.
 */
/**
 * Which way the host page's ground runs, read from the first ancestor that
 * actually paints a background. The panel's fallback palette follows the page
 * it is on rather than the reader's operating system: a light page on a
 * machine set to dark is still a light page, and a dark panel dropped into it
 * looks like a bug. Where nothing paints, the system preference decides.
 */
function groundOf(): 'light' | 'dark' {
  for (let el: HTMLElement | null = document.body; el; el = el.parentElement) {
    const parts = /^rgba?\(([^)]+)\)/.exec(getComputedStyle(el).backgroundColor);
    if (!parts) continue;
    const [r, g, b, a = 1] = parts[1].split(',').map(Number);
    if (!a) continue;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 128 ? 'dark' : 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

class SupportAgentElement extends HTMLElement {
  static observedAttributes = [
    'agent-id',
    'auth-token',
    'docs-origin',
    'support-url',
    'launcher',
    'shortcut',
    'open',
    'question',
    'send',
    'starters',
    'history',
    'ground',
  ];

  private root: ShadowRoot | null = null;
  private page: PageAttachment | null = null;

  connectedCallback() {
    if (!this.root) {
      this.root = this.attachShadow({mode: 'open'});
      const style = document.createElement('style');
      style.textContent = css;
      this.root.append(style);
      // An embedder who sets this themselves is taken at their word.
      if (!this.hasAttribute('ground')) this.setAttribute('ground', groundOf());
      // The site's accent stands in for the fallback palette's. Set inline on
      // the host because the stylesheet is a text import, so it cannot see the
      // build-time globals. A page that defines --accent still wins.
      const accent =
        this.getAttribute('ground') === 'dark' ? __EKA_ACCENT_DARK__ : __EKA_ACCENT__;
      this.style.setProperty('--aa-fb-accent', accent);
      this.style.setProperty(
        '--aa-fb-accent-soft',
        `color-mix(in srgb, ${accent} 12%, transparent)`,
      );
      this.style.setProperty(
        '--aa-fb-accent-line',
        `color-mix(in srgb, ${accent} 40%, transparent)`,
      );
    }
    this.paint();
  }

  attributeChangedCallback() {
    if (this.root) this.paint();
  }

  /** Opens the panel. Equivalent to setting the `open` attribute. */
  show() {
    this.setAttribute('open', '');
  }

  /** Closes the panel. */
  hide() {
    this.removeAttribute('open');
  }

  /**
   * Attaches a page as context for the conversation, or clears it with
   * null. The host fetches the Markdown itself, since only the host knows
   * where its pages live; an empty `markdown` says it tried and failed, and
   * the panel shows that rather than attaching nothing quietly.
   *
   * It is a method rather than an attribute because a whole page of Markdown
   * has no business being reflected into the DOM as a string.
   */
  attachPage(page: PageAttachment | null) {
    // Every attachment comes through here, the host's and the page search's
    // alike, so this is the one place a host's app shell served in place of
    // a missing page is turned back into the failure it is.
    this.page = page && isHtmlDocument(page.markdown) ? {...page, markdown: ''} : page;
    if (this.root) this.paint();
  }

  private paint() {
    const docsOrigin =
      this.getAttribute('docs-origin') ?? window.location.origin;
    render(
      <Widget
        host={this}
        agentId={this.getAttribute('agent-id') ?? ''}
        authToken={this.getAttribute('auth-token') ?? ''}
        docsOrigin={docsOrigin}
        supportUrl={
          this.getAttribute('support-url') ??
          `${docsOrigin.replace(/\/$/, '')}/docs/support`
        }
        launcher={this.getAttribute('launcher') !== 'none'}
        shortcut={this.getAttribute('shortcut') ?? ''}
        open={this.hasAttribute('open')}
        page={this.page}
        onDetach={() => this.attachPage(null)}
        onAttach={(found) => this.attachPage(found)}
        question={this.getAttribute('question') ?? ''}
        send={this.hasAttribute('send')}
        starters={startersFrom(this.getAttribute('starters') ?? '')}
        keepHistory={this.getAttribute('history') !== 'off'}
      />,
      this.root!,
    );
  }
}

// Guarded so the bundle can be imported where there is no DOM, which is what
// a test and a server-side render both do.
if (
  typeof customElements !== 'undefined' &&
  !customElements.get('eka-ask-ai')
) {
  customElements.define('eka-ask-ai', SupportAgentElement);
}
