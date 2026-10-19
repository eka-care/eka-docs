/**
 * The bar that floats at the foot of every page: one line to ask in, which
 * opens the panel with the question already asked.
 *
 * It holds only what the reader is typing. The element decides what asking
 * means; this says what was asked and clears itself.
 */
import {useState} from 'preact/hooks';
import {ArrowUp, Sparkles} from './icons';

export function FloatingBar({
  hidden,
  onAsk,
}: {
  /** True while the panel is open, which is where the asking happens then. */
  hidden: boolean;
  onAsk: (question: string) => void;
}) {
  const [draft, setDraft] = useState('');
  const question = draft.trim();
  return (
    <form
      class="ask-ai__float"
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
        autocomplete="off"
        enterkeyhint="send"
      />
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
