"use client";

// Child Components
import DevTools from "@components/Icons/DevTools";
import Frameworks from "@components/Icons/Frameworks";
import LanguageDexMobile from "@components/Icons/LanguageDexMobile";
import ResumeJobs from "@components/ResumeJobs/ResumeJobs";
import School from "@components/School/School";
import Title from "@components/Title/Title";

// CSS
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";
import divstyling from "@styles/divstyling.module.css";

export default function AboutMeClient() {
    return (
        <div className={styles.pageContainer}>
            <section></section>
            <Title
                name="About Me"
                colour="yellow"
                buttons={["LinkedIn", "GitHub", "Email", "Download"]}
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
                                    <LanguageDexMobile />
                                </td>
                            </tr>
                            <tr className={styles.tableRow}>
                                <td
                                    className={`${utilStyles.headingTable} ${styles.tableTitle}`}
                                >
                                    Frameworks & Technologies
                                </td>
                                <td>
                                    <Frameworks />
                                </td>
                            </tr>
                            <tr className={styles.tableRow}>
                                <td
                                    className={`${utilStyles.headingTable} ${styles.tableTitle}`}
                                >
                                    Developer Platforms & Tools
                                </td>
                                <td>
                                    <DevTools />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
