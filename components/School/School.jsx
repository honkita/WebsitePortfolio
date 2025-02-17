import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// CSS
import utilStyles from "../../styles/theme.util.module.css";
import SchoolCSS from "./School.module.css";
import "react-circular-progressbar/dist/styles.css";

export default function School(props) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    let src;

    function background() {
        if (resolvedTheme === "light") {
            return `${utilStyles.lightBorder}`;
        }
        return `${utilStyles.darkBorder}`;
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
            className={`${SchoolCSS.EducationBacker} ${utilStyles.imageRendering} ${background()}`}
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
                        transform: `rotate(${angle - 90}deg ${cx / 2} ${cy / 2})`,
                    }}
                />
            </svg>
        </div>
    );
}
