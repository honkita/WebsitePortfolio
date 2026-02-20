"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";

// CSS
import LastFMCSS from "./LastFMCSS.module.css";

// Interface for a Last.fm track
interface LastFmTrack {
    artist: { "#text": string };
    name: string;
    album: { "#text": string };
    image: { size: string; "#text": string }[];
    url: string;
}

// Interface for animated line
interface AnimatedLine {
    text: string;
    ref: React.RefObject<HTMLDivElement | null>;
    keyframeName?: string;
}

// Animation constants
const LONGEST_SPEED = 25;
const PAUSE_DURATION = 1;

const debounce = (fn: () => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, delay);
    };
};

/**
 * LastFM Home PageComponent
 * @returns
 */
const LastFM = () => {
    const { resolvedTheme } = useTheme();
    const [track, setTrack] = useState<LastFmTrack | null>(null);
    const lastTrackId = useRef<string | null>(null);

    const titleRef = useRef<HTMLDivElement | null>(null);
    const artistRef = useRef<HTMLDivElement | null>(null);
    const albumRef = useRef<HTMLDivElement | null>(null);
    const styleRef = useRef<HTMLStyleElement | null>(null);

    const refreshMs = 10000;

    // Fetch last track from serverless API
    const fetchLastTrack = async () => {
        try {
            const res = await fetch("/api/LastFM");
            const recentTrack = await res.json();

            if (recentTrack) {
                const trackId =
                    recentTrack.name + "|" + recentTrack.artist["#text"];
                if (trackId !== lastTrackId.current) {
                    lastTrackId.current = trackId;
                    setTrack(recentTrack);
                }
            }
        } catch (err) {
            console.error("Error fetching cached Last.fm data:", err);
        }
    };

    // Reset animation by removing existing styles and setting animation to none when the track changes
    const resetAnimation = () => {
        if (!styleRef.current) return;
        styleRef.current.innerHTML = "";

        [titleRef, artistRef, albumRef].forEach((ref) => {
            if (ref.current) {
                ref.current.style.animation = "none";
                ref.current.style.transform = "translateX(0)";
            }
        });
    };

    // Setup scrolling animation
    const setupScroll = () => {
        if (!styleRef.current || !track) return;

        const lines: AnimatedLine[] = [
            { text: track.name, ref: titleRef },
            { text: track.artist["#text"], ref: artistRef },
            { text: track.album["#text"], ref: albumRef }
        ];

        const longestLength = Math.max(...lines.map((l) => l.text.length));
        const longestDuration = longestLength / LONGEST_SPEED;

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

            const pauseStartPct = Math.round(
                (PAUSE_DURATION / totalDuration) * 100
            );
            const moveLeftPct = Math.round(
                ((PAUSE_DURATION + longestDuration) / totalDuration) * 100
            );
            const pauseEndPct = Math.round(
                ((2 * PAUSE_DURATION + longestDuration) / totalDuration) * 100
            );
            const moveRightPct = Math.round(
                ((2 * (PAUSE_DURATION + longestDuration)) / totalDuration) * 100
            );

            css += `
        @keyframes ${keyframeName} {
          0%, ${pauseStartPct}% { transform: translateX(0); }
          ${pauseStartPct}%, ${moveLeftPct}% { transform: translateX(-${distance}px); }
          ${moveLeftPct}%, ${pauseEndPct}% { transform: translateX(-${distance}px); }
          ${pauseEndPct}%, ${moveRightPct}% { transform: translateX(0); }
        }
      `;

            line.ref.current.style.animation = `${keyframeName} ${
                (totalDuration * 1000) / 200
            }s ease-in-out infinite`;
        });

        styleRef.current.innerHTML = css;
    };

    // Poll serverless API
    useEffect(() => {
        fetchLastTrack();
        const interval = setInterval(fetchLastTrack, refreshMs);
        return () => clearInterval(interval);
    }, []);

    // Reset animation on track change
    useEffect(() => {
        if (!track) return;
        resetAnimation();
        const timer = setTimeout(() => setupScroll(), 50);
        return () => clearTimeout(timer);
    }, [track]);

    // Handle resize
    useEffect(() => {
        if (!track) return;
        const handleResize = debounce(() => {
            resetAnimation();
            setupScroll();
        }, 200);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [track]);

    if (!track)
        return (
            <div className={LastFMCSS.card}>
                <img
                    className={LastFMCSS.cover}
                    src={
                        resolvedTheme === "light"
                            ? "/images/Artists/PixelArtist.svg"
                            : "/images/Artists/PixelArtistDark.svg"
                    }
                    alt={`${name} placeholder`}
                    loading="lazy"
                />
                No recent track found.
            </div>
        );

    const imageUrl = track.image.find((img) => img.size === "extralarge")?.[
        "#text"
    ];

    const renderText = (
        text: string,
        ref: React.RefObject<HTMLDivElement | null>,
        className: string
    ) => (
        <div className={`${LastFMCSS.scrollWrapper} ${className}`}>
            <div className={LastFMCSS.scrollContent} ref={ref}>
                <span>{text}</span>
            </div>
        </div>
    );

    return (
        <div className={LastFMCSS.card}>
            <style ref={styleRef}></style>
            {imageUrl && (
                <Link
                    href={track.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LastFMCSS.coverLink}
                >
                    <img
                        src={imageUrl}
                        alt={track.name}
                        className={LastFMCSS.cover}
                    />
                </Link>
            )}

            <div className={LastFMCSS.details}>
                {renderText(track.name, titleRef, LastFMCSS.title)}
                {renderText(track.artist["#text"], artistRef, LastFMCSS.artist)}
                {renderText(track.album["#text"], albumRef, LastFMCSS.album)}
            </div>
        </div>
    );
};

export default LastFM;
