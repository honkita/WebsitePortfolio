import React, { useEffect, useState } from "react";
import style from "../../styles/Home.module.css";

/**
 * @param {object} props
 * @param {JSONString} props.images
 * @returns
 */
export default function ImageCarousel(props) {
    var imagesJSON = JSON.parse(JSON.stringify(props.images));
    const [index, setIndexValue] = useState(0);

    return (
        <div style={{ position: "relative" }}>
            <img
                src={imagesJSON[index].image}
                style={{
                    width: "90%",
                    height: "90%",
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
                &lt;
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
                &gt;
            </button>
        </div>
    );
}
