// Browser-side analytics: anonymous first-party ids, no cookies, no third parties.

const VID_KEY = "bm_vid";
const SID_KEY = "bm_sid";
const SESSION_IDLE = 30 * 60 * 1000;

const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => (b % 36).toString(36)).join("");

function safe(fn, fallback) {
  try {
    return fn();
  } catch {
    return fallback;
  }
}

/** Returns { vid, sid, isNew, landing } and refreshes the session timestamp. */
export function getIds({ touch = true } = {}) {
  if (typeof window === "undefined") return {};
  return safe(() => {
    let isNew = false;
    let vid = localStorage.getItem(VID_KEY);
    if (!vid || vid.length !== 16) {
      vid = rid();
      localStorage.setItem(VID_KEY, vid);
      isNew = true;
    }
    let landing = false;
    let s = JSON.parse(localStorage.getItem(SID_KEY) || "null");
    if (!s || !s.id || Date.now() - s.t > SESSION_IDLE) {
      s = { id: rid(), t: Date.now() };
      landing = true;
    }
    if (touch) {
      s.t = Date.now();
      localStorage.setItem(SID_KEY, JSON.stringify(s));
    }
    return { vid, sid: s.id, isNew, landing };
  }, {});
}

/** Headers attached to API calls so the server can attribute purchases. */
export function analyticsHeaders() {
  const { vid, sid } = getIds({ touch: false });
  return vid && sid ? { "x-bm-vid": vid, "x-bm-sid": sid } : {};
}

export function track(event, data = {}) {
  if (typeof window === "undefined") return;
  if (navigator.doNotTrack === "1") return;
  const { vid, sid, isNew, landing } = getIds();
  if (!vid) return;
  const payload = JSON.stringify({
    e: event,
    vid,
    sid,
    isNew,
    landing: event === "pageview" ? landing : false,
    path: location.pathname + location.search,
    ref: event === "pageview" && landing ? document.referrer : undefined,
    ...data,
  });
  safe(() => {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track", { method: "POST", body: payload, headers: { "Content-Type": "application/json" }, keepalive: true });
    }
  });
}
