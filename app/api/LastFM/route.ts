import { NextResponse } from "next/server";

// Types
interface LastFmTrack {
  artist?: { "#text": string };
  name?: string;
  album?: { "#text": string };
  image?: { "#text": string; size: string }[];
  date?: { uts: string; "#text": string };
  [key: string]: any;
}

// In-memory cache
let cache: LastFmTrack | null = null;
let lastFetch = 0;
const CACHE_TTL = 15 * 1000; // 15 seconds

export async function GET() {
  const now = Date.now();

  if (cache && now - lastFetch < CACHE_TTL) {
    return NextResponse.json(cache);
  }

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${process.env.LASTFM_USER}&api_key=${process.env.LASTFM_KEY}&format=json&limit=1`
    );

    const data = await res.json();
    const recentTrack: LastFmTrack | null =
      data.recenttracks.track?.[0] || null;

    cache = recentTrack;
    lastFetch = now;

    return NextResponse.json(recentTrack);
  } catch (err) {
    console.error("Error fetching Last.fm API:", err);
    return NextResponse.json(null);
  }
}
