"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import PixelButton from "@components/PixelButton/PixelButton";

import divstyling from "@styles/divstyling.module.css";
import TitleCSS from "./Title.module.css";

import { returnURL } from "@hooks/MainButtons";

export interface TitleProps {
    colour: "red" | "yellow";
    buttons: string[];
    name: string;
}

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
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            const imageUrl = getBackgroundUrl(colour);
            if (imageUrl) {
                preloadImage(imageUrl).then(() => setBgLoaded(true));
            } else {
                setBgLoaded(true);
            }
        }
    }, [colour, mounted]);

    const backgroundClass =
        colour === "red" ? TitleCSS.redName : TitleCSS.yellowName;

    if (!mounted) {
        const serverRenderedTheme = "light";
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
                                url={returnURL(item, serverRenderedTheme)}
                                extra={true}
                            />
                        ))}
                    </section>
                </div>
            </section>
        );
    }

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
                            url={returnURL(item, resolvedTheme)}
                            extra={true}
                        />
                    ))}
                </section>
            </div>
        </section>
    );
}
