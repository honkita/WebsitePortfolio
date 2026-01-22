"use client";

import { useEffect, useState } from "react";

// Child Components
import MusicTitle from "@/components/Title/MusicTitle";
import MusicArtist from "@/components/MusicArtist/MusicArtist";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import styles from "@/app/ui/home.module.css";
import utilStyles from "@/app/ui/theme.util.module.css";

// Types
import { artistAlbumTopAlbum } from "@/types/Music";

/**
 * Clientside Music Page
 * @returns JSX.Element
 */
export default function MusicClient() {
    // State variables
    const [artists, setArtists] = useState<Record<string, artistAlbumTopAlbum>>(
        {}
    );
    const [scrobbles, setScrobbles] = useState<number | null>(null);

    const [artistCount, setArtistCount] = useState(0);
    const [scrobbleCount, setScrobbleCount] = useState(0);

    const [errorArtists, setErrorArtists] = useState<string | null>(null);
    const [errorScrobbles, setErrorScrobbles] = useState<string | null>(null);

    useEffect(() => {
        // Fetch artists
        const fetchArtists = async () => {
            try {
                const res = await fetch("/api/artists");
                if (!res.ok) throw new Error("Failed to fetch artists");
                const data = (await res.json()) as Record<
                    string,
                    artistAlbumTopAlbum
                >;
                setArtists(data);
                setErrorArtists(null);
            } catch (err: any) {
                // Retry after 1 second
                setTimeout(() => setArtistCount((c) => c + 1), 1000);
            }
        };
        fetchArtists();
    }, [artistCount]);

    useEffect(() => {
        // Fetch scrobbles
        const fetchScrobbles = async () => {
            try {
                const res = await fetch("/api/scrobbles");
                if (!res.ok) throw new Error("Failed to fetch scrobbles");
                const data = await res.json();
                setScrobbles(data.totalScrobbles);
                setErrorScrobbles(null);
            } catch (err: any) {
                // Retry after 1 second
                setTimeout(() => setScrobbleCount((c) => c + 1), 1000);
            }
        };
        fetchScrobbles();
    }, [scrobbleCount]);

    // Title Component
    const title = (artistCount: number, scrobbleCount: number) => (
        <MusicTitle
            name="Music"
            colour="green"
            artists={artistCount}
            scrobbles={scrobbleCount}
        />
    );

    // Show error if both failed
    if ((errorArtists && errorScrobbles) || errorArtists)
        return (
            <div className={styles.pageContainer}>
                {title(0, scrobbles ?? 0)}
                <div className={divstyling.hr} style={{ marginTop: "3rem" }} />
                <div className={styles.centeredContent}>
                    <section className={utilStyles.headingMd}>
                        Error loading data
                    </section>
                </div>
            </div>
        );

    // Sorts the artists in descending order of playcount
    const sortedArtists = Object.values(artists).sort(
        (a, b) => b.playcount - a.playcount
    );

    return (
        <div className={styles.pageContainer}>
            {title(sortedArtists.length, scrobbles ?? 0)}
            <div className={divstyling.hr} style={{ marginTop: "3rem" }} />
            <div className={styles.contentWrapper}>
                <div className={styles.container}>
                    <div className={styles.artistGrid}>
                        {sortedArtists.map(
                            ({ name, playcount, topAlbumImage }, index) => (
                                <MusicArtist
                                    key={name}
                                    name={name}
                                    image={topAlbumImage}
                                    scrobbles={playcount}
                                    rank={index + 1}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
