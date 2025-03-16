(async function () {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      let activeWorker = registration.active;
      if (!activeWorker && registration.waiting) {
        activeWorker = registration.waiting;
      } else if (!activeWorker && registration.installing) {
        activeWorker = registration.installing;
      }

      const initializeDBServiceWorker = (worker: ServiceWorker) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          if (event.data.status === 'success') {
            console.log('Message:', event.data.message);
          } else {
            console.error('Failed to initialize DB.');
          }
        };

        worker.postMessage({ type: 'INIT_DB' }, [messageChannel.port2]);
      };

      if (activeWorker) {
        activeWorker.addEventListener('statechange', () => {
          if (activeWorker.state === 'activated') {
            console.log('Service Worker activated!');
            initializeDBServiceWorker(activeWorker);
          }
        });

        if (activeWorker.state === 'activated') {
          console.log('Service Worker is already activated!');
          initializeDBServiceWorker(activeWorker);
        }
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
})();
