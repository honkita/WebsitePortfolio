"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Child Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import utilStyles from "@styles/theme.util.module.css";
import ResumeJobsCSS from "./ResumeJobs.module.css";

/**
 * Props Interface
 */
interface ResumeJobsProps {
    employerName: string;
    jobName: string;
    linkedin: string;
    logo: string;
}

export default function ResumeJobs(props: ResumeJobsProps) {
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
                className={`${ResumeJobsCSS.ResumeBacker} ${
                    utilStyles.imageRendering
                } ${background()}`}
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
