// The docs footer ends the way the landing page's does: the portal's name, "Eka Care. Built in India.", and the heart
// from the centre of the Eka mark, which opens the site map. Mintlify's footer has no slot for this text, so it is added
// here and re-added whenever Mintlify re-renders the footer on navigation.
(function () {
  const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16"><path transform="rotate(-90 12 12)" fill="#215FFF" d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
  const add = () => {
    const footer = document.getElementById("footer");
    if (!footer || footer.querySelector(".eka-footmark")) return;
    const row = document.createElement("div");
    row.className = "eka-footmark";
    row.innerHTML = '<b>Eka Developer Portal</b><span>Eka Care. Built in India. <a class="eka-heart" href="/sitemap" aria-label="Site map" title="Site map">' + HEART + "</a></span>";
    footer.appendChild(row);
  };
  add();
  new MutationObserver(add).observe(document.documentElement, { childList: true, subtree: true });
})();
