!(function () {
  'use strict';
  !(async function () {
    if ('serviceWorker' in navigator)
      try {
        const e = await navigator.serviceWorker.register('/sw.js');
        let t = e.active;
        !t && e.waiting
          ? (t = e.waiting)
          : !t && e.installing && (t = e.installing);
        const a = (e) => {
          const t = new MessageChannel();
          (t.port1.onmessage = (e) => {
            'success' === e.data.status
              ? console.log('Message:', e.data.message)
              : console.error('Failed to initialize DB.');
          }),
            e.postMessage({ type: 'INIT_DB' }, [t.port2]);
        };
        t &&
          (t.addEventListener('statechange', () => {
            'activated' === t.state &&
              (console.log('Service Worker activated!'), a(t));
          }),
          'activated' === t.state &&
            (console.log('Service Worker is already activated!'), a(t)));
      } catch (e) {
        console.error('Service Worker registration failed:', e);
      }
  })();
})();
