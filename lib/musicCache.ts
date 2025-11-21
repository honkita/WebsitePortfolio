import { Artist } from "../types/Artist";

type Payload = {
  artists: Artist[];
  scrobbles: number | null;
  timestamp: number;
};

type Listener = (p: Payload) => void;

const FIVE_MIN = 5 * 60 * 1000;

const G = globalThis as any;
if (!G.__MUSIC_CACHE__) {
  G.__MUSIC_CACHE__ = {
    payload: null as Payload | null,
    listeners: [] as Listener[],
    fetching: false,
  };
}
const STORE = G.__MUSIC_CACHE__ as {
  payload: Payload | null;
  listeners: Listener[];
  fetching: boolean;
};

export async function fetchFresh() {
  // If already fetching, return current payload (prevents duplicate requests)
  if (STORE.fetching) return STORE.payload;
  try {
    STORE.fetching = true;
    // fetch both endpoints in parallel
    const [artistsRes, scrobblesRes] = await Promise.all([
      fetch("/api/artists"),
      fetch("/api/scrobbles"),
    ]);

    if (!artistsRes.ok) throw new Error("Failed to fetch artists");
    if (!scrobblesRes.ok) throw new Error("Failed to fetch scrobbles");

    const artists = (await artistsRes.json()) as Artist[];
    const scrobblesData = await scrobblesRes.json();
    const scrobbles = scrobblesData?.totalScrobbles ?? null;

    const payload: Payload = {
      artists,
      scrobbles,
      timestamp: Date.now(),
    };

    STORE.payload = payload;
    STORE.listeners.forEach((l) => l(payload));
    return payload;
  } finally {
    STORE.fetching = false;
  }
}

export function getCache() {
  return STORE.payload;
}

export function isStale(maxAge = FIVE_MIN) {
  const p = STORE.payload;
  if (!p) return true;
  return Date.now() - p.timestamp > maxAge;
}

export function subscribe(cb: Listener) {
  STORE.listeners.push(cb);
  return () => {
    const idx = STORE.listeners.indexOf(cb);
    if (idx >= 0) STORE.listeners.splice(idx, 1);
  };
}

// Start background refresh loop (call once)
export function startAutoRefresh(interval = FIVE_MIN) {
  // idempotent: only create interval if not already running
  const G2 = globalThis as any;
  if (G2.__MUSIC_CACHE_INTERVAL__) return;
  // Immediately refresh if there's no payload
  (async () => {
    if (!STORE.payload) await fetchFresh();
  })();

  const id = setInterval(() => {
    // Always refresh in background; keep old data until new ready
    fetchFresh().catch((e) => {
      // swallow errors - keep old data
      console.error("musicCache refresh error:", e);
    });
  }, interval);

  G2.__MUSIC_CACHE_INTERVAL__ = id;
}

export function stopAutoRefresh() {
  const G2 = globalThis as any;
  if (G2.__MUSIC_CACHE_INTERVAL__) {
    clearInterval(G2.__MUSIC_CACHE_INTERVAL__);
    delete G2.__MUSIC_CACHE_INTERVAL__;
  }
}
