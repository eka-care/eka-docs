// The Eka console opens in its own tab wherever the docs link to it. Mintlify does that for the navbar's Build Now
// button on desktop but not in the mobile menu, and docs.json has no setting for it.
(function () {
  const fix = () => document.querySelectorAll('a[href^="https://console.eka.care"]:not([target])').forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener";
  });
  fix();
  new MutationObserver(fix).observe(document.documentElement, { childList: true, subtree: true });
})();
