"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import NextImage from "next/image";

// Child Components
import LastFM from "@components/LastFM/LastFM";

// CSS
import divstyling from "@styles/divstyling.module.css";
import TitleCSS from "./Title.module.css";

export interface TitleProps {
    colour: "blue" | "red" | "yellow";
    name: string;
}

// CSS backgrounds
function backgroundClass(colour: string) {
    switch (colour) {
        case "blue":
            return TitleCSS.blueName;
        case "red":
            return TitleCSS.redName;
        case "yellow":
            return TitleCSS.yellowName;
        default:
            return "";
    }
}

// Preloading backgrounds
function backgroundUrl(colour: string) {
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
}

export default function HomeTitle({ colour, name }: TitleProps) {
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

        const url = backgroundUrl(colour);
        if (!url) {
            setBgIsVisible(true);
            return;
        }

        const img = new Image();
        img.src = url;
        img.onload = () => setBgIsVisible(true);
        img.onerror = () => setBgIsVisible(true);
    }, [colour, mounted]);

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

    const visibilityClass = bgIsVisible
        ? TitleCSS.loadedAndVisible
        : TitleCSS.notYetVisible;

    return (
        <section
            className={`${TitleCSS.namePlateHome} ${backgroundClass(
                colour
            )} ${visibilityClass} ${divstyling.imageRendering}`}
        >
            <div className={TitleCSS.outerContainer}>
                <div className={TitleCSS.imageWrapperWithExtras}>
                    <div className={TitleCSS.imageNameWrapper}>
                        <img
                            className={TitleCSS.mainImage}
                            fetchPriority="high"
                            src={getImage()}
                            alt="Profile"
                        />
                        <div>
                            <div className={TitleCSS.nameRow}>
                                <div className={TitleCSS.nameBox}>
                                    <h1 className={TitleCSS.nameText}>
                                        {name}
                                    </h1>
                                </div>
                                <button
                                    className={TitleCSS.swapButton}
                                    onClick={handleSwapImage}
                                    aria-label="Swap image"
                                >
                                    {mounted && (
                                        <NextImage
                                            id="Icon"
                                            key={name}
                                            fetchPriority="high"
                                            src={
                                                resolvedTheme === "light"
                                                    ? "/images/NavBar/Pixel_Swap.svg"
                                                    : "/images/NavBar/Pixel_Swap_Dark.svg"
                                            }
                                            title={name}
                                            alt={`${name} image`}
                                            aria-hidden
                                            tabIndex={-1}
                                            fill
                                            priority
                                            sizes="100vw"
                                        />
                                    )}
                                </button>
                            </div>
                            <h1 className={TitleCSS.levelText}>LV: {age}</h1>
                        </div>
                    </div>
                </div>

                <div className={TitleCSS.statsWrapperWithExtras}>
                    <div className={TitleCSS.infoBox}>
                        <div className={TitleCSS.infoText}>
                            <p>
                                Elite is a software developer from McMaster
                                University. He is currently in his fourth year
                                studying computer science with a minor in
                                mathematics.
                            </p>
                            <p>
                                Beyond this, Elite can be seen either drawing
                                with fancy Japanese alcohol markers or sewing.
                            </p>
                        </div>
                    </div>
                    <LastFM />
                </div>
            </div>
        </section>
    );
}
