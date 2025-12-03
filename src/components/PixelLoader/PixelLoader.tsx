"use client";

import React, { useEffect, useState } from "react";

// CSS
import PixelLoaderCSS from "./PixelLoader.module.css";

export default function PixelLoader() {
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    let src;

    return <div className={`${PixelLoaderCSS.pixelLoader}`}></div>;
}
