import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_LASTFM_API_KEY!;
const USERNAME = process.env.NEXT_PUBLIC_LASTFM_USERNAME!;
const API_URL = "https://ws.audioscrobbler.com/2.0/";

/**
 * GET Handler
 * @returns Response with total scrobbles
 */
export async function GET() {
  try {
    const res = await fetch(
      `${API_URL}?method=user.getinfo&user=${USERNAME}&api_key=${API_KEY}&format=json`
    );

    console.log(
      `${API_URL}?method=user.getinfo&user=${USERNAME}&api_key=${API_KEY}&format=json`
    );

    if (!res.ok) throw new Error("Failed to fetch user info");

    const data = await res.json();
    const totalScrobbles = parseInt(data.user.playcount, 10);

    return NextResponse.json({ totalScrobbles });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch total scrobbles" },
      { status: 500 }
    );
  }
}
