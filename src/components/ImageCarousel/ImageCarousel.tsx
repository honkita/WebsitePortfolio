"use client";

import React, { useEffect, useRef, useState } from "react";

// CSS
import ImageCarouselCSS from "./ImageCarousel.module.css";

// Interface for ImageCarousel Props
interface ImageCarouselProps {
    images:
    | {
        name: string;
        description: string;
        image: string;
    }[]
    | string; // Can be passed as JSON string
}

/**
 * Image Carousel Component
 * @param ImageCarouselProps
 * @returns
 */
const ImageCarousel = ({ images }: ImageCarouselProps) => {
    const rawImages = Array.isArray(images) ? images : JSON.parse(images);

    // Clone last and first images for seamless looping
    const imagesJSON = [
        rawImages[rawImages.length - 1],
        ...rawImages,
        rawImages[0]
    ];

    const [index, setIndex] = useState(1); // Start at first real image
    const [isTransitioning, setIsTransitioning] = useState(false);
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
        if (!isTransitioning) return;

        const handleTransitionEnd = () => {
            setIsTransitioning(false);

            if (index === 0) {
                setIndex(imagesJSON.length - 2); // Jump to last real
                if (trackRef.current) {
                    trackRef.current.style.transition = "none";
                    trackRef.current.style.transform = `translateX(-${(imagesJSON.length - 2) * 100
                        }%)`;
                }
            } else if (index === imagesJSON.length - 1) {
                setIndex(1); // Jump to first real
                if (trackRef.current) {
                    trackRef.current.style.transition = "none";
                    trackRef.current.style.transform = `translateX(-100%)`;
                }
            }
        };

        const track = trackRef.current;
        track?.addEventListener("transitionend", handleTransitionEnd);

        return () => {
            track?.removeEventListener("transitionend", handleTransitionEnd);
        };
    }, [index, imagesJSON.length, isTransitioning]);

    useEffect(() => {
        if (trackRef.current) {
            trackRef.current.style.transition = isTransitioning
                ? "transform 0.5s ease-in-out"
                : "none";
            trackRef.current.style.transform = `translateX(-${index * 100}%)`;
        }
    }, [index, isTransitioning]);

    return (
        <section>
            <div className={ImageCarouselCSS.carouselWrapper}>
                <div ref={trackRef} className={ImageCarouselCSS.carouselTrack}>
                    {imagesJSON.map((item: any, i: number) => (
                        <img
                            key={i}
                            src={item.image}
                            fetchPriority={"high"}
                            className={ImageCarouselCSS.carouselImage}
                            alt={`carousel-img-${i}`}
                        />
                    ))}
                </div>

                <button
                    title="Prev"
                    className={ImageCarouselCSS.sliderButtons}
                    style={{ left: "5%" }}
                    onClick={handlePrev}
                >
                    {"<"}
                </button>
                <button
                    title="Next"
                    className={ImageCarouselCSS.sliderButtons}
                    style={{ right: "5%" }}
                    onClick={handleNext}
                >
                    {">"}
                </button>
            </div>
            <div className={ImageCarouselCSS.indicators}>
                {rawImages.map((_: any, i: number) => (
                    <span
                        key={i}
                        className={`${ImageCarouselCSS.dot} ${index === i + 1 ? ImageCarouselCSS.activeDot : ""
                            }`}
                        onClick={() => handleDotClick(i)}
                    />
                ))}
            </div>
        </section>
    );
};

export default ImageCarousel;
