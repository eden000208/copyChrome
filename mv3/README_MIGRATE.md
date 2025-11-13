# Migrate to Manifest V3 (scaffold)

This directory contains a minimal MV3 scaffold to help migrate the Firefox-based extension to Chrome MV3.

Files added:
- manifest.json - example Manifest V3 file. This is a scaffold and not a drop-in replacement for the repo root manifest. You should merge fields from your original manifest (icons, content_scripts, popup, options_ui etc).
- sw.js - service worker that loads a small polyfill and provides example lifecycle events.
- browser-polyfill-lite.js - a lightweight Promise wrapper that exposes `browser` on top of `chrome`. Not a full polyfill; for full compatibility use the official webextension-polyfill.

How to use:
1. Switch to the branch `migrate/mv3` on GitHub or check it out locally:
   git checkout migrate/mv3

2. Copy files from `mv3/` to the repository root (or merge changes into your existing files):
   - Replace root `manifest.json` with `mv3/manifest.json` (merge values carefully).
   - Move `mv3/sw.js` to the root and ensure `manifest.json` background.service_worker points to it.
   - Place `browser-polyfill-lite.js` alongside your other assets and load it before other scripts that use `browser.*`.

3. Test in Chrome/Edge/Brave:
   - Open chrome://extensions
   - Enable Developer mode
   - Load unpacked (choose the repository root after merging files)

4. Notes & next steps:
   - The service worker environment has no DOM. If your original background script uses document/window, move DOM logic into popup/options or into content scripts.
   - If your extension uses API calls such as `browser.tabs.executeScript`, convert to `chrome.scripting.executeScript` or call via the polyfill where possible.
   - For full compatibility, consider replacing `browser-polyfill-lite.js` with Mozilla's official webextension-polyfill (https://github.com/mozilla/webextension-polyfill), which you can add to the repo and import where needed.

If you'd like, I can now open a PR from `migrate/mv3` into your default branch with these scaffold files and a checklist of remaining tasks. Alternatively I can continue by merging these changes into the repo root and attempting automated replacements of `browser.` -> `chrome.` where safe.