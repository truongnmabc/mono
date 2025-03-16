(function () {
  const dbName = process.env.DB_NAME || 'asvab';
  const dbVersion = 1;

  const openRequest = indexedDB.open(dbName, dbVersion);

  // Sự kiện xảy ra khi cần tạo mới DB hoặc nâng cấp DB (nếu version thay đổi)
  openRequest.onupgradeneeded = function (event: IDBVersionChangeEvent) {
    const request = event.target as IDBOpenDBRequest;
    const db = request.result as IDBDatabase;
    // Tạo/chỉ định các object store & index
    if (!db.objectStoreNames.contains('userProgress')) {
      const store = db.createObjectStore('userProgress', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('parentId', 'parentId', { unique: false });
    }

    if (!db.objectStoreNames.contains('testQuestions')) {
      const store = db.createObjectStore('testQuestions', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('gameMode', 'gameMode', { unique: false });
    }

    if (!db.objectStoreNames.contains('paymentInfos')) {
      const store = db.createObjectStore('paymentInfos', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('userId', 'userId', { unique: false });
    }

    if (!db.objectStoreNames.contains('questions')) {
      const store = db.createObjectStore('questions', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('partId', 'partId', { unique: false });
      store.createIndex('subTopicId', 'subTopicId', { unique: false });
    }

    if (!db.objectStoreNames.contains('topics')) {
      const store = db.createObjectStore('topics', {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('parentId', 'parentId', { unique: false });
      store.createIndex('slug', 'slug', { unique: false });
    }

    if (!db.objectStoreNames.contains('useActions')) {
      db.createObjectStore('useActions', {
        keyPath: 'questionId',
        autoIncrement: true,
      });
    }

    if (!db.objectStoreNames.contains('passingApp')) {
      db.createObjectStore('passingApp', {
        keyPath: 'id',
        autoIncrement: true,
      });
    }
  };

  // Sự kiện xảy ra khi mở DB thành công (hoặc nâng cấp xong)
  openRequest.onsuccess = function () {
    console.log('IndexedDB created');
  };

  // Sự kiện xảy ra khi có lỗi
  openRequest.onerror = function (event) {
    console.error('Error creating/opening IndexedDB:', event.target);
  };
})();
