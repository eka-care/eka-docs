/**
 * The empty state: the orb, the greeting, and the openers as pills.
 *
 * The mock still says what it is here, under the greeting, because a panel
 * that cannot answer has to say so before anyone asks it something.
 */
import {EkaOrb} from './orb/eka-orb';
import type {Starter} from './starters';

type Props = {
  starters: Starter[];
  mock: boolean;
  onPick: (prompt: string) => void;
};

export function Welcome({starters, mock, onPick}: Props) {
  return (
    <div class="ask-ai__welcome">
      <EkaOrb size={96} label="Eka" />
      <h3 class="ask-ai__greeting">Hi! What are we building today?</h3>
      {mock && (
        <p class="ask-ai__welcome-note">
          A preview, not connected to an assistant.
        </p>
      )}
      <div class="ask-ai__pills">
        {starters.map((starter, index) => (
          <button
            key={starter.prompt}
            type="button"
            class="ask-ai__pill"
            style={{animationDelay: `${400 + index * 60}ms`}}
            title={starter.prompt === starter.label ? undefined : starter.prompt}
            onClick={() => onPick(starter.prompt)}>
            {starter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
