import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";

// Child Components
import {
    CircularProgressbarWithChildren,
    buildStyles,
} from "react-circular-progressbar";

// CSS
import utilStyles from "../../styles/theme.util.module.css";
import SchoolCSS from "./School.module.css";
import "react-circular-progressbar/dist/styles.css";

export default function School(props) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    const GPA = (props.GPA / 4.0) * 100;

    // useEffect only runs on the client, so now we can safely show the UI
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
        } else {
            return `${utilStyles.darkBorder}`;
        }
    }

    return (
        <ThemeProvider>
            <div
                className={`${SchoolCSS.EducationBacker} ${utilStyles.imageRendering} ${background()}`}
            >
                <h1 className={SchoolCSS.schoolName}>
                    <p>{props.schoolName}</p>
                </h1>
                <section className={SchoolCSS.schoolLocation}>
                    <p>{props.schoolLocation}</p>
                </section>

                <section className={SchoolCSS.boxCircleBar}>
                    <CircularProgressbarWithChildren
                        styles={buildStyles({
                            strokeLinecap: "butt",
                            textSize: "16px",

                            pathTransitionDuration: 0.5,
                            pathColor: `rgba(255, 0, 0, ${66 / 100})`,
                            trailColor: `rgba(69, 69, 69, 1)`,
                        })}
                        value={GPA}
                    >
                        <div className={SchoolCSS.headingMdCircle}>
                            {props.GPA.toFixed(1)}/4.0
                        </div>
                    </CircularProgressbarWithChildren>
                </section>
            </div>
        </ThemeProvider>
    );
}
