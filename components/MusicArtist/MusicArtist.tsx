"use client";

import React, { useEffect, useRef, useState } from "react";

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
            {name} 🎧 {scrobbles.toLocaleString()}
            <img src={image} alt={`${name} image`} />
        </div>
    );
}
