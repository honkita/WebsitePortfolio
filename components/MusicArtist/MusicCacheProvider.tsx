// components/MusicCacheProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Artist } from "../../types/Music";
import {
    fetchFresh,
    getCache,
    subscribe,
    startAutoRefresh,
    isStale
} from "@lib/musicCache";

type ContextValue = {
    artists: Artist[];
    scrobbles: number | null;
    loading: boolean;
    refresh: () => Promise<void>;
    lastUpdated: number | null;
};

const MusicCacheContext = createContext<ContextValue | undefined>(undefined);

export function MusicCacheProvider({
    children
}: {
    children: React.ReactNode;
}) {
    const initial = getCache();
    const [artists, setArtists] = useState<Artist[]>(initial?.artists ?? []);
    const [scrobbles, setScrobbles] = useState<number | null>(
        initial?.scrobbles ?? null
    );
    const [loading, setLoading] = useState<boolean>(() => !initial);
    const [lastUpdated, setLastUpdated] = useState<number | null>(
        initial?.timestamp ?? null
    );

    useEffect(() => {
        // subscribe to global cache updates
        const unsub = subscribe(
            ({
                artists,
                scrobbles,
                timestamp
            }: {
                artists: Artist[];
                scrobbles: number | null;
                timestamp: number;
            }) => {
                setArtists(artists);
                setScrobbles(scrobbles);
                setLastUpdated(timestamp);
                setLoading(false);
            }
        );

        // Initial cache is stale, trigger a background refresh
        if (initial) {
            setLoading(false);
            if (isStale()) {
                // fire and forget; provider will update when fetchFresh resolves
                fetchFresh().catch((e: unknown) => console.error(e));
            }
        } else {
            // no initial -> fetch
            (async () => {
                setLoading(true);
                try {
                    await fetchFresh();
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            })();
        }

        // start site-wide auto refresh (idempotent)
        startAutoRefresh();

        return () => unsub();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refresh = async () => {
        setLoading(true);
        try {
            await fetchFresh();
        } finally {
            setLoading(false);
        }
    };

    return (
        <MusicCacheContext.Provider
            value={{ artists, scrobbles, loading, refresh, lastUpdated }}
        >
            {children}
        </MusicCacheContext.Provider>
    );
}

export function useMusicCache() {
    const ctx = useContext(MusicCacheContext);
    if (!ctx)
        throw new Error("useMusicCache must be used within MusicCacheProvider");
    return ctx;
}
