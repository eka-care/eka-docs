/**
 * The bundle's entry: defines `<eka-ask-ai>` and puts one on the page.
 *
 * Mintlify loads this script on every page and swaps pages without a reload,
 * so mounting runs again on its navigation, on history moves and once a
 * second, the same pattern api-reference-link.js uses. Each run finds the
 * element already there and does nothing.
 */
import {SupportAgentElement} from './index';

/** The assistant to talk to. Empty keeps the panel on the mock transport. */
const AGENT_ID = '';

/** The page's one `eka-ask-ai`, created only if there is none yet. */
export function mount(doc: Document = document): HTMLElement {
  const found = doc.querySelector<HTMLElement>('eka-ask-ai');
  if (found) return found;
  const element = doc.createElement('eka-ask-ai');
  element.setAttribute('agent-id', AGENT_ID);
  doc.body.append(element);
  return element;
}

// Guarded so a test can import mount() where there is no DOM.
if (typeof document !== 'undefined') {
  if (!customElements.get('eka-ask-ai')) {
    customElements.define('eka-ask-ai', SupportAgentElement);
  }
  const run = () => {
    if (document.body) mount();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
  window.addEventListener('mintlify:navigate', () => setTimeout(run, 0));
  window.addEventListener('popstate', run);
  setInterval(run, 1000);
}
