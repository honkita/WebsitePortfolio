"use client";

import React, { useState } from "react";

// CSS
import ProgressBarCSS from "./ProgressBar.module.css";

// Props definition
interface ProgressBarProps {
    numerator: number;
    denominator: number;
    colour?: "green" | "blue" | "red";
    label: string;
}

// Component
export default function ProgressBar(props: ProgressBarProps) {
    return (
        <div className={ProgressBarCSS.progressBarRow}>
            <div className={ProgressBarCSS.progressBarLabel}>{props.label}</div>
            <div className={ProgressBarCSS.progressBarContainer}>
                <div className={ProgressBarCSS.progressBarTextTop}>
                    {props.numerator} / {props.denominator}
                </div>
                <div className={ProgressBarCSS.progressBarBorder}>
                    <div className={ProgressBarCSS.progressBarTrack}>
                        <div
                            className={ProgressBarCSS.progressBarFill}
                            style={{
                                width: `${
                                    (props.numerator / props.denominator) * 100
                                }%`
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
