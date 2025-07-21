import React from "react";
import type { Metadata } from "next";

// Child Components
import ProgressBarGenerator from "@components/ProgressBar/ProgressBar";
import Project from "@components/Project/Project";
import ImageCarousel from "@components/ImageCarousel/ImageCarousel";
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

export default function Projects() {
    var projectsJSON = JSON.parse(JSON.stringify(CodedProjects));

    return (
        <div>
            <Title
                name="Projects"
                colour="blue"
                buttons={["LinkedIn", "GitHub", "Email", "AboutMe"]}
            />
            <div className={styles.contentWrapper}>
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>
                <ImageCarousel images={ImagesForCarousel} />
                <div className={styles.container}>
                    <div className={styles.jobGrid}>
                        {projectsJSON.map(
                            (
                                project: {
                                    name: string;
                                    img: string;
                                    url: string;
                                },
                                index: number
                            ) => (
                                <Project
                                    key={index}
                                    name={project.name}
                                    img={project.img}
                                    url={project.url}
                                />
                            )
                        )}
                    </div>
                </div>
                <ProgressBarGenerator
                    label={"Proj"}
                    percentage={10}
                    colour={"red"}
                />
            </div>
        </div>
    );
}
