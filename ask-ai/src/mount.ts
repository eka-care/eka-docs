/**
 * The bundle's entry: defines `<eka-ask-ai>` and puts one on the page.
 *
 * Mintlify loads this script on every page and swaps pages without a reload,
 * so mounting runs again on its navigation, on history moves and once a
 * second, the same pattern api-reference-link.js uses. Each run finds the
 * element already there and does nothing.
 */
import {SupportAgentElement} from './index';
import {ensureRow} from './search-row';

/**
 * The MedAssist agent behind the panel. It answers from the docs through Mintlify's MCP server
 * (https://developer.eka.care/mcp), attached to the agent on Eka's side. Empty keeps the mock.
 */
const AGENT_ID = 'ZTMzYmI2NWItOWRjYy00ZDRkLWFlZTItMWFjMzU0ZDVkNDQ2Izc3MDg4MTY2OTk2NzI0';

/** The page's one `eka-ask-ai`, created only if there is none yet. */
export function mount(doc: Document = document): HTMLElement {
  const found = doc.querySelector<HTMLElement>('eka-ask-ai');
  if (found) return found;
  const element = doc.createElement('eka-ask-ai');
  element.setAttribute('agent-id', AGENT_ID);
  doc.body.append(element);
  return element;
}

/** ⌘I, or Ctrl+I off a Mac: the key Mintlify's own assistant uses. Shift and Alt variants stay the browser's. */
export const isAskShortcut = (e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'isComposing'>) =>
  (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && !e.isComposing && e.key.toLowerCase() === 'i';

/** Set on the window once the listeners and the interval are in place. */
const INSTALLED = '__ekaAskAiInstalled';

/**
 * Defines the element and keeps one mounted. Installs its listeners and its
 * interval once per window, so a page that evaluates the script twice still
 * has one set. Returns false where it was already installed.
 */
export function install(win: Window = window, doc: Document = document): boolean {
  const marked = win as Window & {[INSTALLED]?: boolean};
  if (marked[INSTALLED]) return false;
  marked[INSTALLED] = true;
  if (!win.customElements.get('eka-ask-ai')) {
    win.customElements.define('eka-ask-ai', SupportAgentElement);
  }
  const run = () => {
    if (doc.body) (mount(doc) as SupportAgentElement).refreshGround?.();
  };
  // The ground under the bar changes when the page scrolls onto another
  // section or a theme toggle is pressed; read it again, at most once a frame.
  let groundQueued = false;
  const ground = () => {
    if (groundQueued) return;
    groundQueued = true;
    win.requestAnimationFrame(() => {
      groundQueued = false;
      run();
    });
  };
  // The search dialog is rendered on open and dropped on close, so the Ask AI
  // row is put back whenever the page changes, at most once a frame.
  const ask = (q: string) => (mount(doc) as SupportAgentElement).ask(q);
  let queued = false;
  const searchRow = () => {
    if (queued) return;
    queued = true;
    win.requestAnimationFrame(() => {
      queued = false;
      ensureRow(doc, ask);
    });
  };
  const start = () => {
    run();
    if (doc.body) new win.MutationObserver(searchRow).observe(doc.body, {childList: true, subtree: true});
  };
  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
  // The shortcut opens Ask AI on a new chat from anywhere on the page, and closes it again. Caught first, so the host page's own
  // binding for the key (if any) never runs as well.
  win.addEventListener('keydown', (e) => {
    if (!isAskShortcut(e)) return;
    e.preventDefault();
    const panel = mount(doc) as SupportAgentElement;
    if (panel.hasAttribute('open')) panel.removeAttribute('open');
    else panel.startNew();
  }, true);
  win.addEventListener('mintlify:navigate', () => win.setTimeout(run, 0));
  win.addEventListener('popstate', run);
  win.addEventListener('scroll', ground, {passive: true});
  // A theme toggle may fade its background in, so look again once it settles.
  win.addEventListener('click', () => {
    ground();
    win.setTimeout(ground, 400);
  });
  win.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', ground);
  win.setInterval(run, 1000);
  return true;
}

// Guarded so a test can import this module where there is no DOM.
if (typeof document !== 'undefined') install();
