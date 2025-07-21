import React from "react";
import type { Metadata } from "next";

// Child Components
import ProgressBarGenerator from "@components/ProgressBar/ProgressBar";
import Title from "@components/Title/Title";

// CSS
import divstyling from "@styles/divstyling.module.css";
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";

//JSONs
import ImagesForCarousel from "@assets/homeCarousel.json";
import CodedProjects from "@assets/projects.json";

export const metadata: Metadata = {
    title: "Elite Lu Portfolio"
};

export default function Home() {
    var projectsJSON = JSON.parse(JSON.stringify(CodedProjects));

    return (
        <div>
            <Title
                name="Elite Lu"
                colour="red"
                buttons={["LinkedIn", "GitHub", "Email", "AboutMe"]}
            />
            {/* <section className={utilStyles.headingXl}>
                <p>About Me</p>
            </section> */}
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
                    label={"Proj"}
                    percentage={10}
                    colour={"red"}
                />
            </div>
        </div>
    );
}
