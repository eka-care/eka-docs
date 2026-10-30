/** A source an answer drew on, surfaced under it as a citation. */
export type Source = {id: string; title: string; status: string; url: string};

/** A text file the reader attached, read in the browser and never uploaded. */
export type Attached = {name: string; text: string};

/**
 * A page attached as context for the conversation, either by the host through
 * the element's `attachPage` method or by the reader from the page search.
 *
 * An empty `markdown` is the honest failure: the page could not be fetched,
 * and the panel says so rather than pretending.
 */
export type PageAttachment = {title: string; url: string; markdown: string};
