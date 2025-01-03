import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";

// Child Components
import PixelButton from "../PixelButton/PixelButton";

// CSS
import utilStyles from "../../styles/theme.util.module.css";
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
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

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
                className={`${ResumeJobsCSS.ResumeBacker} ${utilStyles.imageRendering} ${background()}`}
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
