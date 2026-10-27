/**
 * An "Ask AI about …" row in Mintlify's search dialog.
 *
 * The free plan has no assistant, so the search box offers none. This row
 * hands the typed query to the panel instead. It lives in Mintlify's own DOM,
 * not the widget's shadow root, so it is styled inline, and it sits beside the
 * results list rather than in it: the listbox and its arrow keys belong to
 * Mintlify. Focus stays in the search input throughout; the row is a click
 * target, and Ctrl or Cmd with Enter in the input does the same.
 */

declare const __EKA_ACCENT__: string;
declare const __EKA_ACCENT_DARK__: string;

const MAX = 60;

/** What the row says for a query, or null when there is nothing to ask. */
export function rowLabel(query: string): string | null {
  const q = query.trim().replace(/\s+/g, ' ');
  if (!q) return null;
  return `Ask AI about "${q.length > MAX ? `${q.slice(0, MAX)}…` : q}"`;
}

const ROW = 'data-eka-ask-ai';

/** Lucide's sparkles (ISC), the mark the panel uses. */
const SPARKLES =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/>' +
  '<path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>';

export function isMac(): boolean {
  const nav = navigator as Navigator & {userAgentData?: {platform?: string}};
  return /mac|iphone|ipad|ipod/i.test(nav.userAgentData?.platform || nav.platform || '');
}

function accent(doc: Document): string {
  return doc.documentElement.classList.contains('dark') ? __EKA_ACCENT_DARK__ : __EKA_ACCENT__;
}

/** Inputs already wired, so a re-rendered dialog gets its listeners once. */
const wired = new WeakSet<HTMLInputElement>();

/**
 * Closes Mintlify's dialog the way a person would, with Escape, then asks.
 * Escape goes to the input first; if the dialog is still there it goes to the
 * dialog, then the document. All of it happens before the panel opens, since
 * the open panel takes Escape for itself.
 */
function askFrom(input: HTMLInputElement, onAsk: (q: string) => void): boolean {
  const query = input.value.trim().replace(/\s+/g, ' ');
  if (!query) return false;
  const dialog = input.closest('[role=dialog]');
  const escape = () => new KeyboardEvent('keydown', {key: 'Escape', code: 'Escape', bubbles: true, cancelable: true});
  input.dispatchEvent(escape());
  if (dialog?.isConnected && input.isConnected) dialog.dispatchEvent(escape());
  if (dialog?.isConnected && input.isConnected) input.ownerDocument.dispatchEvent(escape());
  onAsk(query);
  return true;
}

function set(el: HTMLElement, prop: string, value: string) {
  if (el.style.getPropertyValue(prop) !== value) el.style.setProperty(prop, value);
}

function createRow(doc: Document, onAsk: (q: string) => void): HTMLButtonElement {
  const row = doc.createElement('button');
  row.type = 'button';
  row.tabIndex = -1;
  row.setAttribute(ROW, '');
  row.style.cssText = [
    'display:flex', 'align-items:center', 'gap:10px', 'box-sizing:border-box',
    'width:calc(100% - 16px)', 'margin:4px 8px', 'padding:10px 12px',
    'border:0', 'border-radius:12px', 'background:transparent', 'cursor:pointer',
    'font:inherit', 'font-size:14px', 'line-height:20px', 'text-align:left',
  ].join(';');
  const icon = doc.createElement('span');
  icon.style.cssText = 'display:inline-flex;flex:none';
  icon.innerHTML = SPARKLES;
  const label = doc.createElement('span');
  label.setAttribute('data-part', 'label');
  label.style.cssText = 'flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500';
  const hint = doc.createElement('kbd');
  hint.textContent = isMac() ? '⌘ ↵' : 'Ctrl ↵';
  hint.style.cssText = 'flex:none;font:inherit;font-size:12px;opacity:0.7';
  row.append(icon, label, hint);
  // Keep focus, and with it the caret and Mintlify's keys, in the input.
  row.addEventListener('mousedown', (e) => e.preventDefault());
  // The input of the moment: Mintlify can swap it while this row stays put.
  row.addEventListener('click', () => {
    const current = doc.getElementById('search-input') as HTMLInputElement | null;
    if (current) askFrom(current, onAsk);
  });
  row.addEventListener('mouseenter', () => set(row, 'background', `color-mix(in srgb, ${accent(doc)} 10%, transparent)`));
  row.addEventListener('mouseleave', () => set(row, 'background', 'transparent'));
  return row;
}

function refresh(doc: Document, row: HTMLButtonElement, input: HTMLInputElement) {
  const text = rowLabel(input.value);
  set(row, 'display', text ? 'flex' : 'none');
  set(row, 'color', accent(doc));
  const label = row.querySelector<HTMLElement>('[data-part=label]');
  if (label && text && label.textContent !== text) label.textContent = text;
}

/** Puts one row in an open search dialog and keeps it current. Safe to call often. */
export function ensureRow(doc: Document, onAsk: (q: string) => void): void {
  const input = doc.getElementById('search-input') as HTMLInputElement | null;
  if (!input) return;
  const dialog = input.closest('[role=dialog]');
  const scope: ParentNode = dialog ?? input.parentElement ?? doc;
  let row = scope.querySelector<HTMLButtonElement>(`button[${ROW}]`);
  if (!row) row = createRow(doc, onAsk);

  // Directly before the results list, or after the input's row until there is one.
  const listbox = scope.querySelector('[role=listbox]');
  if (listbox?.parentNode) {
    if (row.nextSibling !== listbox) listbox.parentNode.insertBefore(row, listbox);
  } else {
    const parent = input.parentElement;
    const anchor = parent && parent !== dialog ? parent : input;
    if (anchor.parentNode && row.previousSibling !== anchor) {
      anchor.parentNode.insertBefore(row, anchor.nextSibling);
    }
  }

  if (!wired.has(input)) {
    wired.add(input);
    input.addEventListener('input', () => {
      const current = (input.closest('[role=dialog]') ?? doc).querySelector<HTMLButtonElement>(`button[${ROW}]`);
      if (current) refresh(doc, current, input);
    });
    // Capture, so Mintlify never sees this Enter as its own.
    input.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || !(e.metaKey || e.ctrlKey) || e.isComposing) return;
      if (!rowLabel(input.value)) return;
      e.preventDefault();
      e.stopPropagation();
      askFrom(input, onAsk);
    }, true);
  }
  refresh(doc, row, input);
}
