"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import NextImage from "next/image";

// Components
import Badges from "@components/Icons/Badges";
import LastFM from "@components/LastFM/LastFM";
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
                TitleCSS.namePlateHome
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
                            {/* <div className={TitleCSS.statsWrapperSmallScreen}>
                                <div className={TitleCSS.badgeBox}>
                                    {badgesJSON.map(
                                        (
                                            badge: {
                                                name: string;
                                                type: string;
                                                url: string;
                                            },
                                            index: number
                                        ) => (
                                            <Badges
                                                key={badge.name + index}
                                                type={badge.type}
                                                name={badge.name}
                                                url={badge.url}
                                            />
                                        )
                                    )}
                                </div>
                            </div> */}
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
