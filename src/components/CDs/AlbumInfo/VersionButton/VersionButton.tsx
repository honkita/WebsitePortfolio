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
            disabled={versionID === selectedVersionID}
            className={`${VersionButtonCSS.versionButton}`}
            onClick={() => buttonPress(versionID)}
        >
            {name || "Default"}
        </button>
    );
};

export default VersionButton;
