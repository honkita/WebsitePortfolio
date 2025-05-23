"use client";

import { useEffect, useState } from "react";

// Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import divstyling from "@styles/divstyling.module.css";
import TitleCSS from "./Title.module.css";

// Hooks
import { returnURL } from "@hooks/MainButtons";

// Props Interface
interface TitleProps {
    colour: "red" | "yellow";
    buttons: [string];
    name: string;
}

// Helper: Map colour to background image URL
const getBackgroundUrl = (colour: string): string => {
    switch (colour) {
        case "red":
            return "/images/NamePlate/Red/Normal.png";
        case "yellow":
            return "/images/NamePlate/Yellow/Normal.png";
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

export default function Title({ colour, buttons, name }: TitleProps) {
    const [bgLoaded, setBgLoaded] = useState(false);

    useEffect(() => {
        const imageUrl = getBackgroundUrl(colour);
        if (imageUrl) {
            preloadImage(imageUrl).then(() => setBgLoaded(true));
        } else {
            setBgLoaded(true);
        }
    }, [colour]);

    if (!bgLoaded) {
        return (
            <section className="flex justify-center items-center h-[50vw]">
                <p className="text-xl">Loading...</p>
            </section>
        );
    }

    const backgroundClass =
        colour === "red" ? TitleCSS.redName : TitleCSS.yellowName;

    return (
        <section
            className={`${TitleCSS.namePlate} ${backgroundClass} ${divstyling.imageRendering}`}
        >
            <div className={TitleCSS.titleCenter}>
                <h1 className={TitleCSS.title}>{name}</h1>
                <section className={TitleCSS.containerButtons}>
                    {buttons.map((item, index) => (
                        <PixelButton
                            key={index}
                            name={item}
                            url={returnURL(item)}
                            extra={true}
                        />
                    ))}
                </section>
            </div>
        </section>
    );
}
