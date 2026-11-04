"use client";

// React
import React from "react";
import Image from "next/image";

// CSS
import CloseButtonCSS from "./CloseButtonCSS.module.css";

// Props Interface
interface CloseButtonInterface {
    theme: string;
    closeModal: () => void;
}

const CloseButton = ({ theme, closeModal }: CloseButtonInterface) => {
    const path = "/images/Buttons/";

    const getButton = (light: boolean) => {
        return light ? path + "PixelX.svg" : path + "PixelXDark.svg";
    };

    return (
        <button
            onClick={closeModal}
            className={CloseButtonCSS.button}
            tabIndex={-1}
        >
            <Image
                id="Icon"
                src={theme === "light" ? getButton(true) : getButton(false)}
                alt="Close button"
                aria-hidden={true}
                tabIndex={-1}
                fill
                priority
                sizes="100vw"
            />
        </button>
    );
};

export default CloseButton;
