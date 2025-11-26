"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import SchoolCSS from "./School.module.css";
import "react-circular-progressbar/dist/styles.css";

/**
 * Props Interface
 */
interface SchoolProps {
    GPA: number;
    schoolLocation: string;
    schoolName: string;
}

export default function School(props: SchoolProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const r = 50;
    const cx = r * 4;
    const cy = r * 4;
    const GPA = props.GPA / 4.0;
    const circumference = 2 * r * 3.14;
    const p = GPA * circumference;
    const angle = GPA * 360;

    return (
        <div
            className={`${SchoolCSS.EducationBacker} ${divstyling.imageRendering} ${divstyling.border}`}
        >
            <h1 className={SchoolCSS.schoolName}>
                <p>{props.schoolName}</p>
            </h1>
            <section className={SchoolCSS.schoolLocation}>
                <p>{props.schoolLocation}</p>
            </section>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={SchoolCSS.boxCircleBar}
                viewBox={"0 0 " + cx + " " + cy}
            >
                <circle
                    r={r}
                    cx={cx / 2}
                    cy={cy / 2}
                    className={SchoolCSS.colour}
                />
                <circle
                    r={r}
                    cx={cx / 2}
                    cy={cy / 2}
                    className={SchoolCSS.colour}
                    style={{
                        strokeWidth: `${r / 8}`,
                        strokeDasharray: `${p} ${circumference}`,
                        transform: `rotate(${angle - 90}deg ${cx / 2} ${
                            cy / 2
                        })`
                    }}
                />
            </svg>
        </div>
    );
}
