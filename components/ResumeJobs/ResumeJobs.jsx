import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

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
        }
        return `${utilStyles.darkBorder}`;
    }

    return (
        <div>
            <div
                className={`${ResumeJobsCSS.ResumeBacker} ${utilStyles.imageRendering} ${background()}`}
            >
                <img
                    id={props.jobName}
                    src={props.logo}
                    alt={props.employerName + " image "}
                    className={`${ResumeJobsCSS.logo} ${ResumeJobsCSS.buttonRendering}`}
                />
                <section className={ResumeJobsCSS.jobName}>
                    <p>{props.jobName}</p>
                </section>

                <div className={ResumeJobsCSS.buttonPlacement}>
                    <PixelButton name="LinkedIn" url={props.linkedin} />
                </div>
            </div>
        </div>
    );
}
