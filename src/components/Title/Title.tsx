"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Components
import PixelButton from "@/components/PixelButton/PixelButton";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import TitleCSS from "./Title.module.css";

// Hooks
import { returnURL } from "@/hooks/MainButtons";

// Props Interface
export interface TitleProps {
    colour: "blue" | "red" | "yellow" | "green";
    buttons: string[];
    name: string;
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

const Title: React.FC<TitleProps> = ({ colour, buttons, name }) => {
    const [bgIsVisible, setBgIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

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

    function backgroundClass() {
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
    }

    const visibilityClass = bgIsVisible
        ? TitleCSS.loadedAndVisible
        : TitleCSS.notYetVisible;

    const actualResolvedTheme = mounted ? resolvedTheme : "light";

    return (
        <section
            className={`${TitleCSS.namePlate
                } ${backgroundClass()} ${visibilityClass} ${divstyling.imageRendering
                }`}
        >
            <div className={TitleCSS.titleCenter}>
                <h1 className={TitleCSS.title}>{name}</h1>
                <section className={TitleCSS.containerButtons}>
                    {buttons.map((item, index) => (
                        <PixelButton
                            key={index}
                            name={item}
                            url={returnURL(
                                item,
                                actualResolvedTheme || "light"
                            )}
                            extra={true}
                        />
                    ))}
                </section>
            </div>
        </section>
    );
};

export default Title;
