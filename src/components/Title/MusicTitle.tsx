"use client";

import { useEffect, useState } from "react";

// Child Components
import PixelLoader from "@/components/PixelLoader/PixelLoader";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import TitleCSS from "./Title.module.css";

// Props Interface
export interface MusicTitleProps {
    colour: "blue" | "red" | "yellow" | "green";
    name: string;
    scrobbles?: number;
    artists?: number;
}

// Helper: Map colour to background image URL
const getBackgroundUrl = (colour: string): string => {
    switch (colour) {
        case "blue":
            return "/images/NamePlate/Blue/Normal.png";
        case "red":
            return "/images/NamePlate/Red/Normal.png";
        case "yellow":
            return "/images/NamePlate/Yellow/Normal.png";
        case "green":
            return "/images/NamePlate/Green/Normal.png";
        default:
            return "";
    }
};

// Preload image helper
const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => resolve();
    });
};

const MusicTitle = ({
    colour,
    name,
    scrobbles,
    artists
}: MusicTitleProps) => {
    const [bgIsVisible, setBgIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const imageUrl = getBackgroundUrl(colour);

        if (imageUrl) {
            preloadImage(imageUrl).then(() => {
                const delay = process.env.NODE_ENV === "production" ? 100 : 0;

                const timer = setTimeout(() => {
                    setBgIsVisible(true);
                }, delay);

                return () => clearTimeout(timer);
            });
        } else {
            setBgIsVisible(true);
        }
    }, [colour, mounted]);

    const backgroundClass = () => {
        switch (colour) {
            case "blue":
                return TitleCSS.blueName;
            case "red":
                return TitleCSS.redName;
            case "yellow":
                return TitleCSS.yellowName;
            case "green":
                return TitleCSS.greenName;
            default:
                break;
        }
    };

    const visibilityClass = bgIsVisible
        ? TitleCSS.loadedAndVisible
        : TitleCSS.notYetVisible;

    return (
        <section
            className={`${TitleCSS.namePlate
                } ${backgroundClass()} ${visibilityClass} ${divstyling.imageRendering
                }`}
        >
            <div className={TitleCSS.titleCenter}>
                <h1 className={TitleCSS.title}>{name}</h1>
                <section className={TitleCSS.titleSmall}>
                    <section className={TitleCSS.artist}>
                        {artists === 0 ? <PixelLoader /> : artists}👤
                    </section>{" "}
                    |
                    <section className={TitleCSS.scrobbles}>
                        🎵 {scrobbles === 0 ? <PixelLoader /> : scrobbles}
                    </section>
                </section>
            </div>
        </section>
    );
}

export default MusicTitle;
