import Head from "next/head";
import PixelButton from "../components/PixelButton";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import React, { useState, useEffect, Component } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import ResumeJobs from "../components/ResumeJobs";
import School from "../components/School";
import LanguageDexMobile from "../components/LanguageDexMobile";
import Frameworks from "../components/Frameworks";
import Layout from "./Layout";
import Title from "../components/Title";
import DevTools from "../components/DevTools";
import resumeJobs from "../public/Assets/resumeJobs.json";

export default function Resume(pageProps) {
    const { resolvedTheme, setTheme } = useTheme();

    var resumeJobsJSON = JSON.parse(JSON.stringify(resumeJobs));

    return (
        <Layout children>
            <section>
                <Head>
                    <title>Resume</title>
                </Head>
            </section>
            <div className={styles.container}>
                <Title
                    name="Resume"
                    colour="yellow"
                    buttons={["LinkedIn", "GitHub", "Email", "Download"]}
                />

                <div className={styles.side}>
                    <section className={utilStyles.headingXl}></section>
                </div>
                <section className={utilStyles.headingXl}>
                    <p>Previous Employment</p>
                </section>
                <div className={styles.locationGrid}>
                    {resumeJobsJSON.map((resumeJob) => (
                        <ResumeJobs
                            jobName={resumeJob.jobName}
                            employer={resumeJob.employer}
                            linkedin={resumeJob.linkedin}
                        />
                    ))}
                </div>
                <section className={styles.transformer}>
                    <section>
                        <section className={utilStyles.headingXl}>
                            <p>Language Proficiencies</p>
                        </section>
                        <LanguageDexMobile />
                    </section>
                    <section>
                        <section className={utilStyles.headingXl}>
                            <p>Framework, API, and Library Proficiencies</p>
                        </section>
                        <Frameworks />
                        <section className={utilStyles.headingXl}>
                            <p>Developer Platform and Tool Proficiencies</p>
                        </section>
                        <DevTools />
                    </section>
                </section>

                <section className={utilStyles.headingXl}>
                    <p>Education</p>
                </section>
                <div className={styles.locationGrid}>
                    <School
                        schoolName="McMaster University"
                        schoolLocation="Hamilton, Ontario"
                        GPA={3.9}
                    />
                    <School
                        schoolName="Newmarket High School"
                        schoolLocation="Newmarket, Ontario"
                        GPA={4.0}
                    />
                </div>
            </div>
        </Layout>
    );
}
