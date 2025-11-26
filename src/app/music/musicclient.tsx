"use client";

import { useEffect, useState } from "react";

// Child Components
import MusicTitle from "@/components/Title/MusicTitle";
import MusicArtist from "@/components/MusicArtist/MusicArtist";

// CSS
import styles from "@/app/ui/home.module.css";
import utilStyles from "@/app/ui/theme.util.module.css";
import divstyling from "@/styles/divstyling.module.css";

// Types
import { Artist } from "../../types/Music";

export default function MusicClient() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [scrobbles, setScrobbles] = useState<number | null>(null);

    const [loadingArtists, setLoadingArtists] = useState(true);
    const [loadingScrobbles, setLoadingScrobbles] = useState(true);

    const [errorArtists, setErrorArtists] = useState<string | null>(null);
    const [errorScrobbles, setErrorScrobbles] = useState<string | null>(null);

    useEffect(() => {
        // Fetch artists
        const fetchArtists = async () => {
            try {
                setLoadingArtists(true);
                const res = await fetch("/api/artists");
                if (!res.ok) throw new Error("Failed to fetch artists");
                const data = (await res.json()) as Artist[];
                setArtists(data);
            } catch (err: any) {
                setErrorArtists(err.message);
            } finally {
                setLoadingArtists(false);
            }
        };

        // Fetch scrobbles
        const fetchScrobbles = async () => {
            try {
                setLoadingScrobbles(true);
                const res = await fetch("/api/scrobbles");
                if (!res.ok) throw new Error("Failed to fetch scrobbles");
                const data = await res.json();
                setScrobbles(data.totalScrobbles);
            } catch (err: any) {
                setErrorScrobbles(err.message);
            } finally {
                setLoadingScrobbles(false);
            }
        };

        fetchArtists();
        fetchScrobbles();
    }, []);

    // ---------------------------
    // RENDERING
    // ---------------------------
    const title = (artistCount: number, scrobbleCount: number) => (
        <MusicTitle
            name="Music"
            colour="green"
            artists={artistCount}
            scrobbles={scrobbleCount}
        />
    );

    // Show loading text if **both** are loading
    if (loadingArtists && loadingScrobbles)
        return (
            <div className={styles.pageContainer}>
                {title(0, 0)}
                <div className={divstyling.hr} style={{ marginTop: "3rem" }} />
                <div className={styles.centeredContent}>
                    <section className={utilStyles.headingXl}>Loading</section>
                </div>
            </div>
        );

    // Show error if both failed
    if (errorArtists && errorScrobbles)
        return (
            <div className={styles.pageContainer}>
                {title(0, 0)}
                <div className={divstyling.hr} style={{ marginTop: "3rem" }} />
                <div className={styles.centeredContent}>
                    <section className={utilStyles.headingXl}>
                        Error loading data
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
            <div className={divstyling.hr} style={{ marginTop: "3rem" }} />
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
