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

export default function MusicClient() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [scrobbles, setScrobbles] = useState<number | null>(null);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const res = await fetch("/api/artists");
                if (!res.ok) throw new Error("Failed to fetch artists");
                const data: Artist[] = await res.json();
                setArtists(data);
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchArtists();
    }, []);

    useEffect(() => {
        const fetchScrobbles = async () => {
            try {
                const res = await fetch("/api/scrobbles");
                if (!res.ok) throw new Error("Failed to fetch scrobbles");
                const data = await res.json();
                setScrobbles(data.totalScrobbles);
            } catch (err) {
                console.error(err);
            }
        };

        fetchScrobbles();
    }, []);

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

    const sortedArtists = artists.sort((a, b) => b.playcount - a.playcount);

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
