"use client";

// React
import React from "react";
import type { CSSProperties } from "react";

// CSS
import AlbumInfoCSS from "./AlbumInfoCSS.module.css";

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
};

const VersionButton = ({
    versionID,
    name,
    colour,
    selectedVersionID,
    buttonPress
}: VersionButtonProps) => {
    const versionColour = colour?.trim() || "#888888";

    const isActive = selectedVersionID === versionID;

    const versionStyle: VersionColourStyle = {
        "--version-colour": versionColour
    };

    return (
        <button
            type="button"
            style={versionStyle}
            className={`${AlbumInfoCSS.versionButton} ${
                isActive ? AlbumInfoCSS.activeVersion : ""
            }`}
            onClick={() => buttonPress(versionID)}
        >
            {name || "Default"}
        </button>
    );
};

export default VersionButton;
