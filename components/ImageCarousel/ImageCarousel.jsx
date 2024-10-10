import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import style from "../../styles/Home.module.css";

/**
 * @param {object} props
 * @param {JSONString} props.images
 * @returns
 */
export default function ImageCarousel(props) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    var imagesJSON = JSON.parse(JSON.stringify(props.images));
    const [index, setIndexValue] = useState(0);

    function nextItem() {
        setIndexValue((index) => {
            // if (index + 1 >= Object.keys(imagesJSON).length) return 0;
            return index++;
        });
    }

    function prevItem() {}

    return (
        <div style={{ position: "relative" }}>
            <img
                src={imagesJSON[index].image}
                style={{
                    width: "80%",
                    height: "80%",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    alignItems: "center",
                }}
                alt={imagesJSON[index].image + " image"}
            />
            <button
                title="Prev"
                className={style.sliderButtons}
                style={{ left: "10%" }}
                onClick={() =>
                    setIndexValue(
                        index == 0
                            ? Object.keys(imagesJSON).length - 1
                            : index - 1
                    )
                }
            >
                Prev
            </button>
            <button
                title="Next"
                className={style.sliderButtons}
                style={{ right: "10%" }}
                onClick={() =>
                    setIndexValue(
                        index + 1 >= Object.keys(imagesJSON).length
                            ? 0
                            : index + 1
                    )
                }
            >
                Next
            </button>
        </div>
    );
}
