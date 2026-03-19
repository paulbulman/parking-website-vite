import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('handleStaleChunkReload', () => {
  let reloadMock: ReturnType<typeof vi.fn>;
  let handler: EventListener;

  beforeEach(() => {
    reloadMock = vi.fn();
    sessionStorage.clear();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
      configurable: true,
    });

    const originalAddEventListener = window.addEventListener.bind(window);
    vi.spyOn(window, 'addEventListener').mockImplementation(
      (type: string, listener: EventListenerOrEventListenerObject) => {
        if (type === 'vite:preloadError') {
          handler = listener as EventListener;
        } else {
          originalAddEventListener(type, listener);
        }
      },
    );

    vi.resetModules();
  });

  it('reloads the page on vite:preloadError', async () => {
    await import('./handleStaleChunkReload');

    handler(new Event('vite:preloadError'));

    expect(reloadMock).toHaveBeenCalled();
    expect(sessionStorage.getItem('chunk-reload')).toBe('true');
  });

  it('does not reload if a reload was already attempted', async () => {
    sessionStorage.setItem('chunk-reload', 'true');
    await import('./handleStaleChunkReload');

    handler(new Event('vite:preloadError'));

    expect(reloadMock).not.toHaveBeenCalled();
  });

  it('clears the reload flag on load', async () => {
    sessionStorage.setItem('chunk-reload', 'true');

    await import('./handleStaleChunkReload');

    expect(sessionStorage.getItem('chunk-reload')).toBeNull();
  });
});
