"use client";

import React from "react";
import { useTheme } from "next-themes";

// CSS
import MusicArtistCSS from "./MusicArtist.module.css";

// Lib
import stringToColour from "@/lib/stringToColour";

// Props Interface
interface MusicArtistProps {
    name: string;
    image: string;
    scrobbles: number;
    rank: number;
}

/**
 * Music Artist Component
 * @param MusicArtistProps
 * @returns JSX.Element
 */
export default function MusicArtist({
    name,
    image,
    scrobbles,
    rank
}: MusicArtistProps) {
    const { resolvedTheme } = useTheme();

    if (!image) console.log(name, stringToColour(name));

    const styleSheet = document.createElement("style");

    if (!image) {
        styleSheet.innerHTML = `
            .albumImage::before {
                background: ${stringToColour(name)};
            }
        `;
        document.head.appendChild(styleSheet);
    }

    return (
        <div className={MusicArtistCSS.card}>
            {/* <div className={MusicArtistCSS.rank}>{rank}</div> */}
            {image !== "" ? (
                <img
                    className={MusicArtistCSS.albumImage}
                    src={image}
                    alt={`${name} image`}
                />
            ) : (
                <div className={MusicArtistCSS.imagePlaceholder}>
                    <img
                        className={`${MusicArtistCSS.albumImage}`}
                        src={
                            resolvedTheme === "light"
                                ? "images/Artists/PixelArtist.svg"
                                : "images/Artists/PixelArtistDark.svg"
                        }
                        alt={`${name} image`}
                    />
                    <div
                        style={{
                            background: `${stringToColour(name)}`
                        }}
                        className={MusicArtistCSS.placeholder}
                    ></div>
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
