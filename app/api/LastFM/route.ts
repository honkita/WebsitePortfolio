// app/api/lastfm/route.ts
import { Redis } from "@upstash/redis";

export const runtime = "nodejs"; // SSE requires Node runtime

const REFRESH_MS = 10000; // 10 seconds
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

interface LastFMTrack {
  name: string;
  artist: { "#text": string };
  album: { "#text": string };
  url: string;
  image?: { "#text": string; size: string }[];
}

// Fetch latest track from LastFM and store in Redis
async function fetchTrack(): Promise<LastFMTrack | null> {
  const apiKey = process.env.NEXT_PUBLIC_LASTFM_KEY!;
  const username = process.env.NEXT_PUBLIC_LASTFM_USER!;
  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`,
      { cache: "no-store" }
    );
    const data = await res.json();
    const track: LastFMTrack | null = data.recenttracks?.track?.[0] ?? null;

    await redis.set("lastfm:track", JSON.stringify(track));
    await redis.set("lastfm:lastFetch", Date.now().toString());

    return track;
  } catch (err) {
    console.error("Error fetching LastFM:", err);
    return null;
  }
}

// Get cached track from Redis or refresh if stale
async function getCachedTrack(): Promise<LastFMTrack | null> {
  const lastFetchStr = await redis.get<string>("lastfm:lastFetch");
  const lastFetch = lastFetchStr ? Number(lastFetchStr) : 0;

  if (Date.now() - lastFetch > REFRESH_MS) {
    return await fetchTrack();
  }

  const cached = await redis.get<string>("lastfm:track");
  if (!cached) return null;

  try {
    return JSON.parse(cached) as LastFMTrack;
  } catch (err) {
    console.error("Error parsing cached track:", err);
    return null;
  }
}

// SSE endpoint
export async function GET(req: Request) {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      async function sendUpdate() {
        const track = await getCachedTrack();
        const payload = JSON.stringify({ track, epoch: Date.now() });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      }

      // Send initial update immediately
      await sendUpdate();

      // Repeat every REFRESH_MS
      const interval = setInterval(sendUpdate, REFRESH_MS);

      // Clean up when client disconnects
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
