"use client";

// React
import React from "react";
import type { CSSProperties } from "react";

// CSS
import VersionButtonCSS from "./VersionButtonCSS.module.css";

// Props Interface
interface VersionButtonProps {
    versionID: string;
    name: string;
    colour: string;
    selectedVersionID: string;
    buttonPress: (versionId: string) => void;
}

type VersionColourStyle = CSSProperties & {
    "--version-colour": string;
    "--version-text-colour": string;
};

const VersionButton = ({
    versionID,
    name,
    colour,
    selectedVersionID,
    buttonPress
}: VersionButtonProps) => {
    const versionColour = colour?.trim() || "#888888";

    // Calculate contrasting text colour
    const hex = versionColour.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    const textColour = brightness >= 128 ? "#000000" : "#FFFFFF";

    const versionStyle: VersionColourStyle = {
        "--version-colour": versionColour,
        "--version-text-colour": textColour
    };

    return (
        <button
            type="button"
            style={versionStyle}
            disabled={versionID === selectedVersionID}
            className={VersionButtonCSS.versionButton}
            onClick={() => buttonPress(versionID)}
        >
            {name || "Default"}
        </button>
    );
};

export default VersionButton;
