import Head from "next/head";
import Layout from "./Layout";

// Child Components
import Title from "../components/Title/Title";
import DevTools from "../components/Icons/DevTools";
import ResumeJobs from "../components/ResumeJobs/ResumeJobs";
import School from "../components/School/School";
import LanguageDexMobile from "../components/Icons/LanguageDexMobile";
import Frameworks from "../components/Icons/Frameworks";

// CSS
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";

// JSONs
import resumeJobs from "../public/Assets/resumeJobs.json";

export default function AboutMe() {
    var resumeJobsJSON = JSON.parse(JSON.stringify(resumeJobs));

    return (
        <Layout children>
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
                    {resumeJobsJSON.map((resumeJob, index) => (
                        <ResumeJobs
                            key={index}
                            jobName={resumeJob.jobName}
                            employerName={resumeJob.employerName}
                            linkedin={resumeJob.linkedin}
                        />
                    ))}
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
            <div
                className={`${utilStyles.headingXl} ${styles.paddingTopBottom}`}
            >
                Technologies
            </div>
            <table className={styles.table}>
                <tbody>
                    <tr className={styles.tableRow}>
                        <td
                            className={`${styles.tableItem} ${utilStyles.headingMd} ${styles.paddingRight}`}
                        >
                            Languages
                        </td>
                        <td>
                            <LanguageDexMobile />
                        </td>
                    </tr>
                    <tr className={styles.tableRow}>
                        <td
                            className={`${styles.tableItem} ${utilStyles.headingMd} ${styles.paddingRight}`}
                        >
                            Frameworks, APIs, and Libraries
                        </td>
                        <td>
                            <Frameworks />
                        </td>
                    </tr>
                    <tr className={styles.tableRow}>
                        <td
                            className={`${styles.tableItem} ${utilStyles.headingMd} ${styles.paddingRight}`}
                        >
                            Developer Platforms and Tools
                        </td>
                        <td>
                            <DevTools />
                        </td>
                    </tr>
                </tbody>
            </table>
        </Layout>
    );
}
