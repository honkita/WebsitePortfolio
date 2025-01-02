import utilStyles from "../../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import PixelButton from "../PixelButton/PixelButton";
import ResumeJobsCSS from "./ResumeJobs.module.css";

/**
 *
 * @param {object} props
 * @param {string} props.employerName Name of employer
 * @param {string} props.jobName Name of position
 * @returns
 */
export default function ResumeJobs(props) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

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
                className={`${utilStyles.ResumeBacker} ${utilStyles.imageRendering} ${background()}`}
            >
                <section className={ResumeJobsCSS.employerName}>
                    <p>{props.employerName}</p>
                </section>
                <section className={ResumeJobsCSS.jobName}>
                    <p>{props.jobName}</p>
                </section>
                <div className={ResumeJobsCSS.buttonPlacement}>
                    <PixelButton name="LinkedIn" url={props.linkedin} />
                </div>
            </div>
        </ThemeProvider>
    );
}
