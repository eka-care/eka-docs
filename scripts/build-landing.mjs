// Builds snippets/landing.jsx from landing/source.html.
//
// The landing page is designed and previewed as one self-contained HTML file. Mintlify cannot serve that file as a
// page, so this script turns it into a React component that index.mdx renders in custom mode:
//   - every CSS rule is scoped under .eka-landing, so the page's styles never reach Mintlify's chrome;
//   - :root, html and body in the page's CSS become the .eka-landing wrapper, which carries the colour tokens and
//     a data-theme attribute that mirrors Mintlify's own dark mode;
//   - Mintlify's top bar is hidden on this page only; the page's own nav replaces it and drives Mintlify's search
//     and theme switch;
//   - the page script runs inside a function whose window listeners, timers, frames and observers stop when the
//     reader navigates away, so returning to the page runs it again cleanly.
//
// Run: node scripts/build-landing.mjs

import { readFileSync, writeFileSync } from "node:fs";

const SRC = new URL("../landing/source.html", import.meta.url);
const OUT = new URL("../snippets/landing.jsx", import.meta.url);
const html = readFileSync(SRC, "utf8");

const between = (s, a, b, from = 0) => {
  const i = s.indexOf(a, from);
  if (i < 0) throw new Error(`missing ${a}`);
  const j = s.indexOf(b, i + a.length);
  if (j < 0) throw new Error(`missing ${b}`);
  return [s.slice(i + a.length, j), j + b.length];
};

