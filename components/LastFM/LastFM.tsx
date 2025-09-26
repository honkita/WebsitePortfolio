"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import LastFMCSS from "./LastFMCSS.module.css";

interface LastFmTrack {
    artist: { "#text": string };
    name: string;
    album: { "#text": string };
    image: { size: string; "#text": string }[];
    url: string;
}

interface ServerTrack {
    track: LastFmTrack;
    epoch: number;
}

const LONGEST_SPEED = 25; // chars/sec
const PAUSE_DURATION = 1; // seconds

export default function LastFM() {
    const [serverTrack, setServerTrack] = useState<ServerTrack | null>(null);
    const lastTrackId = useRef<string | null>(null);
    const titleRef = useRef<HTMLDivElement | null>(null);
    const artistRef = useRef<HTMLDivElement | null>(null);
    const albumRef = useRef<HTMLDivElement | null>(null);
    const styleRef = useRef<HTMLStyleElement | null>(null);

    // SSE connection
    useEffect(() => {
        const evtSource = new EventSource("/api/LastFM");

        evtSource.onmessage = (e) => {
            try {
                const data: ServerTrack = JSON.parse(e.data);
                const trackId = `${data.track.name}|${data.track.artist["#text"]}`;
                if (trackId !== lastTrackId.current) {
                    lastTrackId.current = trackId;
                    setServerTrack(data);
                }
            } catch (err) {
                console.error("Bad SSE data:", e.data, err);
            }
        };

        evtSource.onerror = (err) =>
            console.error("SSE connection error:", err);

        return () => evtSource.close();
    }, []);

    // Reset animation
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

    // Scroll setup
    const setupScroll = () => {
        if (!serverTrack || !styleRef.current) return;
        const { track, epoch } = serverTrack;

        const lines = [
            { text: track.name, ref: titleRef },
            { text: track.artist["#text"], ref: artistRef },
            { text: track.album["#text"], ref: albumRef }
        ];

        const longestLength = Math.max(...lines.map((l) => l.text.length));
        const longestDuration = longestLength / LONGEST_SPEED;
        const totalDuration = longestDuration * 2 + PAUSE_DURATION * 2;

        const now = Date.now();
        const offset = ((now - epoch) / 1000) % totalDuration;

        let css = "";

        lines.forEach((line, i) => {
            if (!line.ref.current) return;

            const distance =
                line.ref.current.scrollWidth -
                line.ref.current.parentElement!.offsetWidth;

            if (distance <= 0) {
                line.ref.current.style.animation = "none";
                line.ref.current.style.transform = "translateX(0)";
                return;
            }

            const keyframeName = `scrollLine${i}`;
            line.ref.current.style.animation = `${keyframeName} ${totalDuration}s linear infinite`;
            line.ref.current.style.animationDelay = `-${offset}s`;

            css += `
        @keyframes ${keyframeName} {
          0%, 20% { transform: translateX(0); }
          40%, 60% { transform: translateX(-${distance}px); }
          80%, 100% { transform: translateX(0); }
        }
      `;
        });

        styleRef.current.innerHTML = css;
    };

    useEffect(() => {
        if (!serverTrack) return;
        resetAnimation();
        const timer = setTimeout(() => setupScroll(), 50);
        return () => clearTimeout(timer);
    }, [serverTrack]);

    if (!serverTrack)
        return <div className={LastFMCSS.placeholder}>No recent track</div>;

    const track = serverTrack.track;
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
}
