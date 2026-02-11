"use client";

import React, { useEffect, useState } from "react";

// CSS
import PixelLoaderCSS from "./PixelLoader.module.css";

const PixelLoader = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    let src;

    return <div className={`${PixelLoaderCSS.pixelLoader}`}></div>;
}

export default PixelLoader;
