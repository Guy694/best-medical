"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

/* =========================================================
   Toasts + confirm dialog
   ========================================================= */
const ToastCtx = createContext(null);

const ICONS = {
  success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  error: <AlertCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-brand-500" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback(
    (type, message, opts = {}) => {
      const id = ++idRef.current;
      setToasts((t) => [...t.slice(-3), { id, type, message, title: opts.title, action: opts.action }]);
      setTimeout(() => dismiss(id), opts.duration || (type === "error" ? 6000 : 3500));
      return id;
    },
    [dismiss]
  );

  const confirm = useCallback(
    (opts) =>
      new Promise((resolve) => {
        setDialog({
          title: "ยืนยันการทำรายการ",
          confirmText: "ยืนยัน",
          cancelText: "ยกเลิก",
          tone: "primary",
          ...(typeof opts === "string" ? { message: opts } : opts),
          resolve,
        });
      }),
    []
  );

  const closeDialog = (result) => {
    dialog?.resolve(result);
    setDialog(null);
  };

  const value = useMemo(
    () => ({
      success: (m, o) => push("success", m, o),
      error: (m, o) => push("error", m, o),
      info: (m, o) => push("info", m, o),
      confirm,
    }),
    [push, confirm]
  );

  return (
    <ToastCtx.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm animate-slide-in-right items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur"
          >
            <span className="mt-0.5 shrink-0">{ICONS[t.type]}</span>
            <div className="min-w-0 flex-1 text-sm">
              {t.title && <p className="font-semibold text-slate-900">{t.title}</p>}
              <p className="text-slate-600">{t.message}</p>
              {t.action && (
                <button
                  onClick={() => {
                    t.action.onClick();
                    dismiss(t.id);
                  }}
                  className="mt-2 text-sm font-semibold text-brand-700 hover:underline"
                >
                  {t.action.label}
                </button>
              )}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-slate-400 hover:text-slate-600" aria-label="ปิด">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {dialog && (
        <div
          className="fixed inset-0 z-[110] flex animate-fade-in items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => closeDialog(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md animate-slide-up rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                  dialog.tone === "danger" ? "bg-red-100 text-red-600" : "bg-brand-100 text-brand-700"
                }`}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{dialog.title}</h3>
                {dialog.message && <p className="mt-1 text-sm text-slate-600">{dialog.message}</p>}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn btn-secondary" onClick={() => closeDialog(false)}>
                {dialog.cancelText}
              </button>
              <button
                autoFocus
                className={`btn ${dialog.tone === "danger" ? "btn-danger" : "btn-primary"}`}
                onClick={() => closeDialog(true)}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);

/* =========================================================
   Auth (httpOnly cookie session; this only mirrors it client-side)
   ========================================================= */
const AuthCtx = createContext(null);
const IDLE_LIMIT = 30 * 60 * 1000; // auto logout after 30 min inactivity

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastActivity = useRef(Date.now());

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user || null);
      return data.user || null;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // clean up legacy client-side session storage
    try {
      localStorage.removeItem("user");
    } catch {}
  }, [refresh]);

  const login = useCallback(async (email, password) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.error || "เข้าสู่ระบบไม่สำเร็จ");
      err.data = data;
      throw err;
    }
    setUser(data.user);
    lastActivity.current = Date.now();
    return data.user;
  }, []);

  const logout = useCallback(async ({ redirect = "/" } = {}) => {
    await fetch("/api/auth", { method: "DELETE" }).catch(() => {});
    setUser(null);
    if (redirect) window.location.href = redirect;
  }, []);

  // idle timeout
  useEffect(() => {
    if (!user) return;
    const mark = () => (lastActivity.current = Date.now());
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    const timer = setInterval(() => {
      if (Date.now() - lastActivity.current > IDLE_LIMIT) {
        logout({ redirect: "/login?expired=1" });
      }
    }, 60_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, mark));
      clearInterval(timer);
    };
  }, [user, logout]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isStaff: user?.role === "ADMIN" || user?.role === "STAFF",
      isAdmin: user?.role === "ADMIN",
      refresh,
      login,
      logout,
    }),
    [user, loading, refresh, login, logout]
  );
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

/* =========================================================
   Cart (localStorage; prices are re-validated by the server on checkout)
   ========================================================= */
const CartCtx = createContext(null);
const CART_KEY = "bm_cart_v2";

function readLegacyCookieCart() {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith("cart="));
    if (!raw) return [];
    const items = JSON.parse(decodeURIComponent(raw.slice(5)));
    document.cookie = "cart=; Max-Age=0; path=/";
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function normalize(items) {
  const map = new Map();
  for (const it of items || []) {
    const id = Number(it.id ?? it.product_id);
    if (!id) continue;
    const qty = Math.max(1, Math.min(999, parseInt(it.quantity, 10) || 1));
    const prev = map.get(id);
    map.set(id, {
      id,
      name: it.name || it.pro_name || "สินค้า",
      price: Number(it.price) || 0,
      image: it.image || it.imageUrl || null,
      delivery: Number(it.delivery) || 0,
      stock: it.stock != null ? Number(it.stock) : null,
      quantity: prev ? Math.min(999, prev.quantity + qty) : qty,
    });
  }
  return [...map.values()];
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored = [];
    try {
      stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch {}
    setItems(normalize([...stored, ...readLegacyCookieCart()]));
    setReady(true);

    const onStorage = (e) => {
      if (e.key === CART_KEY) {
        try {
          setItems(normalize(JSON.parse(e.newValue || "[]")));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback((product, quantity = 1) => {
    setItems((cur) => {
      const id = Number(product.id);
      const max = product.stock != null ? Math.max(1, Number(product.stock)) : 999;
      const exists = cur.find((i) => i.id === id);
      if (exists) {
        return cur.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(max, i.quantity + quantity), price: Number(product.price), stock: product.stock ?? i.stock } : i
        );
      }
      return [
        ...cur,
        {
          id,
          name: product.pro_name || product.name,
          price: Number(product.price),
          image: product.imageUrl || product.image || null,
          delivery: Number(product.delivery) || 0,
          stock: product.stock != null ? Number(product.stock) : null,
          quantity: Math.min(max, quantity),
        },
      ];
    });
  }, []);

  const update = useCallback((id, quantity) => {
    setItems((cur) =>
      cur.map((i) => {
        if (i.id !== id) return i;
        const max = i.stock != null && i.stock > 0 ? i.stock : 999;
        return { ...i, quantity: Math.max(1, Math.min(max, parseInt(quantity, 10) || 1)) };
      })
    );
  }, []);

  const remove = useCallback((id) => setItems((cur) => cur.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);
  const replace = useCallback((next) => setItems(normalize(next)), []);

  const value = useMemo(() => {
    const count = items.reduce((s, i) => s + i.quantity, 0);
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const delivery = items.reduce((s, i) => s + (i.delivery || 0) * i.quantity, 0);
    return { items, ready, count, subtotal, delivery, add, update, remove, clear, replace };
  }, [items, ready, add, update, remove, clear, replace]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export const useCart = () => useContext(CartCtx);

/* ========================================================= */
export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
