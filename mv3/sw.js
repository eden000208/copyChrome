// Service worker for MV3. Loads a small polyfill so existing browser.* usage keeps working.
// Note: Service workers have no DOM (no document/window). If your original background relies on DOM,
// move that logic to popup/options or a content script.

importScripts('browser-polyfill-lite.js');

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // activated
});

// Example: listen for messages from content scripts/popup
self.addEventListener('message', (event) => {
  // TODO: handle messages
  // console.log('SW received message', event.data);
});

// If the original repo has a background.js that contains pure logic (no DOM), you can import it here:
// importScripts('/background.js');