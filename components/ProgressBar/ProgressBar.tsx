"use client";

import React, { useState } from "react";

// CSS
import ProgressBarCSS from "./ProgressBar.module.css";

// Props definition
interface ProgressBarProps {
    percentage: number;
    colour?: "green" | "blue" | "red";
    label: string;
}

// Component
export default function ProgressBar(props: ProgressBarProps) {
    const fillWidth = Math.max(0, Math.min(100, props.percentage));

    return (
        <div className={ProgressBarCSS.progressBarRow}>
            <div className={ProgressBarCSS.progressBarLabel}>{props.label}</div>
            <div className={ProgressBarCSS.progressBarContainer}>
                <div className={ProgressBarCSS.progressBarTextTop}>
                    {props.percentage}
                </div>
                <div className={ProgressBarCSS.progressBarBorder}>
                    <div className={ProgressBarCSS.progressBarTrack}>
                        <div
                            className={ProgressBarCSS.progressBarFill}
                            style={{ width: `${fillWidth}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
