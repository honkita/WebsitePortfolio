"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// CSS
import MusicArtistCSS from "./MusicArtist.module.css";

// Lib
import stringToColour from "@/lib/stringToColour";

// Props
interface MusicArtistProps {
    name: string;
    image: string;
    scrobbles: number;
    rank: number;
}

const LASTFM_PLACEHOLDER_HASH = "2a96cbd8b46e442fc41c2b86b821562f.png";
const REFRESH_INTERVAL_MS = 5000;

function isValidImageUrl(url: string): Promise<boolean> {
    return new Promise((resolve) => {
        if (!url || url.includes(LASTFM_PLACEHOLDER_HASH)) {
            resolve(false);
            return;
        }

        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

/**
 * Displays a music artist card
 * @param name
 * @param image
 * @param scrobbles
 * @param rank
 * @returns JSX.Element
 */
export default function MusicArtist({
    name,
    image,
    scrobbles,
    rank
}: MusicArtistProps) {
    const { resolvedTheme } = useTheme();
    const [resolvedImage, setResolvedImage] = useState<string>("");

    // Initial check + retry loop
    useEffect(() => {
        let cancelled = false;
        let interval: NodeJS.Timeout;

        async function checkImage() {
            if (await isValidImageUrl(image)) {
                if (!cancelled) {
                    setResolvedImage(image);
                    clearInterval(interval);
                }
            }
        }

        // First attempt immediately
        checkImage();

        // Retry every 5 seconds if not resolved
        interval = setInterval(() => {
            if (!resolvedImage) {
                checkImage();
            }
        }, REFRESH_INTERVAL_MS);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [image, resolvedImage]);

    const hasImage = Boolean(resolvedImage);

    return (
        <div className={MusicArtistCSS.card}>
            {hasImage ? (
                <img
                    className={MusicArtistCSS.albumImage}
                    src={resolvedImage}
                    alt={`${name} image`}
                    loading="lazy"
                />
            ) : (
                <div className={MusicArtistCSS.imagePlaceholder}>
                    <img
                        className={MusicArtistCSS.albumImage}
                        src={
                            resolvedTheme === "light"
                                ? "/images/Artists/PixelArtist.svg"
                                : "/images/Artists/PixelArtistDark.svg"
                        }
                        alt={`${name} placeholder`}
                        loading="lazy"
                    />
                    <div
                        className={MusicArtistCSS.placeholder}
                        style={{ backgroundColor: stringToColour(name) }}
                    />
                </div>
            )}

            <div className={MusicArtistCSS.info}>
                <div className={MusicArtistCSS.name}>{name}</div>
                <div className={MusicArtistCSS.scrobbles}>
                    🎧 {scrobbles.toLocaleString()}
                </div>
            </div>
        </div>
    );
}
