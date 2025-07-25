"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import NextImage from "next/image";

// Components
import Badges from "@components/Icons/Badges";
import ProgressBarGenerator from "@components/ProgressBar/ProgressBar";

// CSS
import divstyling from "@styles/divstyling.module.css";
import TitleCSS from "./Title.module.css";

// JSONs
import badges from "@assets/badges.json";

// Props Interface
export interface TitleProps {
    colour: "blue" | "red" | "yellow";
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

export default function HomeTitle({ colour, name }: TitleProps) {
    var badgesJSON = JSON.parse(JSON.stringify(badges));
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

    const [imageIndex, setImageIndex] = useState(0);
    const images = [
        "/images/HomeScreen/GBA_PFP.png",
        "/images/HomeScreen/IRL_PFP.png"
    ];

    function getImage() {
        return images[imageIndex % images.length];
    }

    function handleSwapImage() {
        setImageIndex((prev) => prev + 1);
    }

    return (
        <section
            className={`${
                TitleCSS.namePlate
            } ${backgroundClass()} ${visibilityClass} ${
                divstyling.imageRendering
            }`}
        >
            <div className={TitleCSS.outerContainer}>
                <div className={TitleCSS.imageWrapperWithExtras}>
                    <div className={TitleCSS.imageNameWrapper}>
                        <img
                            className={`${TitleCSS.mainImage}`}
                            fetchPriority={"high"}
                            src={getImage()}
                        />
                        <div className={TitleCSS.nameRow}>
                            <div className={TitleCSS.nameBox}>
                                <h1 className={TitleCSS.nameText}>{name}</h1>
                            </div>
                            <button
                                className={TitleCSS.swapButton}
                                onClick={handleSwapImage}
                                aria-label="Swap image"
                            >
                                <NextImage
                                    id="Icon"
                                    key={name}
                                    fetchPriority={"high"}
                                    src={
                                        resolvedTheme === "light"
                                            ? "./images/NavBar/Pixel_Swap.svg"
                                            : "./images/NavBar/Pixel_Swap_Dark.svg"
                                    }
                                    title={name}
                                    alt={name + " image"}
                                    aria-hidden={true}
                                    tabIndex={-1}
                                    fill
                                    priority={true}
                                    sizes="100vw"
                                />
                            </button>
                        </div>
                        <h1 className={TitleCSS.levelText}>
                            LV: {year - 2003}
                        </h1>
                    </div>
                    <div className={TitleCSS.badgeBox}>
                        {badgesJSON.map(
                            (
                                badge: { name: string; url: string },
                                index: number
                            ) => (
                                <Badges
                                    key={badge.name + index}
                                    name={badge.name}
                                    url={badge.url}
                                />
                            )
                        )}
                    </div>
                </div>

                <div className={TitleCSS.statsWrapper}>
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
                        suffix={"YRS"}
                    />
                    <ProgressBarGenerator
                        label={"ART"}
                        numerator={year - 2014}
                        denominator={age}
                        colour={"red"}
                        suffix={"YRS"}
                    />
                    <ProgressBarGenerator
                        label={"SEW"}
                        numerator={year - 2019}
                        denominator={age}
                        colour={"red"}
                        suffix={"YRS"}
                    />
                </div>
            </div>
        </section>
    );
}
