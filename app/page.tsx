import React from "react";
import type { Metadata } from "next";

// Child Components
import ProgressBarGenerator from "@components/ProgressBar/ProgressBar";
import Title from "@components/Title/Title";

// CSS
import divstyling from "@styles/divstyling.module.css";
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";

export const metadata: Metadata = {
    title: "Elite Lu Portfolio"
};

export default function Home() {
    const year = new Date().getFullYear();
    const age = year - 2003;
    return (
        <div>
            <Title
                name="Elite Lu"
                colour="red"
                buttons={["LinkedIn", "GitHub", "Email", "AboutMe"]}
            />
            <div className={styles.contentWrapper}>
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>
                <section className={utilStyles.headingMd}>
                    <ul>
                        <li>Software developer</li>
                        <li>Fourth year Computer Science McMaster Student</li>
                    </ul>
                </section>
                <ProgressBarGenerator
                    label={"GPA"}
                    numerator={10.8}
                    denominator={12}
                    colour={"red"}
                />
                <ProgressBarGenerator
                    label={"CODE"}
                    numerator={year - 2017}
                    denominator={age}
                    colour={"red"}
                />
                <ProgressBarGenerator
                    label={"ART"}
                    numerator={year - 2014}
                    denominator={age}
                    colour={"red"}
                />
                <ProgressBarGenerator
                    label={"SEW"}
                    numerator={year - 2019}
                    denominator={age}
                    colour={"red"}
                />
            </div>
        </div>
    );
}
