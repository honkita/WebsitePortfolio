"use client";

import { useEffect, useState } from "react";
import { Artist } from "../../types/Artist";

export default function MusicClient() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <p className="text-zinc-700 dark:text-zinc-300">
                    Loading your artists…
                </p>
            </div>
        );

    if (error)
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
                <p className="text-red-600 dark:text-red-400">⚠️ {error}</p>
            </div>
        );

    const sortedArtists = artists.sort((a, b) => b.playcount - a.playcount);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-20 px-8 bg-white dark:bg-zinc-900 sm:items-start">
                <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-2">
                    ({sortedArtists.length})
                </h1>
                <div className="flex flex-col gap-4 w-full">
                    {sortedArtists.map(({ name, playcount, aliases }) => (
                        <div
                            key={name}
                            className="flex justify-between items-center rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 shadow-sm hover:shadow-md transition-all"
                        >
                            <div>
                                <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                    {name}
                                </span>
                            </div>
                            <span className="text-zinc-600 dark:text-zinc-400">
                                🎧 {playcount.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
