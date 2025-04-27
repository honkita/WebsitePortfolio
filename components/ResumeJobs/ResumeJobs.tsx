"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Child Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import utilStyles from "@styles/theme.util.module.css";
import ResumeJobsCSS from "./ResumeJobs.module.css";

// JSONs
import resumeJobs from "@assets/resumeJobs.json";

// Interfaces
interface JobData {
    jobName: string;
    employerName: string;
    linkedin: string;
    location: string;
    logo: string;
}

export default function ResumeJobs() {
    const [mounted, setMounted] = useState(false);
    const [selectedJobIndex, setSelectedJobIndex] = useState(0);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const background = () => {
        return resolvedTheme === "light"
            ? utilStyles.lightBorder
            : utilStyles.darkBorder;
    };

    const handleJobSelect = (index: number) => {
        setSelectedJobIndex(index);
    };

    const selectedJob = resumeJobs[selectedJobIndex];

    return (
        <div className={ResumeJobsCSS.resumeContainer}>
            {/* Side Button Panel */}
            <div className={ResumeJobsCSS.sidePanel}>
                {resumeJobs.map((job: JobData, index: number) => (
                    <button
                        key={index}
                        className={`${ResumeJobsCSS.button} ${
                            index === selectedJobIndex
                                ? ResumeJobsCSS.activeJobButton
                                : ""
                        }`}
                        onClick={() => handleJobSelect(index)}
                    >
                        <img
                            src={job.logo}
                            alt={`${job.employerName} logo`}
                            className={`${ResumeJobsCSS.buttonRendering}`}
                        />
                    </button>
                ))}
            </div>

            {/* Job Details Display */}
            <div className={`${ResumeJobsCSS.ResumeBacker} ${background()}`}>
                <section className={ResumeJobsCSS.jobInfo}>
                    <h1 className={ResumeJobsCSS.jobTitle}>
                        {selectedJob.jobName}
                    </h1>
                    <h2 className={ResumeJobsCSS.employer}>
                        {selectedJob.employerName}
                    </h2>
                    <h3 className={ResumeJobsCSS.location}>
                        {selectedJob.location}
                    </h3>
                    <div className={ResumeJobsCSS.buttonPlacement}>
                        <PixelButton
                            name="LinkedIn"
                            url={selectedJob.linkedin}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
