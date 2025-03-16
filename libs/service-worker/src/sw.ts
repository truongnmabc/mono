import { initData } from './initData';
import { syncDown } from './syncDown';
import { SyncUp } from './syncUp';

self.addEventListener('install', (event) => {
  console.log('Service Worker installed.', event);
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.', event);
});

const dbName = process.env.DB_NAME || 'asvab';
const dbVersion = 1;

let db: IDBDatabase;

self.addEventListener('message', async (event) => {
  if (event.data.type === 'INIT_DB') {
    db = await initData({ dbName, dbVersion });
    event.ports[0].postMessage({
      status: 'success',
      message: 'DB initialized and data fetched (if not already present).',
    });
  }
  if (event.data.type === 'SYNC_UP') {
    const { syncKey, appId, userId } = event.data.payload;
    await SyncUp({ syncKey, appId, userId, db });
  }
  if (event.data.type === 'SYNC_DOWN') {
    const { syncKey, appId, userId } = event.data.payload;
    await syncDown({ syncKey, appId, userId, db });
  }
});
