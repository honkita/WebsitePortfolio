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
                    label={"PROJ"}
                    numerator={10}
                    denominator={100}
                    colour={"red"}
                />
                <ProgressBarGenerator
                    label={"ART"}
                    numerator={10}
                    denominator={22}
                    colour={"red"}
                />
                <ProgressBarGenerator
                    label={"GPA"}
                    numerator={11}
                    denominator={12}
                    colour={"red"}
                />
            </div>
        </div>
    );
}
