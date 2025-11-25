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
import { Artist } from "../../types/Music";

export default function MusicClient() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [scrobbles, setScrobbles] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [artistsRes, scrobblesRes] = await Promise.all([
                    fetch("/api/artists"),
                    fetch("/api/scrobbles")
                ]);

                if (!artistsRes.ok) throw new Error("Failed to fetch artists");
                if (!scrobblesRes.ok)
                    throw new Error("Failed to fetch scrobbles");

                const artists = (await artistsRes.json()) as Artist[];
                const scrobblesData = await scrobblesRes.json();

                setArtists(artists);
                setScrobbles(scrobblesData.totalScrobbles);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // ---------------------------
    // RENDERING
    // ---------------------------
    const title = (artists: number, scrobbles: number) => (
        <MusicTitle
            name="Music"
            colour="green"
            artists={artists}
            scrobbles={scrobbles}
        />
    );

    if (loading)
        return (
            <div className={styles.pageContainer}>
                {title(0, 0)}
                <div className={divstyling.hr} style={{ marginTop: "3rem" }} />
                <div className={styles.centeredContent}>
                    <section className={utilStyles.headingXl}>Loading</section>
                </div>
            </div>
        );

    if (error)
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
