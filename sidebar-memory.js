// Keep sidebar groups open across pages. On every navigation Mintlify closes each group that is not marked
// `expanded` in docs.json and does not hold the current page. This remembers every group seen open, whether the
// reader or Mintlify opened it (per product sidebar, for the browser tab's session), forgets one only when the reader
// clicks it closed, and reopens the rest after each page change.
// A group with a root page opens that page when clicked, so it is never clicked here; scripts/build-nav.py lists
// those groups in window.EKA_ROOT_GROUPS (api-reference-link.js).
// It reads only Mintlify's sidebar markup (#navigation-items, li[data-title], aria-expanded); if that changes,
// the sidebar falls back to Mintlify's own behaviour.
(function () {
  // Mintlify can inject the script twice; two copies would each reopen a group and close it again.
  if (window.__ekaSidebarMemory) return;
  window.__ekaSidebarMemory = true;
  var KEY = "eka-sidebar-open";
  var load = function () { try { return JSON.parse(sessionStorage.getItem(KEY) || "[]"); } catch (e) { return []; } };
  var save = function (list) { try { sessionStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {} };
  var open = new Set(load());
  var BTN = "#navigation-items li[data-title] > button[aria-expanded]";

  // A group's key: the product sidebar's heading, then each group title down to this one.
  function keyOf(btn) {
    var nav = document.getElementById("navigation-items");
    var head = nav && nav.querySelector(".sidebar-title");
    var path = [], li = btn.closest("li[data-title]");
    while (li && nav && nav.contains(li)) { path.unshift(li.getAttribute("data-title")); li = li.parentElement.closest("li[data-title]"); }
    return (head ? head.textContent.trim() : "") + " / " + path.join(" / ");
  }

  // Record on the click itself, before Mintlify toggles the group, so closing a group is never undone by restore().
  // A group the reader closed is not remembered again just because it still looks open for a moment.
  var restoring = false, closed = new Set();
  document.addEventListener("click", function (e) {
    if (restoring) return;
    var btn = e.target.closest && e.target.closest(BTN);
    if (!btn) return;
    var k = keyOf(btn);
    if (btn.getAttribute("aria-expanded") === "true") { open.delete(k); closed.add(k); } else { open.add(k); closed.delete(k); }
    save(Array.from(open));
  }, true);

  // Remember every open group, then reopen remembered ones that Mintlify closed. Nested groups appear once their
  // parent opens, so this runs again on the next mutation until nothing is left to open.
  var queued = false;
  function restore() {
    queued = false;
    var before = open.size;
    document.querySelectorAll(BTN + '[aria-expanded="true"]').forEach(function (btn) { var k = keyOf(btn); if (!closed.has(k)) open.add(k); });
    if (open.size !== before) save(Array.from(open));
    var navigates = new Set(window.EKA_ROOT_GROUPS || []);
    restoring = true;
    document.querySelectorAll(BTN + '[aria-expanded="false"]').forEach(function (btn) {
      var k = keyOf(btn);
      if (open.has(k) && !navigates.has(k)) btn.click();
    });
    // Mintlify reopens groups marked `expanded` on every page; keep one the reader closed closed, unless it holds the
    // current page (Mintlify marks that group's li data-active="true").
    document.querySelectorAll(BTN + '[aria-expanded="true"]').forEach(function (btn) {
      var k = keyOf(btn);
      if (closed.has(k) && !navigates.has(k) && btn.closest("li[data-title]").getAttribute("data-active") !== "true") btn.click();
    });
    restoring = false;
  }
  // A timeout, not requestAnimationFrame: frames are paused in a tab that is not visible, such as one opened in the
  // background, and the restore would never run there.
  new MutationObserver(function () { if (!queued) { queued = true; setTimeout(restore, 30); } })
    .observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-expanded"] });
})();
