"use client";

import React, { useEffect, useRef, useState } from "react";
import LastFMCSS from "./LastFMCSS.module.css";

interface LastFmTrack {
    artist: { "#text": string };
    name: string;
    album: { "#text": string };
    image: { size: string; "#text": string }[];
}

interface AnimatedLine {
    text: string;
    ref: React.RefObject<HTMLDivElement | null>;
    keyframeName?: string;
}

const SCROLL_SPEED = 10; // px/sec
const PAUSE_DURATION = 1; // seconds pause at start/end

const LastFM: React.FC = () => {
    const [track, setTrack] = useState<LastFmTrack | null>(null);

    const titleRef = useRef<HTMLDivElement | null>(null);
    const artistRef = useRef<HTMLDivElement | null>(null);
    const albumRef = useRef<HTMLDivElement | null>(null);
    const styleRef = useRef<HTMLStyleElement | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_LASTFM_KEY2!;
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
        } catch (err) {
            console.error("Error fetching Last.fm data:", err);
        }
    };

    const setupScroll = () => {
        if (!styleRef.current || !track) return;

        const lines: AnimatedLine[] = [
            { text: track.name, ref: titleRef },
            { text: track.artist["#text"], ref: artistRef },
            { text: track.album["#text"], ref: albumRef }
        ];

        const distances = lines.map(({ ref }) => {
            if (!ref.current) return 0;
            const containerWidth = ref.current.parentElement!.offsetWidth;
            const textWidth = ref.current.scrollWidth;
            return Math.max(0, textWidth - containerWidth);
        });

        const maxDistance = Math.max(...distances);
        if (maxDistance === 0) return;

        const scrollDuration = maxDistance / SCROLL_SPEED; // seconds to scroll full distance
        const totalDuration = scrollDuration * 2 + 3 * PAUSE_DURATION; // pause start + end + start again

        let css = "";

        lines.forEach((line, i) => {
            const distance = distances[i];
            if (!line.ref.current) return;

            if (distance === 0) {
                line.ref.current.style.animation = "none";
                line.ref.current.style.transform = "translateX(0)";
                return;
            }

            const keyframeName = `scrollLine${i}`;
            line.keyframeName = keyframeName;

            // Calculate percentages
            const pauseStartPercent = (PAUSE_DURATION / totalDuration) * 100;
            const moveRightPercent =
                ((PAUSE_DURATION + scrollDuration) / totalDuration) * 100;
            const pauseEndPercent =
                ((2 * PAUSE_DURATION + scrollDuration) / totalDuration) * 100;
            const moveLeftPercent =
                ((2 * PAUSE_DURATION + 2 * scrollDuration) / totalDuration) *
                100;
            const endPercent = 100;

            css += `
      @keyframes ${keyframeName} {
        0%, ${pauseStartPercent}% { transform: translateX(0); }
        ${pauseStartPercent}%, ${moveRightPercent}% { transform: translateX(-${distance}px); }
        ${moveRightPercent}%, ${pauseEndPercent}% { transform: translateX(-${distance}px); }
        ${pauseEndPercent}%, ${moveLeftPercent}% { transform: translateX(0); }
        ${moveLeftPercent}%, ${endPercent}% { transform: translateX(0); }
      }
    `;

            line.ref.current.style.animation = `${keyframeName} ${totalDuration}s linear infinite`;
        });

        styleRef.current.innerHTML = css;
    };

    useEffect(() => {
        fetchLastTrack();
        const interval = setInterval(fetchLastTrack, refreshMs);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!track) return;
        const timer = setTimeout(() => setupScroll(), 50);
        return () => clearTimeout(timer);
    }, [track]);

    if (!track)
        return (
            <div className={LastFMCSS.placeholder}>No recent track found.</div>
        );

    const imageUrl = track.image.find((img) => img.size === "extralarge")?.[
        "#text"
    ];

    const renderText = (
        text: string,
        ref: React.RefObject<HTMLDivElement | null>
    ) => (
        <div className={LastFMCSS.scrollWrapper}>
            <div className={LastFMCSS.scrollContent} ref={ref}>
                <span>{text}</span>
            </div>
        </div>
    );

    return (
        <div className={LastFMCSS.card}>
            <style ref={styleRef}></style>
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={track.name}
                    className={LastFMCSS.cover}
                />
            )}
            <div className={LastFMCSS.details}>
                {renderText(track.name, titleRef)}
                {renderText(track.artist["#text"], artistRef)}
                {renderText(track.album["#text"], albumRef)}
            </div>
        </div>
    );
};

export default LastFM;
