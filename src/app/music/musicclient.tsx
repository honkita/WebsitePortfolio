"use client";

import { useEffect, useState } from "react";

// Child Components
import MusicTitle from "@/components/Title/MusicTitle";
import MusicArtist from "@/components/MusicArtist/MusicArtist";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import styles from "@/app/ui/home.module.css";
import utilStyles from "@/app/ui/theme.util.module.css";

// Utils
import { getUserInfo } from "@/utils/userData";

// Types
import {
    artistAlbumTopAlbum,
    artistAlbumContainerMapType
} from "@/types/Music";

/**
 * Clientside Music Page
 * @returns
 */
const MusicClient = () => {
    // State variables
    const [artists, setArtists] = useState<Record<string, artistAlbumTopAlbum>>(
        {}
    );
    const [scrobbles, setScrobbles] = useState<number | null>(null);

    const [artistAlbums, setArtistAlbums] =
        useState<artistAlbumContainerMapType>({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [progress, setProgress] = useState(0);
    const [totalPagesLoading, setTotalPagesLoading] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);

    const [errorArtists, setErrorArtists] = useState<string | null>(null);
    const [errorScrobbles, setErrorScrobbles] = useState<string | null>(null);

    const [scrobbleCount, setScrobbleCount] = useState(0);
    const PAGE_SIZE = 64;

    useEffect(() => {
        const fetchArtists = async (user: string) => {
            try {
                setLoading(true);
                setError(null);

                const res = await getUserInfo(user, (current, total) => {
                    setProgress(current);
                    setTotalPagesLoading(total);
                });

                const allData: artistAlbumContainerMapType =
                    res?.["All Data"] ?? {};
                const bestAlbums = res?.["Best Albums"] ?? {};

                setArtistAlbums(allData);
                setArtists(bestAlbums);

                setCurrentPage(1); // reset pagination on new fetch
            } catch (err: unknown) {
                if (err instanceof Error) setError(err.message);
                else setError("An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchArtists("honkita");
    }, []);

    useEffect(() => {
        // Fetch scrobbles
        const fetchScrobbles = async () => {
            try {
                const res = await fetch("/api/Scrobbles");
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

    const totalPages = Math.ceil(sortedArtists.length / PAGE_SIZE);

    const paginatedArtists = sortedArtists.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    return (
        <div className={styles.pageContainer}>
            {title(sortedArtists.length, scrobbles ?? 0)}
            <div className={divstyling.hr} style={{ marginTop: "3rem" }} />
            {loading && totalPagesLoading > 0 && (
                <div className={styles.loadingWidth}>
                    <div className={styles.loadingContainer}>
                        <div
                            style={{
                                width: `${
                                    (progress / totalPagesLoading) * 100
                                }%`
                            }}
                            className={styles.loadingBarAccent}
                        />
                    </div>
                    <div>
                        Loading data{" "}
                        {((progress / totalPagesLoading) * 100).toFixed(2)}%
                    </div>
                </div>
            )}

            <div className={styles.contentWrapper}>
                <div className={styles.container}>
                    <div className={styles.artistGrid}>
                        {paginatedArtists.map(
                            ({ name, playcount, topAlbumImage }, index) => (
                                <MusicArtist
                                    key={name}
                                    name={name}
                                    image={topAlbumImage}
                                    scrobbles={playcount}
                                    albums={artistAlbums[name].albums}
                                    rank={index + 1}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
            {progress / totalPagesLoading === 1 && (
                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Previous
                    </button>

                    <span style={{ margin: "0 1rem" }}>
                        Page {currentPage} / {totalPages || 1}
                    </span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default MusicClient;
