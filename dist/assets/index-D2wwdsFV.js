const __vite__mapDeps = (
    i,
    m = __vite__mapDeps,
    d = m.f || (m.f = ['./katex-BgsA2lO1.css']),
) => i.map((i) => d[i]);
var e = Object.create,
    t = Object.defineProperty,
    n = Object.getOwnPropertyDescriptor,
    r = Object.getOwnPropertyNames,
    i = Object.getPrototypeOf,
    a = Object.prototype.hasOwnProperty,
    o = (e, t, n) => () => {
        if (n) throw n[0];
        try {
            return (e && (t = e((e = 0))), t);
        } catch (e) {
            throw ((n = [e]), e);
        }
    },
    s = (e, t) => () => (
        t || (e((t = { exports: {} }).exports, t), (e = null)),
        t.exports
    ),
    c = (e, n) => {
        let r = {};
        for (var i in e) t(r, i, { get: e[i], enumerable: !0 });
        return (n || t(r, Symbol.toStringTag, { value: `Module` }), r);
    },
    l = (e, i, o, s) => {
        if ((i && typeof i == `object`) || typeof i == `function`)
            for (var c = r(i), l = 0, u = c.length, d; l < u; l++)
                ((d = c[l]),
                    !a.call(e, d) &&
                        d !== o &&
                        t(e, d, {
                            get: ((e) => i[e]).bind(null, d),
                            enumerable: !(s = n(i, d)) || s.enumerable,
                        }));
        return e;
    },
    u = (n, r, o) => (
        (o = n == null ? {} : e(i(n))),
        l(
            r || !n || !n.__esModule || !a.call(n, `default`)
                ? t(o, `default`, { value: n, enumerable: !0 })
                : o,
            n,
        )
    ),
    d = (e) =>
        a.call(e, `module.exports`)
            ? e[`module.exports`]
            : l(t({}, `__esModule`, { value: !0 }), e);
(function () {
    let e = document.createElement(`link`).relList;
    if (e && e.supports && e.supports(`modulepreload`)) return;
    for (let e of document.querySelectorAll(`link[rel="modulepreload"]`)) n(e);
    new MutationObserver((e) => {
        for (let t of e)
            if (t.type === `childList`)
                for (let e of t.addedNodes)
                    e.tagName === `LINK` && e.rel === `modulepreload` && n(e);
    }).observe(document, { childList: !0, subtree: !0 });
    function t(e) {
        let t = {};
        return (
            e.integrity && (t.integrity = e.integrity),
            e.referrerPolicy && (t.referrerPolicy = e.referrerPolicy),
            (t.credentials =
                e.crossOrigin === `use-credentials`
                    ? `include`
                    : e.crossOrigin === `anonymous`
                      ? `omit`
                      : `same-origin`),
            t
        );
    }
    function n(e) {
        if (e.ep) return;
        e.ep = !0;
        let n = t(e);
        fetch(e.href, n);
    }
})();
var f = s((e) => {
        var t = Symbol.for(`react.transitional.element`),
            n = Symbol.for(`react.portal`),
            r = Symbol.for(`react.fragment`),
            i = Symbol.for(`react.strict_mode`),
            a = Symbol.for(`react.profiler`),
            o = Symbol.for(`react.consumer`),
            s = Symbol.for(`react.context`),
            c = Symbol.for(`react.forward_ref`),
            l = Symbol.for(`react.suspense`),
            u = Symbol.for(`react.memo`),
            d = Symbol.for(`react.lazy`),
            f = Symbol.for(`react.activity`),
            p = Symbol.for(`react.view_transition`),
            m = Symbol.iterator;
        function h(e) {
            return typeof e != `object` || !e
                ? null
                : ((e = (m && e[m]) || e[`@@iterator`]),
                  typeof e == `function` ? e : null);
        }
        var g = {
                isMounted: function () {
                    return !1;
                },
                enqueueForceUpdate: function () {},
                enqueueReplaceState: function () {},
                enqueueSetState: function () {},
            },
            _ = Object.assign,
            v = {};
        function y(e, t, n) {
            ((this.props = e),
                (this.context = t),
                (this.refs = v),
                (this.updater = n || g));
        }
        ((y.prototype.isReactComponent = {}),
            (y.prototype.setState = function (e, t) {
                if (typeof e != `object` && typeof e != `function` && e != null)
                    throw Error(
                        `takes an object of state variables to update or a function which returns an object of state variables.`,
                    );
                this.updater.enqueueSetState(this, e, t, `setState`);
            }),
            (y.prototype.forceUpdate = function (e) {
                this.updater.enqueueForceUpdate(this, e, `forceUpdate`);
            }));
        function b() {}
        b.prototype = y.prototype;
        function ee(e, t, n) {
            ((this.props = e),
                (this.context = t),
                (this.refs = v),
                (this.updater = n || g));
        }
        var te = (ee.prototype = new b());
        ((te.constructor = ee), _(te, y.prototype), (te.isPureReactComponent = !0));
        var ne = Array.isArray;
        function re() {}
        var x = { H: null, A: null, T: null, S: null },
            ie = Object.prototype.hasOwnProperty;
        function S(e, n, r) {
            var i = r.ref;
            return {
                $$typeof: t,
                type: e,
                key: n,
                ref: i === void 0 ? null : i,
                props: r,
            };
        }
        function ae(e, t) {
            return S(e.type, t, e.props);
        }
        function oe(e) {
            return typeof e == `object` && !!e && e.$$typeof === t;
        }
        function se(e) {
            var t = { '=': `=0`, ':': `=2` };
            return (
                `$` +
                e.replace(/[=:]/g, function (e) {
                    return t[e];
                })
            );
        }
        var ce = /\/+/g;
        function le(e, t) {
            return typeof e == `object` && e && e.key != null
                ? se(`` + e.key)
                : t.toString(36);
        }
        function ue(e) {
            switch (e.status) {
                case `fulfilled`:
                    return e.value;
                case `rejected`:
                    throw e.reason;
                default:
                    switch (
                        (typeof e.status == `string`
                            ? e.then(re, re)
                            : ((e.status = `pending`),
                              e.then(
                                  function (t) {
                                      e.status === `pending` &&
                                          ((e.status = `fulfilled`), (e.value = t));
                                  },
                                  function (t) {
                                      e.status === `pending` &&
                                          ((e.status = `rejected`), (e.reason = t));
                                  },
                              )),
                        e.status)
                    ) {
                        case `fulfilled`:
                            return e.value;
                        case `rejected`:
                            throw e.reason;
                    }
            }
            throw e;
        }
        function de(e, r, i, a, o) {
            var s = typeof e;
            (s === `undefined` || s === `boolean`) && (e = null);
            var c = !1;
            if (e === null) c = !0;
            else
                switch (s) {
                    case `bigint`:
                    case `string`:
                    case `number`:
                        c = !0;
                        break;
                    case `object`:
                        switch (e.$$typeof) {
                            case t:
                            case n:
                                c = !0;
                                break;
                            case d:
                                return ((c = e._init), de(c(e._payload), r, i, a, o));
                        }
                }
            if (c)
                return (
                    (o = o(e)),
                    (c = a === `` ? `.` + le(e, 0) : a),
                    ne(o)
                        ? ((i = ``),
                          c != null && (i = c.replace(ce, `$&/`) + `/`),
                          de(o, r, i, ``, function (e) {
                              return e;
                          }))
                        : o != null &&
                          (oe(o) &&
                              (o = ae(
                                  o,
                                  i +
                                      (o.key == null || (e && e.key === o.key)
                                          ? ``
                                          : (`` + o.key).replace(ce, `$&/`) + `/`) +
                                      c,
                              )),
                          r.push(o)),
                    1
                );
            c = 0;
            var l = a === `` ? `.` : a + `:`;
            if (ne(e))
                for (var u = 0; u < e.length; u++)
                    ((a = e[u]), (s = l + le(a, u)), (c += de(a, r, i, s, o)));
            else if (((u = h(e)), typeof u == `function`))
                for (e = u.call(e), u = 0; !(a = e.next()).done;)
                    ((a = a.value), (s = l + le(a, u++)), (c += de(a, r, i, s, o)));
            else if (s === `object`) {
                if (typeof e.then == `function`) return de(ue(e), r, i, a, o);
                throw (
                    (r = String(e)),
                    Error(
                        `Objects are not valid as a React child (found: ` +
                            (r === `[object Object]`
                                ? `object with keys {` + Object.keys(e).join(`, `) + `}`
                                : r) +
                            `). If you meant to render a collection of children, use an array instead.`,
                    )
                );
            }
            return c;
        }
        function C(e, t, n) {
            if (e == null) return e;
            var r = [],
                i = 0;
            return (
                de(e, r, ``, ``, function (e) {
                    return t.call(n, e, i++);
                }),
                r
            );
        }
        function fe(e) {
            if (e._status === -1) {
                var t = e._result,
                    n = t();
                (n.then(
                    function (t) {
                        (e._status === 0 || e._status === -1) &&
                            ((e._status = 1),
                            (e._result = t),
                            n.status === void 0 &&
                                ((n.status = `fulfilled`), (n.value = t)));
                    },
                    function (t) {
                        (e._status === 0 || e._status === -1) &&
                            ((e._status = 2),
                            (e._result = t),
                            n.status === void 0 &&
                                ((n.status = `rejected`), (n.reason = t)));
                    },
                ),
                    e._status === -1 && ((e._status = 0), (e._result = n)));
            }
            if (e._status === 1) return e._result.default;
            throw e._result;
        }
        var pe =
            typeof reportError == `function`
                ? reportError
                : function (e) {
                      if (
                          typeof window == `object` &&
                          typeof window.ErrorEvent == `function`
                      ) {
                          var t = new window.ErrorEvent(`error`, {
                              bubbles: !0,
                              cancelable: !0,
                              message:
                                  typeof e == `object` &&
                                  e &&
                                  typeof e.message == `string`
                                      ? String(e.message)
                                      : String(e),
                              error: e,
                          });
                          if (!window.dispatchEvent(t)) return;
                      } else if (
                          typeof process == `object` &&
                          typeof process.emit == `function`
                      ) {
                          process.emit(`uncaughtException`, e);
                          return;
                      }
                      console.error(e);
                  };
        function me(e) {
            var t = x.T,
                n = {};
            ((n.types = t === null ? null : t.types), (x.T = n));
            try {
                var r = e(),
                    i = x.S;
                (i !== null && i(n, r),
                    typeof r == `object` &&
                        r &&
                        typeof r.then == `function` &&
                        r.then(re, pe));
            } catch (e) {
                pe(e);
            } finally {
                (t !== null && n.types !== null && (t.types = n.types), (x.T = t));
            }
        }
        function he(e) {
            var t = x.T;
            if (t !== null) {
                var n = t.types;
                n === null ? (t.types = [e]) : n.indexOf(e) === -1 && n.push(e);
            } else me(he.bind(null, e));
        }
        var ge = {
            map: C,
            forEach: function (e, t, n) {
                C(
                    e,
                    function () {
                        t.apply(this, arguments);
                    },
                    n,
                );
            },
            count: function (e) {
                var t = 0;
                return (
                    C(e, function () {
                        t++;
                    }),
                    t
                );
            },
            toArray: function (e) {
                return (
                    C(e, function (e) {
                        return e;
                    }) || []
                );
            },
            only: function (e) {
                if (!oe(e))
                    throw Error(
                        `React.Children.only expected to receive a single React element child.`,
                    );
                return e;
            },
        };
        ((e.Activity = f),
            (e.Children = ge),
            (e.Component = y),
            (e.Fragment = r),
            (e.Profiler = a),
            (e.PureComponent = ee),
            (e.StrictMode = i),
            (e.Suspense = l),
            (e.ViewTransition = p),
            (e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = x),
            (e.__COMPILER_RUNTIME = {
                __proto__: null,
                c: function (e) {
                    return x.H.useMemoCache(e);
                },
            }),
            (e.addTransitionType = he),
            (e.cache = function (e) {
                return function () {
                    return e.apply(null, arguments);
                };
            }),
            (e.cacheSignal = function () {
                return null;
            }),
            (e.cloneElement = function (e, t, n) {
                if (e == null)
                    throw Error(
                        `The argument must be a React element, but you passed ` +
                            e +
                            `.`,
                    );
                var r = _({}, e.props),
                    i = e.key;
                if (t != null)
                    for (a in (t.key !== void 0 && (i = `` + t.key), t))
                        !ie.call(t, a) ||
                            a === `key` ||
                            a === `__self` ||
                            a === `__source` ||
                            (a === `ref` && t.ref === void 0) ||
                            (r[a] = t[a]);
                var a = arguments.length - 2;
                if (a === 1) r.children = n;
                else if (1 < a) {
                    for (var o = Array(a), s = 0; s < a; s++) o[s] = arguments[s + 2];
                    r.children = o;
                }
                return S(e.type, i, r);
            }),
            (e.createContext = function (e) {
                return (
                    (e = {
                        $$typeof: s,
                        _currentValue: e,
                        _currentValue2: e,
                        _threadCount: 0,
                        Provider: null,
                        Consumer: null,
                    }),
                    (e.Provider = e),
                    (e.Consumer = { $$typeof: o, _context: e }),
                    e
                );
            }),
            (e.createElement = function (e, t, n) {
                var r,
                    i = {},
                    a = null;
                if (t != null)
                    for (r in (t.key !== void 0 && (a = `` + t.key), t))
                        ie.call(t, r) &&
                            r !== `key` &&
                            r !== `__self` &&
                            r !== `__source` &&
                            (i[r] = t[r]);
                var o = arguments.length - 2;
                if (o === 1) i.children = n;
                else if (1 < o) {
                    for (var s = Array(o), c = 0; c < o; c++) s[c] = arguments[c + 2];
                    i.children = s;
                }
                if (e && e.defaultProps)
                    for (r in ((o = e.defaultProps), o))
                        i[r] === void 0 && (i[r] = o[r]);
                return S(e, a, i);
            }),
            (e.createRef = function () {
                return { current: null };
            }),
            (e.forwardRef = function (e) {
                return { $$typeof: c, render: e };
            }),
            (e.isValidElement = oe),
            (e.lazy = function (e) {
                return {
                    $$typeof: d,
                    _payload: { _status: -1, _result: e },
                    _init: fe,
                };
            }),
            (e.memo = function (e, t) {
                return { $$typeof: u, type: e, compare: t === void 0 ? null : t };
            }),
            (e.startTransition = me),
            (e.unstable_useCacheRefresh = function () {
                return x.H.useCacheRefresh();
            }),
            (e.use = function (e) {
                return x.H.use(e);
            }),
            (e.useActionState = function (e, t, n) {
                return x.H.useActionState(e, t, n);
            }),
            (e.useCallback = function (e, t) {
                return x.H.useCallback(e, t);
            }),
            (e.useContext = function (e) {
                return x.H.useContext(e);
            }),
            (e.useDebugValue = function () {}),
            (e.useDeferredValue = function (e, t) {
                return x.H.useDeferredValue(e, t);
            }),
            (e.useEffect = function (e, t) {
                return x.H.useEffect(e, t);
            }),
            (e.useEffectEvent = function (e) {
                return x.H.useEffectEvent(e);
            }),
            (e.useId = function () {
                return x.H.useId();
            }),
            (e.useImperativeHandle = function (e, t, n) {
                return x.H.useImperativeHandle(e, t, n);
            }),
            (e.useInsertionEffect = function (e, t) {
                return x.H.useInsertionEffect(e, t);
            }),
            (e.useLayoutEffect = function (e, t) {
                return x.H.useLayoutEffect(e, t);
            }),
            (e.useMemo = function (e, t) {
                return x.H.useMemo(e, t);
            }),
            (e.useOptimistic = function (e, t) {
                return x.H.useOptimistic(e, t);
            }),
            (e.useReducer = function (e, t, n) {
                return x.H.useReducer(e, t, n);
            }),
            (e.useRef = function (e) {
                return x.H.useRef(e);
            }),
            (e.useState = function (e) {
                return x.H.useState(e);
            }),
            (e.useSyncExternalStore = function (e, t, n) {
                return x.H.useSyncExternalStore(e, t, n);
            }),
            (e.useTransition = function () {
                return x.H.useTransition();
            }),
            (e.version = `19.3.0`));
    }),
    p = s((e, t) => {
        t.exports = f();
    }),
    m = s((e) => {
        function t(e, t) {
            var n = e.length;
            e.push(t);
            a: for (; 0 < n;) {
                var r = (n - 1) >>> 1,
                    a = e[r];
                if (0 < i(a, t)) ((e[r] = t), (e[n] = a), (n = r));
                else break a;
            }
        }
        function n(e) {
            return e.length === 0 ? null : e[0];
        }
        function r(e) {
            if (e.length === 0) return null;
            var t = e[0],
                n = e.pop();
            if (n !== t) {
                e[0] = n;
                a: for (var r = 0, a = e.length, o = a >>> 1; r < o;) {
                    var s = 2 * (r + 1) - 1,
                        c = e[s],
                        l = s + 1,
                        u = e[l];
                    if (0 > i(c, n))
                        l < a && 0 > i(u, c)
                            ? ((e[r] = u), (e[l] = n), (r = l))
                            : ((e[r] = c), (e[s] = n), (r = s));
                    else if (l < a && 0 > i(u, n)) ((e[r] = u), (e[l] = n), (r = l));
                    else break a;
                }
            }
            return t;
        }
        function i(e, t) {
            var n = e.sortIndex - t.sortIndex;
            return n === 0 ? e.id - t.id : n;
        }
        if (
            ((e.unstable_now = void 0),
            typeof performance == `object` && typeof performance.now == `function`)
        ) {
            var a = performance;
            e.unstable_now = function () {
                return a.now();
            };
        } else {
            var o = Date,
                s = o.now();
            e.unstable_now = function () {
                return o.now() - s;
            };
        }
        var c = [],
            l = [],
            u = 1,
            d = null,
            f = 3,
            p = !1,
            m = !1,
            h = !1,
            g = !1,
            _ = typeof setTimeout == `function` ? setTimeout : null,
            v = typeof clearTimeout == `function` ? clearTimeout : null,
            y = typeof setImmediate < `u` ? setImmediate : null;
        function b(e) {
            for (var i = n(l); i !== null;) {
                if (i.callback === null) r(l);
                else if (i.startTime <= e)
                    (r(l), (i.sortIndex = i.expirationTime), t(c, i));
                else break;
                i = n(l);
            }
        }
        function ee(e) {
            if (((h = !1), b(e), !m)) {
                if (n(c) !== null) ((m = !0), te || ((te = !0), ae()));
                else {
                    var t = n(l);
                    t !== null && ce(ee, t.startTime - e);
                }
            }
        }
        var te = !1,
            ne = -1,
            re = 5,
            x = -1;
        function ie() {
            return g ? !0 : !(e.unstable_now() - x < re);
        }
        function S() {
            if (((g = !1), te)) {
                var t = e.unstable_now();
                x = t;
                var i = !0;
                try {
                    a: {
                        ((m = !1), h && ((h = !1), v(ne), (ne = -1)), (p = !0));
                        var a = f;
                        try {
                            b: {
                                for (
                                    b(t), d = n(c);
                                    d !== null && !(d.expirationTime > t && ie());
                                ) {
                                    var o = d.callback;
                                    if (typeof o == `function`) {
                                        ((d.callback = null), (f = d.priorityLevel));
                                        var s = o(d.expirationTime <= t);
                                        if (
                                            ((t = e.unstable_now()),
                                            typeof s == `function`)
                                        ) {
                                            ((d.callback = s), b(t), (i = !0));
                                            break b;
                                        }
                                        (d === n(c) && r(c), b(t));
                                    } else r(c);
                                    d = n(c);
                                }
                                if (d !== null) i = !0;
                                else {
                                    var u = n(l);
                                    (u !== null && ce(ee, u.startTime - t), (i = !1));
                                }
                            }
                            break a;
                        } finally {
                            ((d = null), (f = a), (p = !1));
                        }
                        i = void 0;
                    }
                } finally {
                    i ? ae() : (te = !1);
                }
            }
        }
        var ae;
        if (typeof y == `function`)
            ae = function () {
                y(S);
            };
        else if (typeof MessageChannel < `u`) {
            var oe = new MessageChannel(),
                se = oe.port2;
            ((oe.port1.onmessage = S),
                (ae = function () {
                    se.postMessage(null);
                }));
        } else
            ae = function () {
                _(S, 0);
            };
        function ce(t, n) {
            ne = _(function () {
                t(e.unstable_now());
            }, n);
        }
        ((e.unstable_IdlePriority = 5),
            (e.unstable_ImmediatePriority = 1),
            (e.unstable_LowPriority = 4),
            (e.unstable_NormalPriority = 3),
            (e.unstable_Profiling = null),
            (e.unstable_UserBlockingPriority = 2),
            (e.unstable_cancelCallback = function (e) {
                e.callback = null;
            }),
            (e.unstable_forceFrameRate = function (e) {
                0 > e || 125 < e
                    ? console.error(
                          `forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`,
                      )
                    : (re = 0 < e ? Math.floor(1e3 / e) : 5);
            }),
            (e.unstable_getCurrentPriorityLevel = function () {
                return f;
            }),
            (e.unstable_next = function (e) {
                switch (f) {
                    case 1:
                    case 2:
                    case 3:
                        var t = 3;
                        break;
                    default:
                        t = f;
                }
                var n = f;
                f = t;
                try {
                    return e();
                } finally {
                    f = n;
                }
            }),
            (e.unstable_requestPaint = function () {
                g = !0;
            }),
            (e.unstable_runWithPriority = function (e, t) {
                switch (e) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        break;
                    default:
                        e = 3;
                }
                var n = f;
                f = e;
                try {
                    return t();
                } finally {
                    f = n;
                }
            }),
            (e.unstable_scheduleCallback = function (r, i, a) {
                var o = e.unstable_now();
                switch (
                    (typeof a == `object` && a
                        ? ((a = a.delay),
                          (a = typeof a == `number` && 0 < a ? o + a : o))
                        : (a = o),
                    r)
                ) {
                    case 1:
                        var s = -1;
                        break;
                    case 2:
                        s = 250;
                        break;
                    case 5:
                        s = 1073741823;
                        break;
                    case 4:
                        s = 1e4;
                        break;
                    default:
                        s = 5e3;
                }
                return (
                    (s = a + s),
                    (r = {
                        id: u++,
                        callback: i,
                        priorityLevel: r,
                        startTime: a,
                        expirationTime: s,
                        sortIndex: -1,
                    }),
                    a > o
                        ? ((r.sortIndex = a),
                          t(l, r),
                          n(c) === null &&
                              r === n(l) &&
                              (h ? (v(ne), (ne = -1)) : (h = !0), ce(ee, a - o)))
                        : ((r.sortIndex = s),
                          t(c, r),
                          m || p || ((m = !0), te || ((te = !0), ae()))),
                    r
                );
            }),
            (e.unstable_shouldYield = ie),
            (e.unstable_wrapCallback = function (e) {
                var t = f;
                return function () {
                    var n = f;
                    f = t;
                    try {
                        return e.apply(this, arguments);
                    } finally {
                        f = n;
                    }
                };
            }));
    }),
    h = s((e, t) => {
        t.exports = m();
    }),
    g = s((e) => {
        var t = p();
        function n(e) {
            var t = `https://react.dev/errors/` + e;
            if (1 < arguments.length) {
                t += `?args[]=` + encodeURIComponent(arguments[1]);
                for (var n = 2; n < arguments.length; n++)
                    t += `&args[]=` + encodeURIComponent(arguments[n]);
            }
            return (
                `Minified React error #` +
                e +
                `; visit ` +
                t +
                ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
            );
        }
        function r() {}
        var i = {
                d: {
                    f: r,
                    r: function () {
                        throw Error(n(522));
                    },
                    D: r,
                    C: r,
                    L: r,
                    m: r,
                    X: r,
                    S: r,
                    M: r,
                },
                p: 0,
                findDOMNode: null,
            },
            a = Symbol.for(`react.portal`),
            o = Symbol.for(`react.recoverable`),
            s = Symbol.for(`react.optimistic_key`);
        function c(e, t, n) {
            var r =
                3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
            return {
                $$typeof: a,
                key: r == null ? null : r === s ? s : `` + r,
                children: e,
                containerInfo: t,
                implementation: n,
            };
        }
        var l = t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
        function u(e, t) {
            if (e === `font`) return ``;
            if (typeof t == `string`) return t === `use-credentials` ? t : ``;
        }
        ((e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = i),
            (e.browser = function (e) {
                return { $$typeof: o, _reason: e };
            }),
            (e.createPortal = function (e, t) {
                var r =
                    2 < arguments.length && arguments[2] !== void 0
                        ? arguments[2]
                        : null;
                if (!t || (t.nodeType !== 1 && t.nodeType !== 9 && t.nodeType !== 11))
                    throw Error(n(299));
                return c(e, t, null, r);
            }),
            (e.flushSync = function (e) {
                var t = l.T,
                    n = i.p;
                try {
                    if (((l.T = null), (i.p = 2), e)) return e();
                } finally {
                    ((l.T = t), (i.p = n), i.d.f());
                }
            }),
            (e.preconnect = function (e, t) {
                typeof e == `string` &&
                    (t
                        ? ((t = t.crossOrigin),
                          (t =
                              typeof t == `string`
                                  ? t === `use-credentials`
                                      ? t
                                      : ``
                                  : void 0))
                        : (t = null),
                    i.d.C(e, t));
            }),
            (e.prefetchDNS = function (e) {
                typeof e == `string` && i.d.D(e);
            }),
            (e.preinit = function (e, t) {
                if (typeof e == `string` && t && typeof t.as == `string`) {
                    var n = t.as,
                        r = u(n, t.crossOrigin),
                        a = typeof t.integrity == `string` ? t.integrity : void 0,
                        o =
                            typeof t.fetchPriority == `string`
                                ? t.fetchPriority
                                : void 0;
                    n === `style`
                        ? i.d.S(
                              e,
                              typeof t.precedence == `string` ? t.precedence : void 0,
                              { crossOrigin: r, integrity: a, fetchPriority: o },
                          )
                        : n === `script` &&
                          i.d.X(e, {
                              crossOrigin: r,
                              integrity: a,
                              fetchPriority: o,
                              nonce: typeof t.nonce == `string` ? t.nonce : void 0,
                          });
                }
            }),
            (e.preinitModule = function (e, t) {
                if (typeof e == `string`) {
                    if (typeof t == `object` && t) {
                        if (t.as == null || t.as === `script`) {
                            var n = u(t.as, t.crossOrigin);
                            i.d.M(e, {
                                crossOrigin: n,
                                integrity:
                                    typeof t.integrity == `string`
                                        ? t.integrity
                                        : void 0,
                                nonce: typeof t.nonce == `string` ? t.nonce : void 0,
                                fetchPriority:
                                    typeof t.fetchPriority == `string`
                                        ? t.fetchPriority
                                        : void 0,
                            });
                        }
                    } else t ?? i.d.M(e);
                }
            }),
            (e.preload = function (e, t) {
                if (
                    typeof e == `string` &&
                    typeof t == `object` &&
                    t &&
                    typeof t.as == `string`
                ) {
                    var n = t.as,
                        r = u(n, t.crossOrigin);
                    i.d.L(e, n, {
                        crossOrigin: r,
                        integrity:
                            typeof t.integrity == `string` ? t.integrity : void 0,
                        nonce: typeof t.nonce == `string` ? t.nonce : void 0,
                        type: typeof t.type == `string` ? t.type : void 0,
                        fetchPriority:
                            typeof t.fetchPriority == `string`
                                ? t.fetchPriority
                                : void 0,
                        referrerPolicy:
                            typeof t.referrerPolicy == `string`
                                ? t.referrerPolicy
                                : void 0,
                        imageSrcSet:
                            typeof t.imageSrcSet == `string` ? t.imageSrcSet : void 0,
                        imageSizes:
                            typeof t.imageSizes == `string` ? t.imageSizes : void 0,
                        media: typeof t.media == `string` ? t.media : void 0,
                    });
                }
            }),
            (e.preloadModule = function (e, t) {
                if (typeof e == `string`) {
                    if (t) {
                        var n = u(t.as, t.crossOrigin);
                        i.d.m(e, {
                            as:
                                typeof t.as == `string` && t.as !== `script`
                                    ? t.as
                                    : void 0,
                            crossOrigin: n,
                            integrity:
                                typeof t.integrity == `string` ? t.integrity : void 0,
                            nonce: typeof t.nonce == `string` ? t.nonce : void 0,
                            fetchPriority:
                                typeof t.fetchPriority == `string`
                                    ? t.fetchPriority
                                    : void 0,
                        });
                    } else i.d.m(e);
                }
            }),
            (e.requestFormReset = function (e) {
                i.d.r(e);
            }),
            (e.unstable_batchedUpdates = function (e, t) {
                return e(t);
            }),
            (e.useFormState = function (e, t, n) {
                return l.H.useFormState(e, t, n);
            }),
            (e.useFormStatus = function () {
                return l.H.useHostTransitionStatus();
            }),
            (e.version = `19.3.0`));
    }),
    _ = s((e, t) => {
        function n() {
            if (
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u` &&
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == `function`
            )
                try {
                    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
                } catch (e) {
                    console.error(e);
                }
        }
        (n(), (t.exports = g()));
    }),
    v = s((e) => {
        var t = h(),
            n = p(),
            r = _();
        function i(e) {
            var t = `https://react.dev/errors/` + e;
            if (1 < arguments.length) {
                t += `?args[]=` + encodeURIComponent(arguments[1]);
                for (var n = 2; n < arguments.length; n++)
                    t += `&args[]=` + encodeURIComponent(arguments[n]);
            }
            return (
                `Minified React error #` +
                e +
                `; visit ` +
                t +
                ` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`
            );
        }
        function a(e) {
            return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
        }
        function o(e) {
            for (var t = e, n = t; n && !n.alternate;)
                ((t = n), t.flags & 4098 && (e = t.return), (n = t.return));
            for (; t.return;) t = t.return;
            return t.tag === 3 ? e : null;
        }
        function s(e) {
            if (e.tag === 13) {
                var t = e.memoizedState;
                if (
                    (t === null &&
                        ((e = e.alternate), e !== null && (t = e.memoizedState)),
                    t !== null)
                )
                    return t.dehydrated;
            }
            return null;
        }
        function c(e) {
            if (e.tag === 31) {
                var t = e.memoizedState;
                if (
                    (t === null &&
                        ((e = e.alternate), e !== null && (t = e.memoizedState)),
                    t !== null)
                )
                    return t.dehydrated;
            }
            return null;
        }
        function l(e) {
            if (o(e) !== e) throw Error(i(188));
        }
        function u(e) {
            var t = e.alternate;
            if (!t) {
                if (((t = o(e)), t === null)) throw Error(i(188));
                return t === e ? e : null;
            }
            for (var n = e, r = t; ;) {
                var a = n.return;
                if (a === null) break;
                var s = a.alternate;
                if (s === null) {
                    if (((r = a.return), r !== null)) {
                        n = r;
                        continue;
                    }
                    break;
                }
                if (a.child === s.child) {
                    for (s = a.child; s;) {
                        if (s === n) return (l(a), e);
                        if (s === r) return (l(a), t);
                        s = s.sibling;
                    }
                    throw Error(i(188));
                }
                if (n.return !== r.return) ((n = a), (r = s));
                else {
                    for (var c = !1, u = a.child; u;) {
                        if (u === n) {
                            ((c = !0), (n = a), (r = s));
                            break;
                        }
                        if (u === r) {
                            ((c = !0), (r = a), (n = s));
                            break;
                        }
                        u = u.sibling;
                    }
                    if (!c) {
                        for (u = s.child; u;) {
                            if (u === n) {
                                ((c = !0), (n = s), (r = a));
                                break;
                            }
                            if (u === r) {
                                ((c = !0), (r = s), (n = a));
                                break;
                            }
                            u = u.sibling;
                        }
                        if (!c) throw Error(i(189));
                    }
                }
                if (n.alternate !== r) throw Error(i(190));
            }
            if (n.tag !== 3) throw Error(i(188));
            return n.stateNode.current === n ? e : t;
        }
        function d(e) {
            var t = e.tag;
            if (t === 5 || t === 26 || t === 27 || t === 6) return e;
            for (e = e.child; e !== null;) {
                if (((t = d(e)), t !== null)) return t;
                e = e.sibling;
            }
            return null;
        }
        function f(e, t, n, r, i, a) {
            for (; e !== null;) {
                if (
                    ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, r, i, a)) ||
                    ((e.tag !== 22 || e.memoizedState === null) &&
                        (t || (e.tag !== 5 && e.tag !== 27)) &&
                        f(e.child, t, n, r, i, a))
                )
                    return !0;
                e = e.sibling;
            }
            return !1;
        }
        function m(e) {
            for (e = e.return; e !== null;) {
                if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
                e = e.return;
            }
            return null;
        }
        function g(e) {
            var t = !1;
            for (
                e = e.return;
                e !== null &&
                (e.tag === 4 && (t = !0), e.tag !== 3 && e.tag !== 5 && e.tag !== 27);
            )
                e = e.return;
            return t;
        }
        function v(e) {
            var t = [null, null],
                n = m(e);
            return (n === null || y(t, e, n.child, { foundSelf: !1 }), t);
        }
        function y(e, t, n, r) {
            for (; n !== null;) {
                if (n === t) r.foundSelf = !0;
                else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
                    if (r.foundSelf) return ((e[1] = n), !0);
                    e[0] = n;
                } else if (
                    (n.tag !== 22 || n.memoizedState === null) &&
                    y(e, t, n.child, r)
                )
                    return !0;
                n = n.sibling;
            }
            return !1;
        }
        function b(e) {
            switch (e.tag) {
                case 5:
                case 27:
                case 6:
                    return e.stateNode;
                case 3:
                    return e.stateNode.containerInfo;
                default:
                    throw Error(i(559));
            }
        }
        var ee = null,
            te = null;
        function ne(e, t, n) {
            return e === n || (e === t && ((ee = e), !0));
        }
        function re(e, t, n) {
            return e === n ? ((te = e), !1) : e === t && (te !== null && (ee = e), !0);
        }
        function x(e) {
            if (e === null) return null;
            do e = e === null ? null : e.return;
            while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
            return e || null;
        }
        function ie(e, t, n) {
            for (var r = 0, i = e; i; i = n(i)) r++;
            i = 0;
            for (var a = t; a; a = n(a)) i++;
            for (; 0 < r - i;) ((e = n(e)), r--);
            for (; 0 < i - r;) ((t = n(t)), i--);
            for (; r--;) {
                if (e === t || (t !== null && e === t.alternate)) return e;
                ((e = n(e)), (t = n(t)));
            }
            return null;
        }
        var S = Object.assign,
            ae = Symbol.for(`react.element`),
            oe = Symbol.for(`react.transitional.element`),
            se = Symbol.for(`react.portal`),
            ce = Symbol.for(`react.fragment`),
            le = Symbol.for(`react.strict_mode`),
            ue = Symbol.for(`react.profiler`),
            de = Symbol.for(`react.consumer`),
            C = Symbol.for(`react.context`),
            fe = Symbol.for(`react.forward_ref`),
            pe = Symbol.for(`react.suspense`),
            me = Symbol.for(`react.suspense_list`),
            he = Symbol.for(`react.memo`),
            ge = Symbol.for(`react.lazy`),
            _e = Symbol.for(`react.activity`),
            ve = Symbol.for(`react.legacy_hidden`),
            ye = Symbol.for(`react.memo_cache_sentinel`),
            be = Symbol.for(`react.view_transition`),
            xe = Symbol.for(`react.recoverable`),
            Se = Symbol.iterator;
        function Ce(e) {
            return typeof e != `object` || !e
                ? null
                : ((e = (Se && e[Se]) || e[`@@iterator`]),
                  typeof e == `function` ? e : null);
        }
        var we = Symbol.for(`react.client.reference`);
        function Te(e) {
            if (e == null) return null;
            if (typeof e == `function`)
                return e.$$typeof === we ? null : e.displayName || e.name || null;
            if (typeof e == `string`) return e;
            switch (e) {
                case ce:
                    return `Fragment`;
                case ue:
                    return `Profiler`;
                case le:
                    return `StrictMode`;
                case pe:
                    return `Suspense`;
                case me:
                    return `SuspenseList`;
                case _e:
                    return `Activity`;
                case be:
                    return `ViewTransition`;
            }
            if (typeof e == `object`)
                switch (e.$$typeof) {
                    case se:
                        return `Portal`;
                    case C:
                        return e.displayName || `Context`;
                    case de:
                        return (e._context.displayName || `Context`) + `.Consumer`;
                    case fe:
                        var t = e.render;
                        return (
                            (e = e.displayName),
                            (e ||=
                                ((e = t.displayName || t.name || ``),
                                e === `` ? `ForwardRef` : `ForwardRef(` + e + `)`)),
                            e
                        );
                    case he:
                        return (
                            (t = e.displayName || null),
                            t === null ? Te(e.type) || `Memo` : t
                        );
                    case ge:
                        ((t = e._payload), (e = e._init));
                        try {
                            return Te(e(t));
                        } catch {}
                }
            return null;
        }
        var Ee = Array.isArray,
            w = n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
            T = r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
            De = { pending: !1, data: null, method: null, action: null },
            Oe = [],
            ke = -1;
        function Ae(e) {
            return { current: e };
        }
        function je(e) {
            0 > ke || ((e.current = Oe[ke]), (Oe[ke] = null), ke--);
        }
        function E(e, t) {
            (ke++, (Oe[ke] = e.current), (e.current = t));
        }
        var Me = Ae(null),
            Ne = Ae(null),
            Pe = Ae(null),
            Fe = Ae(null);
        function Ie(e, t) {
            switch ((E(Pe, t), E(Ne, e), E(Me, null), t.nodeType)) {
                case 9:
                case 11:
                    e = (e = t.documentElement) && (e = e.namespaceURI) ? up(e) : 0;
                    break;
                default:
                    if (((e = t.tagName), (t = t.namespaceURI)))
                        ((t = up(t)), (e = dp(t, e)));
                    else
                        switch (e) {
                            case `svg`:
                                e = 1;
                                break;
                            case `math`:
                                e = 2;
                                break;
                            default:
                                e = 0;
                        }
            }
            (je(Me), E(Me, e));
        }
        function Le() {
            (je(Me), je(Ne), je(Pe));
        }
        function Re(e) {
            var t = e.memoizedState;
            (t !== null && ((sh._currentValue = t.memoizedState), E(Fe, e)),
                (t = Me.current));
            var n = dp(t, e.type);
            t !== n && (E(Ne, e), E(Me, n));
        }
        function ze(e) {
            (Ne.current === e && (je(Me), je(Ne)),
                Fe.current === e && (je(Fe), (sh._currentValue = De)));
        }
        var Be, Ve;
        function He(e) {
            if (Be === void 0)
                try {
                    throw Error();
                } catch (e) {
                    var t = e.stack.trim().match(/\n( *(at )?)/);
                    ((Be = (t && t[1]) || ``),
                        (Ve =
                            -1 <
                            e.stack.indexOf(`
    at`)
                                ? ` (<anonymous>)`
                                : -1 < e.stack.indexOf(`@`)
                                  ? `@unknown:0:0`
                                  : ``));
                }
            return (
                `
` +
                Be +
                e +
                Ve
            );
        }
        var Ue = !1;
        function We(e, t) {
            if (!e || Ue) return ``;
            Ue = !0;
            var n = Error.prepareStackTrace;
            Error.prepareStackTrace = void 0;
            try {
                var r = {
                    DetermineComponentFrameRoot: function () {
                        try {
                            if (t) {
                                var n = function () {
                                    throw Error();
                                };
                                if (
                                    (Object.defineProperty(n.prototype, 'props', {
                                        set: function () {
                                            throw Error();
                                        },
                                    }),
                                    typeof Reflect == `object` && Reflect.construct)
                                ) {
                                    try {
                                        Reflect.construct(n, []);
                                    } catch (e) {
                                        var r = e;
                                    }
                                    Reflect.construct(e, [], n);
                                } else {
                                    try {
                                        n.call();
                                    } catch (e) {
                                        r = e;
                                    }
                                    n = !1;
                                    try {
                                        var i = Object.getOwnPropertyDescriptor(
                                            e.prototype,
                                            `props`,
                                        );
                                        (Object.defineProperty(e.prototype, 'props', {
                                            configurable: !0,
                                            set: function () {
                                                throw Error();
                                            },
                                        }),
                                            (n = !0),
                                            new e());
                                    } finally {
                                        n &&
                                            (i === void 0
                                                ? delete e.prototype.props
                                                : Object.defineProperty(
                                                      e.prototype,
                                                      'props',
                                                      i,
                                                  ));
                                    }
                                }
                            } else {
                                try {
                                    throw Error();
                                } catch (e) {
                                    r = e;
                                }
                                (n = e()) &&
                                    typeof n.catch == `function` &&
                                    n.catch(function () {});
                            }
                        } catch (e) {
                            if (e && r && typeof e.stack == `string`)
                                return [e.stack, r.stack];
                        }
                        return [null, null];
                    },
                };
                r.DetermineComponentFrameRoot.displayName = `DetermineComponentFrameRoot`;
                var i = Object.getOwnPropertyDescriptor(
                    r.DetermineComponentFrameRoot,
                    `name`,
                );
                i &&
                    i.configurable &&
                    Object.defineProperty(r.DetermineComponentFrameRoot, 'name', {
                        value: `DetermineComponentFrameRoot`,
                    });
                var a = r.DetermineComponentFrameRoot(),
                    o = a[0],
                    s = a[1];
                if (o && s) {
                    var c = o.split(`
`),
                        l = s.split(`
`);
                    for (
                        i = r = 0;
                        r < c.length && !c[r].includes(`DetermineComponentFrameRoot`);
                    )
                        r++;
                    for (
                        ;
                        i < l.length && !l[i].includes(`DetermineComponentFrameRoot`);
                    )
                        i++;
                    if (r === c.length || i === l.length)
                        for (
                            r = c.length - 1, i = l.length - 1;
                            1 <= r && 0 <= i && c[r] !== l[i];
                        )
                            i--;
                    for (; 1 <= r && 0 <= i; r--, i--)
                        if (c[r] !== l[i]) {
                            if (r !== 1 || i !== 1)
                                do
                                    if ((r--, i--, 0 > i || c[r] !== l[i])) {
                                        var u =
                                            `
` + c[r].replace(` at new `, ` at `);
                                        return (
                                            e.displayName &&
                                                u.includes(`<anonymous>`) &&
                                                (u = u.replace(
                                                    `<anonymous>`,
                                                    e.displayName,
                                                )),
                                            u
                                        );
                                    }
                                while (1 <= r && 0 <= i);
                            break;
                        }
                }
            } finally {
                ((Ue = !1), (Error.prepareStackTrace = n));
            }
            return (n = e ? e.displayName || e.name : ``) ? He(n) : ``;
        }
        function Ge(e, t) {
            switch (e.tag) {
                case 26:
                case 27:
                case 5:
                    return He(e.type);
                case 16:
                    return He(`Lazy`);
                case 13:
                    return e.child !== t && t !== null
                        ? He(`Suspense Fallback`)
                        : He(`Suspense`);
                case 19:
                    return He(`SuspenseList`);
                case 0:
                case 15:
                    return We(e.type, !1);
                case 11:
                    return We(e.type.render, !1);
                case 1:
                    return We(e.type, !0);
                case 31:
                    return He(`Activity`);
                case 30:
                    return He(`ViewTransition`);
                default:
                    return ``;
            }
        }
        function Ke(e) {
            try {
                var t = ``,
                    n = null;
                do ((t += Ge(e, n)), (n = e), (e = e.return));
                while (e);
                return t;
            } catch (e) {
                return (
                    `
Error generating stack: ` +
                    e.message +
                    `
` +
                    e.stack
                );
            }
        }
        var qe = Object.prototype.hasOwnProperty,
            Je = t.unstable_scheduleCallback,
            Ye = t.unstable_cancelCallback,
            Xe = t.unstable_shouldYield,
            Ze = t.unstable_requestPaint,
            Qe = t.unstable_now,
            $e = t.unstable_getCurrentPriorityLevel,
            et = t.unstable_ImmediatePriority,
            tt = t.unstable_UserBlockingPriority,
            nt = t.unstable_NormalPriority,
            rt = t.unstable_LowPriority,
            it = t.unstable_IdlePriority,
            at = t.log,
            ot = t.unstable_setDisableYieldValue,
            st = null,
            ct = null;
        function lt(e) {
            if (
                (typeof at == `function` && ot(e),
                ct && typeof ct.setStrictMode == `function`)
            )
                try {
                    ct.setStrictMode(st, e);
                } catch {}
        }
        var ut = Math.clz32 ? Math.clz32 : pt,
            dt = Math.log,
            ft = Math.LN2;
        function pt(e) {
            return ((e >>>= 0), e === 0 ? 32 : (31 - ((dt(e) / ft) | 0)) | 0);
        }
        var mt = 256,
            ht = 262144,
            gt = 4194304;
        function _t(e) {
            var t = e & 42;
            if (t !== 0) return t;
            switch (e & -e) {
                case 1:
                    return 1;
                case 2:
                    return 2;
                case 4:
                    return 4;
                case 8:
                    return 8;
                case 16:
                    return 16;
                case 32:
                    return 32;
                case 64:
                    return 64;
                case 128:
                    return 128;
                case 256:
                case 512:
                case 1024:
                case 2048:
                case 4096:
                case 8192:
                case 16384:
                case 32768:
                case 65536:
                case 131072:
                    return e & -e;
                case 262144:
                case 524288:
                case 1048576:
                case 2097152:
                    return e & 3932160;
                case 4194304:
                case 8388608:
                case 16777216:
                case 33554432:
                    return e & 62914560;
                case 67108864:
                    return 67108864;
                case 134217728:
                    return 134217728;
                case 268435456:
                    return 268435456;
                case 536870912:
                    return 536870912;
                case 1073741824:
                    return 0;
                default:
                    return e;
            }
        }
        function vt(e, t, n) {
            var r = e.pendingLanes;
            if (r === 0) return 0;
            var i = 0,
                a = e.suspendedLanes,
                o = e.pingedLanes;
            e = e.warmLanes;
            var s = r & 134217727;
            return (
                s === 0
                    ? ((s = r & ~a),
                      s === 0
                          ? o === 0
                              ? n || ((n = r & ~e), n !== 0 && (i = _t(n)))
                              : (i = _t(o))
                          : (i = _t(s)))
                    : ((r = s & ~a),
                      r === 0
                          ? ((o &= s),
                            o === 0
                                ? n || ((n = s & ~e), n !== 0 && (i = _t(n)))
                                : (i = _t(o)))
                          : (i = _t(r))),
                i === 0
                    ? 0
                    : t !== 0 &&
                        t !== i &&
                        (t & a) === 0 &&
                        ((a = i & -i),
                        (n = t & -t),
                        a >= n || (a === 32 && n & 4194048))
                      ? t
                      : i
            );
        }
        function yt(e, t) {
            return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
        }
        function bt(e, t) {
            t & 8 && (t |= t & 32);
            var n = e.entangledLanes;
            if (n !== 0)
                for (e = e.entanglements, n &= t; 0 < n;) {
                    var r = 31 - ut(n),
                        i = 1 << r;
                    ((t |= e[r]), (n &= ~i));
                }
            return t;
        }
        function xt(e, t) {
            switch (e) {
                case 1:
                case 2:
                case 4:
                case 8:
                case 64:
                    return t + 250;
                case 16:
                case 32:
                case 128:
                case 256:
                case 512:
                case 1024:
                case 2048:
                case 4096:
                case 8192:
                case 16384:
                case 32768:
                case 65536:
                case 131072:
                case 262144:
                case 524288:
                case 1048576:
                case 2097152:
                    return t + 5e3;
                case 4194304:
                case 8388608:
                case 16777216:
                case 33554432:
                    return -1;
                case 67108864:
                case 134217728:
                case 268435456:
                case 536870912:
                case 1073741824:
                    return -1;
                default:
                    return -1;
            }
        }
        function St() {
            var e = gt;
            return ((gt <<= 1), !(gt & 62914560) && (gt = 4194304), e);
        }
        function Ct(e) {
            for (var t = [], n = 0; 31 > n; n++) t.push(e);
            return t;
        }
        function wt(e, t) {
            ((e.pendingLanes |= t),
                t !== 268435456 &&
                    ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
        }
        function Tt(e, t, n, r, i, a) {
            var o = e.pendingLanes;
            ((e.pendingLanes = n),
                (e.suspendedLanes = 0),
                (e.pingedLanes = 0),
                (e.warmLanes = 0),
                (e.expiredLanes &= n),
                (e.entangledLanes &= n),
                (e.errorRecoveryDisabledLanes &= n),
                (e.shellSuspendCounter = 0));
            var s = e.entanglements,
                c = e.expirationTimes,
                l = e.hiddenUpdates;
            for (n = o & ~n; 0 < n;) {
                var u = 31 - ut(n),
                    d = 1 << u;
                ((s[u] = 0), (c[u] = -1));
                var f = l[u];
                if (f !== null)
                    for (l[u] = null, u = 0; u < f.length; u++) {
                        var p = f[u];
                        p !== null && (p.lane &= -536870913);
                    }
                n &= ~d;
            }
            (r !== 0 && Et(e, r, 0),
                a !== 0 &&
                    i === 0 &&
                    e.tag !== 0 &&
                    (e.suspendedLanes |= a & ~(o & ~t)));
        }
        function Et(e, t, n) {
            ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
            var r = 31 - ut(t);
            ((e.entangledLanes |= t),
                (e.entanglements[r] = e.entanglements[r] | 1073741824 | (n & 261930)));
        }
        function Dt(e, t) {
            var n = (e.entangledLanes |= t);
            for (e = e.entanglements; n;) {
                var r = 31 - ut(n),
                    i = 1 << r;
                ((i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i));
            }
        }
        function Ot(e, t) {
            var n = t & -t;
            return (
                (n = n & 42 ? 1 : kt(n)),
                (n & (e.suspendedLanes | t)) === 0 ? n : 0
            );
        }
        function kt(e) {
            switch (e) {
                case 2:
                    e = 1;
                    break;
                case 8:
                    e = 4;
                    break;
                case 32:
                    e = 16;
                    break;
                case 256:
                case 512:
                case 1024:
                case 2048:
                case 4096:
                case 8192:
                case 16384:
                case 32768:
                case 65536:
                case 131072:
                case 262144:
                case 524288:
                case 1048576:
                case 2097152:
                case 4194304:
                case 8388608:
                case 16777216:
                case 33554432:
                    e = 128;
                    break;
                case 268435456:
                    e = 134217728;
                    break;
                default:
                    e = 0;
            }
            return e;
        }
        function At(e) {
            return (
                (e &= -e),
                2 < e ? (8 < e ? (e & 134217727 ? 32 : 268435456) : 8) : 2
            );
        }
        function jt() {
            var e = T.p;
            return e === 0 ? ((e = window.event), e === void 0 ? 32 : Ch(e.type)) : e;
        }
        function Mt(e, t) {
            var n = T.p;
            try {
                return ((T.p = e), t());
            } finally {
                T.p = n;
            }
        }
        var Nt = Math.random().toString(36).slice(2),
            Pt = `__reactFiber$` + Nt,
            D = `__reactProps$` + Nt,
            Ft = `__reactContainer$` + Nt,
            It = `__reactEvents$` + Nt,
            Lt = `__reactListeners$` + Nt,
            Rt = `__reactHandles$` + Nt,
            zt = `__reactResources$` + Nt,
            Bt = `__reactMarker$` + Nt,
            Vt = `__reactLoad$` + Nt;
        function Ht(e) {
            (delete e[Pt], delete e[D], delete e[Lt], delete e[Rt]);
        }
        function Ut(e) {
            var t;
            if ((t = e[Pt])) return t;
            for (var n = e.parentNode; n;) {
                if ((t = n[Ft] || n[Pt])) {
                    if (
                        ((n = t.alternate),
                        t.child !== null || (n !== null && n.child !== null))
                    )
                        for (e = fm(e); e !== null;) {
                            if ((n = e[Pt])) return n;
                            e = fm(e);
                        }
                    return t;
                }
                ((e = n), (n = e.parentNode));
            }
            return null;
        }
        function Wt(e) {
            if ((e = e[Pt] || e[Ft])) {
                var t = e.tag;
                if (
                    t === 5 ||
                    t === 6 ||
                    t === 13 ||
                    t === 31 ||
                    t === 26 ||
                    t === 27 ||
                    t === 3
                )
                    return e;
            }
            return null;
        }
        function Gt(e) {
            var t = e.tag;
            if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
            throw Error(i(33));
        }
        function Kt(e) {
            var t = e[zt];
            return (
                (t ||= e[zt] =
                    { hoistableStyles: new Map(), hoistableScripts: new Map() }),
                t
            );
        }
        function qt(e) {
            e[Bt] = !0;
        }
        function Jt(e) {
            e[Vt] = void 0;
        }
        var Yt = new Set(),
            Xt = {};
        function Zt(e, t) {
            (Qt(e, t), Qt(e + `Capture`, t));
        }
        function Qt(e, t) {
            for (Xt[e] = t, e = 0; e < t.length; e++) Yt.add(t[e]);
        }
        var $t = RegExp(
                `^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`,
            ),
            en = {},
            tn = {};
        function nn(e) {
            return qe.call(tn, e)
                ? !0
                : qe.call(en, e)
                  ? !1
                  : $t.test(e)
                    ? (tn[e] = !0)
                    : ((en[e] = !0), !1);
        }
        var O = !1;
        function rn() {
            var e = O;
            return ((O = !1), e);
        }
        function an(e, t, n) {
            if (nn(t)) {
                if (n === null) e.removeAttribute(t);
                else {
                    switch (typeof n) {
                        case `undefined`:
                        case `function`:
                        case `symbol`:
                            e.removeAttribute(t);
                            return;
                        case `boolean`:
                            var r = t.toLowerCase().slice(0, 5);
                            if (r !== `data-` && r !== `aria-`) {
                                e.removeAttribute(t);
                                return;
                            }
                    }
                    e.setAttribute(t, n);
                }
            }
        }
        function on(e, t, n) {
            if (n === null) e.removeAttribute(t);
            else {
                switch (typeof n) {
                    case `undefined`:
                    case `function`:
                    case `symbol`:
                    case `boolean`:
                        e.removeAttribute(t);
                        return;
                }
                e.setAttribute(t, n);
            }
        }
        function sn(e, t, n, r) {
            if (r === null) e.removeAttribute(n);
            else {
                switch (typeof r) {
                    case `undefined`:
                    case `function`:
                    case `symbol`:
                    case `boolean`:
                        e.removeAttribute(n);
                        return;
                }
                e.setAttributeNS(t, n, r);
            }
        }
        function cn(e) {
            switch (typeof e) {
                case `bigint`:
                case `boolean`:
                case `number`:
                case `string`:
                case `undefined`:
                    return e;
                case `object`:
                    return e;
                default:
                    return ``;
            }
        }
        function ln(e) {
            var t = e.type;
            return (
                (e = e.nodeName) &&
                e.toLowerCase() === `input` &&
                (t === `checkbox` || t === `radio`)
            );
        }
        function un(e, t, n) {
            var r = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
            if (
                !e.hasOwnProperty(t) &&
                r !== void 0 &&
                typeof r.get == `function` &&
                typeof r.set == `function`
            ) {
                var i = r.get,
                    a = r.set;
                return (
                    Object.defineProperty(e, t, {
                        configurable: !0,
                        get: function () {
                            return i.call(this);
                        },
                        set: function (e) {
                            ((n = `` + e), a.call(this, e));
                        },
                    }),
                    Object.defineProperty(e, t, { enumerable: r.enumerable }),
                    {
                        getValue: function () {
                            return n;
                        },
                        setValue: function (e) {
                            n = `` + e;
                        },
                        stopTracking: function () {
                            ((e._valueTracker = null), delete e[t]);
                        },
                    }
                );
            }
        }
        function dn(e) {
            if (!e._valueTracker) {
                var t = ln(e) ? `checked` : `value`;
                e._valueTracker = un(e, t, `` + e[t]);
            }
        }
        function fn(e) {
            if (!e) return !1;
            var t = e._valueTracker;
            if (!t) return !0;
            var n = t.getValue(),
                r = ``;
            return (
                e && (r = ln(e) ? (e.checked ? `true` : `false`) : e.value),
                (e = r),
                e !== n && (t.setValue(e), !0)
            );
        }
        var pn = /[\n"\\]/g;
        function mn(e) {
            return e.replace(pn, function (e) {
                return `\\` + e.charCodeAt(0).toString(16) + ` `;
            });
        }
        function hn(e, t, n, r, i, a, o, s) {
            ((e.name = ``),
                o != null &&
                typeof o != `function` &&
                typeof o != `symbol` &&
                typeof o != `boolean`
                    ? (e.type = o)
                    : e.removeAttribute(`type`),
                t == null
                    ? (o !== `submit` && o !== `reset`) || e.removeAttribute(`value`)
                    : o === `number`
                      ? ((t === 0 && e.value === ``) || e.value != t) &&
                        (e.value = `` + cn(t))
                      : e.value !== `` + cn(t) && (e.value = `` + cn(t)),
                t == null
                    ? n == null
                        ? r != null && e.removeAttribute(`value`)
                        : _n(e, cn(n))
                    : o === `number` && e.value == t
                      ? _n(e, cn(e.value))
                      : _n(e, cn(t)),
                i == null && a != null && (e.defaultChecked = !!a),
                i != null &&
                    (e.checked = i && typeof i != `function` && typeof i != `symbol`),
                s != null &&
                typeof s != `function` &&
                typeof s != `symbol` &&
                typeof s != `boolean`
                    ? (e.name = `` + cn(s))
                    : e.removeAttribute(`name`));
        }
        function gn(e, t, n, r, i, a, o, s) {
            if (
                (a != null &&
                    typeof a != `function` &&
                    typeof a != `symbol` &&
                    typeof a != `boolean` &&
                    (e.type = a),
                t != null || n != null)
            ) {
                if (!((a !== `submit` && a !== `reset`) || t != null)) {
                    dn(e);
                    return;
                }
                ((n = n == null ? `` : `` + cn(n)),
                    (t = t == null ? n : `` + cn(t)),
                    s || t === e.value || (e.value = t),
                    (e.defaultValue = t));
            }
            ((r ??= i),
                (r = typeof r != `function` && typeof r != `symbol` && !!r),
                (e.checked = s ? e.checked : !!r),
                (e.defaultChecked = !!r),
                o != null &&
                    typeof o != `function` &&
                    typeof o != `symbol` &&
                    typeof o != `boolean` &&
                    (e.name = o),
                dn(e));
        }
        function _n(e, t) {
            e.defaultValue !== `` + t && (e.defaultValue = `` + t);
        }
        function vn(e, t, n, r) {
            if (((e = e.options), t)) {
                t = {};
                for (var i = 0; i < n.length; i++) t[`$` + n[i]] = !0;
                for (n = 0; n < e.length; n++)
                    ((i = t.hasOwnProperty(`$` + e[n].value)),
                        e[n].selected !== i && (e[n].selected = i),
                        i && r && (e[n].defaultSelected = !0));
            } else {
                for (n = `` + cn(n), t = null, i = 0; i < e.length; i++) {
                    if (e[i].value === n) {
                        ((e[i].selected = !0), r && (e[i].defaultSelected = !0));
                        return;
                    }
                    t !== null || e[i].disabled || (t = e[i]);
                }
                t !== null && (t.selected = !0);
            }
        }
        function yn(e, t, n) {
            if (
                t != null &&
                ((t = `` + cn(t)), t !== e.value && (e.value = t), n == null)
            ) {
                e.defaultValue !== t && (e.defaultValue = t);
                return;
            }
            e.defaultValue = n == null ? `` : `` + cn(n);
        }
        function bn(e, t, n, r) {
            if (t == null) {
                if (r != null) {
                    if (n != null) throw Error(i(92));
                    if (Ee(r)) {
                        if (1 < r.length) throw Error(i(93));
                        r = r[0];
                    }
                    n = r;
                }
                ((n ??= ``), (t = n));
            }
            ((n = cn(t)),
                (e.defaultValue = n),
                (r = e.textContent),
                r === n && r !== `` && r !== null && (e.value = r),
                dn(e));
        }
        function xn(e, t) {
            if (t) {
                var n = e.firstChild;
                if (n && n === e.lastChild && n.nodeType === 3) {
                    n.nodeValue = t;
                    return;
                }
            }
            e.textContent = t;
        }
        var Sn = new Set(
            `animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(
                ` `,
            ),
        );
        function Cn(e, t, n) {
            var r = t.indexOf(`--`) === 0;
            n == null || typeof n == `boolean` || n === ``
                ? r
                    ? e.setProperty(t, ``)
                    : t === `float`
                      ? (e.cssFloat = ``)
                      : (e[t] = ``)
                : r
                  ? e.setProperty(t, n)
                  : typeof n != `number` || n === 0 || Sn.has(t)
                    ? t === `float`
                        ? (e.cssFloat = n)
                        : (e[t] = (`` + n).trim())
                    : (e[t] = n + `px`);
        }
        function wn(e, t, n) {
            if (t != null && typeof t != `object`) throw Error(i(62));
            if (((e = e.style), n != null)) {
                for (var r in n)
                    !n.hasOwnProperty(r) ||
                        (t != null && t.hasOwnProperty(r)) ||
                        (r.indexOf(`--`) === 0
                            ? e.setProperty(r, ``)
                            : r === `float`
                              ? (e.cssFloat = ``)
                              : (e[r] = ``),
                        (O = !0));
                for (var a in t)
                    ((r = t[a]),
                        t.hasOwnProperty(a) && n[a] !== r && (Cn(e, a, r), (O = !0)));
            } else for (var o in t) t.hasOwnProperty(o) && Cn(e, o, t[o]);
        }
        function Tn(e) {
            if (e.indexOf(`-`) === -1) return !1;
            switch (e) {
                case `annotation-xml`:
                case `color-profile`:
                case `font-face`:
                case `font-face-src`:
                case `font-face-uri`:
                case `font-face-format`:
                case `font-face-name`:
                case `missing-glyph`:
                    return !1;
                default:
                    return !0;
            }
        }
        var En = new Map([
                [`acceptCharset`, `accept-charset`],
                [`htmlFor`, `for`],
                [`httpEquiv`, `http-equiv`],
                [`crossOrigin`, `crossorigin`],
                [`accentHeight`, `accent-height`],
                [`alignmentBaseline`, `alignment-baseline`],
                [`arabicForm`, `arabic-form`],
                [`baselineShift`, `baseline-shift`],
                [`capHeight`, `cap-height`],
                [`clipPath`, `clip-path`],
                [`clipRule`, `clip-rule`],
                [`colorInterpolation`, `color-interpolation`],
                [`colorInterpolationFilters`, `color-interpolation-filters`],
                [`colorProfile`, `color-profile`],
                [`colorRendering`, `color-rendering`],
                [`dominantBaseline`, `dominant-baseline`],
                [`enableBackground`, `enable-background`],
                [`fillOpacity`, `fill-opacity`],
                [`fillRule`, `fill-rule`],
                [`floodColor`, `flood-color`],
                [`floodOpacity`, `flood-opacity`],
                [`fontFamily`, `font-family`],
                [`fontSize`, `font-size`],
                [`fontSizeAdjust`, `font-size-adjust`],
                [`fontStretch`, `font-stretch`],
                [`fontStyle`, `font-style`],
                [`fontVariant`, `font-variant`],
                [`fontWeight`, `font-weight`],
                [`glyphName`, `glyph-name`],
                [`glyphOrientationHorizontal`, `glyph-orientation-horizontal`],
                [`glyphOrientationVertical`, `glyph-orientation-vertical`],
                [`horizAdvX`, `horiz-adv-x`],
                [`horizOriginX`, `horiz-origin-x`],
                [`imageRendering`, `image-rendering`],
                [`letterSpacing`, `letter-spacing`],
                [`lightingColor`, `lighting-color`],
                [`markerEnd`, `marker-end`],
                [`markerMid`, `marker-mid`],
                [`markerStart`, `marker-start`],
                [`maskType`, `mask-type`],
                [`overlinePosition`, `overline-position`],
                [`overlineThickness`, `overline-thickness`],
                [`paintOrder`, `paint-order`],
                [`panose-1`, `panose-1`],
                [`pointerEvents`, `pointer-events`],
                [`renderingIntent`, `rendering-intent`],
                [`shapeRendering`, `shape-rendering`],
                [`stopColor`, `stop-color`],
                [`stopOpacity`, `stop-opacity`],
                [`strikethroughPosition`, `strikethrough-position`],
                [`strikethroughThickness`, `strikethrough-thickness`],
                [`strokeDasharray`, `stroke-dasharray`],
                [`strokeDashoffset`, `stroke-dashoffset`],
                [`strokeLinecap`, `stroke-linecap`],
                [`strokeLinejoin`, `stroke-linejoin`],
                [`strokeMiterlimit`, `stroke-miterlimit`],
                [`strokeOpacity`, `stroke-opacity`],
                [`strokeWidth`, `stroke-width`],
                [`textAnchor`, `text-anchor`],
                [`textDecoration`, `text-decoration`],
                [`textRendering`, `text-rendering`],
                [`transformOrigin`, `transform-origin`],
                [`underlinePosition`, `underline-position`],
                [`underlineThickness`, `underline-thickness`],
                [`unicodeBidi`, `unicode-bidi`],
                [`unicodeRange`, `unicode-range`],
                [`unitsPerEm`, `units-per-em`],
                [`vAlphabetic`, `v-alphabetic`],
                [`vHanging`, `v-hanging`],
                [`vIdeographic`, `v-ideographic`],
                [`vMathematical`, `v-mathematical`],
                [`vectorEffect`, `vector-effect`],
                [`vertAdvY`, `vert-adv-y`],
                [`vertOriginX`, `vert-origin-x`],
                [`vertOriginY`, `vert-origin-y`],
                [`wordSpacing`, `word-spacing`],
                [`writingMode`, `writing-mode`],
                [`xmlnsXlink`, `xmlns:xlink`],
                [`xHeight`, `x-height`],
            ]),
            Dn =
                /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
        function On(e) {
            return Dn.test(`` + e)
                ? `javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`
                : e;
        }
        function kn() {}
        var An = null;
        function jn(e) {
            return (
                (e = e.target || e.srcElement || window),
                e.correspondingUseElement && (e = e.correspondingUseElement),
                e.nodeType === 3 ? e.parentNode : e
            );
        }
        var Mn = null,
            Nn = null;
        function Pn(e) {
            var t = Wt(e);
            if (t && (e = t.stateNode)) {
                var n = e[D] || null;
                a: switch (((e = t.stateNode), t.type)) {
                    case `input`:
                        if (
                            (hn(
                                e,
                                n.value,
                                n.defaultValue,
                                n.defaultValue,
                                n.checked,
                                n.defaultChecked,
                                n.type,
                                n.name,
                            ),
                            (t = n.name),
                            n.type === `radio` && t != null)
                        ) {
                            for (n = e; n.parentNode;) n = n.parentNode;
                            for (
                                n = n.querySelectorAll(
                                    `input[name="` + mn(`` + t) + `"][type="radio"]`,
                                ),
                                    t = 0;
                                t < n.length;
                                t++
                            ) {
                                var r = n[t];
                                if (r !== e && r.form === e.form) {
                                    var a = r[D] || null;
                                    if (!a) throw Error(i(90));
                                    hn(
                                        r,
                                        a.value,
                                        a.defaultValue,
                                        a.defaultValue,
                                        a.checked,
                                        a.defaultChecked,
                                        a.type,
                                        a.name,
                                    );
                                }
                            }
                            for (t = 0; t < n.length; t++)
                                ((r = n[t]), r.form === e.form && fn(r));
                        }
                        break a;
                    case `textarea`:
                        yn(e, n.value, n.defaultValue);
                        break a;
                    case `select`:
                        ((t = n.value), t != null && vn(e, !!n.multiple, t, !1));
                }
            }
        }
        var Fn = !1;
        function In(e, t, n) {
            if (Fn) return e(t, n);
            Fn = !0;
            try {
                return e(t);
            } finally {
                if (
                    ((Fn = !1),
                    (Mn !== null || Nn !== null) &&
                        (zd(), Mn && ((t = Mn), (e = Nn), (Nn = Mn = null), Pn(t), e)))
                )
                    for (t = 0; t < e.length; t++) Pn(e[t]);
            }
        }
        function Ln(e, t) {
            var n = e.stateNode;
            if (n === null) return null;
            var r = n[D] || null;
            if (r === null) return null;
            n = r[t];
            a: switch (t) {
                case `onClick`:
                case `onClickCapture`:
                case `onDoubleClick`:
                case `onDoubleClickCapture`:
                case `onMouseDown`:
                case `onMouseDownCapture`:
                case `onMouseMove`:
                case `onMouseMoveCapture`:
                case `onMouseUp`:
                case `onMouseUpCapture`:
                case `onMouseEnter`:
                    ((r = !r.disabled) ||
                        ((e = e.type),
                        (r =
                            e !== `button` &&
                            e !== `input` &&
                            e !== `select` &&
                            e !== `textarea`)),
                        (e = !r));
                    break a;
                default:
                    e = !1;
            }
            if (e) return null;
            if (n && typeof n != `function`) throw Error(i(231, t, typeof n));
            return n;
        }
        var Rn =
                typeof window < `u` &&
                window.document !== void 0 &&
                window.document.createElement !== void 0,
            zn = !1;
        if (Rn)
            try {
                var Bn = {};
                (Object.defineProperty(Bn, 'passive', {
                    get: function () {
                        zn = !0;
                    },
                }),
                    window.addEventListener(`test`, Bn, Bn),
                    window.removeEventListener(`test`, Bn, Bn));
            } catch {
                zn = !1;
            }
        var Vn = null,
            Hn = null,
            Un = null;
        function Wn() {
            if (Un) return Un;
            var e,
                t = Hn,
                n = t.length,
                r,
                i = `value` in Vn ? Vn.value : Vn.textContent,
                a = i.length;
            for (e = 0; e < n && t[e] === i[e]; e++);
            var o = n - e;
            for (r = 1; r <= o && t[n - r] === i[a - r]; r++);
            return (Un = i.slice(e, 1 < r ? 1 - r : void 0));
        }
        function Gn(e) {
            var t = e.keyCode;
            return (
                `charCode` in e
                    ? ((e = e.charCode), e === 0 && t === 13 && (e = 13))
                    : (e = t),
                e === 10 && (e = 13),
                32 <= e || e === 13 ? e : 0
            );
        }
        function Kn() {
            return !0;
        }
        function qn() {
            return !1;
        }
        function Jn(e) {
            function t(t, n, r, i, a) {
                for (var o in ((this._reactName = t),
                (this._targetInst = r),
                (this.type = n),
                (this.nativeEvent = i),
                (this.target = a),
                (this.currentTarget = null),
                e))
                    e.hasOwnProperty(o) && ((t = e[o]), (this[o] = t ? t(i) : i[o]));
                return (
                    (this.isDefaultPrevented = (
                        i.defaultPrevented == null
                            ? !1 === i.returnValue
                            : i.defaultPrevented
                    )
                        ? Kn
                        : qn),
                    (this.isPropagationStopped = qn),
                    this
                );
            }
            return (
                S(t.prototype, {
                    preventDefault: function () {
                        this.defaultPrevented = !0;
                        var e = this.nativeEvent;
                        e &&
                            (e.preventDefault
                                ? e.preventDefault()
                                : typeof e.returnValue != `unknown` &&
                                  (e.returnValue = !1),
                            (this.isDefaultPrevented = Kn));
                    },
                    stopPropagation: function () {
                        var e = this.nativeEvent;
                        e &&
                            (e.stopPropagation
                                ? e.stopPropagation()
                                : typeof e.cancelBubble != `unknown` &&
                                  (e.cancelBubble = !0),
                            (this.isPropagationStopped = Kn));
                    },
                    persist: function () {},
                    isPersistent: Kn,
                }),
                t
            );
        }
        var Yn = {
                eventPhase: 0,
                bubbles: 0,
                cancelable: 0,
                timeStamp: function (e) {
                    return e.timeStamp || Date.now();
                },
                defaultPrevented: 0,
                isTrusted: 0,
            },
            Xn = Jn(Yn),
            Zn = S({}, Yn, { view: 0, detail: 0 }),
            Qn = Jn(Zn),
            $n,
            er,
            tr,
            nr = S({}, Zn, {
                screenX: 0,
                screenY: 0,
                clientX: 0,
                clientY: 0,
                pageX: 0,
                pageY: 0,
                ctrlKey: 0,
                shiftKey: 0,
                altKey: 0,
                metaKey: 0,
                getModifierState: pr,
                button: 0,
                buttons: 0,
                relatedTarget: function (e) {
                    return e.relatedTarget === void 0
                        ? e.fromElement === e.srcElement
                            ? e.toElement
                            : e.fromElement
                        : e.relatedTarget;
                },
                movementX: function (e) {
                    return `movementX` in e
                        ? e.movementX
                        : (e !== tr &&
                              (tr && e.type === `mousemove`
                                  ? (($n = e.screenX - tr.screenX),
                                    (er = e.screenY - tr.screenY))
                                  : (er = $n = 0),
                              (tr = e)),
                          $n);
                },
                movementY: function (e) {
                    return `movementY` in e ? e.movementY : er;
                },
            }),
            rr = Jn(nr),
            ir = Jn(S({}, nr, { dataTransfer: 0 })),
            ar = Jn(S({}, Zn, { relatedTarget: 0 })),
            or = Jn(S({}, Yn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 })),
            sr = Jn(
                S({}, Yn, {
                    clipboardData: function (e) {
                        return `clipboardData` in e
                            ? e.clipboardData
                            : window.clipboardData;
                    },
                }),
            ),
            cr = Jn(S({}, Yn, { data: 0 })),
            lr = {
                Esc: `Escape`,
                Spacebar: ` `,
                Left: `ArrowLeft`,
                Up: `ArrowUp`,
                Right: `ArrowRight`,
                Down: `ArrowDown`,
                Del: `Delete`,
                Win: `OS`,
                Menu: `ContextMenu`,
                Apps: `ContextMenu`,
                Scroll: `ScrollLock`,
                MozPrintableKey: `Unidentified`,
            },
            ur = {
                8: `Backspace`,
                9: `Tab`,
                12: `Clear`,
                13: `Enter`,
                16: `Shift`,
                17: `Control`,
                18: `Alt`,
                19: `Pause`,
                20: `CapsLock`,
                27: `Escape`,
                32: ` `,
                33: `PageUp`,
                34: `PageDown`,
                35: `End`,
                36: `Home`,
                37: `ArrowLeft`,
                38: `ArrowUp`,
                39: `ArrowRight`,
                40: `ArrowDown`,
                45: `Insert`,
                46: `Delete`,
                112: `F1`,
                113: `F2`,
                114: `F3`,
                115: `F4`,
                116: `F5`,
                117: `F6`,
                118: `F7`,
                119: `F8`,
                120: `F9`,
                121: `F10`,
                122: `F11`,
                123: `F12`,
                144: `NumLock`,
                145: `ScrollLock`,
                224: `Meta`,
            },
            dr = {
                Alt: `altKey`,
                Control: `ctrlKey`,
                Meta: `metaKey`,
                Shift: `shiftKey`,
            };
        function fr(e) {
            var t = this.nativeEvent;
            return t.getModifierState
                ? t.getModifierState(e)
                : (e = dr[e])
                  ? !!t[e]
                  : !1;
        }
        function pr() {
            return fr;
        }
        var mr = Jn(
                S({}, Zn, {
                    key: function (e) {
                        if (e.key) {
                            var t = lr[e.key] || e.key;
                            if (t !== `Unidentified`) return t;
                        }
                        return e.type === `keypress`
                            ? ((e = Gn(e)), e === 13 ? `Enter` : String.fromCharCode(e))
                            : e.type === `keydown` || e.type === `keyup`
                              ? ur[e.keyCode] || `Unidentified`
                              : ``;
                    },
                    code: 0,
                    location: 0,
                    ctrlKey: 0,
                    shiftKey: 0,
                    altKey: 0,
                    metaKey: 0,
                    repeat: 0,
                    locale: 0,
                    getModifierState: pr,
                    charCode: function (e) {
                        return e.type === `keypress` ? Gn(e) : 0;
                    },
                    keyCode: function (e) {
                        return e.type === `keydown` || e.type === `keyup`
                            ? e.keyCode
                            : 0;
                    },
                    which: function (e) {
                        return e.type === `keypress`
                            ? Gn(e)
                            : e.type === `keydown` || e.type === `keyup`
                              ? e.keyCode
                              : 0;
                    },
                }),
            ),
            hr = Jn(
                S({}, nr, {
                    pointerId: 0,
                    width: 0,
                    height: 0,
                    pressure: 0,
                    tangentialPressure: 0,
                    tiltX: 0,
                    tiltY: 0,
                    twist: 0,
                    pointerType: 0,
                    isPrimary: 0,
                }),
            ),
            gr = Jn(S({}, Yn, { submitter: 0 })),
            _r = Jn(
                S({}, Zn, {
                    touches: 0,
                    targetTouches: 0,
                    changedTouches: 0,
                    altKey: 0,
                    metaKey: 0,
                    ctrlKey: 0,
                    shiftKey: 0,
                    getModifierState: pr,
                }),
            ),
            vr = Jn(S({}, Yn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 })),
            yr = Jn(
                S({}, nr, {
                    deltaX: function (e) {
                        return `deltaX` in e
                            ? e.deltaX
                            : `wheelDeltaX` in e
                              ? -e.wheelDeltaX
                              : 0;
                    },
                    deltaY: function (e) {
                        return `deltaY` in e
                            ? e.deltaY
                            : `wheelDeltaY` in e
                              ? -e.wheelDeltaY
                              : `wheelDelta` in e
                                ? -e.wheelDelta
                                : 0;
                    },
                    deltaZ: 0,
                    deltaMode: 0,
                }),
            ),
            br = Jn(S({}, Yn, { newState: 0, oldState: 0, source: 0 })),
            xr = [9, 13, 27, 32],
            Sr = Rn && `CompositionEvent` in window,
            Cr = null;
        Rn && `documentMode` in document && (Cr = document.documentMode);
        var wr = Rn && `TextEvent` in window && !Cr,
            Tr = Rn && (!Sr || (Cr && 8 < Cr && 11 >= Cr)),
            Er = ` `,
            Dr = !1;
        function Or(e, t) {
            switch (e) {
                case `keyup`:
                    return xr.indexOf(t.keyCode) !== -1;
                case `keydown`:
                    return t.keyCode !== 229;
                case `keypress`:
                case `mousedown`:
                case `focusout`:
                    return !0;
                default:
                    return !1;
            }
        }
        function kr(e) {
            return (
                (e = e.detail),
                typeof e == `object` && `data` in e ? e.data : null
            );
        }
        var Ar = !1;
        function jr(e, t) {
            switch (e) {
                case `compositionend`:
                    return kr(t);
                case `keypress`:
                    return t.which === 32 ? ((Dr = !0), Er) : null;
                case `textInput`:
                    return ((e = t.data), e === Er && Dr ? null : e);
                default:
                    return null;
            }
        }
        function Mr(e, t) {
            if (Ar)
                return e === `compositionend` || (!Sr && Or(e, t))
                    ? ((e = Wn()), (Un = Hn = Vn = null), (Ar = !1), e)
                    : null;
            switch (e) {
                case `paste`:
                    return null;
                case `keypress`:
                    if (
                        !(t.ctrlKey || t.altKey || t.metaKey) ||
                        (t.ctrlKey && t.altKey)
                    ) {
                        if (t.char && 1 < t.char.length) return t.char;
                        if (t.which) return String.fromCharCode(t.which);
                    }
                    return null;
                case `compositionend`:
                    return Tr && t.locale !== `ko` ? null : t.data;
                default:
                    return null;
            }
        }
        var Nr = {
            color: !0,
            date: !0,
            datetime: !0,
            'datetime-local': !0,
            email: !0,
            month: !0,
            number: !0,
            password: !0,
            range: !0,
            search: !0,
            tel: !0,
            text: !0,
            time: !0,
            url: !0,
            week: !0,
        };
        function Pr(e) {
            var t = e && e.nodeName && e.nodeName.toLowerCase();
            return t === `input` ? !!Nr[e.type] : t === `textarea`;
        }
        function Fr(e, t, n, r) {
            (Mn ? (Nn ? Nn.push(r) : (Nn = [r])) : (Mn = r),
                (t = Jf(t, `onChange`)),
                0 < t.length &&
                    ((n = new Xn(`onChange`, `change`, null, n, r)),
                    e.push({ event: n, listeners: t })));
        }
        var Ir = null,
            Lr = null;
        function Rr(e) {
            Vf(e, 0);
        }
        function zr(e) {
            if (fn(Gt(e))) return e;
        }
        function Br(e, t) {
            if (e === `change`) return t;
        }
        var Vr = !1;
        if (Rn) {
            var Hr;
            if (Rn) {
                var Ur = `oninput` in document;
                if (!Ur) {
                    var Wr = document.createElement(`div`);
                    (Wr.setAttribute(`oninput`, `return;`),
                        (Ur = typeof Wr.oninput == `function`));
                }
                Hr = Ur;
            } else Hr = !1;
            Vr = Hr && (!document.documentMode || 9 < document.documentMode);
        }
        function Gr() {
            Ir && (Ir.detachEvent(`onpropertychange`, Kr), (Lr = Ir = null));
        }
        function Kr(e) {
            if (e.propertyName === `value` && zr(Lr)) {
                var t = [];
                (Fr(t, Lr, e, jn(e)), In(Rr, t));
            }
        }
        function qr(e, t, n) {
            e === `focusin`
                ? (Gr(), (Ir = t), (Lr = n), Ir.attachEvent(`onpropertychange`, Kr))
                : e === `focusout` && Gr();
        }
        function Jr(e) {
            if (e === `selectionchange` || e === `keyup` || e === `keydown`)
                return zr(Lr);
        }
        function Yr(e, t) {
            if (e === `click`) return zr(t);
        }
        function Xr(e, t) {
            if (e === `input` || e === `change`) return zr(t);
        }
        function Zr(e, t) {
            return (e === t && (e !== 0 || 1 / e == 1 / t)) || (e !== e && t !== t);
        }
        var Qr = typeof Object.is == `function` ? Object.is : Zr;
        function $r(e, t) {
            if (Qr(e, t)) return !0;
            if (typeof e != `object` || !e || typeof t != `object` || !t) return !1;
            var n = Object.keys(e),
                r = Object.keys(t);
            if (n.length !== r.length) return !1;
            for (r = 0; r < n.length; r++) {
                var i = n[r];
                if (!qe.call(t, i) || !Qr(e[i], t[i])) return !1;
            }
            return !0;
        }
        function ei(e) {
            if (((e ||= typeof document < `u` ? document : void 0), e === void 0))
                return null;
            try {
                return e.activeElement || e.body;
            } catch {
                return e.body;
            }
        }
        function ti(e) {
            for (; e && e.firstChild;) e = e.firstChild;
            return e;
        }
        function ni(e, t) {
            var n = ti(e);
            e = 0;
            for (var r; n;) {
                if (n.nodeType === 3) {
                    if (((r = e + n.textContent.length), e <= t && r >= t))
                        return { node: n, offset: t - e };
                    e = r;
                }
                a: {
                    for (; n;) {
                        if (n.nextSibling) {
                            n = n.nextSibling;
                            break a;
                        }
                        n = n.parentNode;
                    }
                    n = void 0;
                }
                n = ti(n);
            }
        }
        function ri(e, t) {
            return e && t
                ? e === t
                    ? !0
                    : e && e.nodeType === 3
                      ? !1
                      : t && t.nodeType === 3
                        ? ri(e, t.parentNode)
                        : `contains` in e
                          ? e.contains(t)
                          : e.compareDocumentPosition
                            ? !!(e.compareDocumentPosition(t) & 16)
                            : !1
                : !1;
        }
        function ii(e) {
            e =
                e != null &&
                e.ownerDocument != null &&
                e.ownerDocument.defaultView != null
                    ? e.ownerDocument.defaultView
                    : window;
            for (var t = ei(e.document); t instanceof e.HTMLIFrameElement;) {
                try {
                    var n = typeof t.contentWindow.location.href == `string`;
                } catch {
                    n = !1;
                }
                if (n) e = t.contentWindow;
                else break;
                t = ei(e.document);
            }
            return t;
        }
        function ai(e) {
            var t = e && e.nodeName && e.nodeName.toLowerCase();
            return (
                t &&
                ((t === `input` &&
                    (e.type === `text` ||
                        e.type === `search` ||
                        e.type === `tel` ||
                        e.type === `url` ||
                        e.type === `password`)) ||
                    t === `textarea` ||
                    e.contentEditable === `true`)
            );
        }
        var oi = Rn && `documentMode` in document && 11 >= document.documentMode,
            si = null,
            ci = null,
            li = null,
            ui = !1;
        function di(e, t, n) {
            var r =
                n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
            ui ||
                si == null ||
                si !== ei(r) ||
                ((r = si),
                `selectionStart` in r && ai(r)
                    ? (r = { start: r.selectionStart, end: r.selectionEnd })
                    : ((r = (
                          (r.ownerDocument && r.ownerDocument.defaultView) ||
                          window
                      ).getSelection()),
                      (r = {
                          anchorNode: r.anchorNode,
                          anchorOffset: r.anchorOffset,
                          focusNode: r.focusNode,
                          focusOffset: r.focusOffset,
                      })),
                (li && $r(li, r)) ||
                    ((li = r),
                    (r = Jf(ci, `onSelect`)),
                    0 < r.length &&
                        ((t = new Xn(`onSelect`, `select`, null, t, n)),
                        e.push({ event: t, listeners: r }),
                        (t.target = si))));
        }
        function fi(e, t) {
            var n = {};
            return (
                (n[e.toLowerCase()] = t.toLowerCase()),
                (n[`Webkit` + e] = `webkit` + t),
                (n[`Moz` + e] = `moz` + t),
                n
            );
        }
        var pi = {
                animationend: fi(`Animation`, `AnimationEnd`),
                animationiteration: fi(`Animation`, `AnimationIteration`),
                animationstart: fi(`Animation`, `AnimationStart`),
                transitionrun: fi(`Transition`, `TransitionRun`),
                transitionstart: fi(`Transition`, `TransitionStart`),
                transitioncancel: fi(`Transition`, `TransitionCancel`),
                transitionend: fi(`Transition`, `TransitionEnd`),
            },
            mi = {},
            hi = {};
        Rn &&
            ((hi = document.createElement(`div`).style),
            `AnimationEvent` in window ||
                (delete pi.animationend.animation,
                delete pi.animationiteration.animation,
                delete pi.animationstart.animation),
            `TransitionEvent` in window || delete pi.transitionend.transition);
        function gi(e) {
            if (mi[e]) return mi[e];
            if (!pi[e]) return e;
            var t = pi[e],
                n;
            for (n in t) if (t.hasOwnProperty(n) && n in hi) return (mi[e] = t[n]);
            return e;
        }
        var _i = gi(`animationend`),
            vi = gi(`animationiteration`),
            yi = gi(`animationstart`),
            bi = gi(`transitionrun`),
            k = gi(`transitionstart`),
            xi = gi(`transitioncancel`),
            Si = gi(`transitionend`),
            Ci = new Map(),
            wi =
                `abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(
                    ` `,
                );
        wi.push(`scrollEnd`);
        function A(e, t) {
            (Ci.set(e, t), Zt(t, [e]));
        }
        var Ti = 0;
        function Ei(e, t) {
            if (e.name != null && e.name !== `auto`) return e.name;
            if (t.autoName !== null) return t.autoName;
            e = bd.identifierPrefix;
            var n = Ti++;
            return ((e = `_` + e + `t_` + n.toString(32) + `_`), (t.autoName = e));
        }
        function Di(e) {
            if (e == null || typeof e == `string`) return e;
            var t = null,
                n = Od;
            if (n !== null)
                for (var r = 0; r < n.length; r++) {
                    var i = e[n[r]];
                    if (i != null) {
                        if (i === `none`) return `none`;
                        t = t == null ? i : t + (` ` + i);
                    }
                }
            return t ?? e.default;
        }
        function Oi(e, t) {
            return (
                (e = Di(e)),
                (t = Di(t)),
                t == null ? (e === `auto` ? null : e) : t === `auto` ? null : t
            );
        }
        var ki =
                typeof reportError == `function`
                    ? reportError
                    : function (e) {
                          if (
                              typeof window == `object` &&
                              typeof window.ErrorEvent == `function`
                          ) {
                              var t = new window.ErrorEvent(`error`, {
                                  bubbles: !0,
                                  cancelable: !0,
                                  message:
                                      typeof e == `object` &&
                                      e &&
                                      typeof e.message == `string`
                                          ? String(e.message)
                                          : String(e),
                                  error: e,
                              });
                              if (!window.dispatchEvent(t)) return;
                          } else if (
                              typeof process == `object` &&
                              typeof process.emit == `function`
                          ) {
                              process.emit(`uncaughtException`, e);
                              return;
                          }
                          console.error(e);
                      },
            Ai = [],
            ji = 0,
            Mi = 0;
        function Ni() {
            for (var e = ji, t = (Mi = ji = 0); t < e;) {
                var n = Ai[t];
                Ai[t++] = null;
                var r = Ai[t];
                Ai[t++] = null;
                var i = Ai[t];
                Ai[t++] = null;
                var a = Ai[t];
                if (((Ai[t++] = null), r !== null && i !== null)) {
                    var o = r.pending;
                    (o === null ? (i.next = i) : ((i.next = o.next), (o.next = i)),
                        (r.pending = i));
                }
                a !== 0 && M(n, i, a);
            }
        }
        function Pi(e, t, n, r) {
            ((Ai[ji++] = e),
                (Ai[ji++] = t),
                (Ai[ji++] = n),
                (Ai[ji++] = r),
                (Mi |= r),
                (e.lanes |= r),
                (e = e.alternate),
                e !== null && (e.lanes |= r));
        }
        function Fi(e, t, n, r) {
            return (Pi(e, t, n, r), Ii(e));
        }
        function j(e, t) {
            return (Pi(e, null, null, t), Ii(e));
        }
        function M(e, t, n) {
            e.lanes |= n;
            var r = e.alternate;
            r !== null && (r.lanes |= n);
            for (var i = !1, a = e.return; a !== null;)
                ((a.childLanes |= n),
                    (r = a.alternate),
                    r !== null && (r.childLanes |= n),
                    a.tag === 22 &&
                        ((e = a.stateNode),
                        e === null || e._visibility & 1 || (i = !0)),
                    (e = a),
                    (a = a.return));
            return e.tag === 3
                ? ((a = e.stateNode),
                  i &&
                      t !== null &&
                      ((i = 31 - ut(n)),
                      (e = a.hiddenUpdates),
                      (r = e[i]),
                      r === null ? (e[i] = [t]) : r.push(t),
                      (t.lane = n | 536870912)),
                  a)
                : null;
        }
        function Ii(e) {
            if (50 < kd) throw ((kd = 0), (Ad = null), Error(i(185)));
            for (var t = e.return; t !== null;) ((e = t), (t = e.return));
            return e.tag === 3 ? e.stateNode : null;
        }
        var Li = {};
        function Ri(e, t, n, r) {
            ((this.tag = e),
                (this.key = n),
                (this.sibling =
                    this.child =
                    this.return =
                    this.stateNode =
                    this.type =
                    this.elementType =
                        null),
                (this.index = 0),
                (this.refCleanup = this.ref = null),
                (this.pendingProps = t),
                (this.dependencies =
                    this.memoizedState =
                    this.updateQueue =
                    this.memoizedProps =
                        null),
                (this.mode = r),
                (this.subtreeFlags = this.flags = 0),
                (this.deletions = null),
                (this.childLanes = this.lanes = 0),
                (this.alternate = null));
        }
        function zi(e, t, n, r) {
            return new Ri(e, t, n, r);
        }
        function Bi(e) {
            return ((e = e.prototype), !(!e || !e.isReactComponent));
        }
        function Vi(e, t) {
            var n = e.alternate;
            return (
                n === null
                    ? ((n = zi(e.tag, t, e.key, e.mode)),
                      (n.elementType = e.elementType),
                      (n.type = e.type),
                      (n.stateNode = e.stateNode),
                      (n.alternate = e),
                      (e.alternate = n))
                    : ((n.pendingProps = t),
                      (n.type = e.type),
                      (n.flags = 0),
                      (n.subtreeFlags = 0),
                      (n.deletions = null)),
                (n.flags = e.flags & 1206910976),
                (n.childLanes = e.childLanes),
                (n.lanes = e.lanes),
                (n.child = e.child),
                (n.memoizedProps = e.memoizedProps),
                (n.memoizedState = e.memoizedState),
                (n.updateQueue = e.updateQueue),
                (t = e.dependencies),
                (n.dependencies =
                    t === null
                        ? null
                        : { lanes: t.lanes, firstContext: t.firstContext }),
                (n.sibling = e.sibling),
                (n.index = e.index),
                (n.ref = e.ref),
                (n.refCleanup = e.refCleanup),
                n
            );
        }
        function Hi(e, t) {
            e.flags &= 1206910978;
            var n = e.alternate;
            return (
                n === null
                    ? ((e.childLanes = 0),
                      (e.lanes = t),
                      (e.child = null),
                      (e.subtreeFlags = 0),
                      (e.memoizedProps = null),
                      (e.memoizedState = null),
                      (e.updateQueue = null),
                      (e.dependencies = null),
                      (e.stateNode = null))
                    : ((e.childLanes = n.childLanes),
                      (e.lanes = n.lanes),
                      (e.child = n.child),
                      (e.subtreeFlags = 0),
                      (e.deletions = null),
                      (e.memoizedProps = n.memoizedProps),
                      (e.memoizedState = n.memoizedState),
                      (e.updateQueue = n.updateQueue),
                      (e.type = n.type),
                      (t = n.dependencies),
                      (e.dependencies =
                          t === null
                              ? null
                              : { lanes: t.lanes, firstContext: t.firstContext })),
                e
            );
        }
        function Ui(e, t, n, r, a, o) {
            var s = 0;
            if (((r = e), typeof r == `function`)) Bi(r) && (s = 1);
            else if (typeof r == `string`)
                s = qm(e, n, Me.current)
                    ? 26
                    : e === `html` || e === `head` || e === `body`
                      ? 27
                      : 5;
            else
                a: switch (r) {
                    case _e:
                        return (
                            (e = zi(31, n, t, a)),
                            (e.elementType = _e),
                            (e.lanes = o),
                            e
                        );
                    case ce:
                        return Wi(n.children, a, o, t);
                    case le:
                        ((s = 8), (a |= 24));
                        break;
                    case ue:
                        return (
                            (e = zi(12, n, t, a | 2)),
                            (e.elementType = ue),
                            (e.lanes = o),
                            e
                        );
                    case pe:
                        return (
                            (e = zi(13, n, t, a)),
                            (e.elementType = pe),
                            (e.lanes = o),
                            e
                        );
                    case me:
                        return (
                            (e = zi(19, n, t, a)),
                            (e.elementType = me),
                            (e.lanes = o),
                            e
                        );
                    case ve:
                    case be:
                        return (
                            (e = a | 32),
                            (e = zi(30, n, t, e)),
                            (e.elementType = be),
                            (e.lanes = o),
                            (e.stateNode = {
                                autoName: null,
                                paired: null,
                                clones: null,
                                ref: null,
                            }),
                            e
                        );
                    default:
                        if (typeof r == `object` && r)
                            switch (r.$$typeof) {
                                case C:
                                    s = 10;
                                    break a;
                                case de:
                                    s = 9;
                                    break a;
                                case fe:
                                    s = 11;
                                    break a;
                                case he:
                                    s = 14;
                                    break a;
                                case ge:
                                    ((s = 16), (r = null));
                                    break a;
                            }
                        ((s = 29),
                            (n = Error(i(130, e === null ? `null` : typeof e, ``))),
                            (r = null));
                }
            return (
                (t = zi(s, n, t, a)),
                (t.elementType = e),
                (t.type = r),
                (t.lanes = o),
                t
            );
        }
        function Wi(e, t, n, r) {
            return ((e = zi(7, e, r, t)), (e.lanes = n), e);
        }
        function Gi(e, t, n) {
            return ((e = zi(6, e, null, t)), (e.lanes = n), e);
        }
        function Ki(e) {
            var t = zi(18, null, null, 0);
            return ((t.stateNode = e), t);
        }
        function qi(e, t, n) {
            return (
                (t = zi(4, e.children === null ? [] : e.children, e.key, t)),
                (t.lanes = n),
                (t.stateNode = {
                    containerInfo: e.containerInfo,
                    pendingChildren: null,
                    implementation: e.implementation,
                }),
                t
            );
        }
        var Ji = new WeakMap();
        function Yi(e, t) {
            if (typeof e == `object` && e) {
                var n = Ji.get(e);
                return n === void 0
                    ? ((t = { value: e, source: t, stack: Ke(t) }), Ji.set(e, t), t)
                    : n;
            }
            return { value: e, source: t, stack: Ke(t) };
        }
        var Xi = [],
            Zi = 0,
            N = null,
            P = 0,
            Qi = [],
            F = 0,
            $i = null,
            ea = 1,
            ta = ``;
        function na(e, t) {
            ((Xi[Zi++] = P), (Xi[Zi++] = N), (N = e), (P = t));
        }
        function ra(e, t, n) {
            ((Qi[F++] = ea), (Qi[F++] = ta), (Qi[F++] = $i), ($i = e));
            var r = ea;
            e = ta;
            var i = 32 - ut(r) - 1;
            ((r &= ~(1 << i)), (n += 1));
            var a = 32 - ut(t) + i;
            if (30 < a) {
                var o = i - (i % 5);
                ((a = (r & ((1 << o) - 1)).toString(32)),
                    (r >>= o),
                    (i -= o),
                    (ea = (1 << (32 - ut(t) + i)) | (n << i) | r),
                    (ta = a + e));
            } else ((ea = (1 << a) | (n << i) | r), (ta = e));
        }
        function ia(e) {
            e.return !== null && (na(e, 1), ra(e, 1, 0));
        }
        function aa(e) {
            for (; e === N;)
                ((N = Xi[--Zi]), (Xi[Zi] = null), (P = Xi[--Zi]), (Xi[Zi] = null));
            for (; e === $i;)
                (($i = Qi[--F]),
                    (Qi[F] = null),
                    (ta = Qi[--F]),
                    (Qi[F] = null),
                    (ea = Qi[--F]),
                    (Qi[F] = null));
        }
        function oa(e, t) {
            ((Qi[F++] = ea),
                (Qi[F++] = ta),
                (Qi[F++] = $i),
                (ea = t.id),
                (ta = t.overflow),
                ($i = e));
        }
        var I = null,
            L = null,
            R = !1,
            sa = null,
            ca = !1,
            la = Error(i(519));
        function ua(e) {
            throw (
                ga(
                    Yi(
                        Error(
                            i(
                                418,
                                1 < arguments.length &&
                                    arguments[1] !== void 0 &&
                                    arguments[1]
                                    ? `text`
                                    : `HTML`,
                                ``,
                            ),
                        ),
                        e,
                    ),
                ),
                la
            );
        }
        function da(e) {
            var t = e.stateNode,
                n = e.type,
                r = e.memoizedProps;
            switch (((t[Pt] = e), (t[D] = r), n)) {
                case `dialog`:
                    (Q(`cancel`, t), Q(`close`, t));
                    break;
                case `iframe`:
                case `object`:
                case `embed`:
                    Q(`load`, t);
                    break;
                case `video`:
                case `audio`:
                    for (n = 0; n < zf.length; n++) Q(zf[n], t);
                    break;
                case `source`:
                    Q(`error`, t);
                    break;
                case `img`:
                case `image`:
                case `link`:
                    (Q(`error`, t), Q(`load`, t));
                    break;
                case `details`:
                    Q(`toggle`, t);
                    break;
                case `input`:
                    (Q(`invalid`, t),
                        gn(
                            t,
                            r.value,
                            r.defaultValue,
                            r.checked,
                            r.defaultChecked,
                            r.type,
                            r.name,
                            !0,
                        ));
                    break;
                case `select`:
                    Q(`invalid`, t);
                    break;
                case `textarea`:
                    (Q(`invalid`, t), bn(t, r.value, r.defaultValue, r.children));
            }
            ((n = r.children),
                (typeof n != `string` &&
                    typeof n != `number` &&
                    typeof n != `bigint`) ||
                t.textContent === `` + n ||
                !0 === r.suppressHydrationWarning ||
                ep(t.textContent, n)
                    ? (r.popover != null && (Q(`beforetoggle`, t), Q(`toggle`, t)),
                      r.onScroll != null && Q(`scroll`, t),
                      r.onScrollEnd != null && Q(`scrollend`, t),
                      r.onClick != null && (t.onclick = kn),
                      (t = !0))
                    : (t = !1),
                t || ua(e, !0));
        }
        function fa(e) {
            for (I = e.return; I;)
                switch (I.tag) {
                    case 5:
                    case 31:
                    case 13:
                        ca = !1;
                        return;
                    case 27:
                    case 3:
                        ca = !0;
                        return;
                    default:
                        I = I.return;
                }
        }
        function pa(e) {
            if (e !== I) return !1;
            if (!R) return (fa(e), (R = !0), !1);
            var t = e.tag,
                n;
            if (
                ((n = t !== 3 && t !== 27) &&
                    ((n = t === 5) &&
                        ((n = e.type),
                        (n =
                            n === `form` ||
                            n === `button` ||
                            pp(e.type, e.memoizedProps))),
                    (n = !n)),
                n && L && ua(e),
                fa(e),
                t === 13)
            ) {
                if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
                    throw Error(i(317));
                L = dm(e);
            } else if (t === 31) {
                if (((e = e.memoizedState), (e = e === null ? null : e.dehydrated), !e))
                    throw Error(i(317));
                L = dm(e);
            } else
                t === 27
                    ? ((t = L), Sp(e.type) ? ((e = um), (um = null), (L = e)) : (L = t))
                    : (L = I ? lm(e.stateNode.nextSibling) : null);
            return !0;
        }
        function ma() {
            ((L = I = null), (R = !1));
        }
        function ha() {
            var e = sa;
            return (
                e !== null &&
                    (fd === null ? (fd = e) : fd.push.apply(fd, e), (sa = null)),
                e
            );
        }
        function ga(e) {
            sa === null ? (sa = [e]) : sa.push(e);
        }
        var _a = Ae(null),
            va = null,
            ya = null;
        function ba(e, t, n) {
            (E(_a, t._currentValue), (t._currentValue = n));
        }
        function xa(e) {
            ((e._currentValue = _a.current), je(_a));
        }
        function Sa(e, t, n) {
            for (; e !== null;) {
                var r = e.alternate;
                if (
                    ((e.childLanes & t) === t
                        ? r !== null && (r.childLanes & t) !== t && (r.childLanes |= t)
                        : ((e.childLanes |= t), r !== null && (r.childLanes |= t)),
                    e === n)
                )
                    break;
                e = e.return;
            }
        }
        function Ca(e, t, n, r) {
            var a = e.child;
            for (a !== null && (a.return = e); a !== null;) {
                var o = a.dependencies;
                if (o !== null) {
                    var s = a.child;
                    o = o.firstContext;
                    a: for (; o !== null;) {
                        var c = o;
                        o = a;
                        for (var l = 0; l < t.length; l++)
                            if (c.context === t[l]) {
                                ((o.lanes |= n),
                                    (c = o.alternate),
                                    c !== null && (c.lanes |= n),
                                    Sa(o.return, n, e),
                                    r || (s = null));
                                break a;
                            }
                        o = c.next;
                    }
                } else if (a.tag === 18) {
                    if (((s = a.return), s === null)) throw Error(i(341));
                    ((s.lanes |= n),
                        (o = s.alternate),
                        o !== null && (o.lanes |= n),
                        Sa(s, n, e),
                        (s = null));
                } else
                    a.tag === 13 &&
                    a.memoizedState !== null &&
                    a.memoizedState.dehydrated === null
                        ? ((a.lanes |= n),
                          (s = a.alternate),
                          s !== null && (s.lanes |= n),
                          Sa(a.return, n, e),
                          (s = a.child),
                          (s = s === null ? null : s.sibling))
                        : (s = a.child);
                if (s !== null) s.return = a;
                else
                    for (s = a; s !== null;) {
                        if (s === e) {
                            s = null;
                            break;
                        }
                        if (((a = s.sibling), a !== null)) {
                            ((a.return = s.return), (s = a));
                            break;
                        }
                        s = s.return;
                    }
                a = s;
            }
        }
        function wa(e, t, n, r) {
            e = null;
            for (var a = t, o = !1; a !== null;) {
                if (!o) {
                    if (a.flags & 524288) o = !0;
                    else if (a.flags & 262144) break;
                }
                if (a.tag === 10) {
                    var s = a.alternate;
                    if (s === null) throw Error(i(387));
                    if (((s = s.memoizedProps), s !== null)) {
                        var c = a.type;
                        Qr(a.pendingProps.value, s.value) ||
                            (e === null ? (e = [c]) : e.push(c));
                    }
                } else if (a === Fe.current) {
                    if (((s = a.alternate), s === null)) throw Error(i(387));
                    s.memoizedState.memoizedState !== a.memoizedState.memoizedState &&
                        (e === null ? (e = [sh]) : e.push(sh));
                }
                a = a.return;
            }
            return (e !== null && Ca(t, e, n, r), (t.flags |= 262144), e !== null);
        }
        function Ta(e) {
            for (e = e.firstContext; e !== null;) {
                if (!Qr(e.context._currentValue, e.memoizedValue)) return !0;
                e = e.next;
            }
            return !1;
        }
        function Ea(e) {
            ((va = e),
                (ya = null),
                (e = e.dependencies),
                e !== null && (e.firstContext = null));
        }
        function z(e) {
            return Oa(va, e);
        }
        function Da(e, t) {
            return (va === null && Ea(e), Oa(e, t));
        }
        function Oa(e, t) {
            var n = t._currentValue;
            if (((t = { context: t, memoizedValue: n, next: null }), ya === null)) {
                if (e === null) throw Error(i(308));
                ((ya = t),
                    (e.dependencies = { lanes: 0, firstContext: t }),
                    (e.flags |= 524288));
            } else ya = ya.next = t;
            return n;
        }
        var ka =
                typeof AbortController < `u`
                    ? AbortController
                    : function () {
                          var e = [],
                              t = (this.signal = {
                                  aborted: !1,
                                  addEventListener: function (t, n) {
                                      e.push(n);
                                  },
                              });
                          this.abort = function () {
                              ((t.aborted = !0),
                                  e.forEach(function (e) {
                                      return e();
                                  }));
                          };
                      },
            Aa = t.unstable_scheduleCallback,
            ja = t.unstable_NormalPriority,
            B = {
                $$typeof: C,
                Consumer: null,
                Provider: null,
                _currentValue: null,
                _currentValue2: null,
                _threadCount: 0,
            };
        function Ma() {
            return { controller: new ka(), data: new Map(), refCount: 0 };
        }
        function Na(e) {
            (e.refCount--,
                e.refCount === 0 &&
                    Aa(ja, function () {
                        e.controller.abort();
                    }));
        }
        function Pa(e, t) {
            if (e.pendingLanes & 4194048) {
                var n = e.transitionTypes;
                for (
                    n === null && (n = e.transitionTypes = []), e = 0;
                    e < t.length;
                    e++
                ) {
                    var r = t[e];
                    n.indexOf(r) === -1 && n.push(r);
                }
            }
        }
        var Fa = null;
        function Ia(e) {
            var t = e.transitionTypes;
            return ((e.transitionTypes = null), t);
        }
        var La = null,
            Ra = 0,
            za = 0,
            Ba = null;
        function Va(e, t) {
            if (La === null) {
                var n = (La = []);
                ((Ra = 0),
                    (za = Pf()),
                    (Ba = {
                        status: `pending`,
                        value: void 0,
                        then: function (e) {
                            n.push(e);
                        },
                    }));
            }
            return (Ra++, t.then(Ha, Ha), t);
        }
        function Ha() {
            if (--Ra === 0 && ((Fa = null), La !== null)) {
                Ba !== null && (Ba.status = `fulfilled`);
                var e = La;
                ((La = null), (za = 0), (Ba = null));
                for (var t = 0; t < e.length; t++) (0, e[t])();
            }
        }
        function Ua(e, t) {
            var n = [],
                r = {
                    status: `pending`,
                    value: null,
                    reason: null,
                    then: function (e) {
                        n.push(e);
                    },
                };
            return (
                e.then(
                    function () {
                        ((r.status = `fulfilled`), (r.value = t));
                        for (var e = 0; e < n.length; e++) (0, n[e])(t);
                    },
                    function (e) {
                        for (
                            r.status = `rejected`, r.reason = e, e = 0;
                            e < n.length;
                            e++
                        )
                            (0, n[e])(void 0);
                    },
                ),
                r
            );
        }
        var Wa = w.S;
        w.S = function (e, t) {
            if (
                ((hd = Qe()),
                typeof t == `object` && t && typeof t.then == `function` && Va(e, t),
                Fa !== null)
            )
                for (var n = bf; n !== null;) (Pa(n, Fa), (n = n.next));
            if (((n = e.types), n !== null)) {
                for (var r = bf; r !== null;) (Pa(r, n), (r = r.next));
                if (za !== 0) {
                    ((r = Fa), r === null && (r = Fa = []));
                    for (var i = 0; i < n.length; i++) {
                        var a = n[i];
                        r.indexOf(a) === -1 && r.push(a);
                    }
                }
            }
            Wa !== null && Wa(e, t);
        };
        var Ga = Ae(null);
        function Ka() {
            var e = Ga.current;
            return e === null ? q.pooledCache : e;
        }
        function qa(e, t) {
            t === null ? E(Ga, Ga.current) : E(Ga, t.pool);
        }
        function Ja() {
            var e = Ka();
            return e === null ? null : { parent: B._currentValue, pool: e };
        }
        var Ya = Error(i(460)),
            Xa = Error(i(474)),
            Za = Error(i(542)),
            Qa = { then: function () {} };
        function $a(e) {
            return ((e = e.status), e === `fulfilled` || e === `rejected`);
        }
        function eo(e, t, n) {
            switch (
                ((n = e[n]),
                n === void 0 ? e.push(t) : n !== t && (t.then(kn, kn), (t = n)),
                t.status)
            ) {
                case `fulfilled`:
                    return t.value;
                case `rejected`:
                    throw (
                        (e = t.reason),
                        io(e),
                        e === void 0 && !(`reason` in t) ? Error(i(600)) : e
                    );
                default:
                    if (typeof t.status == `string`) t.then(kn, kn);
                    else {
                        if (((e = q), e !== null && 100 < e.shellSuspendCounter))
                            throw Error(i(482));
                        ((e = t),
                            (e.status = `pending`),
                            e.then(
                                function (e) {
                                    if (t.status === `pending`) {
                                        var n = t;
                                        ((n.status = `fulfilled`), (n.value = e));
                                    }
                                },
                                function (e) {
                                    if (t.status === `pending`) {
                                        var n = t;
                                        ((n.status = `rejected`), (n.reason = e));
                                    }
                                },
                            ));
                    }
                    switch (t.status) {
                        case `fulfilled`:
                            return t.value;
                        case `rejected`:
                            throw ((e = t.reason), io(e), e);
                    }
                    throw ((no = t), Ya);
            }
        }
        function to(e) {
            try {
                var t = e._init;
                return t(e._payload);
            } catch (e) {
                throw typeof e == `object` && e && typeof e.then == `function`
                    ? ((no = e), Ya)
                    : e;
            }
        }
        var no = null;
        function ro() {
            if (no === null) throw Error(i(459));
            var e = no;
            return ((no = null), e);
        }
        function io(e) {
            if (e === Ya || e === Za) throw Error(i(483));
        }
        var ao = null,
            oo = 0;
        function so(e) {
            var t = oo;
            return ((oo += 1), ao === null && (ao = []), eo(ao, e, t));
        }
        function co(e, t) {
            ((t = t.props.ref), (e.ref = t === void 0 ? null : t));
        }
        function lo(e, t) {
            throw t.$$typeof === ae
                ? Error(i(525))
                : ((e = Object.prototype.toString.call(t)),
                  Error(
                      i(
                          31,
                          e === `[object Object]`
                              ? `object with keys {` + Object.keys(t).join(`, `) + `}`
                              : e,
                      ),
                  ));
        }
        function uo(e) {
            function t(t, n) {
                if (e) {
                    var r = t.deletions;
                    r === null ? ((t.deletions = [n]), (t.flags |= 16)) : r.push(n);
                }
            }
            function n(n, r) {
                if (!e) return null;
                for (; r !== null;) (t(n, r), (r = r.sibling));
                return null;
            }
            function r(e) {
                for (var t = new Map(); e !== null;)
                    (e.key === null ? t.set(e.index, e) : t.set(e.key, e),
                        (e = e.sibling));
                return t;
            }
            function a(e, t) {
                return ((e = Vi(e, t)), (e.index = 0), (e.sibling = null), e);
            }
            function o(t, n, r) {
                return (
                    (t.index = r),
                    e
                        ? ((r = t.alternate),
                          r === null
                              ? ((t.flags |= 134217730), n)
                              : ((r = r.index), r < n ? ((t.flags |= 2), n) : r))
                        : ((t.flags |= 1048576), n)
                );
            }
            function s(t) {
                return (e && t.alternate === null && (t.flags |= 134217730), t);
            }
            function c(e, t, n, r) {
                return t === null || t.tag !== 6
                    ? ((t = Gi(n, e.mode, r)), (t.return = e), t)
                    : ((t = a(t, n)), (t.return = e), t);
            }
            function l(e, t, n, r) {
                var i = n.type;
                return i === ce
                    ? ((e = d(e, t, n.props.children, r, n.key)), co(e, n), e)
                    : t !== null &&
                        (t.elementType === i ||
                            (typeof i == `object` &&
                                i &&
                                i.$$typeof === ge &&
                                to(i) === t.type))
                      ? ((t = a(t, n.props)), co(t, n), (t.return = e), t)
                      : ((t = Ui(n.type, n.key, n.props, null, e.mode, r)),
                        co(t, n),
                        (t.return = e),
                        t);
            }
            function u(e, t, n, r) {
                return t === null ||
                    t.tag !== 4 ||
                    t.stateNode.containerInfo !== n.containerInfo ||
                    t.stateNode.implementation !== n.implementation
                    ? ((t = qi(n, e.mode, r)), (t.return = e), t)
                    : ((t = a(t, n.children || [])), (t.return = e), t);
            }
            function d(e, t, n, r, i) {
                return t === null || t.tag !== 7
                    ? ((t = Wi(n, e.mode, r, i)), (t.return = e), t)
                    : ((t = a(t, n)), (t.return = e), t);
            }
            function f(e, t, n) {
                if (
                    (typeof t == `string` && t !== ``) ||
                    typeof t == `number` ||
                    typeof t == `bigint`
                )
                    return ((t = Gi(`` + t, e.mode, n)), (t.return = e), t);
                if (typeof t == `object` && t) {
                    switch (t.$$typeof) {
                        case oe:
                            return (
                                (n = Ui(t.type, t.key, t.props, null, e.mode, n)),
                                co(n, t),
                                (n.return = e),
                                n
                            );
                        case se:
                            return ((t = qi(t, e.mode, n)), (t.return = e), t);
                        case ge:
                            return ((t = to(t)), f(e, t, n));
                    }
                    if (Ee(t) || Ce(t))
                        return ((t = Wi(t, e.mode, n, null)), (t.return = e), t);
                    if (typeof t.then == `function`) return f(e, so(t), n);
                    if (t.$$typeof === C) return f(e, Da(e, t), n);
                    lo(e, t);
                }
                return null;
            }
            function p(e, t, n, r) {
                var i = t === null ? null : t.key;
                if (
                    (typeof n == `string` && n !== ``) ||
                    typeof n == `number` ||
                    typeof n == `bigint`
                )
                    return i === null ? c(e, t, `` + n, r) : null;
                if (typeof n == `object` && n) {
                    switch (n.$$typeof) {
                        case oe:
                            return n.key === i ? l(e, t, n, r) : null;
                        case se:
                            return n.key === i ? u(e, t, n, r) : null;
                        case ge:
                            return ((n = to(n)), p(e, t, n, r));
                    }
                    if (Ee(n) || Ce(n)) return i === null ? d(e, t, n, r, null) : null;
                    if (typeof n.then == `function`) return p(e, t, so(n), r);
                    if (n.$$typeof === C) return p(e, t, Da(e, n), r);
                    lo(e, n);
                }
                return null;
            }
            function m(e, t, n, r, i) {
                if (
                    (typeof r == `string` && r !== ``) ||
                    typeof r == `number` ||
                    typeof r == `bigint`
                )
                    return ((e = e.get(n) || null), c(t, e, `` + r, i));
                if (typeof r == `object` && r) {
                    switch (r.$$typeof) {
                        case oe:
                            return (
                                (e = e.get(r.key === null ? n : r.key) || null),
                                l(t, e, r, i)
                            );
                        case se:
                            return (
                                (e = e.get(r.key === null ? n : r.key) || null),
                                u(t, e, r, i)
                            );
                        case ge:
                            return ((r = to(r)), m(e, t, n, r, i));
                    }
                    if (Ee(r) || Ce(r))
                        return ((e = e.get(n) || null), d(t, e, r, i, null));
                    if (typeof r.then == `function`) return m(e, t, n, so(r), i);
                    if (r.$$typeof === C) return m(e, t, n, Da(t, r), i);
                    lo(t, r);
                }
                return null;
            }
            function h(i, a, s, c) {
                for (
                    var l = null, u = null, d = a, h = (a = 0), g = null;
                    d !== null && h < s.length;
                    h++
                ) {
                    d.index > h ? ((g = d), (d = null)) : (g = d.sibling);
                    var _ = p(i, d, s[h], c);
                    if (_ === null) {
                        d === null && (d = g);
                        break;
                    }
                    (e && d && _.alternate === null && t(i, d),
                        (a = o(_, a, h)),
                        u === null ? (l = _) : (u.sibling = _),
                        (u = _),
                        (d = g));
                }
                if (h === s.length) return (n(i, d), R && na(i, h), l);
                if (d === null) {
                    for (; h < s.length; h++)
                        ((d = f(i, s[h], c)),
                            d !== null &&
                                ((a = o(d, a, h)),
                                u === null ? (l = d) : (u.sibling = d),
                                (u = d)));
                    return (R && na(i, h), l);
                }
                for (d = r(d); h < s.length; h++)
                    ((g = m(d, i, h, s[h], c)),
                        g !== null &&
                            (e &&
                                ((_ = g.alternate),
                                _ !== null && d.delete(_.key === null ? h : _.key)),
                            (a = o(g, a, h)),
                            u === null ? (l = g) : (u.sibling = g),
                            (u = g)));
                return (
                    e &&
                        d.forEach(function (e) {
                            return t(i, e);
                        }),
                    R && na(i, h),
                    l
                );
            }
            function g(a, s, c, l) {
                if (c == null) throw Error(i(151));
                for (
                    var u = null, d = null, h = s, g = (s = 0), _ = null, v = c.next();
                    h !== null && !v.done;
                    g++, v = c.next()
                ) {
                    h.index > g ? ((_ = h), (h = null)) : (_ = h.sibling);
                    var y = p(a, h, v.value, l);
                    if (y === null) {
                        h === null && (h = _);
                        break;
                    }
                    (e && h && y.alternate === null && t(a, h),
                        (s = o(y, s, g)),
                        d === null ? (u = y) : (d.sibling = y),
                        (d = y),
                        (h = _));
                }
                if (v.done) return (n(a, h), R && na(a, g), u);
                if (h === null) {
                    for (; !v.done; g++, v = c.next())
                        ((v = f(a, v.value, l)),
                            v !== null &&
                                ((s = o(v, s, g)),
                                d === null ? (u = v) : (d.sibling = v),
                                (d = v)));
                    return (R && na(a, g), u);
                }
                for (h = r(h); !v.done; g++, v = c.next())
                    ((v = m(h, a, g, v.value, l)),
                        v !== null &&
                            (e &&
                                ((_ = v.alternate),
                                _ !== null && h.delete(_.key === null ? g : _.key)),
                            (s = o(v, s, g)),
                            d === null ? (u = v) : (d.sibling = v),
                            (d = v)));
                return (
                    e &&
                        h.forEach(function (e) {
                            return t(a, e);
                        }),
                    R && na(a, g),
                    u
                );
            }
            function _(e, r, o, c) {
                if (
                    (typeof o == `object` &&
                        o &&
                        o.type === ce &&
                        o.key === null &&
                        o.props.ref === void 0 &&
                        (o = o.props.children),
                    typeof o == `object` && o)
                ) {
                    switch (o.$$typeof) {
                        case oe:
                            a: {
                                for (var l = o.key; r !== null;) {
                                    if (r.key === l) {
                                        if (((l = o.type), l === ce)) {
                                            if (r.tag === 7) {
                                                (n(e, r.sibling),
                                                    (c = a(r, o.props.children)),
                                                    co(c, o),
                                                    (c.return = e),
                                                    (e = c));
                                                break a;
                                            }
                                        } else if (
                                            r.elementType === l ||
                                            (typeof l == `object` &&
                                                l &&
                                                l.$$typeof === ge &&
                                                to(l) === r.type)
                                        ) {
                                            (n(e, r.sibling),
                                                (c = a(r, o.props)),
                                                co(c, o),
                                                (c.return = e),
                                                (e = c));
                                            break a;
                                        }
                                        n(e, r);
                                        break;
                                    }
                                    (t(e, r), (r = r.sibling));
                                }
                                o.type === ce
                                    ? ((c = Wi(o.props.children, e.mode, c, o.key)),
                                      co(c, o),
                                      (c.return = e),
                                      (e = c))
                                    : ((c = Ui(
                                          o.type,
                                          o.key,
                                          o.props,
                                          null,
                                          e.mode,
                                          c,
                                      )),
                                      co(c, o),
                                      (c.return = e),
                                      (e = c));
                            }
                            return s(e);
                        case se:
                            a: {
                                for (l = o.key; r !== null;) {
                                    if (r.key === l) {
                                        if (
                                            r.tag === 4 &&
                                            r.stateNode.containerInfo ===
                                                o.containerInfo &&
                                            r.stateNode.implementation ===
                                                o.implementation
                                        ) {
                                            (n(e, r.sibling),
                                                (c = a(r, o.children || [])),
                                                (c.return = e),
                                                (e = c));
                                            break a;
                                        }
                                        n(e, r);
                                        break;
                                    }
                                    (t(e, r), (r = r.sibling));
                                }
                                ((c = qi(o, e.mode, c)), (c.return = e), (e = c));
                            }
                            return s(e);
                        case ge:
                            return ((o = to(o)), _(e, r, o, c));
                    }
                    if (Ee(o)) return h(e, r, o, c);
                    if (Ce(o)) {
                        if (((l = Ce(o)), typeof l != `function`)) throw Error(i(150));
                        return ((o = l.call(o)), g(e, r, o, c));
                    }
                    if (typeof o.then == `function`) return _(e, r, so(o), c);
                    if (o.$$typeof === C) return _(e, r, Da(e, o), c);
                    lo(e, o);
                }
                return (typeof o == `string` && o !== ``) ||
                    typeof o == `number` ||
                    typeof o == `bigint`
                    ? ((o = `` + o),
                      r !== null && r.tag === 6
                          ? (n(e, r.sibling), (c = a(r, o)), (c.return = e), (e = c))
                          : (n(e, r), (c = Gi(o, e.mode, c)), (c.return = e), (e = c)),
                      s(e))
                    : n(e, r);
            }
            return function (e, t, n, r) {
                try {
                    oo = 0;
                    var i = _(e, t, n, r);
                    return ((ao = null), i);
                } catch (t) {
                    if (t === Ya || t === Za) throw t;
                    var a = zi(29, t, null, e.mode);
                    return ((a.lanes = r), (a.return = e), a);
                }
            };
        }
        var fo = uo(!0),
            po = uo(!1),
            mo = !1;
        function ho(e) {
            e.updateQueue = {
                baseState: e.memoizedState,
                firstBaseUpdate: null,
                lastBaseUpdate: null,
                shared: { pending: null, lanes: 0, hiddenCallbacks: null },
                callbacks: null,
            };
        }
        function go(e, t) {
            ((e = e.updateQueue),
                t.updateQueue === e &&
                    (t.updateQueue = {
                        baseState: e.baseState,
                        firstBaseUpdate: e.firstBaseUpdate,
                        lastBaseUpdate: e.lastBaseUpdate,
                        shared: e.shared,
                        callbacks: null,
                    }));
        }
        function _o(e) {
            return { lane: e, tag: 0, payload: null, callback: null, next: null };
        }
        function vo(e, t, n) {
            var r = e.updateQueue;
            if (r === null) return null;
            if (((r = r.shared), K & 2)) {
                var i = r.pending;
                return (
                    i === null ? (t.next = t) : ((t.next = i.next), (i.next = t)),
                    (r.pending = t),
                    (t = Ii(e)),
                    M(e, null, n),
                    t
                );
            }
            return (Pi(e, r, t, n), Ii(e));
        }
        function yo(e, t, n) {
            if (((t = t.updateQueue), t !== null && ((t = t.shared), n & 4194048))) {
                var r = t.lanes;
                ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Dt(e, n));
            }
        }
        function bo(e, t) {
            var n = e.updateQueue,
                r = e.alternate;
            if (r !== null && ((r = r.updateQueue), n === r)) {
                var i = null,
                    a = null;
                if (((n = n.firstBaseUpdate), n !== null)) {
                    do {
                        var o = {
                            lane: n.lane,
                            tag: n.tag,
                            payload: n.payload,
                            callback: null,
                            next: null,
                        };
                        (a === null ? (i = a = o) : (a = a.next = o), (n = n.next));
                    } while (n !== null);
                    a === null ? (i = a = t) : (a = a.next = t);
                } else i = a = t;
                ((n = {
                    baseState: r.baseState,
                    firstBaseUpdate: i,
                    lastBaseUpdate: a,
                    shared: r.shared,
                    callbacks: r.callbacks,
                }),
                    (e.updateQueue = n));
                return;
            }
            ((e = n.lastBaseUpdate),
                e === null ? (n.firstBaseUpdate = t) : (e.next = t),
                (n.lastBaseUpdate = t));
        }
        var xo = !1;
        function So() {
            if (xo) {
                var e = Ba;
                if (e !== null) throw e;
            }
        }
        function Co(e, t, n, r) {
            xo = !1;
            var i = e.updateQueue;
            mo = !1;
            var a = i.firstBaseUpdate,
                o = i.lastBaseUpdate,
                s = i.shared.pending;
            if (s !== null) {
                i.shared.pending = null;
                var c = s,
                    l = c.next;
                ((c.next = null), o === null ? (a = l) : (o.next = l), (o = c));
                var u = e.alternate;
                u !== null &&
                    ((u = u.updateQueue),
                    (s = u.lastBaseUpdate),
                    s !== o &&
                        (s === null ? (u.firstBaseUpdate = l) : (s.next = l),
                        (u.lastBaseUpdate = c)));
            }
            if (a !== null) {
                var d = i.baseState;
                ((o = 0), (u = l = c = null), (s = a));
                do {
                    var f = s.lane & -536870913,
                        p = f !== s.lane;
                    if (p ? (Y & f) === f : (r & f) === f) {
                        (f !== 0 && f === za && (xo = !0),
                            u !== null &&
                                (u = u.next =
                                    {
                                        lane: 0,
                                        tag: s.tag,
                                        payload: s.payload,
                                        callback: null,
                                        next: null,
                                    }));
                        a: {
                            var m = e,
                                h = s;
                            f = t;
                            var g = n;
                            switch (h.tag) {
                                case 1:
                                    if (((m = h.payload), typeof m == `function`)) {
                                        d = m.call(g, d, f);
                                        break a;
                                    }
                                    d = m;
                                    break a;
                                case 3:
                                    m.flags = (m.flags & -65537) | 128;
                                case 0:
                                    if (
                                        ((m = h.payload),
                                        (f =
                                            typeof m == `function`
                                                ? m.call(g, d, f)
                                                : m),
                                        f == null)
                                    )
                                        break a;
                                    d = S({}, d, f);
                                    break a;
                                case 2:
                                    mo = !0;
                            }
                        }
                        ((f = s.callback),
                            f !== null &&
                                ((e.flags |= 64),
                                p && (e.flags |= 8192),
                                (p = i.callbacks),
                                p === null ? (i.callbacks = [f]) : p.push(f)));
                    } else
                        ((p = {
                            lane: f,
                            tag: s.tag,
                            payload: s.payload,
                            callback: s.callback,
                            next: null,
                        }),
                            u === null ? ((l = u = p), (c = d)) : (u = u.next = p),
                            (o |= f));
                    if (((s = s.next), s === null)) {
                        if (((s = i.shared.pending), s === null)) break;
                        ((p = s),
                            (s = p.next),
                            (p.next = null),
                            (i.lastBaseUpdate = p),
                            (i.shared.pending = null));
                    }
                } while (1);
                (u === null && (c = d),
                    (i.baseState = c),
                    (i.firstBaseUpdate = l),
                    (i.lastBaseUpdate = u),
                    a === null && (i.shared.lanes = 0),
                    (od |= o),
                    (e.lanes = o),
                    (e.memoizedState = d));
            }
        }
        function wo(e, t) {
            if (typeof e != `function`) throw Error(i(191, e));
            e.call(t);
        }
        function To(e, t) {
            var n = e.callbacks;
            if (n !== null)
                for (e.callbacks = null, e = 0; e < n.length; e++) wo(n[e], t);
        }
        var Eo = Ae(null),
            Do = Ae(0);
        function Oo(e, t) {
            ((e = id), E(Do, e), E(Eo, t), (id = e | t.baseLanes));
        }
        function ko() {
            (E(Do, id), E(Eo, Eo.current));
        }
        function Ao() {
            ((id = Do.current), je(Eo), je(Do));
        }
        var jo = Ae(null),
            Mo = null;
        function No(e) {
            var t = e.alternate;
            (E(Ro, Ro.current & 1),
                E(jo, e),
                Mo === null &&
                    (t === null || Eo.current !== null || t.memoizedState !== null) &&
                    (Mo = e));
        }
        function Po(e) {
            (E(Ro, Ro.current), E(jo, e), Mo === null && (Mo = e));
        }
        function Fo(e) {
            e.tag === 22
                ? (E(Ro, Ro.current), E(jo, e), Mo === null && (Mo = e))
                : Io();
        }
        function Io() {
            (E(Ro, Ro.current), E(jo, jo.current));
        }
        function Lo(e) {
            (je(jo), Mo === e && (Mo = null), je(Ro));
        }
        var Ro = Ae(0);
        function zo(e, t) {
            (E(jo, jo.current), E(Ro, t));
        }
        function Bo(e) {
            (je(Ro), je(jo), Mo === e && (Mo = null));
        }
        function Vo(e) {
            for (var t = e; t !== null;) {
                if (t.tag === 13) {
                    var n = t.memoizedState;
                    if (
                        n !== null &&
                        ((n = n.dehydrated), n === null || om(n) || sm(n))
                    )
                        return t;
                } else if (
                    t.tag === 19 &&
                    t.memoizedProps.revealOrder !== `independent`
                ) {
                    if (t.flags & 128) return t;
                } else if (t.child !== null) {
                    ((t.child.return = t), (t = t.child));
                    continue;
                }
                if (t === e) break;
                for (; t.sibling === null;) {
                    if (t.return === null || t.return === e) return null;
                    t = t.return;
                }
                ((t.sibling.return = t.return), (t = t.sibling));
            }
            return null;
        }
        var Ho = 0,
            V = null,
            H = null,
            Uo = null,
            Wo = !1,
            Go = !1,
            Ko = !1,
            qo = 0,
            Jo = 0,
            Yo = null,
            Xo = 0;
        function Zo() {
            throw Error(i(321));
        }
        function Qo(e, t) {
            if (t === null) return !1;
            for (var n = 0; n < t.length && n < e.length; n++)
                if (!Qr(e[n], t[n])) return !1;
            return !0;
        }
        function $o(e, t, n, r, i, a) {
            return (
                (Ho = a),
                (V = t),
                (t.memoizedState = null),
                (t.updateQueue = null),
                (t.lanes = 0),
                (w.H = e === null || e.memoizedState === null ? gc : _c),
                (Ko = !1),
                (a = n(r, i)),
                (Ko = !1),
                Go && (a = ts(t, n, r, i)),
                es(e),
                a
            );
        }
        function es(e) {
            w.H = hc;
            var t = H !== null && H.next !== null;
            if (((Ho = 0), (Uo = H = V = null), (Wo = !1), (Jo = 0), (Yo = null), t))
                throw Error(i(300));
            e === null ||
                Pc ||
                ((e = e.dependencies), e !== null && Ta(e) && (Pc = !0));
        }
        function ts(e, t, n, r) {
            V = e;
            var a = 0;
            do {
                if ((Go && (Yo = null), (Jo = 0), (Go = !1), 25 <= a))
                    throw Error(i(301));
                if (((a += 1), (Uo = H = null), e.updateQueue != null)) {
                    var o = e.updateQueue;
                    ((o.lastEffect = null),
                        (o.events = null),
                        (o.stores = null),
                        o.memoCache != null && (o.memoCache.index = 0));
                }
                ((w.H = vc), (o = t(n, r)));
            } while (Go);
            return o;
        }
        function ns() {
            var e = w.H,
                t = e.useState()[0];
            return (
                (t = typeof t.then == `function` ? ls(t) : t),
                (e = e.useState()[0]),
                (H === null ? null : H.memoizedState) !== e && (V.flags |= 1024),
                t
            );
        }
        function rs() {
            var e = qo !== 0;
            return ((qo = 0), e);
        }
        function is(e, t, n) {
            ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
        }
        function as(e) {
            if (Wo) {
                for (e = e.memoizedState; e !== null;) {
                    var t = e.queue;
                    (t !== null && (t.pending = null), (e = e.next));
                }
                Wo = !1;
            }
            ((Ho = 0), (Uo = H = V = null), (Go = !1), (Jo = qo = 0), (Yo = null));
        }
        function os() {
            var e = {
                memoizedState: null,
                baseState: null,
                baseQueue: null,
                queue: null,
                next: null,
            };
            return (Uo === null ? (V.memoizedState = Uo = e) : (Uo = Uo.next = e), Uo);
        }
        function ss() {
            if (H === null) {
                var e = V.alternate;
                e = e === null ? null : e.memoizedState;
            } else e = H.next;
            var t = Uo === null ? V.memoizedState : Uo.next;
            if (t !== null) ((Uo = t), (H = e));
            else {
                if (e === null)
                    throw V.alternate === null ? Error(i(467)) : Error(i(310));
                ((H = e),
                    (e = {
                        memoizedState: H.memoizedState,
                        baseState: H.baseState,
                        baseQueue: H.baseQueue,
                        queue: H.queue,
                        next: null,
                    }),
                    Uo === null ? (V.memoizedState = Uo = e) : (Uo = Uo.next = e));
            }
            return Uo;
        }
        function cs() {
            return { lastEffect: null, events: null, stores: null, memoCache: null };
        }
        function ls(e) {
            var t = Jo;
            return (
                (Jo += 1),
                Yo === null && (Yo = []),
                (e = eo(Yo, e, t)),
                (t = V),
                (Uo === null ? t.memoizedState : Uo.next) === null &&
                    ((t = t.alternate),
                    (w.H = t === null || t.memoizedState === null ? gc : _c)),
                e
            );
        }
        function us(e) {
            if (typeof e == `object` && e) {
                if (typeof e.then == `function`) return ls(e);
                if (e.$$typeof === xe) return;
                if (e.$$typeof === C) return z(e);
            }
            throw Error(i(438, String(e)));
        }
        function ds(e) {
            var t = null,
                n = V.updateQueue;
            if ((n !== null && (t = n.memoCache), t == null)) {
                var r = V.alternate;
                r !== null &&
                    ((r = r.updateQueue),
                    r !== null &&
                        ((r = r.memoCache),
                        r != null &&
                            (t = {
                                data: r.data.map(function (e) {
                                    return e.slice();
                                }),
                                index: 0,
                            })));
            }
            if (
                ((t ??= { data: [], index: 0 }),
                n === null && ((n = cs()), (V.updateQueue = n)),
                (n.memoCache = t),
                (n = t.data[t.index]),
                n === void 0)
            )
                for (n = t.data[t.index] = Array(e), r = 0; r < e; r++) n[r] = ye;
            return (t.index++, n);
        }
        function fs(e, t) {
            return typeof t == `function` ? t(e) : t;
        }
        function ps(e) {
            return ms(ss(), H, e);
        }
        function ms(e, t, n) {
            var r = e.queue;
            if (r === null) throw Error(i(311));
            r.lastRenderedReducer = n;
            var a = e.baseQueue,
                o = r.pending;
            if (o !== null) {
                if (a !== null) {
                    var s = a.next;
                    ((a.next = o.next), (o.next = s));
                }
                ((t.baseQueue = a = o), (r.pending = null));
            }
            if (((o = e.baseState), a === null)) e.memoizedState = o;
            else {
                t = a.next;
                var c = (s = null),
                    l = null,
                    u = t,
                    d = !1;
                do {
                    var f = u.lane & -536870913;
                    if (f === u.lane ? (Ho & f) === f : (Y & f) === f) {
                        var p = u.revertLane;
                        if (p === 0)
                            (l !== null &&
                                (l = l.next =
                                    {
                                        lane: 0,
                                        revertLane: 0,
                                        gesture: null,
                                        action: u.action,
                                        hasEagerState: u.hasEagerState,
                                        eagerState: u.eagerState,
                                        next: null,
                                    }),
                                f === za && (d = !0));
                        else if ((Ho & p) === p) {
                            ((u = u.next), p === za && (d = !0));
                            continue;
                        } else
                            ((f = {
                                lane: 0,
                                revertLane: u.revertLane,
                                gesture: null,
                                action: u.action,
                                hasEagerState: u.hasEagerState,
                                eagerState: u.eagerState,
                                next: null,
                            }),
                                l === null ? ((c = l = f), (s = o)) : (l = l.next = f),
                                (V.lanes |= p),
                                (od |= p));
                        ((f = u.action),
                            Ko && n(o, f),
                            (o = u.hasEagerState ? u.eagerState : n(o, f)));
                    } else
                        ((p = {
                            lane: f,
                            revertLane: u.revertLane,
                            gesture: u.gesture,
                            action: u.action,
                            hasEagerState: u.hasEagerState,
                            eagerState: u.eagerState,
                            next: null,
                        }),
                            l === null ? ((c = l = p), (s = o)) : (l = l.next = p),
                            (V.lanes |= f),
                            (od |= f));
                    u = u.next;
                } while (u !== null && u !== t);
                if (
                    (l === null ? (s = o) : (l.next = c),
                    !Qr(o, e.memoizedState) && ((Pc = !0), d && ((n = Ba), n !== null)))
                )
                    throw n;
                ((e.memoizedState = o),
                    (e.baseState = s),
                    (e.baseQueue = l),
                    (r.lastRenderedState = o));
            }
            return (a === null && (r.lanes = 0), [e.memoizedState, r.dispatch]);
        }
        function hs(e) {
            var t = ss(),
                n = t.queue;
            if (n === null) throw Error(i(311));
            n.lastRenderedReducer = e;
            var r = n.dispatch,
                a = n.pending,
                o = t.memoizedState;
            if (a !== null) {
                n.pending = null;
                var s = (a = a.next);
                do ((o = e(o, s.action)), (s = s.next));
                while (s !== a);
                (Qr(o, t.memoizedState) || (Pc = !0),
                    (t.memoizedState = o),
                    t.baseQueue === null && (t.baseState = o),
                    (n.lastRenderedState = o));
            }
            return [o, r];
        }
        function gs(e, t, n) {
            var r = V,
                a = ss(),
                o = R;
            if (o) {
                if (n === void 0) throw Error(i(407));
                n = n();
            } else n = t();
            var s = !Qr((H || a).memoizedState, n);
            if (
                (s && ((a.memoizedState = n), (Pc = !0)),
                (a = a.queue),
                Vs(ys.bind(null, r, a, e), [e]),
                (e =
                    a.getSnapshot !== t ||
                    s ||
                    (Uo !== null && !!(Uo.memoizedState.tag & 1))),
                Is(e ? 9 : 8, { destroy: void 0 }, vs.bind(null, r, a, n, t), null),
                e)
            ) {
                if (((r.flags |= 2048), q === null)) throw Error(i(349));
                o || Ho & 127 || _s(r, t, n);
            }
            return n;
        }
        function _s(e, t, n) {
            ((e.flags |= 16384),
                (e = { getSnapshot: t, value: n }),
                (t = V.updateQueue),
                t === null
                    ? ((t = cs()), (V.updateQueue = t), (t.stores = [e]))
                    : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
        }
        function vs(e, t, n, r) {
            ((t.value = n), (t.getSnapshot = r), bs(t) && xs(e));
        }
        function ys(e, t, n) {
            return n(function () {
                bs(t) && xs(e);
            });
        }
        function bs(e) {
            var t = e.getSnapshot;
            e = e.value;
            try {
                var n = t();
                return !Qr(e, n);
            } catch {
                return !0;
            }
        }
        function xs(e) {
            var t = j(e, 2);
            t !== null && Pd(t, e, 2);
        }
        function Ss(e) {
            var t = os();
            if (typeof e == `function`) {
                var n = e;
                if (((e = n()), Ko)) {
                    lt(!0);
                    try {
                        n();
                    } finally {
                        lt(!1);
                    }
                }
            }
            return (
                (t.memoizedState = t.baseState = e),
                (t.queue = {
                    pending: null,
                    lanes: 0,
                    dispatch: null,
                    lastRenderedReducer: fs,
                    lastRenderedState: e,
                }),
                t
            );
        }
        function Cs(e, t, n, r) {
            return ((e.baseState = n), ms(e, H, typeof r == `function` ? r : fs));
        }
        function ws(e, t, n, r, a) {
            if (fc(e)) throw Error(i(485));
            if (((e = t.action), e !== null)) {
                var o = {
                    payload: a,
                    action: e,
                    next: null,
                    isTransition: !0,
                    status: `pending`,
                    value: null,
                    reason: null,
                    listeners: [],
                    then: function (e) {
                        o.listeners.push(e);
                    },
                };
                (w.T === null ? (o.isTransition = !1) : n(!0),
                    r(o),
                    (n = t.pending),
                    n === null
                        ? ((o.next = t.pending = o), Ts(t, o))
                        : ((o.next = n.next), (t.pending = n.next = o)));
            }
        }
        function Ts(e, t) {
            var n = t.action,
                r = t.payload,
                i = e.state;
            if (t.isTransition) {
                var a = w.T,
                    o = {};
                ((o.types = a === null ? null : a.types), (w.T = o));
                try {
                    var s = n(i, r),
                        c = w.S;
                    (c !== null && c(o, s), Es(e, t, s));
                } catch (n) {
                    Os(e, t, n);
                } finally {
                    (a !== null && o.types !== null && (a.types = o.types), (w.T = a));
                }
            } else
                try {
                    ((a = n(i, r)), Es(e, t, a));
                } catch (n) {
                    Os(e, t, n);
                }
        }
        function Es(e, t, n) {
            typeof n == `object` && n && typeof n.then == `function`
                ? n.then(
                      function (n) {
                          Ds(e, t, n);
                      },
                      function (n) {
                          return Os(e, t, n);
                      },
                  )
                : Ds(e, t, n);
        }
        function Ds(e, t, n) {
            ((t.status = `fulfilled`),
                (t.value = n),
                ks(t),
                (e.state = n),
                (t = e.pending),
                t !== null &&
                    ((n = t.next),
                    n === t
                        ? (e.pending = null)
                        : ((n = n.next), (t.next = n), Ts(e, n))));
        }
        function Os(e, t, n) {
            var r = e.pending;
            if (((e.pending = null), r !== null)) {
                r = r.next;
                do ((t.status = `rejected`), (t.reason = n), ks(t), (t = t.next));
                while (t !== r);
            }
            e.action = null;
        }
        function ks(e) {
            e = e.listeners;
            for (var t = 0; t < e.length; t++) (0, e[t])();
        }
        function As(e, t) {
            return t;
        }
        function js(e, t) {
            if (R) {
                var n = q.formState;
                if (n !== null) {
                    a: {
                        var r = V;
                        if (R) {
                            if (L) {
                                b: {
                                    for (var i = L, a = ca; i.nodeType !== 8;) {
                                        if (!a) {
                                            i = null;
                                            break b;
                                        }
                                        if (((i = lm(i.nextSibling)), i === null)) {
                                            i = null;
                                            break b;
                                        }
                                    }
                                    ((a = i.data),
                                        (i = a === `F!` || a === `F` ? i : null));
                                }
                                if (i) {
                                    ((L = lm(i.nextSibling)), (r = i.data === `F!`));
                                    break a;
                                }
                            }
                            ua(r);
                        }
                        r = !1;
                    }
                    r && (t = n[0]);
                }
            }
            return (
                (n = os()),
                (n.memoizedState = n.baseState = t),
                (r = {
                    pending: null,
                    lanes: 0,
                    dispatch: null,
                    lastRenderedReducer: As,
                    lastRenderedState: t,
                }),
                (n.queue = r),
                (n = lc.bind(null, V, r)),
                (r.dispatch = n),
                (r = Ss(!1)),
                (a = dc.bind(null, V, !1, r.queue)),
                (r = os()),
                (i = { state: t, dispatch: null, action: e, pending: null }),
                (r.queue = i),
                (n = ws.bind(null, V, i, a, n)),
                (i.dispatch = n),
                (r.memoizedState = e),
                [t, n, !1]
            );
        }
        function Ms(e) {
            return Ns(ss(), H, e);
        }
        function Ns(e, t, n) {
            if (
                ((t = ms(e, t, As)[0]),
                (e = ps(fs)[0]),
                typeof t == `object` && t && typeof t.then == `function`)
            )
                try {
                    var r = ls(t);
                } catch (e) {
                    throw e === Ya ? Za : e;
                }
            else r = t;
            t = ss();
            var i = t.queue,
                a = i.dispatch;
            return (
                n !== t.memoizedState &&
                    ((V.flags |= 2048),
                    Is(9, { destroy: void 0 }, Ps.bind(null, i, n), null)),
                [r, a, e]
            );
        }
        function Ps(e, t) {
            e.action = t;
        }
        function Fs(e) {
            var t = ss(),
                n = H;
            if (n !== null) return Ns(t, n, e);
            (ss(), (t = t.memoizedState), (n = ss()));
            var r = n.queue.dispatch;
            return ((n.memoizedState = e), [t, r, !1]);
        }
        function Is(e, t, n, r) {
            return (
                (e = { tag: e, create: n, deps: r, inst: t, next: null }),
                (t = V.updateQueue),
                t === null && ((t = cs()), (V.updateQueue = t)),
                (n = t.lastEffect),
                n === null
                    ? (t.lastEffect = e.next = e)
                    : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e)),
                e
            );
        }
        function Ls() {
            return ss().memoizedState;
        }
        function Rs(e, t, n, r) {
            var i = os();
            ((V.flags |= e),
                (i.memoizedState = Is(
                    1 | t,
                    { destroy: void 0 },
                    n,
                    r === void 0 ? null : r,
                )));
        }
        function zs(e, t, n, r) {
            var i = ss();
            r = r === void 0 ? null : r;
            var a = i.memoizedState.inst;
            H !== null && r !== null && Qo(r, H.memoizedState.deps)
                ? (i.memoizedState = Is(t, a, n, r))
                : ((V.flags |= e), (i.memoizedState = Is(1 | t, a, n, r)));
        }
        function Bs(e, t) {
            Rs(8390656, 8, e, t);
        }
        function Vs(e, t) {
            zs(2048, 8, e, t);
        }
        function Hs(e) {
            V.flags |= 4;
            var t = V.updateQueue;
            if (t === null) ((t = cs()), (V.updateQueue = t), (t.events = [e]));
            else {
                var n = t.events;
                n === null ? (t.events = [e]) : n.push(e);
            }
        }
        function Us(e) {
            var t = ss().memoizedState;
            return (
                Hs({ ref: t, nextImpl: e }),
                function () {
                    if (K & 2) throw Error(i(440));
                    return t.impl.apply(void 0, arguments);
                }
            );
        }
        function Ws(e, t) {
            return zs(4, 2, e, t);
        }
        function Gs(e, t) {
            return zs(4, 4, e, t);
        }
        function Ks(e, t) {
            if (typeof t == `function`) {
                e = e();
                var n = t(e);
                return function () {
                    typeof n == `function` ? n() : t(null);
                };
            }
            if (t != null)
                return (
                    (e = e()),
                    (t.current = e),
                    function () {
                        t.current = null;
                    }
                );
        }
        function qs(e, t, n) {
            ((n = n == null ? null : n.concat([e])), zs(4, 4, Ks.bind(null, t, e), n));
        }
        function Js() {}
        function Ys(e, t) {
            var n = ss();
            t = t === void 0 ? null : t;
            var r = n.memoizedState;
            return t !== null && Qo(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e);
        }
        function Xs(e, t) {
            var n = ss();
            t = t === void 0 ? null : t;
            var r = n.memoizedState;
            if (t !== null && Qo(t, r[1])) return r[0];
            if (((r = e()), Ko)) {
                lt(!0);
                try {
                    e();
                } finally {
                    lt(!1);
                }
            }
            return ((n.memoizedState = [r, t]), r);
        }
        function Zs(e, t, n) {
            return n === void 0 || (Ho & 1073741824 && !(Y & 261930))
                ? (e.memoizedState = t)
                : ((e.memoizedState = n), (e = Md()), (V.lanes |= e), (od |= e), n);
        }
        function Qs(e, t, n, r) {
            return Qr(n, t)
                ? n
                : Eo.current === null
                  ? !(Ho & 106) || (Ho & 1073741824 && !(Y & 261930))
                      ? ((Pc = !0), (e.memoizedState = n))
                      : ((e = Md()), (V.lanes |= e), (od |= e), t)
                  : ((e = Zs(e, n, r)), Qr(e, t) || (Pc = !0), e);
        }
        function $s(e, t, n, r, i) {
            var a = T.p;
            T.p = a !== 0 && 8 > a ? a : 8;
            var o = w.T,
                s = {};
            ((s.types = o === null ? null : o.types), (w.T = s), dc(e, !1, t, n));
            try {
                var c = i(),
                    l = w.S;
                (l !== null && l(s, c),
                    typeof c == `object` && c && typeof c.then == `function`
                        ? uc(e, t, Ua(c, r), jd(e))
                        : uc(e, t, r, jd(e)));
            } catch (n) {
                uc(e, t, { then: function () {}, status: `rejected`, reason: n }, jd());
            } finally {
                ((T.p = a),
                    o !== null && s.types !== null && (o.types = s.types),
                    (w.T = o));
            }
        }
        function ec() {}
        function tc(e, t, n, r) {
            if (e.tag !== 5) throw Error(i(476));
            var a = nc(e).queue;
            $s(
                e,
                a,
                t,
                De,
                n === null
                    ? ec
                    : function () {
                          return (rc(e), n(r));
                      },
            );
        }
        function nc(e) {
            var t = e.memoizedState;
            if (t !== null) return t;
            t = {
                memoizedState: De,
                baseState: De,
                baseQueue: null,
                queue: {
                    pending: null,
                    lanes: 0,
                    dispatch: null,
                    lastRenderedReducer: fs,
                    lastRenderedState: De,
                },
                next: null,
            };
            var n = {};
            return (
                (t.next = {
                    memoizedState: n,
                    baseState: n,
                    baseQueue: null,
                    queue: {
                        pending: null,
                        lanes: 0,
                        dispatch: null,
                        lastRenderedReducer: fs,
                        lastRenderedState: n,
                    },
                    next: null,
                }),
                (e.memoizedState = t),
                (e = e.alternate),
                e !== null && (e.memoizedState = t),
                t
            );
        }
        function rc(e) {
            var t = nc(e);
            (t.next === null && (t = e.alternate.memoizedState),
                uc(e, t.next.queue, {}, jd()));
        }
        function ic() {
            return z(sh);
        }
        function ac() {
            return ss().memoizedState;
        }
        function oc() {
            return ss().memoizedState;
        }
        function sc(e) {
            for (var t = e.return; t !== null;) {
                switch (t.tag) {
                    case 24:
                    case 3:
                        var n = jd();
                        e = _o(n);
                        var r = vo(t, e, n);
                        (r !== null && (Pd(r, t, n), yo(r, t, n)),
                            (t = { cache: Ma() }),
                            (e.payload = t));
                        return;
                }
                t = t.return;
            }
        }
        function cc(e, t, n) {
            var r = jd();
            ((n = {
                lane: r,
                revertLane: 0,
                gesture: null,
                action: n,
                hasEagerState: !1,
                eagerState: null,
                next: null,
            }),
                fc(e)
                    ? pc(t, n)
                    : ((n = Fi(e, t, n, r)), n !== null && (Pd(n, e, r), mc(n, t, r))));
        }
        function lc(e, t, n) {
            uc(e, t, n, jd());
        }
        function uc(e, t, n, r) {
            var i = {
                lane: r,
                revertLane: 0,
                gesture: null,
                action: n,
                hasEagerState: !1,
                eagerState: null,
                next: null,
            };
            if (fc(e)) pc(t, i);
            else {
                var a = e.alternate;
                if (
                    e.lanes === 0 &&
                    (a === null || a.lanes === 0) &&
                    ((a = t.lastRenderedReducer), a !== null)
                )
                    try {
                        var o = t.lastRenderedState,
                            s = a(o, n);
                        if (((i.hasEagerState = !0), (i.eagerState = s), Qr(s, o)))
                            return (Pi(e, t, i, 0), q === null && Ni(), !1);
                    } catch {}
                if (((n = Fi(e, t, i, r)), n !== null))
                    return (Pd(n, e, r), mc(n, t, r), !0);
            }
            return !1;
        }
        function dc(e, t, n, r) {
            if (
                ((r = {
                    lane: 2,
                    revertLane: Pf(),
                    gesture: null,
                    action: r,
                    hasEagerState: !1,
                    eagerState: null,
                    next: null,
                }),
                fc(e))
            ) {
                if (t) throw Error(i(479));
            } else ((t = Fi(e, n, r, 2)), t !== null && Pd(t, e, 2));
        }
        function fc(e) {
            var t = e.alternate;
            return e === V || (t !== null && t === V);
        }
        function pc(e, t) {
            Go = Wo = !0;
            var n = e.pending;
            (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)),
                (e.pending = t));
        }
        function mc(e, t, n) {
            if (n & 4194048) {
                var r = t.lanes;
                ((r &= e.pendingLanes), (n |= r), (t.lanes = n), Dt(e, n));
            }
        }
        var hc = {
                readContext: z,
                use: us,
                useCallback: Zo,
                useContext: Zo,
                useEffect: Zo,
                useImperativeHandle: Zo,
                useLayoutEffect: Zo,
                useInsertionEffect: Zo,
                useMemo: Zo,
                useReducer: Zo,
                useRef: Zo,
                useState: Zo,
                useDebugValue: Zo,
                useDeferredValue: Zo,
                useTransition: Zo,
                useSyncExternalStore: Zo,
                useId: Zo,
                useHostTransitionStatus: Zo,
                useFormState: Zo,
                useActionState: Zo,
                useOptimistic: Zo,
                useMemoCache: Zo,
                useCacheRefresh: Zo,
                useEffectEvent: Zo,
            },
            gc = {
                readContext: z,
                use: us,
                useCallback: function (e, t) {
                    return ((os().memoizedState = [e, t === void 0 ? null : t]), e);
                },
                useContext: z,
                useEffect: Bs,
                useImperativeHandle: function (e, t, n) {
                    ((n = n == null ? null : n.concat([e])),
                        Rs(4194308, 4, Ks.bind(null, t, e), n));
                },
                useLayoutEffect: function (e, t) {
                    return Rs(4194308, 4, e, t);
                },
                useInsertionEffect: function (e, t) {
                    Rs(4, 2, e, t);
                },
                useMemo: function (e, t) {
                    var n = os();
                    t = t === void 0 ? null : t;
                    var r = e();
                    if (Ko) {
                        lt(!0);
                        try {
                            e();
                        } finally {
                            lt(!1);
                        }
                    }
                    return ((n.memoizedState = [r, t]), r);
                },
                useReducer: function (e, t, n) {
                    var r = os();
                    if (n !== void 0) {
                        var i = n(t);
                        if (Ko) {
                            lt(!0);
                            try {
                                n(t);
                            } finally {
                                lt(!1);
                            }
                        }
                    } else i = t;
                    return (
                        (r.memoizedState = r.baseState = i),
                        (e = {
                            pending: null,
                            lanes: 0,
                            dispatch: null,
                            lastRenderedReducer: e,
                            lastRenderedState: i,
                        }),
                        (r.queue = e),
                        (e = e.dispatch = cc.bind(null, V, e)),
                        [r.memoizedState, e]
                    );
                },
                useRef: function (e) {
                    var t = os();
                    return ((e = { current: e }), (t.memoizedState = e));
                },
                useState: function (e) {
                    e = Ss(e);
                    var t = e.queue,
                        n = lc.bind(null, V, t);
                    return ((t.dispatch = n), [e.memoizedState, n]);
                },
                useDebugValue: Js,
                useDeferredValue: function (e, t) {
                    return Zs(os(), e, t);
                },
                useTransition: function () {
                    var e = Ss(!1);
                    return (
                        (e = $s.bind(null, V, e.queue, !0, !1)),
                        (os().memoizedState = e),
                        [!1, e]
                    );
                },
                useSyncExternalStore: function (e, t, n) {
                    var r = V,
                        a = os();
                    if (R) {
                        if (n === void 0) throw Error(i(407));
                        n = n();
                    } else {
                        if (((n = t()), q === null)) throw Error(i(349));
                        Y & 127 || _s(r, t, n);
                    }
                    a.memoizedState = n;
                    var o = { value: n, getSnapshot: t };
                    return (
                        (a.queue = o),
                        Bs(ys.bind(null, r, o, e), [e]),
                        (r.flags |= 2048),
                        Is(9, { destroy: void 0 }, vs.bind(null, r, o, n, t), null),
                        n
                    );
                },
                useId: function () {
                    var e = os(),
                        t = q.identifierPrefix;
                    if (R) {
                        var n = ta,
                            r = ea;
                        ((n = (r & ~(1 << (32 - ut(r) - 1))).toString(32) + n),
                            (t = `_` + t + `R_` + n),
                            (n = qo++),
                            0 < n && (t += `H` + n.toString(32)),
                            (t += `_`));
                    } else ((n = Xo++), (t = `_` + t + `r_` + n.toString(32) + `_`));
                    return (e.memoizedState = t);
                },
                useHostTransitionStatus: ic,
                useFormState: js,
                useActionState: js,
                useOptimistic: function (e) {
                    var t = os();
                    t.memoizedState = t.baseState = e;
                    var n = {
                        pending: null,
                        lanes: 0,
                        dispatch: null,
                        lastRenderedReducer: null,
                        lastRenderedState: null,
                    };
                    return (
                        (t.queue = n),
                        (t = dc.bind(null, V, !0, n)),
                        (n.dispatch = t),
                        [e, t]
                    );
                },
                useMemoCache: ds,
                useCacheRefresh: function () {
                    return (os().memoizedState = sc.bind(null, V));
                },
                useEffectEvent: function (e) {
                    var t = os(),
                        n = { impl: e };
                    return (
                        (t.memoizedState = n),
                        function () {
                            if (K & 2) throw Error(i(440));
                            return n.impl.apply(void 0, arguments);
                        }
                    );
                },
            },
            _c = {
                readContext: z,
                use: us,
                useCallback: Ys,
                useContext: z,
                useEffect: Vs,
                useImperativeHandle: qs,
                useInsertionEffect: Ws,
                useLayoutEffect: Gs,
                useMemo: Xs,
                useReducer: ps,
                useRef: Ls,
                useState: function () {
                    return ps(fs);
                },
                useDebugValue: Js,
                useDeferredValue: function (e, t) {
                    return Qs(ss(), H.memoizedState, e, t);
                },
                useTransition: function () {
                    var e = ps(fs)[0],
                        t = ss().memoizedState;
                    return [typeof e == `boolean` ? e : ls(e), t];
                },
                useSyncExternalStore: gs,
                useId: ac,
                useHostTransitionStatus: ic,
                useFormState: Ms,
                useActionState: Ms,
                useOptimistic: function (e, t) {
                    return Cs(ss(), H, e, t);
                },
                useMemoCache: ds,
                useCacheRefresh: oc,
                useEffectEvent: Us,
            },
            vc = {
                readContext: z,
                use: us,
                useCallback: Ys,
                useContext: z,
                useEffect: Vs,
                useImperativeHandle: qs,
                useInsertionEffect: Ws,
                useLayoutEffect: Gs,
                useMemo: Xs,
                useReducer: hs,
                useRef: Ls,
                useState: function () {
                    return hs(fs);
                },
                useDebugValue: Js,
                useDeferredValue: function (e, t) {
                    var n = ss();
                    return H === null ? Zs(n, e, t) : Qs(n, H.memoizedState, e, t);
                },
                useTransition: function () {
                    var e = hs(fs)[0],
                        t = ss().memoizedState;
                    return [typeof e == `boolean` ? e : ls(e), t];
                },
                useSyncExternalStore: gs,
                useId: ac,
                useHostTransitionStatus: ic,
                useFormState: Fs,
                useActionState: Fs,
                useOptimistic: function (e, t) {
                    var n = ss();
                    return H === null
                        ? ((n.baseState = e), [e, n.queue.dispatch])
                        : Cs(n, H, e, t);
                },
                useMemoCache: ds,
                useCacheRefresh: oc,
                useEffectEvent: Us,
            };
        function yc(e, t, n, r) {
            ((t = e.memoizedState),
                (n = n(r, t)),
                (n = n == null ? t : S({}, t, n)),
                (e.memoizedState = n),
                e.lanes === 0 && (e.updateQueue.baseState = n));
        }
        var bc = {
            enqueueSetState: function (e, t, n) {
                e = e._reactInternals;
                var r = jd(),
                    i = _o(r);
                ((i.payload = t),
                    n != null && (i.callback = n),
                    (t = vo(e, i, r)),
                    t !== null && (Pd(t, e, r), yo(t, e, r)));
            },
            enqueueReplaceState: function (e, t, n) {
                e = e._reactInternals;
                var r = jd(),
                    i = _o(r);
                ((i.tag = 1),
                    (i.payload = t),
                    n != null && (i.callback = n),
                    (t = vo(e, i, r)),
                    t !== null && (Pd(t, e, r), yo(t, e, r)));
            },
            enqueueForceUpdate: function (e, t) {
                e = e._reactInternals;
                var n = jd(),
                    r = _o(n);
                ((r.tag = 2),
                    t != null && (r.callback = t),
                    (t = vo(e, r, n)),
                    t !== null && (Pd(t, e, n), yo(t, e, n)));
            },
        };
        function xc(e, t, n, r, i, a, o) {
            return (
                (e = e.stateNode),
                typeof e.shouldComponentUpdate == `function`
                    ? e.shouldComponentUpdate(r, a, o)
                    : t.prototype && t.prototype.isPureReactComponent
                      ? !$r(n, r) || !$r(i, a)
                      : !0
            );
        }
        function Sc(e, t, n, r) {
            ((e = t.state),
                typeof t.componentWillReceiveProps == `function` &&
                    t.componentWillReceiveProps(n, r),
                typeof t.UNSAFE_componentWillReceiveProps == `function` &&
                    t.UNSAFE_componentWillReceiveProps(n, r),
                t.state !== e && bc.enqueueReplaceState(t, t.state, null));
        }
        function Cc(e, t) {
            var n = t;
            if (`ref` in t) for (var r in ((n = {}), t)) r !== `ref` && (n[r] = t[r]);
            if ((e = e.defaultProps))
                for (var i in (n === t && (n = S({}, n)), e))
                    n[i] === void 0 && (n[i] = e[i]);
            return n;
        }
        function wc(e) {
            ki(e);
        }
        function Tc(e) {
            console.error(e);
        }
        function Ec(e) {
            ki(e);
        }
        function Dc(e, t) {
            try {
                var n = e.onUncaughtError;
                n(t.value, { componentStack: t.stack });
            } catch (e) {
                setTimeout(function () {
                    throw e;
                });
            }
        }
        function Oc(e, t, n) {
            try {
                var r = e.onCaughtError;
                r(n.value, {
                    componentStack: n.stack,
                    errorBoundary: t.tag === 1 ? t.stateNode : null,
                });
            } catch (e) {
                setTimeout(function () {
                    throw e;
                });
            }
        }
        function kc(e, t, n) {
            return (
                (n = _o(n)),
                (n.tag = 3),
                (n.payload = { element: null }),
                (n.callback = function () {
                    Dc(e, t);
                }),
                n
            );
        }
        function Ac(e) {
            return ((e = _o(e)), (e.tag = 3), e);
        }
        function jc(e, t, n, r) {
            var i = n.type.getDerivedStateFromError;
            if (typeof i == `function`) {
                var a = r.value;
                ((e.payload = function () {
                    return i(a);
                }),
                    (e.callback = function () {
                        Oc(t, n, r);
                    }));
            }
            var o = n.stateNode;
            o !== null &&
                typeof o.componentDidCatch == `function` &&
                (e.callback = function () {
                    (Oc(t, n, r),
                        typeof i != `function` &&
                            (vd === null ? (vd = new Set([this])) : vd.add(this)));
                    var e = r.stack;
                    this.componentDidCatch(r.value, {
                        componentStack: e === null ? `` : e,
                    });
                });
        }
        function Mc(e, t, n, r, a) {
            if (
                ((n.flags |= 32768),
                typeof r == `object` && r && typeof r.then == `function`)
            ) {
                if (
                    ((t = n.alternate),
                    t !== null && wa(t, n, a, !0),
                    (n = jo.current),
                    n !== null)
                ) {
                    switch (n.tag) {
                        case 31:
                        case 13:
                        case 19:
                            return (
                                Mo === null
                                    ? Kd()
                                    : n.alternate === null && ad === 0 && (ad = 3),
                                (n.flags &= -257),
                                (n.flags |= 65536),
                                (n.lanes = a),
                                r === Qa
                                    ? (n.flags |= 16384)
                                    : ((t = n.updateQueue),
                                      t === null
                                          ? (n.updateQueue = new Set([r]))
                                          : t.add(r),
                                      mf(e, r, a)),
                                !1
                            );
                        case 22:
                            return (
                                (n.flags |= 65536),
                                r === Qa
                                    ? (n.flags |= 16384)
                                    : ((t = n.updateQueue),
                                      t === null
                                          ? ((t = {
                                                transitions: null,
                                                markerInstances: null,
                                                retryQueue: new Set([r]),
                                            }),
                                            (n.updateQueue = t))
                                          : ((n = t.retryQueue),
                                            n === null
                                                ? (t.retryQueue = new Set([r]))
                                                : n.add(r)),
                                      mf(e, r, a)),
                                !1
                            );
                    }
                    throw Error(i(435, n.tag));
                }
                return (mf(e, r, a), Kd(), !1);
            }
            if (R)
                return (
                    (t = jo.current),
                    t === null
                        ? (r !== la &&
                              ((t = Error(i(423), { cause: r })), ga(Yi(t, n))),
                          (e = e.current.alternate),
                          (e.flags |= 65536),
                          (a &= -a),
                          (e.lanes |= a),
                          (r = Yi(r, n)),
                          (a = kc(e.stateNode, r, a)),
                          bo(e, a),
                          ad !== 4 && (ad = 2))
                        : (!(t.flags & 65536) && (t.flags |= 256),
                          (t.flags |= 65536),
                          (t.lanes = a),
                          r !== la &&
                              ((e = Error(i(422), { cause: r })), ga(Yi(e, n)))),
                    !1
                );
            var o = Error(i(520), { cause: r });
            if (
                ((o = Yi(o, n)),
                dd === null ? (dd = [o]) : dd.push(o),
                ad !== 4 && (ad = 2),
                t === null)
            )
                return !0;
            ((r = Yi(r, n)), (n = t));
            do {
                switch (n.tag) {
                    case 3:
                        return (
                            (n.flags |= 65536),
                            (e = a & -a),
                            (n.lanes |= e),
                            (e = kc(n.stateNode, r, e)),
                            bo(n, e),
                            !1
                        );
                    case 1:
                        if (
                            ((t = n.type),
                            (o = n.stateNode),
                            !(n.flags & 128) &&
                                (typeof t.getDerivedStateFromError == `function` ||
                                    (o !== null &&
                                        typeof o.componentDidCatch == `function` &&
                                        (vd === null || !vd.has(o)))))
                        )
                            return (
                                (n.flags |= 65536),
                                (a &= -a),
                                (n.lanes |= a),
                                (a = Ac(a)),
                                jc(a, e, n, r),
                                bo(n, a),
                                !1
                            );
                        break;
                    case 22:
                        if (n.memoizedState !== null) return ((n.flags |= 65536), !1);
                }
                n = n.return;
            } while (n !== null);
            return !1;
        }
        var Nc = Error(i(461)),
            Pc = !1;
        function Fc(e, t, n, r) {
            t.child = e === null ? po(t, null, n, r) : fo(t, e.child, n, r);
        }
        function Ic(e, t, n, r, i) {
            n = n.render;
            var a = t.ref;
            if (`ref` in r) {
                var o = {};
                for (var s in r) s !== `ref` && (o[s] = r[s]);
            } else o = r;
            return (
                Ea(t),
                (r = $o(e, t, n, o, a, i)),
                (s = rs()),
                e !== null && !Pc
                    ? (is(e, t, i), ul(e, t, i))
                    : (R && s && ia(t), (t.flags |= 1), Fc(e, t, r, i), t.child)
            );
        }
        function Lc(e, t, n, r, i) {
            if (e === null) {
                var a = n.type;
                return typeof a == `function` &&
                    !Bi(a) &&
                    a.defaultProps === void 0 &&
                    n.compare === null
                    ? ((t.tag = 15), (t.type = a), Rc(e, t, a, r, i))
                    : ((e = Ui(n.type, null, r, t, t.mode, i)),
                      (e.ref = t.ref),
                      (e.return = t),
                      (t.child = e));
            }
            if (((a = e.child), !dl(e, i))) {
                var o = a.memoizedProps;
                if (
                    ((n = n.compare),
                    (n = n === null ? $r : n),
                    n(o, r) && e.ref === t.ref)
                )
                    return ul(e, t, i);
            }
            return (
                (t.flags |= 1),
                (e = Vi(a, r)),
                (e.ref = t.ref),
                (e.return = t),
                (t.child = e)
            );
        }
        function Rc(e, t, n, r, i) {
            if (e !== null) {
                var a = e.memoizedProps;
                if ($r(a, r) && e.ref === t.ref) {
                    if (((Pc = !1), (t.pendingProps = r = a), dl(e, i)))
                        e.flags & 131072 && (Pc = !0);
                    else return ((t.lanes = e.lanes), ul(e, t, i));
                }
            }
            return Kc(e, t, n, r, i);
        }
        function zc(e, t, n, r) {
            var i = r.children,
                a = e === null ? null : e.memoizedState;
            if (
                (e === null &&
                    t.stateNode === null &&
                    (t.stateNode = {
                        _visibility: 1,
                        _pendingMarkers: null,
                        _retryCache: null,
                        _transitions: null,
                    }),
                r.mode === `hidden`)
            ) {
                if (t.flags & 128) {
                    if (((a = a === null ? n : a.baseLanes | n), e !== null)) {
                        for (r = t.child = e.child, i = 0; r !== null;)
                            ((i = i | r.lanes | r.childLanes), (r = r.sibling));
                        r = i & ~a;
                    } else ((r = 0), (t.child = null));
                    return Vc(e, t, a, n, r);
                }
                if (n & 536870912)
                    ((t.memoizedState = { baseLanes: 0, cachePool: null }),
                        e !== null && qa(t, a === null ? null : a.cachePool),
                        a === null ? ko() : Oo(t, a),
                        Fo(t));
                else
                    return (
                        (r = t.lanes = 536870912),
                        Vc(e, t, a === null ? n : a.baseLanes | n, n, r)
                    );
            } else
                a === null
                    ? (e !== null && qa(t, null), ko(), Io())
                    : (qa(t, a.cachePool), Oo(t, a), Io(), (t.memoizedState = null));
            return (Fc(e, t, i, n), t.child);
        }
        function Bc(e, t) {
            return (
                (e !== null && e.tag === 22) ||
                    t.stateNode !== null ||
                    (t.stateNode = {
                        _visibility: 1,
                        _pendingMarkers: null,
                        _retryCache: null,
                        _transitions: null,
                    }),
                t.sibling
            );
        }
        function Vc(e, t, n, r, i) {
            var a = Ka();
            return (
                (a = a === null ? null : { parent: B._currentValue, pool: a }),
                (t.memoizedState = { baseLanes: n, cachePool: a }),
                e !== null && qa(t, null),
                ko(),
                Fo(t),
                e !== null && wa(e, t, r, !0),
                (t.childLanes = i),
                null
            );
        }
        function Hc(e, t) {
            return (
                (t = tl({ mode: t.mode, children: t.children }, e.mode)),
                (t.ref = e.ref),
                (e.child = t),
                (t.return = e),
                t
            );
        }
        function Uc(e, t, n) {
            return (
                fo(t, e.child, null, n),
                (e = Hc(t, t.pendingProps)),
                (e.flags |= 2),
                Lo(t),
                (t.memoizedState = null),
                e
            );
        }
        function Wc(e, t, n) {
            var r = t.pendingProps,
                a = !!(t.flags & 128);
            if (((t.flags &= -129), e === null)) {
                if (R) {
                    if (r.mode === `hidden`)
                        return (
                            (e = Hc(t, r)),
                            (t.lanes = 536870912),
                            (e.memoizedState = { baseLanes: 0, cachePool: null }),
                            Bc(null, e)
                        );
                    if (
                        (Po(t),
                        (e = L)
                            ? ((e = am(e, ca)),
                              (e = e !== null && e.data === `&` ? e : null),
                              e !== null &&
                                  ((t.memoizedState = {
                                      dehydrated: e,
                                      treeContext:
                                          $i === null ? null : { id: ea, overflow: ta },
                                      retryLane: 536870912,
                                      hydrationErrors: null,
                                  }),
                                  (n = Ki(e)),
                                  (n.return = t),
                                  (t.child = n),
                                  (I = t),
                                  (L = null)))
                            : (e = null),
                        e === null)
                    )
                        throw ua(t);
                    return ((t.lanes = 536870912), null);
                }
                return Hc(t, r);
            }
            var o = e.memoizedState;
            if (o !== null) {
                var s = o.dehydrated;
                if ((Po(t), a)) {
                    if (t.flags & 256) ((t.flags &= -257), (t = Uc(e, t, n)));
                    else if (t.memoizedState !== null)
                        ((t.child = e.child), (t.flags |= 128), (t = null));
                    else throw Error(i(558));
                } else if (
                    (Pc || wa(e, t, n, !1), (a = (n & e.childLanes) !== 0), Pc || a)
                ) {
                    if (Eo.current === null) {
                        if (
                            ((r = q),
                            r !== null &&
                                ((s = Ot(r, n)), s !== 0 && s !== o.retryLane))
                        )
                            throw ((o.retryLane = s), j(e, s), Pd(r, e, s), Nc);
                        Kd();
                    }
                    t = Uc(e, t, n);
                } else
                    ((e = o.treeContext),
                        (L = lm(s.nextSibling)),
                        (I = t),
                        (R = !0),
                        (sa = null),
                        (ca = !1),
                        e !== null && oa(t, e),
                        (t = Hc(t, r)),
                        (t.flags |= 134221824));
                return t;
            }
            return (
                (e = Vi(e.child, { mode: r.mode, children: r.children })),
                (e.ref = t.ref),
                (t.child = e),
                (e.return = t),
                e
            );
        }
        function Gc(e, t) {
            var n = t.ref;
            if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
            else {
                if (typeof n != `function` && typeof n != `object`) throw Error(i(284));
                (e === null || e.ref !== n) && (t.flags |= 4194816);
            }
        }
        function Kc(e, t, n, r, i) {
            return (
                Ea(t),
                (n = $o(e, t, n, r, void 0, i)),
                (r = rs()),
                e !== null && !Pc
                    ? (is(e, t, i), ul(e, t, i))
                    : (R && r && ia(t), (t.flags |= 1), Fc(e, t, n, i), t.child)
            );
        }
        function qc(e, t, n, r, i, a) {
            return (
                Ea(t),
                (t.updateQueue = null),
                (n = ts(t, r, n, i)),
                es(e),
                (r = rs()),
                e !== null && !Pc
                    ? (is(e, t, a), ul(e, t, a))
                    : (R && r && ia(t), (t.flags |= 1), Fc(e, t, n, a), t.child)
            );
        }
        function Jc(e, t, n, r, i) {
            if ((Ea(t), t.stateNode === null)) {
                var a = Li,
                    o = n.contextType;
                (typeof o == `object` && o && (a = z(o)),
                    (a = new n(r, a)),
                    (t.memoizedState =
                        a.state !== null && a.state !== void 0 ? a.state : null),
                    (a.updater = bc),
                    (t.stateNode = a),
                    (a._reactInternals = t),
                    (a = t.stateNode),
                    (a.props = r),
                    (a.state = t.memoizedState),
                    (a.refs = {}),
                    ho(t),
                    (o = n.contextType),
                    (a.context = typeof o == `object` && o ? z(o) : Li),
                    (a.state = t.memoizedState),
                    (o = n.getDerivedStateFromProps),
                    typeof o == `function` &&
                        (yc(t, n, o, r), (a.state = t.memoizedState)),
                    typeof n.getDerivedStateFromProps == `function` ||
                        typeof a.getSnapshotBeforeUpdate == `function` ||
                        (typeof a.UNSAFE_componentWillMount != `function` &&
                            typeof a.componentWillMount != `function`) ||
                        ((o = a.state),
                        typeof a.componentWillMount == `function` &&
                            a.componentWillMount(),
                        typeof a.UNSAFE_componentWillMount == `function` &&
                            a.UNSAFE_componentWillMount(),
                        o !== a.state && bc.enqueueReplaceState(a, a.state, null),
                        Co(t, r, a, i),
                        So(),
                        (a.state = t.memoizedState)),
                    typeof a.componentDidMount == `function` && (t.flags |= 4194308),
                    (r = !0));
            } else if (e === null) {
                a = t.stateNode;
                var s = t.memoizedProps,
                    c = Cc(n, s);
                a.props = c;
                var l = a.context,
                    u = n.contextType;
                ((o = Li), typeof u == `object` && u && (o = z(u)));
                var d = n.getDerivedStateFromProps;
                ((u =
                    typeof d == `function` ||
                    typeof a.getSnapshotBeforeUpdate == `function`),
                    (s = t.pendingProps !== s),
                    u ||
                        (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
                            typeof a.componentWillReceiveProps != `function`) ||
                        ((s || l !== o) && Sc(t, a, r, o)),
                    (mo = !1));
                var f = t.memoizedState;
                ((a.state = f),
                    Co(t, r, a, i),
                    So(),
                    (l = t.memoizedState),
                    s || f !== l || mo
                        ? (typeof d == `function` &&
                              (yc(t, n, d, r), (l = t.memoizedState)),
                          (c = mo || xc(t, n, c, r, f, l, o))
                              ? (u ||
                                    (typeof a.UNSAFE_componentWillMount != `function` &&
                                        typeof a.componentWillMount != `function`) ||
                                    (typeof a.componentWillMount == `function` &&
                                        a.componentWillMount(),
                                    typeof a.UNSAFE_componentWillMount == `function` &&
                                        a.UNSAFE_componentWillMount()),
                                typeof a.componentDidMount == `function` &&
                                    (t.flags |= 4194308))
                              : (typeof a.componentDidMount == `function` &&
                                    (t.flags |= 4194308),
                                (t.memoizedProps = r),
                                (t.memoizedState = l)),
                          (a.props = r),
                          (a.state = l),
                          (a.context = o),
                          (r = c))
                        : (typeof a.componentDidMount == `function` &&
                              (t.flags |= 4194308),
                          (r = !1)));
            } else {
                ((a = t.stateNode),
                    go(e, t),
                    (o = t.memoizedProps),
                    (u = Cc(n, o)),
                    (a.props = u),
                    (d = t.pendingProps),
                    (f = a.context),
                    (l = n.contextType),
                    (c = Li),
                    typeof l == `object` && l && (c = z(l)),
                    (s = n.getDerivedStateFromProps),
                    (l =
                        typeof s == `function` ||
                        typeof a.getSnapshotBeforeUpdate == `function`) ||
                        (typeof a.UNSAFE_componentWillReceiveProps != `function` &&
                            typeof a.componentWillReceiveProps != `function`) ||
                        ((o !== d || f !== c) && Sc(t, a, r, c)),
                    (mo = !1),
                    (f = t.memoizedState),
                    (a.state = f),
                    Co(t, r, a, i),
                    So());
                var p = t.memoizedState;
                o !== d ||
                f !== p ||
                mo ||
                (e !== null && e.dependencies !== null && Ta(e.dependencies))
                    ? (typeof s == `function` &&
                          (yc(t, n, s, r), (p = t.memoizedState)),
                      (u =
                          mo ||
                          xc(t, n, u, r, f, p, c) ||
                          (e !== null && e.dependencies !== null && Ta(e.dependencies)))
                          ? (l ||
                                (typeof a.UNSAFE_componentWillUpdate != `function` &&
                                    typeof a.componentWillUpdate != `function`) ||
                                (typeof a.componentWillUpdate == `function` &&
                                    a.componentWillUpdate(r, p, c),
                                typeof a.UNSAFE_componentWillUpdate == `function` &&
                                    a.UNSAFE_componentWillUpdate(r, p, c)),
                            typeof a.componentDidUpdate == `function` && (t.flags |= 4),
                            typeof a.getSnapshotBeforeUpdate == `function` &&
                                (t.flags |= 1024))
                          : (typeof a.componentDidUpdate != `function` ||
                                (o === e.memoizedProps && f === e.memoizedState) ||
                                (t.flags |= 4),
                            typeof a.getSnapshotBeforeUpdate != `function` ||
                                (o === e.memoizedProps && f === e.memoizedState) ||
                                (t.flags |= 1024),
                            (t.memoizedProps = r),
                            (t.memoizedState = p)),
                      (a.props = r),
                      (a.state = p),
                      (a.context = c),
                      (r = u))
                    : (typeof a.componentDidUpdate != `function` ||
                          (o === e.memoizedProps && f === e.memoizedState) ||
                          (t.flags |= 4),
                      typeof a.getSnapshotBeforeUpdate != `function` ||
                          (o === e.memoizedProps && f === e.memoizedState) ||
                          (t.flags |= 1024),
                      (r = !1));
            }
            return (
                (a = r),
                Gc(e, t),
                (r = !!(t.flags & 128)),
                a || r
                    ? ((a = t.stateNode),
                      (n =
                          r && typeof n.getDerivedStateFromError != `function`
                              ? null
                              : a.render()),
                      (t.flags |= 1),
                      e !== null && r
                          ? ((t.child = fo(t, e.child, null, i)),
                            (t.child = fo(t, null, n, i)))
                          : Fc(e, t, n, i),
                      (t.memoizedState = a.state),
                      (e = t.child))
                    : (e = ul(e, t, i)),
                e
            );
        }
        function Yc(e, t, n, r) {
            return (ma(), (t.flags |= 256), Fc(e, t, n, r), t.child);
        }
        var Xc = {
            dehydrated: null,
            treeContext: null,
            retryLane: 0,
            hydrationErrors: null,
        };
        function Zc(e) {
            return { baseLanes: e, cachePool: Ja() };
        }
        function Qc(e, t, n) {
            return ((e = e === null ? 0 : e.childLanes & ~n), t && (e |= ld), e);
        }
        function $c(e, t, n) {
            var r = t.pendingProps,
                i = !1,
                a = !!(t.flags & 128),
                o;
            if (
                ((o = a) ||
                    (o =
                        e !== null && e.memoizedState === null
                            ? !1
                            : !!(Ro.current & 2)),
                o && ((i = !0), (t.flags &= -129)),
                (o = !!(t.flags & 32)),
                (t.flags &= -33),
                e === null)
            ) {
                if (R) {
                    if (
                        (i ? No(t) : Io(),
                        (e = L)
                            ? ((e = am(e, ca)),
                              (e = e !== null && e.data !== `&` ? e : null),
                              e !== null &&
                                  ((t.memoizedState = {
                                      dehydrated: e,
                                      treeContext:
                                          $i === null ? null : { id: ea, overflow: ta },
                                      retryLane: 536870912,
                                      hydrationErrors: null,
                                  }),
                                  (n = Ki(e)),
                                  (n.return = t),
                                  (t.child = n),
                                  (I = t),
                                  (L = null)))
                            : (e = null),
                        e === null)
                    )
                        throw ua(t);
                    return ((t.lanes = sm(e) ? 32 : 536870912), null);
                }
                return (
                    (a = r.children),
                    (r = r.fallback),
                    i
                        ? (Io(),
                          (i = t.mode),
                          (a = tl({ mode: `hidden`, children: a }, i)),
                          (r = Wi(r, i, n, null)),
                          (a.return = t),
                          (r.return = t),
                          (a.sibling = r),
                          (t.child = a),
                          (r = t.child),
                          (r.memoizedState = Zc(n)),
                          (r.childLanes = Qc(e, o, n)),
                          (t.memoizedState = Xc),
                          Bc(null, r))
                        : (No(t), el(t, a))
                );
            }
            var s = e.memoizedState;
            if (s !== null) {
                var c = s.dehydrated;
                if (c !== null) return rl(e, t, a, o, r, c, s, n);
            }
            return i
                ? (Io(),
                  (i = r.fallback),
                  (a = t.mode),
                  (s = e.child),
                  (c = s.sibling),
                  (r = Vi(s, { mode: `hidden`, children: r.children })),
                  (r.subtreeFlags = s.subtreeFlags & 1206910976),
                  c === null
                      ? ((i = Wi(i, a, n, null)), (i.flags |= 2))
                      : (i = Vi(c, i)),
                  (i.return = t),
                  (r.return = t),
                  (r.sibling = i),
                  (t.child = r),
                  Bc(null, r),
                  (r = t.child),
                  (i = e.child.memoizedState),
                  i === null
                      ? (i = Zc(n))
                      : ((a = i.cachePool),
                        a === null
                            ? (a = Ja())
                            : ((s = B._currentValue),
                              (a = a.parent === s ? a : { parent: s, pool: s })),
                        (i = { baseLanes: i.baseLanes | n, cachePool: a })),
                  (r.memoizedState = i),
                  (r.childLanes = Qc(e, o, n)),
                  (t.memoizedState = Xc),
                  Bc(e.child, r))
                : (No(t),
                  (n = e.child),
                  (e = n.sibling),
                  (n = Vi(n, { mode: `visible`, children: r.children })),
                  (n.return = t),
                  (n.sibling = null),
                  e !== null &&
                      ((o = t.deletions),
                      o === null ? ((t.deletions = [e]), (t.flags |= 16)) : o.push(e)),
                  (t.child = n),
                  (t.memoizedState = null),
                  n);
        }
        function el(e, t) {
            return (
                (t = tl({ mode: `visible`, children: t }, e.mode)),
                (t.return = e),
                (e.child = t)
            );
        }
        function tl(e, t) {
            return ((e = zi(22, e, null, t)), (e.lanes = 0), e);
        }
        function nl(e, t, n) {
            return (
                fo(t, e.child, null, n),
                (e = el(t, t.pendingProps.children)),
                (e.flags |= 2),
                (t.memoizedState = null),
                e
            );
        }
        function rl(e, t, n, r, a, o, s, c) {
            if (n)
                return t.flags & 256
                    ? (No(t), (t.flags &= -257), nl(e, t, c))
                    : t.memoizedState === null
                      ? (Io(),
                        (o = a.fallback),
                        (s = t.mode),
                        (a = tl({ mode: `visible`, children: a.children }, s)),
                        (o = Wi(o, s, c, null)),
                        (o.flags |= 2),
                        (a.return = t),
                        (o.return = t),
                        (a.sibling = o),
                        (t.child = a),
                        fo(t, e.child, null, c),
                        (a = t.child),
                        (a.memoizedState = Zc(c)),
                        (a.childLanes = Qc(e, r, c)),
                        (t.memoizedState = Xc),
                        Bc(null, a))
                      : (Io(), (t.child = e.child), (t.flags |= 128), null);
            if ((No(t), sm(o))) {
                if (((r = o.nextSibling && o.nextSibling.dataset), r)) var l = r.dgst;
                return (
                    (r = l),
                    r !== `` &&
                        ((a = Error(i(419))),
                        (a.stack = ``),
                        (a.digest = r),
                        ga({ value: a, source: null, stack: null })),
                    nl(e, t, c)
                );
            }
            if ((Pc || wa(e, t, c, !1), (r = (c & e.childLanes) !== 0), Pc || r)) {
                if (Eo.current !== null) return nl(e, t, c);
                if (
                    ((r = q),
                    r !== null && ((a = Ot(r, c)), a !== 0 && a !== s.retryLane))
                )
                    throw ((s.retryLane = a), j(e, a), Pd(r, e, a), Nc);
                return (om(o) || Kd(), nl(e, t, c));
            }
            return om(o)
                ? ((t.flags |= 192), (t.child = e.child), null)
                : ((e = s.treeContext),
                  (L = lm(o.nextSibling)),
                  (I = t),
                  (R = !0),
                  (sa = null),
                  (ca = !1),
                  e !== null && oa(t, e),
                  (t = el(t, a.children)),
                  (t.flags |= 134221824),
                  t);
        }
        function il(e, t, n) {
            e.lanes |= t;
            var r = e.alternate;
            (r !== null && (r.lanes |= t), Sa(e.return, t, n));
        }
        function al(e) {
            for (var t = null; e !== null;) {
                var n = e.alternate;
                (n !== null && Vo(n) === null && (t = e), (e = e.sibling));
            }
            return t;
        }
        function ol(e, t, n, r, i, a) {
            var o = e.memoizedState;
            o === null
                ? (e.memoizedState = {
                      isBackwards: t,
                      rendering: null,
                      renderingStartTime: 0,
                      last: r,
                      tail: n,
                      tailMode: i,
                      treeForkCount: a,
                  })
                : ((o.isBackwards = t),
                  (o.rendering = null),
                  (o.renderingStartTime = 0),
                  (o.last = r),
                  (o.tail = n),
                  (o.tailMode = i),
                  (o.treeForkCount = a));
        }
        function sl(e) {
            var t = e.child;
            for (e.child = null; t !== null;) {
                var n = t.sibling;
                ((t.sibling = e.child), (e.child = t), (t = n));
            }
        }
        function cl(e, t, n) {
            var r = t.pendingProps,
                i = r.revealOrder,
                a = r.tail;
            r = r.children;
            var o = Ro.current;
            if (t.flags & 128) return (zo(t, o), null);
            var s = !!(o & 2);
            if (
                (s ? ((o = (o & 1) | 2), (t.flags |= 128)) : (o &= 1),
                zo(t, o),
                i === `backwards` && e !== null
                    ? (sl(e), Fc(e, t, r, n), sl(e))
                    : Fc(e, t, r, n),
                (r = R ? P : 0),
                !s && e !== null && e.flags & 128)
            )
                a: for (e = t.child; e !== null;) {
                    if (e.tag === 13) e.memoizedState !== null && il(e, n, t);
                    else if (e.tag === 19) il(e, n, t);
                    else if (e.child !== null) {
                        ((e.child.return = e), (e = e.child));
                        continue;
                    }
                    if (e === t) break a;
                    for (; e.sibling === null;) {
                        if (e.return === null || e.return === t) break a;
                        e = e.return;
                    }
                    ((e.sibling.return = e.return), (e = e.sibling));
                }
            switch (i) {
                case `backwards`:
                    ((n = al(t.child)),
                        n === null
                            ? ((i = t.child), (t.child = null))
                            : ((i = n.sibling), (n.sibling = null), sl(t)),
                        ol(t, !0, i, null, a, r));
                    break;
                case `unstable_legacy-backwards`:
                    for (n = null, i = t.child, t.child = null; i !== null;) {
                        if (((e = i.alternate), e !== null && Vo(e) === null)) {
                            t.child = i;
                            break;
                        }
                        ((e = i.sibling), (i.sibling = n), (n = i), (i = e));
                    }
                    ol(t, !0, n, null, a, r);
                    break;
                case `together`:
                    ol(t, !1, null, null, void 0, r);
                    break;
                case `independent`:
                    t.memoizedState = null;
                    break;
                default:
                    ((n = al(t.child)),
                        n === null
                            ? ((i = t.child), (t.child = null))
                            : ((i = n.sibling), (n.sibling = null)),
                        ol(t, !1, i, n, a, r));
            }
            return t.child;
        }
        function ll(e, t, n) {
            var r = t.pendingProps;
            return (ba(t, t.type, r.value), Fc(e, t, r.children, n), t.child);
        }
        function ul(e, t, n) {
            if (
                (e !== null && (t.dependencies = e.dependencies),
                (od |= t.lanes),
                (n & t.childLanes) === 0)
            ) {
                if (e !== null) {
                    if ((wa(e, t, n, !1), (n & t.childLanes) === 0)) return null;
                } else return null;
            }
            if (e !== null && t.child !== e.child) throw Error(i(153));
            if (t.child !== null) {
                for (
                    e = t.child, n = Vi(e, e.pendingProps), t.child = n, n.return = t;
                    e.sibling !== null;
                )
                    ((e = e.sibling),
                        (n = n.sibling = Vi(e, e.pendingProps)),
                        (n.return = t));
                n.sibling = null;
            }
            return t.child;
        }
        function dl(e, t) {
            return (
                (e.lanes & t) !== 0 || ((e = e.dependencies), !!(e !== null && Ta(e)))
            );
        }
        function fl(e, t, n) {
            switch (t.tag) {
                case 3:
                    (Ie(t, t.stateNode.containerInfo),
                        ba(t, B, e.memoizedState.cache),
                        ma());
                    break;
                case 27:
                case 5:
                    Re(t);
                    break;
                case 4:
                    Ie(t, t.stateNode.containerInfo);
                    break;
                case 10:
                    ba(t, t.type, t.memoizedProps.value);
                    break;
                case 31:
                    if (t.memoizedState !== null)
                        return ((t.flags |= 128), Po(t), null);
                    break;
                case 13:
                    var r = t.memoizedState;
                    if (r !== null) {
                        if (r.dehydrated !== null)
                            return (No(t), (t.flags |= 128), null);
                        r = wa(e, t, n, !1);
                        var i = t.child.childLanes;
                        return r || (n & i) !== 0
                            ? $c(e, t, n)
                            : (No(t), (e = ul(e, t, n)), e === null ? null : e.sibling);
                    }
                    No(t);
                    break;
                case 19:
                    if (t.flags & 128) return cl(e, t, n);
                    if (
                        ((i = !!(e.flags & 128)),
                        (r = (n & t.childLanes) !== 0),
                        (r ||= (wa(e, t, n, !1), (n & t.childLanes) !== 0)),
                        i)
                    ) {
                        if (r) return cl(e, t, n);
                        t.flags |= 128;
                    }
                    if (
                        ((i = t.memoizedState),
                        i !== null &&
                            ((i.rendering = null),
                            (i.tail = null),
                            (i.lastEffect = null)),
                        zo(t, Ro.current),
                        r)
                    )
                        break;
                    return null;
                case 22:
                    return ((t.lanes = 0), zc(e, t, n, t.pendingProps));
                case 24:
                    ba(t, B, e.memoizedState.cache);
            }
            return ul(e, t, n);
        }
        function pl(e, t, n) {
            if (e !== null) {
                if (e.memoizedProps !== t.pendingProps) Pc = !0;
                else {
                    if (!dl(e, n) && !(t.flags & 128)) return ((Pc = !1), fl(e, t, n));
                    Pc = !!(e.flags & 131072);
                }
            } else ((Pc = !1), R && t.flags & 1048576 && ra(t, P, t.index));
            switch (((t.lanes = 0), t.tag)) {
                case 16:
                    a: {
                        var r = t.pendingProps;
                        if (
                            ((e = to(t.elementType)),
                            (t.type = e),
                            typeof e == `function`)
                        )
                            Bi(e)
                                ? ((r = Cc(e, r)),
                                  (t.tag = 1),
                                  (t = Jc(null, t, e, r, n)))
                                : ((t.tag = 0), (t = Kc(null, t, e, r, n)));
                        else {
                            if (e != null) {
                                var a = e.$$typeof;
                                if (a === fe) {
                                    ((t.tag = 11), (t = Ic(null, t, e, r, n)));
                                    break a;
                                }
                                if (a === he) {
                                    ((t.tag = 14), (t = Lc(null, t, e, r, n)));
                                    break a;
                                }
                                if (a === C) {
                                    ((t.tag = 10), (t.type = e), (t = ll(null, t, n)));
                                    break a;
                                }
                            }
                            throw ((t = Te(e) || e), Error(i(306, t, ``)));
                        }
                    }
                    return t;
                case 0:
                    return Kc(e, t, t.type, t.pendingProps, n);
                case 1:
                    return (
                        (r = t.type),
                        (a = Cc(r, t.pendingProps)),
                        Jc(e, t, r, a, n)
                    );
                case 3:
                    a: {
                        if ((Ie(t, t.stateNode.containerInfo), e === null))
                            throw Error(i(387));
                        r = t.pendingProps;
                        var o = t.memoizedState;
                        ((a = o.element), go(e, t), Co(t, r, null, n));
                        var s = t.memoizedState;
                        if (
                            ((r = s.cache),
                            ba(t, B, r),
                            r !== o.cache && Ca(t, [B], n, !0),
                            So(),
                            (r = s.element),
                            o.isDehydrated)
                        ) {
                            if (
                                ((o = { element: r, isDehydrated: !1, cache: s.cache }),
                                (t.updateQueue.baseState = o),
                                (t.memoizedState = o),
                                t.flags & 256)
                            ) {
                                t = Yc(e, t, r, n);
                                break a;
                            }
                            if (r !== a) {
                                ((a = Yi(Error(i(424)), t)),
                                    ga(a),
                                    (t = Yc(e, t, r, n)));
                                break a;
                            }
                            switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                                case 9:
                                    e = e.body;
                                    break;
                                default:
                                    e =
                                        e.nodeName === `HTML`
                                            ? e.ownerDocument.body
                                            : e;
                            }
                            for (
                                L = lm(e.firstChild),
                                    I = t,
                                    R = !0,
                                    sa = null,
                                    ca = !0,
                                    n = po(t, null, r, n),
                                    t.child = n;
                                n;
                            )
                                ((n.flags = (n.flags & -3) | 134221824),
                                    (n = n.sibling));
                        } else {
                            if ((ma(), r === a)) {
                                t = ul(e, t, n);
                                break a;
                            }
                            Fc(e, t, r, n);
                        }
                        t = t.child;
                    }
                    return t;
                case 26:
                    return (
                        Gc(e, t),
                        e === null
                            ? (n = Nm(t.type, null, t.pendingProps, null))
                                ? (t.memoizedState = n)
                                : R ||
                                  (t.stateNode = fp(
                                      t.type,
                                      t.pendingProps,
                                      Pe.current,
                                      t,
                                  ))
                            : (t.memoizedState = Nm(
                                  t.type,
                                  e.memoizedProps,
                                  t.pendingProps,
                                  e.memoizedState,
                              )),
                        null
                    );
                case 27:
                    return (
                        Re(t),
                        e === null &&
                            R &&
                            ((r = t.stateNode = hm(t.type, t.pendingProps, Pe.current)),
                            (I = t),
                            (ca = !0),
                            (a = L),
                            Sp(t.type) ? ((um = a), (L = lm(r.firstChild))) : (L = a)),
                        Fc(e, t, t.pendingProps.children, n),
                        Gc(e, t),
                        e === null && (t.flags |= 4194304),
                        t.child
                    );
                case 5:
                    return (
                        e === null &&
                            R &&
                            ((a = r = L) &&
                                ((r = rm(r, t.type, t.pendingProps, ca)),
                                r === null
                                    ? (a = !1)
                                    : ((t.stateNode = r),
                                      (I = t),
                                      (L = lm(r.firstChild)),
                                      (ca = !1),
                                      (a = !0))),
                            a || ua(t)),
                        Re(t),
                        (a = t.type),
                        (o = t.pendingProps),
                        (s = e === null ? null : e.memoizedProps),
                        (r = o.children),
                        pp(a, o)
                            ? (r = null)
                            : s !== null && pp(a, s) && (t.flags |= 32),
                        t.memoizedState !== null &&
                            ((a = $o(e, t, ns, null, null, n)), (sh._currentValue = a)),
                        Gc(e, t),
                        Fc(e, t, r, n),
                        t.child
                    );
                case 6:
                    return (
                        e === null &&
                            R &&
                            ((e = n = L) &&
                                ((n = im(n, t.pendingProps, ca)),
                                n === null
                                    ? (e = !1)
                                    : ((t.stateNode = n),
                                      (I = t),
                                      (L = null),
                                      (e = !0))),
                            e || ua(t)),
                        null
                    );
                case 13:
                    return $c(e, t, n);
                case 4:
                    return (
                        Ie(t, t.stateNode.containerInfo),
                        (r = t.pendingProps),
                        e === null ? (t.child = fo(t, null, r, n)) : Fc(e, t, r, n),
                        t.child
                    );
                case 11:
                    return Ic(e, t, t.type, t.pendingProps, n);
                case 7:
                    return ((r = t.pendingProps), Gc(e, t), Fc(e, t, r, n), t.child);
                case 8:
                    return (Fc(e, t, t.pendingProps.children, n), t.child);
                case 12:
                    return (Fc(e, t, t.pendingProps.children, n), t.child);
                case 10:
                    return ll(e, t, n);
                case 9:
                    return (
                        (a = t.type._context),
                        (r = t.pendingProps.children),
                        Ea(t),
                        (a = z(a)),
                        (r = r(a)),
                        (t.flags |= 1),
                        Fc(e, t, r, n),
                        t.child
                    );
                case 14:
                    return Lc(e, t, t.type, t.pendingProps, n);
                case 15:
                    return Rc(e, t, t.type, t.pendingProps, n);
                case 19:
                    return cl(e, t, n);
                case 31:
                    return Wc(e, t, n);
                case 22:
                    return zc(e, t, n, t.pendingProps);
                case 24:
                    return (
                        Ea(t),
                        (r = z(B)),
                        e === null
                            ? ((a = Ka()),
                              a === null &&
                                  ((a = q),
                                  (o = Ma()),
                                  (a.pooledCache = o),
                                  o.refCount++,
                                  o !== null && (a.pooledCacheLanes |= n),
                                  (a = o)),
                              (t.memoizedState = { parent: r, cache: a }),
                              ho(t),
                              ba(t, B, a))
                            : ((e.lanes & n) !== 0 &&
                                  (go(e, t), Co(t, null, null, n), So()),
                              (a = e.memoizedState),
                              (o = t.memoizedState),
                              a.parent === r
                                  ? ((r = o.cache),
                                    ba(t, B, r),
                                    r !== a.cache && Ca(t, [B], n, !0))
                                  : ((a = { parent: r, cache: r }),
                                    (t.memoizedState = a),
                                    t.lanes === 0 &&
                                        (t.memoizedState = t.updateQueue.baseState = a),
                                    ba(t, B, r))),
                        Fc(e, t, t.pendingProps.children, n),
                        t.child
                    );
                case 30:
                    return (
                        t.stateNode === null &&
                            (t.stateNode = {
                                autoName: null,
                                paired: null,
                                clones: null,
                                ref: null,
                            }),
                        (r = t.pendingProps),
                        r.name != null && r.name !== `auto`
                            ? (t.flags |= e === null ? 18882560 : 18874368)
                            : R && ia(t),
                        e !== null && e.memoizedProps.name !== r.name
                            ? (t.flags |= 4194816)
                            : Gc(e, t),
                        Fc(e, t, r.children, n),
                        t.child
                    );
                case 29:
                    throw t.pendingProps;
            }
            throw Error(i(156, t.tag));
        }
        function ml(e) {
            e.flags |= 4;
        }
        function hl(e, t, n, r, i) {
            var a;
            if (
                ((a = !!(e.mode & 32)) &&
                    (a =
                        n === null
                            ? Jm(t, r)
                            : Jm(t, r) && (r.src !== n.src || r.srcSet !== n.srcSet)),
                a)
            ) {
                if (((e.flags |= 16777216), (i & 335544128) === i)) {
                    if (e.stateNode.complete) e.flags |= 8192;
                    else if (Ud()) e.flags |= 8192;
                    else throw ((no = Qa), Xa);
                }
            } else e.flags &= -16777217;
        }
        function gl(e, t) {
            if (t.type !== `stylesheet` || t.state.loading & 4) e.flags &= -16777217;
            else if (((e.flags |= 16777216), !Ym(t))) {
                if (Ud()) e.flags |= 8192;
                else throw ((no = Qa), Xa);
            }
        }
        function _l(e, t) {
            (t !== null && (e.flags |= 4),
                e.flags & 16384 &&
                    ((t = e.tag === 22 ? 536870912 : St()), (e.lanes |= t), (ud |= t)));
        }
        function vl(e, t) {
            if (!R)
                switch (e.tailMode) {
                    case `visible`:
                        break;
                    case `collapsed`:
                        for (var n = e.tail, r = null; n !== null;)
                            (n.alternate !== null && (r = n), (n = n.sibling));
                        r === null
                            ? t || e.tail === null
                                ? (e.tail = null)
                                : (e.tail.sibling = null)
                            : (r.sibling = null);
                        break;
                    default:
                        for (t = e.tail, n = null; t !== null;)
                            (t.alternate !== null && (n = t), (t = t.sibling));
                        n === null ? (e.tail = null) : (n.sibling = null);
                }
        }
        function U(e) {
            var t = e.alternate !== null && e.alternate.child === e.child,
                n = 0,
                r = 0;
            if (t)
                for (var i = e.child; i !== null;)
                    ((n |= i.lanes | i.childLanes),
                        (r |= i.subtreeFlags & 1206910976),
                        (r |= i.flags & 1206910976),
                        (i.return = e),
                        (i = i.sibling));
            else
                for (i = e.child; i !== null;)
                    ((n |= i.lanes | i.childLanes),
                        (r |= i.subtreeFlags),
                        (r |= i.flags),
                        (i.return = e),
                        (i = i.sibling));
            return ((e.subtreeFlags |= r), (e.childLanes = n), t);
        }
        function yl(e, t, n) {
            var r = t.pendingProps;
            switch ((aa(t), t.tag)) {
                case 16:
                case 15:
                case 0:
                case 11:
                case 7:
                case 8:
                case 12:
                case 9:
                case 14:
                    return (U(t), null);
                case 1:
                    return (U(t), null);
                case 3:
                    return (
                        (n = t.stateNode),
                        (r = null),
                        e !== null && (r = e.memoizedState.cache),
                        t.memoizedState.cache !== r && (t.flags |= 2048),
                        xa(B),
                        Le(),
                        n.pendingContext &&
                            ((n.context = n.pendingContext), (n.pendingContext = null)),
                        (e === null || e.child === null) &&
                            (pa(t)
                                ? ml(t)
                                : e === null ||
                                  (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
                                  ((t.flags |= 1024), ha())),
                        U(t),
                        null
                    );
                case 26:
                    var a = t.type,
                        o = t.memoizedState;
                    return (
                        e === null
                            ? (ml(t),
                              o === null
                                  ? (U(t), hl(t, a, null, r, n))
                                  : (U(t), gl(t, o)))
                            : o
                              ? o === e.memoizedState
                                  ? (U(t), (t.flags &= -16777217))
                                  : (ml(t), U(t), gl(t, o))
                              : ((e = e.memoizedProps),
                                e !== r && ml(t),
                                U(t),
                                hl(t, a, e, r, n)),
                        null
                    );
                case 27:
                    if (
                        (ze(t),
                        (n = Pe.current),
                        (a = t.type),
                        e !== null && t.stateNode != null)
                    )
                        e.memoizedProps !== r && ml(t);
                    else {
                        if (!r) {
                            if (t.stateNode === null) throw Error(i(166));
                            return (U(t), (t.subtreeFlags &= -33554433), null);
                        }
                        ((e = Me.current),
                            pa(t)
                                ? da(t, e)
                                : ((e = hm(a, r, n)), (t.stateNode = e), ml(t)));
                    }
                    return (U(t), (t.subtreeFlags &= -33554433), null);
                case 5:
                    if ((ze(t), (a = t.type), e !== null && t.stateNode != null))
                        e.memoizedProps !== r && ml(t);
                    else {
                        if (!r) {
                            if (t.stateNode === null) throw Error(i(166));
                            return (U(t), (t.subtreeFlags &= -33554433), null);
                        }
                        if (((o = Me.current), pa(t))) da(t, o);
                        else {
                            var s = lp(Pe.current);
                            switch (o) {
                                case 1:
                                    o = s.createElementNS(
                                        `http://www.w3.org/2000/svg`,
                                        a,
                                    );
                                    break;
                                case 2:
                                    o = s.createElementNS(
                                        `http://www.w3.org/1998/Math/MathML`,
                                        a,
                                    );
                                    break;
                                default:
                                    switch (a) {
                                        case `svg`:
                                            o = s.createElementNS(
                                                `http://www.w3.org/2000/svg`,
                                                a,
                                            );
                                            break;
                                        case `math`:
                                            o = s.createElementNS(
                                                `http://www.w3.org/1998/Math/MathML`,
                                                a,
                                            );
                                            break;
                                        case `script`:
                                            ((o = s.createElement(`div`)),
                                                (o.innerHTML = `<script><\/script>`),
                                                (o = o.removeChild(o.firstChild)));
                                            break;
                                        case `select`:
                                            ((o =
                                                typeof r.is == `string`
                                                    ? s.createElement(`select`, {
                                                          is: r.is,
                                                      })
                                                    : s.createElement(`select`)),
                                                r.multiple
                                                    ? (o.multiple = !0)
                                                    : r.size && (o.size = r.size));
                                            break;
                                        default:
                                            o =
                                                typeof r.is == `string`
                                                    ? s.createElement(a, { is: r.is })
                                                    : s.createElement(a);
                                    }
                            }
                            ((o[Pt] = t), (o[D] = r));
                            a: for (s = t.child; s !== null;) {
                                if (s.tag === 5 || s.tag === 6)
                                    o.appendChild(s.stateNode);
                                else if (
                                    s.tag !== 4 &&
                                    s.tag !== 27 &&
                                    s.child !== null
                                ) {
                                    ((s.child.return = s), (s = s.child));
                                    continue;
                                }
                                if (s === t) break a;
                                for (; s.sibling === null;) {
                                    if (s.return === null || s.return === t) break a;
                                    s = s.return;
                                }
                                ((s.sibling.return = s.return), (s = s.sibling));
                            }
                            t.stateNode = o;
                            a: switch ((np(o, a, r), a)) {
                                case `button`:
                                case `input`:
                                case `select`:
                                case `textarea`:
                                    r = !!r.autoFocus;
                                    break a;
                                case `img`:
                                    r = !0;
                                    break a;
                                default:
                                    r = !1;
                            }
                            r && ml(t);
                        }
                    }
                    return (
                        U(t),
                        (t.subtreeFlags &= -33554433),
                        hl(
                            t,
                            t.type,
                            e === null ? null : e.memoizedProps,
                            t.pendingProps,
                            n,
                        ),
                        null
                    );
                case 6:
                    if (e && t.stateNode != null) e.memoizedProps !== r && ml(t);
                    else {
                        if (typeof r != `string` && t.stateNode === null)
                            throw Error(i(166));
                        if (((e = Pe.current), pa(t))) {
                            if (
                                ((e = t.stateNode),
                                (n = t.memoizedProps),
                                (r = null),
                                (a = I),
                                a !== null)
                            )
                                switch (a.tag) {
                                    case 27:
                                    case 5:
                                        r = a.memoizedProps;
                                }
                            ((e[Pt] = t),
                                (e = !!(
                                    e.nodeValue === n ||
                                    (r !== null && !0 === r.suppressHydrationWarning) ||
                                    ep(e.nodeValue, n)
                                )),
                                e || ua(t, !0));
                        } else
                            ((e = lp(e).createTextNode(r)),
                                (e[Pt] = t),
                                (t.stateNode = e));
                    }
                    return (U(t), null);
                case 31:
                    if (
                        ((n = t.memoizedState), e === null || e.memoizedState !== null)
                    ) {
                        if (((r = pa(t)), n !== null)) {
                            if (e === null) {
                                if (!r) throw Error(i(318));
                                if (
                                    ((e = t.memoizedState),
                                    (e = e === null ? null : e.dehydrated),
                                    !e)
                                )
                                    throw Error(i(557));
                                e[Pt] = t;
                            } else
                                (ma(),
                                    !(t.flags & 128) && (t.memoizedState = null),
                                    (t.flags |= 4));
                            (U(t), (e = !1));
                        } else
                            ((n = ha()),
                                e !== null &&
                                    e.memoizedState !== null &&
                                    (e.memoizedState.hydrationErrors = n),
                                (e = !0));
                        if (!e) return t.flags & 256 ? (Lo(t), t) : (Lo(t), null);
                        if (t.flags & 128) throw Error(i(558));
                    }
                    return (U(t), null);
                case 13:
                    if (
                        ((r = t.memoizedState),
                        e === null ||
                            (e.memoizedState !== null &&
                                e.memoizedState.dehydrated !== null))
                    ) {
                        if (((a = pa(t)), r !== null && r.dehydrated !== null)) {
                            if (e === null) {
                                if (!a) throw Error(i(318));
                                if (
                                    ((a = t.memoizedState),
                                    (a = a === null ? null : a.dehydrated),
                                    !a)
                                )
                                    throw Error(i(317));
                                a[Pt] = t;
                            } else
                                (ma(),
                                    !(t.flags & 128) && (t.memoizedState = null),
                                    (t.flags |= 4));
                            (U(t), (a = !1));
                        } else
                            ((a = ha()),
                                e !== null &&
                                    e.memoizedState !== null &&
                                    (e.memoizedState.hydrationErrors = a),
                                (a = !0));
                        if (!a) return t.flags & 256 ? (Lo(t), t) : (Lo(t), null);
                    }
                    return (
                        Lo(t),
                        t.flags & 128
                            ? ((t.lanes = n), t)
                            : ((n = r !== null),
                              (e = e !== null && e.memoizedState !== null),
                              n &&
                                  ((r = t.child),
                                  (a = null),
                                  r.alternate !== null &&
                                      r.alternate.memoizedState !== null &&
                                      r.alternate.memoizedState.cachePool !== null &&
                                      (a = r.alternate.memoizedState.cachePool.pool),
                                  (o = null),
                                  r.memoizedState !== null &&
                                      r.memoizedState.cachePool !== null &&
                                      (o = r.memoizedState.cachePool.pool),
                                  o !== a && (r.flags |= 2048)),
                              n !== e && n && (t.child.flags |= 8192),
                              _l(t, t.updateQueue),
                              U(t),
                              null)
                    );
                case 4:
                    return (
                        Le(),
                        e === null && Wf(t.stateNode.containerInfo),
                        (t.flags |= 67108864),
                        U(t),
                        null
                    );
                case 10:
                    return (xa(t.type), U(t), null);
                case 19:
                    if ((Bo(t), (r = t.memoizedState), r === null)) return (U(t), null);
                    if (((a = !!(t.flags & 128)), (o = r.rendering), o === null)) {
                        if (a) vl(r, !1);
                        else {
                            if (ad !== 0 || (e !== null && e.flags & 128))
                                for (e = t.child; e !== null;) {
                                    if (((o = Vo(e)), o !== null)) {
                                        for (
                                            t.flags |= 128,
                                                vl(r, !1),
                                                e = o.updateQueue,
                                                t.updateQueue = e,
                                                _l(t, e),
                                                t.subtreeFlags = 0,
                                                e = n,
                                                n = t.child;
                                            n !== null;
                                        )
                                            (Hi(n, e), (n = n.sibling));
                                        return (
                                            zo(t, (Ro.current & 1) | 2),
                                            R && na(t, r.treeForkCount),
                                            t.child
                                        );
                                    }
                                    e = e.sibling;
                                }
                            r.tail !== null &&
                                Qe() > gd &&
                                ((t.flags |= 128),
                                (a = !0),
                                vl(r, !1),
                                (t.lanes = 4194304));
                        }
                    } else {
                        if (!a) {
                            if (((e = Vo(o)), e !== null)) {
                                if (
                                    ((t.flags |= 128),
                                    (a = !0),
                                    (e = e.updateQueue),
                                    (t.updateQueue = e),
                                    _l(t, e),
                                    vl(r, !0),
                                    r.tail === null &&
                                        r.tailMode !== `collapsed` &&
                                        r.tailMode !== `visible` &&
                                        !o.alternate &&
                                        !R)
                                )
                                    return (U(t), null);
                            } else
                                2 * Qe() - r.renderingStartTime > gd &&
                                    n !== 536870912 &&
                                    ((t.flags |= 128),
                                    (a = !0),
                                    vl(r, !1),
                                    (t.lanes = 4194304));
                        }
                        r.isBackwards
                            ? ((o.sibling = t.child), (t.child = o))
                            : ((e = r.last),
                              e === null ? (t.child = o) : (e.sibling = o),
                              (r.last = o));
                    }
                    if (r.tail !== null) {
                        e = r.tail;
                        a: {
                            for (n = e; n !== null;) {
                                if (n.alternate !== null) {
                                    n = !1;
                                    break a;
                                }
                                n = n.sibling;
                            }
                            n = !0;
                        }
                        return (
                            (r.rendering = e),
                            (r.tail = e.sibling),
                            (r.renderingStartTime = Qe()),
                            (e.sibling = null),
                            (o = Ro.current),
                            (o = a ? (o & 1) | 2 : o & 1),
                            r.tailMode === `visible` ||
                            r.tailMode === `collapsed` ||
                            !n ||
                            R
                                ? zo(t, o)
                                : ((n = o),
                                  E(jo, t),
                                  E(Ro, n),
                                  Mo === null && (Mo = t)),
                            R && na(t, r.treeForkCount),
                            e
                        );
                    }
                    return (U(t), null);
                case 22:
                case 23:
                    return (
                        Lo(t),
                        Ao(),
                        (r = t.memoizedState !== null),
                        e === null
                            ? r && (t.flags |= 8192)
                            : (e.memoizedState !== null) !== r && (t.flags |= 8192),
                        r
                            ? n & 536870912 &&
                              !(t.flags & 128) &&
                              (U(t), t.subtreeFlags & 6 && (t.flags |= 8192))
                            : U(t),
                        (n = t.updateQueue),
                        n !== null && _l(t, n.retryQueue),
                        (n = null),
                        e !== null &&
                            e.memoizedState !== null &&
                            e.memoizedState.cachePool !== null &&
                            (n = e.memoizedState.cachePool.pool),
                        (r = null),
                        t.memoizedState !== null &&
                            t.memoizedState.cachePool !== null &&
                            (r = t.memoizedState.cachePool.pool),
                        r !== n && (t.flags |= 2048),
                        e !== null && je(Ga),
                        null
                    );
                case 24:
                    return (
                        (n = null),
                        e !== null && (n = e.memoizedState.cache),
                        t.memoizedState.cache !== n && (t.flags |= 2048),
                        xa(B),
                        U(t),
                        null
                    );
                case 25:
                    return null;
                case 30:
                    return ((t.flags |= 33554432), U(t), null);
            }
            throw Error(i(156, t.tag));
        }
        function bl(e, t) {
            switch ((aa(t), t.tag)) {
                case 1:
                    return (
                        (e = t.flags),
                        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
                    );
                case 3:
                    return (
                        xa(B),
                        Le(),
                        (e = t.flags),
                        e & 65536 && !(e & 128)
                            ? ((t.flags = (e & -65537) | 128), t)
                            : null
                    );
                case 26:
                case 27:
                case 5:
                    return (ze(t), null);
                case 31:
                    if (t.memoizedState !== null) {
                        if ((Lo(t), t.alternate === null)) throw Error(i(340));
                        ma();
                    }
                    return (
                        (e = t.flags),
                        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
                    );
                case 13:
                    if (
                        (Lo(t),
                        (e = t.memoizedState),
                        e !== null && e.dehydrated !== null)
                    ) {
                        if (t.alternate === null) throw Error(i(340));
                        ma();
                    }
                    return (
                        (e = t.flags),
                        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
                    );
                case 19:
                    return (
                        Bo(t),
                        (e = t.flags),
                        e & 65536
                            ? ((t.flags = (e & -65537) | 128),
                              (e = t.memoizedState),
                              e !== null && ((e.rendering = null), (e.tail = null)),
                              (t.flags |= 4),
                              t)
                            : null
                    );
                case 4:
                    return (Le(), null);
                case 10:
                    return (xa(t.type), null);
                case 22:
                case 23:
                    return (
                        Lo(t),
                        Ao(),
                        e !== null && je(Ga),
                        (e = t.flags),
                        e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
                    );
                case 24:
                    return (xa(B), null);
                case 25:
                    return null;
                default:
                    return null;
            }
        }
        function xl(e, t) {
            switch ((aa(t), t.tag)) {
                case 3:
                    (xa(B), Le());
                    break;
                case 26:
                case 27:
                case 5:
                    ze(t);
                    break;
                case 4:
                    Le();
                    break;
                case 31:
                    t.memoizedState !== null && Lo(t);
                    break;
                case 13:
                    Lo(t);
                    break;
                case 19:
                    Bo(t);
                    break;
                case 10:
                    xa(t.type);
                    break;
                case 22:
                case 23:
                    (Lo(t), Ao(), e !== null && je(Ga));
                    break;
                case 24:
                    xa(B);
            }
        }
        function Sl(e, t) {
            try {
                var n = t.updateQueue,
                    r = n === null ? null : n.lastEffect;
                if (r !== null) {
                    var i = r.next;
                    n = i;
                    do {
                        if ((n.tag & e) === e) {
                            r = void 0;
                            var a = n.create,
                                o = n.inst;
                            ((r = a()), (o.destroy = r));
                        }
                        n = n.next;
                    } while (n !== i);
                }
            } catch (e) {
                Z(t, t.return, e);
            }
        }
        function Cl(e, t, n) {
            try {
                var r = t.updateQueue,
                    i = r === null ? null : r.lastEffect;
                if (i !== null) {
                    var a = i.next;
                    r = a;
                    do {
                        if ((r.tag & e) === e) {
                            var o = r.inst,
                                s = o.destroy;
                            if (s !== void 0) {
                                ((o.destroy = void 0), (i = t));
                                var c = n,
                                    l = s;
                                try {
                                    l();
                                } catch (e) {
                                    Z(i, c, e);
                                }
                            }
                        }
                        r = r.next;
                    } while (r !== a);
                }
            } catch (e) {
                Z(t, t.return, e);
            }
        }
        function wl(e) {
            var t = e.updateQueue;
            if (t !== null) {
                var n = e.stateNode;
                try {
                    To(t, n);
                } catch (t) {
                    Z(e, e.return, t);
                }
            }
        }
        function Tl(e, t, n) {
            ((n.props = Cc(e.type, e.memoizedProps)), (n.state = e.memoizedState));
            try {
                n.componentWillUnmount();
            } catch (n) {
                Z(e, t, n);
            }
        }
        function El(e, t) {
            try {
                var n = e.ref;
                if (n !== null) {
                    switch (e.tag) {
                        case 26:
                        case 27:
                        case 5:
                            var r = e.stateNode;
                            break;
                        case 30:
                            var i = e.stateNode,
                                a = Ei(e.memoizedProps, i);
                            ((i.ref === null || i.ref.name !== a) && (i.ref = Pp(a)),
                                (r = i.ref));
                            break;
                        case 7:
                            if (e.stateNode === null) {
                                var o = new Fp(e);
                                (f(e.child, !1, Qp, o, void 0, void 0),
                                    (e.stateNode = o));
                            }
                            r = e.stateNode;
                            break;
                        default:
                            r = e.stateNode;
                    }
                    typeof n == `function` ? (e.refCleanup = n(r)) : (n.current = r);
                }
            } catch (n) {
                Z(e, t, n);
            }
        }
        function Dl(e, t) {
            var n = e.ref,
                r = e.refCleanup;
            if (n !== null) {
                if (typeof r == `function`)
                    try {
                        r();
                    } catch (n) {
                        Z(e, t, n);
                    } finally {
                        ((e.refCleanup = null),
                            (e = e.alternate),
                            e != null && (e.refCleanup = null));
                    }
                else if (typeof n == `function`)
                    try {
                        n(null);
                    } catch (n) {
                        Z(e, t, n);
                    }
                else n.current = null;
            }
        }
        function Ol(e, t) {
            if (
                (e.tag === 5 || e.tag === 27 || e.tag === 6) &&
                e.alternate === null &&
                t !== null
            )
                for (var n = 0; n < t.length; n++) em(e.stateNode, t[n]);
        }
        function kl(e) {
            for (
                var t = e.return;
                t !== null && (Ml(t) && em(e.stateNode, t.stateNode), !jl(t));
            )
                t = t.return;
        }
        function Al(e) {
            for (
                var t = e.return;
                t !== null && (Ml(t) && tm(e.stateNode, t.stateNode), !jl(t));
            )
                t = t.return;
        }
        function jl(e) {
            return e.tag === 5 || e.tag === 3 || e.tag === 27;
        }
        function Ml(e) {
            return e && e.tag === 7 && e.stateNode !== null;
        }
        function Nl(e) {
            var t = e.type,
                n = e.memoizedProps,
                r = e.stateNode;
            try {
                a: switch (t) {
                    case `button`:
                    case `input`:
                    case `select`:
                    case `textarea`:
                        n.autoFocus && r.focus();
                        break a;
                    case `img`:
                        n.src ? (r.src = n.src) : n.srcSet && (r.srcset = n.srcSet);
                }
            } catch (t) {
                Z(e, e.return, t);
            }
        }
        function Pl(e, t, n) {
            try {
                var r = e.stateNode;
                (ip(r, e.type, n, t), (r[D] = t));
            } catch (t) {
                Z(e, e.return, t);
            }
        }
        function Fl(e) {
            return (
                e.tag === 5 ||
                e.tag === 3 ||
                e.tag === 26 ||
                (e.tag === 27 && Sp(e.type)) ||
                e.tag === 4
            );
        }
        function Il(e) {
            a: for (;;) {
                for (; e.sibling === null;) {
                    if (e.return === null || Fl(e.return)) return null;
                    e = e.return;
                }
                for (
                    e.sibling.return = e.return, e = e.sibling;
                    e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
                ) {
                    if (
                        (e.tag === 27 && Sp(e.type)) ||
                        e.flags & 2 ||
                        e.child === null ||
                        e.tag === 4
                    )
                        continue a;
                    ((e.child.return = e), (e = e.child));
                }
                if (!(e.flags & 2)) return e.stateNode;
            }
        }
        function Ll(e, t, n, r) {
            var i = e.tag;
            if (i === 5 || i === 6)
                ((i = e.stateNode),
                    t
                        ? (n.nodeType === 9
                              ? n.body
                              : n.nodeName === `HTML`
                                ? n.ownerDocument.body
                                : n
                          ).insertBefore(i, t)
                        : ((t =
                              n.nodeType === 9
                                  ? n.body
                                  : n.nodeName === `HTML`
                                    ? n.ownerDocument.body
                                    : n),
                          t.appendChild(i),
                          (n = n._reactRootContainer),
                          n != null || t.onclick !== null || (t.onclick = kn)),
                    Ol(e, r),
                    (O = !0));
            else if (
                i !== 4 &&
                (i === 27 &&
                    (Ol(e, r),
                    (r = null),
                    Sp(e.type) && ((n = e.stateNode), (t = null))),
                (e = e.child),
                e !== null)
            )
                for (Ll(e, t, n, r), e = e.sibling; e !== null;)
                    (Ll(e, t, n, r), (e = e.sibling));
        }
        function Rl(e, t, n, r) {
            var i = e.tag;
            if (i === 5 || i === 6)
                ((i = e.stateNode),
                    t ? n.insertBefore(i, t) : n.appendChild(i),
                    Ol(e, r),
                    (O = !0));
            else if (
                i !== 4 &&
                (i === 27 && (Ol(e, r), (r = null), Sp(e.type) && (n = e.stateNode)),
                (e = e.child),
                e !== null)
            )
                for (Rl(e, t, n, r), e = e.sibling; e !== null;)
                    (Rl(e, t, n, r), (e = e.sibling));
        }
        function zl(e) {
            var t = e.stateNode,
                n = e.memoizedProps;
            try {
                for (var r = e.type, i = t.attributes; i.length;)
                    t.removeAttributeNode(i[0]);
                (np(t, r, n), (t[Pt] = e), (t[D] = n));
            } catch (t) {
                Z(e, e.return, t);
            }
        }
        var Bl = !1,
            Vl = null;
        function Hl(e) {
            (e.tag === 30 || e.subtreeFlags & 33554432) && (Bl = !0);
        }
        var Ul = null;
        function Wl() {
            var e = Ul;
            return ((Ul = null), e);
        }
        var Gl = 0;
        function Kl(e, t, n, r, i) {
            return ((Gl = 0), ql(e.child, t, n, r, i));
        }
        function ql(e, t, n, r, i) {
            for (var a = !1; e !== null;) {
                if (e.tag === 5) {
                    var o = e.stateNode;
                    if (r !== null) {
                        var s = Op(o);
                        (r.push(s), s.view && (a = !0));
                    } else a || (Op(o).view && (a = !0));
                    ((Bl = !0), Tp(o, Gl === 0 ? t : t + `_` + Gl, n), Gl++);
                } else
                    (e.tag !== 22 || e.memoizedState === null) &&
                        ((e.tag === 30 && i) || (ql(e.child, t, n, r, i) && (a = !0)));
                e = e.sibling;
            }
            return a;
        }
        function Jl(e, t) {
            for (; e !== null;)
                (e.tag === 5
                    ? Ep(e.stateNode, e.memoizedProps)
                    : (e.tag !== 22 || e.memoizedState === null) &&
                      ((e.tag === 30 && t) || Jl(e.child, t)),
                    (e = e.sibling));
        }
        function Yl(e) {
            if (e.subtreeFlags & 18874368)
                for (e = e.child; e !== null;) {
                    if (
                        (e.tag !== 22 || e.memoizedState === null) &&
                        (Yl(e),
                        e.tag === 30 && e.flags & 18874368 && e.stateNode.paired)
                    ) {
                        var t = e.memoizedProps;
                        if (t.name == null || t.name === `auto`) throw Error(i(544));
                        var n = t.name;
                        ((t = Oi(t.default, t.share)),
                            t !== `none` && (Kl(e, n, t, null, !1) || Jl(e.child, !1)));
                    }
                    e = e.sibling;
                }
        }
        function Xl(e, t) {
            if (e.tag === 30) {
                var n = e.stateNode,
                    r = e.memoizedProps,
                    i = Ei(r, n),
                    a = Oi(r.default, n.paired ? r.share : r.enter);
                a === `none`
                    ? Yl(e)
                    : Kl(e, i, a, null, !1)
                      ? (Yl(e), n.paired || t || Nd(e, r.onEnter))
                      : Jl(e.child, !1);
            } else if (e.subtreeFlags & 33554432)
                for (e = e.child; e !== null;) (Xl(e, t), (e = e.sibling));
            else Yl(e);
        }
        function Zl(e) {
            if (Vl !== null && Vl.size !== 0) {
                var t = Vl;
                if (e.subtreeFlags & 18874368)
                    for (e = e.child; e !== null;) {
                        if (e.tag !== 22 || e.memoizedState === null) {
                            if (e.tag === 30 && e.flags & 18874368) {
                                var n = e.memoizedProps,
                                    r = n.name;
                                if (r != null && r !== `auto`) {
                                    var i = t.get(r);
                                    if (i !== void 0) {
                                        var a = Oi(n.default, n.share);
                                        if (
                                            (a !== `none` &&
                                                (Kl(e, r, a, null, !1)
                                                    ? ((a = e.stateNode),
                                                      (i.paired = a),
                                                      (a.paired = i),
                                                      Nd(e, n.onShare))
                                                    : Jl(e.child, !1)),
                                            t.delete(r),
                                            t.size === 0)
                                        )
                                            break;
                                    }
                                }
                            }
                            Zl(e);
                        }
                        e = e.sibling;
                    }
            }
        }
        function Ql(e) {
            if (e.tag === 30) {
                var t = e.memoizedProps,
                    n = Ei(t, e.stateNode),
                    r = Vl === null ? void 0 : Vl.get(n),
                    i = Oi(t.default, r === void 0 ? t.exit : t.share);
                (i !== `none` &&
                    (Kl(e, n, i, null, !1)
                        ? r === void 0
                            ? Nd(e, t.onExit)
                            : ((i = e.stateNode),
                              (r.paired = i),
                              (i.paired = r),
                              Vl.delete(n),
                              Nd(e, t.onShare))
                        : Jl(e.child, !1)),
                    Vl !== null && Zl(e));
            } else if (e.subtreeFlags & 33554432)
                for (e = e.child; e !== null;) (Ql(e), (e = e.sibling));
            else Vl !== null && Zl(e);
        }
        function $l(e) {
            for (e = e.child; e !== null;) {
                if (e.tag === 30) {
                    var t = e.memoizedProps,
                        n = Ei(t, e.stateNode);
                    ((t = Oi(t.default, t.update)),
                        (e.flags &= -5),
                        t !== `none` && Kl(e, n, t, (e.memoizedState = []), !1));
                } else e.subtreeFlags & 33554432 && $l(e);
                e = e.sibling;
            }
        }
        function eu(e) {
            if (e.subtreeFlags & 18874368)
                for (e = e.child; e !== null;) {
                    if (e.tag !== 22 || e.memoizedState === null) {
                        if (e.tag === 30 && e.flags & 18874368) {
                            var t = e.stateNode;
                            t.paired !== null && ((t.paired = null), Jl(e.child, !1));
                        }
                        eu(e);
                    }
                    e = e.sibling;
                }
        }
        function tu(e) {
            if (e.tag === 30) ((e.stateNode.paired = null), Jl(e.child, !1), eu(e));
            else if (e.subtreeFlags & 33554432)
                for (e = e.child; e !== null;) (tu(e), (e = e.sibling));
            else eu(e);
        }
        function nu(e) {
            for (e = e.child; e !== null;)
                (e.tag === 30 ? Jl(e.child, !1) : e.subtreeFlags & 33554432 && nu(e),
                    (e = e.sibling));
        }
        function ru(e, t, n, r, i, a, o) {
            for (var s = !1; t !== null;) {
                if (t.tag === 5) {
                    var c = t.stateNode;
                    if (a !== null && Gl < a.length) {
                        var l = a[Gl],
                            u = Op(c);
                        (l.view || u.view) && (s = !0);
                        var d;
                        if ((d = !(e.flags & 4))) {
                            if (u.clip) d = !0;
                            else {
                                d = l.rect;
                                var f = u.rect;
                                d =
                                    d.y !== f.y ||
                                    d.x !== f.x ||
                                    d.height !== f.height ||
                                    d.width !== f.width;
                            }
                        }
                        (d && (e.flags |= 4),
                            u.abs
                                ? (u = !l.abs)
                                : ((l = l.rect),
                                  (u = u.rect),
                                  (u = l.height !== u.height || l.width !== u.width)),
                            u && (e.flags |= 32));
                    } else e.flags |= 32;
                    (e.flags & 4 && Tp(c, Gl === 0 ? n : n + `_` + Gl, i),
                        (s && e.flags & 4) ||
                            (Ul === null && (Ul = []),
                            Ul.push(c, Gl === 0 ? r : r + `_` + Gl, t.memoizedProps)),
                        Gl++);
                } else
                    (t.tag !== 22 || t.memoizedState === null) &&
                        (t.tag === 30 && o
                            ? (e.flags |= t.flags & 32)
                            : ru(e, t.child, n, r, i, a, o) && (s = !0));
                t = t.sibling;
            }
            return s;
        }
        function iu(e, t) {
            for (e = e.child; e !== null;) {
                if (e.tag === 30) {
                    var n = e.memoizedProps,
                        r = e.stateNode,
                        i = Ei(n, r),
                        a = Oi(n.default, n.update);
                    if (t) {
                        r = r.clones;
                        var o = r === null ? null : r.map(kp);
                    } else ((o = e.memoizedState), (e.memoizedState = null));
                    r = e;
                    var s = e.child;
                    ((Gl = 0),
                        (i = ru(r, s, i, i, a, o, !1)),
                        e.flags & 4 && i && (t || Nd(e, n.onUpdate)));
                } else e.subtreeFlags & 33554432 && iu(e, t);
                e = e.sibling;
            }
        }
        var au = !1,
            W = !1,
            ou = !1,
            su = !1,
            cu = typeof WeakSet == `function` ? WeakSet : Set,
            lu = null,
            uu = !1,
            du = !1,
            fu = !1,
            pu = !1;
        function mu(e, t, n) {
            if (((e = e.containerInfo), (sp = gh), (e = ii(e)), ai(e))) {
                if (`selectionStart` in e)
                    var r = { start: e.selectionStart, end: e.selectionEnd };
                else
                    a: {
                        r = ((r = e.ownerDocument) && r.defaultView) || window;
                        var i = r.getSelection && r.getSelection();
                        if (i && i.rangeCount !== 0) {
                            r = i.anchorNode;
                            var a = i.anchorOffset,
                                o = i.focusNode;
                            i = i.focusOffset;
                            try {
                                (r.nodeType, o.nodeType);
                            } catch {
                                r = null;
                                break a;
                            }
                            var s = 0,
                                c = -1,
                                l = -1,
                                u = 0,
                                d = 0,
                                f = e,
                                p = null;
                            b: for (;;) {
                                for (
                                    var m;
                                    f !== r ||
                                        (a !== 0 && f.nodeType !== 3) ||
                                        (c = s + a),
                                        f !== o ||
                                            (i !== 0 && f.nodeType !== 3) ||
                                            (l = s + i),
                                        f.nodeType === 3 && (s += f.nodeValue.length),
                                        (m = f.firstChild) !== null;
                                )
                                    ((p = f), (f = m));
                                for (;;) {
                                    if (f === e) break b;
                                    if (
                                        (p === r && ++u === a && (c = s),
                                        p === o && ++d === i && (l = s),
                                        (m = f.nextSibling) !== null)
                                    )
                                        break;
                                    ((f = p), (p = f.parentNode));
                                }
                                f = m;
                            }
                            r = c === -1 || l === -1 ? null : { start: c, end: l };
                        } else r = null;
                    }
                r ||= { start: 0, end: 0 };
            } else r = null;
            for (
                cp = { focusedElem: e, selectionRange: r },
                    gh = !1,
                    n = (n & 335544064) === n,
                    lu = t,
                    t = n ? 9270 : 1024;
                lu !== null;
            ) {
                if (((e = lu), n && ((r = e.deletions), r !== null)))
                    for (a = 0; a < r.length; a++) n && Ql(r[a]);
                if (e.alternate === null && e.flags & 2) (n && Hl(e), hu(n));
                else {
                    if (e.tag === 22) {
                        if (((r = e.alternate), e.memoizedState !== null)) {
                            (r !== null && r.memoizedState === null && n && Ql(r),
                                hu(n));
                            continue;
                        }
                        if (r !== null && r.memoizedState !== null) {
                            (n && Hl(e), hu(n));
                            continue;
                        }
                    }
                    ((r = e.child),
                        (e.subtreeFlags & t) !== 0 && r !== null
                            ? ((r.return = e), (lu = r))
                            : (n && $l(e), hu(n)));
                }
            }
            Vl = null;
        }
        function hu(e) {
            for (; lu !== null;) {
                var t = lu,
                    n = e,
                    r = t.alternate,
                    a = t.flags;
                switch (t.tag) {
                    case 0:
                    case 11:
                    case 15:
                        break;
                    case 1:
                        if (a & 1024 && r !== null) {
                            ((n = void 0),
                                (a = r.memoizedProps),
                                (r = r.memoizedState));
                            var o = t.stateNode;
                            try {
                                var s = Cc(t.type, a);
                                ((n = o.getSnapshotBeforeUpdate(s, r)),
                                    (o.__reactInternalSnapshotBeforeUpdate = n));
                            } catch (e) {
                                Z(t, t.return, e);
                            }
                        }
                        break;
                    case 3:
                        if (a & 1024) {
                            if (
                                ((r = t.stateNode.containerInfo),
                                (n = r.nodeType),
                                n === 9)
                            )
                                nm(r);
                            else if (n === 1)
                                switch (r.nodeName) {
                                    case `HEAD`:
                                    case `HTML`:
                                    case `BODY`:
                                        nm(r);
                                        break;
                                    default:
                                        r.textContent = ``;
                                }
                        }
                        break;
                    case 5:
                    case 26:
                    case 27:
                    case 6:
                    case 4:
                    case 17:
                        break;
                    case 30:
                        n &&
                            r !== null &&
                            ((n = Ei(r.memoizedProps, r.stateNode)),
                            (a = t.memoizedProps),
                            (a = Oi(a.default, a.update)),
                            a !== `none` && Kl(r, n, a, (r.memoizedState = []), !0));
                        break;
                    default:
                        if (a & 1024) throw Error(i(163));
                }
                if (((r = t.sibling), r !== null)) {
                    ((r.return = t.return), (lu = r));
                    break;
                }
                lu = t.return;
            }
        }
        function gu(e, t, n) {
            var r = n.flags;
            switch (n.tag) {
                case 0:
                case 11:
                case 15:
                    (Fu(e, n), r & 4 && Sl(5, n));
                    break;
                case 1:
                    if ((Fu(e, n), r & 4)) {
                        if (((e = n.stateNode), t === null))
                            try {
                                e.componentDidMount();
                            } catch (e) {
                                Z(n, n.return, e);
                            }
                        else {
                            var i = Cc(n.type, t.memoizedProps);
                            t = t.memoizedState;
                            try {
                                e.componentDidUpdate(
                                    i,
                                    t,
                                    e.__reactInternalSnapshotBeforeUpdate,
                                );
                            } catch (e) {
                                Z(n, n.return, e);
                            }
                        }
                    }
                    (r & 64 && wl(n), r & 512 && El(n, n.return));
                    break;
                case 3:
                    if ((Fu(e, n), r & 64 && ((e = n.updateQueue), e !== null))) {
                        if (((t = null), n.child !== null))
                            switch (n.child.tag) {
                                case 27:
                                case 5:
                                    t = n.child.stateNode;
                                    break;
                                case 1:
                                    t = n.child.stateNode;
                            }
                        try {
                            To(e, t);
                        } catch (e) {
                            Z(n, n.return, e);
                        }
                    }
                    break;
                case 27:
                    t === null && r & 4 && zl(n);
                case 26:
                case 5:
                    (Fu(e, n),
                        t === null && r & 4 && Nl(n),
                        r & 512 && El(n, n.return));
                    break;
                case 12:
                    Fu(e, n);
                    break;
                case 31:
                    (Fu(e, n), r & 4 && wu(e, n));
                    break;
                case 13:
                    (Fu(e, n),
                        r & 4 && Tu(e, n),
                        r & 64 &&
                            ((e = n.memoizedState),
                            e !== null &&
                                ((e = e.dehydrated),
                                e !== null && ((n = _f.bind(null, n)), cm(e, n)))));
                    break;
                case 22:
                    if (((r = n.memoizedState !== null || au), !r)) {
                        var a = (t !== null && t.memoizedState !== null) || W;
                        ((t = au),
                            (i = W),
                            (au = r),
                            (W = a) && !i
                                ? ((r = 2),
                                  n.subtreeFlags & 8772 && (r |= 1),
                                  Lu(e, n, r))
                                : Fu(e, n),
                            (au = t),
                            (W = i));
                    }
                    break;
                case 30:
                    (Fu(e, n), r & 512 && El(n, n.return));
                    break;
                case 7:
                    r & 512 && El(n, n.return);
                default:
                    Fu(e, n);
            }
        }
        function _u(e, t) {
            for (e = e.child; e !== null;) (vu(e, t), (e = e.sibling));
        }
        function vu(e, t) {
            switch (e.tag) {
                case 5:
                case 26:
                    try {
                        var n = e.stateNode;
                        if (t) {
                            var r = n.style;
                            typeof r.setProperty == `function`
                                ? r.setProperty(`display`, `none`, `important`)
                                : (r.display = `none`);
                        } else {
                            var i = e.stateNode,
                                a = e.memoizedProps.style,
                                o =
                                    a != null && a.hasOwnProperty(`display`)
                                        ? a.display
                                        : null;
                            i.style.display =
                                o == null || typeof o == `boolean`
                                    ? ``
                                    : (`` + o).trim();
                        }
                    } catch (t) {
                        Z(e, e.return, t);
                    }
                    yu(e, t);
                    break;
                case 6:
                    try {
                        ((e.stateNode.nodeValue = t ? `` : e.memoizedProps), (O = !0));
                    } catch (t) {
                        Z(e, e.return, t);
                    }
                    break;
                case 18:
                    try {
                        var s = e.stateNode;
                        t ? wp(s, !0) : wp(e.stateNode, !1);
                    } catch (t) {
                        Z(e, e.return, t);
                    }
                    break;
                case 22:
                case 23:
                    e.memoizedState === null && _u(e, t);
                    break;
                default:
                    _u(e, t);
            }
        }
        function yu(e, t) {
            if (e.subtreeFlags & 67108864)
                for (e = e.child; e !== null;) {
                    a: {
                        var n = e,
                            r = t;
                        switch (n.tag) {
                            case 4:
                                vu(n, r);
                                break a;
                            case 22:
                                n.memoizedState === null && yu(n, r);
                                break a;
                            default:
                                yu(n, r);
                        }
                    }
                    e = e.sibling;
                }
        }
        function bu(e) {
            var t = e.alternate;
            (t !== null && ((e.alternate = null), bu(t)),
                (e.child = null),
                (e.deletions = null),
                (e.sibling = null),
                e.tag === 5 && ((t = e.stateNode), t !== null && Ht(t)),
                (e.stateNode = null),
                (e.return = null),
                (e.dependencies = null),
                (e.memoizedProps = null),
                (e.memoizedState = null),
                (e.pendingProps = null),
                (e.stateNode = null),
                (e.updateQueue = null));
        }
        var G = null,
            xu = !1;
        function Su(e, t, n) {
            for (n = n.child; n !== null;) (Cu(e, t, n), (n = n.sibling));
        }
        function Cu(e, t, n) {
            if (ct && typeof ct.onCommitFiberUnmount == `function`)
                try {
                    ct.onCommitFiberUnmount(st, n);
                } catch {}
            switch (n.tag) {
                case 26:
                    (W || Dl(n, t),
                        Su(e, t, n),
                        n.memoizedState
                            ? n.memoizedState.count--
                            : n.stateNode &&
                              !W &&
                              ((n = n.stateNode), n.parentNode.removeChild(n)));
                    break;
                case 27:
                    (W || Dl(n, t), Al(n));
                    var r = G,
                        i = xu;
                    (Sp(n.type) && ((G = n.stateNode), (xu = !1)),
                        Su(e, t, n),
                        gm(n.stateNode, n.type, n.memoizedProps),
                        (G = r),
                        (xu = i));
                    break;
                case 5:
                    (W || Dl(n, t), Al(n));
                case 6:
                    if (
                        (n.tag === 6 && Al(n),
                        (r = G),
                        (i = xu),
                        (G = null),
                        Su(e, t, n),
                        (G = r),
                        (xu = i),
                        G !== null)
                    ) {
                        if (xu)
                            try {
                                ((G.nodeType === 9
                                    ? G.body
                                    : G.nodeName === `HTML`
                                      ? G.ownerDocument.body
                                      : G
                                ).removeChild(n.stateNode),
                                    (O = !0));
                            } catch (e) {
                                Z(n, t, e);
                            }
                        else
                            try {
                                (G.removeChild(n.stateNode), (O = !0));
                            } catch (e) {
                                Z(n, t, e);
                            }
                    }
                    break;
                case 18:
                    G !== null &&
                        (xu
                            ? ((e = G),
                              Cp(
                                  e.nodeType === 9
                                      ? e.body
                                      : e.nodeName === `HTML`
                                        ? e.ownerDocument.body
                                        : e,
                                  n.stateNode,
                              ),
                              Hh(e))
                            : Cp(G, n.stateNode));
                    break;
                case 4:
                    ((r = G),
                        (i = xu),
                        (G = n.stateNode.containerInfo),
                        (xu = !0),
                        Su(e, t, n),
                        (G = r),
                        (xu = i));
                    break;
                case 0:
                case 11:
                case 14:
                case 15:
                    (Cl(2, n, t), W || Cl(4, n, t), Su(e, t, n));
                    break;
                case 1:
                    (W ||
                        (Dl(n, t),
                        (r = n.stateNode),
                        typeof r.componentWillUnmount == `function` && Tl(n, t, r)),
                        Su(e, t, n));
                    break;
                case 21:
                    Su(e, t, n);
                    break;
                case 22:
                    ((W = (r = W) || n.memoizedState !== null), Su(e, t, n), (W = r));
                    break;
                case 30:
                    (Dl(n, t), Su(e, t, n));
                    break;
                case 7:
                    (W || Dl(n, t), Su(e, t, n));
                    break;
                default:
                    Su(e, t, n);
            }
        }
        function wu(e, t) {
            if (
                t.memoizedState === null &&
                ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
            ) {
                e = e.dehydrated;
                try {
                    Hh(e);
                } catch (e) {
                    Z(t, t.return, e);
                }
            }
        }
        function Tu(e, t) {
            if (
                t.memoizedState === null &&
                ((e = t.alternate),
                e !== null &&
                    ((e = e.memoizedState),
                    e !== null && ((e = e.dehydrated), e !== null)))
            )
                try {
                    Hh(e);
                } catch (e) {
                    Z(t, t.return, e);
                }
        }
        function Eu(e) {
            switch (e.tag) {
                case 31:
                case 13:
                case 19:
                    var t = e.stateNode;
                    return (t === null && (t = e.stateNode = new cu()), t);
                case 22:
                    return (
                        (e = e.stateNode),
                        (t = e._retryCache),
                        t === null && (t = e._retryCache = new cu()),
                        t
                    );
                default:
                    throw Error(i(435, e.tag));
            }
        }
        function Du(e, t) {
            var n = Eu(e);
            t.forEach(function (t) {
                if (!n.has(t)) {
                    n.add(t);
                    var r = vf.bind(null, e, t);
                    t.then(r, r);
                }
            });
        }
        function Ou(e, t, n) {
            var r = t.deletions;
            if (r !== null)
                for (var a = 0; a < r.length; a++) {
                    var o = r[a],
                        s = e,
                        c = t,
                        l = c;
                    a: for (; l !== null;) {
                        switch (l.tag) {
                            case 27:
                                if (Sp(l.type)) {
                                    ((G = l.stateNode), (xu = !1));
                                    break a;
                                }
                                break;
                            case 5:
                                ((G = l.stateNode), (xu = !1));
                                break a;
                            case 3:
                            case 4:
                                ((G = l.stateNode.containerInfo), (xu = !0));
                                break a;
                        }
                        l = l.return;
                    }
                    if (G === null) throw Error(i(160));
                    (Cu(s, c, o),
                        (G = null),
                        (xu = !1),
                        (s = o.alternate),
                        s !== null && (s.return = null),
                        (o.return = null));
                }
            if (t.subtreeFlags & 13886)
                for (t = t.child; t !== null;) (Au(t, e, n), (t = t.sibling));
        }
        var ku = null;
        function Au(e, t, n) {
            var r = e.alternate,
                a = e.flags;
            switch (e.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                    if (
                        a & 4 &&
                        ((r = e.updateQueue),
                        (r = r === null ? null : r.events),
                        r !== null)
                    )
                        for (var o = 0; o < r.length; o++) {
                            var s = r[o];
                            s.ref.impl = s.nextImpl;
                        }
                    (Ou(t, e, n),
                        ju(e),
                        a & 4 && (Cl(3, e, e.return), Sl(3, e), Cl(5, e, e.return)));
                    break;
                case 1:
                    (Ou(t, e, n),
                        ju(e),
                        a & 512 && (W || r === null || Dl(r, r.return)),
                        a & 64 &&
                            au &&
                            ((e = e.updateQueue),
                            e !== null &&
                                ((t = e.callbacks),
                                t !== null &&
                                    ((n = e.shared.hiddenCallbacks),
                                    (e.shared.hiddenCallbacks =
                                        n === null ? t : n.concat(t))))));
                    break;
                case 26:
                    if (
                        ((o = ku),
                        Ou(t, e, n),
                        ju(e),
                        a & 512 && (W || r === null || Dl(r, r.return)),
                        a & 4)
                    ) {
                        if (
                            ((a = r === null ? null : r.memoizedState),
                            (n = e.memoizedState),
                            r === null)
                        ) {
                            if (n === null) {
                                if (e.stateNode === null) {
                                    if (au)
                                        e.stateNode = fp(
                                            e.type,
                                            e.memoizedProps,
                                            t.containerInfo,
                                            e,
                                        );
                                    else {
                                        a: {
                                            ((t = e.type),
                                                (n = e.memoizedProps),
                                                (a = o.ownerDocument || o));
                                            b: switch (t) {
                                                case `title`:
                                                    ((r =
                                                        a.getElementsByTagName(
                                                            `title`,
                                                        )[0]),
                                                        (!r ||
                                                            r[Bt] ||
                                                            r[Pt] ||
                                                            r.namespaceURI ===
                                                                `http://www.w3.org/2000/svg` ||
                                                            r.hasAttribute(
                                                                `itemprop`,
                                                            )) &&
                                                            ((r = a.createElement(t)),
                                                            a.head.insertBefore(
                                                                r,
                                                                a.querySelector(
                                                                    `head > title`,
                                                                ),
                                                            )),
                                                        np(r, t, n),
                                                        (r[Pt] = e),
                                                        qt(r),
                                                        (t = r));
                                                    break a;
                                                case `link`:
                                                    if (
                                                        (o = Gm(`link`, `href`, a).get(
                                                            t + (n.href || ``),
                                                        ))
                                                    ) {
                                                        for (s = 0; s < o.length; s++)
                                                            if (
                                                                ((r = o[s]),
                                                                r.getAttribute(
                                                                    `href`,
                                                                ) ===
                                                                    (n.href == null ||
                                                                    n.href === ``
                                                                        ? null
                                                                        : n.href) &&
                                                                    r.getAttribute(
                                                                        `rel`,
                                                                    ) ===
                                                                        (n.rel == null
                                                                            ? null
                                                                            : n.rel) &&
                                                                    r.getAttribute(
                                                                        `title`,
                                                                    ) ===
                                                                        (n.title == null
                                                                            ? null
                                                                            : n.title) &&
                                                                    r.getAttribute(
                                                                        `crossorigin`,
                                                                    ) ===
                                                                        (n.crossOrigin ==
                                                                        null
                                                                            ? null
                                                                            : n.crossOrigin))
                                                            ) {
                                                                o.splice(s, 1);
                                                                break b;
                                                            }
                                                    }
                                                    ((r = a.createElement(t)),
                                                        np(r, t, n),
                                                        a.head.appendChild(r));
                                                    break;
                                                case `meta`:
                                                    if (
                                                        (o = Gm(
                                                            `meta`,
                                                            `content`,
                                                            a,
                                                        ).get(t + (n.content || ``)))
                                                    ) {
                                                        for (s = 0; s < o.length; s++)
                                                            if (
                                                                ((r = o[s]),
                                                                r.getAttribute(
                                                                    `content`,
                                                                ) ===
                                                                    (n.content == null
                                                                        ? null
                                                                        : `` +
                                                                          n.content) &&
                                                                    r.getAttribute(
                                                                        `name`,
                                                                    ) ===
                                                                        (n.name == null
                                                                            ? null
                                                                            : n.name) &&
                                                                    r.getAttribute(
                                                                        `property`,
                                                                    ) ===
                                                                        (n.property ==
                                                                        null
                                                                            ? null
                                                                            : n.property) &&
                                                                    r.getAttribute(
                                                                        `http-equiv`,
                                                                    ) ===
                                                                        (n.httpEquiv ==
                                                                        null
                                                                            ? null
                                                                            : n.httpEquiv) &&
                                                                    r.getAttribute(
                                                                        `charset`,
                                                                    ) ===
                                                                        (n.charSet ==
                                                                        null
                                                                            ? null
                                                                            : n.charSet))
                                                            ) {
                                                                o.splice(s, 1);
                                                                break b;
                                                            }
                                                    }
                                                    ((r = a.createElement(t)),
                                                        np(r, t, n),
                                                        a.head.appendChild(r));
                                                    break;
                                                default:
                                                    throw Error(i(468, t));
                                            }
                                            ((r[Pt] = e), qt(r), (t = r));
                                        }
                                        e.stateNode = t;
                                    }
                                } else au || Km(o, e.type, e.stateNode);
                            } else e.stateNode = Bm(o, n, e.memoizedProps);
                        } else
                            a === n
                                ? n === null &&
                                  e.stateNode !== null &&
                                  Pl(e, e.memoizedProps, r.memoizedProps)
                                : (a === null
                                      ? ((t = r.stateNode),
                                        t === null || W || t.parentNode.removeChild(t))
                                      : a.count--,
                                  n === null
                                      ? au || Km(o, e.type, e.stateNode)
                                      : Bm(o, n, e.memoizedProps));
                    }
                    break;
                case 27:
                    (Ou(t, e, n),
                        ju(e),
                        a & 512 && (W || r === null || Dl(r, r.return)),
                        r !== null && a & 4 && Pl(e, e.memoizedProps, r.memoizedProps));
                    break;
                case 5:
                    if (
                        ((o = ou),
                        (ou = !1),
                        Ou(t, e, n),
                        (ou = o),
                        ju(e),
                        a & 512 && (W || r === null || Dl(r, r.return)),
                        e.flags & 32)
                    ) {
                        t = e.stateNode;
                        try {
                            (xn(t, ``), (O = !0));
                        } catch (t) {
                            Z(e, e.return, t);
                        }
                    }
                    (a & 4 &&
                        e.stateNode != null &&
                        ((t = e.memoizedProps),
                        Pl(e, t, r === null ? t : r.memoizedProps)),
                        a & 1024 && (su = !0));
                    break;
                case 6:
                    if ((Ou(t, e, n), ju(e), a & 4)) {
                        if (e.stateNode === null) throw Error(i(162));
                        ((t = e.memoizedProps), (n = e.stateNode));
                        try {
                            ((n.nodeValue = t), (O = !0));
                        } catch (t) {
                            Z(e, e.return, t);
                        }
                    }
                    break;
                case 3:
                    if (
                        ((O = !1),
                        (Wm = null),
                        (o = ku),
                        (ku = bm(t.containerInfo)),
                        Ou(t, e, n),
                        (ku = o),
                        ju(e),
                        a & 4 && r !== null && r.memoizedState.isDehydrated)
                    )
                        try {
                            Hh(t.containerInfo);
                        } catch (t) {
                            Z(e, e.return, t);
                        }
                    (su && ((su = !1), Mu(e)), (O = !1));
                    break;
                case 4:
                    ((a = ou),
                        (ou = au),
                        (r = rn()),
                        (o = ku),
                        (ku = bm(e.stateNode.containerInfo)),
                        Ou(t, e, n),
                        ju(e),
                        (ku = o),
                        O && du && (fu = !0),
                        (O = r),
                        (ou = a));
                    break;
                case 12:
                    (Ou(t, e, n), ju(e));
                    break;
                case 31:
                    (Ou(t, e, n),
                        ju(e),
                        a & 4 &&
                            ((t = e.updateQueue),
                            t !== null && ((e.updateQueue = null), Du(e, t))));
                    break;
                case 13:
                    (Ou(t, e, n),
                        ju(e),
                        e.child.flags & 8192 &&
                            (e.memoizedState !== null) !=
                                (r !== null && r.memoizedState !== null) &&
                            (md = Qe()),
                        a & 4 &&
                            ((t = e.updateQueue),
                            t !== null && ((e.updateQueue = null), Du(e, t))));
                    break;
                case 22:
                    ((o = e.memoizedState !== null),
                        (s = r !== null && r.memoizedState !== null));
                    var c = au,
                        l = W,
                        u = ou;
                    ((au = c || o),
                        (ou = u || o),
                        (W = l || s),
                        Ou(t, e, n),
                        (W = l),
                        (ou = u),
                        (au = c),
                        ju(e),
                        a & 8192 &&
                            ((t = e.stateNode),
                            (t._visibility = o
                                ? t._visibility & -2
                                : t._visibility | 1),
                            !o ||
                                r === null ||
                                s ||
                                au ||
                                W ||
                                ((t = s || W),
                                (n = au),
                                (r = W),
                                (au = o || au),
                                (W = t),
                                Iu(e, 2),
                                (au = n),
                                (W = r)),
                            (!o && ou) || _u(e, o)),
                        a & 4 &&
                            ((t = e.updateQueue),
                            t !== null &&
                                ((n = t.retryQueue),
                                n !== null && ((t.retryQueue = null), Du(e, n)))));
                    break;
                case 19:
                    (Ou(t, e, n),
                        ju(e),
                        a & 4 &&
                            ((t = e.updateQueue),
                            t !== null && ((e.updateQueue = null), Du(e, t))));
                    break;
                case 30:
                    (a & 512 && (W || r === null || Dl(r, r.return)),
                        (a = rn()),
                        (o = du),
                        (s = (n & 335544064) === n),
                        (c = e.memoizedProps),
                        (du = s && Oi(c.default, c.update) !== `none`),
                        Ou(t, e, n),
                        ju(e),
                        s && r !== null && O && (e.flags |= 4),
                        (du = o),
                        (O = a));
                    break;
                case 21:
                    break;
                case 7:
                    (a & 512 && (W || r === null || Dl(r, r.return)),
                        r && r.stateNode !== null && (r.stateNode._fragmentFiber = e));
                default:
                    (Ou(t, e, n), ju(e));
            }
        }
        function ju(e) {
            var t = e.flags;
            if (t & 2) {
                try {
                    for (var n, r = e.return; r !== null;) {
                        if (Fl(r)) {
                            n = r;
                            break;
                        }
                        r = r.return;
                    }
                    r = null;
                    for (var a = e.return; a !== null;) {
                        if (Ml(a)) {
                            var o = a.stateNode;
                            r === null ? (r = [o]) : r.push(o);
                        }
                        if (jl(a)) break;
                        a = a.return;
                    }
                    var s = r;
                    if (n == null) throw Error(i(160));
                    switch (n.tag) {
                        case 27:
                            var c = n.stateNode;
                            Rl(e, Il(e), c, s);
                            break;
                        case 5:
                            var l = n.stateNode;
                            (n.flags & 32 && (xn(l, ``), (n.flags &= -33)),
                                Rl(e, Il(e), l, s));
                            break;
                        case 3:
                        case 4:
                            var u = n.stateNode.containerInfo;
                            Ll(e, Il(e), u, s);
                            break;
                        default:
                            throw Error(i(161));
                    }
                } catch (t) {
                    Z(e, e.return, t);
                }
                e.flags &= -3;
            }
            t & 4096 && (e.flags &= -4097);
        }
        function Mu(e) {
            if (e.subtreeFlags & 1024)
                for (e = e.child; e !== null;) {
                    var t = e;
                    (Mu(t),
                        t.tag === 5 &&
                            t.flags & 1024 &&
                            ((t = t.stateNode), (gh = !0), t.reset(), (gh = !1)),
                        (e = e.sibling));
                }
        }
        function Nu(e, t) {
            if (t.subtreeFlags & 9270)
                for (t = t.child; t !== null;) (Pu(t, e), (t = t.sibling));
            else iu(t, !1);
        }
        function Pu(e, t) {
            var n = e.alternate;
            if (n === null) Xl(e, !1);
            else
                switch (e.tag) {
                    case 3:
                        if (((pu = uu = !1), Wl(), Nu(t, e), !uu && !fu)) {
                            if (((e = Ul), e !== null))
                                for (var r = 0; r < e.length; r += 3) {
                                    n = e[r];
                                    var i = e[r + 1];
                                    (Ep(n, e[r + 2]),
                                        (n = n.ownerDocument.documentElement),
                                        n !== null &&
                                            n.animate(
                                                {
                                                    opacity: [0, 0],
                                                    pointerEvents: [`none`, `none`],
                                                },
                                                {
                                                    duration: 0,
                                                    fill: `forwards`,
                                                    pseudoElement:
                                                        `::view-transition-group(` +
                                                        i +
                                                        `)`,
                                                },
                                            ));
                                }
                            ((e = t.containerInfo),
                                (e =
                                    e.nodeType === 9
                                        ? e.documentElement
                                        : e.ownerDocument.documentElement),
                                e !== null &&
                                    e.style.viewTransitionName === `` &&
                                    ((e.style.viewTransitionName = `none`),
                                    e.animate(
                                        {
                                            opacity: [0, 0],
                                            pointerEvents: [`none`, `none`],
                                        },
                                        {
                                            duration: 0,
                                            fill: `forwards`,
                                            pseudoElement: `::view-transition-group(root)`,
                                        },
                                    ),
                                    e.animate(
                                        { width: [0, 0], height: [0, 0] },
                                        {
                                            duration: 0,
                                            fill: `forwards`,
                                            pseudoElement: `::view-transition`,
                                        },
                                    )),
                                (pu = !0));
                        }
                        Ul = null;
                        break;
                    case 5:
                        Nu(t, e);
                        break;
                    case 4:
                        ((r = uu), (uu = !1), Nu(t, e), uu && (fu = !0), (uu = r));
                        break;
                    case 22:
                        e.memoizedState === null &&
                            (n.memoizedState === null ? Nu(t, e) : Xl(e, !1));
                        break;
                    case 30:
                        ((r = uu),
                            (i = Wl()),
                            (uu = !1),
                            Nu(t, e),
                            uu && (e.flags |= 4));
                        var a = e.memoizedProps,
                            o = e.stateNode;
                        ((t = Ei(a, o)), (o = Ei(n.memoizedProps, o)));
                        var s = Oi(a.default, a.update);
                        (s === `none`
                            ? (t = !1)
                            : ((a = n.memoizedState),
                              (n.memoizedState = null),
                              (n = e.child),
                              (Gl = 0),
                              (t = ru(e, n, t, o, s, a, !0)),
                              Gl !== (a === null ? 0 : a.length) && (e.flags |= 32)),
                            e.flags & 4 && t
                                ? (Nd(e, e.memoizedProps.onUpdate), (Ul = i))
                                : i !== null && (i.push.apply(i, Ul), (Ul = i)),
                            (uu = e.flags & 32 ? !0 : r));
                        break;
                    default:
                        Nu(t, e);
                }
        }
        function Fu(e, t) {
            if (t.subtreeFlags & 8772)
                for (t = t.child; t !== null;) (gu(e, t.alternate, t), (t = t.sibling));
        }
        function Iu(e, t) {
            for (e = e.child; e !== null;) {
                var n = e,
                    r = t;
                switch (n.tag) {
                    case 0:
                    case 11:
                    case 14:
                    case 15:
                        (Cl(4, n, n.return), Iu(n, r));
                        break;
                    case 1:
                        Dl(n, n.return);
                        var i = n.stateNode;
                        (typeof i.componentWillUnmount == `function` &&
                            Tl(n, n.return, i),
                            Iu(n, r));
                        break;
                    case 27:
                        r & 2 && gm(n.stateNode, n.type, n.memoizedProps);
                    case 5:
                        (Dl(n, n.return),
                            (n.tag !== 5 && n.tag !== 27) || Al(n),
                            Iu(n, r));
                        break;
                    case 6:
                        Al(n);
                        break;
                    case 26:
                        (Dl(n, n.return),
                            (i = n.stateNode),
                            n.memoizedState !== null ||
                                i === null ||
                                W ||
                                i.parentNode.removeChild(i),
                            Iu(n, r));
                        break;
                    case 22:
                        n.memoizedState === null && Iu(n, r);
                        break;
                    case 30:
                        (Dl(n, n.return), Iu(n, r));
                        break;
                    case 7:
                        Dl(n, n.return);
                    default:
                        Iu(n, r);
                }
                e = e.sibling;
            }
        }
        function Lu(e, t, n) {
            for (n = t.subtreeFlags & 8772 ? n : n & -2, t = t.child; t !== null;) {
                var r = t.alternate,
                    i = e,
                    a = t,
                    o = a.flags,
                    s = !!(n & 1);
                switch (a.tag) {
                    case 0:
                    case 11:
                    case 15:
                        (Lu(i, a, n), Sl(4, a));
                        break;
                    case 1:
                        if (
                            (Lu(i, a, n),
                            (r = a),
                            (i = r.stateNode),
                            typeof i.componentDidMount == `function`)
                        )
                            try {
                                i.componentDidMount();
                            } catch (e) {
                                Z(r, r.return, e);
                            }
                        if (((r = a), (i = r.updateQueue), i !== null)) {
                            var c = r.stateNode;
                            try {
                                var l = i.shared.hiddenCallbacks;
                                if (l !== null)
                                    for (
                                        i.shared.hiddenCallbacks = null, i = 0;
                                        i < l.length;
                                        i++
                                    )
                                        wo(l[i], c);
                            } catch (e) {
                                Z(r, r.return, e);
                            }
                        }
                        (s && o & 64 && wl(a), El(a, a.return));
                        break;
                    case 27:
                        n & 2 && zl(a);
                    case 5:
                        ((a.tag !== 5 && a.tag !== 27) || kl(a),
                            Lu(i, a, n),
                            s && r === null && o & 4 && Nl(a),
                            El(a, a.return));
                        break;
                    case 6:
                        kl(a);
                        break;
                    case 26:
                        ((c = a.stateNode),
                            a.memoizedState !== null ||
                                c === null ||
                                au ||
                                Km(bm(c.ownerDocument), a.type, c),
                            Lu(i, a, n),
                            s && r === null && o & 4 && Nl(a),
                            El(a, a.return));
                        break;
                    case 12:
                        Lu(i, a, n);
                        break;
                    case 31:
                        (Lu(i, a, n), s && o & 4 && wu(i, a));
                        break;
                    case 13:
                        (Lu(i, a, n), s && o & 4 && Tu(i, a));
                        break;
                    case 22:
                        (a.memoizedState === null && Lu(i, a, n), El(a, a.return));
                        break;
                    case 30:
                        (Lu(i, a, n), El(a, a.return));
                        break;
                    case 7:
                        El(a, a.return);
                    default:
                        Lu(i, a, n);
                }
                t = t.sibling;
            }
        }
        function Ru(e, t) {
            var n = null;
            (e !== null &&
                e.memoizedState !== null &&
                e.memoizedState.cachePool !== null &&
                (n = e.memoizedState.cachePool.pool),
                (e = null),
                t.memoizedState !== null &&
                    t.memoizedState.cachePool !== null &&
                    (e = t.memoizedState.cachePool.pool),
                e !== n && (e != null && e.refCount++, n != null && Na(n)));
        }
        function zu(e, t) {
            ((e = null),
                t.alternate !== null && (e = t.alternate.memoizedState.cache),
                (t = t.memoizedState.cache),
                t !== e && (t.refCount++, e != null && Na(e)));
        }
        function Bu(e, t, n, r) {
            var i = (n & 335544064) === n;
            if (t.subtreeFlags & (i ? 10262 : 10256))
                for (t = t.child; t !== null;) (Vu(e, t, n, r), (t = t.sibling));
            else i && nu(t);
        }
        function Vu(e, t, n, r) {
            var i = (n & 335544064) === n;
            i &&
                t.alternate === null &&
                t.return !== null &&
                t.return.alternate !== null &&
                tu(t);
            var a = t.flags;
            switch (t.tag) {
                case 0:
                case 11:
                case 15:
                    (Bu(e, t, n, r), a & 2048 && Sl(9, t));
                    break;
                case 1:
                    Bu(e, t, n, r);
                    break;
                case 3:
                    (Bu(e, t, n, r),
                        i &&
                            pu &&
                            ((e = e.containerInfo),
                            (e =
                                e.nodeType === 9
                                    ? e.body
                                    : e.nodeName === `HTML`
                                      ? e.ownerDocument.body
                                      : e),
                            e.style.viewTransitionName === `root` &&
                                (e.style.viewTransitionName = ``),
                            (e = e.ownerDocument.documentElement),
                            e !== null &&
                                e.style.viewTransitionName === `none` &&
                                (e.style.viewTransitionName = ``)),
                        a & 2048 &&
                            ((a = null),
                            t.alternate !== null &&
                                (a = t.alternate.memoizedState.cache),
                            (t = t.memoizedState.cache),
                            t !== a && (t.refCount++, a != null && Na(a))));
                    break;
                case 12:
                    if (a & 2048) {
                        (Bu(e, t, n, r), (a = t.stateNode));
                        try {
                            var o = t.memoizedProps,
                                s = o.id,
                                c = o.onPostCommit;
                            typeof c == `function` &&
                                c(
                                    s,
                                    t.alternate === null ? `mount` : `update`,
                                    a.passiveEffectDuration,
                                    -0,
                                );
                        } catch (e) {
                            Z(t, t.return, e);
                        }
                    } else Bu(e, t, n, r);
                    break;
                case 31:
                    Bu(e, t, n, r);
                    break;
                case 13:
                    Bu(e, t, n, r);
                    break;
                case 23:
                    break;
                case 22:
                    ((o = t.stateNode),
                        (s = t.alternate),
                        t.memoizedState === null
                            ? (i && s !== null && s.memoizedState !== null && tu(t),
                              o._visibility & 2
                                  ? Bu(e, t, n, r)
                                  : ((o._visibility |= 2),
                                    Hu(e, t, n, r, !!(t.subtreeFlags & 10256) || !1)))
                            : (i && s !== null && s.memoizedState === null && tu(s),
                              o._visibility & 2 ? Bu(e, t, n, r) : Uu(e, t)),
                        a & 2048 && Ru(s, t));
                    break;
                case 24:
                    (Bu(e, t, n, r), a & 2048 && zu(t.alternate, t));
                    break;
                case 30:
                    (i &&
                        ((a = t.alternate),
                        a !== null && (Jl(a.child, !0), Jl(t.child, !0))),
                        Bu(e, t, n, r));
                    break;
                default:
                    Bu(e, t, n, r);
            }
        }
        function Hu(e, t, n, r, i) {
            for (i &&= !!(t.subtreeFlags & 10256) || !1, t = t.child; t !== null;) {
                var a = e,
                    o = t,
                    s = n,
                    c = r,
                    l = o.flags;
                switch (o.tag) {
                    case 0:
                    case 11:
                    case 15:
                        (Hu(a, o, s, c, i), Sl(8, o));
                        break;
                    case 23:
                        break;
                    case 22:
                        var u = o.stateNode;
                        (o.memoizedState === null
                            ? ((u._visibility |= 2), Hu(a, o, s, c, i))
                            : u._visibility & 2
                              ? Hu(a, o, s, c, i)
                              : Uu(a, o),
                            i && l & 2048 && Ru(o.alternate, o));
                        break;
                    case 24:
                        (Hu(a, o, s, c, i), i && l & 2048 && zu(o.alternate, o));
                        break;
                    default:
                        Hu(a, o, s, c, i);
                }
                t = t.sibling;
            }
        }
        function Uu(e, t) {
            if (t.subtreeFlags & 10256)
                for (t = t.child; t !== null;) {
                    var n = e,
                        r = t,
                        i = r.flags;
                    switch (r.tag) {
                        case 22:
                            (Uu(n, r), i & 2048 && Ru(r.alternate, r));
                            break;
                        case 24:
                            (Uu(n, r), i & 2048 && zu(r.alternate, r));
                            break;
                        default:
                            Uu(n, r);
                    }
                    t = t.sibling;
                }
        }
        var Wu = 8192;
        function Gu(e, t, n) {
            if (e.subtreeFlags & Wu)
                for (e = e.child; e !== null;) (Ku(e, t, n), (e = e.sibling));
        }
        function Ku(e, t, n) {
            switch (e.tag) {
                case 26:
                    (Gu(e, t, n),
                        e.flags & Wu &&
                            (e.memoizedState === null
                                ? ((e = e.stateNode), (t & 335544128) === t && Zm(n, e))
                                : Qm(n, ku, e.memoizedState, e.memoizedProps)));
                    break;
                case 5:
                    (Gu(e, t, n),
                        e.flags & Wu &&
                            ((e = e.stateNode), (t & 335544128) === t && Zm(n, e)));
                    break;
                case 3:
                case 4:
                    var r = ku;
                    ((ku = bm(e.stateNode.containerInfo)), Gu(e, t, n), (ku = r));
                    break;
                case 22:
                    e.memoizedState === null &&
                        ((r = e.alternate),
                        r !== null && r.memoizedState !== null
                            ? ((r = Wu), (Wu = 16777216), Gu(e, t, n), (Wu = r))
                            : Gu(e, t, n));
                    break;
                case 30:
                    if (
                        (e.flags & Wu) !== 0 &&
                        ((r = e.memoizedProps.name), r != null && r !== `auto`)
                    ) {
                        var i = e.stateNode;
                        ((i.paired = null),
                            Vl === null && (Vl = new Map()),
                            Vl.set(r, i));
                    }
                    Gu(e, t, n);
                    break;
                default:
                    Gu(e, t, n);
            }
        }
        function qu(e) {
            var t = e.alternate;
            if (t !== null && ((e = t.child), e !== null)) {
                t.child = null;
                do ((t = e.sibling), (e.sibling = null), (e = t));
                while (e !== null);
            }
        }
        function Ju(e) {
            var t = e.deletions;
            if (e.flags & 16) {
                if (t !== null)
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        ((lu = r), Zu(r, e));
                    }
                qu(e);
            }
            if (e.subtreeFlags & 10256)
                for (e = e.child; e !== null;) (Yu(e), (e = e.sibling));
        }
        function Yu(e) {
            switch (e.tag) {
                case 0:
                case 11:
                case 15:
                    (Ju(e), e.flags & 2048 && Cl(9, e, e.return));
                    break;
                case 3:
                    Ju(e);
                    break;
                case 12:
                    Ju(e);
                    break;
                case 22:
                    var t = e.stateNode;
                    e.memoizedState !== null &&
                    t._visibility & 2 &&
                    (e.return === null || e.return.tag !== 13)
                        ? ((t._visibility &= -3), Xu(e))
                        : Ju(e);
                    break;
                default:
                    Ju(e);
            }
        }
        function Xu(e) {
            var t = e.deletions;
            if (e.flags & 16) {
                if (t !== null)
                    for (var n = 0; n < t.length; n++) {
                        var r = t[n];
                        ((lu = r), Zu(r, e));
                    }
                qu(e);
            }
            for (e = e.child; e !== null;) {
                switch (((t = e), t.tag)) {
                    case 0:
                    case 11:
                    case 15:
                        (Cl(8, t, t.return), Xu(t));
                        break;
                    case 22:
                        ((n = t.stateNode),
                            n._visibility & 2 && ((n._visibility &= -3), Xu(t)));
                        break;
                    default:
                        Xu(t);
                }
                e = e.sibling;
            }
        }
        function Zu(e, t) {
            for (; lu !== null;) {
                var n = lu;
                switch (n.tag) {
                    case 0:
                    case 11:
                    case 15:
                        Cl(8, n, t);
                        break;
                    case 23:
                    case 22:
                        if (
                            n.memoizedState !== null &&
                            n.memoizedState.cachePool !== null
                        ) {
                            var r = n.memoizedState.cachePool.pool;
                            r != null && r.refCount++;
                        }
                        break;
                    case 24:
                        Na(n.memoizedState.cache);
                }
                if (((r = n.child), r !== null)) ((r.return = n), (lu = r));
                else
                    a: for (n = e; lu !== null;) {
                        r = lu;
                        var i = r.sibling,
                            a = r.return;
                        if ((bu(r), r === n)) {
                            lu = null;
                            break a;
                        }
                        if (i !== null) {
                            ((i.return = a), (lu = i));
                            break a;
                        }
                        lu = a;
                    }
            }
        }
        var Qu = {
                getCacheForType: function (e) {
                    var t = z(B),
                        n = t.data.get(e);
                    return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
                },
                cacheSignal: function () {
                    return z(B).controller.signal;
                },
            },
            $u = typeof WeakMap == `function` ? WeakMap : Map,
            K = 0,
            q = null,
            J = null,
            Y = 0,
            X = 0,
            ed = null,
            td = !1,
            nd = !1,
            rd = !1,
            id = 0,
            ad = 0,
            od = 0,
            sd = 0,
            cd = 0,
            ld = 0,
            ud = 0,
            dd = null,
            fd = null,
            pd = !1,
            md = 0,
            hd = 0,
            gd = 1 / 0,
            _d = null,
            vd = null,
            yd = 0,
            bd = null,
            xd = null,
            Sd = 0,
            Cd = 0,
            wd = null,
            Td = null,
            Ed = null,
            Dd = null,
            Od = null,
            kd = 0,
            Ad = null;
        function jd() {
            return K & 2 && Y !== 0 ? Y & -Y : w.T === null ? jt() : Pf();
        }
        function Md() {
            if (ld === 0) {
                if (!(Y & 536870912) || R) {
                    var e = ht;
                    ((ht <<= 1), !(ht & 3932160) && (ht = 262144), (ld = e));
                } else ld = 536870912;
            }
            return ((e = jo.current), e !== null && (e.flags |= 32), ld);
        }
        function Nd(e, t) {
            if (t != null) {
                var n = e.stateNode,
                    r = n.ref;
                (r === null && (r = n.ref = Pp(Ei(e.memoizedProps, n))),
                    Dd === null && (Dd = []),
                    Dd.push(t.bind(null, r)));
            }
        }
        function Pd(e, t, n) {
            (((e === q && (X === 2 || X === 9)) || e.cancelPendingCommit !== null) &&
                (Vd(e, 0), Rd(e, Y, ld, !1)),
                wt(e, n),
                (!(K & 2) || e !== q) &&
                    (e === q && (!(K & 2) && (sd |= n), ad === 4 && Rd(e, Y, ld, !1)),
                    Ef(e)));
        }
        function Fd(e, t, n) {
            if (K & 6) throw Error(i(327));
            var r = (!n && !(t & 127) && (t & e.expiredLanes) === 0) || yt(e, t),
                a = r ? Yd(e, t) : qd(e, t, !0),
                o = r;
            do {
                if (a === 0) {
                    nd && !r && Rd(e, t, 0, !1);
                    break;
                }
                if (((n = e.current.alternate), o && !Ld(n))) {
                    ((a = qd(e, t, !1)), (o = !1));
                    continue;
                }
                if (a === 2) {
                    if (((o = t), e.errorRecoveryDisabledLanes & o)) var s = 0;
                    else
                        ((s = e.pendingLanes & -536870913),
                            (s = s === 0 ? (s & 536870912 ? 536870912 : 0) : s));
                    if (s !== 0) {
                        t = s;
                        a: {
                            var c = e;
                            a = dd;
                            var l = c.current.memoizedState.isDehydrated;
                            if (
                                (l && (Vd(c, s).flags |= 256),
                                (s = qd(c, s, !1)),
                                s !== 2 && s !== 6)
                            ) {
                                if (rd && !l) {
                                    ((c.errorRecoveryDisabledLanes |= o),
                                        (sd |= o),
                                        (a = 4));
                                    break a;
                                }
                                ((o = fd),
                                    (fd = a),
                                    o !== null &&
                                        (fd === null
                                            ? (fd = o)
                                            : fd.push.apply(fd, o)));
                            }
                            a = s;
                        }
                        if (((o = !1), a !== 2)) continue;
                    }
                }
                if (a === 1) {
                    (Vd(e, 0), Rd(e, t, 0, !0));
                    break;
                }
                a: {
                    switch (((r = e), (o = a), o)) {
                        case 0:
                        case 1:
                            throw Error(i(345));
                        case 4:
                            if ((t & 4194048) !== t && (t & 62914560) !== t) break;
                        case 6:
                            Rd(r, t, ld, !td);
                            break a;
                        case 2:
                            fd = null;
                            break;
                        case 3:
                        case 5:
                            break;
                        default:
                            throw Error(i(329));
                    }
                    if ((t & 62914560) === t && ((a = md + 300 - Qe()), 10 < a)) {
                        if ((Rd(r, t, ld, !td), vt(r, 0, !0) !== 0)) break a;
                        ((Sd = t),
                            (r.timeoutHandle = gp(
                                Id.bind(
                                    null,
                                    r,
                                    n,
                                    fd,
                                    _d,
                                    pd,
                                    t,
                                    ld,
                                    sd,
                                    ud,
                                    td,
                                    o,
                                    `Throttled`,
                                    -0,
                                    0,
                                ),
                                a,
                            )));
                        break a;
                    }
                    Id(r, n, fd, _d, pd, t, ld, sd, ud, td, o, null, -0, 0);
                }
                break;
            } while (1);
            Ef(e);
        }
        function Id(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
            e.timeoutHandle = -1;
            var m = t.subtreeFlags,
                h = (a & 335544064) === a;
            if (
                ((d = null),
                (h || m & 8192 || (m & 16785408) == 16785408) &&
                    ((d = {
                        stylesheets: null,
                        count: 0,
                        imgCount: 0,
                        imgBytes: 0,
                        suspenseyImages: [],
                        waitingForImages: !0,
                        waitingForViewTransition: !1,
                        unsuspend: kn,
                    }),
                    (Vl = null),
                    Ku(t, a, d),
                    h &&
                        ((m = d),
                        (h = e.containerInfo),
                        (h = (h.nodeType === 9 ? h : h.ownerDocument)
                            .__reactViewTransition),
                        h != null &&
                            (m.count++,
                            (m.waitingForViewTransition = !0),
                            (m = nh.bind(m)),
                            h.finished.then(m, m))),
                    (m =
                        (a & 62914560) === a
                            ? md - Qe()
                            : (a & 4194048) === a
                              ? hd - Qe()
                              : 0),
                    (m = eh(d, m)),
                    m !== null))
            ) {
                ((Sd = a),
                    (e.cancelPendingCommit = m(
                        nf.bind(null, e, t, a, n, r, i, o, s, c, l, u, d, null, f, p),
                    )),
                    Rd(e, a, o, !l));
                return;
            }
            nf(e, t, a, n, r, i, o, s, c, l, u, d);
        }
        function Ld(e) {
            for (var t = e; ;) {
                var n = t.tag;
                if (
                    (n === 0 || n === 11 || n === 15) &&
                    t.flags & 16384 &&
                    ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
                )
                    for (var r = 0; r < n.length; r++) {
                        var i = n[r],
                            a = i.getSnapshot;
                        i = i.value;
                        try {
                            if (!Qr(a(), i)) return !1;
                        } catch {
                            return !1;
                        }
                    }
                if (((n = t.child), t.subtreeFlags & 16384 && n !== null))
                    ((n.return = t), (t = n));
                else {
                    if (t === e) break;
                    for (; t.sibling === null;) {
                        if (t.return === null || t.return === e) return !0;
                        t = t.return;
                    }
                    ((t.sibling.return = t.return), (t = t.sibling));
                }
            }
            return !0;
        }
        function Rd(e, t, n, r) {
            ((t = bt(e, t)),
                (t &= ~cd),
                (t &= ~sd),
                (e.suspendedLanes |= t),
                (e.pingedLanes &= ~t),
                r && (e.warmLanes |= t),
                (r = e.expirationTimes));
            for (var i = t; 0 < i;) {
                var a = 31 - ut(i),
                    o = 1 << a;
                ((r[a] = -1), (i &= ~o));
            }
            n !== 0 && Et(e, n, t);
        }
        function zd() {
            return K & 6 ? !0 : (Df(0, !1), !1);
        }
        function Bd() {
            if (J !== null) {
                if (X === 0) var e = J.return;
                else ((e = J), (ya = va = null), as(e), (ao = null), (oo = 0), (e = J));
                for (; e !== null;) (xl(e.alternate, e), (e = e.return));
                J = null;
            }
        }
        function Vd(e, t) {
            var n = e.timeoutHandle;
            return (
                n !== -1 && ((e.timeoutHandle = -1), _p(n)),
                (n = e.cancelPendingCommit),
                n !== null && ((e.cancelPendingCommit = null), n()),
                (Sd = 0),
                Bd(),
                (q = e),
                (J = n = Vi(e.current, null)),
                (Y = t),
                (X = 0),
                (ed = null),
                (td = !1),
                (nd = yt(e, t)),
                (rd = !1),
                (ud = ld = cd = sd = od = ad = 0),
                (fd = dd = null),
                (pd = !1),
                (id = bt(e, t)),
                Ni(),
                n
            );
        }
        function Hd(e, t) {
            ((V = null),
                (w.H = hc),
                t === Ya || t === Za
                    ? ((t = ro()), (X = 3))
                    : t === Xa
                      ? ((t = ro()), (X = 4))
                      : (X =
                            t === Nc
                                ? 8
                                : typeof t == `object` &&
                                    t &&
                                    typeof t.then == `function`
                                  ? 6
                                  : 1),
                (ed = t),
                J === null && ((ad = 1), Dc(e, Yi(t, e.current))));
        }
        function Ud() {
            var e = jo.current;
            return e === null
                ? !0
                : (Y & 4194048) === Y
                  ? Mo === null
                  : (Y & 62914560) === Y || Y & 536870912
                    ? e === Mo
                    : !1;
        }
        function Wd() {
            var e = w.H;
            return ((w.H = hc), e === null ? hc : e);
        }
        function Gd() {
            var e = w.A;
            return ((w.A = Qu), e);
        }
        function Kd() {
            ((ad = 4),
                td || ((Y & 4194048) !== Y && jo.current !== null) || (nd = !0),
                (!(od & 134217727) && !(sd & 134217727)) ||
                    q === null ||
                    Rd(q, Y, ld, !1));
        }
        function qd(e, t, n) {
            var r = K;
            K |= 2;
            var i = Wd(),
                a = Gd();
            ((q !== e || Y !== t) && ((_d = null), Vd(e, t)), (t = !1));
            var o = ad;
            a: do
                try {
                    if (X !== 0 && J !== null) {
                        var s = J,
                            c = ed;
                        switch (X) {
                            case 8:
                                (Bd(), (o = 6));
                                break a;
                            case 3:
                            case 2:
                            case 9:
                            case 6:
                                jo.current === null && (t = !0);
                                var l = X;
                                if (((X = 0), (ed = null), $d(e, s, c, l), n && nd)) {
                                    o = 0;
                                    break a;
                                }
                                break;
                            default:
                                ((l = X), (X = 0), (ed = null), $d(e, s, c, l));
                        }
                    }
                    (Jd(), (o = ad));
                    break;
                } catch (t) {
                    Hd(e, t);
                }
            while (1);
            return (
                t && e.shellSuspendCounter++,
                (ya = va = null),
                (K = r),
                (w.H = i),
                (w.A = a),
                J === null && ((q = null), (Y = 0), Ni()),
                o
            );
        }
        function Jd() {
            for (; J !== null;) Zd(J);
        }
        function Yd(e, t) {
            var n = K;
            K |= 2;
            var r = Wd(),
                a = Gd();
            q !== e || Y !== t
                ? ((_d = null), (gd = Qe() + 500), Vd(e, t))
                : (nd = yt(e, t));
            a: do
                try {
                    if (X !== 0 && J !== null) {
                        t = J;
                        var o = ed;
                        b: switch (X) {
                            case 1:
                                ((X = 0), (ed = null), $d(e, t, o, 1));
                                break;
                            case 2:
                            case 9:
                                if ($a(o)) {
                                    ((X = 0), (ed = null), Qd(t));
                                    break;
                                }
                                ((t = function () {
                                    ((X !== 2 && X !== 9) || q !== e || (X = 7), Ef(e));
                                }),
                                    o.then(t, t));
                                break a;
                            case 3:
                                X = 7;
                                break a;
                            case 4:
                                X = 5;
                                break a;
                            case 7:
                                $a(o)
                                    ? ((X = 0), (ed = null), Qd(t))
                                    : ((X = 0), (ed = null), $d(e, t, o, 7));
                                break;
                            case 5:
                                var s = null;
                                switch (J.tag) {
                                    case 26:
                                        s = J.memoizedState;
                                    case 5:
                                    case 27:
                                        var c = J;
                                        if (s ? Ym(s) : c.stateNode.complete) {
                                            ((X = 0), (ed = null));
                                            var l = c.sibling;
                                            if (l !== null) J = l;
                                            else {
                                                var u = c.return;
                                                u === null
                                                    ? (J = null)
                                                    : ((J = u), ef(u));
                                            }
                                            break b;
                                        }
                                }
                                ((X = 0), (ed = null), $d(e, t, o, 5));
                                break;
                            case 6:
                                ((X = 0), (ed = null), $d(e, t, o, 6));
                                break;
                            case 8:
                                (Bd(), (ad = 6));
                                break a;
                            default:
                                throw Error(i(462));
                        }
                    }
                    Xd();
                    break;
                } catch (t) {
                    Hd(e, t);
                }
            while (1);
            return (
                (ya = va = null),
                (w.H = r),
                (w.A = a),
                (K = n),
                J === null ? ((q = null), (Y = 0), Ni(), ad) : 0
            );
        }
        function Xd() {
            for (; J !== null && !Xe();) Zd(J);
        }
        function Zd(e) {
            var t = pl(e.alternate, e, id);
            ((e.memoizedProps = e.pendingProps), t === null ? ef(e) : (J = t));
        }
        function Qd(e) {
            var t = e,
                n = t.alternate;
            switch (t.tag) {
                case 15:
                case 0:
                    t = qc(n, t, t.pendingProps, t.type, void 0, Y);
                    break;
                case 11:
                    t = qc(n, t, t.pendingProps, t.type.render, t.ref, Y);
                    break;
                case 5:
                    as(t);
                    var r = t;
                    r === I &&
                        (R
                            ? (fa(r),
                              r.tag === 5 && r.stateNode != null && (L = r.stateNode))
                            : (fa(r), (R = !0)));
                default:
                    (xl(n, t), (t = J = Hi(t, id)), (t = pl(n, t, id)));
            }
            ((e.memoizedProps = e.pendingProps), t === null ? ef(e) : (J = t));
        }
        function $d(e, t, n, r) {
            ((ya = va = null), as(t), (ao = null), (oo = 0));
            var i = t.return;
            try {
                if (Mc(e, i, t, n, Y)) {
                    ((ad = 1), Dc(e, Yi(n, e.current)), (J = null));
                    return;
                }
            } catch (t) {
                if (i !== null) throw ((J = i), t);
                ((ad = 1), Dc(e, Yi(n, e.current)), (J = null));
                return;
            }
            t.flags & 32768
                ? (R || r === 1
                      ? (e = !0)
                      : nd || Y & 536870912
                        ? (e = !1)
                        : ((td = e = !0),
                          (r === 2 || r === 9 || r === 3 || r === 6) &&
                              ((r = jo.current),
                              r !== null && r.tag === 13 && (r.flags |= 16384))),
                  tf(t, e))
                : ef(t);
        }
        function ef(e) {
            var t = e;
            do {
                if (t.flags & 32768) {
                    tf(t, td);
                    return;
                }
                e = t.return;
                var n = yl(t.alternate, t, id);
                if (n !== null) {
                    J = n;
                    return;
                }
                if (((t = t.sibling), t !== null)) {
                    J = t;
                    return;
                }
                J = t = e;
            } while (t !== null);
            ad === 0 && (ad = 5);
        }
        function tf(e, t) {
            do {
                var n = bl(e.alternate, e);
                if (n !== null) {
                    ((n.flags &= 32767), (J = n));
                    return;
                }
                if (
                    ((n = e.return),
                    n !== null &&
                        ((n.flags |= 32768),
                        (n.subtreeFlags = 0),
                        (n.deletions = null)),
                    !t && ((e = e.sibling), e !== null))
                ) {
                    J = e;
                    return;
                }
                J = e = n;
            } while (e !== null);
            ((ad = 6), (J = null));
        }
        function nf(e, t, n, r, a, o, s, c, l, u, d, f) {
            e.cancelPendingCommit = null;
            do df();
            while (yd !== 0);
            if (K & 6) throw Error(i(327));
            if (t !== null) {
                if (t === e.current) throw Error(i(177));
                (e === q && ((J = q = null), (Y = 0)),
                    (xd = t),
                    (bd = e),
                    (Sd = n),
                    (wd = a),
                    (Td = r),
                    rf(e, t, n, s, c, l, f));
            }
        }
        function rf(e, t, n, r, i, a, o) {
            var s = t.lanes | t.childLanes;
            if (
                ((Cd = s),
                (s |= Mi),
                Tt(e, n, s, r, i, a),
                (Dd = null),
                (n & 335544064) === n
                    ? ((Od = Ia(e)), (r = 10262))
                    : ((Od = null), (r = 10256)),
                (t.subtreeFlags & r) !== 0 || (t.flags & r) !== 0
                    ? ((e.callbackNode = null),
                      (e.callbackPriority = 0),
                      yf(nt, function () {
                          return (ff(), null);
                      }))
                    : ((e.callbackNode = null), (e.callbackPriority = 0)),
                (Bl = !1),
                (r = !!(t.flags & 13878)),
                t.subtreeFlags & 13878 || r)
            ) {
                ((r = w.T), (w.T = null), (i = T.p), (T.p = 2), (a = K), (K |= 4));
                try {
                    mu(e, t, n);
                } finally {
                    ((K = a), (T.p = i), (w.T = r));
                }
            }
            ((yd = 1),
                Bl
                    ? (Ed = Mp(
                          o,
                          e.containerInfo,
                          Od,
                          sf,
                          cf,
                          of,
                          lf,
                          ff,
                          af,
                          null,
                          null,
                      ))
                    : (sf(), cf(), lf()));
        }
        function af(e) {
            if (yd !== 0) {
                var t = bd.onRecoverableError;
                t(e, { componentStack: null });
            }
        }
        function of() {
            yd === 3 && ((yd = 0), Pu(xd, bd), (yd = 4));
        }
        function sf() {
            if (yd === 1) {
                yd = 0;
                var e = bd,
                    t = xd,
                    n = Sd,
                    r = !!(t.flags & 13878);
                if (t.subtreeFlags & 13878 || r) {
                    ((r = w.T), (w.T = null));
                    var i = T.p;
                    T.p = 2;
                    var a = K;
                    K |= 4;
                    try {
                        ((du = fu = !1), Au(t, e, n), (n = cp));
                        var o = ii(e.containerInfo),
                            s = n.focusedElem,
                            c = n.selectionRange;
                        if (
                            o !== s &&
                            s &&
                            s.ownerDocument &&
                            ri(s.ownerDocument.documentElement, s)
                        ) {
                            if (c !== null && ai(s)) {
                                var l = c.start,
                                    u = c.end;
                                if ((u === void 0 && (u = l), `selectionStart` in s))
                                    ((s.selectionStart = l),
                                        (s.selectionEnd = Math.min(u, s.value.length)));
                                else {
                                    var d = s.ownerDocument || document,
                                        f = (d && d.defaultView) || window;
                                    if (f.getSelection) {
                                        var p = f.getSelection(),
                                            m = s.textContent.length,
                                            h = Math.min(c.start, m),
                                            g =
                                                c.end === void 0
                                                    ? h
                                                    : Math.min(c.end, m);
                                        !p.extend &&
                                            h > g &&
                                            ((o = g), (g = h), (h = o));
                                        var _ = ni(s, h),
                                            v = ni(s, g);
                                        if (
                                            _ &&
                                            v &&
                                            (p.rangeCount !== 1 ||
                                                p.anchorNode !== _.node ||
                                                p.anchorOffset !== _.offset ||
                                                p.focusNode !== v.node ||
                                                p.focusOffset !== v.offset)
                                        ) {
                                            var y = d.createRange();
                                            (y.setStart(_.node, _.offset),
                                                p.removeAllRanges(),
                                                h > g
                                                    ? (p.addRange(y),
                                                      p.extend(v.node, v.offset))
                                                    : (y.setEnd(v.node, v.offset),
                                                      p.addRange(y)));
                                        }
                                    }
                                }
                            }
                            for (d = [], p = s; (p = p.parentNode);)
                                p.nodeType === 1 &&
                                    d.push({
                                        element: p,
                                        left: p.scrollLeft,
                                        top: p.scrollTop,
                                    });
                            for (
                                typeof s.focus == `function` && s.focus(), s = 0;
                                s < d.length;
                                s++
                            ) {
                                var b = d[s];
                                ((b.element.scrollLeft = b.left),
                                    (b.element.scrollTop = b.top));
                            }
                        }
                        ((gh = !!sp), (cp = sp = null));
                    } finally {
                        ((K = a), (T.p = i), (w.T = r));
                    }
                }
                ((e.current = t), (yd = 2));
            }
        }
        function cf() {
            if (yd === 2) {
                yd = 0;
                var e = bd,
                    t = xd,
                    n = !!(t.flags & 8772);
                if (t.subtreeFlags & 8772 || n) {
                    ((n = w.T), (w.T = null));
                    var r = T.p;
                    T.p = 2;
                    var i = K;
                    K |= 4;
                    try {
                        gu(e, t.alternate, t);
                    } finally {
                        ((K = i), (T.p = r), (w.T = n));
                    }
                }
                yd = 3;
            }
        }
        function lf() {
            if (yd === 4 || yd === 3) {
                yd = 0;
                var e = Ed;
                ((Ed = null), Ze());
                var t = bd,
                    n = xd,
                    r = Sd,
                    i = Td,
                    a = (r & 335544064) === r ? 10262 : 10256;
                if (
                    ((n.subtreeFlags & a) !== 0 || (n.flags & a) !== 0
                        ? (yd = 5)
                        : ((yd = 0), (xd = bd = null), uf(t, t.pendingLanes)),
                    (a = t.pendingLanes),
                    a === 0 && (vd = null),
                    At(r),
                    (n = n.stateNode),
                    ct && typeof ct.onCommitFiberRoot == `function`)
                )
                    try {
                        ct.onCommitFiberRoot(
                            st,
                            n,
                            void 0,
                            (n.current.flags & 128) == 128,
                        );
                    } catch {}
                if (i !== null) {
                    ((n = w.T), (a = T.p), (T.p = 2), (w.T = null));
                    try {
                        for (var o = t.onRecoverableError, s = 0; s < i.length; s++) {
                            var c = i[s];
                            o(c.value, { componentStack: c.stack });
                        }
                    } finally {
                        ((w.T = n), (T.p = a));
                    }
                }
                if (
                    ((i = Dd),
                    (o = Od),
                    (Od = null),
                    i !== null && ((Dd = null), o === null && (o = []), e !== null))
                )
                    for (c = 0; c < i.length; c++)
                        ((n = (0, i[c])(o)), n !== void 0 && e.finished.finally(n));
                (Sd & 3 && df(),
                    Ef(t),
                    (a = t.pendingLanes),
                    r & 261930 && a & 42
                        ? t === Ad
                            ? kd++
                            : ((kd = 0), (Ad = t))
                        : ((kd = 0), (Ad = null)),
                    Df(0, !1));
            }
        }
        function uf(e, t) {
            (e.pooledCacheLanes &= t) === 0 &&
                ((t = e.pooledCache), t != null && ((e.pooledCache = null), Na(t)));
        }
        function df() {
            return (
                Ed !== null && (Ed.skipTransition(), (Ed = null)),
                sf(),
                cf(),
                lf(),
                ff()
            );
        }
        function ff() {
            if (yd !== 5) return !1;
            var e = bd,
                t = Cd;
            Cd = 0;
            var n = At(Sd),
                r = w.T,
                a = T.p;
            try {
                ((T.p = 32 > n ? 32 : n), (w.T = null), (n = wd), (wd = null));
                var o = bd,
                    s = Sd;
                if (((yd = 0), (xd = bd = null), (Sd = 0), K & 6)) throw Error(i(331));
                var c = K;
                if (
                    ((K |= 4),
                    Yu(o.current),
                    Vu(o, o.current, s, n),
                    (K = c),
                    Df(0, !1),
                    ct && typeof ct.onPostCommitFiberRoot == `function`)
                )
                    try {
                        ct.onPostCommitFiberRoot(st, o);
                    } catch {}
                return !0;
            } finally {
                ((T.p = a), (w.T = r), uf(e, t));
            }
        }
        function pf(e, t, n) {
            ((t = Yi(n, t)),
                (t = kc(e.stateNode, t, 2)),
                (e = vo(e, t, 2)),
                e !== null && (wt(e, 2), Ef(e)));
        }
        function Z(e, t, n) {
            if (e.tag === 3) pf(e, e, n);
            else
                for (; t !== null;) {
                    if (t.tag === 3) {
                        pf(t, e, n);
                        break;
                    }
                    if (t.tag === 1) {
                        var r = t.stateNode;
                        if (
                            typeof t.type.getDerivedStateFromError == `function` ||
                            (typeof r.componentDidCatch == `function` &&
                                (vd === null || !vd.has(r)))
                        ) {
                            ((e = Yi(n, e)),
                                (n = Ac(2)),
                                (r = vo(t, n, 2)),
                                r !== null && (jc(n, r, t, e), wt(r, 2), Ef(r)));
                            break;
                        }
                    }
                    t = t.return;
                }
        }
        function mf(e, t, n) {
            var r = e.pingCache;
            if (r === null) {
                r = e.pingCache = new $u();
                var i = new Set();
                r.set(t, i);
            } else ((i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i)));
            i.has(n) ||
                ((rd = !0), i.add(n), (e = hf.bind(null, e, t, n)), t.then(e, e));
        }
        function hf(e, t, n) {
            var r = e.pingCache;
            (r !== null && r.delete(t),
                (e.pingedLanes |= e.suspendedLanes & n),
                (e.warmLanes &= ~n),
                q === e &&
                    (Y & n) === n &&
                    (ad === 4 || (ad === 3 && (Y & 62914560) === Y && 300 > Qe() - md)
                        ? K & 2
                            ? (cd |= n)
                            : Vd(e, 0)
                        : (cd |= n),
                    ud === Y && (ud = 0)),
                Ef(e));
        }
        function gf(e, t) {
            (t === 0 && (t = St()), (e = j(e, t)), e !== null && (wt(e, t), Ef(e)));
        }
        function _f(e) {
            var t = e.memoizedState,
                n = 0;
            (t !== null && (n = t.retryLane), gf(e, n));
        }
        function vf(e, t) {
            var n = 0;
            switch (e.tag) {
                case 31:
                case 13:
                    var r = e.stateNode,
                        a = e.memoizedState;
                    a !== null && (n = a.retryLane);
                    break;
                case 19:
                    r = e.stateNode;
                    break;
                case 22:
                    r = e.stateNode._retryCache;
                    break;
                default:
                    throw Error(i(314));
            }
            (r !== null && r.delete(t), gf(e, n));
        }
        function yf(e, t) {
            return Je(e, t);
        }
        var bf = null,
            xf = null,
            Sf = !1,
            Cf = !1,
            wf = !1,
            Tf = 0;
        function Ef(e) {
            (e !== xf &&
                e.next === null &&
                (xf === null ? (bf = xf = e) : (xf = xf.next = e)),
                (Cf = !0),
                Sf || ((Sf = !0), Nf()));
        }
        function Df(e, t) {
            if (!wf && Cf) {
                wf = !0;
                do
                    for (var n = !1, r = bf; r !== null;) {
                        if (!t) {
                            if (e !== 0) {
                                var i = r.pendingLanes;
                                if (i === 0) var a = 0;
                                else {
                                    var o = r.suspendedLanes,
                                        s = r.pingedLanes;
                                    ((a = (1 << (31 - ut(42 | e) + 1)) - 1),
                                        (a &= i & ~(o & ~s)),
                                        (a =
                                            a & 201326741
                                                ? (a & 201326741) | 1
                                                : a
                                                  ? a | 2
                                                  : 0));
                                }
                                a !== 0 && ((n = !0), Mf(r, a));
                            } else
                                ((a = Y),
                                    (a = vt(
                                        r,
                                        r === q ? a : 0,
                                        r.cancelPendingCommit !== null ||
                                            r.timeoutHandle !== -1,
                                    )),
                                    !(a & 3) || yt(r, a) || ((n = !0), Mf(r, a)));
                        }
                        r = r.next;
                    }
                while (n);
                wf = !1;
            }
        }
        function Of() {
            kf();
        }
        function kf() {
            Cf = Sf = !1;
            var e = 0;
            Tf !== 0 && hp() && (e = Tf);
            for (var t = Qe(), n = null, r = bf; r !== null;) {
                var i = r.next,
                    a = Af(r, t);
                (a === 0
                    ? ((r.next = null),
                      n === null ? (bf = i) : (n.next = i),
                      i === null && (xf = n))
                    : ((n = r), (e !== 0 || a & 3) && (Cf = !0)),
                    (r = i));
            }
            ((yd !== 0 && yd !== 5) || Df(e, !1), Tf !== 0 && (Tf = 0));
        }
        function Af(e, t) {
            for (
                var n = e.suspendedLanes,
                    r = e.pingedLanes,
                    i = e.expirationTimes,
                    a = e.pendingLanes & -62914561;
                0 < a;
            ) {
                var o = 31 - ut(a),
                    s = 1 << o,
                    c = i[o];
                (c === -1
                    ? ((s & n) === 0 || (s & r) !== 0) && (i[o] = xt(s, t))
                    : c <= t && (e.expiredLanes |= s),
                    (a &= ~s));
            }
            if (
                ((t = q),
                (n = Y),
                (n = vt(
                    e,
                    e === t ? n : 0,
                    e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
                )),
                (r = e.callbackNode),
                n === 0 ||
                    (e === t && (X === 2 || X === 9)) ||
                    e.cancelPendingCommit !== null)
            )
                return (
                    r !== null && r !== null && Ye(r),
                    (e.callbackNode = null),
                    (e.callbackPriority = 0)
                );
            if (!(n & 3) || yt(e, n)) {
                if (((t = n & -n), t === e.callbackPriority)) return t;
                switch ((r !== null && Ye(r), At(n))) {
                    case 2:
                    case 8:
                        n = tt;
                        break;
                    case 32:
                        n = nt;
                        break;
                    case 268435456:
                        n = it;
                        break;
                    default:
                        n = nt;
                }
                return (
                    (r = jf.bind(null, e)),
                    (n = Je(n, r)),
                    (e.callbackPriority = t),
                    (e.callbackNode = n),
                    t
                );
            }
            return (
                r !== null && r !== null && Ye(r),
                (e.callbackPriority = 2),
                (e.callbackNode = null),
                2
            );
        }
        function jf(e, t) {
            if (yd !== 0 && yd !== 5)
                return ((e.callbackNode = null), (e.callbackPriority = 0), null);
            var n = e.callbackNode;
            if (df() && e.callbackNode !== n) return null;
            var r = Y;
            return (
                (r = vt(
                    e,
                    e === q ? r : 0,
                    e.cancelPendingCommit !== null || e.timeoutHandle !== -1,
                )),
                r === 0
                    ? null
                    : (Fd(e, r, t),
                      Af(e, Qe()),
                      e.callbackNode != null && e.callbackNode === n
                          ? jf.bind(null, e)
                          : null)
            );
        }
        function Mf(e, t) {
            if (df()) return null;
            Fd(e, t, !0);
        }
        function Nf() {
            bp(function () {
                K & 6 ? Je(et, Of) : kf();
            });
        }
        function Pf() {
            if (Tf === 0) {
                var e = za;
                (e === 0 && ((e = mt), (mt <<= 1), !(mt & 261888) && (mt = 256)),
                    (Tf = e));
            }
            return Tf;
        }
        function Ff(e) {
            return e == null || typeof e == `symbol` || typeof e == `boolean`
                ? null
                : typeof e == `function`
                  ? e
                  : On(e);
        }
        function If(e, t, n, r, i) {
            if (t === `submit` && n && n.stateNode === i) {
                var a = Ff((i[D] || null).action),
                    o = r.submitter;
                o &&
                    ((t = (t = o[D] || null)
                        ? Ff(t.formAction)
                        : o.getAttribute(`formAction`)),
                    t !== null && ((a = t), (o = null)));
                var s = new Xn(`action`, `action`, null, r, i);
                e.push({
                    event: s,
                    listeners: [
                        {
                            instance: null,
                            listener: function () {
                                if (r.defaultPrevented) {
                                    if (Tf !== 0) {
                                        var e = new FormData(i, o);
                                        tc(
                                            n,
                                            {
                                                pending: !0,
                                                data: e,
                                                method: i.method,
                                                action: a,
                                            },
                                            null,
                                            e,
                                        );
                                    }
                                } else
                                    typeof a == `function` &&
                                        (s.preventDefault(),
                                        (e = new FormData(i, o)),
                                        tc(
                                            n,
                                            {
                                                pending: !0,
                                                data: e,
                                                method: i.method,
                                                action: a,
                                            },
                                            a,
                                            e,
                                        ));
                            },
                            currentTarget: i,
                        },
                    ],
                });
            }
        }
        for (var Lf = 0; Lf < wi.length; Lf++) {
            var Rf = wi[Lf];
            A(Rf.toLowerCase(), `on` + (Rf[0].toUpperCase() + Rf.slice(1)));
        }
        (A(_i, `onAnimationEnd`),
            A(vi, `onAnimationIteration`),
            A(yi, `onAnimationStart`),
            A(`dblclick`, `onDoubleClick`),
            A(`focusin`, `onFocus`),
            A(`focusout`, `onBlur`),
            A(bi, `onTransitionRun`),
            A(k, `onTransitionStart`),
            A(xi, `onTransitionCancel`),
            A(Si, `onTransitionEnd`),
            Qt(`onMouseEnter`, [`mouseout`, `mouseover`]),
            Qt(`onMouseLeave`, [`mouseout`, `mouseover`]),
            Qt(`onPointerEnter`, [`pointerout`, `pointerover`]),
            Qt(`onPointerLeave`, [`pointerout`, `pointerover`]),
            Zt(
                `onChange`,
                `change click focusin focusout input keydown keyup selectionchange`.split(
                    ` `,
                ),
            ),
            Zt(
                `onSelect`,
                `focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(
                    ` `,
                ),
            ),
            Zt(`onBeforeInput`, [`compositionend`, `keypress`, `textInput`, `paste`]),
            Zt(
                `onCompositionEnd`,
                `compositionend focusout keydown keypress keyup mousedown`.split(` `),
            ),
            Zt(
                `onCompositionStart`,
                `compositionstart focusout keydown keypress keyup mousedown`.split(` `),
            ),
            Zt(
                `onCompositionUpdate`,
                `compositionupdate focusout keydown keypress keyup mousedown`.split(
                    ` `,
                ),
            ));
        var zf =
                `abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(
                    ` `,
                ),
            Bf = new Set(
                `beforetoggle cancel close invalid load scroll scrollend toggle`
                    .split(` `)
                    .concat(zf),
            );
        function Vf(e, t) {
            t = !!(t & 4);
            for (var n = 0; n < e.length; n++) {
                var r = e[n],
                    i = r.event;
                r = r.listeners;
                a: {
                    var a = void 0;
                    if (t)
                        for (var o = r.length - 1; 0 <= o; o--) {
                            var s = r[o],
                                c = s.instance,
                                l = s.currentTarget;
                            if (((s = s.listener), c !== a && i.isPropagationStopped()))
                                break a;
                            ((a = s), (i.currentTarget = l));
                            try {
                                a(i);
                            } catch (e) {
                                ki(e);
                            }
                            ((i.currentTarget = null), (a = c));
                        }
                    else
                        for (o = 0; o < r.length; o++) {
                            if (
                                ((s = r[o]),
                                (c = s.instance),
                                (l = s.currentTarget),
                                (s = s.listener),
                                c !== a && i.isPropagationStopped())
                            )
                                break a;
                            ((a = s), (i.currentTarget = l));
                            try {
                                a(i);
                            } catch (e) {
                                ki(e);
                            }
                            ((i.currentTarget = null), (a = c));
                        }
                }
            }
        }
        function Q(e, t) {
            var n = t[It];
            n === void 0 && (n = t[It] = new Set());
            var r = e + `__bubble`;
            n.has(r) || (Gf(t, e, 2, !1), n.add(r));
        }
        function Hf(e, t, n) {
            var r = 0;
            (t && (r |= 4), Gf(n, e, r, t));
        }
        var Uf = `_reactListening` + Math.random().toString(36).slice(2);
        function Wf(e) {
            if (!e[Uf]) {
                ((e[Uf] = !0),
                    Yt.forEach(function (t) {
                        t !== `selectionchange` &&
                            (Bf.has(t) || Hf(t, !1, e), Hf(t, !0, e));
                    }));
                var t = e.nodeType === 9 ? e : e.ownerDocument;
                t === null || t[Uf] || ((t[Uf] = !0), Hf(`selectionchange`, !1, t));
            }
        }
        function Gf(e, t, n, r) {
            switch (Ch(t)) {
                case 2:
                    var i = _h;
                    break;
                case 8:
                    i = vh;
                    break;
                default:
                    i = yh;
            }
            ((n = i.bind(null, t, n, e)),
                (i = void 0),
                !zn ||
                    (t !== `touchstart` && t !== `touchmove` && t !== `wheel`) ||
                    (i = !0),
                r
                    ? i === void 0
                        ? e.addEventListener(t, n, !0)
                        : e.addEventListener(t, n, { capture: !0, passive: i })
                    : i === void 0
                      ? e.addEventListener(t, n, !1)
                      : e.addEventListener(t, n, { passive: i }));
        }
        function Kf(e, t, n, r, i) {
            var a = r;
            if (!(t & 1) && !(t & 2) && r !== null)
                a: for (;;) {
                    if (r === null) return;
                    var s = r.tag;
                    if (s === 3 || s === 4) {
                        var c = r.stateNode.containerInfo;
                        if (c === i) break;
                        if (s === 4)
                            for (s = r.return; s !== null;) {
                                var l = s.tag;
                                if (
                                    (l === 3 || l === 4) &&
                                    s.stateNode.containerInfo === i
                                )
                                    return;
                                s = s.return;
                            }
                        for (; c !== null;) {
                            if (((s = Ut(c)), s === null)) return;
                            if (
                                ((l = s.tag),
                                l === 5 || l === 6 || l === 26 || l === 27)
                            ) {
                                r = a = s;
                                continue a;
                            }
                            c = c.parentNode;
                        }
                    }
                    r = r.return;
                }
            In(function () {
                var r = a,
                    i = jn(n),
                    s = [];
                a: {
                    var c = Ci.get(e);
                    if (c !== void 0) {
                        var l = Xn,
                            u = e;
                        switch (e) {
                            case `keypress`:
                                if (Gn(n) === 0) break a;
                            case `keydown`:
                            case `keyup`:
                                l = mr;
                                break;
                            case `focusin`:
                                ((u = `focus`), (l = ar));
                                break;
                            case `focusout`:
                                ((u = `blur`), (l = ar));
                                break;
                            case `beforeblur`:
                            case `afterblur`:
                                l = ar;
                                break;
                            case `click`:
                                if (n.button === 2) break a;
                            case `auxclick`:
                            case `dblclick`:
                            case `mousedown`:
                            case `mousemove`:
                            case `mouseup`:
                            case `mouseout`:
                            case `mouseover`:
                            case `contextmenu`:
                                l = rr;
                                break;
                            case `drag`:
                            case `dragend`:
                            case `dragenter`:
                            case `dragexit`:
                            case `dragleave`:
                            case `dragover`:
                            case `dragstart`:
                            case `drop`:
                                l = ir;
                                break;
                            case `touchcancel`:
                            case `touchend`:
                            case `touchmove`:
                            case `touchstart`:
                                l = _r;
                                break;
                            case _i:
                            case vi:
                            case yi:
                                l = or;
                                break;
                            case Si:
                                l = vr;
                                break;
                            case `scroll`:
                            case `scrollend`:
                                l = Qn;
                                break;
                            case `wheel`:
                                l = yr;
                                break;
                            case `copy`:
                            case `cut`:
                            case `paste`:
                                l = sr;
                                break;
                            case `gotpointercapture`:
                            case `lostpointercapture`:
                            case `pointercancel`:
                            case `pointerdown`:
                            case `pointermove`:
                            case `pointerout`:
                            case `pointerover`:
                            case `pointerup`:
                                l = hr;
                                break;
                            case `submit`:
                                l = gr;
                                break;
                            case `toggle`:
                            case `beforetoggle`:
                                l = br;
                        }
                        var d = !!(t & 4),
                            f = !d && (e === `scroll` || e === `scrollend`),
                            p = d ? (c === null ? null : c + `Capture`) : c;
                        d = [];
                        for (var m = r, h; m !== null;) {
                            var g = m;
                            if (
                                ((h = g.stateNode),
                                (g = g.tag),
                                (g !== 5 && g !== 26 && g !== 27) ||
                                    h === null ||
                                    p === null ||
                                    ((g = Ln(m, p)), g != null && d.push(qf(m, g, h))),
                                f)
                            )
                                break;
                            m = m.return;
                        }
                        0 < d.length &&
                            ((c = new l(c, u, null, n, i)),
                            s.push({ event: c, listeners: d }));
                    }
                }
                if (!(t & 7)) {
                    a: {
                        if (
                            ((l = e === `mouseover` || e === `pointerover`),
                            (c = e === `mouseout` || e === `pointerout`),
                            l &&
                                n !== An &&
                                (u = n.relatedTarget || n.fromElement) &&
                                (Ut(u) || u[Ft]))
                        )
                            break a;
                        (c || l) &&
                            ((u =
                                i.window === i
                                    ? i
                                    : (l = i.ownerDocument)
                                      ? l.defaultView || l.parentWindow
                                      : window),
                            c
                                ? ((l = n.relatedTarget || n.toElement),
                                  (c = r),
                                  (l = l ? Ut(l) : null),
                                  l !== null &&
                                      ((f = o(l)),
                                      (d = l.tag),
                                      l !== f || (d !== 5 && d !== 27 && d !== 6)) &&
                                      (l = null))
                                : ((c = null), (l = r)),
                            c !== l &&
                                ((d = rr),
                                (g = `onMouseLeave`),
                                (p = `onMouseEnter`),
                                (m = `mouse`),
                                (e === `pointerout` || e === `pointerover`) &&
                                    ((d = hr),
                                    (g = `onPointerLeave`),
                                    (p = `onPointerEnter`),
                                    (m = `pointer`)),
                                (f = c == null ? u : Gt(c)),
                                (h = l == null ? u : Gt(l)),
                                (u = new d(g, m + `leave`, c, n, i)),
                                (u.target = f),
                                (u.relatedTarget = h),
                                (g = null),
                                Ut(i) === r &&
                                    ((d = new d(p, m + `enter`, l, n, i)),
                                    (d.target = h),
                                    (d.relatedTarget = f),
                                    (g = d)),
                                (f = g),
                                (d = c && l ? ie(c, l, Yf) : null),
                                c !== null && Xf(s, u, c, d, !1),
                                l !== null && f !== null && Xf(s, f, l, d, !0)));
                    }
                    a: {
                        if (
                            ((c = r ? Gt(r) : window),
                            (l = c.nodeName && c.nodeName.toLowerCase()),
                            l === `select` || (l === `input` && c.type === `file`))
                        )
                            var _ = Br;
                        else if (Pr(c)) {
                            if (Vr) _ = Xr;
                            else {
                                _ = Jr;
                                var v = qr;
                            }
                        } else
                            ((l = c.nodeName),
                                !l ||
                                l.toLowerCase() !== `input` ||
                                (c.type !== `checkbox` && c.type !== `radio`)
                                    ? r && Tn(r.elementType) && (_ = Br)
                                    : (_ = Yr));
                        if ((_ &&= _(e, r))) {
                            Fr(s, _, n, i);
                            break a;
                        }
                        v && v(e, c, r);
                    }
                    switch (((v = r ? Gt(r) : window), e)) {
                        case `focusin`:
                            (Pr(v) || v.contentEditable === `true`) &&
                                ((si = v), (ci = r), (li = null));
                            break;
                        case `focusout`:
                            li = ci = si = null;
                            break;
                        case `mousedown`:
                            ui = !0;
                            break;
                        case `contextmenu`:
                        case `mouseup`:
                        case `dragend`:
                            ((ui = !1), di(s, n, i));
                            break;
                        case `selectionchange`:
                            if (oi) break;
                        case `keydown`:
                        case `keyup`:
                            di(s, n, i);
                    }
                    var y;
                    if (Sr)
                        b: {
                            switch (e) {
                                case `compositionstart`:
                                    var b = `onCompositionStart`;
                                    break b;
                                case `compositionend`:
                                    b = `onCompositionEnd`;
                                    break b;
                                case `compositionupdate`:
                                    b = `onCompositionUpdate`;
                                    break b;
                            }
                            b = void 0;
                        }
                    else
                        Ar
                            ? Or(e, n) && (b = `onCompositionEnd`)
                            : e === `keydown` &&
                              n.keyCode === 229 &&
                              (b = `onCompositionStart`);
                    (b &&
                        (Tr &&
                            n.locale !== `ko` &&
                            (Ar || b !== `onCompositionStart`
                                ? b === `onCompositionEnd` && Ar && (y = Wn())
                                : ((Vn = i),
                                  (Hn = `value` in Vn ? Vn.value : Vn.textContent),
                                  (Ar = !0))),
                        (v = Jf(r, b)),
                        0 < v.length &&
                            ((b = new cr(b, e, null, n, i)),
                            s.push({ event: b, listeners: v }),
                            y
                                ? (b.data = y)
                                : ((y = kr(n)), y !== null && (b.data = y)))),
                        (y = wr ? jr(e, n) : Mr(e, n)) &&
                            ((b = Jf(r, `onBeforeInput`)),
                            0 < b.length &&
                                ((v = new cr(
                                    `onBeforeInput`,
                                    `beforeinput`,
                                    null,
                                    n,
                                    i,
                                )),
                                s.push({ event: v, listeners: b }),
                                (v.data = y))),
                        If(s, e, r, n, i));
                }
                Vf(s, t);
            });
        }
        function qf(e, t, n) {
            return { instance: e, listener: t, currentTarget: n };
        }
        function Jf(e, t) {
            for (var n = t + `Capture`, r = []; e !== null;) {
                var i = e,
                    a = i.stateNode;
                if (
                    ((i = i.tag),
                    (i !== 5 && i !== 26 && i !== 27) ||
                        a === null ||
                        ((i = Ln(e, n)),
                        i != null && r.unshift(qf(e, i, a)),
                        (i = Ln(e, t)),
                        i != null && r.push(qf(e, i, a))),
                    e.tag === 3)
                )
                    return r;
                e = e.return;
            }
            return [];
        }
        function Yf(e) {
            if (e === null) return null;
            do e = e.return;
            while (e && e.tag !== 5 && e.tag !== 27);
            return e || null;
        }
        function Xf(e, t, n, r, i) {
            for (var a = t._reactName, o = []; n !== null && n !== r;) {
                var s = n,
                    c = s.alternate,
                    l = s.stateNode;
                if (((s = s.tag), c !== null && c === r)) break;
                ((s !== 5 && s !== 26 && s !== 27) ||
                    l === null ||
                    ((c = l),
                    i
                        ? ((l = Ln(n, a)), l != null && o.unshift(qf(n, l, c)))
                        : i || ((l = Ln(n, a)), l != null && o.push(qf(n, l, c)))),
                    (n = n.return));
            }
            o.length !== 0 && e.push({ event: t, listeners: o });
        }
        var Zf = /\r\n?/g,
            Qf = /\u0000|\uFFFD/g;
        function $f(e) {
            return (typeof e == `string` ? e : `` + e)
                .replace(
                    Zf,
                    `
`,
                )
                .replace(Qf, ``);
        }
        function ep(e, t) {
            return ((t = $f(t)), $f(e) === t);
        }
        function $(e, t, n, r, a, o) {
            switch (n) {
                case `children`:
                    if (typeof r == `string`)
                        t === `body` || (t === `textarea` && r === ``) || xn(e, r);
                    else if (typeof r == `number` || typeof r == `bigint`)
                        t !== `body` && xn(e, `` + r);
                    else return;
                    break;
                case `className`:
                    on(e, `class`, r);
                    break;
                case `tabIndex`:
                    on(e, `tabindex`, r);
                    break;
                case `dir`:
                case `role`:
                case `viewBox`:
                case `width`:
                case `height`:
                    on(e, n, r);
                    break;
                case `style`:
                    wn(e, r, o);
                    return;
                case `data`:
                    if (t !== `object`) {
                        on(e, `data`, r);
                        break;
                    }
                case `src`:
                case `href`:
                    if (r === `` && (t !== `a` || n !== `href`)) {
                        e.removeAttribute(n);
                        break;
                    }
                    if (
                        r == null ||
                        typeof r == `function` ||
                        typeof r == `symbol` ||
                        typeof r == `boolean`
                    ) {
                        e.removeAttribute(n);
                        break;
                    }
                    ((r = On(r)), e.setAttribute(n, r));
                    break;
                case `action`:
                case `formAction`:
                    if (typeof r == `function`) {
                        e.setAttribute(
                            n,
                            `javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`,
                        );
                        break;
                    }
                    if (
                        (typeof o == `function` &&
                            (n === `formAction`
                                ? (t !== `input` && $(e, t, `name`, a.name, a, null),
                                  $(e, t, `formEncType`, a.formEncType, a, null),
                                  $(e, t, `formMethod`, a.formMethod, a, null),
                                  $(e, t, `formTarget`, a.formTarget, a, null))
                                : ($(e, t, `encType`, a.encType, a, null),
                                  $(e, t, `method`, a.method, a, null),
                                  $(e, t, `target`, a.target, a, null))),
                        r == null || typeof r == `symbol` || typeof r == `boolean`)
                    ) {
                        e.removeAttribute(n);
                        break;
                    }
                    ((r = On(r)), e.setAttribute(n, r));
                    break;
                case `onClick`:
                    r != null && (e.onclick = kn);
                    return;
                case `onScroll`:
                    r != null && Q(`scroll`, e);
                    return;
                case `onScrollEnd`:
                    r != null && Q(`scrollend`, e);
                    return;
                case `dangerouslySetInnerHTML`:
                    if (r != null) {
                        if (typeof r != `object` || !(`__html` in r))
                            throw Error(i(61));
                        if (((n = r.__html), n != null)) {
                            if (a.children != null) throw Error(i(60));
                            o?.__html !== n && (e.innerHTML = n);
                        }
                    }
                    break;
                case `multiple`:
                    e.multiple = r && typeof r != `function` && typeof r != `symbol`;
                    break;
                case `muted`:
                    e.muted = r && typeof r != `function` && typeof r != `symbol`;
                    break;
                case `suppressContentEditableWarning`:
                case `suppressHydrationWarning`:
                case `defaultValue`:
                case `defaultChecked`:
                case `innerHTML`:
                case `ref`:
                    break;
                case `autoFocus`:
                    break;
                case `xlinkHref`:
                    if (
                        r == null ||
                        typeof r == `function` ||
                        typeof r == `boolean` ||
                        typeof r == `symbol`
                    ) {
                        e.removeAttribute(`xlink:href`);
                        break;
                    }
                    ((n = On(r)),
                        e.setAttributeNS(
                            `http://www.w3.org/1999/xlink`,
                            `xlink:href`,
                            n,
                        ));
                    break;
                case `contentEditable`:
                case `spellCheck`:
                case `draggable`:
                case `value`:
                case `autoReverse`:
                case `externalResourcesRequired`:
                case `focusable`:
                case `preserveAlpha`:
                    r != null && typeof r != `function` && typeof r != `symbol`
                        ? e.setAttribute(n, r)
                        : e.removeAttribute(n);
                    break;
                case `inert`:
                case `allowFullScreen`:
                case `async`:
                case `autoPlay`:
                case `controls`:
                case `credentialless`:
                case `default`:
                case `defer`:
                case `disabled`:
                case `disablePictureInPicture`:
                case `disableRemotePlayback`:
                case `formNoValidate`:
                case `hidden`:
                case `loop`:
                case `noModule`:
                case `noValidate`:
                case `open`:
                case `playsInline`:
                case `readOnly`:
                case `required`:
                case `reversed`:
                case `scoped`:
                case `seamless`:
                case `itemScope`:
                    r && typeof r != `function` && typeof r != `symbol`
                        ? e.setAttribute(n, ``)
                        : e.removeAttribute(n);
                    break;
                case `capture`:
                case `download`:
                    !0 === r
                        ? e.setAttribute(n, ``)
                        : !1 !== r &&
                            r != null &&
                            typeof r != `function` &&
                            typeof r != `symbol`
                          ? e.setAttribute(n, r)
                          : e.removeAttribute(n);
                    break;
                case `cols`:
                case `rows`:
                case `size`:
                case `span`:
                    r != null &&
                    typeof r != `function` &&
                    typeof r != `symbol` &&
                    !isNaN(r) &&
                    1 <= r
                        ? e.setAttribute(n, r)
                        : e.removeAttribute(n);
                    break;
                case `rowSpan`:
                case `start`:
                    r == null ||
                    typeof r == `function` ||
                    typeof r == `symbol` ||
                    isNaN(r)
                        ? e.removeAttribute(n)
                        : e.setAttribute(n, r);
                    break;
                case `popover`:
                    (Q(`beforetoggle`, e), Q(`toggle`, e), an(e, `popover`, r));
                    break;
                case `xlinkActuate`:
                    sn(e, `http://www.w3.org/1999/xlink`, `xlink:actuate`, r);
                    break;
                case `xlinkArcrole`:
                    sn(e, `http://www.w3.org/1999/xlink`, `xlink:arcrole`, r);
                    break;
                case `xlinkRole`:
                    sn(e, `http://www.w3.org/1999/xlink`, `xlink:role`, r);
                    break;
                case `xlinkShow`:
                    sn(e, `http://www.w3.org/1999/xlink`, `xlink:show`, r);
                    break;
                case `xlinkTitle`:
                    sn(e, `http://www.w3.org/1999/xlink`, `xlink:title`, r);
                    break;
                case `xlinkType`:
                    sn(e, `http://www.w3.org/1999/xlink`, `xlink:type`, r);
                    break;
                case `xmlBase`:
                    sn(e, `http://www.w3.org/XML/1998/namespace`, `xml:base`, r);
                    break;
                case `xmlLang`:
                    sn(e, `http://www.w3.org/XML/1998/namespace`, `xml:lang`, r);
                    break;
                case `xmlSpace`:
                    sn(e, `http://www.w3.org/XML/1998/namespace`, `xml:space`, r);
                    break;
                case `is`:
                    an(e, `is`, r);
                    break;
                case `innerText`:
                case `textContent`:
                    return;
                default:
                    if (
                        !(2 < n.length) ||
                        (n[0] !== `o` && n[0] !== `O`) ||
                        (n[1] !== `n` && n[1] !== `N`)
                    )
                        ((n = En.get(n) || n), an(e, n, r));
                    else return;
            }
            O = !0;
        }
        function tp(e, t, n, r, a, o) {
            switch (n) {
                case `style`:
                    wn(e, r, o);
                    return;
                case `dangerouslySetInnerHTML`:
                    if (r != null) {
                        if (typeof r != `object` || !(`__html` in r))
                            throw Error(i(61));
                        if (((n = r.__html), n != null)) {
                            if (a.children != null) throw Error(i(60));
                            o?.__html !== n && (e.innerHTML = n);
                        }
                    }
                    break;
                case `children`:
                    if (typeof r == `string`) xn(e, r);
                    else if (typeof r == `number` || typeof r == `bigint`)
                        xn(e, `` + r);
                    else return;
                    break;
                case `onScroll`:
                    r != null && Q(`scroll`, e);
                    return;
                case `onScrollEnd`:
                    r != null && Q(`scrollend`, e);
                    return;
                case `onClick`:
                    r != null && (e.onclick = kn);
                    return;
                case `suppressContentEditableWarning`:
                case `suppressHydrationWarning`:
                case `innerHTML`:
                case `ref`:
                    return;
                case `innerText`:
                case `textContent`:
                    return;
                default:
                    if (!Xt.hasOwnProperty(n))
                        a: {
                            if (
                                n[0] === `o` &&
                                n[1] === `n` &&
                                ((a = n.endsWith(`Capture`)),
                                (o = n.slice(2, a ? n.length - 7 : void 0)),
                                (t = e[D] || null),
                                (t = t == null ? null : t[n]),
                                typeof t == `function` &&
                                    e.removeEventListener(o, t, a),
                                typeof r == `function`)
                            ) {
                                (typeof t != `function` &&
                                    t !== null &&
                                    (n in e
                                        ? (e[n] = null)
                                        : e.hasAttribute(n) && e.removeAttribute(n)),
                                    e.addEventListener(o, r, a));
                                break a;
                            }
                            ((O = !0),
                                n in e
                                    ? (e[n] = r)
                                    : !0 === r
                                      ? e.setAttribute(n, ``)
                                      : an(e, n, r));
                        }
                    return;
            }
            O = !0;
        }
        function np(e, t, n) {
            switch (t) {
                case `div`:
                case `span`:
                case `svg`:
                case `path`:
                case `a`:
                case `g`:
                case `p`:
                case `li`:
                    break;
                case `img`:
                    (Q(`error`, e), Q(`load`, e));
                    var r = !1,
                        a = !1,
                        o;
                    for (o in n)
                        if (n.hasOwnProperty(o)) {
                            var s = n[o];
                            if (s != null)
                                switch (o) {
                                    case `src`:
                                        r = !0;
                                        break;
                                    case `srcSet`:
                                        a = !0;
                                        break;
                                    case `children`:
                                    case `dangerouslySetInnerHTML`:
                                        throw Error(i(137, t));
                                    default:
                                        $(e, t, o, s, n, null);
                                }
                        }
                    (a && $(e, t, `srcSet`, n.srcSet, n, null),
                        r && $(e, t, `src`, n.src, n, null));
                    return;
                case `input`:
                    Q(`invalid`, e);
                    var c = (o = s = a = null),
                        l = null,
                        u = null;
                    for (r in n)
                        if (n.hasOwnProperty(r)) {
                            var d = n[r];
                            if (d != null)
                                switch (r) {
                                    case `name`:
                                        a = d;
                                        break;
                                    case `type`:
                                        s = d;
                                        break;
                                    case `checked`:
                                        l = d;
                                        break;
                                    case `defaultChecked`:
                                        u = d;
                                        break;
                                    case `value`:
                                        o = d;
                                        break;
                                    case `defaultValue`:
                                        c = d;
                                        break;
                                    case `children`:
                                    case `dangerouslySetInnerHTML`:
                                        if (d != null) throw Error(i(137, t));
                                        break;
                                    default:
                                        $(e, t, r, d, n, null);
                                }
                        }
                    gn(e, o, c, l, u, s, a, !1);
                    return;
                case `select`:
                    for (a in (Q(`invalid`, e), (r = s = o = null), n))
                        if (n.hasOwnProperty(a) && ((c = n[a]), c != null))
                            switch (a) {
                                case `value`:
                                    o = c;
                                    break;
                                case `defaultValue`:
                                    s = c;
                                    break;
                                case `multiple`:
                                    r = c;
                                default:
                                    $(e, t, a, c, n, null);
                            }
                    ((t = o),
                        (n = s),
                        (e.multiple = !!r),
                        t == null ? n != null && vn(e, !!r, n, !0) : vn(e, !!r, t, !1));
                    return;
                case `textarea`:
                    for (s in (Q(`invalid`, e), (o = a = r = null), n))
                        if (n.hasOwnProperty(s) && ((c = n[s]), c != null))
                            switch (s) {
                                case `value`:
                                    r = c;
                                    break;
                                case `defaultValue`:
                                    a = c;
                                    break;
                                case `children`:
                                    o = c;
                                    break;
                                case `dangerouslySetInnerHTML`:
                                    if (c != null) throw Error(i(91));
                                    break;
                                default:
                                    $(e, t, s, c, n, null);
                            }
                    bn(e, r, a, o);
                    return;
                case `option`:
                    for (l in n)
                        if (n.hasOwnProperty(l) && ((r = n[l]), r != null))
                            switch (l) {
                                case `selected`:
                                    e.selected =
                                        r &&
                                        typeof r != `function` &&
                                        typeof r != `symbol`;
                                    break;
                                default:
                                    $(e, t, l, r, n, null);
                            }
                    return;
                case `dialog`:
                    (Q(`beforetoggle`, e),
                        Q(`toggle`, e),
                        Q(`cancel`, e),
                        Q(`close`, e));
                    break;
                case `iframe`:
                case `object`:
                    Q(`load`, e);
                    break;
                case `video`:
                case `audio`:
                    for (r = 0; r < zf.length; r++) Q(zf[r], e);
                    break;
                case `image`:
                    (Q(`error`, e), Q(`load`, e));
                    break;
                case `details`:
                    Q(`toggle`, e);
                    break;
                case `embed`:
                case `source`:
                case `link`:
                    (Q(`error`, e), Q(`load`, e));
                case `area`:
                case `base`:
                case `br`:
                case `col`:
                case `hr`:
                case `keygen`:
                case `meta`:
                case `param`:
                case `track`:
                case `wbr`:
                case `menuitem`:
                    for (u in n)
                        if (n.hasOwnProperty(u) && ((r = n[u]), r != null))
                            switch (u) {
                                case `children`:
                                case `dangerouslySetInnerHTML`:
                                    throw Error(i(137, t));
                                default:
                                    $(e, t, u, r, n, null);
                            }
                    return;
                default:
                    if (Tn(t)) {
                        for (d in n)
                            n.hasOwnProperty(d) &&
                                ((r = n[d]), r !== void 0 && tp(e, t, d, r, n, void 0));
                        return;
                    }
            }
            for (c in n)
                n.hasOwnProperty(c) &&
                    ((r = n[c]), r != null && $(e, t, c, r, n, null));
        }
        var rp = {};
        function ip(e, t, n, r) {
            switch (t) {
                case `div`:
                case `span`:
                case `svg`:
                case `path`:
                case `a`:
                case `g`:
                case `p`:
                case `li`:
                    break;
                case `input`:
                    var a = null,
                        o = null,
                        s = null,
                        c = null,
                        l = null,
                        u = null,
                        d = null;
                    for (m in n) {
                        var f = n[m];
                        if (n.hasOwnProperty(m) && f != null)
                            switch (m) {
                                case `checked`:
                                    break;
                                case `value`:
                                    break;
                                case `defaultValue`:
                                    l = f;
                                default:
                                    r.hasOwnProperty(m) || $(e, t, m, null, r, f);
                            }
                    }
                    for (var p in r) {
                        var m = r[p];
                        if (
                            ((f = n[p]),
                            r.hasOwnProperty(p) && (m != null || f != null))
                        )
                            switch (p) {
                                case `type`:
                                    (m !== f && (O = !0), (o = m));
                                    break;
                                case `name`:
                                    (m !== f && (O = !0), (a = m));
                                    break;
                                case `checked`:
                                    (m !== f && (O = !0), (u = m));
                                    break;
                                case `defaultChecked`:
                                    (m !== f && (O = !0), (d = m));
                                    break;
                                case `value`:
                                    (m !== f && (O = !0), (s = m));
                                    break;
                                case `defaultValue`:
                                    (m !== f && (O = !0), (c = m));
                                    break;
                                case `children`:
                                case `dangerouslySetInnerHTML`:
                                    if (m != null) throw Error(i(137, t));
                                    break;
                                default:
                                    m !== f && $(e, t, p, m, r, f);
                            }
                    }
                    hn(e, s, c, l, u, d, o, a);
                    return;
                case `select`:
                    for (o in ((m = s = c = p = null), n))
                        if (((l = n[o]), n.hasOwnProperty(o) && l != null))
                            switch (o) {
                                case `value`:
                                    break;
                                case `multiple`:
                                    m = l;
                                default:
                                    r.hasOwnProperty(o) || $(e, t, o, null, r, l);
                            }
                    for (a in r)
                        if (
                            ((o = r[a]),
                            (l = n[a]),
                            r.hasOwnProperty(a) && (o != null || l != null))
                        )
                            switch (a) {
                                case `value`:
                                    (o !== l && (O = !0), (p = o));
                                    break;
                                case `defaultValue`:
                                    (o !== l && (O = !0), (c = o));
                                    break;
                                case `multiple`:
                                    (o !== l && (O = !0), (s = o));
                                default:
                                    o !== l && $(e, t, a, o, r, l);
                            }
                    ((t = c),
                        (n = s),
                        (r = m),
                        p == null
                            ? !!r != !!n &&
                              (t == null
                                  ? vn(e, !!n, n ? [] : ``, !1)
                                  : vn(e, !!n, t, !0))
                            : vn(e, !!n, p, !1));
                    return;
                case `textarea`:
                    for (c in ((m = p = null), n))
                        if (
                            ((a = n[c]),
                            n.hasOwnProperty(c) && a != null && !r.hasOwnProperty(c))
                        )
                            switch (c) {
                                case `value`:
                                    break;
                                case `children`:
                                    break;
                                default:
                                    $(e, t, c, null, r, a);
                            }
                    for (s in r)
                        if (
                            ((a = r[s]),
                            (o = n[s]),
                            r.hasOwnProperty(s) && (a != null || o != null))
                        )
                            switch (s) {
                                case `value`:
                                    (a !== o && (O = !0), (p = a));
                                    break;
                                case `defaultValue`:
                                    (a !== o && (O = !0), (m = a));
                                    break;
                                case `children`:
                                    break;
                                case `dangerouslySetInnerHTML`:
                                    if (a != null) throw Error(i(91));
                                    break;
                                default:
                                    a !== o && $(e, t, s, a, r, o);
                            }
                    yn(e, p, m);
                    return;
                case `option`:
                    for (var h in n)
                        if (
                            ((p = n[h]),
                            n.hasOwnProperty(h) && p != null && !r.hasOwnProperty(h))
                        )
                            switch (h) {
                                case `selected`:
                                    e.selected = !1;
                                    break;
                                default:
                                    $(e, t, h, null, r, p);
                            }
                    for (l in r)
                        if (
                            ((p = r[l]),
                            (m = n[l]),
                            r.hasOwnProperty(l) && p !== m && (p != null || m != null))
                        )
                            switch (l) {
                                case `selected`:
                                    (p !== m && (O = !0),
                                        (e.selected =
                                            p &&
                                            typeof p != `function` &&
                                            typeof p != `symbol`));
                                    break;
                                default:
                                    $(e, t, l, p, r, m);
                            }
                    return;
                case `img`:
                case `link`:
                case `area`:
                case `base`:
                case `br`:
                case `col`:
                case `embed`:
                case `hr`:
                case `keygen`:
                case `meta`:
                case `param`:
                case `source`:
                case `track`:
                case `wbr`:
                case `menuitem`:
                    for (var g in n)
                        ((p = n[g]),
                            n.hasOwnProperty(g) &&
                                p != null &&
                                !r.hasOwnProperty(g) &&
                                $(e, t, g, null, r, p));
                    for (u in r)
                        if (
                            ((p = r[u]),
                            (m = n[u]),
                            r.hasOwnProperty(u) && p !== m && (p != null || m != null))
                        )
                            switch (u) {
                                case `children`:
                                case `dangerouslySetInnerHTML`:
                                    if (p != null) throw Error(i(137, t));
                                    break;
                                default:
                                    $(e, t, u, p, r, m);
                            }
                    return;
                default:
                    if (Tn(t)) {
                        for (var _ in n)
                            ((p = n[_]),
                                n.hasOwnProperty(_) &&
                                    p !== void 0 &&
                                    !r.hasOwnProperty(_) &&
                                    tp(e, t, _, void 0, r, p));
                        for (d in r)
                            ((p = r[d]),
                                (m = n[d]),
                                !r.hasOwnProperty(d) ||
                                    p === m ||
                                    (p === void 0 && m === void 0) ||
                                    tp(e, t, d, p, r, m));
                        return;
                    }
            }
            for (var v in n)
                ((p = n[v]),
                    n.hasOwnProperty(v) &&
                        p != null &&
                        !r.hasOwnProperty(v) &&
                        $(e, t, v, null, r, p));
            for (f in r)
                ((p = r[f]),
                    (m = n[f]),
                    !r.hasOwnProperty(f) ||
                        p === m ||
                        (p == null && m == null) ||
                        $(e, t, f, p, r, m));
        }
        function ap(e) {
            switch (e) {
                case `css`:
                case `script`:
                case `font`:
                case `img`:
                case `image`:
                case `input`:
                case `link`:
                    return !0;
                default:
                    return !1;
            }
        }
        function op() {
            if (typeof performance.getEntriesByType == `function`) {
                for (
                    var e = 0,
                        t = 0,
                        n = performance.getEntriesByType(`resource`),
                        r = 0;
                    r < n.length;
                    r++
                ) {
                    var i = n[r],
                        a = i.transferSize,
                        o = i.initiatorType,
                        s = i.duration;
                    if (a && s && ap(o)) {
                        for (o = 0, s = i.responseEnd, r += 1; r < n.length; r++) {
                            var c = n[r],
                                l = c.startTime;
                            if (l > s) break;
                            var u = c.transferSize,
                                d = c.initiatorType;
                            u &&
                                ap(d) &&
                                ((c = c.responseEnd),
                                (o += u * (c < s ? 1 : (s - l) / (c - l))));
                        }
                        if (
                            (--r,
                            (t += (8 * (a + o)) / (i.duration / 1e3)),
                            e++,
                            10 < e)
                        )
                            break;
                    }
                }
                if (0 < e) return t / e / 1e6;
            }
            return navigator.connection &&
                ((e = navigator.connection.downlink), typeof e == `number`)
                ? e
                : 5;
        }
        var sp = null,
            cp = null;
        function lp(e) {
            return e.nodeType === 9 ? e : e.ownerDocument;
        }
        function up(e) {
            switch (e) {
                case `http://www.w3.org/2000/svg`:
                    return 1;
                case `http://www.w3.org/1998/Math/MathML`:
                    return 2;
                default:
                    return 0;
            }
        }
        function dp(e, t) {
            if (e === 0)
                switch (t) {
                    case `svg`:
                        return 1;
                    case `math`:
                        return 2;
                    default:
                        return 0;
                }
            return e === 1 && t === `foreignObject` ? 0 : e;
        }
        function fp(e, t, n, r) {
            return (
                (n = lp(n).createElement(e)),
                (n[Pt] = r),
                (n[D] = t),
                np(n, e, t),
                qt(n),
                n
            );
        }
        function pp(e, t) {
            return (
                e === `textarea` ||
                e === `noscript` ||
                typeof t.children == `string` ||
                typeof t.children == `number` ||
                typeof t.children == `bigint` ||
                (typeof t.dangerouslySetInnerHTML == `object` &&
                    t.dangerouslySetInnerHTML !== null &&
                    t.dangerouslySetInnerHTML.__html != null)
            );
        }
        var mp = null;
        function hp() {
            var e = window.event;
            return e && e.type === `popstate`
                ? e !== mp && ((mp = e), !0)
                : ((mp = null), !1);
        }
        var gp = typeof setTimeout == `function` ? setTimeout : void 0,
            _p = typeof clearTimeout == `function` ? clearTimeout : void 0,
            vp = typeof Promise == `function` ? Promise : void 0,
            yp =
                typeof requestAnimationFrame == `function` ? requestAnimationFrame : gp,
            bp =
                typeof queueMicrotask == `function`
                    ? queueMicrotask
                    : vp === void 0
                      ? gp
                      : function (e) {
                            return vp.resolve(null).then(e).catch(xp);
                        };
        function xp(e) {
            setTimeout(function () {
                throw e;
            });
        }
        function Sp(e) {
            return e === `head`;
        }
        function Cp(e, t) {
            var n = t,
                r = 0;
            do {
                var i = n.nextSibling;
                if ((e.removeChild(n), i && i.nodeType === 8)) {
                    if (((n = i.data), n === `/$` || n === `/&`)) {
                        if (r === 0) {
                            (e.removeChild(i), Hh(t));
                            return;
                        }
                        r--;
                    } else if (
                        n === `$` ||
                        n === `$?` ||
                        n === `$~` ||
                        n === `$!` ||
                        n === `&`
                    )
                        r++;
                    else if (n === `html`) _m(e.ownerDocument.documentElement);
                    else if (n === `head`) {
                        ((n = e.ownerDocument.head), _m(n));
                        for (var a = n.firstChild; a;) {
                            var o = a.nextSibling,
                                s = a.nodeName;
                            (a[Bt] ||
                                s === `SCRIPT` ||
                                s === `STYLE` ||
                                (s === `LINK` &&
                                    a.rel.toLowerCase() === `stylesheet`) ||
                                n.removeChild(a),
                                (a = o));
                        }
                    } else n === `body` && _m(e.ownerDocument.body);
                }
                n = i;
            } while (n);
            Hh(t);
        }
        function wp(e, t) {
            var n = e;
            e = 0;
            do {
                var r = n.nextSibling;
                if (
                    (n.nodeType === 1
                        ? t
                            ? ((n._stashedDisplay = n.style.display),
                              (n.style.display = `none`))
                            : ((n.style.display = n._stashedDisplay || ``),
                              n.getAttribute(`style`) === `` &&
                                  n.removeAttribute(`style`))
                        : n.nodeType === 3 &&
                          (t
                              ? ((n._stashedText = n.nodeValue), (n.nodeValue = ``))
                              : (n.nodeValue = n._stashedText || ``)),
                    r && r.nodeType === 8)
                ) {
                    if (((n = r.data), n === `/$`)) {
                        if (e === 0) break;
                        e--;
                    } else (n !== `$` && n !== `$?` && n !== `$~` && n !== `$!`) || e++;
                }
                n = r;
            } while (n);
        }
        function Tp(e, t, n) {
            if (
                ((t = CSS.escape(t) === t ? t : `r-` + btoa(t).replace(/=/g, ``)),
                (e.style.viewTransitionName = t),
                n != null && (e.style.viewTransitionClass = n),
                (n = getComputedStyle(e)),
                n.display === `inline`)
            ) {
                if (((t = e.getClientRects()), t.length === 1)) var r = 1;
                else
                    for (var i = (r = 0); i < t.length; i++) {
                        var a = t[i];
                        0 < a.width && 0 < a.height && r++;
                    }
                r === 1 &&
                    ((e = e.style),
                    (e.display = t.length === 1 ? `inline-block` : `block`),
                    (e.marginTop = `-` + n.paddingTop),
                    (e.marginBottom = `-` + n.paddingBottom));
            }
        }
        function Ep(e, t) {
            ((e = e.style), (t = t.style));
            var n =
                t == null
                    ? null
                    : t.hasOwnProperty(`viewTransitionName`)
                      ? t.viewTransitionName
                      : t.hasOwnProperty(`view-transition-name`)
                        ? t[`view-transition-name`]
                        : null;
            ((e.viewTransitionName =
                n == null || typeof n == `boolean` ? `` : (`` + n).trim()),
                (n =
                    t == null
                        ? null
                        : t.hasOwnProperty(`viewTransitionClass`)
                          ? t.viewTransitionClass
                          : t.hasOwnProperty(`view-transition-class`)
                            ? t[`view-transition-class`]
                            : null),
                (e.viewTransitionClass =
                    n == null || typeof n == `boolean` ? `` : (`` + n).trim()),
                e.display === `inline-block` &&
                    (t == null
                        ? (e.display = e.margin = ``)
                        : ((n = t.display),
                          (e.display = n == null || typeof n == `boolean` ? `` : n),
                          (n = t.margin),
                          n == null
                              ? ((n = t.hasOwnProperty(`marginTop`)
                                    ? t.marginTop
                                    : t[`margin-top`]),
                                (e.marginTop =
                                    n == null || typeof n == `boolean` ? `` : n),
                                (t = t.hasOwnProperty(`marginBottom`)
                                    ? t.marginBottom
                                    : t[`margin-bottom`]),
                                (e.marginBottom =
                                    t == null || typeof t == `boolean` ? `` : t))
                              : (e.margin = n))));
        }
        function Dp(e, t, n) {
            return (
                (n = n.ownerDocument.defaultView),
                {
                    rect: e,
                    abs: t.position === `absolute` || t.position === `fixed`,
                    clip:
                        t.clipPath !== `none` ||
                        t.overflow !== `visible` ||
                        t.filter !== `none` ||
                        t.mask !== `none` ||
                        t.mask !== `none` ||
                        t.borderRadius !== `0px`,
                    view:
                        0 <= e.bottom &&
                        0 <= e.right &&
                        e.top <= n.innerHeight &&
                        e.left <= n.innerWidth,
                }
            );
        }
        function Op(e) {
            return Dp(e.getBoundingClientRect(), getComputedStyle(e), e);
        }
        function kp(e) {
            var t = e.getBoundingClientRect();
            t = new DOMRect(t.x + 2e4, t.y + 2e4, t.width, t.height);
            var n = getComputedStyle(e);
            return Dp(t, n, e);
        }
        function Ap(e) {
            return e.documentElement.clientHeight;
        }
        function jp(e) {
            (this.addEventListener(`load`, e), this.addEventListener(`error`, e));
        }
        function Mp(e, t, n, r, i, a, o, s, c) {
            var l = t.nodeType === 9 ? t : t.ownerDocument;
            try {
                var u = l.startViewTransition({
                    update: function () {
                        var t = l.defaultView,
                            n = t.navigation && t.navigation.transition,
                            o = l.fonts.status;
                        r();
                        var s = [];
                        if (
                            (o === `loaded` &&
                                (Ap(l),
                                l.fonts.status === `loading` && s.push(l.fonts.ready)),
                            (o = s.length),
                            e !== null)
                        )
                            for (
                                var c = e.suspenseyImages, u = 0, d = 0;
                                d < c.length;
                                d++
                            ) {
                                var f = c[d];
                                if (!f.complete) {
                                    var p = f.getBoundingClientRect();
                                    if (
                                        0 < p.bottom &&
                                        0 < p.right &&
                                        p.top < t.innerHeight &&
                                        p.left < t.innerWidth
                                    ) {
                                        if (((u += Xm(f)), u > $m)) {
                                            s.length = o;
                                            break;
                                        }
                                        ((f = new Promise(jp.bind(f))), s.push(f));
                                    }
                                }
                            }
                        if (0 < s.length)
                            return (
                                (t = Promise.race([
                                    Promise.all(s),
                                    new Promise(function (e) {
                                        return setTimeout(e, 500);
                                    }),
                                ]).then(i, i)),
                                (n ? Promise.allSettled([n.finished, t]) : t).then(a, a)
                            );
                        if ((i(), n)) return n.finished.then(a, a);
                        a();
                    },
                    types: n,
                });
                l.__reactViewTransition = u;
                var d = [];
                return (
                    u.ready.then(
                        function () {
                            for (
                                var e = l.documentElement.getAnimations({
                                        subtree: !0,
                                    }),
                                    t = 0;
                                t < e.length;
                                t++
                            ) {
                                var n = e[t],
                                    r = n.effect,
                                    i = r.pseudoElement;
                                if (i != null && i.startsWith(`::view-transition`)) {
                                    (d.push(n), (n = r.getKeyframes()));
                                    for (
                                        var a = (i = void 0), s = !0, c = 0;
                                        c < n.length;
                                        c++
                                    ) {
                                        var u = n[c],
                                            f = u.width;
                                        if (i === void 0) i = f;
                                        else if (i !== f) {
                                            s = !1;
                                            break;
                                        }
                                        if (((f = u.height), a === void 0)) a = f;
                                        else if (a !== f) {
                                            s = !1;
                                            break;
                                        }
                                        (delete u.width,
                                            delete u.height,
                                            u.transform === `none` &&
                                                delete u.transform);
                                    }
                                    s &&
                                        i !== void 0 &&
                                        a !== void 0 &&
                                        (r.setKeyframes(n),
                                        (s = getComputedStyle(
                                            r.target,
                                            r.pseudoElement,
                                        )),
                                        s.width !== i || s.height !== a) &&
                                        ((s = n[0]),
                                        (s.width = i),
                                        (s.height = a),
                                        (s = n[n.length - 1]),
                                        (s.width = i),
                                        (s.height = a),
                                        r.setKeyframes(n));
                                }
                            }
                            o();
                        },
                        function (e) {
                            l.__reactViewTransition === u &&
                                (l.__reactViewTransition = null);
                            try {
                                if (typeof e == `object` && e)
                                    switch (e.name) {
                                        case `InvalidStateError`:
                                            (e.message ===
                                                `View transition was skipped because document visibility state is hidden.` ||
                                                e.message ===
                                                    `Skipping view transition because document visibility state has become hidden.` ||
                                                e.message ===
                                                    `Skipping view transition because viewport size changed.` ||
                                                e.message ===
                                                    `Transition was aborted because of invalid state`) &&
                                                (e = null);
                                    }
                                e !== null && c(e);
                            } finally {
                                (r(), i(), o());
                            }
                        },
                    ),
                    u.finished.finally(function () {
                        for (var e = 0; e < d.length; e++) d[e].cancel();
                        (l.__reactViewTransition === u &&
                            (l.__reactViewTransition = null),
                            s());
                    }),
                    u
                );
            } catch {
                return (r(), i(), o(), null);
            }
        }
        function Np(e, t) {
            ((this._scope = document.documentElement),
                (this._selector = `::view-transition-` + e + `(` + t + `)`));
        }
        ((Np.prototype.animate = function (e, t) {
            return (
                (t = typeof t == `number` ? { duration: t } : S({}, t)),
                (t.pseudoElement = this._selector),
                this._scope.animate(e, t)
            );
        }),
            (Np.prototype.getAnimations = function () {
                for (
                    var e = this._scope,
                        t = this._selector,
                        n = e.getAnimations({ subtree: !0 }),
                        r = [],
                        i = 0;
                    i < n.length;
                    i++
                ) {
                    var a = n[i].effect;
                    a !== null &&
                        a.target === e &&
                        a.pseudoElement === t &&
                        r.push(n[i]);
                }
                return r;
            }),
            (Np.prototype.getComputedStyle = function () {
                return getComputedStyle(this._scope, this._selector);
            }));
        function Pp(e) {
            return {
                name: e,
                group: new Np(`group`, e),
                imagePair: new Np(`image-pair`, e),
                old: new Np(`old`, e),
                new: new Np(`new`, e),
            };
        }
        function Fp(e) {
            ((this._fragmentFiber = e),
                (this._observers = this._eventListeners = null));
        }
        Fp.prototype.addEventListener = function (e, t, n) {
            var r = null,
                i = null;
            if (!(
                n != null &&
                typeof n != `boolean` &&
                ((r = n.signal || null), r !== null && r.aborted)
            )) {
                this._eventListeners === null && (this._eventListeners = []);
                var a = this._eventListeners;
                if (Bp(a, e, t, n) === -1) {
                    var o = this,
                        s = t;
                    (n != null &&
                        typeof n != `boolean` &&
                        !0 === n.once &&
                        (s = function (r) {
                            (o.removeEventListener(e, t, n),
                                typeof t == `function`
                                    ? t.call(this, r)
                                    : t.handleEvent(r));
                        }),
                        r !== null &&
                            ((i = o.removeEventListener.bind(o, e, t, n)),
                            r.addEventListener(`abort`, i, { once: !0 }),
                            (i = r.removeEventListener.bind(r, `abort`, i))),
                        (r = Rp(n)),
                        a.push({
                            type: e,
                            listener: t,
                            optionsOrUseCapture: n,
                            attachedListener: s,
                            cleanup: i,
                        }),
                        f(this._fragmentFiber.child, !1, Ip, e, s, r));
                }
                this._eventListeners = a;
            }
        };
        function Ip(e, t, n, r) {
            return (b(e).addEventListener(t, n, r), !1);
        }
        Fp.prototype.removeEventListener = function (e, t, n) {
            var r = this._eventListeners;
            if (r !== null && ((t = Bp(r, e, t, n)), t !== -1)) {
                var i = r[t];
                n = i.attachedListener;
                var a = i.cleanup;
                ((i = Rp(i.optionsOrUseCapture)),
                    f(this._fragmentFiber.child, !1, Lp, e, n, i),
                    r.splice(t, 1),
                    a !== null && a());
            }
        };
        function Lp(e, t, n, r) {
            return (b(e).removeEventListener(t, n, r), !1);
        }
        function Rp(e) {
            return e != null &&
                typeof e != `boolean` &&
                (!0 === e.once || e.signal instanceof AbortSignal)
                ? { capture: e.capture, passive: e.passive }
                : e;
        }
        function zp(e) {
            return e == null
                ? `c=0`
                : typeof e == `boolean`
                  ? `c=` + (e ? `1` : `0`)
                  : `c=` + (e.capture ? `1` : `0`);
        }
        function Bp(e, t, n, r) {
            if (e.length === 0) return -1;
            r = zp(r);
            for (var i = 0; i < e.length; i++) {
                var a = e[i];
                if (a.type === t && a.listener === n && zp(a.optionsOrUseCapture) === r)
                    return i;
            }
            return -1;
        }
        ((Fp.prototype.dispatchEvent = function (e) {
            var t = m(this._fragmentFiber);
            if (t === null) return !0;
            t = b(t);
            var n = this._eventListeners;
            if ((n !== null && 0 < n.length) || !e.bubbles) {
                var r =
                    t.nodeType === 9
                        ? t.createComment(``)
                        : document.createTextNode(``);
                if (n)
                    for (var i = 0; i < n.length; i++) {
                        var a = n[i];
                        r.addEventListener(
                            a.type,
                            a.attachedListener,
                            Rp(a.optionsOrUseCapture),
                        );
                    }
                if ((t.appendChild(r), (e = r.dispatchEvent(e)), n))
                    for (i = 0; i < n.length; i++)
                        ((a = n[i]),
                            r.removeEventListener(
                                a.type,
                                a.attachedListener,
                                Rp(a.optionsOrUseCapture),
                            ));
                return (t.removeChild(r), e);
            }
            return t.dispatchEvent(e);
        }),
            (Fp.prototype.focus = function (e) {
                f(this._fragmentFiber.child, !0, Vp, e, void 0, void 0);
            }));
        function Vp(e, t) {
            return e.tag !== 6 && ((e = b(e)), pm(e, t));
        }
        Fp.prototype.focusLast = function (e) {
            var t = [];
            f(this._fragmentFiber.child, !0, Hp, t, void 0, void 0);
            for (var n = t.length - 1; 0 <= n && !Vp(t[n], e); n--);
        };
        function Hp(e, t) {
            return (t.push(e), !1);
        }
        Fp.prototype.blur = function () {
            var e = m(this._fragmentFiber);
            e !== null &&
                ((e = b(e)),
                (e = lp(e).activeElement),
                e !== null && f(this._fragmentFiber.child, !1, Up, e, void 0, void 0));
        };
        function Up(e, t) {
            return (
                e.tag !== 6 &&
                ((e = b(e)), e === t || e.contains(t) ? (t.blur(), !0) : !1)
            );
        }
        Fp.prototype.observeUsing = function (e) {
            (this._observers === null && (this._observers = new Set()),
                this._observers.add(e),
                f(this._fragmentFiber.child, !1, Wp, e, void 0, void 0));
        };
        function Wp(e, t) {
            return e.tag !== 6 && ((e = b(e)), t.observe(e), !1);
        }
        Fp.prototype.unobserveUsing = function (e) {
            var t = this._observers;
            if (t !== null && t.has(e)) {
                (t.delete(e), f(this._fragmentFiber.child, !1, Gp, e, void 0, void 0));
                for (var n = (t = 0); n < Kp.length; n++) {
                    var r = Kp[n];
                    r.fragmentInstance === this && r.observer === e
                        ? e.unobserve(r.instance)
                        : (Kp[t++] = r);
                }
                Kp.length = t;
            }
        };
        function Gp(e, t) {
            return e.tag !== 6 && ((e = b(e)), t.unobserve(e), !1);
        }
        var Kp = [],
            qp = !1;
        function Jp(e, t, n) {
            (Kp.push({ fragmentInstance: e, observer: t, instance: n }),
                qp ||
                    ((qp = !0),
                    mm(function () {
                        qp = !1;
                        var e = Kp;
                        Kp = [];
                        for (var t = 0; t < e.length; t++) {
                            var n = e[t];
                            n.observer.unobserve(n.instance);
                        }
                    })));
        }
        Fp.prototype.getClientRects = function () {
            var e = [];
            return (f(this._fragmentFiber.child, !1, Yp, e, void 0, void 0), e);
        };
        function Yp(e, t) {
            if (e.tag === 6) {
                e = e.stateNode;
                var n = e.ownerDocument.createRange();
                (n.selectNodeContents(e), t.push.apply(t, n.getClientRects()));
            } else ((e = b(e)), t.push.apply(t, e.getClientRects()));
            return !1;
        }
        ((Fp.prototype.getRootNode = function (e) {
            var t = m(this._fragmentFiber);
            return t === null ? this : b(t).getRootNode(e);
        }),
            (Fp.prototype.compareDocumentPosition = function (e) {
                var t = m(this._fragmentFiber);
                if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
                var n = [];
                f(this._fragmentFiber.child, !1, Hp, n, void 0, void 0);
                var r = b(t);
                if (n.length === 0) {
                    if (((n = r), g(this._fragmentFiber))) {
                        a: {
                            for (t = this._fragmentFiber.return; t !== null;) {
                                if (t.tag === 4) {
                                    t = t.stateNode.containerInfo;
                                    break a;
                                }
                                if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
                                t = t.return;
                            }
                            t = null;
                        }
                        t != null && (n = t);
                    }
                    t = this._fragmentFiber;
                    var i = (r = n.compareDocumentPosition(e));
                    return (
                        n === e
                            ? (i = Node.DOCUMENT_POSITION_CONTAINS)
                            : r & Node.DOCUMENT_POSITION_CONTAINED_BY &&
                              ((n = v(t)[1]),
                              n === null
                                  ? (i = Node.DOCUMENT_POSITION_PRECEDING)
                                  : ((e = b(n).compareDocumentPosition(e)),
                                    (i =
                                        e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING
                                            ? Node.DOCUMENT_POSITION_FOLLOWING
                                            : Node.DOCUMENT_POSITION_PRECEDING))),
                        (i |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC)
                    );
                }
                ((t = b(n[0])), (i = b(n[n.length - 1])));
                var a = g(this._fragmentFiber) ? t.parentElement : r;
                if (a == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
                ((r =
                    a.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY),
                    (a =
                        a.compareDocumentPosition(i) &
                        Node.DOCUMENT_POSITION_CONTAINED_BY));
                var o = t.compareDocumentPosition(e),
                    s = i.compareDocumentPosition(e),
                    c =
                        o & Node.DOCUMENT_POSITION_CONTAINED_BY ||
                        s & Node.DOCUMENT_POSITION_CONTAINED_BY;
                return (
                    (s =
                        r &&
                        a &&
                        o & Node.DOCUMENT_POSITION_FOLLOWING &&
                        s & Node.DOCUMENT_POSITION_PRECEDING),
                    (t =
                        (r && t === e) || (a && i === e) || c || s
                            ? Node.DOCUMENT_POSITION_CONTAINED_BY
                            : (!r && t === e) || (!a && i === e)
                              ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                              : o),
                    t & Node.DOCUMENT_POSITION_DISCONNECTED ||
                    t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC ||
                    Xp(t, this._fragmentFiber, n[0], n[n.length - 1], e)
                        ? t
                        : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
                );
            }));
        function Xp(e, t, n, r, i) {
            var a = Ut(i);
            if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                if ((n = !!a))
                    a: {
                        for (; a !== null;) {
                            if (a.tag === 7 && (a === t || a.alternate === t)) {
                                n = !0;
                                break a;
                            }
                            a = a.return;
                        }
                        n = !1;
                    }
                return n;
            }
            if (e & Node.DOCUMENT_POSITION_CONTAINS) {
                if (a === null)
                    return (
                        (a = i.ownerDocument),
                        i === a || i === a.documentElement || i === a.body
                    );
                a: {
                    for (a = t, t = m(t); a !== null;) {
                        if (!(
                            (a.tag !== 5 && a.tag !== 3 && a.tag !== 27) ||
                            (a !== t && a.alternate !== t)
                        )) {
                            a = !0;
                            break a;
                        }
                        a = a.return;
                    }
                    a = !1;
                }
                return a;
            }
            return e & Node.DOCUMENT_POSITION_PRECEDING
                ? ((t = !!a) &&
                      !(t = a === n) &&
                      ((t = ie(n, a, x)),
                      t === null
                          ? (t = !1)
                          : (f(t, !0, ne, a, n),
                            (a = ee),
                            (ee = null),
                            (t = a !== null))),
                  t)
                : e & Node.DOCUMENT_POSITION_FOLLOWING
                  ? ((t = !!a) &&
                        !(t = a === r) &&
                        ((t = ie(r, a, x)),
                        t === null
                            ? (t = !1)
                            : (f(t, !0, re, a, r),
                              (a = ee),
                              (te = ee = null),
                              (t = a !== null))),
                    t)
                  : !1;
        }
        function Zp(e, t) {
            var n = e.ownerDocument.createRange();
            (n.selectNodeContents(e),
                (e = n.getBoundingClientRect()),
                window.scrollTo(
                    window.scrollX + e.left,
                    t
                        ? window.scrollY + e.top
                        : window.scrollY + e.bottom - window.innerHeight,
                ));
        }
        Fp.prototype.scrollIntoView = function (e) {
            if (typeof e == `object`) throw Error(i(566));
            var t = [];
            f(this._fragmentFiber.child, !1, Hp, t, void 0, void 0);
            var n = !1 !== e;
            if (t.length === 0) {
                var r = v(this._fragmentFiber);
                if (
                    ((r = n ? r[1] || r[0] || m(this._fragmentFiber) : r[0] || r[1]),
                    r === null)
                )
                    return;
                if (r.tag === 6) {
                    ((e = b(r)), Zp(e, n));
                    return;
                }
                if (((r = b(r)), r.nodeType !== 9)) {
                    if (r.nodeType === 11) {
                        ((n = `host` in r ? r.host : null),
                            n !== null && n.scrollIntoView(e));
                        return;
                    }
                    r.scrollIntoView(e);
                }
            }
            for (r = n ? t.length - 1 : 0; r !== (n ? -1 : t.length);) {
                var a = t[r];
                (a.tag === 6 ? ((a = b(a)), Zp(a, n)) : b(a).scrollIntoView(e),
                    (r += n ? -1 : 1));
            }
        };
        function Qp(e, t) {
            return ((e = b(e)), $p(e, t), !1);
        }
        function $p(e, t) {
            ((e.reactFragments ??= new Set()), e.reactFragments.add(t));
        }
        function em(e, t) {
            var n = t._eventListeners;
            if (n !== null)
                for (var r = 0; r < n.length; r++) {
                    var i = n[r];
                    e.addEventListener(
                        i.type,
                        i.attachedListener,
                        Rp(i.optionsOrUseCapture),
                    );
                }
            e.nodeType !== 3 &&
                ((n = t._observers),
                n !== null &&
                    n.forEach(function (n) {
                        for (var r = 0, i = 0; i < Kp.length; i++) {
                            var a = Kp[i];
                            (a.fragmentInstance !== t ||
                                a.observer !== n ||
                                a.instance !== e) &&
                                (Kp[r++] = a);
                        }
                        ((Kp.length = r), n.observe(e));
                    }),
                $p(e, t));
        }
        function tm(e, t) {
            var n = t._eventListeners;
            if (n !== null)
                for (var r = 0; r < n.length; r++) {
                    var i = n[r];
                    e.removeEventListener(
                        i.type,
                        i.attachedListener,
                        Rp(i.optionsOrUseCapture),
                    );
                }
            e.nodeType !== 3 &&
                ((n = t._observers),
                n !== null &&
                    n.forEach(function (n) {
                        typeof n.rootMargin == `string` ? Jp(t, n, e) : n.unobserve(e);
                    }),
                e.reactFragments != null && e.reactFragments.delete(t));
        }
        function nm(e) {
            var t = e.firstChild;
            for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
                var n = t;
                switch (((t = t.nextSibling), n.nodeName)) {
                    case `HTML`:
                    case `HEAD`:
                    case `BODY`:
                        (nm(n), Ht(n));
                        continue;
                    case `SCRIPT`:
                    case `STYLE`:
                        continue;
                    case `LINK`:
                        if (n.rel.toLowerCase() === `stylesheet`) continue;
                }
                e.removeChild(n);
            }
        }
        function rm(e, t, n, r) {
            for (; e.nodeType === 1;) {
                var i = n;
                if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
                    if (!r && (e.nodeName !== `INPUT` || e.type !== `hidden`)) break;
                } else if (!r) {
                    if (t === `input` && e.type === `hidden`) {
                        var a = i.name == null ? null : `` + i.name;
                        if (i.type === `hidden` && e.getAttribute(`name`) === a)
                            return e;
                    } else return e;
                } else if (!e[Bt])
                    switch (t) {
                        case `meta`:
                            if (!e.hasAttribute(`itemprop`)) break;
                            return e;
                        case `link`:
                            if (
                                ((a = e.getAttribute(`rel`)),
                                (a === `stylesheet` &&
                                    e.hasAttribute(`data-precedence`)) ||
                                    a !== i.rel ||
                                    e.getAttribute(`href`) !==
                                        (i.href == null || i.href === ``
                                            ? null
                                            : i.href) ||
                                    e.getAttribute(`crossorigin`) !==
                                        (i.crossOrigin == null
                                            ? null
                                            : i.crossOrigin) ||
                                    e.getAttribute(`title`) !==
                                        (i.title == null ? null : i.title))
                            )
                                break;
                            return e;
                        case `style`:
                            if (e.hasAttribute(`data-precedence`)) break;
                            return e;
                        case `script`:
                            if (
                                ((a = e.getAttribute(`src`)),
                                (a !== (i.src == null ? null : i.src) ||
                                    e.getAttribute(`type`) !==
                                        (i.type == null ? null : i.type) ||
                                    e.getAttribute(`crossorigin`) !==
                                        (i.crossOrigin == null
                                            ? null
                                            : i.crossOrigin)) &&
                                    a &&
                                    e.hasAttribute(`async`) &&
                                    !e.hasAttribute(`itemprop`))
                            )
                                break;
                            return e;
                        default:
                            return e;
                    }
                if (((e = lm(e.nextSibling)), e === null)) break;
            }
            return null;
        }
        function im(e, t, n) {
            if (t === ``) return null;
            for (; e.nodeType !== 3;)
                if (
                    ((e.nodeType !== 1 ||
                        e.nodeName !== `INPUT` ||
                        e.type !== `hidden`) &&
                        !n) ||
                    ((e = lm(e.nextSibling)), e === null)
                )
                    return null;
            return e;
        }
        function am(e, t) {
            for (; e.nodeType !== 8;)
                if (
                    ((e.nodeType !== 1 ||
                        e.nodeName !== `INPUT` ||
                        e.type !== `hidden`) &&
                        !t) ||
                    ((e = lm(e.nextSibling)), e === null)
                )
                    return null;
            return e;
        }
        function om(e) {
            return e.data === `$?` || e.data === `$~`;
        }
        function sm(e) {
            return (
                e.data === `$!` ||
                (e.data === `$?` && e.ownerDocument.readyState !== `loading`)
            );
        }
        function cm(e, t) {
            var n = e.ownerDocument;
            if (e.data === `$~`) e._reactRetry = t;
            else if (e.data !== `$?` || n.readyState !== `loading`) t();
            else {
                var r = function () {
                    (t(), n.removeEventListener(`DOMContentLoaded`, r));
                };
                (n.addEventListener(`DOMContentLoaded`, r), (e._reactRetry = r));
            }
        }
        function lm(e) {
            for (; e != null; e = e.nextSibling) {
                var t = e.nodeType;
                if (t === 1 || t === 3) break;
                if (t === 8) {
                    if (
                        ((t = e.data),
                        t === `$` ||
                            t === `$!` ||
                            t === `$?` ||
                            t === `$~` ||
                            t === `&` ||
                            t === `F!` ||
                            t === `F`)
                    )
                        break;
                    if (t === `/$` || t === `/&`) return null;
                }
            }
            return e;
        }
        var um = null;
        function dm(e) {
            e = e.nextSibling;
            for (var t = 0; e;) {
                if (e.nodeType === 8) {
                    var n = e.data;
                    if (n === `/$` || n === `/&`) {
                        if (t === 0) return lm(e.nextSibling);
                        t--;
                    } else
                        (n !== `$` &&
                            n !== `$!` &&
                            n !== `$?` &&
                            n !== `$~` &&
                            n !== `&`) ||
                            t++;
                }
                e = e.nextSibling;
            }
            return null;
        }
        function fm(e) {
            e = e.previousSibling;
            for (var t = 0; e;) {
                if (e.nodeType === 8) {
                    var n = e.data;
                    if (
                        n === `$` ||
                        n === `$!` ||
                        n === `$?` ||
                        n === `$~` ||
                        n === `&`
                    ) {
                        if (t === 0) return e;
                        t--;
                    } else (n !== `/$` && n !== `/&`) || t++;
                }
                e = e.previousSibling;
            }
            return null;
        }
        function pm(e, t) {
            function n() {
                r = !0;
            }
            if (e.ownerDocument.activeElement === e) return !0;
            var r = !1;
            try {
                (e.ownerDocument.addEventListener(`focus`, n, !0),
                    (e.focus || HTMLElement.prototype.focus).call(e, t));
            } finally {
                e.ownerDocument.removeEventListener(`focus`, n, !0);
            }
            return r;
        }
        function mm(e) {
            yp(function () {
                yp(function (t) {
                    return e(t);
                });
            });
        }
        function hm(e, t, n) {
            switch (((t = lp(n)), e)) {
                case `html`:
                    if (((e = t.documentElement), !e)) throw Error(i(452));
                    return e;
                case `head`:
                    if (((e = t.head), !e)) throw Error(i(453));
                    return e;
                case `body`:
                    if (((e = t.body), !e)) throw Error(i(454));
                    return e;
                default:
                    throw Error(i(451));
            }
        }
        function gm(e, t, n) {
            for (var r in n) {
                var i = n[r];
                n.hasOwnProperty(r) && i != null && $(e, t, r, null, rp, i);
            }
            (n.dangerouslySetInnerHTML != null && (e.textContent = ``),
                e.onclick === kn && (e.onclick = null),
                Ht(e));
        }
        function _m(e) {
            for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
            Ht(e);
        }
        var vm = new Map(),
            ym = new Set();
        function bm(e) {
            if (typeof e.getRootNode == `function`) {
                var t = e.getRootNode();
                if (t.nodeType === 9 || t.nodeType === 11) return t;
            }
            return e.nodeType === 9 ? e : e.ownerDocument;
        }
        var xm = T.d;
        T.d = { f: Sm, r: Cm, D: Em, C: Dm, L: Om, m: km, X: jm, S: Am, M: Mm };
        function Sm() {
            var e = xm.f(),
                t = zd();
            return e || t;
        }
        function Cm(e) {
            var t = Wt(e);
            t !== null && t.tag === 5 && t.type === `form` ? rc(t) : xm.r(e);
        }
        var wm = typeof document > `u` ? null : document;
        function Tm(e, t, n) {
            var r = wm;
            if (r && typeof t == `string` && t) {
                var i = mn(t);
                ((i = `link[rel="` + e + `"][href="` + i + `"]`),
                    typeof n == `string` && (i += `[crossorigin="` + n + `"]`),
                    ym.has(i) ||
                        (ym.add(i),
                        (e = { rel: e, crossOrigin: n, href: t }),
                        r.querySelector(i) === null &&
                            ((t = r.createElement(`link`)),
                            np(t, `link`, e),
                            qt(t),
                            r.head.appendChild(t))));
            }
        }
        function Em(e) {
            (xm.D(e), Tm(`dns-prefetch`, e, null));
        }
        function Dm(e, t) {
            (xm.C(e, t), Tm(`preconnect`, e, t));
        }
        function Om(e, t, n) {
            xm.L(e, t, n);
            var r = wm;
            if (r && e && t) {
                var i = `link[rel="preload"][as="` + mn(t) + `"]`;
                t === `image` && n && n.imageSrcSet
                    ? ((i += `[imagesrcset="` + mn(n.imageSrcSet) + `"]`),
                      typeof n.imageSizes == `string` &&
                          (i += `[imagesizes="` + mn(n.imageSizes) + `"]`))
                    : (i += `[href="` + mn(e) + `"]`);
                var a = i;
                switch (t) {
                    case `style`:
                        a = Pm(e);
                        break;
                    case `script`:
                        a = Rm(e);
                }
                if (!(
                    vm.has(a) ||
                    ((e = S(
                        {
                            rel: `preload`,
                            href: t === `image` && n && n.imageSrcSet ? void 0 : e,
                            as: t,
                        },
                        n,
                    )),
                    vm.set(a, e),
                    r.querySelector(i) !== null ||
                        (t === `style` && r.querySelector(Fm(a))) ||
                        (t === `script` && r.querySelector(zm(a))))
                )) {
                    var o = r.createElement(`link`);
                    (np(o, `link`, e),
                        t === `style` &&
                            ((o[Vt] = !0),
                            (o.onload = o.onerror =
                                function () {
                                    Jt(o);
                                })),
                        qt(o),
                        r.head.appendChild(o));
                }
            }
        }
        function km(e, t) {
            xm.m(e, t);
            var n = wm;
            if (n && e) {
                var r = t && typeof t.as == `string` ? t.as : `script`,
                    i =
                        `link[rel="modulepreload"][as="` +
                        mn(r) +
                        `"][href="` +
                        mn(e) +
                        `"]`,
                    a = i;
                switch (r) {
                    case `audioworklet`:
                    case `paintworklet`:
                    case `serviceworker`:
                    case `sharedworker`:
                    case `worker`:
                    case `script`:
                        a = Rm(e);
                }
                if (
                    !vm.has(a) &&
                    ((e = S({ rel: `modulepreload`, href: e }, t)),
                    vm.set(a, e),
                    n.querySelector(i) === null)
                ) {
                    switch (r) {
                        case `audioworklet`:
                        case `paintworklet`:
                        case `serviceworker`:
                        case `sharedworker`:
                        case `worker`:
                        case `script`:
                            if (n.querySelector(zm(a))) return;
                    }
                    ((r = n.createElement(`link`)),
                        np(r, `link`, e),
                        qt(r),
                        n.head.appendChild(r));
                }
            }
        }
        function Am(e, t, n) {
            xm.S(e, t, n);
            var r = wm;
            if (r && e) {
                var i = Kt(r).hoistableStyles,
                    a = Pm(e);
                t ||= `default`;
                var o = i.get(a);
                if (!o) {
                    var s = { loading: 0, preload: null };
                    if ((o = r.querySelector(Fm(a)))) s.loading = 5;
                    else {
                        ((e = S(
                            { rel: `stylesheet`, href: e, 'data-precedence': t },
                            n,
                        )),
                            (n = vm.get(a)) && Hm(e, n));
                        var c = (o = r.createElement(`link`));
                        (qt(c),
                            np(c, `link`, e),
                            (c._p = new Promise(function (e, t) {
                                ((c.onload = e), (c.onerror = t));
                            })),
                            c.addEventListener(`load`, function () {
                                s.loading |= 1;
                            }),
                            c.addEventListener(`error`, function () {
                                s.loading |= 2;
                            }),
                            (s.loading |= 4),
                            Vm(o, t, r));
                    }
                    ((o = { type: `stylesheet`, instance: o, count: 1, state: s }),
                        i.set(a, o));
                }
            }
        }
        function jm(e, t) {
            xm.X(e, t);
            var n = wm;
            if (n && e) {
                var r = Kt(n).hoistableScripts,
                    i = Rm(e),
                    a = r.get(i);
                a ||
                    ((a = n.querySelector(zm(i))),
                    a ||
                        ((e = S({ src: e, async: !0 }, t)),
                        (t = vm.get(i)) && Um(e, t),
                        (a = n.createElement(`script`)),
                        qt(a),
                        np(a, `link`, e),
                        n.head.appendChild(a)),
                    (a = { type: `script`, instance: a, count: 1, state: null }),
                    r.set(i, a));
            }
        }
        function Mm(e, t) {
            xm.M(e, t);
            var n = wm;
            if (n && e) {
                var r = Kt(n).hoistableScripts,
                    i = Rm(e),
                    a = r.get(i);
                a ||
                    ((a = n.querySelector(zm(i))),
                    a ||
                        ((e = S({ src: e, async: !0, type: `module` }, t)),
                        (t = vm.get(i)) && Um(e, t),
                        (a = n.createElement(`script`)),
                        qt(a),
                        np(a, `link`, e),
                        n.head.appendChild(a)),
                    (a = { type: `script`, instance: a, count: 1, state: null }),
                    r.set(i, a));
            }
        }
        function Nm(e, t, n, r) {
            var a = (a = Pe.current) ? bm(a) : null;
            if (!a) throw Error(i(446));
            switch (e) {
                case `meta`:
                case `title`:
                    return null;
                case `style`:
                    return typeof n.precedence == `string` && typeof n.href == `string`
                        ? ((n = Pm(n.href)),
                          (t = Kt(a).hoistableStyles),
                          (r = t.get(n)),
                          r ||
                              ((r = {
                                  type: `style`,
                                  instance: null,
                                  count: 0,
                                  state: null,
                              }),
                              t.set(n, r)),
                          r)
                        : { type: `void`, instance: null, count: 0, state: null };
                case `link`:
                    if (
                        n.rel === `stylesheet` &&
                        typeof n.href == `string` &&
                        typeof n.precedence == `string`
                    ) {
                        e = Pm(n.href);
                        var o = Kt(a).hoistableStyles,
                            s = o.get(e);
                        if (
                            (s ||
                                ((a = a.ownerDocument || a),
                                (s = {
                                    type: `stylesheet`,
                                    instance: null,
                                    count: 0,
                                    state: { loading: 0, preload: null },
                                }),
                                o.set(e, s),
                                (o = a.querySelector(Fm(e)))
                                    ? o._p || ((s.instance = o), (s.state.loading = 5))
                                    : ((o = vm.get(e)),
                                      o ||
                                          ((o = {
                                              rel: `preload`,
                                              as: `style`,
                                              href: n.href,
                                              crossOrigin: n.crossOrigin,
                                              integrity: n.integrity,
                                              media: n.media,
                                              hrefLang: n.hrefLang,
                                              referrerPolicy: n.referrerPolicy,
                                          }),
                                          vm.set(e, o)),
                                      Lm(a, e, o, s.state))),
                            t && r === null)
                        )
                            throw Error(i(528, ``));
                        return s;
                    }
                    if (t && r !== null) throw Error(i(529, ``));
                    return null;
                case `script`:
                    return (
                        (t = n.async),
                        (n = n.src),
                        typeof n == `string` &&
                        t &&
                        typeof t != `function` &&
                        typeof t != `symbol`
                            ? ((n = Rm(n)),
                              (t = Kt(a).hoistableScripts),
                              (r = t.get(n)),
                              r ||
                                  ((r = {
                                      type: `script`,
                                      instance: null,
                                      count: 0,
                                      state: null,
                                  }),
                                  t.set(n, r)),
                              r)
                            : { type: `void`, instance: null, count: 0, state: null }
                    );
                default:
                    throw Error(i(444, e));
            }
        }
        function Pm(e) {
            return `href="` + mn(e) + `"`;
        }
        function Fm(e) {
            return `link[rel="stylesheet"][` + e + `]`;
        }
        function Im(e) {
            return S({}, e, { 'data-precedence': e.precedence, precedence: null });
        }
        function Lm(e, t, n, r) {
            if ((t = e.querySelector(`link[rel="preload"][as="style"][` + t + `]`))) {
                if (!0 !== t[Vt]) {
                    r.loading = 1;
                    return;
                }
            } else
                ((t = e.createElement(`link`)),
                    (t[Vt] = !0),
                    (t.onload = t.onerror = Jt.bind(null, t)),
                    np(t, `link`, n),
                    qt(t),
                    e.head.appendChild(t));
            ((r.preload = t),
                t.addEventListener(`load`, function () {
                    return (r.loading |= 1);
                }),
                t.addEventListener(`error`, function () {
                    return (r.loading |= 2);
                }));
        }
        function Rm(e) {
            return `[src="` + mn(e) + `"]`;
        }
        function zm(e) {
            return `script[async]` + e;
        }
        function Bm(e, t, n) {
            if ((t.count++, t.instance === null))
                switch (t.type) {
                    case `style`:
                        var r = e.querySelector(
                            `style[data-href~="` + mn(n.href) + `"]`,
                        );
                        if (r) return ((t.instance = r), qt(r), r);
                        var a = S({}, n, {
                            'data-href': n.href,
                            'data-precedence': n.precedence,
                            href: null,
                            precedence: null,
                        });
                        return (
                            (r = (e.ownerDocument || e).createElement(`style`)),
                            qt(r),
                            np(r, `style`, a),
                            Vm(r, n.precedence, e),
                            (t.instance = r)
                        );
                    case `stylesheet`:
                        a = Pm(n.href);
                        var o = e.querySelector(Fm(a));
                        if (o)
                            return ((t.state.loading |= 4), (t.instance = o), qt(o), o);
                        ((r = Im(n)),
                            (a = vm.get(a)) && Hm(r, a),
                            (o = (e.ownerDocument || e).createElement(`link`)),
                            qt(o));
                        var s = o;
                        return (
                            (s._p = new Promise(function (e, t) {
                                ((s.onload = e), (s.onerror = t));
                            })),
                            np(o, `link`, r),
                            (t.state.loading |= 4),
                            Vm(o, n.precedence, e),
                            (t.instance = o)
                        );
                    case `script`:
                        return (
                            (o = Rm(n.src)),
                            (a = e.querySelector(zm(o)))
                                ? ((t.instance = a), qt(a), a)
                                : ((r = n),
                                  (a = vm.get(o)) && ((r = S({}, n)), Um(r, a)),
                                  (e = e.ownerDocument || e),
                                  (a = e.createElement(`script`)),
                                  qt(a),
                                  np(a, `link`, r),
                                  e.head.appendChild(a),
                                  (t.instance = a))
                        );
                    case `void`:
                        return null;
                    default:
                        throw Error(i(443, t.type));
                }
            else
                t.type === `stylesheet` &&
                    !(t.state.loading & 4) &&
                    ((r = t.instance), (t.state.loading |= 4), Vm(r, n.precedence, e));
            return t.instance;
        }
        function Vm(e, t, n) {
            for (
                var r = n.querySelectorAll(
                        `link[rel="stylesheet"][data-precedence],style[data-precedence]`,
                    ),
                    i = r.length ? r[r.length - 1] : null,
                    a = i,
                    o = 0;
                o < r.length;
                o++
            ) {
                var s = r[o];
                if (s.dataset.precedence === t) a = s;
                else if (a !== i) break;
            }
            a
                ? a.parentNode.insertBefore(e, a.nextSibling)
                : ((t = n.nodeType === 9 ? n.head : n),
                  t.insertBefore(e, t.firstChild));
        }
        function Hm(e, t) {
            ((e.crossOrigin ??= t.crossOrigin),
                (e.referrerPolicy ??= t.referrerPolicy),
                (e.title ??= t.title));
        }
        function Um(e, t) {
            ((e.crossOrigin ??= t.crossOrigin),
                (e.referrerPolicy ??= t.referrerPolicy),
                (e.integrity ??= t.integrity));
        }
        var Wm = null;
        function Gm(e, t, n) {
            if (Wm === null) {
                var r = new Map(),
                    i = (Wm = new Map());
                i.set(n, r);
            } else ((i = Wm), (r = i.get(n)), r || ((r = new Map()), i.set(n, r)));
            if (r.has(e)) return r;
            for (
                r.set(e, null), n = n.getElementsByTagName(e), i = 0;
                i < n.length;
                i++
            ) {
                var a = n[i];
                if (
                    !(
                        a[Bt] ||
                        a[Pt] ||
                        (e === `link` && a.getAttribute(`rel`) === `stylesheet`)
                    ) &&
                    a.namespaceURI !== `http://www.w3.org/2000/svg`
                ) {
                    var o = a.getAttribute(t) || ``;
                    o = e + o;
                    var s = r.get(o);
                    s ? s.push(a) : r.set(o, [a]);
                }
            }
            return r;
        }
        function Km(e, t, n) {
            ((e = e.ownerDocument || e),
                e.head.insertBefore(
                    n,
                    t === `title` ? e.querySelector(`head > title`) : null,
                ));
        }
        function qm(e, t, n) {
            if (n === 1 || t.itemProp != null) return !1;
            switch (e) {
                case `meta`:
                case `title`:
                    return !0;
                case `style`:
                    if (
                        typeof t.precedence != `string` ||
                        typeof t.href != `string` ||
                        t.href === ``
                    )
                        break;
                    return !0;
                case `link`:
                    if (
                        typeof t.rel != `string` ||
                        typeof t.href != `string` ||
                        t.href === `` ||
                        t.onLoad ||
                        t.onError
                    )
                        break;
                    switch (t.rel) {
                        case `stylesheet`:
                            return (
                                (e = t.disabled),
                                typeof t.precedence == `string` && e == null
                            );
                        default:
                            return !0;
                    }
                case `script`:
                    if (
                        t.async &&
                        typeof t.async != `function` &&
                        typeof t.async != `symbol` &&
                        !t.onLoad &&
                        !t.onError &&
                        t.src &&
                        typeof t.src == `string`
                    )
                        return !0;
            }
            return !1;
        }
        function Jm(e, t) {
            return (
                e === `img` &&
                t.src != null &&
                t.src !== `` &&
                t.onLoad == null &&
                t.loading !== `lazy`
            );
        }
        function Ym(e) {
            return !(e.type === `stylesheet` && !(e.state.loading & 3));
        }
        function Xm(e) {
            return (
                (e.width || 100) *
                (e.height || 100) *
                (typeof devicePixelRatio == `number` ? devicePixelRatio : 1) *
                0.25
            );
        }
        function Zm(e, t) {
            typeof t.decode == `function` &&
                (e.imgCount++,
                t.complete || ((e.imgBytes += Xm(t)), e.suspenseyImages.push(t)),
                (e = rh.bind(e)),
                t.decode().then(e, e));
        }
        function Qm(e, t, n, r) {
            if (
                n.type === `stylesheet` &&
                (typeof r.media != `string` || !1 !== matchMedia(r.media).matches) &&
                !(n.state.loading & 4)
            ) {
                if (n.instance === null) {
                    var i = Pm(r.href),
                        a = t.querySelector(Fm(i));
                    if (a) {
                        ((t = a._p),
                            typeof t == `object` &&
                                t &&
                                typeof t.then == `function` &&
                                (e.count++, (e = nh.bind(e)), t.then(e, e)),
                            (n.state.loading |= 4),
                            (n.instance = a),
                            qt(a));
                        return;
                    }
                    ((a = t.ownerDocument || t),
                        (r = Im(r)),
                        (i = vm.get(i)) && Hm(r, i),
                        (a = a.createElement(`link`)),
                        qt(a));
                    var o = a;
                    ((o._p = new Promise(function (e, t) {
                        ((o.onload = e), (o.onerror = t));
                    })),
                        np(a, `link`, r),
                        (n.instance = a));
                }
                (e.stylesheets === null && (e.stylesheets = new Map()),
                    e.stylesheets.set(n, t),
                    (t = n.state.preload) &&
                        !(n.state.loading & 3) &&
                        (e.count++,
                        (n = nh.bind(e)),
                        t.addEventListener(`load`, n),
                        t.addEventListener(`error`, n)));
            }
        }
        var $m = 0;
        function eh(e, t) {
            return (
                e.stylesheets && e.count === 0 && ah(e, e.stylesheets),
                0 < e.count || 0 < e.imgCount
                    ? function (n) {
                          var r = setTimeout(function () {
                              if (
                                  (e.stylesheets && ah(e, e.stylesheets), e.unsuspend)
                              ) {
                                  var t = e.unsuspend;
                                  ((e.unsuspend = null), t());
                              }
                          }, 6e4 + t);
                          0 < e.imgBytes && $m === 0 && ($m = 62500 * op());
                          var i = setTimeout(
                              function () {
                                  if (
                                      ((e.waitingForImages = !1),
                                      e.count === 0 &&
                                          (e.stylesheets && ah(e, e.stylesheets),
                                          e.unsuspend))
                                  ) {
                                      var t = e.unsuspend;
                                      ((e.unsuspend = null), t());
                                  }
                              },
                              (e.imgBytes > $m ? 50 : 800) + t,
                          );
                          return (
                              (e.unsuspend = n),
                              function () {
                                  ((e.unsuspend = null),
                                      clearTimeout(r),
                                      clearTimeout(i));
                              }
                          );
                      }
                    : null
            );
        }
        function th(e) {
            if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
                if (e.stylesheets) ah(e, e.stylesheets);
                else if (e.unsuspend) {
                    var t = e.unsuspend;
                    ((e.unsuspend = null), t());
                }
            }
        }
        function nh() {
            (this.count--, th(this));
        }
        function rh() {
            (this.imgCount--, th(this));
        }
        var ih = null;
        function ah(e, t) {
            ((e.stylesheets = null),
                e.unsuspend !== null &&
                    (e.count++,
                    (ih = new Map()),
                    t.forEach(oh, e),
                    (ih = null),
                    nh.call(e)));
        }
        function oh(e, t) {
            if (!(t.state.loading & 4)) {
                var n = ih.get(e);
                if (n) var r = n.get(null);
                else {
                    ((n = new Map()), ih.set(e, n));
                    for (
                        var i = e.querySelectorAll(
                                `link[data-precedence],style[data-precedence]`,
                            ),
                            a = 0;
                        a < i.length;
                        a++
                    ) {
                        var o = i[a];
                        (o.nodeName === `LINK` ||
                            o.getAttribute(`media`) !== `not all`) &&
                            (n.set(o.dataset.precedence, o), (r = o));
                    }
                    r && n.set(null, r);
                }
                ((i = t.instance),
                    (o = i.getAttribute(`data-precedence`)),
                    (a = n.get(o) || r),
                    a === r && n.set(null, i),
                    n.set(o, i),
                    this.count++,
                    (r = nh.bind(this)),
                    i.addEventListener(`load`, r),
                    i.addEventListener(`error`, r),
                    a
                        ? a.parentNode.insertBefore(i, a.nextSibling)
                        : ((e = e.nodeType === 9 ? e.head : e),
                          e.insertBefore(i, e.firstChild)),
                    (t.state.loading |= 4));
            }
        }
        var sh = {
            $$typeof: C,
            Provider: null,
            Consumer: null,
            _currentValue: De,
            _currentValue2: De,
            _threadCount: 0,
        };
        function ch(e, t, n, r, i, a, o, s, c) {
            ((this.tag = 1),
                (this.containerInfo = e),
                (this.pingCache = this.current = this.pendingChildren = null),
                (this.timeoutHandle = -1),
                (this.callbackNode =
                    this.next =
                    this.pendingContext =
                    this.context =
                    this.cancelPendingCommit =
                        null),
                (this.callbackPriority = 0),
                (this.expirationTimes = Ct(-1)),
                (this.entangledLanes =
                    this.shellSuspendCounter =
                    this.errorRecoveryDisabledLanes =
                    this.expiredLanes =
                    this.warmLanes =
                    this.pingedLanes =
                    this.suspendedLanes =
                    this.pendingLanes =
                        0),
                (this.entanglements = Ct(0)),
                (this.hiddenUpdates = Ct(null)),
                (this.identifierPrefix = r),
                (this.onUncaughtError = i),
                (this.onCaughtError = a),
                (this.onRecoverableError = o),
                (this.pooledCache = null),
                (this.pooledCacheLanes = 0),
                (this.formState = c),
                (this.transitionTypes = null),
                (this.incompleteTransitions = new Map()));
        }
        function lh(e, t, n, r, i, a, o, s, c, l, u, d) {
            return (
                (e = new ch(e, t, n, o, c, l, u, d, s)),
                (t = 1),
                !0 === a && (t |= 24),
                (a = zi(3, null, null, t)),
                (e.current = a),
                (a.stateNode = e),
                (t = Ma()),
                t.refCount++,
                (e.pooledCache = t),
                t.refCount++,
                (a.memoizedState = { element: r, isDehydrated: n, cache: t }),
                ho(a),
                e
            );
        }
        function uh(e) {
            return e ? ((e = Li), e) : Li;
        }
        function dh(e, t, n, r, i, a) {
            ((i = uh(i)),
                r.context === null ? (r.context = i) : (r.pendingContext = i),
                (r = _o(t)),
                (r.payload = { element: n }),
                (a = a === void 0 ? null : a),
                a !== null && (r.callback = a),
                (n = vo(e, r, t)),
                n !== null && (Pd(n, e, t), yo(n, e, t)));
        }
        function fh(e, t) {
            if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
                var n = e.retryLane;
                e.retryLane = n !== 0 && n < t ? n : t;
            }
        }
        function ph(e, t) {
            (fh(e, t), (e = e.alternate) && fh(e, t));
        }
        function mh(e) {
            if (e.tag === 13 || e.tag === 31) {
                var t = j(e, 67108864);
                (t !== null && Pd(t, e, 67108864), ph(e, 67108864));
            }
        }
        function hh(e) {
            if (e.tag === 13 || e.tag === 31) {
                var t = jd();
                t = kt(t);
                var n = j(e, t);
                (n !== null && Pd(n, e, t), ph(e, t));
            }
        }
        var gh = !0;
        function _h(e, t, n, r) {
            var i = w.T;
            w.T = null;
            var a = T.p;
            try {
                ((T.p = 2), yh(e, t, n, r));
            } finally {
                ((T.p = a), (w.T = i));
            }
        }
        function vh(e, t, n, r) {
            var i = w.T;
            w.T = null;
            var a = T.p;
            try {
                ((T.p = 8), yh(e, t, n, r));
            } finally {
                ((T.p = a), (w.T = i));
            }
        }
        function yh(e, t, n, r) {
            if (gh) {
                var i = bh(r);
                if (i === null) (Kf(e, t, r, xh, n), Mh(e, r));
                else if (Ph(i, e, t, n, r)) r.stopPropagation();
                else if ((Mh(e, r), t & 4 && -1 < jh.indexOf(e))) {
                    for (; i !== null;) {
                        var a = Wt(i);
                        if (a !== null)
                            switch (a.tag) {
                                case 3:
                                    if (
                                        ((a = a.stateNode),
                                        a.current.memoizedState.isDehydrated)
                                    ) {
                                        var o = _t(a.pendingLanes);
                                        if (o !== 0) {
                                            var s = a;
                                            for (
                                                s.pendingLanes |= 2,
                                                    s.entangledLanes |= 2;
                                                o;
                                            ) {
                                                var c = 1 << (31 - ut(o));
                                                ((s.entanglements[1] |= c), (o &= ~c));
                                            }
                                            (Ef(a),
                                                !(K & 6) &&
                                                    ((gd = Qe() + 500), Df(0, !1)));
                                        }
                                    }
                                    break;
                                case 31:
                                case 13:
                                    ((s = j(a, 2)),
                                        s !== null && Pd(s, a, 2),
                                        zd(),
                                        ph(a, 2));
                            }
                        if (((a = bh(r)), a === null && Kf(e, t, r, xh, n), a === i))
                            break;
                        i = a;
                    }
                    i !== null && r.stopPropagation();
                } else Kf(e, t, r, null, n);
            }
        }
        function bh(e) {
            return ((e = jn(e)), Sh(e));
        }
        var xh = null;
        function Sh(e) {
            if (((xh = null), (e = Ut(e)), e !== null)) {
                var t = o(e);
                if (t === null) e = null;
                else {
                    var n = t.tag;
                    if (n === 13) {
                        if (((e = s(t)), e !== null)) return e;
                        e = null;
                    } else if (n === 31) {
                        if (((e = c(t)), e !== null)) return e;
                        e = null;
                    } else if (n === 3) {
                        if (t.stateNode.current.memoizedState.isDehydrated)
                            return t.tag === 3 ? t.stateNode.containerInfo : null;
                        e = null;
                    } else t !== e && (e = null);
                }
            }
            return ((xh = e), null);
        }
        function Ch(e) {
            switch (e) {
                case `beforetoggle`:
                case `cancel`:
                case `click`:
                case `close`:
                case `contextmenu`:
                case `copy`:
                case `cut`:
                case `auxclick`:
                case `dblclick`:
                case `dragend`:
                case `dragstart`:
                case `drop`:
                case `focusin`:
                case `focusout`:
                case `input`:
                case `invalid`:
                case `keydown`:
                case `keypress`:
                case `keyup`:
                case `mousedown`:
                case `mouseup`:
                case `paste`:
                case `pause`:
                case `play`:
                case `pointercancel`:
                case `pointerdown`:
                case `pointerup`:
                case `ratechange`:
                case `reset`:
                case `seeked`:
                case `submit`:
                case `toggle`:
                case `touchcancel`:
                case `touchend`:
                case `touchstart`:
                case `volumechange`:
                case `change`:
                case `selectionchange`:
                case `textInput`:
                case `compositionstart`:
                case `compositionend`:
                case `compositionupdate`:
                case `beforeblur`:
                case `afterblur`:
                case `beforeinput`:
                case `blur`:
                case `fullscreenchange`:
                case `fullscreenerror`:
                case `focus`:
                case `hashchange`:
                case `popstate`:
                case `select`:
                case `selectstart`:
                    return 2;
                case `drag`:
                case `dragenter`:
                case `dragexit`:
                case `dragleave`:
                case `dragover`:
                case `mousemove`:
                case `mouseout`:
                case `mouseover`:
                case `pointermove`:
                case `pointerout`:
                case `pointerover`:
                case `resize`:
                case `scroll`:
                case `touchmove`:
                case `wheel`:
                case `mouseenter`:
                case `mouseleave`:
                case `pointerenter`:
                case `pointerleave`:
                    return 8;
                case `message`:
                    switch ($e()) {
                        case et:
                            return 2;
                        case tt:
                            return 8;
                        case nt:
                        case rt:
                            return 32;
                        case it:
                            return 268435456;
                        default:
                            return 32;
                    }
                default:
                    return 32;
            }
        }
        var wh = !1,
            Th = null,
            Eh = null,
            Dh = null,
            Oh = new Map(),
            kh = new Map(),
            Ah = [],
            jh =
                `mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(
                    ` `,
                );
        function Mh(e, t) {
            switch (e) {
                case `focusin`:
                case `focusout`:
                    Th = null;
                    break;
                case `dragenter`:
                case `dragleave`:
                    Eh = null;
                    break;
                case `mouseover`:
                case `mouseout`:
                    Dh = null;
                    break;
                case `pointerover`:
                case `pointerout`:
                    Oh.delete(t.pointerId);
                    break;
                case `gotpointercapture`:
                case `lostpointercapture`:
                    kh.delete(t.pointerId);
            }
        }
        function Nh(e, t, n, r, i, a) {
            return e === null || e.nativeEvent !== a
                ? ((e = {
                      blockedOn: t,
                      domEventName: n,
                      eventSystemFlags: r,
                      nativeEvent: a,
                      targetContainers: [i],
                  }),
                  t !== null && ((t = Wt(t)), t !== null && mh(t)),
                  e)
                : ((e.eventSystemFlags |= r),
                  (t = e.targetContainers),
                  i !== null && t.indexOf(i) === -1 && t.push(i),
                  e);
        }
        function Ph(e, t, n, r, i) {
            switch (t) {
                case `focusin`:
                    return ((Th = Nh(Th, e, t, n, r, i)), !0);
                case `dragenter`:
                    return ((Eh = Nh(Eh, e, t, n, r, i)), !0);
                case `mouseover`:
                    return ((Dh = Nh(Dh, e, t, n, r, i)), !0);
                case `pointerover`:
                    var a = i.pointerId;
                    return (Oh.set(a, Nh(Oh.get(a) || null, e, t, n, r, i)), !0);
                case `gotpointercapture`:
                    return (
                        (a = i.pointerId),
                        kh.set(a, Nh(kh.get(a) || null, e, t, n, r, i)),
                        !0
                    );
            }
            return !1;
        }
        function Fh(e) {
            var t = Ut(e.target);
            if (t !== null) {
                var n = o(t);
                if (n !== null) {
                    if (((t = n.tag), t === 13)) {
                        if (((t = s(n)), t !== null)) {
                            ((e.blockedOn = t),
                                Mt(e.priority, function () {
                                    hh(n);
                                }));
                            return;
                        }
                    } else if (t === 31) {
                        if (((t = c(n)), t !== null)) {
                            ((e.blockedOn = t),
                                Mt(e.priority, function () {
                                    hh(n);
                                }));
                            return;
                        }
                    } else if (
                        t === 3 &&
                        n.stateNode.current.memoizedState.isDehydrated
                    ) {
                        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
                        return;
                    }
                }
            }
            e.blockedOn = null;
        }
        function Ih(e) {
            if (e.blockedOn !== null) return !1;
            for (var t = e.targetContainers; 0 < t.length;) {
                var n = bh(e.nativeEvent);
                if (n === null) {
                    n = e.nativeEvent;
                    var r = new n.constructor(n.type, n);
                    ((An = r), n.target.dispatchEvent(r), (An = null));
                } else return ((t = Wt(n)), t !== null && mh(t), (e.blockedOn = n), !1);
                t.shift();
            }
            return !0;
        }
        function Lh(e, t, n) {
            Ih(e) && n.delete(t);
        }
        function Rh() {
            ((wh = !1),
                Th !== null && Ih(Th) && (Th = null),
                Eh !== null && Ih(Eh) && (Eh = null),
                Dh !== null && Ih(Dh) && (Dh = null),
                Oh.forEach(Lh),
                kh.forEach(Lh));
        }
        function zh(e, n) {
            e.blockedOn === n &&
                ((e.blockedOn = null),
                wh ||
                    ((wh = !0),
                    t.unstable_scheduleCallback(t.unstable_NormalPriority, Rh)));
        }
        var Bh = null;
        function Vh(e) {
            Bh !== e &&
                ((Bh = e),
                t.unstable_scheduleCallback(t.unstable_NormalPriority, function () {
                    Bh === e && (Bh = null);
                    for (var t = 0; t < e.length; t += 3) {
                        var n = e[t],
                            r = e[t + 1],
                            i = e[t + 2];
                        if (typeof r != `function`) {
                            if (Sh(r || n) === null) continue;
                            break;
                        }
                        var a = Wt(n);
                        a !== null &&
                            (e.splice(t, 3),
                            (t -= 3),
                            tc(
                                a,
                                { pending: !0, data: i, method: n.method, action: r },
                                r,
                                i,
                            ));
                    }
                }));
        }
        function Hh(e) {
            function t(t) {
                return zh(t, e);
            }
            (Th !== null && zh(Th, e),
                Eh !== null && zh(Eh, e),
                Dh !== null && zh(Dh, e),
                Oh.forEach(t),
                kh.forEach(t));
            for (var n = 0; n < Ah.length; n++) {
                var r = Ah[n];
                r.blockedOn === e && (r.blockedOn = null);
            }
            for (; 0 < Ah.length && ((n = Ah[0]), n.blockedOn === null);)
                (Fh(n), n.blockedOn === null && Ah.shift());
            if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
                for (r = 0; r < n.length; r += 3) {
                    var i = n[r],
                        a = n[r + 1],
                        o = i[D] || null;
                    if (typeof a == `function`) o || Vh(n);
                    else if (o) {
                        var s = null;
                        if (a && a.hasAttribute(`formAction`)) {
                            if (((i = a), (o = a[D] || null))) s = o.formAction;
                            else if (Sh(i) !== null) continue;
                        } else s = o.action;
                        (typeof s == `function`
                            ? (n[r + 1] = s)
                            : (n.splice(r, 3), (r -= 3)),
                            Vh(n));
                    }
                }
        }
        function Uh() {
            function e(e) {
                e.canIntercept &&
                    e.info === `react-transition` &&
                    e.intercept({
                        handler: function () {
                            return new Promise(function (e) {
                                return (i = e);
                            });
                        },
                        focusReset: `manual`,
                        scroll: `manual`,
                    });
            }
            function t() {
                (i !== null && (i(), (i = null)), r || setTimeout(n, 20));
            }
            function n() {
                if (!r && !navigation.transition) {
                    var e = navigation.currentEntry;
                    e &&
                        e.url != null &&
                        navigation.navigate(e.url, {
                            state: e.getState(),
                            info: `react-transition`,
                            history: `replace`,
                        });
                }
            }
            if (typeof navigation == `object`) {
                var r = !1,
                    i = null;
                return (
                    navigation.addEventListener(`navigate`, e),
                    navigation.addEventListener(`navigatesuccess`, t),
                    navigation.addEventListener(`navigateerror`, t),
                    setTimeout(n, 100),
                    function () {
                        ((r = !0),
                            navigation.removeEventListener(`navigate`, e),
                            navigation.removeEventListener(`navigatesuccess`, t),
                            navigation.removeEventListener(`navigateerror`, t),
                            i !== null && (i(), (i = null)));
                    }
                );
            }
        }
        function Wh(e) {
            this._internalRoot = e;
        }
        ((Gh.prototype.render = Wh.prototype.render =
            function (e) {
                var t = this._internalRoot;
                if (t === null) throw Error(i(409));
                var n = t.current;
                dh(n, jd(), e, t, null, null);
            }),
            (Gh.prototype.unmount = Wh.prototype.unmount =
                function () {
                    var e = this._internalRoot;
                    if (e !== null) {
                        this._internalRoot = null;
                        var t = e.containerInfo;
                        (dh(e.current, 2, null, e, null, null), zd(), (t[Ft] = null));
                    }
                }));
        function Gh(e) {
            this._internalRoot = e;
        }
        Gh.prototype.unstable_scheduleHydration = function (e) {
            if (e) {
                var t = jt();
                e = { blockedOn: null, target: e, priority: t };
                for (var n = 0; n < Ah.length && t !== 0 && t < Ah[n].priority; n++);
                (Ah.splice(n, 0, e), n === 0 && Fh(e));
            }
        };
        var Kh = n.version;
        if (Kh !== `19.3.0`) throw Error(i(527, Kh, `19.3.0`));
        T.findDOMNode = function (e) {
            var t = e._reactInternals;
            if (t === void 0)
                throw typeof e.render == `function`
                    ? Error(i(188))
                    : ((e = Object.keys(e).join(`,`)), Error(i(268, e)));
            return (
                (e = u(t)),
                (e = e === null ? null : d(e)),
                (e = e === null ? null : e.stateNode),
                e
            );
        };
        var qh = {
            bundleType: 0,
            version: `19.3.0`,
            rendererPackageName: `react-dom`,
            currentDispatcherRef: w,
            reconcilerVersion: `19.3.0`,
        };
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u`) {
            var Jh = __REACT_DEVTOOLS_GLOBAL_HOOK__;
            if (!Jh.isDisabled && Jh.supportsFiber)
                try {
                    ((st = Jh.inject(qh)), (ct = Jh));
                } catch {}
        }
        e.createRoot = function (e, t) {
            if (!a(e)) throw Error(i(299));
            var n = !1,
                r = ``,
                o = wc,
                s = Tc,
                c = Ec;
            return (
                t != null &&
                    (!0 === t.unstable_strictMode && (n = !0),
                    t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
                    t.onUncaughtError !== void 0 && (o = t.onUncaughtError),
                    t.onCaughtError !== void 0 && (s = t.onCaughtError),
                    t.onRecoverableError !== void 0 && (c = t.onRecoverableError)),
                (t = lh(e, 1, !1, null, null, n, r, null, o, s, c, Uh)),
                (e[Ft] = t.current),
                Wf(e),
                new Wh(t)
            );
        };
    }),
    y = s((e, t) => {
        function n() {
            if (
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < `u` &&
                typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE == `function`
            )
                try {
                    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n);
                } catch (e) {
                    console.error(e);
                }
        }
        (n(), (t.exports = v()));
    }),
    b = u(p(), 1),
    ee = y(),
    te = (e) => e?.replace(/([a-z0-9])([A-Z])/g, `$1-$2`).toLowerCase();
function ne(e, t, n = []) {
    if (t == null) throw Error(`[lucide]: iconNode is required when icon name is used`);
    return { name: te(e), size: 24, node: t, ...(n.length > 0 ? { aliases: n } : {}) };
}
var re = (e) => {
        let t = ``,
            n = !1;
        for (let r of e) {
            if (r === `-` || r === `_` || r <= ` `) {
                n = t.length > 0;
                continue;
            }
            (t.length === 0 ? (t += r.toLowerCase()) : (t += n ? r.toUpperCase() : r),
                (n = !1));
        }
        return t;
    },
    x = (e) => {
        let t = re(e);
        return t.charAt(0).toUpperCase() + t.slice(1);
    },
    ie = (...e) =>
        e
            .filter((e, t, n) => !!e && e.trim() !== `` && n.indexOf(e) === t)
            .join(` `)
            .trim(),
    S = {
        xmlns: `http://www.w3.org/2000/svg`,
        width: 24,
        height: 24,
        viewBox: `0 0 24 24`,
        fill: `none`,
        stroke: `currentColor`,
        'stroke-width': 2,
        'stroke-linecap': `round`,
        'stroke-linejoin': `round`,
    };
function ae(e) {
    return e != null;
}
function oe(e, t = {}) {
    let n = t.attributeNames ?? {},
        r = (e) => n[e] ?? e,
        i = e.size ?? e.width ?? S.width,
        a = e.size ?? e.height ?? S.height,
        o =
            e.aliases
                ?.filter((e) => typeof e == `string` && e.trim() !== ``)
                .map((e) => `lucide-${e}`) ?? [],
        s = [...(e.name ? [`lucide-${e.name}`] : []), ...o],
        c = t.className?.split(` `).filter(Boolean) ?? [],
        l = t.includeDefaultClasses === !1 ? ie(...c) : ie(`lucide`, ...s, ...c),
        u = t.absoluteStrokeWidth
            ? (Number(t.strokeWidth ?? S[`stroke-width`]) *
                  Number(e.size ?? e.width ?? S.width)) /
              Number(t.size ?? t.width ?? S.width)
            : (t.strokeWidth ?? S[`stroke-width`]);
    return [
        `svg`,
        {
            ...Object.entries(S).reduce((e, [t, n]) => ((e[r(t)] = n), e), {}),
            ...(`color` in t && t.color && { [r(`stroke`)]: t.color }),
            ...(`size` in t &&
                ae(t.size) && { [r(`width`)]: t.size, [r(`height`)]: t.size }),
            ...(`width` in t && ae(t.width) && { [r(`width`)]: t.width }),
            ...(`height` in t && ae(t.height) && { [r(`height`)]: t.height }),
            [r(`stroke-width`)]: u,
            ...(l && { [r(`class`)]: l }),
            [r(`viewBox`)]: `0 0 ${i} ${a}`,
            ...(t.hasA11yProp === !1 ? { [r(`aria-hidden`)]: `true` } : {}),
            ...(`attributes` in t && t.attributes),
        },
        e.node.map((e) => {
            let [n, i, a] = e,
                o = t.nonScalingStroke
                    ? { [r(`vector-effect`)]: `non-scaling-stroke`, ...i }
                    : i;
            return a ? [n, o, a] : [n, o];
        }),
    ];
}
function se(e, t = {}) {
    return oe(e, {
        ...t,
        attributeNames: {
            ...t.attributeNames,
            class: `className`,
            'stroke-width': `strokeWidth`,
            'stroke-linecap': `strokeLinecap`,
            'stroke-linejoin': `strokeLinejoin`,
            'vector-effect': `vectorEffect`,
        },
    });
}
var ce = (e) => {
        for (let t in e)
            if (t.startsWith(`aria-`) || t === `role` || t === `title`) return !0;
        return !1;
    },
    le = (0, b.createContext)({}),
    ue = () => (0, b.useContext)(le),
    de = (0, b.forwardRef)(
        (
            {
                color: e,
                size: t,
                width: n,
                height: r,
                strokeWidth: i,
                absoluteStrokeWidth: a,
                nonScalingStroke: o,
                className: s = ``,
                children: c,
                iconNode: l = [],
                icon: u = { node: l, aliases: [], size: 24 },
                ...d
            },
            f,
        ) => {
            let {
                    size: p = 24,
                    strokeWidth: m = 2,
                    absoluteStrokeWidth: h = !1,
                    nonScalingStroke: g = !1,
                    color: _ = `currentColor`,
                    className: v = ``,
                } = ue() ?? {},
                y = !!c || ce(d),
                [ee, te, ne = []] = se(u, {
                    color: e ?? _,
                    width: n ?? t ?? p,
                    height: r ?? t ?? p,
                    strokeWidth: i ?? m,
                    absoluteStrokeWidth: a ?? h,
                    nonScalingStroke: o ?? g,
                    className: ie(v, s),
                    hasA11yProp: y,
                    attributes: d,
                });
            return (0, b.createElement)(ee, { ref: f, ...te }, [
                ...ne.map(([e, t]) => (0, b.createElement)(e, t)),
                ...(Array.isArray(c) ? c : [c]),
            ]);
        },
    );
function C(e, t = [], n = []) {
    let r = typeof e == `string` ? ne(e, t, n) : e,
        i = (0, b.forwardRef)(({ className: e, ...t }, n) =>
            (0, b.createElement)(de, { ref: n, icon: r, className: e, ...t }),
        );
    return (r.name && (i.displayName = x(r.name)), i);
}
var fe = {
    name: `arrow-right`,
    size: 24,
    node: [
        [`path`, { d: `M5 12h14`, key: `1ays0h` }],
        [`path`, { d: `m12 5 7 7-7 7`, key: `xquz4c` }],
    ],
};
fe.node;
var pe = C(fe),
    me = {
        name: `at-sign`,
        size: 24,
        node: [
            [`circle`, { cx: `12`, cy: `12`, r: `4`, key: `4exip2` }],
            [`path`, { d: `M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8`, key: `7n84p3` }],
        ],
    };
me.node;
var he = C(me),
    ge = {
        name: `bell-ring`,
        size: 24,
        node: [
            [`path`, { d: `M10.268 21a2 2 0 0 0 3.464 0`, key: `vwvbt9` }],
            [`path`, { d: `M22 8c0-2.3-.8-4.3-2-6`, key: `5bb3ad` }],
            [
                `path`,
                {
                    d: `M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326`,
                    key: `11g9vi`,
                },
            ],
            [`path`, { d: `M4 2C2.8 3.7 2 5.7 2 8`, key: `tap9e0` }],
        ],
    };
ge.node;
var _e = C(ge),
    ve = {
        name: `circle-alert`,
        size: 24,
        node: [
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
            [`line`, { x1: `12`, x2: `12`, y1: `8`, y2: `12`, key: `1pkeuh` }],
            [`line`, { x1: `12`, x2: `12.01`, y1: `16`, y2: `16`, key: `4dfq90` }],
        ],
        aliases: [`alert-circle`],
    };
ve.node;
var ye = C(ve),
    be = {
        name: `eye-off`,
        size: 24,
        node: [
            [
                `path`,
                {
                    d: `M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49`,
                    key: `ct8e1f`,
                },
            ],
            [`path`, { d: `M14.084 14.158a3 3 0 0 1-4.242-4.242`, key: `151rxh` }],
            [
                `path`,
                {
                    d: `M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143`,
                    key: `13bj9a`,
                },
            ],
            [`path`, { d: `m2 2 20 20`, key: `1ooewy` }],
        ],
    };
be.node;
var xe = C(be),
    Se = {
        name: `eye`,
        size: 24,
        node: [
            [
                `path`,
                {
                    d: `M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0`,
                    key: `1nclc0`,
                },
            ],
            [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
        ],
    };
Se.node;
var Ce = C(Se),
    we = {
        name: `hash`,
        size: 24,
        node: [
            [`line`, { x1: `4`, x2: `20`, y1: `9`, y2: `9`, key: `4lhtct` }],
            [`line`, { x1: `4`, x2: `20`, y1: `15`, y2: `15`, key: `vyu0kd` }],
            [`line`, { x1: `10`, x2: `8`, y1: `3`, y2: `21`, key: `1ggp8o` }],
            [`line`, { x1: `16`, x2: `14`, y1: `3`, y2: `21`, key: `weycgp` }],
        ],
    };
we.node;
var Te = C(we),
    Ee = {
        name: `info`,
        size: 24,
        node: [
            [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
            [`path`, { d: `M12 16v-4`, key: `1dtifu` }],
            [`path`, { d: `M12 8h.01`, key: `e9boi3` }],
        ],
    };
Ee.node;
var w = C(Ee),
    T = {
        name: `keyboard`,
        size: 24,
        node: [
            [`path`, { d: `M10 8h.01`, key: `1r9ogq` }],
            [`path`, { d: `M12 12h.01`, key: `1mp3jc` }],
            [`path`, { d: `M14 8h.01`, key: `1primd` }],
            [`path`, { d: `M16 12h.01`, key: `1l6xoz` }],
            [`path`, { d: `M18 8h.01`, key: `emo2bl` }],
            [`path`, { d: `M6 8h.01`, key: `x9i8wu` }],
            [`path`, { d: `M7 16h10`, key: `wp8him` }],
            [`path`, { d: `M8 12h.01`, key: `czm47f` }],
            [
                `rect`,
                { width: `20`, height: `16`, x: `2`, y: `4`, rx: `2`, key: `18n3k1` },
            ],
        ],
    };
T.node;
var De = C(T),
    Oe = {
        name: `loader-circle`,
        size: 24,
        node: [[`path`, { d: `M21 12a9 9 0 1 1-6.219-8.56`, key: `13zald` }]],
        aliases: [`loader-2`],
    };
Oe.node;
var ke = C(Oe),
    Ae = {
        name: `lock-open`,
        size: 24,
        node: [
            [
                `rect`,
                {
                    width: `18`,
                    height: `11`,
                    x: `3`,
                    y: `11`,
                    rx: `2`,
                    ry: `2`,
                    key: `1w4ew1`,
                },
            ],
            [`path`, { d: `M7 11V7a5 5 0 0 1 9.9-1`, key: `1mm8w8` }],
        ],
        aliases: [`unlock`],
    };
Ae.node;
var je = C(Ae),
    E = {
        name: `lock`,
        size: 24,
        node: [
            [
                `rect`,
                {
                    width: `18`,
                    height: `11`,
                    x: `3`,
                    y: `11`,
                    rx: `2`,
                    ry: `2`,
                    key: `1w4ew1`,
                },
            ],
            [`path`, { d: `M7 11V7a5 5 0 0 1 10 0v4`, key: `fwvmzm` }],
        ],
    };
E.node;
var Me = C(E),
    Ne = {
        name: `menu`,
        size: 24,
        node: [
            [`path`, { d: `M4 5h16`, key: `1tepv9` }],
            [`path`, { d: `M4 12h16`, key: `1lakjw` }],
            [`path`, { d: `M4 19h16`, key: `1djgab` }],
        ],
    };
Ne.node;
var Pe = C(Ne),
    Fe = {
        name: `messages-square`,
        size: 24,
        node: [
            [
                `path`,
                {
                    d: `M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z`,
                    key: `1n2ejm`,
                },
            ],
            [
                `path`,
                {
                    d: `M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1`,
                    key: `1qfcsi`,
                },
            ],
        ],
    };
Fe.node;
var Ie = C(Fe),
    Le = {
        name: `palette`,
        size: 24,
        node: [
            [
                `path`,
                {
                    d: `M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z`,
                    key: `e79jfc`,
                },
            ],
            [
                `circle`,
                { cx: `13.5`, cy: `6.5`, r: `.5`, fill: `currentColor`, key: `1okk4w` },
            ],
            [
                `circle`,
                {
                    cx: `17.5`,
                    cy: `10.5`,
                    r: `.5`,
                    fill: `currentColor`,
                    key: `f64h9f`,
                },
            ],
            [
                `circle`,
                { cx: `6.5`, cy: `12.5`, r: `.5`, fill: `currentColor`, key: `qy21gx` },
            ],
            [
                `circle`,
                { cx: `8.5`, cy: `7.5`, r: `.5`, fill: `currentColor`, key: `fotxhn` },
            ],
        ],
    };
Le.node;
var Re = C(Le),
    ze = {
        name: `pin`,
        size: 24,
        node: [
            [`path`, { d: `M12 17v5`, key: `bb1du9` }],
            [
                `path`,
                {
                    d: `M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z`,
                    key: `1nkz8b`,
                },
            ],
        ],
    };
ze.node;
var Be = C(ze),
    Ve = {
        name: `power`,
        size: 24,
        node: [
            [`path`, { d: `M12 2v10`, key: `mnfbl` }],
            [`path`, { d: `M18.4 6.6a9 9 0 1 1-12.77.04`, key: `obofu9` }],
        ],
    };
Ve.node;
var He = C(Ve),
    Ue = {
        name: `refresh-cw`,
        size: 24,
        node: [
            [
                `path`,
                {
                    d: `M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8`,
                    key: `v9h5vc`,
                },
            ],
            [`path`, { d: `M21 3v5h-5`, key: `1q7to0` }],
            [
                `path`,
                {
                    d: `M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16`,
                    key: `3uifl3`,
                },
            ],
            [`path`, { d: `M8 16H3v5`, key: `1cv678` }],
        ],
    };
Ue.node;
var We = C(Ue),
    Ge = {
        name: `rotate-ccw-clock`,
        size: 24,
        node: [
            [
                `path`,
                {
                    d: `M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8`,
                    key: `1357e3`,
                },
            ],
            [`path`, { d: `M3 3v5h5`, key: `1xhq8a` }],
            [`path`, { d: `M12 7v5l4 2`, key: `1fdv2h` }],
        ],
        aliases: [`history`],
    };
Ge.node;
var Ke = C(Ge),
    qe = {
        name: `search`,
        size: 24,
        node: [
            [`path`, { d: `m21 21-4.34-4.34`, key: `14j7rj` }],
            [`circle`, { cx: `11`, cy: `11`, r: `8`, key: `4ej97u` }],
        ],
    };
qe.node;
var Je = C(qe),
    Ye = {
        name: `send-horizontal`,
        size: 24,
        node: [
            [
                `path`,
                {
                    d: `M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z`,
                    key: `117uat`,
                },
            ],
            [`path`, { d: `M6 12h16`, key: `s4cdu5` }],
        ],
        aliases: [`send-horizonal`],
    };
Ye.node;
var Xe = C(Ye),
    Ze = {
        name: `server`,
        size: 24,
        node: [
            [
                `rect`,
                {
                    width: `20`,
                    height: `8`,
                    x: `2`,
                    y: `2`,
                    rx: `2`,
                    ry: `2`,
                    key: `ngkwjq`,
                },
            ],
            [
                `rect`,
                {
                    width: `20`,
                    height: `8`,
                    x: `2`,
                    y: `14`,
                    rx: `2`,
                    ry: `2`,
                    key: `iecqi9`,
                },
            ],
            [`line`, { x1: `6`, x2: `6.01`, y1: `6`, y2: `6`, key: `16zg32` }],
            [`line`, { x1: `6`, x2: `6.01`, y1: `18`, y2: `18`, key: `nzw8ys` }],
        ],
    };
Ze.node;
var Qe = C(Ze),
    $e = {
        name: `settings`,
        size: 24,
        node: [
            [
                `path`,
                {
                    d: `M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915`,
                    key: `1i5ecw`,
                },
            ],
            [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `1v7zrd` }],
        ],
    };
$e.node;
var et = C($e),
    tt = {
        name: `sliders-horizontal`,
        size: 24,
        node: [
            [`path`, { d: `M10 5H3`, key: `1qgfaw` }],
            [`path`, { d: `M12 19H3`, key: `yhmn1j` }],
            [`path`, { d: `M14 3v4`, key: `1sua03` }],
            [`path`, { d: `M16 17v4`, key: `1q0r14` }],
            [`path`, { d: `M21 12h-9`, key: `1o4lsq` }],
            [`path`, { d: `M21 19h-5`, key: `1rlt1p` }],
            [`path`, { d: `M21 5h-7`, key: `1oszz2` }],
            [`path`, { d: `M8 10v4`, key: `tgpxqk` }],
            [`path`, { d: `M8 12H3`, key: `a7s4jb` }],
        ],
    };
tt.node;
var nt = C(tt),
    rt = {
        name: `users`,
        size: 24,
        node: [
            [`path`, { d: `M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2`, key: `1yyitq` }],
            [`path`, { d: `M16 3.128a4 4 0 0 1 0 7.744`, key: `16gr8j` }],
            [`path`, { d: `M22 21v-2a4 4 0 0 0-3-3.87`, key: `kshegd` }],
            [`circle`, { cx: `9`, cy: `7`, r: `4`, key: `nufk8` }],
        ],
    };
rt.node;
var it = C(rt),
    at = (e) => {
        let t,
            n = new Set(),
            r = (e, r) => {
                let i = typeof e == `function` ? e(t) : e;
                if (!Object.is(i, t)) {
                    let e = t;
                    ((t =
                        (r ?? (typeof i != `object` || !i))
                            ? i
                            : Object.assign({}, t, i)),
                        n.forEach((n) => n(t, e)));
                }
            },
            i = () => t,
            a = {
                setState: r,
                getState: i,
                getInitialState: () => o,
                subscribe: (e) => (n.add(e), () => n.delete(e)),
            },
            o = (t = e(r, i, a));
        return a;
    },
    ot = (e) => (e ? at(e) : at),
    st = (e) => e;
function ct(e, t = st) {
    let n = b.useSyncExternalStore(
        e.subscribe,
        b.useCallback(() => t(e.getState()), [e, t]),
        b.useCallback(() => t(e.getInitialState()), [e, t]),
    );
    return (b.useDebugValue(n), n);
}
var lt = (e) => Symbol.iterator in e,
    ut = (e) => `entries` in e,
    dt = (e, t) => {
        let n = e instanceof Map ? e : new Map(e.entries()),
            r = t instanceof Map ? t : new Map(t.entries());
        if (n.size !== r.size) return !1;
        for (let [e, t] of n) if (!r.has(e) || !Object.is(t, r.get(e))) return !1;
        return !0;
    },
    ft = (e, t) => {
        let n = e[Symbol.iterator](),
            r = t[Symbol.iterator](),
            i = n.next(),
            a = r.next();
        for (; !i.done && !a.done;) {
            if (!Object.is(i.value, a.value)) return !1;
            ((i = n.next()), (a = r.next()));
        }
        return !!i.done && !!a.done;
    };
function pt(e, t) {
    return Object.is(e, t)
        ? !0
        : typeof e != `object` ||
            !e ||
            typeof t != `object` ||
            !t ||
            Object.getPrototypeOf(e) !== Object.getPrototypeOf(t)
          ? !1
          : lt(e) && lt(t)
            ? ut(e) && ut(t)
                ? dt(e, t)
                : ft(e, t)
            : dt(
                  { entries: () => Object.entries(e) },
                  { entries: () => Object.entries(t) },
              );
}
function mt(e) {
    let t = b.useRef(void 0);
    return (n) => {
        let r = e(n);
        return pt(t.current, r) ? t.current : (t.current = r);
    };
}
var ht = (e) =>
        `/api/buffers/` + (typeof e == `number` ? String(e) : encodeURIComponent(e)),
    gt = (e) =>
        e === void 0
            ? {}
            : typeof e == `number`
              ? { buffer_id: e }
              : { buffer_name: e },
    _t = (e) => {
        let t = Object.entries(e)
            .filter(([, e]) => e !== void 0)
            .map(([e, t]) => `${e}=${encodeURIComponent(String(t))}`);
        return t.length > 0 ? `?` + t.join(`&`) : ``;
    },
    vt = class {
        client;
        constructor(e) {
            this.client = e;
        }
        async get(e) {
            return (await this.client.request(`GET`, e)).body;
        }
        async post(e, t) {
            return (await this.client.request(`POST`, e, t)).body;
        }
        version() {
            return this.get(`/api/version`);
        }
        buffers(e = {}) {
            return this.get(`/api/buffers` + _t({ ...e }));
        }
        buffer(e, t = {}) {
            return this.get(ht(e) + _t({ ...t }));
        }
        lines(e, t, n) {
            return this.get(ht(e) + `/lines` + _t({ lines: t, colors: n }));
        }
        line(e, t, n) {
            return this.get(ht(e) + `/lines/` + t + _t({ colors: n }));
        }
        nicks(e, t) {
            return this.get(ht(e) + `/nicks` + _t({ colors: t }));
        }
        hotlist() {
            return this.get(`/api/hotlist`);
        }
        scripts() {
            return this.get(`/api/scripts`);
        }
        option(e) {
            return this.get(`/api/options/` + encodeURIComponent(e));
        }
        async input(e, t) {
            await this.post(`/api/input`, { ...gt(t), command: e });
        }
        completion(e, t, n) {
            let r = { ...gt(t), command: e };
            return (n !== void 0 && (r.position = n), this.post(`/api/completion`, r));
        }
        async ping(e) {
            return (
                (await this.post(`/api/ping`, e === void 0 ? {} : { data: e }))?.data ??
                null
            );
        }
        async sync(e = {}) {
            await this.post(`/api/sync`, e);
        }
    },
    yt = [`pbkdf2+sha512`, `pbkdf2+sha256`, `sha512`, `sha256`, `plain`],
    bt = new TextEncoder(),
    xt = (e) =>
        Array.from(new Uint8Array(e), (e) => e.toString(16).padStart(2, `0`)).join(``);
function St(e) {
    let t = ``;
    for (let n of bt.encode(e)) t += String.fromCharCode(n);
    return btoa(t);
}
function Ct(e) {
    return St(e).replace(/\+/g, `-`).replace(/\//g, `_`).replace(/=+$/, ``);
}
var wt = () => typeof crypto < `u` && crypto.subtle !== void 0;
function Tt() {
    return wt() ? [...yt] : [`plain`];
}
async function Et(e, t, n = 0, r = Math.floor(Date.now() / 1e3)) {
    let i = String(r);
    if (!t || t === `plain`) return `plain:` + e;
    if (!wt()) throw Error(`WebCrypto is not available`);
    if (t === `sha256` || t === `sha512`)
        return `hash:${t}:${i}:${xt(await crypto.subtle.digest(t === `sha256` ? `SHA-256` : `SHA-512`, bt.encode(i + e)))}`;
    let a = t === `pbkdf2+sha256`,
        o = await crypto.subtle.importKey(`raw`, bt.encode(e), { name: `PBKDF2` }, !1, [
            `deriveBits`,
        ]);
    return `hash:${t}:${i}:${n}:${xt(await crypto.subtle.deriveBits({ name: `PBKDF2`, hash: a ? `SHA-256` : `SHA-512`, salt: bt.encode(i), iterations: n }, o, a ? 256 : 512))}`;
}
function Dt(e) {
    return [`api.weechat`, `base64url.bearer.authorization.weechat.` + Ct(e)];
}
function Ot(e, t, n, r) {
    e.includes(`:`) && !e.startsWith(`[`) && !e.endsWith(`]`) && (e = `[${e}]`);
    let i = (n || `api`).replace(/^\/+|\/+$/g, ``),
        a = `${e}:${t}/${i}`;
    return { http: `${r ? `https` : `http`}://${a}`, ws: `${r ? `wss` : `ws`}://${a}` };
}
function kt(e) {
    switch (e) {
        case `Missing password`:
        case `Invalid password`:
            return `Wrong password.`;
        case `Invalid timestamp`:
            return `WeeChat rejected the timestamp of the hashed password. Check that the clocks of this device and the WeeChat host are in sync, or increase relay.network.time_window in WeeChat.`;
        case `Invalid hash algorithm (not found or not supported)`:
            return `WeeChat and Glowing Bear could not agree on a password hash algorithm. Check relay.network.password_hash_algo in WeeChat.`;
        case `Invalid number of iterations`:
            return `Invalid number of PBKDF2 iterations.`;
        case `Missing TOTP`:
        case `Invalid TOTP`:
            return `Missing or invalid TOTP.`;
        default:
            return e || `Authentication failed.`;
    }
}
var At = class extends Error {
        kind;
        constructor(e, t) {
            (super(t), (this.name = `ConnectError`), (this.kind = e));
        }
    },
    jt = class extends Error {
        response;
        constructor(e) {
            let t = e.body?.error;
            (super(`${e.request}: ${e.code} ${e.message}` + (t ? ` (${t})` : ``)),
                (this.name = `RequestError`),
                (this.response = e));
        }
    },
    Mt = class e {
        ws = null;
        pending = new Map();
        nextId = 0;
        pingTimer;
        pingDeadline;
        closing = !1;
        options;
        constructor(e = {}) {
            this.options = e;
        }
        get isOpen() {
            return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
        }
        async connect(t) {
            let n = Ot(t.host, t.port, t.path, t.tls);
            if (
                (this.options.pageProtocol ??
                    (typeof location < `u` ? location.protocol : `http:`)) ===
                    `https:` &&
                !t.tls
            )
                throw new At(
                    `insecure`,
                    `Unencrypted relays are blocked on pages loaded over https`,
                );
            let r;
            try {
                r = await e.handshake(n);
            } catch (e) {
                throw new At(`network`, `Handshake failed: ` + String(e));
            }
            if (r.totp)
                throw new At(
                    `totp`,
                    `TOTP is enabled in WeeChat (relay.network.totp_secret), but browsers can't send it on a WebSocket`,
                );
            if (!r.password_hash_algo)
                throw new At(`hash`, `No common password hash algorithm`);
            let i = await Et(
                t.password,
                r.password_hash_algo,
                r.password_hash_iterations,
            );
            try {
                await this.open(n.ws, i);
            } catch (t) {
                throw await e.diagnose(n, i, t);
            }
        }
        static async handshake(e) {
            let t = await fetch(e.http + `/handshake`, {
                method: `POST`,
                body: JSON.stringify({ password_hash_algo: Tt() }),
            });
            if (!t.ok) throw Error(`HTTP ` + t.status);
            return await t.json();
        }
        static async diagnose(e, t, n) {
            try {
                let r = await fetch(e.http + `/version`, {
                    headers: { Authorization: `Basic ` + St(t) },
                });
                return r.status === 401
                    ? new At(`auth`, kt((await r.json().catch(() => ({}))).error))
                    : new At(
                          `network`,
                          `The WebSocket connection was refused (code ${n})`,
                      );
            } catch (e) {
                return new At(`network`, `Relay not reachable: ` + String(e));
            }
        }
        open(e, t) {
            return (
                (this.closing = !1),
                new Promise((n, r) => {
                    let i = new WebSocket(e, Dt(t)),
                        a = !1;
                    ((this.ws = i),
                        (i.onopen = () => {
                            ((a = !0), this.startPing(), n());
                        }),
                        (i.onmessage = (e) => this.onMessage(e.data)),
                        (i.onclose = (e) => {
                            if (!a) {
                                ((this.ws = null), r(e.code));
                                return;
                            }
                            this.closed({
                                code: e.code,
                                reason: e.reason,
                                byClient: this.closing,
                            });
                        }));
                })
            );
        }
        closed(e) {
            (this.stopPing(), (this.ws = null));
            let t = [...this.pending.values()];
            this.pending.clear();
            for (let e of t) e.reject(Error(`Connection closed`));
            this.options.onClose?.(e);
        }
        onMessage(e) {
            let t;
            try {
                t = JSON.parse(String(e));
            } catch {
                this.abort(`corrupted stream`);
                return;
            }
            for (let e of Array.isArray(t) ? t : [t]) this.dispatch(e);
        }
        dispatch(e) {
            if (e.code === 0) {
                this.options.onEvent?.(e);
                return;
            }
            let t = e,
                n = t.request_id ? this.pending.get(t.request_id) : void 0;
            n &&
                t.request_id &&
                (this.pending.delete(t.request_id),
                t.code >= 400 ? n.reject(new jt(t)) : n.resolve(t));
        }
        request(e, t, n) {
            let r = this.ws;
            if (r === null || r.readyState !== WebSocket.OPEN)
                return Promise.reject(Error(`Not connected`));
            let i = `gb` + ++this.nextId,
                a = { request: `${e} ${t}`, request_id: i };
            return (
                n !== void 0 && (a.body = n),
                new Promise((e, t) => {
                    (this.pending.set(i, { resolve: e, reject: t }),
                        r.send(JSON.stringify(a)));
                })
            );
        }
        close() {
            this.ws !== null && ((this.closing = !0), this.ws.close());
        }
        abort(e = `aborted`) {
            let t = this.ws;
            if (t !== null) {
                ((t.onopen = null), (t.onclose = null), (t.onmessage = null));
                try {
                    t.close();
                } catch {}
                this.closed({ code: 4e3, reason: e, byClient: !1 });
            }
        }
        startPing() {
            let e = this.options.pingInterval ?? 3e4;
            e <= 0 ||
                (this.pingTimer = setInterval(() => {
                    (clearTimeout(this.pingDeadline),
                        (this.pingDeadline = setTimeout(
                            () => this.abort(`ping timeout`),
                            this.options.pingTimeout ?? 15e3,
                        )),
                        this.request(`POST`, `/api/ping`, {
                            data: String(Date.now()),
                        }).then(
                            () => clearTimeout(this.pingDeadline),
                            () => void 0,
                        ));
                }, e));
        }
        stopPing() {
            (clearInterval(this.pingTimer), clearTimeout(this.pingDeadline));
        }
    },
    Nt = Symbol.for(`immer-nothing`),
    Pt = Symbol.for(`immer-draftable`),
    D = Symbol.for(`immer-state`);
function Ft(e, ...t) {
    throw Error(
        `[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`,
    );
}
var It = Object,
    Lt = It.getPrototypeOf,
    Rt = `constructor`,
    zt = `prototype`,
    Bt = `configurable`,
    Vt = `enumerable`,
    Ht = `writable`,
    Ut = `value`,
    Wt = (e) => !!e && !!e[D];
function Gt(e) {
    return e ? Jt(e) || tn(e) || !!e[Pt] || !!e[Rt]?.[Pt] || nn(e) || O(e) : !1;
}
var Kt = It[zt][Rt].toString(),
    qt = new WeakMap();
function Jt(e) {
    if (!e || !rn(e)) return !1;
    let t = Lt(e);
    if (t === null || t === It[zt]) return !0;
    let n = It.hasOwnProperty.call(t, Rt) && t[Rt];
    if (n === Object) return !0;
    if (!an(n)) return !1;
    let r = qt.get(n);
    return (r === void 0 && ((r = Function.toString.call(n)), qt.set(n, r)), r === Kt);
}
function Yt(e, t, n = !0) {
    Xt(e) === 0
        ? (n ? Reflect.ownKeys(e) : It.keys(e)).forEach((n) => {
              t(n, e[n], e);
          })
        : e.forEach((n, r) => t(r, n, e));
}
function Xt(e) {
    let t = e[D];
    return t ? t.type_ : tn(e) ? 1 : nn(e) ? 2 : O(e) ? 3 : 0;
}
var Zt = (e, t, n = Xt(e)) => (n === 2 ? e.has(t) : It[zt].hasOwnProperty.call(e, t)),
    Qt = (e, t, n = Xt(e)) => (n === 2 ? e.get(t) : e[t]),
    $t = (e, t, n, r = Xt(e)) => {
        r === 2 ? e.set(t, n) : r === 3 ? e.add(n) : (e[t] = n);
    };
function en(e, t) {
    return e === t ? e !== 0 || 1 / e == 1 / t : e !== e && t !== t;
}
var tn = Array.isArray,
    nn = (e) => e instanceof Map,
    O = (e) => e instanceof Set,
    rn = (e) => typeof e == `object`,
    an = (e) => typeof e == `function`,
    on = (e) => typeof e == `boolean`;
function sn(e) {
    let t = +e;
    return Number.isInteger(t) && String(t) === e;
}
var cn = (e) => e.copy_ || e.base_,
    ln = (e) => (e.modified_ ? e.copy_ : e.base_);
function un(e, t) {
    if (nn(e)) return new Map(e);
    if (O(e)) return new Set(e);
    if (tn(e)) return Array[zt].slice.call(e);
    let n = Jt(e);
    if (t === !0 || (t === `class_only` && !n)) {
        let t = It.getOwnPropertyDescriptors(e);
        delete t[D];
        let n = Reflect.ownKeys(t);
        for (let r = 0; r < n.length; r++) {
            let i = n[r],
                a = t[i];
            (a[Ht] === !1 && ((a[Ht] = !0), (a[Bt] = !0)),
                (a.get || a.set) &&
                    (t[i] = { [Bt]: !0, [Ht]: !0, [Vt]: a[Vt], [Ut]: e[i] }));
        }
        return It.create(Lt(e), t);
    }
    {
        let t = Lt(e);
        if (t !== null && n) return { ...e };
        let r = It.create(t);
        return It.assign(r, e);
    }
}
function dn(e, t = !1) {
    return mn(e) || Wt(e) || !Gt(e)
        ? e
        : (Xt(e) > 1 &&
              It.defineProperties(e, { set: pn, add: pn, clear: pn, delete: pn }),
          It.freeze(e),
          t &&
              Yt(
                  e,
                  (e, t) => {
                      dn(t, !0);
                  },
                  !1,
              ),
          e);
}
function fn() {
    Ft(2);
}
var pn = { [Ut]: fn };
function mn(e) {
    return e === null || !rn(e) || It.isFrozen(e);
}
var hn = `MapSet`,
    gn = `Patches`,
    _n = `ArrayMethods`,
    vn = {};
function yn(e) {
    let t = vn[e];
    return (t || Ft(0, e), t);
}
var bn = (e) => !!vn[e],
    xn,
    Sn = () => xn,
    Cn = (e, t) => ({
        drafts_: [],
        parent_: e,
        immer_: t,
        canAutoFreeze_: !0,
        unfinalizedDrafts_: 0,
        handledSet_: new Set(),
        processedForPatches_: new Set(),
        mapSetPlugin_: bn(hn) ? yn(hn) : void 0,
        arrayMethodsPlugin_: bn(_n) ? yn(_n) : void 0,
    });
function wn(e, t) {
    t &&
        ((e.patchPlugin_ = yn(gn)),
        (e.patches_ = []),
        (e.inversePatches_ = []),
        (e.patchListener_ = t));
}
function Tn(e) {
    (En(e), e.drafts_.forEach(On), (e.drafts_ = null));
}
function En(e) {
    e === xn && (xn = e.parent_);
}
var Dn = (e) => (xn = Cn(xn, e));
function On(e) {
    let t = e[D];
    t.type_ === 0 || t.type_ === 1 ? t.revoke_() : (t.revoked_ = !0);
}
function kn(e, t) {
    t.unfinalizedDrafts_ = t.drafts_.length;
    let n = t.drafts_[0];
    if (e !== void 0 && e !== n) {
        (n[D].modified_ && (Tn(t), Ft(4)), Gt(e) && (e = An(t, e)));
        let { patchPlugin_: r } = t;
        r && r.generateReplacementPatches_(n[D].base_, e, t);
    } else e = An(t, n);
    return (
        jn(t, e, !0),
        Tn(t),
        t.patches_ && t.patchListener_(t.patches_, t.inversePatches_),
        e === Nt ? void 0 : e
    );
}
function An(e, t) {
    if (mn(t)) return t;
    let n = t[D];
    if (!n) return zn(t, e.handledSet_, e);
    if (!Nn(n, e)) return t;
    if (!n.modified_) return n.base_;
    if (!n.finalized_) {
        let { callbacks_: t } = n;
        if (t) for (; t.length > 0;) t.pop()(e);
        Ln(n, e);
    }
    return n.copy_;
}
function jn(e, t, n = !1) {
    !e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && dn(t, n);
}
function Mn(e) {
    ((e.finalized_ = !0), e.scope_.unfinalizedDrafts_--);
}
var Nn = (e, t) => e.scope_ === t,
    Pn = [];
function Fn(e, t, n, r) {
    let i = cn(e),
        a = e.type_;
    if (r !== void 0 && Qt(i, r, a) === t) {
        $t(i, r, n, a);
        return;
    }
    if (!e.draftLocations_) {
        let t = (e.draftLocations_ = new Map());
        Yt(i, (e, n) => {
            if (Wt(n)) {
                let r = t.get(n) || [];
                (r.push(e), t.set(n, r));
            }
        });
    }
    let o = e.draftLocations_.get(t) ?? Pn;
    for (let e of o) $t(i, e, n, a);
}
function In(e, t, n) {
    e.callbacks_.push(function (r) {
        let i = t;
        if (!i || !Nn(i, r)) return;
        r.mapSetPlugin_?.fixSetContents(i);
        let a = ln(i);
        (Fn(e, i.draft_ ?? i, a, n), Ln(i, r));
    });
}
function Ln(e, t) {
    if (
        e.modified_ &&
        !e.finalized_ &&
        (e.type_ === 3 ||
            (e.type_ === 1 && e.allIndicesReassigned_) ||
            (e.assigned_?.size ?? 0) > 0)
    ) {
        let { patchPlugin_: n } = t;
        if (n) {
            let r = n.getPath(e);
            r && n.generatePatches_(e, r, t);
        }
        Mn(e);
    }
}
function Rn(e, t, n) {
    let { scope_: r } = e;
    if (Wt(n)) {
        let i = n[D];
        Nn(i, r) &&
            i.callbacks_.push(function () {
                (Jn(e), Fn(e, n, ln(i), t));
            });
    } else
        Gt(n) &&
            e.callbacks_.push(function () {
                let i = cn(e);
                e.type_ === 3
                    ? i.has(n) && zn(n, r.handledSet_, r)
                    : Qt(i, t, e.type_) === n &&
                      r.drafts_.length > 1 &&
                      (e.assigned_.get(t) ?? !1) === !0 &&
                      e.copy_ &&
                      zn(Qt(e.copy_, t, e.type_), r.handledSet_, r);
            });
}
function zn(e, t, n) {
    return (!n.immer_.autoFreeze_ && n.unfinalizedDrafts_ < 1) ||
        Wt(e) ||
        t.has(e) ||
        !Gt(e) ||
        mn(e)
        ? e
        : (t.add(e),
          Yt(e, (r, i) => {
              if (Wt(i)) {
                  let t = i[D];
                  Nn(t, n) && ($t(e, r, ln(t), e.type_), Mn(t));
              } else Gt(i) && zn(i, t, n);
          }),
          e);
}
function Bn(e, t) {
    let n = tn(e),
        r = {
            type_: +!!n,
            scope_: t ? t.scope_ : Sn(),
            modified_: !1,
            finalized_: !1,
            assigned_: void 0,
            parent_: t,
            base_: e,
            draft_: null,
            copy_: null,
            revoke_: null,
            isManual_: !1,
            callbacks_: void 0,
        },
        i = r,
        a = Vn;
    n && ((i = [r]), (a = Hn));
    let { revoke: o, proxy: s } = Proxy.revocable(i, a);
    return ((r.draft_ = s), (r.revoke_ = o), [s, r]);
}
var Vn = {
        get(e, t) {
            if (t === D) return e;
            let n = e.scope_.arrayMethodsPlugin_,
                r = e.type_ === 1 && typeof t == `string`;
            if (r && n?.isArrayOperationMethod(t))
                return n.createMethodInterceptor(e, t);
            let i = cn(e);
            if (!Zt(i, t, e.type_)) return Gn(e, i, t);
            let a = i[t];
            if (
                e.finalized_ ||
                !Gt(a) ||
                (r &&
                    e.operationMethod &&
                    n?.isMutatingArrayMethod(e.operationMethod) &&
                    sn(t))
            )
                return a;
            if (a === Un(e.base_, t) || Wn(e, t, a)) {
                Jn(e);
                let n = e.type_ === 1 ? +t : t,
                    r = Xn(e.scope_, a, e, n);
                return (e.copy_[n] = r);
            }
            return a;
        },
        has(e, t) {
            return t in cn(e);
        },
        ownKeys(e) {
            return Reflect.ownKeys(cn(e));
        },
        set(e, t, n) {
            let r = Kn(cn(e), t);
            if (r?.set) return (r.set.call(e.draft_, n), !0);
            if (!e.modified_) {
                let r = Un(cn(e), t),
                    i = r?.[D];
                if (i && i.base_ === n)
                    return ((e.copy_[t] = n), e.assigned_.delete(t), !0);
                if (en(n, r) && (n !== void 0 || Zt(e.base_, t, e.type_))) return !0;
                (Jn(e), qn(e));
            }
            return (e.copy_[t] === n && (n !== void 0 || Zt(e.copy_, t, e.type_))) ||
                (Number.isNaN(n) && Number.isNaN(e.copy_[t]))
                ? !0
                : ((e.copy_[t] = n), e.assigned_.set(t, !0), Rn(e, t, n), !0);
        },
        deleteProperty(e, t) {
            return (
                Jn(e),
                Un(e.base_, t) !== void 0 || t in e.base_
                    ? (e.assigned_.set(t, !1), qn(e))
                    : e.assigned_.delete(t),
                e.copy_ && delete e.copy_[t],
                !0
            );
        },
        getOwnPropertyDescriptor(e, t) {
            let n = cn(e),
                r = Reflect.getOwnPropertyDescriptor(n, t);
            return (
                r && {
                    [Ht]: !0,
                    [Bt]: e.type_ !== 1 || t !== `length`,
                    [Vt]: r[Vt],
                    [Ut]: n[t],
                }
            );
        },
        defineProperty() {
            Ft(11);
        },
        getPrototypeOf(e) {
            return Lt(e.base_);
        },
        setPrototypeOf() {
            Ft(12);
        },
    },
    Hn = {};
for (let e in Vn) {
    let t = Vn[e];
    Hn[e] = function () {
        let e = arguments;
        return ((e[0] = e[0][0]), t.apply(this, e));
    };
}
((Hn.deleteProperty = function (e, t) {
    return Hn.set.call(this, e, t, void 0);
}),
    (Hn.set = function (e, t, n) {
        return Vn.set.call(this, e[0], t, n, e[0]);
    }));
function Un(e, t) {
    let n = e[D];
    return (n ? cn(n) : e)[t];
}
function Wn(e, t, n) {
    return e.type_ !== 1 ||
        !e.allIndicesReassigned_ ||
        e.assigned_?.get(t) ||
        !Gt(n) ||
        n[D]
        ? !1
        : e.baseRefs_.has(n);
}
function Gn(e, t, n) {
    let r = Kn(t, n);
    return r ? (Ut in r ? r[Ut] : r.get?.call(e.draft_)) : void 0;
}
function Kn(e, t) {
    if (!(t in e)) return;
    let n = Lt(e);
    for (; n;) {
        let e = Object.getOwnPropertyDescriptor(n, t);
        if (e) return e;
        n = Lt(n);
    }
}
function qn(e) {
    e.modified_ || ((e.modified_ = !0), e.parent_ && qn(e.parent_));
}
function Jn(e) {
    e.copy_ ||=
        ((e.assigned_ = new Map()), un(e.base_, e.scope_.immer_.useStrictShallowCopy_));
}
var Yn = class {
    constructor(e) {
        ((this.autoFreeze_ = !0),
            (this.useStrictShallowCopy_ = !1),
            (this.useStrictIteration_ = !1),
            (this.produce = (e, t, n) => {
                if (an(e) && !an(t)) {
                    let n = t;
                    t = e;
                    let r = this;
                    return function (e = n, ...i) {
                        return r.produce(e, (e) => t.call(this, e, ...i));
                    };
                }
                (an(t) || Ft(6), n !== void 0 && !an(n) && Ft(7));
                let r;
                if (Gt(e)) {
                    let i = Dn(this),
                        a = Xn(i, e, void 0),
                        o = !0;
                    try {
                        ((r = t(a)), (o = !1));
                    } finally {
                        o ? Tn(i) : En(i);
                    }
                    return (wn(i, n), kn(r, i));
                }
                if (!e || !rn(e)) {
                    if (
                        ((r = t(e)),
                        r === void 0 && (r = e),
                        r === Nt && (r = void 0),
                        this.autoFreeze_ && dn(r, !0),
                        n)
                    ) {
                        let t = [],
                            i = [];
                        (yn(gn).generateReplacementPatches_(e, r, {
                            patches_: t,
                            inversePatches_: i,
                        }),
                            n(t, i));
                    }
                    return r;
                }
                Ft(1, e);
            }),
            (this.produceWithPatches = (e, t) => {
                if (an(e))
                    return (t, ...n) => this.produceWithPatches(t, (t) => e(t, ...n));
                let n, r;
                return [
                    this.produce(e, t, (e, t) => {
                        ((n = e), (r = t));
                    }),
                    n,
                    r,
                ];
            }),
            on(e?.autoFreeze) && this.setAutoFreeze(e.autoFreeze),
            on(e?.useStrictShallowCopy) &&
                this.setUseStrictShallowCopy(e.useStrictShallowCopy),
            on(e?.useStrictIteration) &&
                this.setUseStrictIteration(e.useStrictIteration));
    }
    createDraft(e) {
        (Gt(e) || Ft(8), Wt(e) && (e = Zn(e)));
        let t = Dn(this),
            n = Xn(t, e, void 0);
        return ((n[D].isManual_ = !0), En(t), n);
    }
    finishDraft(e, t) {
        let n = e && e[D];
        (!n || !n.isManual_) && Ft(9);
        let { scope_: r } = n;
        return (wn(r, t), kn(void 0, r));
    }
    setAutoFreeze(e) {
        this.autoFreeze_ = e;
    }
    setUseStrictShallowCopy(e) {
        this.useStrictShallowCopy_ = e;
    }
    setUseStrictIteration(e) {
        this.useStrictIteration_ = e;
    }
    shouldUseStrictIteration() {
        return this.useStrictIteration_;
    }
    applyPatches(e, t) {
        let n;
        for (n = t.length - 1; n >= 0; n--) {
            let r = t[n];
            if (r.path.length === 0 && r.op === `replace`) {
                e = r.value;
                break;
            }
        }
        n > -1 && (t = t.slice(n + 1));
        let r = yn(gn).applyPatches_;
        return Wt(e) ? r(e, t) : this.produce(e, (e) => r(e, t));
    }
};
function Xn(e, t, n, r) {
    let [i, a] = nn(t)
        ? yn(hn).proxyMap_(t, n)
        : O(t)
          ? yn(hn).proxySet_(t, n)
          : Bn(t, n);
    return (
        (n?.scope_ ?? Sn()).drafts_.push(i),
        (a.callbacks_ = n?.callbacks_ ?? []),
        (a.key_ = r),
        n && r !== void 0
            ? In(n, a, r)
            : a.callbacks_.push(function (e) {
                  e.mapSetPlugin_?.fixSetContents(a);
                  let { patchPlugin_: t } = e;
                  a.modified_ && t && t.generatePatches_(a, [], e);
              }),
        i
    );
}
function Zn(e) {
    return (Wt(e) || Ft(10, e), Qn(e));
}
function Qn(e) {
    if (!Gt(e) || mn(e)) return e;
    let t = e[D],
        n,
        r = !0;
    if (t) {
        if (!t.modified_) return t.base_;
        ((t.finalized_ = !0),
            (n = un(e, t.scope_.immer_.useStrictShallowCopy_)),
            (r = t.scope_.immer_.shouldUseStrictIteration()));
    } else n = un(e, !0);
    return (
        Yt(
            n,
            (e, t) => {
                $t(n, e, Qn(t));
            },
            r,
        ),
        t && (t.finalized_ = !1),
        n
    );
}
globalThis.Iterator?.from;
var $n = new Yn().produce,
    er = [
        `default`,
        `black`,
        `darkgray`,
        `red`,
        `lightred`,
        `green`,
        `lightgreen`,
        `brown`,
        `yellow`,
        `blue`,
        `lightblue`,
        `magenta`,
        `lightmagenta`,
        `cyan`,
        `lightcyan`,
        `gray`,
        `white`,
    ],
    tr =
        `separator.chat.chat_time.chat_time_delimiters.chat_prefix_error.chat_prefix_network.chat_prefix_action.chat_prefix_join.chat_prefix_quit.chat_prefix_more.chat_prefix_suffix.chat_buffer.chat_server.chat_channel.chat_nick.chat_nick_self.chat_nick_other.invalid.invalid.invalid.invalid.invalid.invalid.invalid.invalid.invalid.invalid.chat_host.chat_delimiters.chat_highlight.chat_read_marker.chat_text_found.chat_value.chat_prefix_buffer.chat_tags.chat_inactive_window.chat_inactive_buffer.chat_prefix_buffer_inactive_buffer.chat_nick_offline.chat_nick_offline_highlight.chat_nick_prefix.chat_nick_suffix.emphasis.chat_day_change.chat_value_null.chat_status_disabled.chat_status_enabled`.split(
            `.`,
        ),
    nr = () => ({ type: `weechat`, name: `default` }),
    rr = () => ({
        name: null,
        override: { bold: !1, reverse: !1, italic: !1, underline: !1 },
    }),
    ir = (e) => ({ name: e.name, override: { ...e.override } }),
    ar = { '*': `b`, '!': `r`, '/': `i`, _: `u`, '': `b`, '': `r`, '': `i`, '': `u` };
function or(e) {
    let t = rr();
    for (let n of e) {
        if (n === `|`) return null;
        let e = ar[n];
        e !== void 0 && (t.override[e] = !0);
    }
    return t;
}
function sr(e) {
    if (e.length === 2) {
        let t = parseInt(e, 10);
        return t > 16 ? nr() : { type: `weechat`, name: er[t] };
    }
    return { type: `ext`, name: String(parseInt(e.substring(1), 10)) };
}
var cr = (e) => ({
        fgColor: { type: `option`, name: e },
        bgColor: { type: `option`, name: e },
        attrs: { name: e, override: {} },
    }),
    lr = { fgColor: null, bgColor: null, attrs: null },
    ur = [
        {
            regex: /^(\d{2})/,
            fn: (e) => {
                let t = tr[parseInt(e[1], 10)];
                return t === void 0 ? lr : cr(t);
            },
        },
        { regex: /^@(\d{5})/, fn: () => lr },
        {
            regex: /^F(?:([*!/_|]*)(\d{2})|@([\x01\x02\x03\x04*!/_|]*)(\d{5}))/,
            fn: (e) =>
                e[2]
                    ? { fgColor: sr(e[2]), bgColor: null, attrs: or(e[1]) }
                    : { fgColor: sr(e[4]), bgColor: null, attrs: or(e[3]) },
        },
        {
            regex: /^B(\d{2}|@\d{5})/,
            fn: (e) => ({ fgColor: null, bgColor: sr(e[1]), attrs: null }),
        },
        {
            regex: /^\*(?:([\x01\x02\x03\x04*!/_|]*)(\d{2})|@([\x01\x02\x03\x04*!/_|]*)(\d{5}))[,~](\d{2}|@\d{5})/,
            fn: (e) => ({
                fgColor: sr(e[2] ? e[2] : e[4]),
                bgColor: sr(e[5]),
                attrs: or(e[2] ? e[1] : e[3]),
            }),
        },
        {
            regex: /^\*([\x01\x02\x03\x04*!/_|]*)(\d{2}|@\d{5})/,
            fn: (e) => ({ fgColor: sr(e[2]), bgColor: null, attrs: or(e[1]) }),
        },
        { regex: /^E/, fn: () => cr(`emphasis`) },
    ];
function dr(e) {
    for (let t of ur) {
        let n = e.match(t.regex);
        if (n) return { ...t.fn(n), text: e.substring(n[0].length) };
    }
    return { ...lr, text: e };
}
function fr(e) {
    let t = e.split(/(\x19|\x1a|\x1b|\x1c)/);
    if (t.length === 1)
        return [
            {
                attrs: { name: null, override: {} },
                fgColor: nr(),
                bgColor: nr(),
                text: t[0],
            },
        ];
    let n = nr(),
        r = nr(),
        i = rr(),
        a = null,
        o = !0,
        s = [];
    for (let e of t) {
        if (e.length === 0) continue;
        let t = e.charCodeAt(0),
            c = e.charAt(0);
        if (t >= 25 && t <= 28) {
            (t === 28 && ((n = nr()), (r = nr()), a !== 25 && (i = rr())), (a = t));
            continue;
        }
        let l = e;
        if (a === 25) {
            let t = dr(e);
            (t.fgColor !== null && (n = t.fgColor),
                t.bgColor !== null && (r = t.bgColor),
                t.attrs !== null && (i = t.attrs),
                (l = t.text));
        } else if ((a === 26 || a === 27) && c !== `|`) {
            let t = ar[c];
            t !== void 0 && ((i.override[t] = a === 26), (l = e.substring(1)));
        }
        ((a = null),
            l.length !== 0 &&
                (o &&
                    i.name === null &&
                    (Object.values(i.override).every((e) => !e)
                        ? (i.override = {})
                        : (o = !1)),
                s.push({
                    fgColor: { ...n },
                    bgColor: { ...r },
                    attrs: ir(i),
                    text: l,
                })));
    }
    return s;
}
var pr = { option: `cof-`, weechat: `cwf-`, ext: `cef-` },
    mr = { option: `cob-`, weechat: `cwb-`, ext: `ceb-` };
function hr(e) {
    if (!e) return [{ text: ``, classes: [] }];
    let t = fr(e).map((e) => {
        let t = [pr[e.fgColor.type] + e.fgColor.name];
        (t.push(mr[e.bgColor.type] + e.bgColor.name),
            e.attrs.name !== null && t.push(`coa-` + e.attrs.name));
        for (let [n, r] of Object.entries(e.attrs.override))
            t.push((r ? `a-` : `a-no-`) + n);
        return { text: e.text, classes: t };
    });
    return t.length > 0 ? t : [{ text: ``, classes: [] }];
}
function gr(e) {
    return e.map((e) => e.text).join(``);
}
var _r = { none: 0, highlight: 1, message: 2, all: 3 };
function vr(e) {
    let t = e.local_variables ?? {},
        n = hr(e.short_name),
        r = gr(n),
        i = hr(e.title),
        a = t.type || `other`,
        o = t.plugin ?? ``,
        s = t.server ?? ``,
        c = {
            fullName: e.name,
            shortName: r,
            trimmedName: r.replace(/^[#&+]/, ``) || (r ? ` ` : ``),
            channelPrefix: /^[#&+]/.test(r) ? r.charAt(0) : ``,
            nameClasses: n[0].classes,
            title: i,
            titleText: gr(i),
            modes: e.modes ?? ``,
            number: e.number,
            hidden: !!e.hidden,
            free: e.type === `free`,
            localVariables: t,
            type: a,
            plugin: o,
            server: s,
            pinned: t.pinned === `true`,
            serverSortKey: (
                o +
                `.` +
                s +
                (a === `server` ? `` : `.` + r)
            ).toLowerCase(),
            hideTime: a === `relay` || e.time_displayed === !1,
            hidePrefix: e.prefix_displayed === !1,
            dayChange: e.day_change !== !1,
            hasNicklist: e.nicklist !== !1,
            inputPrompt: hr(e.input_prompt),
            input: e.input ?? ``,
            inputPosition: e.input_position ?? 0,
            keys: e.keys ?? [],
        };
    return (
        e.notify !== void 0 && e.notify in _r && (c.notify = _r[e.notify]),
        e.last_read_line_id !== void 0 && (c.lastReadLineId = e.last_read_line_id),
        c
    );
}
function yr(e) {
    return {
        id: e.id,
        notify: 3,
        lines: [],
        requestedLines: 0,
        allLinesFetched: !1,
        lastReadKey: null,
        lastReadLineId: -1,
        unread: 0,
        notification: 0,
        nicklistLoaded: !1,
        nickGroups: {},
        nicks: {},
        ...vr(e),
    };
}
function br(e, t) {
    return t ? `y` + e.y : `l` + e.id;
}
function xr(e, t = !1) {
    let n = hr(e.prefix),
        r = hr(e.message),
        i = e.tags ?? [];
    if (e.highlight) for (let e of n) e.classes.push(`highlight`);
    return {
        key: br(e, t),
        id: e.id,
        y: e.y ?? -1,
        date: new Date(e.date),
        prefix: n,
        content: r,
        prefixText: gr(n),
        text: gr(r),
        tags: i,
        highlight: !!e.highlight,
        notifyLevel: e.notify_level ?? 0,
        displayed: e.displayed !== !1,
        isMessage: i.includes(`irc_privmsg`) && !i.includes(`irc_action`),
    };
}
function Sr(e) {
    if (!e) return [`cwf-default`];
    if (e.startsWith(`weechat`)) {
        let t = e.match(/[a-zA-Z0-9_]+$/)?.[0] ?? `default`;
        return [`cof-` + t, `cob-` + t, `coa-` + t];
    }
    let t = [`cwf-default`],
        n = e.match(/^([a-zA-Z]+)(:|$)/),
        r = e.match(/^([0-9]+)(:|$)/);
    n ? (t = [`cwf-` + n[1]]) : r && (t = [`cef-` + r[1]]);
    let i = e.match(/:([a-zA-Z]+)$/),
        a = e.match(/:([0-9]+)$/);
    return (i ? t.push(`cwb-` + i[1]) : a && t.push(`ceb-` + a[1]), t);
}
function Cr(e) {
    return {
        id: e.id,
        groupId: e.parent_group_id,
        prefix: e.prefix,
        name: e.name,
        visible: e.visible !== !1,
        prefixClasses: Sr(e.prefix_color_name),
        nameClasses: Sr(e.color_name),
        spokeAt: 0,
    };
}
function wr(e) {
    return {
        id: e.id,
        parentId: e.parent_group_id,
        name: e.name,
        visible: e.visible !== !1,
    };
}
var Tr = {
        status: `disconnected`,
        buffers: {},
        activeBufferId: null,
        previousBufferId: null,
        version: null,
        scripts: [],
        options: {},
        upgrading: !1,
        quitting: !1,
        outgoingQueries: [],
    },
    Er = (e) => new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
function Dr(e, t, n) {
    let r = typeof navigator < `u` ? navigator.language : `en-US`,
        i = `43` + t.toLocaleDateString(r, { weekday: `long` }),
        a = { day: `numeric`, month: `long` };
    (t.getFullYear() !== e.getFullYear() && (a.year = `numeric`),
        (i += ` (` + t.toLocaleDateString(r, a)));
    let o = Math.round((Er(t) - Er(e)) / 864e5);
    (o > 1
        ? (i += `, ${o} days later`)
        : o < 0 && (i += o === -1 ? `, 1 day before` : `, ${-o} days before`),
        (i += `)`));
    let s = hr(`43─`),
        c = hr(i);
    return {
        key: n,
        id: -1,
        y: -1,
        date: t,
        prefix: s,
        content: c,
        prefixText: gr(s),
        text: gr(c),
        tags: [],
        highlight: !1,
        notifyLevel: -1,
        displayed: !0,
        isMessage: !1,
        isDateChange: !0,
    };
}
function Or(e, t) {
    let n = e.lines[e.lines.length - 1];
    n &&
        e.dayChange &&
        Er(n.date) !== Er(t.date) &&
        e.lines.push(Dr(n.date, t.date, `d` + t.key));
}
function kr(e, t, n) {
    if (!e.nicklistLoaded || t.prefix.length === 0) return;
    let r = t.prefix[t.prefix.length - 1].text;
    if ((r === ` *` && (r = t.text.match(/^(\S+)\s/)?.[1] ?? ``), r && r !== `=!=`)) {
        for (let t of Object.values(e.nicks))
            if (t.name === r) {
                t.spokeAt = n;
                return;
            }
    }
}
function Ar(e, t) {
    let n = e.lines.findIndex((e) => e.y >= t.y);
    n === -1
        ? e.lines.push(t)
        : e.lines[n].y === t.y
          ? (e.lines[n] = t)
          : e.lines.splice(n, 0, t);
}
function jr(e, t, n, r, i) {
    let a = xr(n, t.free);
    if (t.free) {
        Ar(t, a);
        return;
    }
    if ((t.requestedLines++, !a.displayed)) return;
    (Or(t, a), t.lines.push(a), kr(t, a, Date.now()));
    let o = e.activeBufferId === t.id;
    if (
        (o && i.push({ type: `activeBufferLine`, bufferId: t.id }),
        o && r.windowFocused)
    )
        return;
    let s = a.notifyLevel === 2,
        c = a.highlight || a.notifyLevel === 3;
    t.notify !== 0 && (c || s)
        ? (t.notification++, i.push({ type: `highlight`, bufferId: t.id, line: a }))
        : t.notify > 1 && a.notifyLevel === 1 && t.unread++;
}
function Mr(e, t, n, r, i = 0) {
    return $n(e, (e) => {
        let a = e.buffers[t];
        if (!a) return;
        ((a.lines = []),
            (a.requestedLines = n.length),
            (a.allLinesFetched = n.length < r));
        for (let e of n) {
            let t = xr(e, a.free);
            a.free ? Ar(a, t) : t.displayed && (Or(a, t), a.lines.push(t));
        }
        if (a.free) return;
        if (a.lastReadLineId >= 0) {
            let e = `l` + a.lastReadLineId;
            (a.lines.some((t) => t.key === e) && (a.lastReadKey = e),
                (a.lastReadLineId = -1));
        } else if (a.lastReadKey === null && i > 0) {
            let e = a.lines.filter((e) => !e.isDateChange),
                t = e[e.length - 1 - i];
            a.lastReadKey = t ? t.key : null;
        }
        let o = a.lines[a.lines.length - 1];
        if (o && a.dayChange && Er(o.date) !== Er(new Date())) {
            let e = new Date();
            a.lines.push(Dr(o.date, e, `dtoday`));
        }
    });
}
function Nr(e, t) {
    let n = yr(t);
    return ((e.buffers[t.id] = n), n);
}
function Pr(e, t) {
    return $n(e, (e) => {
        let n = new Set(t.map((e) => e.id));
        for (let t of Object.keys(e.buffers).map(Number))
            n.has(t) || delete e.buffers[t];
        for (let n of t) {
            let t = e.buffers[n.id];
            t ? Object.assign(t, vr(n)) : Nr(e, n);
        }
        e.activeBufferId !== null &&
            !e.buffers[e.activeBufferId] &&
            (e.activeBufferId = null);
    });
}
function Fr(e, t) {
    return $n(e, (e) => {
        for (let t of Object.values(e.buffers)) ((t.unread = 0), (t.notification = 0));
        for (let n of t) {
            let t = e.buffers[n.buffer_id];
            t &&
                t.id !== e.activeBufferId &&
                ((t.unread = n.count[1]), (t.notification = n.count[2] + n.count[3]));
        }
    });
}
function Ir(e, t) {
    let n = new Map(Object.values(e.nicks).map((e) => [e.name, e.spokeAt]));
    ((e.nickGroups = {}), (e.nicks = {}));
    let r = (t) => {
        e.nickGroups[t.id] = wr(t);
        for (let r of t.nicks ?? []) {
            let t = Cr(r);
            ((t.spokeAt = n.get(t.name) ?? 0), (e.nicks[t.id] = t));
        }
        for (let e of t.groups ?? []) r(e);
    };
    (r(t), (e.nicklistLoaded = !0));
}
function Lr(e, t, n) {
    return $n(e, (e) => {
        let r = e.buffers[t];
        r && Ir(r, n);
    });
}
function Rr(e, t) {
    return !e.buffers[t] || e.activeBufferId === t
        ? e
        : $n(e, (e) => {
              let n = e.activeBufferId === null ? void 0 : e.buffers[e.activeBufferId];
              if (n) {
                  let t = n.lines.findLast((e) => !e.isDateChange);
                  ((n.lastReadKey = t ? t.key : null), (e.previousBufferId = n.id));
              }
              let r = e.buffers[t];
              ((r.unread = 0), (r.notification = 0), (e.activeBufferId = t));
          });
}
function zr(e, t) {
    return $n(e, (e) => {
        let n = e.buffers[t];
        n && ((n.unread = 0), (n.notification = 0));
    });
}
function Br(e) {
    return $n(e, (e) => {
        for (let t of Object.values(e.buffers)) ((t.unread = 0), (t.notification = 0));
    });
}
var Vr = (e, t) => e.buffers[t.buffer_id];
function Hr(e, t, n) {
    let r = e.outgoingQueries.indexOf(t.shortName);
    t.shortName &&
        r >= 0 &&
        (e.outgoingQueries.splice(r, 1), n.push({ type: `activate`, bufferId: t.id }));
}
var Ur = (e, t) => {
        let n = Vr(e, t);
        n && t.body && Object.assign(n, vr(t.body));
    },
    Wr = {
        buffer_opened: (e, t, n, r) => {
            let i = t.body;
            if (!i || e.buffers[i.id]) return;
            let a = Nr(e, i);
            for (let t of i.lines ?? []) jr(e, a, t, n, []);
            (i.nicklist_root && Ir(a, i.nicklist_root), Hr(e, a, r));
        },
        buffer_type_changed: Ur,
        buffer_moved: Ur,
        buffer_merged: Ur,
        buffer_unmerged: Ur,
        buffer_hidden: Ur,
        buffer_unhidden: Ur,
        buffer_renamed: (e, t, n, r) => {
            Ur(e, t, n, r);
            let i = Vr(e, t);
            i && Hr(e, i, r);
        },
        buffer_title_changed: Ur,
        buffer_modes_changed: Ur,
        buffer_notify_changed: Ur,
        buffer_time_for_each_line_changed: Ur,
        buffer_prefix_for_each_line_changed: Ur,
        buffer_day_change_changed: Ur,
        buffer_localvar_added: Ur,
        buffer_localvar_changed: Ur,
        buffer_localvar_removed: Ur,
        buffer_cleared: (e, t) => {
            let n = Vr(e, t);
            n &&
                ((n.lines = []),
                (n.requestedLines = 0),
                (n.allLinesFetched = !0),
                (n.lastReadKey = null));
        },
        buffer_closing: Ur,
        buffer_closed: (e, t) => {
            if (
                (delete e.buffers[t.buffer_id],
                e.previousBufferId === t.buffer_id && (e.previousBufferId = null),
                e.activeBufferId === t.buffer_id)
            ) {
                let t = Object.values(e.buffers).sort((e, t) => e.number - t.number)[0];
                ((e.activeBufferId = t ? t.id : null),
                    t && ((t.unread = 0), (t.notification = 0)));
            }
        },
        buffer_line_added: (e, t, n, r) => {
            let i = Vr(e, t);
            i && t.body && jr(e, i, t.body, n, r);
        },
        buffer_line_data_changed: (e, t) => {
            let n = Vr(e, t);
            if (!n || !t.body) return;
            let r = xr(t.body, n.free);
            if (n.free) {
                Ar(n, r);
                return;
            }
            let i = n.lines.findIndex((e) => e.key === r.key);
            i >= 0 && (n.lines[i] = r);
        },
        input_prompt_changed: Ur,
        input_text_changed: Ur,
        input_text_cursor_moved: Ur,
        nicklist_group_added: (e, t, n, r) => {
            let i = Vr(e, t);
            if (!i?.nicklistLoaded || !t.body) return;
            let a = wr(t.body);
            ((i.nickGroups[a.id] = a), r.push({ type: `nicklist`, bufferId: i.id }));
        },
        nicklist_group_changed: (e, t, n, r) => {
            let i = Vr(e, t),
                a = t.body;
            i?.nicklistLoaded &&
                a &&
                i.nickGroups[a.id] &&
                ((i.nickGroups[a.id] = wr(a)),
                r.push({ type: `nicklist`, bufferId: i.id }));
        },
        nicklist_group_removing: (e, t, n, r) => {
            let i = Vr(e, t),
                a = t.body;
            if (!i?.nicklistLoaded || !a) return;
            let o = new Set([a.id]),
                s = !0;
            for (; s;) {
                s = !1;
                for (let e of Object.values(i.nickGroups))
                    !o.has(e.id) && o.has(e.parentId) && (o.add(e.id), (s = !0));
            }
            for (let e of o) delete i.nickGroups[e];
            for (let e of Object.values(i.nicks))
                o.has(e.groupId) && delete i.nicks[e.id];
            r.push({ type: `nicklist`, bufferId: i.id });
        },
        nicklist_nick_added: (e, t, n, r) => {
            let i = Vr(e, t);
            if (!i?.nicklistLoaded || !t.body) return;
            let a = Cr(t.body);
            ((a.spokeAt = Date.now()),
                (i.nicks[a.id] = a),
                r.push({ type: `nicklist`, bufferId: i.id }));
        },
        nicklist_nick_changed: (e, t, n, r) => {
            let i = Vr(e, t);
            if (!i?.nicklistLoaded || !t.body) return;
            let a = Cr(t.body);
            ((a.spokeAt = i.nicks[a.id]?.spokeAt ?? 0),
                (i.nicks[a.id] = a),
                r.push({ type: `nicklist`, bufferId: i.id }));
        },
        nicklist_nick_removing: (e, t, n, r) => {
            let i = Vr(e, t);
            i?.nicklistLoaded &&
                t.body &&
                (delete i.nicks[t.body.id],
                r.push({ type: `nicklist`, bufferId: i.id }));
        },
        upgrade: (e, t, n, r) => {
            ((e.upgrading = !0), r.push({ type: `upgrade` }));
        },
        upgrade_ended: (e, t, n, r) => {
            ((e.upgrading = !1), r.push({ type: `resync` }));
        },
        quit: (e) => {
            e.quitting = !0;
        },
        day_changed: () => void 0,
    };
Object.keys(Wr);
function Gr(e, t, n) {
    let r = Wr[t.event_name],
        i = [];
    return r
        ? { state: $n(e, (e) => r(e, t, n, i)), effects: i }
        : { state: e, effects: i };
}
var Kr = {
        'weechat.look.buffer_time_format': `%H:%M:%S`,
        'weechat.completion.nick_completer': `:`,
        'weechat.completion.nick_add_space': `on`,
    },
    qr = [`/query`, `/join`, `/j`, `/q`],
    Jr = class {
        store;
        client = null;
        api = null;
        connectOptions = null;
        hotlistTimer;
        reconnectTimer;
        history = new Map();
        options;
        constructor(e) {
            ((this.options = e),
                (this.store = ot(() => ({ ...Tr, error: null, loadingLines: !1 }))));
        }
        get state() {
            return this.store.getState();
        }
        set(e) {
            this.store.setState(e);
        }
        update(e) {
            this.store.setState((t) => ({ ...t, ...e(t) }));
        }
        async connect(e) {
            if (
                this.state.status !== `connecting` &&
                this.state.status !== `connected`
            ) {
                (clearTimeout(this.reconnectTimer),
                    (this.connectOptions = e),
                    this.set({ status: `connecting`, error: null, quitting: !1 }));
                try {
                    await this.open(e);
                } catch (e) {
                    throw (
                        this.set({
                            status: `disconnected`,
                            error: e instanceof At ? e : new At(`network`, String(e)),
                        }),
                        e
                    );
                }
            }
        }
        async open(e) {
            let t = new Mt({
                onEvent: (e) => this.onEvent(e),
                onClose: (e) => {
                    this.client === t && this.onClose(e.byClient);
                },
                pingInterval: this.options.pingInterval,
            });
            (await t.connect(e),
                (this.client = t),
                (this.api = new vt(t)),
                await this.initialSync());
        }
        async initialSync() {
            let e = this.api,
                t =
                    this.state.activeBufferId === null
                        ? void 0
                        : this.state.buffers[this.state.activeBufferId]?.fullName;
            (this.set({
                ...Tr,
                status: this.state.status,
                error: null,
                options: { ...Kr },
            }),
                this.history.clear());
            let n = e.version(),
                r = e.buffers({ colors: `weechat` }),
                i = e.hotlist(),
                a = e.sync({ sync: !0, nicks: !0, input: !1, colors: `weechat` });
            this.set({ version: await n });
            let o = await r;
            this.update((e) => Pr(e, o));
            let s = await i;
            (this.update((e) => Fr(e, s)),
                await a,
                this.set({ status: `connected`, upgrading: !1 }));
            for (let t of Object.keys(Kr))
                e.option(t).then(
                    (e) => {
                        let n = e.value;
                        (typeof n == `boolean` && (n = n ? `on` : `off`),
                            n !== null &&
                                this.set({
                                    options: { ...this.state.options, [t]: String(n) },
                                }));
                    },
                    () => void 0,
                );
            e.scripts().then(
                (e) => this.set({ scripts: e }),
                () => void 0,
            );
            let c = t ?? this.options.resumeBuffer?.(),
                l = Object.values(this.state.buffers).sort(
                    (e, t) => e.number - t.number,
                ),
                u = l.find((e) => e.fullName === c) ?? l[0];
            (u && this.activate(u.id),
                clearInterval(this.hotlistTimer),
                this.options.hotlistSync() &&
                    (this.hotlistTimer = setInterval(
                        () => this.refreshHotlist(),
                        this.options.hotlistInterval ?? 6e4,
                    )));
        }
        onClose(e) {
            if (
                (clearInterval(this.hotlistTimer),
                (this.client = null),
                (this.api = null),
                e || this.state.status === `disconnected`)
            ) {
                this.set({ status: `disconnected` });
                return;
            }
            (this.set({ status: `reconnecting` }),
                this.scheduleReconnect(this.options.reconnectDelay ?? 3e3));
        }
        scheduleReconnect(e) {
            (clearTimeout(this.reconnectTimer),
                (this.reconnectTimer = setTimeout(() => this.reconnect(e), e)));
        }
        async reconnect(e = this.options.reconnectDelay ?? 3e3) {
            if (this.connectOptions && this.state.status !== `connected`) {
                (clearTimeout(this.reconnectTimer),
                    this.set({ status: `reconnecting` }));
                try {
                    await this.open(this.connectOptions);
                } catch {
                    let t = e * 1.5;
                    t >= (this.options.reconnectMaxDelay ?? 6e5)
                        ? this.set({ status: `disconnected` })
                        : this.scheduleReconnect(t);
                }
            }
        }
        disconnect() {
            (clearTimeout(this.reconnectTimer),
                clearInterval(this.hotlistTimer),
                this.set({ status: `disconnected` }));
            let e = this.client;
            ((this.client = null), (this.api = null), e?.close());
        }
        async refreshHotlist() {
            if (this.api)
                try {
                    let e = await this.api.hotlist();
                    this.update((t) => Fr(t, e));
                } catch {}
        }
        onEvent(e) {
            let t = Gr(this.state, e, {
                windowFocused: this.options.windowFocused?.() ?? !0,
            });
            this.update(() => t.state);
            for (let e of t.effects) this.runEffect(e);
        }
        runEffect(e) {
            switch (e.type) {
                case `highlight`:
                    this.options.onHighlight?.(e.bufferId, e.line);
                    break;
                case `activeBufferLine`:
                    this.options.onActiveBufferLine?.();
                    break;
                case `activate`:
                    this.activate(e.bufferId);
                    break;
                case `upgrade`:
                    this.client?.abort(`upgrade`);
                    break;
                case `resync`:
                    this.api && this.initialSync();
            }
        }
        activate(e, t = 100) {
            let n = this.state.buffers[e];
            if (!n) return;
            let r = n.unread + n.notification;
            this.update((t) => Rr(t, e));
            let i = this.state.buffers[e];
            (i.requestedLines < t &&
                !i.allLinesFetched &&
                this.fetchLines(e, Math.max(t, Math.min(r, 4 * t)), r),
                i.hasNicklist && !i.nicklistLoaded && this.loadNicklist(e),
                this.options.hotlistSync() && this.clearHotlist(e));
        }
        activatePrevious() {
            this.state.previousBufferId !== null &&
                this.activate(this.state.previousBufferId);
        }
        async fetchLines(e, t, n = 0) {
            let r = this.state.buffers[e];
            if (!this.api || !r) return;
            let i = Math.max(t ?? 0, r.requestedLines * 2, 1);
            this.set({ loadingLines: !0 });
            try {
                let t = await this.api.lines(e, -i, `weechat`);
                this.update((r) => Mr(r, e, t, i, n));
            } finally {
                this.set({ loadingLines: !1 });
            }
        }
        async loadNicklist(e) {
            if (!this.api) return;
            let t = await this.api.nicks(e, `weechat`);
            this.update((n) => Lr(n, e, t));
        }
        markRead(e) {
            this.update((t) => zr(t, e));
        }
        clearHotlist(e) {
            (this.input(`/buffer set hotlist -1`, e).catch(() => void 0),
                this.input(`/input set_unread_current_buffer`, e).catch(() => void 0));
        }
        clearAllHotlists() {
            (this.update((e) => Br(e)),
                this.input(`/hotlist clear`).catch(() => void 0));
        }
        async input(e, t) {
            if (!this.api) throw Error(`Not connected`);
            await this.api.input(e, t ?? `core.weechat`);
        }
        async send(e, t, n = () => !0) {
            if (t === ``) return;
            this.addToHistory(e, t);
            let r = t.split(` `, 1)[0];
            if (qr.includes(r) && t.includes(` `)) {
                let e = t
                    .substring(t.indexOf(` `) + 1)
                    .trim()
                    .split(/\s+/)[0];
                this.set({ outgoingQueries: [...this.state.outgoingQueries, e] });
            }
            for (let r of t.split(/\r?\n/))
                ((r !== `/quit` && !r.startsWith(`/quit `)) || n()) &&
                    (await this.input(r, e));
            this.options.hotlistSync() && this.clearHotlist(e);
        }
        completion(e, t, n) {
            return this.api
                ? this.api.completion(t, e, n)
                : Promise.reject(Error(`Not connected`));
        }
        openQuery(e, t) {
            let n = this.state.buffers[e];
            if (!n) return;
            let r = n.fullName.substring(0, n.fullName.lastIndexOf(`.`) + 1) + t,
                i = Object.values(this.state.buffers).find((e) => e.fullName === r);
            if (i) {
                this.activate(i.id);
                return;
            }
            let a = /^[#&+!]/.test(t) ? `/join -noswitch ` : `/query -noswitch `;
            (this.set({ outgoingQueries: [...this.state.outgoingQueries, t] }),
                this.input(a + t, e).catch(() => void 0));
        }
        historyOf(e) {
            let t = this.history.get(e);
            return (t || ((t = { lines: [], pos: 0 }), this.history.set(e, t)), t);
        }
        addToHistory(e, t) {
            let n = this.historyOf(e);
            (n.pos !== n.lines.length && n.lines.pop(),
                n.lines.push(t),
                (n.pos = n.lines.length));
        }
        historyUp(e, t) {
            let n = this.historyOf(e);
            return (
                n.pos >= n.lines.length && n.lines.push(t),
                n.pos <= 0 || n.pos >= n.lines.length ? t : (n.pos--, n.lines[n.pos])
            );
        }
        historyDown(e, t) {
            let n = this.historyOf(e);
            return n.pos === n.lines.length
                ? (t !== `` && (n.lines.push(t), n.pos++), ``)
                : n.pos < 0 || n.pos > n.lines.length
                  ? t
                  : (n.pos++,
                    n.lines.length > 0 && n.pos === n.lines.length - 1
                        ? (n.lines.pop() ?? ``)
                        : n.lines[n.pos]);
        }
    },
    Yr = `'Inter Variable', Inter, system-ui, sans-serif`,
    Xr = {
        theme: `dark`,
        hostField: `localhost`,
        host: `localhost`,
        port: 9001,
        path: `api`,
        tls: typeof location < `u` && location.protocol === `https:`,
        savepassword: !1,
        password: ``,
        autoconnect: !1,
        nonicklist: !1,
        alwaysnicklist: !1,
        onlyUnread: !1,
        hotlistsync: !0,
        orderbyserver: !0,
        useFavico: !0,
        soundnotification: !0,
        fontsize: `14px`,
        fontfamily: Yr,
        readlineBindings: !1,
        enableMathjax: !1,
        enableQuickKeys: !0,
        customCSS: ``,
        currentlyViewedBuffers: {},
    };
function Zr() {
    try {
        return typeof localStorage > `u` ? null : localStorage;
    } catch {
        return null;
    }
}
function Qr(e = Zr()) {
    let t = { ...Xr };
    if (!e) return t;
    let n = t;
    for (let t of Object.keys(Xr)) {
        let r = e.getItem(t);
        if (r === null) continue;
        let i;
        try {
            i = JSON.parse(r);
        } catch {
            i = r;
        }
        let a = Xr[t];
        if (typeof a == `boolean`) i = i === !0 || i === `true`;
        else if (typeof a == `string` && typeof i == `number`) i = String(i);
        else if (typeof a == `object` && (typeof i != `object` || !i)) continue;
        n[t] = i;
    }
    (t.path === `weechat` && (t.path = `api`),
        t.hostField.endsWith(`/weechat`) &&
            (t.hostField = t.hostField.replace(/\/weechat$/, `/api`)));
    for (let [e, n] of Object.entries(t.currentlyViewedBuffers))
        typeof n != `string` && delete t.currentlyViewedBuffers[e];
    return (t.savepassword || (t.password = ``), t);
}
var $r = ot(() => Qr());
function ei(e) {
    let t = { ...$r.getState(), ...e };
    (t.savepassword || (t.password = ``), $r.setState(t, !0));
    let n = Zr();
    if (n) {
        for (let r of Object.keys(e))
            try {
                n.setItem(r, JSON.stringify(t[r]));
            } catch {}
        t.savepassword || n.removeItem(`password`);
    }
}
function ti(e) {
    return ct($r, e);
}
function ni() {
    return $r.getState();
}
function ri(e) {
    let t = e.trim(),
        n,
        r = /^(https?|wss?):\/\/(.+)$/.exec(t);
    r && ((t = r[2]), (n = r[1] === `https` || r[1] === `wss`));
    let i = /^([^:/]*|\[.*\])$/.exec(t);
    return i
        ? { host: i[1], path: `api`, tls: n, hostField: t }
        : ((i = /^([^:]*|\[.*\]):(\d+)$/.exec(t)),
          i
              ? { host: i[1], port: i[2], path: `api`, tls: n, hostField: t }
              : ((i = /^([^:]*|\[.*\]):(\d+)\/(.+)$/.exec(t)),
                i
                    ? { host: i[1], port: i[2], path: i[3], tls: n, hostField: t }
                    : null));
}
function ii(e) {
    let t = {};
    for (let n of e.replace(/^#/, ``).split(`&`)) {
        let e = n.indexOf(`=`);
        if (e < 0) continue;
        let r = n.substring(0, e),
            i;
        try {
            i = decodeURIComponent(n.substring(e + 1));
        } catch {
            i = n.substring(e + 1);
        }
        r === `host` || r === `port` || r === `path` || r === `password`
            ? (t[r] = i)
            : r === `autoconnect` && (t.autoconnect = i === `true`);
    }
    return t;
}
var ai = null,
    oi = [];
function si() {
    (typeof Notification < `u` &&
        Notification.permission === 'default' &&
        Notification.requestPermission(),
        `serviceWorker` in navigator &&
            ai === null &&
            navigator.serviceWorker.register(`serviceworker.js`).then(
                (e) => {
                    ai = e;
                },
                () => void 0,
            ));
}
function ci(e, t, n) {
    if (typeof Notification > `u` || Notification.permission !== `granted`) return;
    if (ai) {
        ai.showNotification(e, {
            body: t,
            icon: `assets/img/glowing_bear_128x128.png`,
            tag: `gb-highlight`,
        });
        return;
    }
    let r = new Notification(e, { body: t, icon: `assets/img/favicon.png` });
    (oi.push(r),
        (r.onclick = () => {
            (window.focus(), n(), r.close());
        }),
        (r.onclose = () => {
            oi.splice(oi.indexOf(r), 1);
        }),
        setTimeout(() => r.close(), 15e3));
}
function li() {
    let e = new Audio();
    ((e.src = e.canPlayType(`audio/ogg`)
        ? `assets/audio/sonar.ogg`
        : `assets/audio/sonar.mp3`),
        e.play().catch(() => void 0));
}
function ui(e, t, n) {
    let r = e.notification,
        i,
        a;
    (e.type === `private`
        ? ((i = r > 1 ? `${r} private messages from ` : `Private message from `),
          (a = t.text))
        : ((i = r > 1 ? `${r} highlights in ` : `Highlight in `),
          (a = `<${t.prefixText}> ${t.text}`)),
        (i += e.shortName + (e.server ? ` (${e.server})` : ``)),
        ci(i, a, n),
        ni().soundnotification && li());
}
function di() {
    for (let e of [...oi]) e.close();
}
function fi(e, t) {
    let n = e > 0 ? `(${e}) Glowing Bear` : `Glowing Bear`;
    (t &&
        ((n += ` | ${t.shortName || t.fullName}`),
        t.titleText && (n += ` | ${t.titleText}`)),
        (document.title = n));
}
var pi = null,
    mi = null;
function hi(e, t) {
    let n = document.querySelector(`link[rel="icon"][type="image/png"]`);
    if (!n) return;
    pi ??= n.href;
    let r = e > 0 ? e : t;
    if (r === 0 || !ni().useFavico) {
        n.href = pi;
        return;
    }
    let i = (t) => {
        let i = document.createElement(`canvas`);
        i.width = i.height = 32;
        let a = i.getContext(`2d`);
        a &&
            (a.drawImage(t, 0, 0, 32, 32),
            (a.fillStyle = e > 0 ? `#dd0000` : `#5cb85c`),
            a.beginPath(),
            a.arc(22, 22, 10, 0, 2 * Math.PI),
            a.fill(),
            (a.fillStyle = `#ffffff`),
            (a.font = `bold 13px sans-serif`),
            (a.textAlign = `center`),
            (a.textBaseline = `middle`),
            a.fillText(r > 99 ? `99` : String(r), 22, 23),
            (n.href = i.toDataURL(`image/png`)));
    };
    mi?.complete
        ? i(mi)
        : ((mi = new Image()), (mi.onload = () => i(mi)), (mi.src = pi));
}
function gi(e, t) {
    if (!(`setAppBadge` in navigator)) return;
    let n = navigator,
        r;
    ((r = e > 0 ? n.setAppBadge(e) : t > 0 ? n.setAppBadge() : n.clearAppBadge()),
        r.catch(() => void 0));
}
var _i = (e = ni()) => `${e.host}:${e.port}/${e.path}`,
    vi = () => typeof document < `u` && document.body.clientWidth < 968,
    yi = () => typeof document > `u` || document.visibilityState !== `hidden`,
    bi = new Set(),
    k = new Jr({
        hotlistSync: () => ni().hotlistsync,
        windowFocused: yi,
        onHighlight: (e, t) => {
            let n = k.state.buffers[e];
            n && ui(n, t, () => Ai(e));
        },
        onActiveBufferLine: () => bi.forEach((e) => e()),
        resumeBuffer: () => ni().currentlyViewedBuffers[_i()],
    });
function xi(e) {
    return ct(k.store, e);
}
var Si = () =>
        xi((e) => (e.activeBufferId === null ? void 0 : e.buffers[e.activeBufferId])),
    Ci = ot(() => ({
        sidebarOpen: !0,
        nicklistOpen: !1,
        modal: null,
        search: ``,
        searchIndex: 0,
        showQuickKeys: !1,
        jumpMode: !1,
        jumpDigit: null,
        input: ``,
    }));
function wi(e) {
    return ct(Ci, e);
}
var A = (e) => Ci.setState(e),
    Ti = () => A({ modal: null }),
    Ei = (e) => (t, n) =>
        (e && t.serverSortKey.localeCompare(n.serverSortKey)) || t.number - n.number;
function Di(e, t) {
    return e.some(
        (e) =>
            e.plugin === t.plugin &&
            e.server === t.server &&
            e !== t &&
            e.unread + e.notification > 0,
    );
}
function Oi(e, t, n, r) {
    let i = Object.values(e),
        a = [...i].sort(Ei(n.orderbyserver)),
        o = [...i].sort((e, t) => e.number - t.number),
        s = new Map(o.map((e, t) => [e.id, t < 99 ? t + 1 : null])),
        c = r.search.toLowerCase(),
        l = a.filter((e) => {
            if (r.jumpMode) {
                let t = s.get(e.id) ?? null;
                return (
                    r.jumpDigit === null ||
                    (t !== null && Math.floor(t / 10) === r.jumpDigit)
                );
            }
            return c
                ? e.fullName.toLowerCase().includes(c)
                : n.onlyUnread
                  ? e.id === t || e.fullName === `core.weechat` || e.pinned
                      ? !0
                      : n.orderbyserver && e.type === `server`
                        ? Di(i, e)
                        : (e.unread > 0 && !e.hidden) || e.notification > 0
                  : !e.hidden;
        }),
        u = c || n.onlyUnread ? l : [...l].sort((e, t) => e.number - t.number),
        d = new Map(u.slice(0, 10).map((e, t) => [e.id, String((t + 1) % 10)]));
    return l.map((e) => ({
        buffer: e,
        quickKey: d.get(e.id) ?? ``,
        jumpKey: s.get(e.id) ?? null,
    }));
}
function ki() {
    let e = k.state;
    return Oi(e.buffers, e.activeBufferId, ni(), Ci.getState());
}
function Ai(e) {
    k.activate(e);
    let t = k.state.buffers[e];
    (t &&
        ei({
            currentlyViewedBuffers: {
                ...ni().currentlyViewedBuffers,
                [_i()]: t.fullName,
            },
        }),
        vi() && A({ sidebarOpen: !1, nicklistOpen: !1 }),
        A({ search: ``, searchIndex: 0 }));
}
function ji(e) {
    let t = ni(),
        n = k.state,
        r = Object.values(n.buffers)
            .filter((e) => !e.hidden || e.id === n.activeBufferId)
            .sort(Ei(t.orderbyserver)),
        i = r[r.findIndex((e) => e.id === n.activeBufferId) + e];
    i && Ai(i.id);
}
function Mi() {
    let e = Object.values(k.state.buffers).sort((e, t) => e.number - t.number),
        t =
            e.find((e) => e.notification > 0) ??
            e.find((e) => e.unread > 0 && !e.hidden);
    t && Ai(t.id);
}
function Ni() {
    if (!vi()) {
        ei({ nonicklist: !ni().nonicklist });
        return;
    }
    A({ nicklistOpen: !Ci.getState().nicklistOpen, sidebarOpen: !1 });
}
function Pi(e) {
    let t = Ci.getState().input,
        n = t.length === 0;
    if (t.length > 0) {
        let e = t.trim();
        if (e.endsWith(`:`)) {
            let r = e.slice(e.lastIndexOf(` `) + 1, -1),
                i =
                    k.state.activeBufferId === null
                        ? void 0
                        : k.state.buffers[k.state.activeBufferId];
            i &&
                Object.values(i.nicks).some((e) => e.name === r) &&
                ((t = t.slice(0, t.lastIndexOf(`:`)) + ` `), (n = !0));
        }
        t.endsWith(` `) || (t += ` `);
    }
    ((t += e),
        n && (t += `: `),
        A({ input: t }),
        document.getElementById(`sendMessage`)?.focus());
}
var Fi = s((e) => {
        var t = Symbol.for(`react.transitional.element`),
            n = Symbol.for(`react.fragment`);
        function r(e, n, r) {
            var i = null;
            if (
                (r !== void 0 && (i = `` + r),
                n.key !== void 0 && (i = `` + n.key),
                `key` in n)
            )
                for (var a in ((r = {}), n)) a !== `key` && (r[a] = n[a]);
            else r = n;
            return (
                (n = r.ref),
                { $$typeof: t, type: e, key: i, ref: n === void 0 ? null : n, props: r }
            );
        }
        ((e.Fragment = n), (e.jsx = r), (e.jsxs = r));
    }),
    j = s((e, t) => {
        t.exports = Fi();
    })();
function M({ icon: e, spin: t = !1, className: n = `` }) {
    return (0, j.jsx)(`span`, {
        className: `gb-icon ${t ? `gb-spin` : ``} ${n}`.trim(),
        'aria-hidden': `true`,
        children: (0, j.jsx)(e, { className: `gb-icon-svg`, focusable: `false` }),
    });
}
var Ii = `aaa1rp3bb0ott3vie4c1le2ogado5udhabi7c0ademy5centure6ountant0s9o1tor4d0s1ult4e0g1ro2tna4f0l1rica5g0akhan5ency5i0g1rbus3force5tel5kdn3l0ibaba4pay4lfinanz6state5y2sace3tom5m0azon4ericanexpress7family11x2fam3ica3sterdam8nalytics7droid5quan4z2o0l2partments8p0le4q0uarelle8r0ab1mco4chi3my2pa2t0e3s0da2ia2sociates9t0hleta5torney7u0ction5di0ble3o3spost5thor3o0s4w0s2x0a2z0ure5ba0by2idu3namex4d1k2r0celona5laycard4s5efoot5gains6seball5ketball8uhaus5yern5b0c1t1va3cg1n2d1e0ats2uty4er2rlin4st0buy5t2f1g1h0arti5i0ble3d1ke2ng0o3o1z2j1lack0friday9ockbuster8g1omberg7ue3m0s1w2n0pparibas9o0ats3ehringer8fa2m1nd2o0k0ing5sch2tik2on4t1utique6x2r0adesco6idgestone9oadway5ker3ther5ussels7s1t1uild0ers6siness6y1zz3v1w1y1z0h3ca0b1fe2l0l1vinklein9m0era3p2non3petown5ital0one8r0avan4ds2e0er0s4s2sa1e1h1ino4t0ering5holic7ba1n1re3c1d1enter4o1rn3f0a1d2g1h0anel2nel4rity4se2t2eap3intai5ristmas6ome4urch5i0priani6rcle4sco3tadel4i0c2y3k1l0aims4eaning6ick2nic1que6othing5ud3ub0med6m1n1o0ach3des3ffee4llege4ogne5m0mbank4unity6pany2re3uter5sec4ndos3struction8ulting7tact3ractors9oking4l1p2rsica5untry4pon0s4rses6pa2r0edit0card4union9icket5own3s1uise0s6u0isinella9v1w1x1y0mru3ou3z2dad1nce3ta1e1ing3sun4y2clk3ds2e0al0er2s3gree4livery5l1oitte5ta3mocrat6ntal2ist5si0gn4v2hl2iamonds6et2gital5rect0ory7scount3ver5h2y2j1k1m1np2o0cs1tor4g1mains5t1wnload7rive4tv2ubai3pont4rban5vag2r2z2earth3t2c0o2deka3u0cation8e1g1mail3erck5nergy4gineer0ing9terprises10pson4quipment8r0icsson6ni3s0q1tate5t1u0rovision8s2vents5xchange6pert3osed4ress5traspace10fage2il1rwinds6th3mily4n0s2rm0ers5shion4t3edex3edback6rrari3ero6i0delity5o2lm2nal1nce1ial7re0stone6mdale6sh0ing5t0ness6j1k1lickr3ghts4r2orist4wers5y2m1o0o0d1tball6rd1ex2sale4um3undation8x2r0ee1senius7l1ogans4ntier7tr2ujitsu5n0d2rniture7tbol5yi3ga0l0lery3o1up4me0s3p1rden4y2b0iz3d0n2e0a1nt0ing5orge5f1g0ee3h1i0ft0s3ves2ing5l0ass3e1obal2o4m0ail3bh2o1x2n1odaddy5ld0point6f2odyear5g0le4p1t1v2p1q1r0ainger5phics5tis4een3ipe3ocery4up4s1t1u0cci3ge2ide2tars5ru3w1y2hair2mburg5ngout5us3bo2dfc0bank7ealth0care8lp1sinki6re1mes5iphop4samitsu7tachi5v2k0t2m1n1ockey4ldings5iday5medepot5goods5s0ense7nda3rse3spital5t0ing5t0els3mail5use3w2r1sbc3t1u0ghes5yatt3undai7ibm2cbc2e1u2d1e0ee3fm2kano4l1m0amat4db2mo0bilien9n0c1dustries8finiti5o2g1k1stitute6urance4e4t0ernational10uit4vestments10o1piranga7q1r0ish4s0maili5t0anbul7t0au2v3jaguar4va3cb2e0ep2tzt3welry6io2ll2m0p2nj2o0bs1urg4t1y2p0morgan6rs3uegos4niper7kaufen5ddi3e0rryhotels6properties14fh2g1h1i0a1ds2m1ndle4tchen5wi3m1n1oeln3matsu5sher5p0mg2n2r0d1ed3uokgroup8w1y0oto4z2la0caixa5mborghini8er3nd0rover6xess5salle5t0ino3robe5w0yer5b1c1ds2ease3clerc5frak4gal2o2xus4gbt3i0dl2fe0insurance9style7ghting6ke2lly3mited4o2ncoln4k2ve1ing5k1lc1p2oan0s3cker3us3l1ndon4tte1o3ve3pl0financial11r1s1t0d0a3u0ndbeck6xe1ury5v1y2ma0drid4if1son4keup4n0agement7go3p1rket0ing3s4riott5shalls7ttel5ba2c0kinsey7d1e0d0ia3et2lbourne7me1orial6n0u2rck0msd7g1h1iami3crosoft7l1ni1t2t0subishi9k1l0b1s2m0a2n1o0bi0le4da2e1i1m1nash3ey2ster5rmon3tgage6scow4to0rcycles9v0ie4p1q1r1s0d2t0n1r2u0seum3ic4v1w1x1y1z2na0b1goya4me2vy3ba2c1e0c1t0bank4flix4work5ustar5w0s2xt0direct7us4f0l2g0o2hk2i0co2ke1on3nja3ssan1y5l1o0kia3rton4w0ruz3tv4p1r0a1w2tt2u1yc2z2obi1server7ffice5kinawa6layan0group9lo3m0ega4ne1g1l0ine5oo2pen3racle3nge4g0anic5igins6saka4tsuka4t2vh3pa0ge2nasonic7ris2s1tners4s1y3y2ccw3e0t2f0izer5g1h0armacy6d1ilips5one2to0graphy6s4ysio5ics1tet2ures6d1n0g1k2oneer5zza4k1l0ace2y0station9umbing5s3m1n0c2ohl2ker3litie5rn2st3r0axi3ess3ime3o0d0uctions8f1gressive8mo2perties3y5tection8u0dential9s1t1ub2w0c2y2qa1pon3uebec3st5racing4dio4e0ad1lestate6tor2y4cipes5d0umbrella9hab3ise0n3t2liance6n0t0als5pair3ort3ublican8st0aurant8view0s5xroth6ich0ardli6oh3l1o1p2o0cks3deo3gers4om3s0vp3u0gby3hr2n2w0e2yukyu6sa0arland6fe0ty4kura4le1on3msclub4ung5ndvik0coromant12ofi4p1rl2s1ve2xo3b0i1s2c0b1haeffler7midt4olarships8ol3ule3warz5ience5ot3d1e0arch3t2cure1ity6ek2lect4ner3rvices6ven3w1x0y3fr2g1h0angrila6rp3ell3ia1ksha5oes2p0ping5uji3w3i0lk2na1gles5te3j1k0i0n2y0pe4l0ing4m0art3ile4n0cf3o0ccer3ial4ftbank4ware6hu2lar2utions7ng1y2y2pa0ce3ort2t3r0l2s1t0ada2ples4r1tebank4farm7c0group6ockholm6rage3e3ream4udio2y3yle4u0cks3pplies3y2ort5rf1gery5zuki5v1watch4iss4x1y0dney4stems6z2tab1ipei4lk2obao4rget4tamotors6r2too4x0i3c0i2d0k2eam2ch0nology8l1masek5nnis4va3f1g1h0d1eater2re6iaa2ckets5enda4ps2res2ol4j0maxx4x2k0maxx5l1m0all4n1o0day3kyo3ols3p1ray3shiba5tal3urs3wn2yota3s3r0ade1ing4ining5vel0ers0insurance16ust3v2t1ube2i1nes3shu4v0s2w1z2ua1bank3s2g1k1nicom3versity8o2ol2ps2s1y1z2va0cations7na1guard7c1e0gas3ntures6risign5mögensberater2ung14sicherung10t2g1i0ajes4deo3g1king4llas4n1p1rgin4sa1ion4va1o3laanderen9n1odka3lvo3te1ing3o2yage5u2wales2mart4ter4ng0gou5tch0es6eather0channel12bcam3er2site5d0ding5ibo2r3f1hoswho6ien2ki2lliamhill9n0dows4e1ners6me2oodside6rk0s2ld3w2s1tc1f3xbox3erox4ihuan4n2xx2yz3yachts4hoo3maxun5ndex5e1odobashi7ga2kohama6u0tube6t1un3za0ppos4ra3ero3ip2m1one3uerich6w2`,
    Li = `ελ1υ2бг1ел3дети4ею2католик6ом3мкд2он1сква6онлайн5рг3рус2ф2сайт3рб3укр3қаз3հայ3ישראל5קום3ابوظبي5رامكو5لاردن4بحرين5جزائر5سعودية6عليان5مغرب5مارات5یران5بارت2زار4يتك3ھارت5تونس4سودان3رية5شبكة4عراق2ب2مان4فلسطين6قطر3كاثوليك6وم3مصر2ليسيا5وريتانيا7قع4همراه5پاکستان7ڀارت4कॉम3नेट3भारत0म्3ोत5संगठन5বাংলা5ভারত2ৰত4ਭਾਰਤ4ભારત4ଭାରତ4இந்தியா6லங்கை6சிங்கப்பூர்11భారత్5ಭಾರತ4ഭാരതം5ලංකා4คอม3ไทย3ລາວ3გე2みんな3アマゾン4クラウド4グーグル4コム2ストア3セール3ファッション6ポイント4世界2中信1国1國1文网3亚马逊3企业2佛山2信息2健康2八卦2公司1益2台湾1灣2商城1店1标2嘉里0大酒店5在线2大拿2天主教3娱乐2家電2广东2微博2慈善2我爱你3手机2招聘2政务1府2新加坡2闻2时尚2書籍2机构2淡马锡3游戏2澳門2点看2移动2组织机构4网址1店1站1络2联通2谷歌2购物2通販2集团2電訊盈科4飞利浦3食品2餐厅2香格里拉3港2닷넷1컴2삼성2한국2`,
    Ri = `numeric`,
    zi = `ascii`,
    Bi = `alpha`,
    Vi = `asciinumeric`,
    Hi = `alphanumeric`,
    Ui = `domain`,
    Wi = `emoji`,
    Gi = `scheme`,
    Ki = `slashscheme`,
    qi = `whitespace`;
function Ji(e, t) {
    return (e in t || (t[e] = []), t[e]);
}
function Yi(e, t, n) {
    (t[Ri] && ((t[Vi] = !0), (t[Hi] = !0)),
        t[zi] && ((t[Vi] = !0), (t[Bi] = !0)),
        t[Vi] && (t[Hi] = !0),
        t[Bi] && (t[Hi] = !0),
        t[Hi] && (t[Ui] = !0),
        t[Wi] && (t[Ui] = !0));
    for (let r in t) {
        let t = Ji(r, n);
        t.indexOf(e) < 0 && t.push(e);
    }
}
function Xi(e, t) {
    let n = {};
    for (let r in t) t[r].indexOf(e) >= 0 && (n[r] = !0);
    return n;
}
function Zi(e = null) {
    ((this.j = {}), (this.jr = []), (this.jd = null), (this.t = e));
}
((Zi.groups = {}),
    (Zi.prototype = {
        accepts() {
            return !!this.t;
        },
        go(e) {
            let t = this,
                n = t.j[e];
            if (n) return n;
            for (let n = 0; n < t.jr.length; n++) {
                let r = t.jr[n][0],
                    i = t.jr[n][1];
                if (i && r.test(e)) return i;
            }
            return t.jd;
        },
        has(e, t = !1) {
            return t ? e in this.j : !!this.go(e);
        },
        ta(e, t, n, r) {
            for (let i = 0; i < e.length; i++) this.tt(e[i], t, n, r);
        },
        tr(e, t, n, r) {
            r ||= Zi.groups;
            let i;
            return (
                t && t.j ? (i = t) : ((i = new Zi(t)), n && r && Yi(t, n, r)),
                this.jr.push([e, i]),
                i
            );
        },
        ts(e, t, n, r) {
            let i = this,
                a = e.length;
            if (!a) return i;
            for (let t = 0; t < a - 1; t++) i = i.tt(e[t]);
            return i.tt(e[a - 1], t, n, r);
        },
        tt(e, t, n, r) {
            r ||= Zi.groups;
            let i = this;
            if (t && t.j) return ((i.j[e] = t), t);
            let a = t,
                o,
                s = i.go(e);
            return (
                s
                    ? ((o = new Zi()),
                      Object.assign(o.j, s.j),
                      o.jr.push.apply(o.jr, s.jr),
                      (o.jd = s.jd),
                      (o.t = s.t))
                    : (o = new Zi()),
                a &&
                    (r &&
                        (o.t && typeof o.t == `string`
                            ? Yi(a, Object.assign(Xi(o.t, r), n), r)
                            : n && Yi(a, n, r)),
                    (o.t = a)),
                (i.j[e] = o),
                o
            );
        },
    }));
var N = (e, t, n, r, i) => e.ta(t, n, r, i),
    P = (e, t, n, r, i) => e.tr(t, n, r, i),
    Qi = (e, t, n, r, i) => e.ts(t, n, r, i),
    F = (e, t, n, r, i) => e.tt(t, n, r, i),
    $i = `WORD`,
    ea = `UWORD`,
    ta = `ASCIINUMERICAL`,
    na = `ALPHANUMERICAL`,
    ra = `LOCALHOST`,
    ia = `TLD`,
    aa = `UTLD`,
    oa = `SCHEME`,
    I = `SLASH_SCHEME`,
    L = `NUM`,
    R = `WS`,
    sa = `NL`,
    ca = `OPENBRACE`,
    la = `CLOSEBRACE`,
    ua = `OPENBRACKET`,
    da = `CLOSEBRACKET`,
    fa = `OPENPAREN`,
    pa = `CLOSEPAREN`,
    ma = `OPENANGLEBRACKET`,
    ha = `CLOSEANGLEBRACKET`,
    ga = `FULLWIDTHLEFTPAREN`,
    _a = `FULLWIDTHRIGHTPAREN`,
    va = `LEFTCORNERBRACKET`,
    ya = `RIGHTCORNERBRACKET`,
    ba = `LEFTWHITECORNERBRACKET`,
    xa = `RIGHTWHITECORNERBRACKET`,
    Sa = `FULLWIDTHLESSTHAN`,
    Ca = `FULLWIDTHGREATERTHAN`,
    wa = `AMPERSAND`,
    Ta = `APOSTROPHE`,
    Ea = `ASTERISK`,
    z = `AT`,
    Da = `BACKSLASH`,
    Oa = `BACKTICK`,
    ka = `CARET`,
    Aa = `COLON`,
    ja = `COMMA`,
    B = `DOLLAR`,
    Ma = `DOT`,
    Na = `EQUALS`,
    Pa = `EXCLAMATION`,
    Fa = `HYPHEN`,
    Ia = `PERCENT`,
    La = `PIPE`,
    Ra = `PLUS`,
    za = `POUND`,
    Ba = `QUERY`,
    Va = `QUOTE`,
    Ha = `FULLWIDTHMIDDLEDOT`,
    Ua = `SEMI`,
    Wa = `SLASH`,
    Ga = `TILDE`,
    Ka = `UNDERSCORE`,
    qa = `EMOJI`,
    Ja = `SYM`,
    Ya = Object.freeze({
        __proto__: null,
        ALPHANUMERICAL: na,
        AMPERSAND: wa,
        APOSTROPHE: Ta,
        ASCIINUMERICAL: ta,
        ASTERISK: Ea,
        AT: z,
        BACKSLASH: Da,
        BACKTICK: Oa,
        CARET: ka,
        CLOSEANGLEBRACKET: ha,
        CLOSEBRACE: la,
        CLOSEBRACKET: da,
        CLOSEPAREN: pa,
        COLON: Aa,
        COMMA: ja,
        DOLLAR: B,
        DOT: Ma,
        EMOJI: qa,
        EQUALS: Na,
        EXCLAMATION: Pa,
        FULLWIDTHGREATERTHAN: Ca,
        FULLWIDTHLEFTPAREN: ga,
        FULLWIDTHLESSTHAN: Sa,
        FULLWIDTHMIDDLEDOT: Ha,
        FULLWIDTHRIGHTPAREN: _a,
        HYPHEN: Fa,
        LEFTCORNERBRACKET: va,
        LEFTWHITECORNERBRACKET: ba,
        LOCALHOST: ra,
        NL: sa,
        NUM: L,
        OPENANGLEBRACKET: ma,
        OPENBRACE: ca,
        OPENBRACKET: ua,
        OPENPAREN: fa,
        PERCENT: Ia,
        PIPE: La,
        PLUS: Ra,
        POUND: za,
        QUERY: Ba,
        QUOTE: Va,
        RIGHTCORNERBRACKET: ya,
        RIGHTWHITECORNERBRACKET: xa,
        SCHEME: oa,
        SEMI: Ua,
        SLASH: Wa,
        SLASH_SCHEME: I,
        SYM: Ja,
        TILDE: Ga,
        TLD: ia,
        UNDERSCORE: Ka,
        UTLD: aa,
        UWORD: ea,
        WORD: $i,
        WS: R,
    }),
    Xa = /[a-z]/,
    Za = /\p{L}/u,
    Qa = /\p{Emoji}/u,
    $a = /\d/,
    eo = /\s/,
    to = `\r`,
    no = `
`,
    ro = `️`,
    io = `‍`,
    ao = `￼`,
    oo = null,
    so = null;
function co(e = []) {
    let t = {};
    Zi.groups = t;
    let n = new Zi();
    ((oo ??= po(Ii)),
        (so ??= po(Li)),
        F(n, `'`, Ta),
        F(n, `{`, ca),
        F(n, `}`, la),
        F(n, `[`, ua),
        F(n, `]`, da),
        F(n, `(`, fa),
        F(n, `)`, pa),
        F(n, `<`, ma),
        F(n, `>`, ha),
        F(n, `（`, ga),
        F(n, `）`, _a),
        F(n, `「`, va),
        F(n, `」`, ya),
        F(n, `『`, ba),
        F(n, `』`, xa),
        F(n, `＜`, Sa),
        F(n, `＞`, Ca),
        F(n, `&`, wa),
        F(n, `*`, Ea),
        F(n, `@`, z),
        F(n, '`', Oa),
        F(n, `^`, ka),
        F(n, `:`, Aa),
        F(n, `,`, ja),
        F(n, `$`, B),
        F(n, `.`, Ma),
        F(n, `=`, Na),
        F(n, `!`, Pa),
        F(n, `-`, Fa),
        F(n, `%`, Ia),
        F(n, `|`, La),
        F(n, `+`, Ra),
        F(n, `#`, za),
        F(n, `?`, Ba),
        F(n, `"`, Va),
        F(n, `/`, Wa),
        F(n, `;`, Ua),
        F(n, `~`, Ga),
        F(n, `_`, Ka),
        F(n, `\\`, Da),
        F(n, `・`, Ha));
    let r = P(n, $a, L, { [Ri]: !0 });
    P(r, $a, r);
    let i = P(r, Xa, ta, { [Vi]: !0 }),
        a = P(r, Za, na, { [Hi]: !0 }),
        o = P(n, Xa, $i, { [zi]: !0 });
    (P(o, $a, i), P(o, Xa, o), P(i, $a, i), P(i, Xa, i));
    let s = P(n, Za, ea, { [Bi]: !0 });
    (P(s, Xa), P(s, $a, a), P(s, Za, s), P(a, $a, a), P(a, Xa), P(a, Za, a));
    let c = F(n, no, sa, { [qi]: !0 }),
        l = F(n, to, R, { [qi]: !0 }),
        u = P(n, eo, R, { [qi]: !0 });
    (F(n, ao, u),
        F(l, no, c),
        F(l, ao, u),
        P(l, eo, u),
        F(u, to),
        F(u, no),
        P(u, eo, u),
        F(u, ao, u));
    let d = P(n, Qa, qa, { [Wi]: !0 });
    (F(d, `#`), P(d, Qa, d), F(d, ro, d));
    let f = F(d, io);
    (F(f, `#`), P(f, Qa, d));
    let p = [
            [Xa, o],
            [$a, i],
        ],
        m = [
            [Xa, null],
            [Za, s],
            [$a, a],
        ];
    for (let e = 0; e < oo.length; e++) fo(n, oo[e], ia, $i, p);
    for (let e = 0; e < so.length; e++) fo(n, so[e], aa, ea, m);
    (Yi(ia, { tld: !0, ascii: !0 }, t),
        Yi(aa, { utld: !0, alpha: !0 }, t),
        fo(n, `file`, oa, $i, p),
        fo(n, `mailto`, oa, $i, p),
        fo(n, `http`, I, $i, p),
        fo(n, `https`, I, $i, p),
        fo(n, `ftp`, I, $i, p),
        fo(n, `ftps`, I, $i, p),
        Yi(oa, { scheme: !0, ascii: !0 }, t),
        Yi(I, { slashscheme: !0, ascii: !0 }, t),
        (e = e.sort((e, t) => (e[0] > t[0] ? 1 : -1))));
    for (let t = 0; t < e.length; t++) {
        let r = e[t][0],
            i = e[t][1] ? { [Gi]: !0 } : { [Ki]: !0 };
        (r.indexOf(`-`) >= 0
            ? (i[Ui] = !0)
            : Xa.test(r)
              ? $a.test(r)
                  ? (i[Vi] = !0)
                  : (i[zi] = !0)
              : (i[Ri] = !0),
            Qi(n, r, r, i));
    }
    return (
        Qi(n, `localhost`, ra, { ascii: !0 }),
        (n.jd = new Zi(Ja)),
        { start: n, tokens: Object.assign({ groups: t }, Ya) }
    );
}
function lo(e, t) {
    let n = uo(t.replace(/[A-Z]/g, (e) => e.toLowerCase())),
        r = n.length,
        i = [],
        a = 0,
        o = 0;
    for (; o < r;) {
        let s = e,
            c = null,
            l = 0,
            u = null,
            d = -1,
            f = -1;
        for (; o < r && (c = s.go(n[o]));)
            ((s = c),
                s.accepts()
                    ? ((d = 0), (f = 0), (u = s))
                    : d >= 0 && ((d += n[o].length), f++),
                (l += n[o].length),
                (a += n[o].length),
                o++);
        ((a -= d),
            (o -= f),
            (l -= d),
            i.push({ t: u.t, v: t.slice(a - l, a), s: a - l, e: a }));
    }
    return i;
}
function uo(e) {
    let t = [],
        n = e.length,
        r = 0;
    for (; r < n;) {
        let i = e.charCodeAt(r),
            a,
            o =
                i < 55296 ||
                i > 56319 ||
                r + 1 === n ||
                (a = e.charCodeAt(r + 1)) < 56320 ||
                a > 57343
                    ? e[r]
                    : e.slice(r, r + 2);
        (t.push(o), (r += o.length));
    }
    return t;
}
function fo(e, t, n, r, i) {
    let a,
        o = t.length;
    for (let n = 0; n < o - 1; n++) {
        let o = t[n];
        (e.j[o] ? (a = e.j[o]) : ((a = new Zi(r)), (a.jr = i.slice()), (e.j[o] = a)),
            (e = a));
    }
    return ((a = new Zi(n)), (a.jr = i.slice()), (e.j[t[o - 1]] = a), a);
}
function po(e) {
    let t = [],
        n = [],
        r = 0;
    for (; r < e.length;) {
        let i = 0;
        for (; `0123456789`.indexOf(e[r + i]) >= 0;) i++;
        if (i > 0) {
            t.push(n.join(``));
            for (let t = parseInt(e.substring(r, r + i), 10); t > 0; t--) n.pop();
            r += i;
        } else (n.push(e[r]), r++);
    }
    return t;
}
var mo = {
    defaultProtocol: `http`,
    events: null,
    format: go,
    formatHref: go,
    nl2br: !1,
    tagName: `a`,
    target: null,
    rel: null,
    validate: !0,
    truncate: 1 / 0,
    className: null,
    attributes: null,
    ignoreTags: [],
    render: null,
};
function ho(e, t = null) {
    let n = Object.assign({}, mo);
    e && (n = Object.assign(n, e instanceof ho ? e.o : e));
    let r = n.ignoreTags,
        i = [];
    for (let e = 0; e < r.length; e++) i.push(r[e].toUpperCase());
    ((this.o = n), t && (this.defaultRender = t), (this.ignoreTags = i));
}
ho.prototype = {
    o: mo,
    ignoreTags: [],
    defaultRender(e) {
        return e;
    },
    check(e) {
        return this.get(`validate`, e.toString(), e);
    },
    get(e, t, n) {
        let r = t != null,
            i = this.o[e];
        return (
            i &&
            (typeof i == `object`
                ? ((i = n.t in i ? i[n.t] : mo[e]),
                  typeof i == `function` && r && (i = i(t, n)))
                : typeof i == `function` && r && (i = i(t, n.t, n)),
            i)
        );
    },
    getObj(e, t, n) {
        let r = this.o[e];
        return (typeof r == `function` && t != null && (r = r(t, n.t, n)), r);
    },
    render(e) {
        let t = e.render(this);
        return (this.get(`render`, null, e) || this.defaultRender)(t, e.t, e);
    },
};
function go(e) {
    return e;
}
function _o(e, t) {
    ((this.t = `token`), (this.v = e), (this.tk = t));
}
_o.prototype = {
    isLink: !1,
    toString() {
        return this.v;
    },
    toHref(e) {
        return this.toString();
    },
    toFormattedString(e) {
        let t = this.toString(),
            n = e.get(`truncate`, t, this),
            r = e.get(`format`, t, this);
        return n && r.length > n ? r.substring(0, n) + `…` : r;
    },
    toFormattedHref(e) {
        return e.get(`formatHref`, this.toHref(e.get(`defaultProtocol`)), this);
    },
    startIndex() {
        return this.tk[0].s;
    },
    endIndex() {
        return this.tk[this.tk.length - 1].e;
    },
    toObject(e = mo.defaultProtocol) {
        return {
            type: this.t,
            value: this.toString(),
            isLink: this.isLink,
            href: this.toHref(e),
            start: this.startIndex(),
            end: this.endIndex(),
        };
    },
    toFormattedObject(e) {
        return {
            type: this.t,
            value: this.toFormattedString(e),
            isLink: this.isLink,
            href: this.toFormattedHref(e),
            start: this.startIndex(),
            end: this.endIndex(),
        };
    },
    validate(e) {
        return e.get(`validate`, this.toString(), this);
    },
    render(e) {
        let t = this,
            n = this.toHref(e.get(`defaultProtocol`)),
            r = e.get(`formatHref`, n, this),
            i = e.get(`tagName`, n, t),
            a = this.toFormattedString(e),
            o = {},
            s = e.get(`className`, n, t),
            c = e.get(`target`, n, t),
            l = e.get(`rel`, n, t),
            u = e.getObj(`attributes`, n, t),
            d = e.getObj(`events`, n, t);
        return (
            (o.href = r),
            s && (o.class = s),
            c && (o.target = c),
            l && (o.rel = l),
            u && Object.assign(o, u),
            { tagName: i, attributes: o, content: a, eventListeners: d }
        );
    },
};
function vo(e, t) {
    class n extends _o {
        constructor(t, n) {
            (super(t, n), (this.t = e));
        }
    }
    for (let e in t) n.prototype[e] = t[e];
    return ((n.t = e), n);
}
var yo = vo(`email`, {
        isLink: !0,
        toHref() {
            return `mailto:` + this.toString();
        },
    }),
    bo = vo(`text`),
    xo = vo(`nl`),
    So = vo(`url`, {
        isLink: !0,
        toHref(e = mo.defaultProtocol) {
            return this.hasProtocol() ? this.v : `${e}://${this.v}`;
        },
        hasProtocol() {
            let e = this.tk;
            return e.length >= 2 && e[0].t !== ra && e[1].t === Aa;
        },
    }),
    Co = (e) => new Zi(e);
function wo({ groups: e }) {
    let t = e.domain.concat([
            wa,
            Ea,
            z,
            Da,
            Oa,
            ka,
            B,
            Na,
            Fa,
            L,
            Ia,
            La,
            Ra,
            za,
            Wa,
            Ja,
            Ga,
            Ka,
        ]),
        n = [
            Ta,
            Aa,
            ja,
            Ma,
            Pa,
            Ia,
            Ba,
            Va,
            Ua,
            ma,
            ha,
            ca,
            la,
            da,
            ua,
            fa,
            pa,
            ga,
            _a,
            va,
            ya,
            ba,
            xa,
            Sa,
            Ca,
        ],
        r = [
            wa,
            Ta,
            Ea,
            Da,
            Oa,
            ka,
            B,
            Na,
            Fa,
            ca,
            la,
            Ia,
            La,
            Ra,
            za,
            Ba,
            Wa,
            Ja,
            Ga,
            Ka,
        ],
        i = Co(),
        a = F(i, Ga);
    (N(a, r, a), N(a, e.domain, a));
    let o = Co(),
        s = Co(),
        c = Co();
    (N(i, e.domain, o),
        N(i, e.scheme, s),
        N(i, e.slashscheme, c),
        N(o, r, a),
        N(o, e.domain, o));
    let l = F(o, z);
    (F(a, z, l), F(s, z, l), F(c, z, l));
    let u = F(a, Ma);
    (N(u, r, a), N(u, e.domain, a));
    let d = Co();
    (N(l, e.domain, d), N(d, e.domain, d));
    let f = F(d, Ma);
    N(f, e.domain, d);
    let p = Co(yo);
    (N(f, e.tld, p), N(f, e.utld, p), F(l, ra, p));
    let m = F(d, Fa);
    (F(m, Fa, m), N(m, e.domain, d), N(p, e.domain, d), F(p, Ma, f), F(p, Fa, m));
    let h = F(o, Fa),
        g = F(o, Ma);
    (F(h, Fa, h), N(h, e.domain, o), N(g, r, a), N(g, e.domain, o));
    let _ = Co(So);
    (N(g, e.tld, _),
        N(g, e.utld, _),
        N(_, e.domain, o),
        N(_, r, a),
        F(_, Ma, g),
        F(_, Fa, h),
        F(_, z, l));
    let v = F(_, Aa),
        y = Co(So);
    N(v, e.numeric, y);
    let b = Co(So),
        ee = Co();
    (N(b, t, b), N(b, n, ee), N(ee, t, b), N(ee, n, ee), F(_, Wa, b), F(y, Wa, b));
    let te = F(s, Aa),
        ne = F(F(F(c, Aa), Wa), Wa);
    (N(s, e.domain, o),
        F(s, Ma, g),
        F(s, Fa, h),
        N(c, e.domain, o),
        F(c, Ma, g),
        F(c, Fa, h),
        N(te, e.domain, b),
        F(te, Wa, b),
        F(te, Ba, b),
        N(ne, e.domain, b),
        N(ne, t, b),
        F(ne, Wa, b));
    let re = [
        [ca, la],
        [ua, da],
        [fa, pa],
        [ma, ha],
        [ga, _a],
        [va, ya],
        [ba, xa],
        [Sa, Ca],
    ];
    for (let e = 0; e < re.length; e++) {
        let [r, i] = re[e],
            a = F(b, r);
        F(ee, r, a);
        let o = Co(So);
        N(a, t, o);
        let s = Co();
        (N(a, n, s),
            F(a, i, b),
            N(o, t, o),
            N(o, n, s),
            N(s, t, o),
            N(s, n, s),
            F(o, i, b),
            F(s, i, b));
    }
    return (F(i, ra, _), F(i, sa, xo), { start: i, tokens: Ya });
}
function To(e, t, n) {
    let r = n.length,
        i = 0,
        a = [],
        o = [];
    for (; i < r;) {
        let s = e,
            c = null,
            l = null,
            u = 0,
            d = null,
            f = -1;
        for (; i < r && !(c = s.go(n[i].t));) o.push(n[i++]);
        for (; i < r && (l = c || s.go(n[i].t));)
            ((c = null),
                (s = l),
                s.accepts() ? ((f = 0), (d = s)) : f >= 0 && f++,
                i++,
                u++);
        if (f < 0) ((i -= u), i < r && (o.push(n[i]), i++));
        else {
            (o.length > 0 && (a.push(Eo(bo, t, o)), (o = [])), (i -= f), (u -= f));
            let e = d.t,
                r = n.slice(i - u, i);
            a.push(Eo(e, t, r));
        }
    }
    return (o.length > 0 && a.push(Eo(bo, t, o)), a);
}
function Eo(e, t, n) {
    let r = n[0].s,
        i = n[n.length - 1].e;
    return new e(t.slice(r, i), n);
}
var Do = {
    scanner: null,
    parser: null,
    tokenQueue: [],
    pluginQueue: [],
    customSchemes: [],
    initialized: !1,
};
function Oo() {
    Do.scanner = co(Do.customSchemes);
    for (let e = 0; e < Do.tokenQueue.length; e++)
        Do.tokenQueue[e][1]({ scanner: Do.scanner });
    Do.parser = wo(Do.scanner.tokens);
    for (let e = 0; e < Do.pluginQueue.length; e++)
        Do.pluginQueue[e][1]({ scanner: Do.scanner, parser: Do.parser });
    return ((Do.initialized = !0), Do);
}
function ko(e) {
    return (Do.initialized || Oo(), To(Do.parser.start, e, lo(Do.scanner.start, e)));
}
ko.scan = lo;
function Ao(e, t = null, n = null) {
    if (t && typeof t == `object`) {
        if (n) throw Error(`linkifyjs: Invalid link type ${t}; must be a string`);
        ((n = t), (t = null));
    }
    let r = new ho(n),
        i = ko(e),
        a = [];
    for (let e = 0; e < i.length; e++) {
        let n = i[e];
        n.isLink && (!t || n.t === t) && r.check(n) && a.push(n.toFormattedObject(r));
    }
    return a;
}
var jo = /(^|[\s,.:;?!"'()+@~%-])(#+[^\x00\x07\r\n\s,:]*[a-z][^\x00\x07\r\n\s,:]*)/gi,
    Mo =
        /(^|[^&\w])(#[0-9a-f]{6})(?!\w)|(rgba?\((?:\s*\d+\s*,){2}\s*\d+\s*(?:,\s*[\d.]+\s*)?\))/gi,
    No = /(^|\s)(```|`)([^`].*?)\2/g;
function Po(e) {
    let t = [];
    for (let n of e.matchAll(Mo)) {
        let e = n[2] ?? n[3],
            r = n.index + (n[2] ? n[1].length : 0);
        t.push({
            start: r,
            end: r + e.length,
            token: { type: `color`, text: e, color: e },
        });
    }
    for (let n of e.matchAll(jo)) {
        let e = n.index + n[1].length,
            r = e + n[2].length;
        t.some((t) => e < t.end && r > t.start) ||
            t.push({ start: e, end: r, token: { type: `channel`, text: n[2] } });
    }
    return t;
}
function Fo(e, t) {
    t.sort((e, t) => e.start - t.start);
    let n = [],
        r = 0;
    for (let i of t)
        i.start < r ||
            (i.start > r && n.push({ type: `text`, text: e.substring(r, i.start) }),
            n.push(i.token),
            (r = i.end));
    return (r < e.length && n.push({ type: `text`, text: e.substring(r) }), n);
}
function Io(e, t) {
    let n = [];
    if (t)
        for (let t of Ao(e))
            t.type === `url` &&
                n.push({
                    start: t.start,
                    end: t.end,
                    token: { type: `url`, text: t.value, href: t.href },
                });
    let r = 0,
        i = [...n].sort((e, t) => e.start - t.start);
    for (let t of [...i, { start: e.length, end: e.length }]) {
        let i = e.substring(r, t.start);
        for (let e of Po(i)) n.push({ ...e, start: e.start + r, end: e.end + r });
        r = t.end;
    }
    return Fo(e, n);
}
function Lo(e, t = !0) {
    let n = [],
        r = 0;
    for (let i of e.matchAll(No)) {
        let a = i.index + i[1].length;
        (a > r && n.push(...Io(e.substring(r, a), t)),
            n.push({ type: `code`, text: i[3], fence: i[2] }),
            (r = a + i[2].length * 2 + i[3].length));
    }
    return (r < e.length && n.push(...Io(e.substring(r), t)), n);
}
var Ro = `%H:%M:%S`,
    zo = (e, t = 2, n = `0`) => String(e).padStart(t, n),
    Bo = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`],
    Vo = [
        `January`,
        `February`,
        `March`,
        `April`,
        `May`,
        `June`,
        `July`,
        `August`,
        `September`,
        `October`,
        `November`,
        `December`,
    ],
    Ho = (e) => e.getHours() % 12 || 12;
function V(e, t) {
    switch (e) {
        case `H`:
            return zo(t.getHours());
        case `k`:
            return zo(t.getHours(), 2, ` `);
        case `I`:
            return zo(Ho(t));
        case `l`:
            return zo(Ho(t), 2, ` `);
        case `M`:
            return zo(t.getMinutes());
        case `S`:
            return zo(t.getSeconds());
        case `p`:
            return t.getHours() < 12 ? `AM` : `PM`;
        case `P`:
            return t.getHours() < 12 ? `am` : `pm`;
        case `d`:
            return zo(t.getDate());
        case `e`:
            return zo(t.getDate(), 2, ` `);
        case `m`:
            return zo(t.getMonth() + 1);
        case `y`:
            return zo(t.getFullYear() % 100);
        case `Y`:
            return String(t.getFullYear());
        case `a`:
            return Bo[t.getDay()].substring(0, 3);
        case `A`:
            return Bo[t.getDay()];
        case `b`:
        case `h`:
            return Vo[t.getMonth()].substring(0, 3);
        case `B`:
            return Vo[t.getMonth()];
        case `s`:
            return String(Math.floor(t.getTime() / 1e3));
        default:
            return null;
    }
}
var H = { T: `%H:%M:%S`, R: `%H:%M`, r: `%I:%M:%S %p`, D: `%m/%d/%y`, F: `%Y-%m-%d` };
function Uo(e, t = Ro) {
    let n = (t || `%H:%M:%S`).replace(/\$\{[^}]*\}/g, ``);
    n = n.replace(/%([TRrDF])/g, (e, t) => H[t]);
    let r = [],
        i = (e, t) => {
            if (e === ``) return;
            let n = r[r.length - 1];
            n && n.delimiter === t ? (n.text += e) : r.push({ text: e, delimiter: t });
        };
    for (let t = 0; t < n.length; t++) {
        let r = n[t];
        if (r !== `%` || t === n.length - 1) {
            i(r, !0);
            continue;
        }
        let a = n[++t];
        if (a === `%`) i(`%`, !0);
        else if (a === `.` && /\d/.test(n[t + 1] ?? ``)) {
            let r = parseInt(n[++t], 10);
            i(zo(e.getMilliseconds(), 3).padEnd(6, `0`).substring(0, r), !1);
        } else {
            let t = V(a, e);
            i(t ?? `%` + a, t === null);
        }
    }
    return r;
}
var Wo = `modulepreload`,
    Go = function (e, t) {
        return new URL(e, t).href;
    },
    Ko = {},
    qo = function (e) {
        return e.pathname.endsWith(`.css`);
    },
    Jo = function (e, t, n) {
        let r = Promise.resolve();
        if (t && t.length > 0) {
            let e,
                i = document.querySelector(`meta[property=csp-nonce]`),
                a = i?.nonce || i?.getAttribute(`nonce`);
            function o(e) {
                return Promise.all(
                    e.map((e) =>
                        Promise.resolve(e).then(
                            (e) => ({ status: `fulfilled`, value: e }),
                            (e) => ({ status: `rejected`, reason: e }),
                        ),
                    ),
                );
            }
            function s(e) {
                return import.meta.resolve
                    ? new URL(import.meta.resolve(e))
                    : new URL(e, import.meta.url);
            }
            r = o(
                t
                    .map((t) => {
                        t = Go(t, n);
                        let r = s(t);
                        if (r.href in Ko) return;
                        Ko[r.href] = !0;
                        let i = qo(r);
                        if (e === void 0) {
                            e = { all: new Set(), styles: new Set() };
                            let t = document.getElementsByTagName(`link`);
                            for (let n = t.length - 1; n >= 0; n--) {
                                let r = t[n];
                                (e.all.add(r.href),
                                    r.rel === `stylesheet` && e.styles.add(r.href));
                            }
                        }
                        if ((i ? e.styles : e.all).has(r.href)) return;
                        let o = document.createElement(`link`);
                        if (
                            ((o.rel = i ? `stylesheet` : Wo),
                            i || (o.as = `script`),
                            (o.crossOrigin = ``),
                            (o.href = r.href),
                            a && o.setAttribute(`nonce`, a),
                            document.head.appendChild(o),
                            i)
                        )
                            return new Promise((e, t) => {
                                (o.addEventListener(`load`, e),
                                    o.addEventListener(`error`, () =>
                                        t(Error(`Unable to preload CSS for ${r}`)),
                                    ));
                            });
                    })
                    .filter((e) => e !== void 0),
            );
        }
        function i(e) {
            let t = new Event(`vite:preloadError`, { cancelable: !0 });
            if (((t.payload = e), window.dispatchEvent(t), !t.defaultPrevented))
                throw e;
        }
        return r.then((t) => {
            for (let e of t || []) e.status === `rejected` && i(e.reason);
            return e().catch(i);
        });
    };
function Yo(e, t, n) {
    switch (e.type) {
        case `url`:
            return (0, j.jsx)(
                `a`,
                {
                    href: e.href,
                    target: `_blank`,
                    rel: `noopener noreferrer`,
                    children: e.text,
                },
                t,
            );
        case `channel`:
            return n
                ? (0, j.jsx)(
                      `a`,
                      {
                          href: `#`,
                          onClick: (t) => {
                              (t.preventDefault(), n(e.text));
                          },
                          children: e.text,
                      },
                      t,
                  )
                : e.text;
        case `color`:
            return (0, j.jsxs)(
                b.Fragment,
                {
                    children: [
                        e.text,
                        ` `,
                        (0, j.jsx)(`span`, {
                            className: `colourbox`,
                            style: { backgroundColor: e.color },
                        }),
                    ],
                },
                t,
            );
        case `code`:
            return (0, j.jsxs)(
                b.Fragment,
                {
                    children: [
                        (0, j.jsx)(`span`, {
                            className: `hidden-bracket`,
                            children: e.fence,
                        }),
                        (0, j.jsx)(`code`, { children: e.text }),
                        (0, j.jsx)(`span`, {
                            className: `hidden-bracket`,
                            children: e.fence,
                        }),
                    ],
                },
                t,
            );
        default:
            return e.text;
    }
}
function Xo({ parts: e, links: t = !0, onChannel: n, math: r = !1, maxLength: i }) {
    return (0, j.jsx)(j.Fragment, {
        children: e.map((e, a) => {
            let o = e.text;
            i !== void 0 && o.length > i && (o = o.substring(0, i) + `+`);
            let s = t && !e.classes.includes(`cof-chat_host`);
            return (0, j.jsx)(
                `span`,
                {
                    className: e.classes.join(` `),
                    dir: `auto`,
                    children:
                        r && Qo(o)
                            ? (0, j.jsx)(ts, { text: o })
                            : Lo(o, s).map((e, t) => Yo(e, t, n)),
                },
                a,
            );
        }),
    });
}
var Zo = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)/g,
    Qo = (e) => e.includes(`$$`) || e.includes(`\\[`) || e.includes(`\\(`),
    $o = null;
function es() {
    return (
        ($o ??= Promise.all([
            Jo(() => import(`./katex-C6KMj_Gt.js`), [], import.meta.url),
            Jo(() => Promise.resolve({}), __vite__mapDeps([0]), import.meta.url),
        ]).then(([e]) => e.default)),
        $o
    );
}
function ts({ text: e }) {
    let [t, n] = (0, b.useState)(null);
    if (
        ((0, b.useEffect)(() => {
            let e = !1;
            return (
                es().then((t) => {
                    e || n(() => t);
                }),
                () => {
                    e = !0;
                }
            );
        }, []),
        !t)
    )
        return (0, j.jsx)(j.Fragment, { children: e });
    let r = [],
        i = 0;
    for (let n of e.matchAll(Zo)) {
        n.index > i && r.push(e.substring(i, n.index));
        let a = n[1] ?? n[2] ?? n[3],
            o = t.renderToString(a, {
                displayMode: n[2] !== void 0,
                throwOnError: !1,
                trust: !1,
            });
        (r.push(
            (0, j.jsx)(`span`, { dangerouslySetInnerHTML: { __html: o } }, n.index),
        ),
            (i = n.index + n[0].length));
    }
    return (
        i < e.length && r.push(e.substring(i)),
        (0, j.jsx)(j.Fragment, { children: r })
    );
}
function ns({ date: e, format: t }) {
    return (0, j.jsx)(j.Fragment, {
        children: Uo(e, t).map((e, t) =>
            (0, j.jsx)(
                `span`,
                {
                    className: e.delimiter
                        ? `cof-chat_time_delimiters cob-chat_time_delimiters coa-chat_time_delimiters`
                        : `cof-chat_time cob-chat_time coa-chat_time`,
                    children: e.text,
                },
                t,
            ),
        ),
    });
}
var rs = 60;
function is() {
    let e = Ci.getState();
    e.nicklistOpen
        ? A({ nicklistOpen: !1 })
        : e.sidebarOpen || (A({ sidebarOpen: !0 }), document.activeElement?.blur());
}
function as() {
    if (Ci.getState().sidebarOpen) {
        A({ sidebarOpen: !1 });
        return;
    }
    let e = k.state,
        t = e.activeBufferId === null ? void 0 : e.buffers[e.activeBufferId];
    t?.hasNicklist && Object.keys(t.nicks).length > 0 && A({ nicklistOpen: !0 });
}
function os() {
    let e = (0, b.useRef)(null);
    return {
        onTouchStart: (t) => {
            let n = t.touches[0];
            e.current = n ? { x: n.clientX, y: n.clientY } : null;
        },
        onTouchEnd: (t) => {
            let n = t.changedTouches[0],
                r = e.current;
            if (((e.current = null), !n || !r || !vi())) return;
            let i = n.clientX - r.x,
                a = n.clientY - r.y;
            Math.abs(i) < rs || Math.abs(i) < 2 * Math.abs(a) || (i > 0 ? is() : as());
        },
    };
}
var ss = (e) => `${e.getHours()}:${e.getMinutes()}`,
    cs = (0, b.memo)(function ({
        line: e,
        previous: t,
        bufferId: n,
        timeFormat: r,
        math: i,
    }) {
        let a = t !== void 0 && ss(t.date) === ss(e.date),
            o = t !== void 0 && t.prefixText === e.prefixText,
            s = e.prefix[e.prefix.length - 1]?.text ?? ``;
        return (0, j.jsxs)(`tr`, {
            className: `bufferline${e.highlight ? ` line-highlight` : ``}`,
            children: [
                (0, j.jsx)(`td`, {
                    className: `time`,
                    children: (0, j.jsx)(`span`, {
                        className: `date${a ? ` repeated-time` : ``}`,
                        children: (0, j.jsx)(ns, { date: e.date, format: r }),
                    }),
                }),
                (0, j.jsx)(`td`, {
                    className: `prefix`,
                    children: (0, j.jsx)(`span`, {
                        className: o ? `repeated-prefix` : void 0,
                        children: (0, j.jsxs)(`a`, {
                            onClick: () => {
                                if (e.isMessage && s) {
                                    let e = k.state.buffers[n];
                                    (e?.type === `channel` &&
                                        !Object.values(e.nicks).some(
                                            (e) => e.name === s,
                                        ) &&
                                        ls(`${s} has left the room`),
                                        Pi(s));
                                }
                            },
                            children: [
                                e.isMessage &&
                                    (0, j.jsx)(`span`, {
                                        className: `hidden-bracket`,
                                        children: `<`,
                                    }),
                                (0, j.jsx)(Xo, {
                                    parts: e.prefix,
                                    links: !1,
                                    maxLength: 25,
                                }),
                                e.isMessage &&
                                    (0, j.jsx)(`span`, {
                                        className: `hidden-bracket`,
                                        children: `>`,
                                    }),
                            ],
                        }),
                    }),
                }),
                (0, j.jsx)(`td`, {
                    className: `message`,
                    children: (0, j.jsx)(Xo, {
                        parts: e.content,
                        onChannel: (e) => k.openQuery(n, e),
                        math: i,
                    }),
                }),
            ],
        });
    });
function ls(e) {
    let t = document.createElement(`div`);
    ((t.className = `gb-toast gb-toast-short`),
        (t.textContent = e),
        document.body.appendChild(t),
        setTimeout(() => t.remove(), 5e3));
}
function us({ buffer: e }) {
    let t = xi((e) => e.options[`weechat.look.buffer_time_format`] ?? `%H:%M:%S`),
        n = ti((e) => e.enableMathjax),
        r = [];
    for (let i = 0; i < e.lines.length; i++) {
        let a = e.lines[i];
        r.push(
            (0, j.jsxs)(
                `tbody`,
                {
                    children: [
                        (0, j.jsx)(cs, {
                            line: a,
                            previous: e.lines[i - 1],
                            bufferId: e.id,
                            timeFormat: t,
                            math: n,
                        }),
                        e.lastReadKey === a.key &&
                            i < e.lines.length - 1 &&
                            (0, j.jsx)(`tr`, {
                                className: `readmarker`,
                                children: (0, j.jsx)(`td`, {
                                    colSpan: 3,
                                    children: (0, j.jsx)(`hr`, { id: `readmarker` }),
                                }),
                            }),
                    ],
                },
                a.key,
            ),
        );
    }
    return (0, j.jsx)(j.Fragment, { children: r });
}
function ds() {
    let e = Si(),
        t = xi((e) => e.loadingLines),
        n = (0, b.useRef)(null),
        r = (0, b.useRef)(!0),
        i = (0, b.useRef)({ bufferId: -1, firstKey: ``, height: 0 }),
        a = os(),
        o = (0, b.useCallback)(() => {
            let e = n.current;
            e && (e.scrollTop = e.scrollHeight);
        }, []);
    ((0, b.useLayoutEffect)(() => {
        let t = n.current;
        if (!t || !e) return;
        let a = i.current,
            o = e.lines[0]?.key ?? ``;
        if (a.bufferId !== e.id) {
            let e = t.querySelector(`.readmarker`);
            t.scrollTop = e
                ? Math.max(0, e.offsetTop - t.clientHeight / 3)
                : t.scrollHeight;
        } else
            o !== a.firstKey && !r.current
                ? (t.scrollTop += t.scrollHeight - a.height)
                : r.current && (t.scrollTop = t.scrollHeight);
        ((r.current = t.scrollHeight - t.scrollTop - t.clientHeight < 4),
            (i.current = { bufferId: e.id, firstKey: o, height: t.scrollHeight }));
    }, [e]),
        (0, b.useEffect)(() => {
            let e = () => {
                r.current && requestAnimationFrame(o);
            };
            return (
                bi.add(e),
                window.addEventListener(`resize`, e),
                () => {
                    (bi.delete(e), window.removeEventListener(`resize`, e));
                }
            );
        }, [o]));
    let s = (0, b.useCallback)(() => {
            let t = k.state;
            e && !t.loadingLines && !e.allLinesFetched && k.fetchLines(e.id);
        }, [e]),
        c = () => {
            let e = n.current;
            e &&
                ((r.current = e.scrollHeight - e.scrollTop - e.clientHeight < 4),
                (i.current.height = e.scrollHeight),
                e.scrollTop < 50 && s());
        };
    if (!e)
        return (0, j.jsx)(`main`, { id: `bufferlines`, className: `favorite-font` });
    let l = [`favorite-font`];
    return (
        e.hideTime && l.push(`hideTime`),
        e.hidePrefix && l.push(`hidePrefix`),
        e.free && l.push(`freeBuffer`),
        (0, j.jsxs)(`main`, {
            id: `bufferlines`,
            className: l.join(` `),
            ref: n,
            onScroll: c,
            ...a,
            children: [
                (0, j.jsxs)(`table`, {
                    children: [
                        (0, j.jsx)(`tbody`, {
                            children: (0, j.jsx)(`tr`, {
                                className: `bufferline fetch-more`,
                                children:
                                    !e.allLinesFetched &&
                                    (0, j.jsx)(`td`, {
                                        colSpan: 3,
                                        children: t
                                            ? (0, j.jsxs)(`span`, {
                                                  className: `text-body-secondary`,
                                                  children: [
                                                      (0, j.jsx)(M, {
                                                          icon: ke,
                                                          spin: !0,
                                                      }),
                                                      ` Fetching more lines…`,
                                                  ],
                                              })
                                            : (0, j.jsxs)(`button`, {
                                                  type: `button`,
                                                  className: `fetchmorelines btn btn-sm btn-outline-secondary`,
                                                  onClick: s,
                                                  children: [
                                                      (0, j.jsx)(M, { icon: Ke }),
                                                      ` Fetch more lines`,
                                                  ],
                                              }),
                                    }),
                            }),
                        }),
                        (0, j.jsx)(us, { buffer: e }),
                    ],
                }),
                (0, j.jsx)(`span`, { id: `end-of-buffer` }),
            ],
        })
    );
}
function fs(e, t, n) {
    let r = Ci.getState();
    switch (e.key) {
        case `Escape`:
            (e.preventDefault(), A({ search: ``, searchIndex: 0 }));
            break;
        case `Enter`:
            (e.preventDefault(), t > 0 && Ai(n[Math.min(r.searchIndex, t - 1)]));
            break;
        case `ArrowUp`:
            (e.preventDefault(), A({ searchIndex: Math.max(0, r.searchIndex - 1) }));
            break;
        case `ArrowDown`:
        case `Tab`:
            (e.preventDefault(),
                A({ searchIndex: Math.min(t - 1, r.searchIndex + 1) }));
    }
}
function ps() {
    let e = xi((e) => e.buffers),
        t = xi((e) => e.activeBufferId),
        n = ti(
            mt((e) => ({ orderbyserver: e.orderbyserver, onlyUnread: e.onlyUnread })),
        ),
        r = wi(
            mt((e) => ({
                search: e.search,
                searchIndex: e.searchIndex,
                jumpMode: e.jumpMode,
                jumpDigit: e.jumpDigit,
                showQuickKeys: e.showQuickKeys,
                sidebarOpen: e.sidebarOpen,
            })),
        ),
        i = os(),
        a = Oi(e, t, n, r),
        o = a.map((e) => e.buffer.id),
        s = [`buffer-list`];
    return (
        n.orderbyserver && !r.jumpMode && s.push(`indented`),
        r.showQuickKeys && s.push(`showquickkeys`),
        r.jumpMode && s.push(`showjumpkeys`),
        (0, j.jsxs)(`nav`, {
            id: `sidebar`,
            'data-state': r.sidebarOpen ? `visible` : `hidden`,
            'aria-label': `Buffers`,
            ...i,
            children: [
                (0, j.jsx)(`form`, {
                    role: `search`,
                    className: `bufferfilter`,
                    onSubmit: (e) => e.preventDefault(),
                    children: (0, j.jsxs)(`div`, {
                        className: `search-box${r.jumpMode ? ` showjumpkeys` : ``}`,
                        children: [
                            r.jumpMode
                                ? (0, j.jsx)(`span`, {
                                      className: `search-box-jump`,
                                      children: `Jump`,
                                  })
                                : (0, j.jsx)(M, {
                                      icon: Je,
                                      className: `search-box-icon`,
                                  }),
                            (0, j.jsx)(`input`, {
                                className: `form-control form-control-sm`,
                                type: `search`,
                                id: `bufferFilter`,
                                value: r.jumpMode
                                    ? (r.jumpDigit ?? ``).toString()
                                    : r.search,
                                onChange: (e) =>
                                    A({ search: e.target.value, searchIndex: 0 }),
                                onKeyDown: (e) => fs(e, a.length, o),
                                placeholder: r.jumpMode ? `Number` : `Search buffers`,
                                autoComplete: `off`,
                                'aria-label': `Search buffers`,
                            }),
                        ],
                    }),
                }),
                (0, j.jsx)(`ul`, {
                    className: s.join(` `),
                    children: a.map(({ buffer: e, quickKey: n, jumpKey: i }, a) => {
                        let o = [`buffer`];
                        (e.id === t && o.push(`active`),
                            e.unread && o.push(`unread`),
                            e.notification && o.push(`notification`),
                            r.search && r.searchIndex === a && o.push(`highlight`),
                            (e.type === `channel` || e.type === `private`) &&
                                o.push(`indent`),
                            e.type === `server` && o.push(`server`),
                            e.type === `channel` && o.push(`channel`),
                            e.type === `private` && o.push(`private`),
                            e.channelPrefix === `#` && o.push(`channel_hash`),
                            e.channelPrefix === `+` && o.push(`channel_plus`),
                            e.channelPrefix === `&` && o.push(`channel_ampersand`));
                        let s = e.notification || e.unread;
                        return (0, j.jsx)(
                            `li`,
                            {
                                className: o.join(` `),
                                children: (0, j.jsxs)(`a`, {
                                    href: `#`,
                                    title: e.fullName,
                                    'aria-current': e.id === t ? `page` : void 0,
                                    onClick: (t) => {
                                        (t.preventDefault(), Ai(e.id));
                                    },
                                    children: [
                                        (0, j.jsx)(`span`, {
                                            className: `buffer-quick-key`,
                                            children: n,
                                        }),
                                        (0, j.jsx)(`span`, {
                                            className: `buffer-jump-key`,
                                            children:
                                                i === null
                                                    ? ``
                                                    : String(i).padStart(2, `0`),
                                        }),
                                        (0, j.jsx)(`span`, {
                                            className: `buffername ${e.nameClasses.join(` `)}`,
                                            children: e.trimmedName || e.fullName,
                                        }),
                                        e.pinned &&
                                            (0, j.jsx)(M, {
                                                icon: Be,
                                                className: `buffer-pin`,
                                            }),
                                        s > 0 &&
                                            (0, j.jsx)(`span`, {
                                                className: `badge rounded-pill ${e.notification ? `text-bg-danger` : `text-bg-secondary`}`,
                                                children: s,
                                            }),
                                    ],
                                }),
                            },
                            e.id,
                        );
                    }),
                }),
            ],
        })
    );
}
var ms = '[a-zA-Z0-9_\\\\\\[\\]{}^`|-]+';
function hs(e, t) {
    let n = e.toLowerCase();
    return t.find((e) => e.toLowerCase().startsWith(n)) ?? null;
}
function gs(e, t, n) {
    let r = e.toLowerCase(),
        i = t.toLowerCase(),
        a = n.filter((e) => e.toLowerCase().startsWith(r)),
        o = a.findIndex((e) => e.toLowerCase() === i);
    return o === -1 ? t : a[(o + 1) % a.length];
}
function _s(e, t, n, r, i = `:`, a = !0) {
    let o = n !== null,
        s = a ? ` ` : ``,
        c = i.endsWith(` `) ? i : i + ` `,
        l = e.substring(0, t),
        u = e.substring(t),
        d = { text: e, caretPos: t, foundNick: null, iterCandidate: null },
        f = i.replace(/[-[\]/{}()*+?.\\^$|]/g, `\\$&`),
        p = l.match(RegExp(`^(` + ms + `)` + f + ` ?$`));
    if (p && (l.endsWith(` `) || i.endsWith(` `))) {
        if (!o) return d;
        let e = gs(n, p[1], r);
        return (
            (l = e + c),
            { text: l + u, caretPos: l.length, foundNick: e, iterCandidate: n }
        );
    }
    if (((p = l.match(RegExp(`^(` + ms + `)$`))), p)) {
        let e = hs(p[1], r);
        return e === null
            ? d
            : ((l = e + c),
              u.startsWith(` `) && (u = u.substring(1)),
              { text: l + u, caretPos: l.length, foundNick: e, iterCandidate: p[1] });
    }
    if (
        ((p = l.match(RegExp(`^(.* )(` + ms + `) ?$`))),
        p && o && (l.endsWith(` `) || !a))
    ) {
        let e = gs(n, p[2], r);
        return (
            (l = p[1] + e + s),
            { text: l + u, caretPos: l.length, foundNick: e, iterCandidate: n }
        );
    }
    if (((p = l.match(RegExp(`^(.* )(` + ms + `)$`))), p)) {
        let e = hs(p[2], r);
        return e === null
            ? d
            : ((l = p[1] + e + s),
              u.startsWith(` `) && (u = u.substring(1)),
              { text: l + u, caretPos: l.length, foundNick: e, iterCandidate: p[2] });
    }
    return d;
}
var vs = null,
    ys = !1;
function bs() {
    vs ||
        ys ||
        ((ys = !0),
        Jo(
            () =>
                import(`./lib-Ch05QPO9.js`).then((e) => {
                    vs = e.emojify;
                }),
            [],
            import.meta.url,
        ));
}
var xs = /^\p{Extended_Pictographic}(‍?\p{Extended_Pictographic}|️)*$/u;
function Ss(e, t) {
    if (!e.includes(`:`) || (bs(), !vs)) return null;
    let n = !1,
        r = 0,
        i = e.split(/(\s+)/).map((e) => {
            let i = r;
            if (((r += e.length), /^\s+$/.test(e) || !e.includes(`:`))) return e;
            let a = vs(e);
            return a !== e && xs.test(a)
                ? ((n = !0), t >= i + e.length && (t += a.length - e.length), a)
                : e;
        });
    return n ? { text: i.join(``), caret: t } : null;
}
function Cs({ buffer: e }) {
    let t = wi((e) => e.input),
        n = (0, b.useRef)(null),
        r = (0, b.useRef)(null),
        i = (0, b.useRef)(null),
        a = (0, b.useRef)(null),
        o = (0, b.useRef)(0);
    (0, b.useLayoutEffect)(() => {
        let e = n.current;
        e &&
            r.current !== null &&
            (e.setSelectionRange(r.current, r.current), (r.current = null));
    }, [t]);
    let s = (e, t) => {
            ((r.current = t ?? e.length), A({ input: e }));
        },
        c = () => {
            let t = Ci.getState().input;
            t !== `` &&
                (A({ input: `` }),
                (a.current = null),
                k
                    .send(e.id, t, () =>
                        window.confirm(
                            `Are you sure you want to quit WeeChat? This will prevent you from connecting with Glowing Bear until you restart WeeChat on the command line!`,
                        ),
                    )
                    .catch(() => void 0),
                n.current?.focus());
        },
        l = () => {
            let r = n.current,
                a = k.state.options,
                o = Object.values(e.nicks)
                    .sort((e, t) => t.spokeAt - e.spokeAt)
                    .map((e) => e.name),
                c = _s(
                    t,
                    r.selectionStart,
                    i.current,
                    o,
                    a[`weechat.completion.nick_completer`] ?? `:`,
                    (a[`weechat.completion.nick_add_space`] ?? `on`) === `on`,
                );
            ((i.current = c.iterCandidate), c.text !== t && s(c.text, c.caretPos));
        },
        u = (t) => {
            let n = a.current;
            if (!n || n.list.length === 0) return;
            let r = Ci.getState().input,
                i = r.substring(0, n.position - n.baseWord.length),
                o = r.substring(n.position),
                c = n.list[n.index],
                l = n.addSpace ? ` ` : ``,
                u = i + c + l + o,
                d = i.length + c.length + l.length;
            (s(u, d),
                (n.index = (n.index + t + n.list.length) % n.list.length),
                (n.baseWord = c + l),
                (n.position = d),
                (n.key = u + e.id),
                n.list.length === 1 && (a.current = null));
        },
        d = (r) => {
            let i = n.current,
                s = t + e.id;
            if (a.current?.key === s) {
                u(r);
                return;
            }
            let c = i.selectionStart,
                l = ++o.current;
            k.completion(e.id, t, c)
                .then((t) => {
                    l === o.current &&
                        Ci.getState().input + e.id === s &&
                        ((a.current = {
                            key: s,
                            list: t.list,
                            addSpace: t.add_space,
                            baseWord: t.base_word,
                            position: c,
                            index: r === 1 ? 0 : t.list.length - 1,
                        }),
                        u(r));
                })
                .catch(() => void 0);
        },
        f = (e) => {
            t.startsWith(`/`) ? d(e) : e === 1 && l();
        },
        p = (e) => {
            o.current++;
            let t = Ss(e.target.value, e.target.selectionStart);
            t ? s(t.text, t.caret) : A({ input: e.target.value });
        },
        m = (t) => {
            let n = document.getElementById(`bufferlines`);
            if (n) {
                if (t === -1 && n.scrollTop === 0) {
                    !k.state.loadingLines && !e.allLinesFetched && k.fetchLines(e.id);
                    return;
                }
                n.scrollBy({ top: t * n.clientHeight * 0.8 });
            }
        },
        h = (n) => {
            let r = n.currentTarget,
                a = r.selectionStart,
                o = !n.altKey && !n.ctrlKey && !n.metaKey;
            if (
                (n.key !== `Tab` && (i.current = null),
                n.key === `Enter` && !n.shiftKey && o && !n.nativeEvent.isComposing)
            )
                (n.preventDefault(), c());
            else if (n.key === `Tab` && o) (n.preventDefault(), f(n.shiftKey ? -1 : 1));
            else if (n.key === `ArrowUp` && o && !n.shiftKey) {
                if (
                    t.slice(0, a).includes(`
`)
                )
                    return;
                n.preventDefault();
                let r = k.historyUp(e.id, t);
                s(r);
            } else if (n.key === `ArrowDown` && o && !n.shiftKey) {
                if (
                    t.slice(a).includes(`
`)
                )
                    return;
                (n.preventDefault(), s(k.historyDown(e.id, t)));
            } else if (n.key === `PageUp` && o && !n.shiftKey)
                (n.preventDefault(), m(-1));
            else if (n.key === `PageDown` && o && !n.shiftKey)
                (n.preventDefault(), m(1));
            else if (ni().readlineBindings && n.ctrlKey && !n.altKey && !n.shiftKey) {
                let e = n.key.toLowerCase();
                if (e === `a`) r.setSelectionRange(0, 0);
                else if (e === `e`) r.setSelectionRange(t.length, t.length);
                else if (e === `u`) s(t.slice(a), 0);
                else if (e === `k`) s(t.slice(0, a));
                else if (e === `w`) {
                    let e = t.slice(0, a).replace(/\s+$/, ``).lastIndexOf(` `) + 1;
                    s(t.slice(0, e) + t.slice(a), e);
                } else return;
                n.preventDefault();
            }
        },
        g = e.inputPrompt.some((e) => e.text !== ``);
    return (0, j.jsx)(`form`, {
        id: `inputform`,
        onSubmit: (e) => {
            (e.preventDefault(), c());
        },
        children: (0, j.jsxs)(`div`, {
            className: `input-group`,
            children: [
                g &&
                    (0, j.jsx)(`span`, {
                        className: `input-group-text input-prompt d-none d-md-flex`,
                        title: `WeeChat input prompt`,
                        children: (0, j.jsx)(Xo, { parts: e.inputPrompt, links: !1 }),
                    }),
                (0, j.jsx)(`textarea`, {
                    id: `sendMessage`,
                    ref: n,
                    className: `form-control favorite-font`,
                    rows: 1,
                    value: t,
                    onChange: p,
                    onKeyDown: h,
                    onFocus: () => {
                        (A({ sidebarOpen: !1 }), bs());
                    },
                    autoComplete: `on`,
                    autoCapitalize: `sentences`,
                    enterKeyHint: `send`,
                    'aria-label': `Message`,
                    placeholder: `Message ${e.shortName || e.fullName}`,
                }),
                (0, j.jsx)(`button`, {
                    type: `button`,
                    className: `btn btn-input btn-complete-nick unselectable mobile`,
                    title: `Complete nick`,
                    'aria-label': `Complete nick`,
                    onClick: () => {
                        (f(1), n.current?.focus());
                    },
                    children: (0, j.jsx)(M, { icon: he }),
                }),
                (0, j.jsx)(`button`, {
                    type: `submit`,
                    className: `btn btn-input btn-send unselectable`,
                    title: `Send`,
                    'aria-label': `Send`,
                    children: (0, j.jsx)(M, { icon: Xe }),
                }),
            ],
        }),
    });
}
async function ws(e) {
    let t = ni(),
        n = ri(t.hostField);
    if (n) {
        si();
        try {
            await k.connect({
                host: n.host,
                port: n.port ?? t.port,
                path: n.path,
                password: e,
                tls: t.tls,
            });
        } catch {}
    }
}
function Ts() {
    let e = ii(location.hash);
    if (
        (e.host && ei({ host: e.host, hostField: e.host }),
        e.port && ei({ port: Number(e.port) }),
        e.path)
    ) {
        let t = ni();
        ei({ path: e.path, hostField: `${t.host}:${t.port}/${e.path}` });
    }
    e.autoconnect !== void 0 && ei({ autoconnect: e.autoconnect });
    let t = ni(),
        n = e.password ?? (t.savepassword ? t.password : ``);
    (t.autoconnect && ws(n),
        k.store.subscribe((e, t) => {
            e.status === `disconnected` && t.status !== `disconnected` && di();
        }));
}
var Es =
    typeof location < `u` &&
    ![`https:`, `file:`].includes(location.protocol) &&
    ![`localhost`, `127.0.0.1`, `::1`, `[::1]`].includes(location.hostname);
function Ds({ icon: e, children: t }) {
    return (0, j.jsxs)(`div`, {
        className: `alert alert-danger d-flex gap-2`,
        role: `alert`,
        children: [
            (0, j.jsx)(M, { icon: e, className: `flex-shrink-0` }),
            (0, j.jsx)(`div`, { children: t }),
        ],
    });
}
function Os({ kind: e, message: t, port: n }) {
    switch (e) {
        case `auth`:
            return null;
        case `insecure`:
            return (0, j.jsxs)(Ds, {
                icon: Me,
                children: [
                    (0, j.jsx)(`strong`, { children: `Secure connection error.` }),
                    ` Unable to connect to an unencrypted relay when Glowing Bear is loaded over HTTPS. Please use an encrypted relay or load the page without using HTTPS.`,
                ],
            });
        case `totp`:
            return (0, j.jsxs)(Ds, {
                icon: ye,
                children: [
                    (0, j.jsx)(`strong`, { children: `TOTP not supported.` }),
                    ` TOTP is enabled in WeeChat (`,
                    (0, j.jsx)(`code`, { children: `relay.network.totp_secret` }),
                    `), but browsers can't send the TOTP on the WebSocket connection used by the "api" relay. Disable TOTP to use Glowing Bear.`,
                ],
            });
        case `hash`:
            return (0, j.jsxs)(Ds, {
                icon: ye,
                children: [
                    (0, j.jsx)(`strong`, { children: `Hash algorithm error.` }),
                    ` WeeChat and Glowing Bear did not agree on a password hash algorithm. Allow at least one of them in WeeChat, for example`,
                    ` `,
                    (0, j.jsx)(`code`, {
                        children: `/set relay.network.password_hash_algo "pbkdf2+sha512,plain"`,
                    }),
                    ` `,
                    `(only "plain" works when Glowing Bear is not loaded over https:// or from localhost).`,
                ],
            });
        default:
            return (0, j.jsxs)(Ds, {
                icon: ye,
                children: [
                    (0, j.jsx)(`strong`, { children: `Connection error.` }),
                    ` The client was unable to connect to the WeeChat relay (`,
                    t,
                    `). Check the host and port, that an "api" relay is set up in WeeChat 4.1 or later (`,
                    (0, j.jsxs)(`code`, { children: [`/relay add api `, n] }),
                    `), and, with TLS, that your browser trusts the relay's certificate.`,
                ],
            });
    }
}
function ks() {
    let e = ti((e) => e),
        t = xi((e) => e.status),
        n = xi((e) => e.error),
        [r, i] = (0, b.useState)(e.savepassword ? e.password : ``),
        [a, o] = (0, b.useState)(!1),
        s = ri(e.hostField),
        c = s?.port !== void 0,
        l = t === `connecting`,
        u = (e) => {
            let t = ri(e);
            if (!t) {
                ei({ hostField: e });
                return;
            }
            ei({
                hostField: t.hostField,
                host: t.host,
                path: t.path,
                ...(t.port === void 0 ? {} : { port: Number(t.port) }),
                ...(t.tls === void 0 ? {} : { tls: t.tls }),
            });
        };
    return (0, j.jsxs)(j.Fragment, {
        children: [
            n &&
                (0, j.jsx)(Os, {
                    kind: n.kind,
                    message: n.message,
                    port: String(e.port),
                }),
            (0, j.jsx)(`section`, {
                className: `card connect-card shadow-sm`,
                children: (0, j.jsxs)(`div`, {
                    className: `card-body`,
                    children: [
                        (0, j.jsxs)(`h2`, {
                            className: `h5 card-title d-flex align-items-center gap-2`,
                            children: [
                                (0, j.jsx)(M, { icon: Qe }),
                                ` Connect to WeeChat`,
                            ],
                        }),
                        (0, j.jsxs)(`form`, {
                            className: `connect-form`,
                            onSubmit: (t) => {
                                (t.preventDefault(),
                                    e.savepassword && ei({ password: r }),
                                    ws(r));
                            },
                            noValidate: !0,
                            children: [
                                (0, j.jsxs)(`div`, {
                                    className: `row g-2`,
                                    children: [
                                        (0, j.jsxs)(`div`, {
                                            className: `col-8 col-sm-9`,
                                            children: [
                                                (0, j.jsx)(`label`, {
                                                    className: `form-label`,
                                                    htmlFor: `host`,
                                                    children: `Relay hostname`,
                                                }),
                                                (0, j.jsx)(`input`, {
                                                    type: `text`,
                                                    className: `form-control${s ? `` : ` is-invalid`}`,
                                                    id: `host`,
                                                    value: e.hostField,
                                                    onChange: (e) => u(e.target.value),
                                                    placeholder: `weechat.example.com`,
                                                    autoCapitalize: `off`,
                                                    autoCorrect: `off`,
                                                    spellCheck: !1,
                                                    autoComplete: `url`,
                                                }),
                                            ],
                                        }),
                                        (0, j.jsxs)(`div`, {
                                            className: `col-4 col-sm-3`,
                                            children: [
                                                (0, j.jsx)(`label`, {
                                                    className: `form-label`,
                                                    htmlFor: `port`,
                                                    children: `Port`,
                                                }),
                                                (0, j.jsx)(`input`, {
                                                    type: `text`,
                                                    inputMode: `numeric`,
                                                    className: `form-control`,
                                                    id: `port`,
                                                    value: e.port,
                                                    disabled: c,
                                                    onChange: (e) =>
                                                        ei({ port: e.target.value }),
                                                    placeholder: `9001`,
                                                }),
                                            ],
                                        }),
                                        (0, j.jsxs)(`div`, {
                                            className: `col-12`,
                                            children: [
                                                (0, j.jsx)(`label`, {
                                                    className: `form-label`,
                                                    htmlFor: `password`,
                                                    children: `Relay password`,
                                                }),
                                                (0, j.jsxs)(`div`, {
                                                    className: `input-group`,
                                                    children: [
                                                        (0, j.jsx)(`input`, {
                                                            type: a
                                                                ? `text`
                                                                : `password`,
                                                            className: `form-control${n?.kind === `auth` ? ` is-invalid` : ``}`,
                                                            id: `password`,
                                                            value: r,
                                                            onChange: (t) => {
                                                                (i(t.target.value),
                                                                    e.savepassword &&
                                                                        ei({
                                                                            password:
                                                                                t.target
                                                                                    .value,
                                                                        }));
                                                            },
                                                            placeholder: `Password`,
                                                            autoComplete: `current-password`,
                                                        }),
                                                        (0, j.jsx)(`button`, {
                                                            type: `button`,
                                                            className: `btn btn-outline-secondary`,
                                                            onClick: () => o(!a),
                                                            title: a
                                                                ? `Hide password`
                                                                : `Show password`,
                                                            'aria-label': `Toggle password visibility`,
                                                            children: (0, j.jsx)(M, {
                                                                icon: a ? xe : Ce,
                                                            }),
                                                        }),
                                                    ],
                                                }),
                                                n?.kind === `auth` &&
                                                    (0, j.jsx)(`div`, {
                                                        className: `invalid-feedback d-block`,
                                                        children: n.message,
                                                    }),
                                            ],
                                        }),
                                    ],
                                }),
                                (0, j.jsxs)(`div`, {
                                    className: `mt-3`,
                                    children: [
                                        (0, j.jsxs)(`div`, {
                                            className: `form-check form-switch`,
                                            children: [
                                                (0, j.jsx)(`input`, {
                                                    className: `form-check-input`,
                                                    type: `checkbox`,
                                                    role: `switch`,
                                                    id: `tls`,
                                                    checked: e.tls,
                                                    onChange: (e) =>
                                                        ei({ tls: e.target.checked }),
                                                }),
                                                (0, j.jsxs)(`label`, {
                                                    className: `form-check-label`,
                                                    htmlFor: `tls`,
                                                    children: [
                                                        `Encryption (TLS)`,
                                                        ` `,
                                                        (0, j.jsx)(`span`, {
                                                            className: `text-body-secondary`,
                                                            children: `— strongly recommended`,
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                        (0, j.jsxs)(`div`, {
                                            className: `form-check form-switch`,
                                            children: [
                                                (0, j.jsx)(`input`, {
                                                    className: `form-check-input`,
                                                    type: `checkbox`,
                                                    role: `switch`,
                                                    id: `savepassword`,
                                                    checked: e.savepassword,
                                                    onChange: (e) =>
                                                        ei({
                                                            savepassword:
                                                                e.target.checked,
                                                            password: e.target.checked
                                                                ? r
                                                                : ``,
                                                        }),
                                                }),
                                                (0, j.jsx)(`label`, {
                                                    className: `form-check-label`,
                                                    htmlFor: `savepassword`,
                                                    children: `Save password in this browser`,
                                                }),
                                            ],
                                        }),
                                        (e.savepassword || e.autoconnect) &&
                                            (0, j.jsxs)(`div`, {
                                                className: `form-check form-switch`,
                                                children: [
                                                    (0, j.jsx)(`input`, {
                                                        className: `form-check-input`,
                                                        type: `checkbox`,
                                                        role: `switch`,
                                                        id: `autoconnect`,
                                                        checked: e.autoconnect,
                                                        onChange: (e) =>
                                                            ei({
                                                                autoconnect:
                                                                    e.target.checked,
                                                            }),
                                                    }),
                                                    (0, j.jsx)(`label`, {
                                                        className: `form-check-label`,
                                                        htmlFor: `autoconnect`,
                                                        children: `Connect automatically`,
                                                    }),
                                                ],
                                            }),
                                    ],
                                }),
                                (0, j.jsxs)(`button`, {
                                    type: `submit`,
                                    className: `btn btn-primary btn-lg w-100 mt-3 d-flex align-items-center justify-content-center gap-2`,
                                    disabled: !s || l,
                                    children: [
                                        (0, j.jsx)(`span`, {
                                            children: l ? `Connecting` : `Connect`,
                                        }),
                                        (0, j.jsx)(M, { icon: l ? ke : pe, spin: l }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            }),
        ],
    });
}
function As({ title: e, children: t }) {
    let [n, r] = (0, b.useState)(!1);
    return (0, j.jsxs)(`div`, {
        className: `accordion-item`,
        'data-state': n ? `active` : `collapsed`,
        children: [
            (0, j.jsx)(`h2`, {
                className: `accordion-header`,
                children: (0, j.jsx)(`button`, {
                    type: `button`,
                    className: `accordion-button`,
                    'aria-expanded': n,
                    onClick: () => r(!n),
                    children: e,
                }),
            }),
            n &&
                (0, j.jsx)(`div`, {
                    className: `accordion-collapse`,
                    children: (0, j.jsx)(`div`, {
                        className: `accordion-body`,
                        children: t,
                    }),
                }),
        ],
    });
}
function js() {
    let e = ti((e) => e.host || `your.domain.com`),
        t = ti((e) => String(e.port || 9001));
    return (0, j.jsxs)(`div`, {
        className: `accordion login-help`,
        children: [
            (0, j.jsxs)(As, {
                title: `Getting started`,
                children: [
                    (0, j.jsx)(`p`, {
                        children: (0, j.jsx)(`span`, {
                            className: `badge text-bg-danger`,
                            children: `WeeChat 4.1 or later is required.`,
                        }),
                    }),
                    (0, j.jsx)(`p`, {
                        children: `Glowing Bear connects to the "api" relay of your WeeChat. All communication goes directly between your browser and your WeeChat: your server must be reachable from this device. Nobody else sees your data or your password, and all settings, including your password if you choose to save it, stay in this browser.`,
                    }),
                    (0, j.jsx)(`h3`, {
                        className: `h6`,
                        children: `Quick start (unencrypted, for local testing)`,
                    }),
                    (0, j.jsx)(`pre`, {
                        children: `/set relay.network.password y0ur_StRonG-pa$sw0rd:of*choice\n/relay add api ${t}`,
                    }),
                    (0, j.jsx)(`h3`, {
                        className: `h6`,
                        children: `Use TLS encryption`,
                    }),
                    (0, j.jsxs)(`p`, {
                        children: [
                            `With encryption, all communication between your browser and WeeChat is encrypted with TLS. This needs a certificate. Self-signed certificates are handled poorly by browsers and may not work at all on mobile devices, so we recommend a free certificate from`,
                            ` `,
                            (0, j.jsx)(`a`, {
                                href: `https://letsencrypt.org/`,
                                children: `Let's Encrypt`,
                            }),
                            `: follow the instructions at`,
                            ` `,
                            (0, j.jsx)(`a`, {
                                href: `https://certbot.eff.org/`,
                                children: `certbot.eff.org`,
                            }),
                            ` (or proxy the relay through your web server, see`,
                            ` `,
                            (0, j.jsx)(`a`, {
                                href: `https://github.com/glowing-bear/glowing-bear/wiki/Proxying-WeeChat-relay-with-a-web-server`,
                                children: `our wiki`,
                            }),
                            `), with `,
                            (0, j.jsxs)(`code`, {
                                children: [`certbot certonly --standalone -d `, e],
                            }),
                            `. Then copy it where WeeChat expects it, replacing`,
                            ` `,
                            (0, j.jsx)(`strong`, { children: `username` }),
                            ` with your user:`,
                        ],
                    }),
                    (0, j.jsx)(`pre`, {
                        children: `mkdir -p ~username/.config/weechat/tls\ncat /etc/letsencrypt/live/${e}/{fullchain,privkey}.pem > ~username/.config/weechat/tls/relay.pem\nchown -R username:username ~username/.config/weechat/tls/`,
                    }),
                    (0, j.jsx)(`p`, { children: `Then set up an encrypted relay:` }),
                    (0, j.jsx)(`pre`, {
                        children: `/set relay.network.password y0ur_StRonG-pa$sw0rd:of*choice\n/relay tlscertkey\n/relay add tls.api ${t}`,
                    }),
                    (0, j.jsxs)(`p`, {
                        children: [
                            `Certificates must be renewed every few months (`,
                            (0, j.jsx)(`code`, { children: `certbot renew` }),
                            `). After renewing, copy the certificate again and run `,
                            (0, j.jsx)(`code`, { children: `/relay tlscertkey` }),
                            ` in WeeChat.`,
                        ],
                    }),
                    (0, j.jsx)(`h3`, {
                        className: `h6`,
                        children: `TOTP (Time-based One-Time Password)`,
                    }),
                    (0, j.jsxs)(`p`, {
                        className: `mb-0`,
                        children: [
                            `WeeChat expects the TOTP in an HTTP header that browsers can't send on WebSocket connections, so TOTP can't be used with Glowing Bear. Make sure `,
                            (0, j.jsx)(`code`, {
                                children: `relay.network.totp_secret`,
                            }),
                            ` is empty.`,
                        ],
                    }),
                ],
            }),
            (0, j.jsxs)(As, {
                title: `Usage instructions`,
                children: [
                    (0, j.jsx)(`h3`, {
                        className: `h6`,
                        children: `Host field and custom path`,
                    }),
                    (0, j.jsxs)(`p`, {
                        children: [
                            `Glowing Bear connects to`,
                            ` `,
                            (0, j.jsx)(`code`, {
                                children: `{scheme}://{host}:{port}/{path}`,
                            }),
                            `, where the path is`,
                            ` `,
                            (0, j.jsx)(`code`, { children: `api` }),
                            ` unless the relay is behind a proxy. The host field accepts `,
                            (0, j.jsx)(`code`, { children: `weechat.example.com` }),
                            `,`,
                            ` `,
                            (0, j.jsx)(`code`, {
                                children: `weechat.example.com:8000`,
                            }),
                            ` or`,
                            ` `,
                            (0, j.jsx)(`code`, {
                                children: `weechat.example.com:443/relay/api`,
                            }),
                            ` (the port is required with a path). IPv6 addresses must be wrapped in square brackets.`,
                        ],
                    }),
                    (0, j.jsx)(`h3`, { className: `h6`, children: `URL parameters` }),
                    (0, j.jsxs)(`p`, {
                        children: [
                            `Fields can be prefilled from the URL:`,
                            ` `,
                            (0, j.jsx)(`code`, {
                                children: `#host=weechat.example.com&port=8000&autoconnect=true`,
                            }),
                            `. Available parameters: `,
                            (0, j.jsx)(`code`, { children: `host` }),
                            `, `,
                            (0, j.jsx)(`code`, { children: `port` }),
                            `,`,
                            ` `,
                            (0, j.jsx)(`code`, { children: `path` }),
                            `, `,
                            (0, j.jsx)(`code`, { children: `password` }),
                            `, `,
                            (0, j.jsx)(`code`, { children: `autoconnect` }),
                            `. Passing the password this way is not recommended.`,
                        ],
                    }),
                    (0, j.jsx)(`h3`, { className: `h6`, children: `Pinning buffers` }),
                    (0, j.jsxs)(`p`, {
                        className: `mb-0`,
                        children: [
                            `With "Only buffers with unread messages", pinned buffers stay visible. To pin a buffer, type`,
                            ` `,
                            (0, j.jsx)(`code`, {
                                children: `/buffer set localvar_set_pinned true`,
                            }),
                            `.`,
                        ],
                    }),
                ],
            }),
            (0, j.jsx)(As, {
                title: `Install as an app`,
                children: (0, j.jsxs)(`p`, {
                    className: `mb-0`,
                    children: [
                        `Glowing Bear can be installed as an app for a full-screen experience and an unread badge on its icon: use `,
                        (0, j.jsx)(`kbd`, { children: `Install` }),
                        ` in the address bar or menu on desktop, or `,
                        (0, j.jsx)(`kbd`, { children: `Add to Home screen` }),
                        ` on mobile.`,
                    ],
                }),
            }),
        ],
    });
}
function Ms() {
    return (0, j.jsxs)(`main`, {
        className: `login container`,
        children: [
            (0, j.jsxs)(`header`, {
                className: `login-header d-flex align-items-center gap-3`,
                children: [
                    (0, j.jsx)(`img`, {
                        className: `login-logo`,
                        alt: ``,
                        src: `assets/img/glowing-bear.svg`,
                    }),
                    (0, j.jsxs)(`div`, {
                        children: [
                            (0, j.jsx)(`h1`, {
                                className: `h3 mb-0`,
                                children: `Glowing Bear`,
                            }),
                            (0, j.jsx)(`p`, {
                                className: `text-body-secondary mb-0`,
                                children: `WeeChat web frontend`,
                            }),
                        ],
                    }),
                ],
            }),
            Es &&
                (0, j.jsxs)(`div`, {
                    className: `alert alert-warning d-flex gap-2`,
                    role: `alert`,
                    children: [
                        (0, j.jsx)(M, { icon: je, className: `flex-shrink-0` }),
                        (0, j.jsxs)(`div`, {
                            children: [
                                (0, j.jsx)(`strong`, {
                                    children: `You're using Glowing Bear over an unencrypted connection (http://).`,
                                }),
                                ` `,
                                `This is not recommended! If your relay is on your local network that may be unavoidable, but be aware of the implications.`,
                            ],
                        }),
                    ],
                }),
            (0, j.jsx)(ks, {}),
            (0, j.jsx)(js, {}),
        ],
    });
}
function Ns(e) {
    let t = new Map();
    for (let n of Object.values(e.nicks)) {
        if (!n.visible) continue;
        let e = t.get(n.groupId) ?? [];
        (e.push(n), t.set(n.groupId, e));
    }
    let n = (t) => e.nickGroups[t]?.name ?? ``;
    return [...t.entries()]
        .sort(([e], [t]) => n(e).localeCompare(n(t)))
        .map(([e, t]) => ({
            key: e,
            nicks: t.sort((e, t) => e.name.localeCompare(t.name)),
        }));
}
function Ps({ buffer: e }) {
    let t = os(),
        n = Ns(e),
        r = n.reduce((e, t) => e + t.nicks.length, 0);
    return (0, j.jsxs)(`aside`, {
        id: `nicklist`,
        className: `favorite-font`,
        'aria-label': `Nicklist`,
        ...t,
        children: [
            (0, j.jsxs)(`div`, {
                className: `nicklist-header`,
                children: [(0, j.jsx)(M, { icon: it }), ` `, r],
            }),
            n.map((t) =>
                (0, j.jsx)(
                    `ul`,
                    {
                        className: `nicklistgroup list-unstyled`,
                        children: t.nicks.map((t) =>
                            (0, j.jsx)(
                                `li`,
                                {
                                    children: (0, j.jsxs)(`a`, {
                                        href: `#`,
                                        onClick: (n) => {
                                            (n.preventDefault(),
                                                k.openQuery(e.id, t.name));
                                        },
                                        title: vi()
                                            ? void 0
                                            : `Open a query with ${t.name}`,
                                        children: [
                                            (0, j.jsx)(`span`, {
                                                className: `nick-prefix ${t.prefixClasses.join(` `)}`,
                                                children: t.prefix,
                                            }),
                                            (0, j.jsx)(`span`, {
                                                className: t.nameClasses.join(` `),
                                                children: t.name,
                                            }),
                                        ],
                                    }),
                                },
                                t.id,
                            ),
                        ),
                    },
                    t.key,
                ),
            ),
        ],
    });
}
var Fs = [
    {
        id: `dark`,
        label: `Dark`,
        light: !1,
        preview: [`#181818`, `#232323`, `#dddddd`, `#4f8fd6`],
    },
    {
        id: `light`,
        label: `Light`,
        light: !0,
        preview: [`#fdfdfd`, `#f1f2f4`, `#181818`, `#2f6fb5`],
    },
    {
        id: `black`,
        label: `Black`,
        light: !1,
        preview: [`#000000`, `#080808`, `#dddddd`, `#4f8fd6`],
    },
    {
        id: `dark-spacious`,
        label: `Dark spacious`,
        light: !1,
        preview: [`#181818`, `#232323`, `#dddddd`, `#4f8fd6`],
    },
    {
        id: `blue`,
        label: `Blue`,
        light: !1,
        preview: [`#1d222c`, `#283244`, `#dfdfcf`, `#0f99d9`],
    },
    {
        id: `base16-default`,
        label: `Base16`,
        light: !1,
        preview: [`#181818`, `#282828`, `#d8d8d8`, `#7cafc2`],
    },
    {
        id: `base16-light`,
        label: `Base16 light`,
        light: !0,
        preview: [`#f8f8f8`, `#e8e8e8`, `#383838`, `#3e7184`],
    },
    {
        id: `base16-mocha`,
        label: `Mocha`,
        light: !1,
        preview: [`#3b3228`, `#534636`, `#d0c8c6`, `#8ab3b5`],
    },
    {
        id: `base16-ocean-dark`,
        label: `Ocean dark`,
        light: !1,
        preview: [`#2b303b`, `#343d46`, `#c0c5ce`, `#8fa1b3`],
    },
    {
        id: `base16-solarized-dark`,
        label: `Solarized dark`,
        light: !1,
        preview: [`#002b36`, `#073642`, `#839496`, `#268bd2`],
    },
    {
        id: `base16-solarized-light`,
        label: `Solarized light`,
        light: !0,
        preview: [`#fdf6e3`, `#eee8d5`, `#657b83`, `#268bd2`],
    },
];
function Is(e) {
    let t = Fs.find((t) => t.id === e) ?? Fs[0],
        n = document.getElementById(`themeCSS`),
        r = `css/themes/${t.id}.css`;
    (n ||
        ((n = document.createElement(`link`)),
        (n.id = `themeCSS`),
        (n.rel = `stylesheet`),
        document.head.appendChild(n)),
        n.getAttribute(`href`) !== r &&
            ((n.onload = () => {
                let e = getComputedStyle(document.documentElement)
                    .getPropertyValue(`--gb-chrome-bg`)
                    .trim();
                document
                    .querySelector(`meta[name="theme-color"]`)
                    ?.setAttribute(`content`, e);
            }),
            n.setAttribute(`href`, r)),
        document.documentElement.setAttribute(
            `data-bs-theme`,
            t.light ? `light` : `dark`,
        ));
}
function Ls(e) {
    let t = document.getElementById(`custom-css-tag`);
    (t ||
        ((t = document.createElement(`style`)),
        (t.id = `custom-css-tag`),
        document.head.appendChild(t)),
        (t.textContent = e));
}
function Rs(e, t) {
    let n = document.documentElement.style;
    (n.setProperty(`--gb-chat-font`, e),
        n.setProperty(`--gb-chat-size`, /^\d+$/.test(t) ? t + `px` : t));
}
function zs(e, t) {
    (e.theme !== t?.theme && Is(e.theme),
        e.customCSS !== t?.customCSS && Ls(e.customCSS),
        (e.fontfamily !== t?.fontfamily || e.fontsize !== t?.fontsize) &&
            Rs(e.fontfamily, e.fontsize));
}
function Bs() {
    (zs($r.getState()), $r.subscribe((e, t) => zs(e, t)));
}
function Vs({
    id: e,
    open: t,
    labelledBy: n,
    className: r = ``,
    dialogClassName: i = ``,
    children: a,
}) {
    return (0, j.jsxs)(`div`, {
        id: e,
        className: `gb-modal modal ${r}`,
        'data-state': t ? `visible` : `hidden`,
        role: `dialog`,
        'aria-modal': `true`,
        'aria-labelledby': n,
        'aria-hidden': !t,
        children: [
            (0, j.jsx)(`div`, { className: `backdrop`, onClick: Ti }),
            (0, j.jsx)(`div`, {
                className: `modal-dialog modal-dialog-scrollable ${i}`,
                children: (0, j.jsx)(`div`, {
                    className: `modal-content`,
                    children: a,
                }),
            }),
        ],
    });
}
var Hs = [
        { id: `appearance`, label: `Appearance`, icon: Re },
        { id: `chat`, label: `Chat`, icon: Ie },
        { id: `notifications`, label: `Notifications`, icon: _e },
        { id: `shortcuts`, label: `Shortcuts`, icon: De, desktop: !0 },
        { id: `about`, label: `About`, icon: w },
    ],
    Us = [
        { label: `Inter`, value: Yr },
        { label: `System`, value: `system-ui, -apple-system, sans-serif` },
        {
            label: `Monospace`,
            value: `ui-monospace, 'JetBrains Mono', Menlo, Consolas, monospace`,
        },
    ],
    Ws = [
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `0` }),
                    `–`,
                    (0, j.jsx)(`kbd`, { children: `9` }),
                ],
            }),
            `Switch to buffer number N`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `j` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `NN` }),
                ],
            }),
            `Switch to buffer number NN`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `↑` }),
                    ` / `,
                    (0, j.jsx)(`kbd`, { children: `↓` }),
                ],
            }),
            `Previous / next buffer`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `a` }),
                ],
            }),
            `Next buffer with activity`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `<` }),
                ],
            }),
            `Previously active buffer`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `g` }),
                ],
            }),
            `Search buffers`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `n` }),
                ],
            }),
            `Toggle nicklist`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `l` }),
                ],
            }),
            `Focus the input bar`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Alt` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `h` }),
                ],
            }),
            `Clear all unread counters`,
        ],
        [(0, j.jsx)(`kbd`, { children: `Tab` }), `Complete nick or command`],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `↑` }),
                    ` / `,
                    (0, j.jsx)(`kbd`, { children: `↓` }),
                ],
            }),
            `Input history`,
        ],
        [
            (0, j.jsxs)(j.Fragment, {
                children: [
                    (0, j.jsx)(`kbd`, { children: `Esc` }),
                    ` `,
                    (0, j.jsx)(`kbd`, { children: `Esc` }),
                ],
            }),
            `Disconnect`,
        ],
    ];
function Gs(e) {
    let t = ti((t) => t[e.setting]);
    return (0, j.jsxs)(`label`, {
        className: `settings-row ${e.className ?? ``}`,
        htmlFor: e.setting,
        children: [
            (0, j.jsxs)(`span`, {
                className: `settings-row-text`,
                children: [
                    (0, j.jsx)(`span`, {
                        className: `settings-row-title`,
                        children: e.title,
                    }),
                    (0, j.jsx)(`span`, {
                        className: `settings-row-help`,
                        children: e.help,
                    }),
                ],
            }),
            (0, j.jsx)(`span`, {
                className: `form-check form-switch`,
                children: (0, j.jsx)(`input`, {
                    className: `form-check-input`,
                    type: `checkbox`,
                    role: `switch`,
                    id: e.setting,
                    checked: t,
                    onChange: (t) => ei({ [e.setting]: t.target.checked }),
                }),
            }),
        ],
    });
}
function Ks() {
    let e = ti((e) => e.theme),
        t = ti((e) => e.fontfamily),
        n = ti((e) => e.fontsize),
        r = ti((e) => e.customCSS),
        i = parseInt(n, 10) || 14;
    return (0, j.jsxs)(j.Fragment, {
        children: [
            (0, j.jsx)(`h3`, { className: `settings-heading`, children: `Theme` }),
            (0, j.jsx)(`div`, {
                className: `theme-grid`,
                role: `radiogroup`,
                'aria-label': `Theme`,
                children: Fs.map((t) =>
                    (0, j.jsxs)(
                        `button`,
                        {
                            type: `button`,
                            role: `radio`,
                            'aria-checked': e === t.id,
                            className: `theme-card${e === t.id ? ` active` : ``}`,
                            title: t.label,
                            onClick: () => ei({ theme: t.id }),
                            children: [
                                (0, j.jsxs)(`span`, {
                                    className: `theme-preview`,
                                    style: { background: t.preview[0] },
                                    children: [
                                        (0, j.jsx)(`span`, {
                                            className: `theme-preview-side`,
                                            style: { background: t.preview[1] },
                                        }),
                                        (0, j.jsxs)(`span`, {
                                            className: `theme-preview-lines`,
                                            children: [
                                                (0, j.jsx)(`span`, {
                                                    style: { background: t.preview[2] },
                                                }),
                                                (0, j.jsx)(`span`, {
                                                    style: { background: t.preview[3] },
                                                }),
                                                (0, j.jsx)(`span`, {
                                                    style: { background: t.preview[2] },
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                (0, j.jsx)(`span`, {
                                    className: `theme-name`,
                                    children: t.label,
                                }),
                            ],
                        },
                        t.id,
                    ),
                ),
            }),
            (0, j.jsx)(`h3`, { className: `settings-heading`, children: `Chat text` }),
            (0, j.jsxs)(`div`, {
                className: `settings-group`,
                children: [
                    (0, j.jsxs)(`div`, {
                        className: `settings-row settings-row-stacked`,
                        children: [
                            (0, j.jsxs)(`div`, {
                                className: `settings-row-text`,
                                children: [
                                    (0, j.jsx)(`label`, {
                                        className: `settings-row-title`,
                                        htmlFor: `font`,
                                        children: `Font`,
                                    }),
                                    (0, j.jsx)(`div`, {
                                        className: `settings-row-help`,
                                        children: `Used for messages and the input bar.`,
                                    }),
                                ],
                            }),
                            (0, j.jsx)(`div`, {
                                className: `btn-group btn-group-sm font-presets`,
                                role: `group`,
                                'aria-label': `Font presets`,
                                children: Us.map((e) =>
                                    (0, j.jsx)(
                                        `button`,
                                        {
                                            type: `button`,
                                            className: `btn btn-outline-secondary${t === e.value ? ` active` : ``}`,
                                            style: { fontFamily: e.value },
                                            onClick: () => ei({ fontfamily: e.value }),
                                            children: e.label,
                                        },
                                        e.label,
                                    ),
                                ),
                            }),
                            (0, j.jsx)(`input`, {
                                type: `text`,
                                id: `font`,
                                className: `form-control form-control-sm font-monospace`,
                                value: t,
                                spellCheck: !1,
                                'aria-label': `Font family`,
                                onChange: (e) => ei({ fontfamily: e.target.value }),
                            }),
                        ],
                    }),
                    (0, j.jsxs)(`div`, {
                        className: `settings-row settings-row-stacked`,
                        children: [
                            (0, j.jsxs)(`div`, {
                                className: `settings-row-text`,
                                children: [
                                    (0, j.jsx)(`label`, {
                                        className: `settings-row-title`,
                                        htmlFor: `size`,
                                        children: `Size`,
                                    }),
                                    (0, j.jsx)(`div`, {
                                        className: `settings-row-help`,
                                        children: n,
                                    }),
                                ],
                            }),
                            (0, j.jsx)(`input`, {
                                type: `range`,
                                className: `form-range`,
                                id: `size`,
                                min: 11,
                                max: 22,
                                step: 1,
                                value: i,
                                onChange: (e) =>
                                    ei({ fontsize: e.target.value + `px` }),
                            }),
                            (0, j.jsxs)(`p`, {
                                className: `font-sample favorite-font mb-0`,
                                children: [
                                    (0, j.jsx)(`span`, {
                                        className: `font-sample-nick`,
                                        children: `alice`,
                                    }),
                                    ` The quick brown fox jumps over the lazy dog.`,
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            (0, j.jsxs)(`details`, {
                className: `settings-advanced`,
                children: [
                    (0, j.jsx)(`summary`, { children: `Custom CSS` }),
                    (0, j.jsx)(`textarea`, {
                        id: `custom-css`,
                        className: `form-control font-monospace mt-2`,
                        rows: 4,
                        spellCheck: !1,
                        'aria-label': `Custom CSS`,
                        placeholder: `#bufferlines { letter-spacing: 0.01em; }`,
                        value: r,
                        onChange: (e) => ei({ customCSS: e.target.value }),
                    }),
                ],
            }),
        ],
    });
}
function qs() {
    return (0, j.jsxs)(j.Fragment, {
        children: [
            (0, j.jsx)(`h3`, {
                className: `settings-heading`,
                children: `Buffer list`,
            }),
            (0, j.jsxs)(`div`, {
                className: `settings-group`,
                children: [
                    (0, j.jsx)(Gs, {
                        setting: `orderbyserver`,
                        title: `Group by server`,
                        help: `Show channels and queries under their server.`,
                    }),
                    (0, j.jsx)(Gs, {
                        setting: `onlyUnread`,
                        title: `Only buffers with unread messages`,
                        help: `Pinned buffers and the core buffer stay visible.`,
                    }),
                    (0, j.jsx)(Gs, {
                        setting: `enableQuickKeys`,
                        title: `Quick buffer switching`,
                        className: `desktop`,
                        help: (0, j.jsxs)(j.Fragment, {
                            children: [
                                `Use `,
                                (0, j.jsx)(`kbd`, { children: `Alt` }),
                                `+`,
                                (0, j.jsx)(`kbd`, { children: `0` }),
                                `–`,
                                (0, j.jsx)(`kbd`, { children: `9` }),
                                ` to switch buffers.`,
                            ],
                        }),
                    }),
                ],
            }),
            (0, j.jsx)(`h3`, { className: `settings-heading`, children: `Nicklist` }),
            (0, j.jsxs)(`div`, {
                className: `settings-group`,
                children: [
                    (0, j.jsx)(Gs, {
                        setting: `nonicklist`,
                        title: `Hide nicklist`,
                        className: `desktop`,
                        help: (0, j.jsxs)(j.Fragment, {
                            children: [
                                `Toggle it anytime with `,
                                (0, j.jsx)(`kbd`, { children: `Alt` }),
                                `+`,
                                (0, j.jsx)(`kbd`, { children: `n` }),
                                `.`,
                            ],
                        }),
                    }),
                    (0, j.jsx)(Gs, {
                        setting: `alwaysnicklist`,
                        title: `Always show nicklist`,
                        className: `mobile`,
                        help: `Otherwise open it from the top bar.`,
                    }),
                ],
            }),
            (0, j.jsx)(`h3`, { className: `settings-heading`, children: `Messages` }),
            (0, j.jsxs)(`div`, {
                className: `settings-group`,
                children: [
                    (0, j.jsx)(Gs, {
                        setting: `hotlistsync`,
                        title: `Mark messages as read in WeeChat`,
                        help: `Clear the hotlist and move the read marker when you view a buffer.`,
                    }),
                    (0, j.jsx)(Gs, {
                        setting: `readlineBindings`,
                        title: `Readline keybindings`,
                        help: (0, j.jsxs)(j.Fragment, {
                            children: [
                                (0, j.jsx)(`kbd`, { children: `Ctrl` }),
                                `+`,
                                (0, j.jsx)(`kbd`, { children: `a` }),
                                `/`,
                                (0, j.jsx)(`kbd`, { children: `e` }),
                                `/`,
                                (0, j.jsx)(`kbd`, { children: `u` }),
                                `/`,
                                (0, j.jsx)(`kbd`, { children: `k` }),
                                `/`,
                                (0, j.jsx)(`kbd`, { children: `w` }),
                                ` in the input bar.`,
                            ],
                        }),
                    }),
                    (0, j.jsx)(Gs, {
                        setting: `enableMathjax`,
                        title: `LaTeX math`,
                        help: (0, j.jsxs)(j.Fragment, {
                            children: [
                                `Render math between `,
                                (0, j.jsx)(`code`, { children: `$$` }),
                                ` delimiters with KaTeX.`,
                            ],
                        }),
                    }),
                ],
            }),
        ],
    });
}
function Js() {
    return (0, j.jsxs)(j.Fragment, {
        children: [
            (0, j.jsx)(`h3`, {
                className: `settings-heading`,
                children: `Notifications`,
            }),
            (0, j.jsxs)(`div`, {
                className: `settings-group`,
                children: [
                    (0, j.jsx)(Gs, {
                        setting: `soundnotification`,
                        title: `Sound`,
                        help: `Play a sound on highlights and private messages.`,
                    }),
                    (0, j.jsx)(Gs, {
                        setting: `useFavico`,
                        title: `Unread count in the tab icon`,
                        help: `Also shown on the app icon when installed.`,
                    }),
                ],
            }),
            (0, j.jsxs)(`p`, {
                className: `settings-note`,
                children: [
                    (0, j.jsx)(M, { icon: w }),
                    ` Desktop notifications for highlights and private messages use your browser's permission for this site.`,
                ],
            }),
        ],
    });
}
function Ys() {
    return (0, j.jsxs)(j.Fragment, {
        children: [
            (0, j.jsx)(`h3`, {
                className: `settings-heading`,
                children: `Keyboard shortcuts`,
            }),
            (0, j.jsx)(`dl`, {
                className: `shortcut-table`,
                children: Ws.map(([e, t]) =>
                    (0, j.jsxs)(
                        `div`,
                        {
                            className: `contents`,
                            children: [
                                (0, j.jsx)(`dt`, { children: e }),
                                (0, j.jsx)(`dd`, { children: t }),
                            ],
                        },
                        t,
                    ),
                ),
            }),
        ],
    });
}
function Xs() {
    let e = xi((e) => e.version),
        t = xi((e) => e.scripts),
        n = ti((e) => `${e.host}:${e.port}/${e.path}`),
        r = ti((e) => e.tls);
    return (0, j.jsxs)(j.Fragment, {
        children: [
            (0, j.jsxs)(`div`, {
                className: `about-header`,
                children: [
                    (0, j.jsx)(`img`, { alt: ``, src: `assets/img/glowing-bear.svg` }),
                    (0, j.jsxs)(`div`, {
                        children: [
                            (0, j.jsxs)(`div`, {
                                className: `fw-semibold`,
                                children: [`Glowing Bear `, `0.10.0`],
                            }),
                            (0, j.jsx)(`div`, {
                                className: `small text-body-secondary`,
                                children: `WeeChat web frontend`,
                            }),
                        ],
                    }),
                ],
            }),
            (0, j.jsx)(`h3`, { className: `settings-heading`, children: `Connection` }),
            (0, j.jsxs)(`div`, {
                className: `settings-group`,
                children: [
                    (0, j.jsxs)(`div`, {
                        className: `settings-row`,
                        children: [
                            (0, j.jsx)(`span`, {
                                className: `settings-row-title`,
                                children: `WeeChat`,
                            }),
                            (0, j.jsx)(`span`, {
                                className: `settings-row-value`,
                                children: e?.weechat_version ?? `–`,
                            }),
                        ],
                    }),
                    (0, j.jsxs)(`div`, {
                        className: `settings-row`,
                        children: [
                            (0, j.jsx)(`span`, {
                                className: `settings-row-title`,
                                children: `Relay API`,
                            }),
                            (0, j.jsx)(`span`, {
                                className: `settings-row-value`,
                                children: e?.relay_api_version ?? `–`,
                            }),
                        ],
                    }),
                    (0, j.jsxs)(`div`, {
                        className: `settings-row`,
                        children: [
                            (0, j.jsx)(`span`, {
                                className: `settings-row-title`,
                                children: `Relay`,
                            }),
                            (0, j.jsx)(`span`, {
                                className: `settings-row-value text-break`,
                                children: n,
                            }),
                        ],
                    }),
                    (0, j.jsxs)(`div`, {
                        className: `settings-row`,
                        children: [
                            (0, j.jsx)(`span`, {
                                className: `settings-row-title`,
                                children: `Encryption`,
                            }),
                            (0, j.jsxs)(`span`, {
                                className: `settings-row-value`,
                                children: [
                                    (0, j.jsx)(M, { icon: r ? Me : je }),
                                    ` `,
                                    r ? `TLS` : `None`,
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            t.length > 0 &&
                (0, j.jsxs)(j.Fragment, {
                    children: [
                        (0, j.jsxs)(`h3`, {
                            className: `settings-heading`,
                            children: [
                                `Scripts`,
                                ` `,
                                (0, j.jsx)(`span`, {
                                    className: `badge rounded-pill text-bg-secondary`,
                                    children: t.length,
                                }),
                            ],
                        }),
                        (0, j.jsx)(`div`, {
                            className: `settings-group scripts-list`,
                            children: [...t]
                                .sort((e, t) => e.name.localeCompare(t.name))
                                .map((e) =>
                                    (0, j.jsxs)(
                                        `div`,
                                        {
                                            className: `settings-row`,
                                            children: [
                                                (0, j.jsxs)(`span`, {
                                                    className: `settings-row-text`,
                                                    children: [
                                                        (0, j.jsx)(`span`, {
                                                            className: `settings-row-title`,
                                                            children: e.name,
                                                        }),
                                                        (0, j.jsx)(`span`, {
                                                            className: `settings-row-help`,
                                                            children: e.description,
                                                        }),
                                                    ],
                                                }),
                                                (0, j.jsx)(`span`, {
                                                    className: `settings-row-value`,
                                                    children: e.version,
                                                }),
                                            ],
                                        },
                                        e.name,
                                    ),
                                ),
                        }),
                    ],
                }),
            (0, j.jsxs)(`p`, {
                className: `settings-note`,
                children: [
                    (0, j.jsx)(M, { icon: w }),
                    ` Settings are stored in this browser only.`,
                ],
            }),
        ],
    });
}
var Zs = { appearance: Ks, chat: qs, notifications: Js, shortcuts: Ys, about: Xs };
function Qs() {
    let e = wi((e) => e.modal === `settings`),
        [t, n] = (0, b.useState)(`appearance`),
        r = Zs[t];
    return (0, j.jsxs)(Vs, {
        id: `settingsModal`,
        open: e,
        labelledBy: `settingsTitle`,
        className: `settings-modal`,
        dialogClassName: `modal-lg modal-fullscreen-sm-down`,
        children: [
            (0, j.jsxs)(`div`, {
                className: `modal-header`,
                children: [
                    (0, j.jsxs)(`h2`, {
                        className: `modal-title h5 d-flex align-items-center gap-2`,
                        id: `settingsTitle`,
                        children: [(0, j.jsx)(M, { icon: nt }), ` Settings`],
                    }),
                    (0, j.jsx)(`button`, {
                        type: `button`,
                        className: `btn-close`,
                        onClick: Ti,
                        'aria-label': `Close`,
                    }),
                ],
            }),
            (0, j.jsxs)(`div`, {
                className: `settings-layout`,
                children: [
                    (0, j.jsx)(`nav`, {
                        className: `settings-nav`,
                        role: `tablist`,
                        'aria-label': `Settings sections`,
                        children: Hs.map((e) =>
                            (0, j.jsxs)(
                                `button`,
                                {
                                    type: `button`,
                                    role: `tab`,
                                    'aria-selected': t === e.id,
                                    className: `settings-nav-item${t === e.id ? ` active` : ``}${e.desktop ? ` desktop` : ``}`,
                                    onClick: (t) => {
                                        (n(e.id),
                                            t.currentTarget.scrollIntoView({
                                                block: `nearest`,
                                                inline: `nearest`,
                                            }));
                                    },
                                    children: [
                                        (0, j.jsx)(M, { icon: e.icon }),
                                        (0, j.jsx)(`span`, { children: e.label }),
                                    ],
                                },
                                e.id,
                            ),
                        ),
                    }),
                    (0, j.jsx)(`div`, {
                        className: `settings-panes modal-body`,
                        role: `tabpanel`,
                        children: (0, j.jsx)(r, {}),
                    }),
                ],
            }),
        ],
    });
}
function $s({ showNicklist: e }) {
    let t = Si(),
        [n, r] = xi((e) => {
            let t = 0,
                n = 0;
            for (let r of Object.values(e.buffers))
                ((t += r.unread), (n += r.notification));
            return `${t}:${n}`;
        })
            .split(`:`)
            .map(Number),
        i = ti((e) => `${e.host}:${e.port}`),
        a = [`buffer-name`];
    return (
        t?.type === `channel` && a.push(`channel`),
        t?.channelPrefix === `#` && a.push(`channel_hash`),
        t?.channelPrefix === `+` && a.push(`channel_plus`),
        t?.channelPrefix === `&` && a.push(`channel_ampersand`),
        (0, j.jsxs)(`header`, {
            id: `topbar`,
            children: [
                (0, j.jsxs)(`button`, {
                    type: `button`,
                    className: `btn btn-icon brand`,
                    title: `Connected to ${i}`,
                    'aria-label': `Buffers`,
                    onClick: () =>
                        A({
                            sidebarOpen: !Ci.getState().sidebarOpen,
                            nicklistOpen: !1,
                        }),
                    children: [
                        (0, j.jsx)(M, { icon: Pe, className: `mobile` }),
                        (0, j.jsx)(`img`, {
                            alt: ``,
                            src: `assets/img/favicon.png`,
                            className: `desktop`,
                        }),
                        n > 0 &&
                            (0, j.jsx)(`span`, {
                                className: `badge rounded-pill text-bg-secondary`,
                                children: n,
                            }),
                        r > 0 &&
                            (0, j.jsx)(`span`, {
                                className: `badge rounded-pill text-bg-danger`,
                                children: r,
                            }),
                    ],
                }),
                (0, j.jsx)(`div`, {
                    className: `title`,
                    onClick: () => A({ modal: `topic` }),
                    title: t?.titleText,
                    children:
                        t &&
                        (0, j.jsxs)(j.Fragment, {
                            children: [
                                (0, j.jsx)(`span`, {
                                    className: a.join(` `),
                                    children: t.trimmedName || t.fullName,
                                }),
                                t.modes &&
                                    (0, j.jsx)(`span`, {
                                        className: `buffer-modes`,
                                        children: t.modes,
                                    }),
                                (0, j.jsx)(`span`, {
                                    className: `buffer-title desktop`,
                                    children: (0, j.jsx)(Xo, { parts: t.title }),
                                }),
                            ],
                        }),
                }),
                (0, j.jsxs)(`div`, {
                    className: `actions`,
                    children: [
                        t?.hasNicklist &&
                            (0, j.jsx)(`button`, {
                                type: `button`,
                                className: `btn btn-icon${e ? ` active` : ``}`,
                                title: `Nicklist`,
                                'aria-label': `Toggle nicklist`,
                                onClick: Ni,
                                children: (0, j.jsx)(M, { icon: it }),
                            }),
                        (0, j.jsx)(`button`, {
                            type: `button`,
                            className: `btn btn-icon settings-toggle`,
                            title: `Settings`,
                            'aria-label': `Settings`,
                            onClick: () => A({ modal: `settings` }),
                            children: (0, j.jsx)(M, { icon: et }),
                        }),
                        (0, j.jsx)(`button`, {
                            type: `button`,
                            className: `btn btn-icon`,
                            title: `Disconnect from WeeChat`,
                            'aria-label': `Disconnect`,
                            onClick: () => k.disconnect(),
                            children: (0, j.jsx)(M, { icon: He }),
                        }),
                    ],
                }),
            ],
        })
    );
}
function ec() {
    let e = wi((e) => e.modal === `topic`),
        t = Si();
    return (0, j.jsxs)(Vs, {
        id: `topicModal`,
        open: e,
        labelledBy: `topicTitle`,
        children: [
            (0, j.jsxs)(`div`, {
                className: `modal-header`,
                children: [
                    (0, j.jsxs)(`h2`, {
                        className: `modal-title h5 d-flex align-items-center gap-2 text-break`,
                        id: `topicTitle`,
                        children: [
                            (0, j.jsx)(M, { icon: Te }),
                            ` `,
                            t?.shortName || t?.fullName,
                        ],
                    }),
                    (0, j.jsx)(`button`, {
                        type: `button`,
                        className: `btn-close`,
                        onClick: Ti,
                        'aria-label': `Close`,
                    }),
                ],
            }),
            t &&
                (0, j.jsxs)(`div`, {
                    className: `modal-body`,
                    children: [
                        (0, j.jsx)(`p`, {
                            className: `topic mb-2`,
                            children: t.titleText
                                ? (0, j.jsx)(Xo, {
                                      parts: t.title,
                                      onChannel: (e) => k.openQuery(t.id, e),
                                  })
                                : (0, j.jsx)(`span`, {
                                      className: `text-body-secondary`,
                                      children: `No topic.`,
                                  }),
                        }),
                        t.modes &&
                            (0, j.jsxs)(`p`, {
                                className: `small text-body-secondary mb-0`,
                                children: [`Modes: `, t.modes],
                            }),
                        (0, j.jsx)(`p`, {
                            className: `small text-body-secondary mb-0 text-break`,
                            children: t.fullName,
                        }),
                    ],
                }),
            (0, j.jsx)(`div`, {
                className: `modal-footer`,
                children: (0, j.jsx)(`button`, {
                    type: `button`,
                    className: `btn btn-primary`,
                    onClick: Ti,
                    children: `Close`,
                }),
            }),
        ],
    });
}
function tc() {
    let e = Si(),
        t = xi((e) => {
            let t = 0,
                n = 0;
            for (let r of Object.values(e.buffers))
                ((t += r.unread), (n += r.notification));
            return `${t}:${n}`;
        }),
        n = xi((e) => e.status === `connected` || e.status === `reconnecting`),
        r = ti((e) => e.useFavico);
    (0, b.useEffect)(() => {
        let [r, i] = t.split(`:`).map(Number);
        (fi(i, n ? e : void 0), hi(n ? i : 0, n ? r : 0), gi(n ? i : 0, n ? r : 0));
    }, [t, e, n, r]);
}
function nc() {
    (0, b.useEffect)(() => {
        let e = () => {
            let e = k.state.activeBufferId;
            document.visibilityState === `visible` && e !== null && k.markRead(e);
        };
        return (
            document.addEventListener(`visibilitychange`, e),
            () => document.removeEventListener(`visibilitychange`, e)
        );
    }, []);
}
function rc() {
    let e = xi((e) => e.status),
        t = xi((e) => e.upgrading),
        n = xi((e) => e.quitting);
    return (0, j.jsxs)(j.Fragment, {
        children: [
            e === `reconnecting` &&
                (0, j.jsxs)(`div`, {
                    id: `reconnect`,
                    className: `status-banner alert alert-warning`,
                    role: `status`,
                    children: [
                        (0, j.jsx)(M, { icon: We, spin: !0 }),
                        (0, j.jsxs)(`span`, {
                            children: [
                                (0, j.jsx)(`strong`, {
                                    children: `Connection to WeeChat lost.`,
                                }),
                                ` `,
                                t && `WeeChat is upgrading. `,
                                `Reconnecting…`,
                            ],
                        }),
                        (0, j.jsx)(`button`, {
                            type: `button`,
                            className: `btn btn-sm btn-outline-dark`,
                            onClick: () => void k.reconnect(),
                            children: `Reconnect now`,
                        }),
                    ],
                }),
            n &&
                e === `connected` &&
                (0, j.jsxs)(`div`, {
                    className: `status-banner alert alert-info`,
                    role: `status`,
                    children: [
                        (0, j.jsx)(M, { icon: w }),
                        (0, j.jsx)(`span`, { children: `WeeChat is quitting.` }),
                    ],
                }),
        ],
    });
}
function ic() {
    let e = Si(),
        t = wi((e) => e.sidebarOpen),
        n = wi((e) => e.nicklistOpen),
        r = ti((e) => e.nonicklist),
        i = ti((e) => e.alwaysnicklist),
        a = vi(),
        o =
            e !== void 0 &&
            e.hasNicklist &&
            e.nicklistLoaded &&
            Object.keys(e.nicks).length > 0 &&
            (a ? i || n : !r);
    return (
        (0, b.useEffect)(() => {
            vi() && Ci.getState().sidebarOpen && e && A({ sidebarOpen: !1 });
        }, [e?.id === void 0]),
        (0, j.jsxs)(`div`, {
            className: `content`,
            id: `content`,
            'data-sidebar': t ? `visible` : `hidden`,
            children: [
                (0, j.jsx)($s, { showNicklist: o }),
                (0, j.jsx)(ps, {}),
                (0, j.jsx)(`div`, {
                    className: `panel-backdrop`,
                    onClick: () => A({ sidebarOpen: !1, nicklistOpen: !1 }),
                }),
                o && e && (0, j.jsx)(Ps, { buffer: e }),
                (0, j.jsx)(ds, {}),
                (0, j.jsx)(`footer`, {
                    className: `footer`,
                    children: e && (0, j.jsx)(Cs, { buffer: e }),
                }),
            ],
        })
    );
}
function ac() {
    let e = xi((e) => e.status);
    return (
        tc(),
        nc(),
        (0, j.jsxs)(j.Fragment, {
            children: [
                e === `connected` || e === `reconnecting`
                    ? (0, j.jsx)(ic, {})
                    : (0, j.jsx)(Ms, {}),
                (0, j.jsx)(rc, {}),
                (0, j.jsx)(Qs, {}),
                (0, j.jsx)(ec, {}),
            ],
        })
    );
}
var oc = 0,
    sc,
    cc = () => {
        let e = document.getElementById(`sendMessage`);
        e && (e.focus(), e.setSelectionRange(e.value.length, e.value.length));
    };
function lc(e) {
    let t = /^Digit(\d)$/.exec(e.code) ?? /^Numpad(\d)$/.exec(e.code);
    return t ? Number(t[1]) : /^\d$/.test(e.key) ? Number(e.key) : null;
}
function uc(e) {
    if (
        (k.state.status !== `connected` && k.state.status !== `reconnecting`) ||
        e.getModifierState?.(`AltGraph`)
    )
        return;
    let t = Ci.getState(),
        n = ni(),
        r = e.altKey && !e.ctrlKey && !e.metaKey,
        i = e.key.toLowerCase(),
        a = lc(e);
    if ((t.showQuickKeys && A({ showQuickKeys: !1 }), t.jumpMode)) {
        if (!e.altKey && a !== null) {
            if ((e.preventDefault(), t.jumpDigit === null)) {
                A({ jumpDigit: a });
                return;
            }
            let n = ki().find((e) => e.jumpKey === t.jumpDigit * 10 + a);
            (A({ jumpMode: !1, jumpDigit: null }), n && Ai(n.buffer.id));
            return;
        }
        A({ jumpMode: !1, jumpDigit: null });
    }
    if (e.key === `Escape`) {
        if (t.modal) {
            (e.preventDefault(), A({ modal: null }));
            return;
        }
        (Date.now() - oc <= 500 && k.disconnect(), (oc = Date.now()));
        return;
    }
    if (r) {
        if (a !== null && n.enableQuickKeys) {
            let t = ki().find((e) => e.quickKey === String(a));
            t && (e.preventDefault(), Ai(t.buffer.id));
            return;
        }
        switch (i) {
            case `n`:
                (e.preventDefault(), Ni());
                break;
            case `a`:
                (e.preventDefault(), Mi());
                break;
            case `arrowup`:
            case `arrowdown`:
                (e.preventDefault(), ji(i === `arrowup` ? -1 : 1));
                break;
            case `l`:
                (e.preventDefault(), cc());
                break;
            case `g`:
                (e.preventDefault(),
                    A({ sidebarOpen: !0 }),
                    setTimeout(() => document.getElementById(`bufferFilter`)?.focus()));
                break;
            case `h`:
                (e.preventDefault(), k.clearAllHotlists());
                break;
            case `j`:
                (e.preventDefault(), A({ jumpMode: !0, jumpDigit: null, search: `` }));
                break;
            case `alt`:
                n.enableQuickKeys && !e.shiftKey && A({ showQuickKeys: !0 });
                break;
            default:
                (e.key === `<` ||
                    e.code === `IntlBackslash` ||
                    e.code === `Backquote`) &&
                    (e.preventDefault(),
                    k.state.previousBufferId !== null && Ai(k.state.previousBufferId));
        }
    }
}
function dc(e) {
    e.key === `Alt` &&
        (clearTimeout(sc), (sc = setTimeout(() => A({ showQuickKeys: !1 }), 1e3)));
}
function fc() {
    return (
        document.addEventListener(`keydown`, uc),
        document.addEventListener(`keyup`, dc),
        () => {
            (document.removeEventListener(`keydown`, uc),
                document.removeEventListener(`keyup`, dc));
        }
    );
}
(Bs(),
    fc(),
    (0, ee.createRoot)(document.getElementById(`root`)).render(
        (0, j.jsx)(b.StrictMode, { children: (0, j.jsx)(ac, {}) }),
    ),
    Ts());
export { u as a, d as i, o as n, c as r, s as t };
//# sourceMappingURL=index-D2wwdsFV.js.map
