!(function (e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(
        ((e = 'undefined' != typeof globalThis ? globalThis : e || self).idb =
          {})
      );
})(this, function (e) {
  'use strict';
  const t = (e, t) => t.some((t) => e instanceof t);
  let n, r;
  const o = new WeakMap(),
    s = new WeakMap(),
    i = new WeakMap();
  let a = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ('done' === t) return o.get(e);
        if ('store' === t)
          return n.objectStoreNames[1]
            ? void 0
            : n.objectStore(n.objectStoreNames[0]);
      }
      return f(e[t]);
    },
    set: (e, t, n) => ((e[t] = n), !0),
    has: (e, t) =>
      (e instanceof IDBTransaction && ('done' === t || 'store' === t)) ||
      t in e,
  };
  function c(e) {
    a = e(a);
  }
  function u(e) {
    return (
      r ||
      (r = [
        IDBCursor.prototype.advance,
        IDBCursor.prototype.continue,
        IDBCursor.prototype.continuePrimaryKey,
      ])
    ).includes(e)
      ? function (...t) {
          return e.apply(l(this), t), f(this.request);
        }
      : function (...t) {
          return f(e.apply(l(this), t));
        };
  }
  function d(e) {
    return 'function' == typeof e
      ? u(e)
      : (e instanceof IDBTransaction &&
          (function (e) {
            if (o.has(e)) return;
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
            o.set(e, t);
          })(e),
        t(
          e,
          n ||
            (n = [
              IDBDatabase,
              IDBObjectStore,
              IDBIndex,
              IDBCursor,
              IDBTransaction,
            ])
        )
          ? new Proxy(e, a)
          : e);
  }
  function f(e) {
    if (e instanceof IDBRequest)
      return (function (e) {
        const t = new Promise((t, n) => {
          const r = () => {
              e.removeEventListener('success', o),
                e.removeEventListener('error', s);
            },
            o = () => {
              t(f(e.result)), r();
            },
            s = () => {
              n(e.error), r();
            };
          e.addEventListener('success', o), e.addEventListener('error', s);
        });
        return i.set(t, e), t;
      })(e);
    if (s.has(e)) return s.get(e);
    const t = d(e);
    return t !== e && (s.set(e, t), i.set(t, e)), t;
  }
  const l = (e) => i.get(e);
  const p = ['get', 'getKey', 'getAll', 'getAllKeys', 'count'],
    D = ['put', 'add', 'delete', 'clear'],
    I = new Map();
  function y(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || 'string' != typeof t) return;
    if (I.get(t)) return I.get(t);
    const n = t.replace(/FromIndex$/, ''),
      r = t !== n,
      o = D.includes(n);
    if (
      !(n in (r ? IDBIndex : IDBObjectStore).prototype) ||
      (!o && !p.includes(n))
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
    return I.set(t, s), s;
  }
  c((e) => ({
    ...e,
    get: (t, n, r) => y(t, n) || e.get(t, n, r),
    has: (t, n) => !!y(t, n) || e.has(t, n),
  }));
  const B = ['continue', 'continuePrimaryKey', 'advance'],
    b = {},
    g = new WeakMap(),
    v = new WeakMap(),
    h = {
      get(e, t) {
        if (!B.includes(t)) return e[t];
        let n = b[t];
        return (
          n ||
            (n = b[t] =
              function (...e) {
                g.set(this, v.get(this)[t](...e));
              }),
          n
        );
      },
    };
  async function* m(...e) {
    let t = this;
    if ((t instanceof IDBCursor || (t = await t.openCursor(...e)), !t)) return;
    const n = new Proxy(t, h);
    for (v.set(n, t), i.set(n, l(t)); t; )
      yield n, (t = await (g.get(n) || t.continue())), g.delete(n);
  }
  function w(e, n) {
    return (
      (n === Symbol.asyncIterator &&
        t(e, [IDBIndex, IDBObjectStore, IDBCursor])) ||
      ('iterate' === n && t(e, [IDBIndex, IDBObjectStore]))
    );
  }
  c((e) => ({
    ...e,
    get: (t, n, r) => (w(t, n) ? m : e.get(t, n, r)),
    has: (t, n) => w(t, n) || e.has(t, n),
  })),
    (e.deleteDB = function (e, { blocked: t } = {}) {
      const n = indexedDB.deleteDatabase(e);
      return (
        t && n.addEventListener('blocked', (e) => t(e.oldVersion, e)),
        f(n).then(() => {})
      );
    }),
    (e.openDB = function (
      e,
      t,
      { blocked: n, upgrade: r, blocking: o, terminated: s } = {}
    ) {
      const i = indexedDB.open(e, t),
        a = f(i);
      return (
        r &&
          i.addEventListener('upgradeneeded', (e) => {
            r(f(i.result), e.oldVersion, e.newVersion, f(i.transaction), e);
          }),
        n &&
          i.addEventListener('blocked', (e) =>
            n(e.oldVersion, e.newVersion, e)
          ),
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
    }),
    (e.unwrap = l),
    (e.wrap = f);
});
