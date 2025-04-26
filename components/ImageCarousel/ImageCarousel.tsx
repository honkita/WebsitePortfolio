"use client";

import React, { useState, useEffect } from "react";

// CSS
import ImageCarouselCSS from "./ImageCarousel.module.css";

/**
 * Props Interface
 */
interface ImageCarouselProps {
    images: string;
}

export default function ImageCarousel(props: ImageCarouselProps) {
    var imagesJSON = JSON.parse(JSON.stringify(props.images));
    const [index, setIndexValue] = useState(0);
    const [transitionDirection, setTransitionDirection] = useState("");
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        // Trigger animation when index changes
        setAnimate(true);

        // Reset animation state after the animation completes
        const timer = setTimeout(() => setAnimate(false), 500);
        return () => clearTimeout(timer);
    }, [index]);

    const handlePrev = () => {
        setTransitionDirection("slide-right");
        setIndexValue(
            index == 0 ? Object.keys(imagesJSON).length - 1 : index - 1
        );
    };

    const handleNext = () => {
        setTransitionDirection("slide-left");
        setIndexValue(
            index + 1 >= Object.keys(imagesJSON).length ? 0 : index + 1
        );
    };

    return (
        <div>
            <div style={{ position: "relative", overflow: "hidden" }}>
                <div
                    key={index}
                    className={`${ImageCarouselCSS.sliderContainer} ${
                        animate &&
                        (transitionDirection === "slide-left"
                            ? ImageCarouselCSS.slideLeft
                            : ImageCarouselCSS.slideRight)
                    }`}
                >
                    <img
                        src={imagesJSON[index].image}
                        className={ImageCarouselCSS.images}
                        alt={imagesJSON[index].image + " image"}
                    />
                </div>
                <button
                    title="Prev"
                    className={ImageCarouselCSS.sliderButtons}
                    style={{ left: "2%" }}
                    onClick={handlePrev}
                >
                    &lt;
                </button>
                <button
                    title="Next"
                    className={ImageCarouselCSS.sliderButtons}
                    style={{ right: "2%" }}
                    onClick={handleNext}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
}
