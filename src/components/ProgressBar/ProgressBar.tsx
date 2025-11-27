"use client";

import React from "react";

// CSS
import ProgressBarCSS from "./ProgressBar.module.css";

// Props definition
interface ProgressBarProps {
    numerator: number;
    denominator: number;
    colour?: "green" | "blue" | "red";
    label: string;
    suffix: string;
}

// Component
export default function ProgressBar({
    numerator,
    denominator,
    colour,
    label,
    suffix
}: ProgressBarProps) {
    return (
        <div className={ProgressBarCSS.progressBarRow}>
            <div className={ProgressBarCSS.progressBarLabel}>{label}</div>
            <div className={ProgressBarCSS.progressBarContainer}>
                <div className={ProgressBarCSS.progressBarTextTop}>
                    {numerator} / {denominator} {suffix}
                </div>
                <div className={ProgressBarCSS.progressBarBorder}>
                    <div className={ProgressBarCSS.progressBarTrack}>
                        <div
                            className={ProgressBarCSS.progressBarFill}
                            style={{
                                width: `${(numerator / denominator) * 100}%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
