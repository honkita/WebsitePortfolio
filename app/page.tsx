import React from "react";
import Head from "next/head";

// Child Components
import Projects from "@components/Projects/Projects";
import ImageCarousel from "@components/ImageCarousel/ImageCarousel";
import Title from "@components/Title/Title";

// CSS
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";

//JSONs
import ImagesForCarousel from "@assets/homeCarousel.json";
import CodedProjects from "@assets/projects.json";

export default function Home() {
    const name = "Elite Lu Portfolio";
    var projectsJSON = JSON.parse(JSON.stringify(CodedProjects));

    return (
        <div>
            <Head>
                <title>{name}</title>
                <meta
                    name="description"
                    content="Elite Lu's official portfolio site"
                />
                <meta name="og:title" content={name} />
            </Head>

            <Title
                name="Elite Lu"
                colour="red"
                buttons={["LinkedIn", "GitHub", "Email", "AboutMe"]}
            />
            {/* <section className={utilStyles.headingXl}>
                <p>About Me</p>
            </section> */}
            <section className={utilStyles.headingMd}>
                <ul>
                    <li>Software developer</li>
                    <li>Fourth year Computer Science McMaster Student</li>
                </ul>
            </section>

            <section className={utilStyles.headingXl}>
                <p>Projects</p>
            </section>
            <ImageCarousel images={ImagesForCarousel} />
            <div className={styles.container}>
                <div className={styles.jobGrid}>
                    {projectsJSON.map(
                        (
                            project: { name: string; img: string; url: string },
                            index: number
                        ) => (
                            <Projects
                                key={index}
                                name={project.name}
                                img={project.img}
                                url={project.url}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
