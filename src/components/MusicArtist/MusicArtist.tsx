"use client";

import React from "react";

// CSS
import MusicArtistCSS from "./MusicArtist.module.css";

// Interface for MusicArtist Props
interface MusicArtistProps {
    name: string;
    image: string;
    scrobbles: number;
    rank: number;
}

export default function MusicArtist({
    name,
    image,
    scrobbles,
    rank
}: MusicArtistProps) {
    return (
        <div className={MusicArtistCSS.card}>
            <img
                className={MusicArtistCSS.albumImage}
                src={image || "/images/TestImages/honoka.jpg"}
                alt={`${name} image`}
            />
            <div className={MusicArtistCSS.info}>
                <div className={MusicArtistCSS.name}>{name}</div>
                <div className={MusicArtistCSS.scrobbles}>
                    🎧 {scrobbles.toLocaleString()}
                </div>
            </div>
        </div>
    );
}
