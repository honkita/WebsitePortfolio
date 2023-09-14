import Link from "next/link";
import Head from "next/head";
import PixelButton from "../components/PixelButton";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import React, { useState, useEffect, Component } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import PixelSwitch from "../components/PixelSwitch";
import ResumeJobs from "../components/ResumeJobs";
import ResumeReferences from "../components/ResumeReferences";
import LanguageDex from "../components/LanguageDex";

export default function Resume(pageProps) {
  const { theme, setTheme } = useTheme();
  return (
    <ThemeProvider>
      <section>
        <Head>
          <title>Resume</title>
        </Head>
        <PixelSwitch />
      </section>
      <div className={styles.container}>
        <section className={utilStyles.heading2Xl}>
          <p>Resume</p>
        </section>

        <div className={styles.side}>
          <LanguageDex></LanguageDex>
          <section className={utilStyles.headingXl}></section>
        </div>
        <section className={utilStyles.headingXl}>
          <p>Previous Employment</p>
        </section>
        <div className={styles.side}>
          <ResumeJobs
            jobName="Software Developer Intern"
            employer="Practice Perfect EMR"
            email="steve@practiceperfectemr.com"
          />
          <ResumeJobs
            jobName="Badminton Instructor & Gym Monitor"
            employer="Town of Newmarket"
            email="kwillins@newmarket.ca "
          />
        </div>
        <section className={utilStyles.headingXl}>
          <p>References</p>
        </section>
        <div className={styles.side}>
          <ResumeReferences
            name="Steve Presement"
            employer="Practice Perfect EMR"
            email="steve@practiceperfectemr.com"
          />
          <ResumeReferences
            name="Christopher Anand"
            employer="McMaster University"
            email="anandc@mcmaster.ca"
          />
          <ResumeReferences
            name="Kathleen Willins"
            employer="Town of Newmarket"
            email="kwillins@newmarket.ca"
          />
          <ResumeReferences
            name="Ricci Tam"
            employer="Newmarket High School"
            email="ricci.tam@yrdsb.ca"
          />
        </div>

        <div className={styles.containerFixed}>
          <PixelButton name="Back" url="/" theme={theme} />
        </div>
        <section></section>
      </div>
    </ThemeProvider>
  );
}
