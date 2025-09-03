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

const LONGEST_SPEED = 8; // characters/sec
const PAUSE_DURATION = 2; // seconds

const LastFM: React.FC = () => {
    const [track, setTrack] = useState<LastFmTrack | null>(null);

    const titleRef = useRef<HTMLDivElement | null>(null);
    const artistRef = useRef<HTMLDivElement | null>(null);
    const albumRef = useRef<HTMLDivElement | null>(null);
    const styleRef = useRef<HTMLStyleElement | null>(null);

    const apiKey = process.env.NEXT_PUBLIC_LASTFM_KEY2!;
    const username = process.env.NEXT_PUBLIC_LASTFM_USER!;
    const refreshMs = 30000;

    // Fetch last track
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

    // Setup synchronized scroll
    const setupScroll = () => {
        if (!styleRef.current || !track) return;

        const lines: AnimatedLine[] = [
            { text: track.name, ref: titleRef },
            { text: track.artist["#text"], ref: artistRef },
            { text: track.album["#text"], ref: albumRef }
        ];

        // Find longest string in characters
        const longestLength = Math.max(...lines.map((l) => l.text.length));
        const longestDuration = longestLength / LONGEST_SPEED;

        // Compute pixel distances for each line
        const distances = lines.map(({ ref }) => {
            if (!ref.current) return 0;
            const containerWidth = ref.current.parentElement!.offsetWidth;
            const textWidth = ref.current.scrollWidth;
            return Math.max(0, textWidth - containerWidth);
        });

        const totalDuration = longestDuration * 2 + PAUSE_DURATION * 2;

        let css = "";

        lines.forEach((line, i) => {
            if (!line.ref.current) return;
            const distance = distances[i];

            if (distance === 0) {
                line.ref.current.style.animation = "none";
                line.ref.current.style.transform = "translateX(0)";
                return;
            }

            const keyframeName = `scrollLine${i}`;
            line.keyframeName = keyframeName;

            // Keyframe percentages based on absolute times
            const pauseStartPct = (PAUSE_DURATION / totalDuration) * 100;
            const moveLeftPct =
                ((PAUSE_DURATION + longestDuration) / totalDuration) * 100;
            const pauseEndPct =
                ((PAUSE_DURATION + longestDuration + PAUSE_DURATION) /
                    totalDuration) *
                100;
            const moveRightPct =
                ((PAUSE_DURATION +
                    longestDuration +
                    PAUSE_DURATION +
                    longestDuration) /
                    totalDuration) *
                100;

            css += `
        @keyframes ${keyframeName} {
          0%, ${pauseStartPct}% { transform: translateX(0); }
          ${pauseStartPct}%, ${moveLeftPct}% { transform: translateX(-${distance}px); }
          ${moveLeftPct}%, ${pauseEndPct}% { transform: translateX(-${distance}px); }
          ${pauseEndPct}%, ${moveRightPct}% { transform: translateX(0); }
          ${moveRightPct}%, 100% { transform: translateX(0); }
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
