export async function registerAndSyncServiceWorker({
  sync_key,
  appId,
  email,
  type,
}: {
  sync_key: string;
  appId: number;
  type: 'SYNC_UP' | 'SYNC_DOWN';
  email: string;
}) {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      registration?.active?.postMessage({
        type: type,
        payload: {
          syncKey: sync_key,
          appId: appId,
          userId: email,
        },
      });
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  }
}