// The page's own stylesheet is the second <style> (the first is the artifact wrapper's reset).
const [, afterReset] = between(html, "<style>", "</style>");
const [rawCss, afterCss] = between(html, "<style>", "</style>", afterReset);
// Markup: everything from the page wrapper to the main script.
const markStart = html.indexOf('<div class="page" id="page">', afterCss);
const scriptStart = html.lastIndexOf("<script>");
if (markStart < 0 || scriptStart < markStart) throw new Error("markup bounds");
const markup = html.slice(markStart, scriptStart).trim();
const [rawJs] = between(html, "<script>", "</script>", scriptStart);
const fontHref = html.match(/<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com[^"]+)">/)[1];
const libs = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map((m) => m[1]);

/* ---------- CSS scoping ---------- */

const ROOT = ".eka-landing";

function splitTop(s) {
  const out = [];
  let depth = 0, cur = "";
  for (const c of s) {
    if (c === "(" || c === "[") depth++;
    if (c === ")" || c === "]") depth--;
    if (c === "," && depth === 0) { out.push(cur); cur = ""; } else cur += c;
  }
  out.push(cur);
  return out;
}

function scopeSelector(sel) {
  sel = sel.trim();
  const m = sel.match(/^(:root|html|body)(?![\w-])(.*)$/s);
  if (m) return ROOT + m[2];
  return `${ROOT} ${sel}`;
}

function scopeCss(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let i = 0;
  const skipBlock = () => {
    const s = i;
    let d = 1;
    while (d) {
      const c = css[i++];
      if (c === undefined) throw new Error("unbalanced CSS");
      if (c === "{") d++;
      else if (c === "}") d--;
    }
    return css.slice(s, i - 1);
  };
  const block = () => {
    let o = "";
    while (i < css.length) {
      const ob = css.indexOf("{", i), cb = css.indexOf("}", i);
      if (cb !== -1 && (ob === -1 || cb < ob)) { i = cb + 1; return o; }
      if (ob === -1) { i = css.length; return o; }
      const head = css.slice(i, ob).trim();
      i = ob + 1;
      if (head.startsWith("@")) {
        if (/^@(-webkit-)?keyframes|^@font-face|^@property/.test(head)) o += `${head}{${skipBlock()}}\n`;
        else o += `${head}{\n${block()}}\n`;
      } else {
        o += `${splitTop(head).map(scopeSelector).join(",")}{${skipBlock().trim()}}\n`;
      }
    }
    return o;
  };
  return block();
}

// Mintlify keeps its own top bar on custom mode pages. The landing page has its own nav, so Mintlify's bar is hidden
// while this stylesheet is on the page, which is only while the landing page is mounted, along with the top padding
// Mintlify reserves for it on small screens. The bar stays in the DOM:
// the page's search and theme buttons click its hidden controls, so they open Mintlify's search and set its theme.
// The wrapper clips sideways overflow with clip, not hidden: hidden would make it a scroll container and unstick the nav.
const OVERRIDES = `
#navbar{display:none!important}
div:has(> #content-area){padding-top:0!important}
${ROOT}{min-height:100vh;overflow-x:clip}
`;

const css = scopeCss(rawCss) + OVERRIDES;

/* ---------- JS ---------- */

let js = rawJs;
const swap = (from, to, all = false) => {
  const n = js.split(from).length - 1;
  if (all ? n < 1 : n !== 1) throw new Error(`expected ${all ? "some" : "one"} "${from}", found ${n}`);
  js = all ? js.split(from).join(to) : js.replace(from, () => to);
};
// Colour tokens and the theme now live on the wrapper, not on <html>.
swap("const root=document.documentElement,tb=", "const root=LANDING_ROOT,tb=");
// Dragged clones and the dragging cursor stay inside the wrapper, where the scoped CSS reaches them.
swap("document.body.", "LANDING_ROOT.", true);
// The theme button sets Mintlify's theme, which the wrapper mirrors; the canvases redraw when the mirror changes.
swap(
  'tb.addEventListener("click",()=>{root.dataset.theme=isDark()?"light":"dark";try{localStorage.setItem("eka-theme",root.dataset.theme)}catch(e){};themeIcon();torchDraw()});',
  'tb.addEventListener("click",()=>MINT_THEME(isDark()?"light":"dark"));new MutationObserver(()=>{themeIcon();torchDraw()}).observe(root,{attributes:true,attributeFilter:["data-theme"]});'
);

/* ---------- Component ---------- */

const json = (v) => JSON.stringify(v);
const out = `// Generated by scripts/build-landing.mjs from landing/source.html. Do not edit by hand: change the source and
// run node scripts/build-landing.mjs.
import { useEffect, useRef } from "react";

// Mintlify brings only the imported component into scope, so the page data lives inside it.
export const Landing = () => {
  const LANDING_CSS = ${json(css)};
  const LANDING_HTML = ${json(markup)};
  const LANDING_JS = ${json(js)};
  const LANDING_LIBS = ${json(libs)};
  const LANDING_FONTS = ${json(fontHref)};
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    let alive = true;
    const live = (f) => (...a) => (alive ? f(...a) : undefined);
    const cleanups = [];

    // Mirror Mintlify's dark mode onto the wrapper.
    const html = document.documentElement;
    const syncTheme = () => { el.dataset.theme = html.classList.contains("dark") ? "dark" : "light"; };
    syncTheme();
    const themeObs = new MutationObserver(syncTheme);
    themeObs.observe(html, { attributes: true, attributeFilter: ["class"] });
    cleanups.push(() => themeObs.disconnect());

    // The page's search button opens Mintlify's search (⌘K already does, through Mintlify's own shortcut).
    const search = el.querySelector('[aria-label="Search the docs"]');
    const openSearch = () => (document.getElementById("search-bar-entry") || document.getElementById("search-bar-entry-mobile"))?.click();
    search?.addEventListener("click", openSearch);

    if (!document.querySelector('link[data-eka-landing-fonts]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet"; l.href = LANDING_FONTS; l.dataset.ekaLandingFonts = "";
      document.head.appendChild(l);
    }
    const load = (src) => new Promise((resolve) => {
      const found = document.querySelector('script[data-eka-landing-lib="' + src + '"]');
      if (found) { if (found.dataset.loaded) resolve(); else found.addEventListener("load", resolve); found.addEventListener("error", resolve); return; }
      const s = document.createElement("script");
      s.src = src; s.dataset.ekaLandingLib = src;
      s.addEventListener("load", () => { s.dataset.loaded = "1"; resolve(); });
      s.addEventListener("error", resolve);
      document.head.appendChild(s);
    });

    Promise.all(LANDING_LIBS.map(load)).then(() => {
      if (!alive) return;
      const winListeners = [];
      const watch = (Base) => class extends Base {
        constructor(cb, opts) { super(live(cb), opts); cleanups.push(() => this.disconnect()); }
      };
      const api = {
        LANDING_ROOT: el,
        // Sets Mintlify's theme by choosing from its (hidden) theme menu, so the docs pages keep the choice.
        MINT_THEME: (mode) => {
          const trigger = document.getElementById("theme-preference-menu-trigger");
          if (!trigger) return;
          trigger.click();
          let tries = 0;
          const pick = () => {
            const item = [...document.querySelectorAll('[role="menuitem"]')].find((e) => e.textContent.includes("Switch to " + mode + " theme"));
            if (item) item.click();
            else if (++tries < 20) window.requestAnimationFrame(pick);
          };
          window.requestAnimationFrame(pick);
        },
        addEventListener: (t, f, o) => { const w = live(f); winListeners.push([t, f, w, o]); window.addEventListener(t, w, o); },
        removeEventListener: (t, f, o) => {
          const k = winListeners.findIndex((x) => x[0] === t && x[1] === f);
          if (k >= 0) { window.removeEventListener(t, winListeners[k][2], o); winListeners.splice(k, 1); }
        },
        requestAnimationFrame: (f) => window.requestAnimationFrame(live(f)),
        setTimeout: (f, ms) => window.setTimeout(live(f), ms),
        setInterval: (f, ms) => { const id = window.setInterval(live(f), ms); cleanups.push(() => clearInterval(id)); return id; },
        matchMedia: (q) => {
          const m = window.matchMedia(q);
          return { get matches() { return m.matches; }, media: m.media,
            addEventListener: (t, f) => { const w = live(f); m.addEventListener(t, w); cleanups.push(() => m.removeEventListener(t, w)); } };
        },
        IntersectionObserver: watch(window.IntersectionObserver),
        ResizeObserver: watch(window.ResizeObserver),
        MutationObserver: watch(window.MutationObserver),
      };
      cleanups.push(() => winListeners.forEach(([t, , w, o]) => window.removeEventListener(t, w, o)));
      new Function(...Object.keys(api), LANDING_JS)(...Object.values(api));
    });

    return () => { alive = false; cleanups.forEach((f) => f()); };
  }, []);

  return (
    <div ref={ref} className="eka-landing" data-theme="light"
      dangerouslySetInnerHTML={{ __html: "<style>" + LANDING_CSS + "</style>" + LANDING_HTML }} />
  );
};
`;

writeFileSync(OUT, out);
console.log(`snippets/landing.jsx: ${(out.length / 1024).toFixed(0)} KB (css ${css.length}, html ${markup.length}, js ${js.length})`);
