"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Child Components
import PixelButton from "@/components/PixelButton/PixelButton";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import ResumeJobsCSS from "./ResumeJobs.module.css";

// JSONs
import resumeJobs from "@/assets/resumeJobs.json";

// Interfaces
interface JobData {
    jobName: string;
    employerName: string;
    linkedin: string;
    logo: string;
    location: string;
    info: string[];
}

/**
 * ResumeJobs Component
 * @returns JSX.Element
 */
export default function ResumeJobs() {
    const [mounted, setMounted] = useState(false);
    const [selectedJobIndex, setSelectedJobIndex] = useState(0);

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
                        <Image
                            src={job.logo}
                            alt={`${job.employerName} logo`}
                            className={`${ResumeJobsCSS.buttonRendering}`}
                            fill
                            priority={true}
                            sizes="100vw"
                        />
                    </button>
                ))}
            </div>
            <div
                className={`${ResumeJobsCSS.ResumeBacker} ${divstyling.border}`}
            >
                <section className={ResumeJobsCSS.jobInfo}>
                    <div className={ResumeJobsCSS.header}>
                        <div className={ResumeJobsCSS.textHeader}>
                            <h1 className={ResumeJobsCSS.jobTitle}>
                                {selectedJob.jobName}
                            </h1>
                            <h2 className={ResumeJobsCSS.employer}>
                                💼 {selectedJob.employerName}
                            </h2>
                            <h3 className={ResumeJobsCSS.location}>
                                📍 {selectedJob.location}
                            </h3>
                        </div>
                        <div className={ResumeJobsCSS.buttonPlacement}>
                            <PixelButton
                                name="LinkedIn"
                                url={selectedJob.linkedin}
                                extra={false}
                            />
                        </div>
                    </div>
                    <div className={divstyling.hr}></div>
                    {BulletList(selectedJob.info)}
                </section>
            </div>
        </div>
    );
}
