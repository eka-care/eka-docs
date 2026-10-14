/**
 * Finding a page to attach, from inside a conversation.
 *
 * The list is the docs site's own llms.txt: every page with its title and a
 * line about it, published on every deployment and readable by any embed, so
 * this needs no search service. Its links carry whatever site address the
 * build was configured with, so only each link's path is kept and it is put
 * back on the docs origin the widget was given. A page's text is the same
 * path with `.md` on the end, which the site's build writes beside every page.
 */
export type PageEntry = {title: string; path: string; description: string};

const LINE = /^- \[([^\]]+)\]\(([^)\s]+)\)(?::\s*(.*))?$/;

const pathOf = (link: string): string | null => {
  try {
    return new URL(link, 'https://placeholder.invalid').pathname;
  } catch {
    return null;
  }
};

const links = (text: string) =>
  text.split('\n').flatMap((raw) => {
    const m = LINE.exec(raw.trim());
    const path = m && pathOf(m[2]);
    return m && path ? [{title: m[1], path, description: (m[3] ?? '').replace(/<[^>]*>/g, '').trim()}] : [];
  });

/** Every page a list links to: any path ending in `.md`, kept without it. */
export function parseLlms(text: string): PageEntry[] {
  const out: PageEntry[] = [];
  const seen = new Set<string>();
  for (const link of links(text)) {
    if (!link.path.endsWith('.md')) continue;
    const path = link.path.slice(0, -3).replace(/\/$/, '');
    if (!path || seen.has(path)) continue;
    seen.add(path);
    out.push({...link, path});
  }
  return out;
}

/** The further lists a list points to, which live under /_llms/ and end in `.txt`. */
export function parseIndex(text: string): string[] {
  return [
    ...new Set(
      links(text)
        .map((link) => link.path)
        .filter((path) => path.startsWith('/_llms/') && path.endsWith('.txt')),
    ),
  ];
}

const escape = (word: string) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Pages matching every word typed, best first: a word starting a word in the
 * title beats one inside it, which beats one only in the path or description.
 * Ties go to the shorter title, which is usually the more general page.
 */
export function searchPages(entries: PageEntry[], query: string, limit = 8): PageEntry[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const scored: {entry: PageEntry; score: number}[] = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    const rest = `${entry.path} ${entry.description}`.toLowerCase();
    let score = 0;
    let every = true;
    for (const word of words) {
      if (new RegExp(`\\b${escape(word)}`).test(title)) score += 3;
      else if (title.includes(word)) score += 2;
      else if (rest.includes(word)) score += 1;
      else {
        every = false;
        break;
      }
    }
    if (every) scored.push({entry, score});
  }
  return scored
    .sort((a, b) => b.score - a.score || a.entry.title.length - b.entry.title.length)
    .slice(0, limit)
    .map((hit) => hit.entry);
}

const trim = (origin: string) => origin.replace(/\/$/, '');
export const pageUrl = (docsOrigin: string, path: string) => `${trim(docsOrigin)}${path}`;
export const markdownUrl = (docsOrigin: string, path: string) => `${trim(docsOrigin)}${path}.md`;

/**
 * Whether what came back for a page's markdown is really a web page. A
 * static host that serves its app shell for any path it does not have, the
 * docs dev server and many production hosts among them, answers a missing
 * `.md` with a 200 and a whole HTML document. That is not the page, and
 * sending it to the model as if it were would be worse than attaching
 * nothing, so it is treated as the failure it is.
 */
export function isHtmlDocument(text: string): boolean {
  return /^\s*(?:<!doctype html|<html[\s>])/i.test(text);
}

let pages: Promise<PageEntry[]> | null = null;

const textOf = (url: string) =>
  fetch(url).then((res) => (res.ok ? res.text() : Promise.reject(new Error(`status ${res.status}`))));

/** Pages from the lists a text points to, following them `depth` levels down. A list that fails is skipped. */
async function listed(origin: string, text: string, depth: number): Promise<PageEntry[]> {
  const found = parseLlms(text);
  if (depth === 0) return found;
  const more = await Promise.allSettled(
    parseIndex(text).map((path) => textOf(`${origin}${path}`).then((body) => listed(origin, body, depth - 1))),
  );
  for (const one of more) if (one.status === 'fulfilled') found.push(...one.value);
  const seen = new Set<string>();
  return found.filter((e) => !seen.has(e.path) && !!seen.add(e.path));
}

/**
 * The page list, fetched once per page load. The site's llms.txt points to
 * lists of its own, which can point to more, so they are followed two levels
 * down. A failed top-level fetch is not cached, so the next search tries
 * again rather than staying empty.
 */
export function loadPages(docsOrigin: string): Promise<PageEntry[]> {
  if (!pages) {
    const origin = trim(docsOrigin);
    pages = textOf(`${origin}/llms.txt`)
      .then((text) => listed(origin, text, 2))
      .catch((err) => {
        pages = null;
        throw err;
      });
  }
  return pages;
}
