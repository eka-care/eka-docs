// The Fork button shows once the collection is published to a public Postman
// workspace: pass its collection ID (postmanCollectionId) and workspace ID
// (postmanWorkspaceId), both from the collection's Share > Via API menu.
export const PostmanCollection = ({ collection, environment, postmanCollectionId, postmanWorkspaceId, children }) => {
  const [copied, setCopied] = useState(false);
  const link = "https://developer.eka.care" + collection;
  const forkUrl = postmanCollectionId && postmanWorkspaceId
    ? "https://god.gw.postman.com/run-collection/" + postmanCollectionId +
      "?action=collection%2Ffork&source=rip_markdown&collection-url=" +
      encodeURIComponent("entityId=" + postmanCollectionId + "&entityType=collection&workspaceId=" + postmanWorkspaceId)
    : null;

  const copy = (event) => {
    const code = event.currentTarget.previousElementSibling;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {
      // Clipboard blocked: select the link so it can be copied by hand.
      window.getSelection().selectAllChildren(code);
    });
  };

  const downloadIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  );

  return (
    <div className="eka-postman not-prose">
      <div className="eka-postman-text">{children}</div>
      <div className="eka-postman-actions">
        <a className="eka-postman-btn eka-postman-btn-primary" href={collection} download>
          {downloadIcon} Collection
        </a>
        {environment && (
          <a className="eka-postman-btn" href={environment} download>
            {downloadIcon} Environment
          </a>
        )}
        {forkUrl && (
          <a className="eka-postman-btn" href={forkUrl} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="6" cy="5" r="2" />
              <circle cx="18" cy="5" r="2" />
              <circle cx="12" cy="19" r="2" />
              <path d="M6 7v2a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7" />
              <path d="M12 12v5" />
            </svg>
            Fork in Postman
          </a>
        )}
      </div>
      <div className="eka-postman-link">
        <code>{link}</code>
        <button type="button" onClick={copy} aria-label="Copy collection link" title={copied ? "Copied" : "Copy link"}>
          {copied ? "Copied" : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
      <div className="eka-postman-note">
        Postman, Insomnia, Hoppscotch and Bruno take this through Import, as a link or as the downloaded file.
      </div>
    </div>
  );
};
