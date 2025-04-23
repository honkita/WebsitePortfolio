"use client";

import Head from "next/head";

// Child Components
import DevTools from "@components/Icons/DevTools";
import Frameworks from "@components/Icons/Frameworks";
import LanguageDexMobile from "@components/Icons/LanguageDexMobile";
import ResumeJobs from "@components/ResumeJobs/ResumeJobs";
import Title from "@components/Title/Title";

// CSS
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";

// JSONs
import resumeJobs from "@assets/resumeJobs.json";

export default function AboutMe() {
    var resumeJobsJSON = JSON.parse(JSON.stringify(resumeJobs));

    return (
        <div>
            <section>
                <Head>
                    <title>About Me</title>
                </Head>
            </section>
            <div className={styles.container}>
                <Title
                    name="About Me"
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
                    {resumeJobsJSON.map(
                        (
                            resumeJob: {
                                jobName: string;
                                employerName: string;
                                linkedin: string;
                                logo: string;
                            },
                            index: number
                        ) => (
                            <ResumeJobs
                                key={index}
                                jobName={resumeJob.jobName}
                                employerName={resumeJob.employerName}
                                linkedin={resumeJob.linkedin}
                                logo={resumeJob.logo}
                            />
                        )
                    )}
                </div>

                {/* <section className={utilStyles.headingXl}>
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
                </div> */}
            </div>
            <section
                className={`${utilStyles.headingXl} ${styles.paddingTopBottom}`}
            >
                Technologies
            </section>
            <table className={styles.table}>
                <tbody>
                    <tr className={styles.tableRow}>
                        <td
                            className={`${styles.tableItem} ${utilStyles.headingSm} ${styles.paddingRight}`}
                        >
                            Languages
                        </td>
                        <td>
                            <LanguageDexMobile />
                        </td>
                    </tr>
                    <tr className={styles.tableRow}>
                        <td
                            className={`${styles.tableItem} ${utilStyles.headingSm} ${styles.paddingRight}`}
                        >
                            Frameworks, APIs, and Libraries
                        </td>
                        <td>
                            <Frameworks />
                        </td>
                    </tr>
                    <tr className={styles.tableRow}>
                        <td
                            className={`${styles.tableItem} ${utilStyles.headingSm} ${styles.paddingRight}`}
                        >
                            Developer Platforms and Tools
                        </td>
                        <td>
                            <DevTools />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
