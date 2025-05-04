"use client";

import React, { useState } from "react";
import ImageCarouselCSS from "./ImageCarousel.module.css";

interface ImageCarouselProps {
    images: string;
}

export default function ImageCarousel(props: ImageCarouselProps) {
    const imagesJSON = Array.isArray(props.images)
        ? props.images
        : JSON.parse(props.images);

    const [index, setIndex] = useState(0);

    const handlePrev = () => {
        setIndex((prevIndex) =>
            prevIndex === 0 ? imagesJSON.length - 1 : prevIndex - 1
        );
    };

    const handleNext = () => {
        setIndex((prevIndex) =>
            prevIndex === imagesJSON.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className={ImageCarouselCSS.carouselWrapper}>
            <div
                className={ImageCarouselCSS.carouselTrack}
                style={{
                    transform: `translateX(-${index * 100}%)`
                }}
            >
                {imagesJSON.map((item: any, i: number) => (
                    <img
                        key={i}
                        src={item.image}
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
                &lt;
            </button>
            <button
                title="Next"
                className={ImageCarouselCSS.sliderButtons}
                style={{ right: "5%" }}
                onClick={handleNext}
            >
                &gt;
            </button>
        </div>
    );
}
