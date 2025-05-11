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
import divstyling from "@styles/divstyling.module.css";

export default function AboutMe() {
   return (
      <div>
         <section>
            <Head>
               <title>About Me</title>
            </Head>
         </section>
         <Title
            name="About Me"
            colour="yellow"
            buttons={["LinkedIn", "GitHub", "Email", "Download"]}
         />
         {/* <div className={styles.side}>
                    <section className={utilStyles.headingXl}></section>
                </div> */}
         <div className={divstyling.hr} style={{ marginTop: "3rem" }}></div>
         <section className={utilStyles.headingXl}>
            <p>Previous Employment</p>
         </section>
         <ResumeJobs />

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

         <div className={divstyling.hr} style={{ marginTop: "5rem" }}></div>
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
                     className={`${styles.tableItem} ${utilStyles.headingTable} ${styles.paddingRight}`}
                  >
                     Frameworks & Technologies
                  </td>
                  <td>
                     <Frameworks />
                  </td>
               </tr>
               <tr className={styles.tableRow}>
                  <td
                     className={`${styles.tableItem} ${utilStyles.headingTable} ${styles.paddingRight}`}
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
   );
}
