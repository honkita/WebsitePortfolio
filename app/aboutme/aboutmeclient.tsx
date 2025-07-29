"use client";

// Child Components
import ResumeJobs from "@components/ResumeJobs/ResumeJobs";
import School from "@components/School/School";
import Icons from "@components/Icons/Icons";
import Title from "@components/Title/Title";

// CSS
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";
import divstyling from "@styles/divstyling.module.css";

// JSONs
import devTools from "@assets/devTools.json";
import frameworks from "@assets/frameworks.json";
import languages from "@assets/languages.json";

export default function AboutMeClient() {
    let devToolsJSON = JSON.parse(JSON.stringify(devTools));
    let frameworksJSON = JSON.parse(JSON.stringify(frameworks));
    let languagesJSON = JSON.parse(JSON.stringify(languages));

    return (
        <div className={styles.pageContainer}>
            <Title
                name="About Me"
                colour="yellow"
                buttons={["LinkedIn", "GitHub", "Email", "ResumeDownload"]}
            />

            <div className={styles.contentWrapper}>
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>

                <div className={styles.centeredContent}>
                    <section className={utilStyles.headingXl}>
                        <p>Previous Employment</p>
                    </section>
                    <ResumeJobs />
                </div>

                <div
                    className={divstyling.hr}
                    style={{ marginTop: "5rem" }}
                ></div>

                <div className={styles.centeredContent}>
                    <section
                        className={`${utilStyles.headingXl} ${styles.paddingTopBottom}`}
                    >
                        Technologies
                    </section>
                    <table className={styles.table}>
                        <tbody>
                            <tr className={`${styles.tableRow}`}>
                                <td
                                    className={`${utilStyles.headingSm} ${styles.tableTitle}`}
                                >
                                    Languages
                                </td>
                                <td className={styles.tableValue}>
                                    <Icons icons={languagesJSON} />
                                </td>
                            </tr>
                            <tr className={styles.tableRow}>
                                <td
                                    className={`${utilStyles.headingTable} ${styles.tableTitle}`}
                                >
                                    Frameworks & Technologies
                                </td>
                                <td>
                                    <Icons icons={frameworksJSON} />
                                </td>
                            </tr>
                            <tr className={styles.tableRow}>
                                <td
                                    className={`${utilStyles.headingTable} ${styles.tableTitle}`}
                                >
                                    Developer Platforms & Tools
                                </td>
                                <td>
                                    <Icons icons={devToolsJSON} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
