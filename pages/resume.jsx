import Head from "next/head";
import PixelButton from "../components/PixelButton";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import React, { useState, useEffect, Component } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import PixelSwitch from "../components/PixelSwitch";
import ResumeJobs from "../components/ResumeJobs";
import ResumeReferences from "../components/ResumeReferences";
import School from "../components/School";
import LanguageDex from "../components/LanguageDex";

export default function Resume(pageProps) {
  const { resolvedTheme, setTheme } = useTheme();
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
          <section className={utilStyles.headingXl}></section>
        </div>
        <section className={utilStyles.headingXl}>
          <p>Previous Employment</p>
        </section>
        <div className={styles.locationGrid}>
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
        <section className={utilStyles.headingXl}>
          <p>Language Proficiency</p>
        </section>
        <section className={utilStyles.headingXl}>
          <p>References</p>
        </section>
        <div className={styles.jobGrid}>
          <ResumeReferences
            name="Steve Presement"
            employer="Practice Perfect EMR"
            email="steve@practiceperfectemr.com"
            phone="tel:8555084409"
            linkedin="https://www.linkedin.com/in/steven-presement-2b5a282b/"
          />
          <ResumeReferences
            name="Jeff Yang"
            employer="Practice Perfect EMR"
            email="jeff.yang@practiceperfectemr.com"
            phone=""
            linkedin="https://www.linkedin.com/in/jeff-yang-8185018/"
          />
          <ResumeReferences
            name="Christopher Anand"
            employer="McMaster University"
            email="anandc@mcmaster.ca"
            phone=""
            linkedin="https://www.linkedin.com/in/christopheranand/"
          />
          <ResumeReferences
            name="Kathleen Willins"
            employer="Town of Newmarket"
            email="kwillins@newmarket.ca"
            phone=""
            linkedin=""
          />
          <ResumeReferences
            name="Ricci Tam"
            employer="Newmarket High School"
            email="ricci.tam@yrdsb.ca"
            phone=""
            linkedin=""
          />
        </div>

        <div className={styles.containerFixedLeft}>
          <PixelButton name="Back" url="/" theme={resolvedTheme} />
        </div>
        <div className={styles.containerFixedRight}>
          <PixelButton
            name="Download"
            url="./Elite_Lu_Resume.pdf"
            theme={resolvedTheme}
          />
        </div>
        <section></section>
      </div>
    </ThemeProvider>
  );
}
