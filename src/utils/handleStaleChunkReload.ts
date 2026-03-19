// After a deployment, users with a cached index.html may try to load old chunks
// that no longer exist. Vite fires 'vite:preloadError' when this happens.
// Reloading fetches the new index.html with correct chunk references.
// A sessionStorage flag prevents infinite reload loops.

const RELOAD_FLAG = 'chunk-reload';
const alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === 'true';

sessionStorage.removeItem(RELOAD_FLAG);

window.addEventListener('vite:preloadError', () => {
  if (!alreadyReloaded) {
    sessionStorage.setItem(RELOAD_FLAG, 'true');
    window.location.reload();
  }
});
