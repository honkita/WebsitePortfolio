"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Components
import ProgressBarGenerator from "@components/ProgressBar/ProgressBar";
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import divstyling from "@styles/divstyling.module.css";
import TitleCSS from "./Title.module.css";

// Props Interface
export interface TitleProps {
    colour: "blue" | "red" | "yellow";
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

export default function HomeTitle({ colour, buttons, name }: TitleProps) {
    const [bgIsVisible, setBgIsVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const year = new Date().getFullYear();
    const age = year - 2003;

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
            default:
                break;
        }
    }

    const visibilityClass = bgIsVisible
        ? TitleCSS.loadedAndVisible
        : TitleCSS.notYetVisible;

    function getImage() {
        return "/images/TestImages/honoka.jpg";
    }

    return (
        <section
            className={`${
                TitleCSS.namePlate
            } ${backgroundClass()} ${visibilityClass} ${
                divstyling.imageRendering
            }`}
        >
            <div className={TitleCSS.titleCenter}>
                <h1 className={TitleCSS.title}>{name}</h1>
            </div>

            <img
                className={`${TitleCSS.projectsImage} ${divstyling.border}`}
                fetchPriority={"high"}
                src={getImage()}
            />

            <ProgressBarGenerator
                label={"GPA"}
                numerator={10.8}
                denominator={12}
                colour={"red"}
            />
            <ProgressBarGenerator
                label={"CODE"}
                numerator={year - 2017}
                denominator={age}
                colour={"red"}
            />
            <ProgressBarGenerator
                label={"ART"}
                numerator={year - 2014}
                denominator={age}
                colour={"red"}
            />
            <ProgressBarGenerator
                label={"SEW"}
                numerator={year - 2019}
                denominator={age}
                colour={"red"}
            />
        </section>
    );
}
