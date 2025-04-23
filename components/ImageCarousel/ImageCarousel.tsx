"use client";

import React, { useState } from "react";

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

    return (
        <div>
            <div style={{ position: "relative" }}>
                <img
                    src={imagesJSON[index].image}
                    style={{
                        width: "90vw",
                        height: "45vw",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        alignItems: "center",
                        objectFit: "cover"
                    }}
                    alt={imagesJSON[index].image + " image"}
                />
                <button
                    title="Prev"
                    className={ImageCarouselCSS.sliderButtons}
                    style={{ left: "0%" }}
                    onClick={() =>
                        setIndexValue(
                            index == 0
                                ? Object.keys(imagesJSON).length - 1
                                : index - 1
                        )
                    }
                >
                    &lt;
                </button>
                <button
                    title="Next"
                    className={ImageCarouselCSS.sliderButtons}
                    style={{ right: "0%" }}
                    onClick={() =>
                        setIndexValue(
                            index + 1 >= Object.keys(imagesJSON).length
                                ? 0
                                : index + 1
                        )
                    }
                >
                    &gt;
                </button>
            </div>
            {/* <div className={ImageCarouselCSS.indicators}>
                {imagesJSON.map((_: number, id: number) => {
                    <button
                        key={id}
                        onClick={null}
                        clasName={ImageCarouselCSS.indicator}
                    >
                        {" "}
                        idk
                    </button>;
                })}
            </div> */}
        </div>
    );
}
