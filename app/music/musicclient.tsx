"use client";

import { useEffect, useState } from "react";

// Child Components
import MusicTitle from "@components/Title/MusicTitle";
import MusicArtist from "@components/MusicArtist/MusicArtist";

// CSS
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";
import divstyling from "@styles/divstyling.module.css";

// Types
import { Artist } from "../../types/Artist";

// ---------------------------
// GLOBAL IN-MEMORY CACHE
// ---------------------------
const FIVE_MIN = 5 * 60 * 1000;

const G = globalThis as any;

if (!G.__MUSIC_PAGE_CACHE__) {
    G.__MUSIC_PAGE_CACHE__ = {
        artists: null as Artist[] | null,
        scrobbles: null as number | null,
        timestamp: 0,
        fetching: false
    };
}

const CACHE = G.__MUSIC_PAGE_CACHE__;

async function fetchFreshData() {
    if (CACHE.fetching) return;

    CACHE.fetching = true;

    try {
        const [artistsRes, scrobblesRes] = await Promise.all([
            fetch("/api/artists"),
            fetch("/api/scrobbles")
        ]);

        if (!artistsRes.ok) throw new Error("Failed to fetch artists");
        if (!scrobblesRes.ok) throw new Error("Failed to fetch scrobbles");

        const artists = (await artistsRes.json()) as Artist[];
        const scrobblesData = await scrobblesRes.json();

        CACHE.artists = artists;
        CACHE.scrobbles = scrobblesData.totalScrobbles;
        CACHE.timestamp = Date.now();
    } catch (e) {
        console.error("Refresh error:", e);
    } finally {
        CACHE.fetching = false;
    }
}

export default function MusicClient() {
    const [artists, setArtists] = useState<Artist[]>(CACHE.artists ?? []);
    const [scrobbles, setScrobbles] = useState<number | null>(
        CACHE.scrobbles ?? null
    );
    const [loading, setLoading] = useState(CACHE.artists === null);
    const [error, setError] = useState<string | null>(null);

    // ---------------------------
    // LOAD & REFRESH DATA
    // ---------------------------
    useEffect(() => {
        const loadData = async () => {
            // If cache exists and is fresh, use it immediately
            if (CACHE.artists && Date.now() - CACHE.timestamp < FIVE_MIN) {
                setArtists(CACHE.artists);
                setScrobbles(CACHE.scrobbles);
                setLoading(false);
                return;
            }

            // If stale but present → show cache while refreshing in background
            if (CACHE.artists) {
                setArtists(CACHE.artists);
                setScrobbles(CACHE.scrobbles);
                setLoading(false);

                fetchFreshData().then(() => {
                    if (CACHE.artists) setArtists(CACHE.artists);
                    if (CACHE.scrobbles !== null) setScrobbles(CACHE.scrobbles);
                });
                return;
            }

            // No cache → must fetch fresh
            try {
                setLoading(true);
                await fetchFreshData();
                if (!CACHE.artists) throw new Error("Failed to fetch data");

                setArtists(CACHE.artists);
                setScrobbles(CACHE.scrobbles);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();

        // ---------------------------
        // AUTO-REFRESH EVERY 5 MINUTES
        // ---------------------------
        if (!G.__MUSIC_CACHE_INTERVAL__) {
            G.__MUSIC_CACHE_INTERVAL__ = setInterval(async () => {
                await fetchFreshData();
                if (CACHE.artists) setArtists([...CACHE.artists]);
                if (CACHE.scrobbles !== null) setScrobbles(CACHE.scrobbles);
            }, FIVE_MIN);
        }

        return () => {};
    }, []);

    // ---------------------------
    // RENDERING
    // ---------------------------
    function title(artists: number, scrobbles: number) {
        return (
            <MusicTitle
                name="Music"
                colour="green"
                artists={artists}
                scrobbles={scrobbles}
            />
        );
    }

    if (loading)
        return (
            <div className={styles.pageContainer}>
                {title(0, 0)}
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>
                <div className={styles.centeredContent}>
                    <section className={utilStyles.headingXl}>Loading</section>
                </div>
            </div>
        );

    if (error)
        return (
            <div className={styles.pageContainer}>
                {title(0, 0)}
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>
                <div className={styles.centeredContent}>
                    <section className={utilStyles.headingXl}>
                        Error with loading
                    </section>
                </div>
            </div>
        );

    const sortedArtists = [...artists].sort(
        (a, b) => b.playcount - a.playcount
    );

    return (
        <div className={styles.pageContainer}>
            {title(sortedArtists.length, scrobbles ?? 0)}
            <div className={divstyling.hr} style={{ marginTop: "3rem" }}></div>
            <div className={styles.contentWrapper}>
                <div className={styles.centeredContent}>
                    <div className={styles.container}>
                        <div className={styles.artistGrid}>
                            {sortedArtists.map(
                                ({ name, playcount, image }, index) => (
                                    <MusicArtist
                                        key={name}
                                        name={name}
                                        image={image}
                                        scrobbles={playcount}
                                        rank={index + 1}
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
