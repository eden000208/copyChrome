/*
 A small compatibility shim to provide a Promise-based `browser` namespace on top of Chrome's
 callback-based `chrome` APIs. This is a lightweight alternative to the full webextension-polyfill
 and intended as a temporary helper to make migration easier.

 Limitations: not a full polyfill. For complex APIs or edge cases use the official
 webextension-polyfill from https://github.com/mozilla/webextension-polyfill
*/
(function (global) {
  if (global.browser) return;
  const chromeObj = global.chrome || {};

  function wrapFns(obj) {
    if (!obj) return obj;
    return new Proxy(obj, {
      get(target, prop) {
        const val = target[prop];
        if (typeof val === 'function') {
          return function (...args) {
            // If caller provided a callback as last argument, call chrome API directly
            if (args.length && typeof args[args.length - 1] === 'function') {
              return val.apply(target, args);
            }
            // Otherwise, return a Promise that resolves with the callback result
            return new Promise((resolve, reject) => {
              try {
                val.call(target, ...args, (res) => {
                  const lastError = (global.chrome && chrome.runtime && chrome.runtime.lastError) ? chrome.runtime.lastError : null;
                  if (lastError) reject(lastError);
                  else resolve(res);
                });
              } catch (err) {
                reject(err);
              }
            });
          };
        }
        if (typeof val === 'object' && val !== null) {
          return wrapFns(val);
        }
        return val;
      }
    });
  }

  try {
    global.browser = wrapFns(chromeObj);
  } catch (e) {
    // fallback: expose chrome as browser
    global.browser = chromeObj;
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));