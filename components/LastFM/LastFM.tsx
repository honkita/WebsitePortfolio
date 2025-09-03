"use client";

import React, { useEffect, useRef, useState } from "react";
import LastFMCSS from "./LastFMCSS.module.css";

interface LastFmTrack {
    artist: { "#text": string };
    name: string;
    album: { "#text": string };
    image: { size: string; "#text": string }[];
    url: string;
}

const LastFM: React.FC = () => {
    const [track, setTrack] = useState<LastFmTrack | null>(null);
    const [scrollConfigs, setScrollConfigs] = useState({
        title: { distance: 0, duration: 0 },
        artist: { distance: 0, duration: 0 },
        album: { distance: 0, duration: 0 },
        pauseFraction: 0.2 // 20% pause at the end
    });

    const titleRef = useRef<HTMLDivElement>(null);
    const artistRef = useRef<HTMLDivElement>(null);
    const albumRef = useRef<HTMLDivElement>(null);

    const apiKey = process.env.NEXT_PUBLIC_LASTFM_KEY!;
    const username = process.env.NEXT_PUBLIC_LASTFM_USER!;
    const refreshMs = 30000;

    const fetchLastTrack = async () => {
        try {
            const res = await fetch(
                `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`
            );
            const data = await res.json();
            const recentTrack = data.recenttracks.track?.[0];
            setTrack(recentTrack || null);
        } catch (error) {
            console.error("Error fetching Last.fm data:", error);
        }
    };

    useEffect(() => {
        fetchLastTrack();
        const interval = setInterval(fetchLastTrack, refreshMs);
        return () => clearInterval(interval);
    }, [apiKey, username, refreshMs]);

    // Calculate scroll distance and duration dynamically
    useEffect(() => {
        if (!track) return;

        const refs = [
            { ref: titleRef, key: "title" },
            { ref: artistRef, key: "artist" },
            { ref: albumRef, key: "album" }
        ];

        let maxDistance = 0;
        const distances: Record<string, number> = {};

        refs.forEach(({ ref, key }) => {
            if (!ref.current) return;
            const containerWidth = ref.current.offsetWidth;
            const textWidth = ref.current.scrollWidth;
            const distance =
                textWidth > containerWidth ? textWidth - containerWidth : 0;
            distances[key] = distance;
            if (distance > maxDistance) maxDistance = distance;
        });

        const baseSpeed = 80; // pixels per second for faster scroll
        const totalDuration = maxDistance > 0 ? maxDistance / baseSpeed : 0;

        const configs: any = {};
        Object.keys(distances).forEach((key) => {
            const distance = distances[key];
            configs[key] =
                distance === 0
                    ? { distance: 0, duration: 0 }
                    : { distance, duration: totalDuration };
        });

        setScrollConfigs({ ...configs, pauseFraction: 0.2 });
    }, [track]);

    if (!track)
        return (
            <div className={LastFMCSS.placeholder}>No recent track found.</div>
        );

    const imageUrl = track.image.find((img) => img.size === "extralarge")?.[
        "#text"
    ];

    const renderScrollingText = (
        text: string,
        ref: React.RefObject<HTMLDivElement>,
        config: { distance: number; duration: number }
    ) => {
        if (config.duration === 0) return <div ref={ref}>{text}</div>;

        return (
            <div
                className={LastFMCSS.scrollContent}
                ref={ref}
                style={
                    {
                        "--scroll-distance": `${config.distance}px`,
                        "--scroll-duration": `${config.duration}s`,
                        "--pause-fraction": scrollConfigs.pauseFraction
                    } as React.CSSProperties
                }
            >
                <span>{text}</span>
            </div>
        );
    };

    return (
        <div className={LastFMCSS.card}>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={track.name}
                    className={LastFMCSS.cover}
                />
            )}
            <div className={LastFMCSS.details}>
                <div className={LastFMCSS.scrollWrapper}>
                    {renderScrollingText(
                        track.name,
                        titleRef,
                        scrollConfigs.title
                    )}
                </div>
                <div className={LastFMCSS.scrollWrapper}>
                    {renderScrollingText(
                        track.artist["#text"],
                        artistRef,
                        scrollConfigs.artist
                    )}
                </div>
                <div className={LastFMCSS.scrollWrapper}>
                    {renderScrollingText(
                        track.album["#text"],
                        albumRef,
                        scrollConfigs.album
                    )}
                </div>
            </div>
        </div>
    );
};

export default LastFM;
