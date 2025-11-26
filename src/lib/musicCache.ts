import type { Artist } from "@/types/Music";

export type Payload = {
  artists: Artist[];
  scrobbles: number | null;
  timestamp: number;
};

export type Listener = (p: Payload) => void;

type MusicCacheStore = {
  payload: Payload | null;
  listeners: Listener[];
  fetching: boolean;
};

type ScrobbleResponse = {
  totalScrobbles?: unknown;
};

declare global {
  // Global cache instance on the server/client
  var __MUSIC_CACHE__: MusicCacheStore | undefined;

  // For interval idempotence
  var __MUSIC_CACHE_INTERVAL__: ReturnType<typeof setInterval> | undefined;
}

//
// CONSTANTS
//

const FIVE_MIN = 5 * 60 * 1000;

//
// INITIALIZE GLOBAL STORE SAFELY
//

if (!globalThis.__MUSIC_CACHE__) {
  globalThis.__MUSIC_CACHE__ = {
    payload: null,
    listeners: [],
    fetching: false,
  };
}

const STORE = globalThis.__MUSIC_CACHE__!;

//
// FETCH + UPDATE CACHE
//

export async function fetchFresh(): Promise<Payload | null> {
  if (STORE.fetching) return STORE.payload;

  try {
    STORE.fetching = true;

    const [artistsRes, scrobblesRes] = await Promise.all([
      fetch("/api/artists"),
      fetch("/api/scrobbles"),
    ]);

    if (!artistsRes.ok) throw new Error("Failed to fetch artists");
    if (!scrobblesRes.ok) throw new Error("Failed to fetch scrobbles");

    const artists = (await artistsRes.json()) as Artist[];

    // ---- SAFE SCROBBLE JSON PARSE ----
    const scrobblesJson: ScrobbleResponse = await scrobblesRes.json();

    let scrobbles: number | null = null;

    if (
      scrobblesJson &&
      typeof scrobblesJson === "object" &&
      "totalScrobbles" in scrobblesJson
    ) {
      const val = scrobblesJson.totalScrobbles;
      if (typeof val === "number") scrobbles = val;
    }

    // -------------------------------

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

//
// CACHE ACCESS
//

export function getCache(): Payload | null {
  return STORE.payload;
}

export function isStale(maxAge = FIVE_MIN): boolean {
  const p = STORE.payload;
  if (!p) return true;
  return Date.now() - p.timestamp > maxAge;
}

//
// SUBSCRIBE
//

export function subscribe(cb: Listener): () => void {
  STORE.listeners.push(cb);

  return () => {
    const idx = STORE.listeners.indexOf(cb);
    if (idx >= 0) STORE.listeners.splice(idx, 1);
  };
}

//
// AUTO REFRESH LOOP
//

export function startAutoRefresh(interval = FIVE_MIN) {
  if (globalThis.__MUSIC_CACHE_INTERVAL__) return;

  (async () => {
    if (!STORE.payload) await fetchFresh();
  })();

  const id = setInterval(() => {
    fetchFresh().catch((e) => console.error("musicCache refresh error:", e));
  }, interval);

  globalThis.__MUSIC_CACHE_INTERVAL__ = id;
}

export function stopAutoRefresh() {
  if (globalThis.__MUSIC_CACHE_INTERVAL__) {
    clearInterval(globalThis.__MUSIC_CACHE_INTERVAL__);
    globalThis.__MUSIC_CACHE_INTERVAL__ = undefined;
  }
}
