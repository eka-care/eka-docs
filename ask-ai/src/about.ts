/**
 * What the panel says about itself.
 *
 * "What can the Ask AI assistant do?" is a question about this panel, not
 * about any one API, and sent to the model it would be answered from whatever
 * search ranked highest. The answer is the same for every reader on every
 * page, so the panel gives it and the model is not asked.
 */
export const ABOUT = [
  "I answer questions about the Eka Developer Platform, from developer.eka.care's documentation and API reference. Every answer lists the pages it used, so you can check the source.",
  '',
  '**What you can ask**',
  '',
  '- How to do something: get an API key, start an EkaScribe session, parse a lab report.',
  '- What an error response means, and how to fix it.',
  '- What a field, header or term means.',
  '',
  '**What you can give me**',
  '',
  '- **A page.** Press **+** and attach any page on this site, or open me from **Ask about this page**.',
  '- **A file.** A request, a response or a log, as a text file. It is read in your browser, and only its text is sent.',
  '',
  '**What I will not do**',
  '',
  '- Write code for your project. I show curl requests.',
  '- Answer from general knowledge. A path, a header or an error code comes from these docs or not at all.',
  '- Stand in for support, for accounts, credentials or production approval.',
  '',
  'Your conversations stay in this browser. **History** lists them, and **New** starts again.',
].join('\n');

/**
 * Whether a question is about the panel itself. Deliberately narrow: only a
 * question that is plainly asking what the assistant is or does, so an API
 * question that happens to say "you" still goes to the model.
 */
const ABOUT_RE =
  /^(?:what (?:can|do|does) (?:you|this (?:assistant|bot|chat)|the (?:ask ai )?(?:assistant|bot)|ask ai) do|what (?:is|are) (?:you|ask ai|this (?:assistant|bot))|who are you|how (?:do|can) i use (?:you|this|ask ai|the assistant)|help)\s*\??$/i;

export function isAboutQuestion(question: string): boolean {
  return ABOUT_RE.test(question.trim().replace(/\s+/g, ' '));
}
