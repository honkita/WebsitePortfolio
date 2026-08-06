"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

// CSS
import ImageCarouselCSS from "./ImageCarousel.module.css";

// JSON item interface
interface CarouselItem {
    name: string;
    description: string;
    image: string;
}

// Interface for ImageCarousel Props
interface ImageCarouselProps {
    images: CarouselItem[] | string; // Can be passed as JSON string
}

/**
 * Image Carousel Component
 * @param ImageCarouselProps
 * @returns
 */
const ImageCarousel = ({ images }: ImageCarouselProps) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [index, setIndex] = useState(1); // Start at first real image
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        console.log(index);
        setMounted(true);
    }, []);

    const getButtonImage = (direction: "previous" | "next") => {
        const theme = resolvedTheme === "light" ? "" : "Dark";
        console.log(
            `/images/Buttons/Pixel${direction === "previous" ? "Prev" : "Next"}${theme}.svg`
        );
        return `/images/Buttons/Pixel${direction === "previous" ? "Prev" : "Next"}${theme}.svg`;
    };
    const rawImages = Array.isArray(images) ? images : JSON.parse(images);

    // Clone last and first images for seamless looping
    const imagesJSON = [
        rawImages[rawImages.length - 1],
        ...rawImages,
        rawImages[0]
    ];

    const trackRef = useRef<HTMLDivElement>(null);

    const handlePrev = () => {
        if (isTransitioning) return;
        setIndex((prev) => prev - 1);
        setIsTransitioning(true);
    };

    const handleNext = () => {
        if (isTransitioning) return;
        setIndex((prev) => prev + 1);
        setIsTransitioning(true);
    };

    const handleDotClick = (i: number) => {
        if (isTransitioning) return;
        setIndex(i + 1);
        setIsTransitioning(true);
    };

    useEffect(() => {
        const track = trackRef.current;
        if (!track || !isTransitioning) return;

        const handleTransitionEnd = (e: TransitionEvent) => {
            if (e.propertyName !== "transform") return;

            setIsTransitioning(false);

            if (index === 0) {
                setIndex(imagesJSON.length - 2);
            } else if (index === imagesJSON.length - 1) {
                setIndex(1);
            }
        };

        track.addEventListener("transitionend", handleTransitionEnd);

        return () =>
            track.removeEventListener("transitionend", handleTransitionEnd);
    }, [index, isTransitioning, imagesJSON.length]);

    if (!mounted) {
        return null;
    }

    return (
        <section>
            <div className={ImageCarouselCSS.carouselWrapper}>
                <div
                    ref={trackRef}
                    className={ImageCarouselCSS.carouselTrack}
                    style={{
                        transform: `translateX(-${index * 100}%)`,
                        transition: isTransitioning
                            ? "transform 0.5s ease-in-out"
                            : "none"
                    }}
                >
                    {imagesJSON.map((item: CarouselItem, i: number) => (
                        <img
                            key={i}
                            src={item.image}
                            fetchPriority={"high"}
                            className={ImageCarouselCSS.carouselImage}
                            alt={`carousel-img-${i}`}
                        />
                    ))}
                </div>
            </div>
            <section className={ImageCarouselCSS.accessibilityControls}>
                <button
                    title="Prev"
                    className={ImageCarouselCSS.sliderButtons}
                    onClick={handlePrev}
                >
                    <Image
                        src={getButtonImage("previous")}
                        alt="Previous"
                        fill
                        priority
                        sizes="48px"
                    />
                </button>
                <div className={ImageCarouselCSS.indicators}>
                    {rawImages.map((item: CarouselItem, i: number) => (
                        <span
                            key={i}
                            className={`${ImageCarouselCSS.dot} ${
                                index === i + 1
                                    ? ImageCarouselCSS.activeDot
                                    : ""
                            }`}
                            onClick={() => handleDotClick(i)}
                        />
                    ))}
                </div>
                <button
                    title="Next"
                    className={ImageCarouselCSS.sliderButtons}
                    onClick={handleNext}
                >
                    <Image
                        src={getButtonImage("next")}
                        alt="Next"
                        fill
                        priority
                        sizes="48px"
                    />
                </button>
            </section>
        </section>
    );
};

export default ImageCarousel;
