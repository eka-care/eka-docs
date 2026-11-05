/**
 * The compact bar that floats at the foot of every page: one line to ask in,
 * which opens the panel with the question already asked.
 *
 * It holds only what the reader is typing. The element decides what asking
 * means; this says what was asked and clears itself.
 *
 * On a page with a hero (the landing page), the bar waits while the hero
 * fills the screen and arrives with the first scroll, once the hero's bottom
 * edge has risen clear of the bar's own space.
 */
import {useEffect, useState} from 'preact/hooks';
import {ArrowUp, Sparkles} from './icons';
import {isMac} from './search-row';

/** The host page's hero, by the id the landing page gives it. */
const HERO_ID = 'hero';

/** The bar's own space at the foot of the viewport: 42px tall, 24px above the edge. */
export const BAR_ROOM = 66;

/** True once the hero is clear of the bar's space: none on the page, or scrolled up past it. */
export function pastHero(hero: {getBoundingClientRect(): {bottom: number}} | null, viewport: number): boolean {
  return !hero || hero.getBoundingClientRect().bottom <= viewport - BAR_ROOM;
}

function usePastHero(): boolean {
  const [past, setPast] = useState(() => pastHero(document.getElementById(HERO_ID), window.innerHeight));
  useEffect(() => {
    const check = () => setPast(pastHero(document.getElementById(HERO_ID), window.innerHeight));
    window.addEventListener('scroll', check, {passive: true});
    window.addEventListener('resize', check);
    // The site navigates without reloading, so the hero can arrive or leave
    // with no scroll at all.
    const timer = window.setInterval(check, 500);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.clearInterval(timer);
    };
  }, []);
  return past;
}

export function FloatingBar({
  hidden,
  onAsk,
}: {
  /** True while the panel is open, which is where the asking happens then. */
  hidden: boolean;
  onAsk: (question: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const past = usePastHero();
  const question = draft.trim();
  return (
    <form
      class={`ask-ai__float${past ? '' : ' is-away'}`}
      hidden={hidden}
      role="search"
      aria-label="Ask AI"
      onSubmit={(event) => {
        event.preventDefault();
        if (!question) return;
        onAsk(question);
        setDraft('');
      }}>
      <span class="ask-ai__float-mark">
        <Sparkles />
      </span>
      <input
        class="ask-ai__float-input"
        type="text"
        value={draft}
        onInput={(event) => setDraft(event.currentTarget.value)}
        placeholder="Ask AI a question..."
        aria-label="Ask AI a question"
        aria-keyshortcuts={isMac() ? 'Meta+I' : 'Control+I'}
        autocomplete="off"
        enterkeyhint="send"
      />
      {/* The shortcut, until there is something to send. */}
      {!question && <kbd class="ask-ai__float-kbd" aria-hidden="true">{isMac() ? '⌘I' : 'Ctrl I'}</kbd>}
      <button
        type="submit"
        class="ask-ai__float-send"
        aria-label="Send"
        disabled={!question}>
        <ArrowUp />
      </button>
    </form>
  );
}
