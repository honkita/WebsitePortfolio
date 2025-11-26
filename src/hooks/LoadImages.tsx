"use client";

import { useEffect, useState } from "react";

export default function LoadImages() {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        const images = Array.from(document.images);
        if (images.length === 0) {
            setImagesLoaded(true);
            return;
        }

        let loadedCount = 0;

        const onLoad = () => {
            loadedCount++;
            if (loadedCount === images.length) {
                setImagesLoaded(true);
            }
        };

        images.forEach((img) => {
            if (img.complete) {
                onLoad();
            } else {
                img.addEventListener("load", onLoad);
                img.addEventListener("error", onLoad); // Count errors as "loaded" to prevent blocking
            }
        });

        // Cleanup listeners
        return () => {
            images.forEach((img) => {
                img.removeEventListener("load", onLoad);
                img.removeEventListener("error", onLoad);
            });
        };
    }, []);

    return imagesLoaded;
}
