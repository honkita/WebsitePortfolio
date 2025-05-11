"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Child Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import divstyling from "@styles/divstyling.module.css";
import ResumeJobsCSS from "./ResumeJobs.module.css";

// JSONs
import resumeJobs from "@assets/resumeJobs.json";

// Interfaces
interface JobData {
    jobName: string;
    employerName: string;
    linkedin: string;
    logo: string;
    location: string;
    info: string[];
}

export default function ResumeJobs() {
    const [mounted, setMounted] = useState(false);
    const [selectedJobIndex, setSelectedJobIndex] = useState(0);
    const { resolvedTheme } = useTheme();

    function BulletList(points: string[]) {
        return (
            <ul className={ResumeJobsCSS.list}>
                {points.map((point: string, index: number) => (
                    <li key={index} className={ResumeJobsCSS.bullets}>
                        <span className={ResumeJobsCSS.bullet}>•</span>
                        {point}
                    </li>
                ))}
            </ul>
        );
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

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
                            fetchPriority={"high"}
                            alt={`${job.employerName} logo`}
                            className={`${ResumeJobsCSS.buttonRendering}`}
                        />
                    </button>
                ))}
            </div>

            {/* Job Details Display */}
            <div
                className={`${ResumeJobsCSS.ResumeBacker} ${divstyling.border}`}
            >
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

                    <PixelButton name="LinkedIn" url={selectedJob.linkedin} />
                    <div className={divstyling.hr}></div>
                    {BulletList(selectedJob.info)}
                </section>
            </div>
        </div>
    );
}
