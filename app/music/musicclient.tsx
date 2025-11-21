"use client";

import { useEffect, useState } from "react";

// Child Components
import LastFMTitle from "@components/Title/LastFMTitle";

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
            <LastFMTitle
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
                        <div className={styles.jobGrid}>
                            {sortedArtists.map(({ name, playcount, image }) => (
                                <div
                                    key={name}
                                    className="flex justify-between items-center rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 shadow-sm hover:shadow-md transition-all"
                                >
                                    <div>
                                        <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                            {name} 🎧{" "}
                                            {playcount.toLocaleString()}
                                            <img
                                                src={image}
                                                alt={`${name} image`}
                                            />
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full"></div>
                </div>
            </div>
        </div>
    );
}
