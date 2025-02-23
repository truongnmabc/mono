// /public/init-indexeddb.js

(function () {
  // --- Bundled idb code start ---
  /**
   * Bundled by jsDelivr using Rollup v2.79.2 and Terser v5.37.0.
   * Original file: /npm/idb@8.0.2/build/index.js
   *
   * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
   */
  const e = (e, t) => t.some((t) => e instanceof t);
  let t, n;
  const r = new WeakMap(),
    o = new WeakMap(),
    s = new WeakMap();
  let i = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ('done' === t) return r.get(e);
        if ('store' === t)
          return n.objectStoreNames[1]
            ? void 0
            : n.objectStore(n.objectStoreNames[0]);
      }
      return d(e[t]);
    },
    set(e, t, n) {
      return (e[t] = n), !0;
    },
    has(e, t) {
      return (
        (e instanceof IDBTransaction && ('done' === t || 'store' === t)) ||
        t in e
      );
    },
  };
  function a(e) {
    i = e(i);
  }
  function c(e) {
    return (
      n ||
      (n = [
        IDBCursor.prototype.advance,
        IDBCursor.prototype.continue,
        IDBCursor.prototype.continuePrimaryKey,
      ])
    ).includes(e)
      ? function (...t) {
          return e.apply(l(this), t), d(this.request);
        }
      : function (...t) {
          return d(e.apply(l(this), t));
        };
  }
  function u(n) {
    return 'function' == typeof n
      ? c(n)
      : (n instanceof IDBTransaction &&
          (function (e) {
            if (r.has(e)) return;
            const t = new Promise((t, n) => {
              const r = () => {
                  e.removeEventListener('complete', o),
                    e.removeEventListener('error', s),
                    e.removeEventListener('abort', s);
                },
                o = () => {
                  t(), r();
                },
                s = () => {
                  n(e.error || new DOMException('AbortError', 'AbortError')),
                    r();
                };
              e.addEventListener('complete', o),
                e.addEventListener('error', s),
                e.addEventListener('abort', s);
            });
            r.set(e, t);
          })(n),
        e(
          n,
          t ||
            (t = [
              IDBDatabase,
              IDBObjectStore,
              IDBIndex,
              IDBCursor,
              IDBTransaction,
            ])
        )
          ? new Proxy(n, i)
          : n);
  }
  function d(e) {
    if (e instanceof IDBRequest)
      return (function (e) {
        const t = new Promise((t, n) => {
          const r = () => {
              e.removeEventListener('success', o),
                e.removeEventListener('error', s);
            },
            o = () => {
              t(d(e.result)), r();
            },
            s = () => {
              n(e.error), r();
            };
          e.addEventListener('success', o), e.addEventListener('error', s);
        });
        return s.set(t, e), t;
      })(e);
    if (o.has(e)) return o.get(e);
    const t = u(e);
    return t !== e && (o.set(e, t), s.set(t, e)), t;
  }
  const l = (e) => s.get(e);
  function f(
    e,
    t,
    { blocked: n, upgrade: r, blocking: o, terminated: s } = {}
  ) {
    const i = indexedDB.open(e, t),
      a = d(i);
    return (
      r &&
        i.addEventListener('upgradeneeded', (e) => {
          r(d(i.result), e.oldVersion, e.newVersion, d(i.transaction), e);
        }),
      n &&
        i.addEventListener('blocked', (e) => n(e.oldVersion, e.newVersion, e)),
      a
        .then((e) => {
          s && e.addEventListener('close', () => s()),
            o &&
              e.addEventListener('versionchange', (e) =>
                o(e.oldVersion, e.newVersion, e)
              );
        })
        .catch(() => {}),
      a
    );
  }
  function p(e, { blocked: t } = {}) {
    const n = indexedDB.deleteDatabase(e);
    return (
      t && n.addEventListener('blocked', (e) => t(e.oldVersion, e)),
      d(n).then(() => {})
    );
  }
  const D = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
    I = ['put', 'add', 'delete', 'clear'],
    v = new Map();
  function B(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || 'string' != typeof t) return;
    if (v.get(t)) return v.get(t);
    const n = t.replace(/FromIndex$/, ''),
      r = t !== n,
      o = I.includes(n);
    if (
      !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
      (!o && !D.includes(n))
    )
      return;
    const s = async function (e, ...t) {
      const s = this.transaction(e, o ? 'readwrite' : 'readonly');
      let i = s.store;
      return (
        r && (i = i.index(t.shift())),
        (await Promise.all([i[n](...t), o && s.done]))[0]
      );
    };
    return v.set(t, s), s;
  }
  a((e) => ({
    ...e,
    get: (t, n, r) => B(t, n) || e.get(t, n, r),
    has: (t, n) => !!B(t, n) || e.has(t, n),
  }));
  const g = ['continue', 'continuePrimaryKey', 'advance'],
    y = {},
    b = new WeakMap(),
    h = new WeakMap(),
    m = {
      get(e, t) {
        if (!g.includes(t)) return e[t];
        let n = y[t];
        return (
          n ||
            (n = y[t] =
              function (...e) {
                b.set(this, h.get(this)[t](...e));
              }),
          n
        );
      },
    };
  async function* w(...e) {
    let t = this;
    if (!(t instanceof IDBCursor)) {
      t = await t.openCursor(...e);
    }
    if (!t) return;
    const n = new Proxy(t, m);
    for (h.set(n, t), s.set(n, l(t)); t; ) {
      yield n;
      t = await (b.get(n) || t.continue());
      b.delete(n);
    }
  }
  function E(t, n) {
    return (
      (n === Symbol.asyncIterator &&
        e(t, [IDBIndex, IDBObjectStore, IDBCursor])) ||
      ('iterate' === n && e(t, [IDBIndex, IDBObjectStore]))
    );
  }
  a((e) => ({
    ...e,
    get: (t, n, r) => (E(t, n) ? w : e.get(t, n, r)),
    has: (t, n) => E(t, n) || e.has(t, n),
  }));
  // Expose các hàm của idb lên global scope
  window.idb = {
    openDB: f,
    deleteDB: p,
    wrap: d,
    unwrap: l,
  };
  // --- Bundled idb code end ---

  // --- Initialization code ---
  (async function () {
    try {
      const dbName = 'asvab';
      const dbVersion = 1;
      const db = await window.idb.openDB(dbName, dbVersion, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('userProgress')) {
            const store = db.createObjectStore('userProgress', {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('parentId', 'parentId', { unique: false });
          }
          // Tạo bảng testQuestions với chỉ mục gameMode
          if (!db.objectStoreNames.contains('testQuestions')) {
            const store = db.createObjectStore('testQuestions', {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('gameMode', 'gameMode', { unique: false });
          }
          // Tạo bảng paymentInfos với chỉ mục userId
          if (!db.objectStoreNames.contains('paymentInfos')) {
            const store = db.createObjectStore('paymentInfos', {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('userId', 'userId', { unique: false });
          }
          // Tạo bảng questions với các chỉ mục partId và subTopicId
          if (!db.objectStoreNames.contains('questions')) {
            const store = db.createObjectStore('questions', {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('partId', 'partId', { unique: false });
            store.createIndex('subTopicId', 'subTopicId', { unique: false });
          }
          // Tạo bảng topics với chỉ mục slug
          if (!db.objectStoreNames.contains('topics')) {
            const store = db.createObjectStore('topics', {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('slug', 'slug', { unique: false });
          }
          // Tạo bảng useActions với các chỉ mục partId và questionId
          if (!db.objectStoreNames.contains('useActions')) {
            const store = db.createObjectStore('useActions', {
              keyPath: 'id',
              autoIncrement: true,
            });
            store.createIndex('partId', 'partId', { unique: false });
            store.createIndex('questionId', 'questionId', { unique: false });
          }
          // Tạo bảng passingApp
          if (!db.objectStoreNames.contains('passingApp')) {
            db.createObjectStore('passingApp', {
              keyPath: 'id',
              autoIncrement: true,
            });
          }
        },
      });
      console.log('IndexedDB created successfully');
    } catch (error) {
      console.error('Error creating IndexedDB:', error);
    }
  })();
})();
