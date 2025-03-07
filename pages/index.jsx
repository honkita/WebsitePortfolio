import React from "react";
import Head from "next/head";
import Layout from "./Layout";

// Child Components
import Projects from "../components/Projects/Projects";
import ImageCarousel from "../components/ImageCarousel/ImageCarousel";
import Title from "../components/Title/Title";

// CSS
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";

//JSONs
import ImagesForCarousel from "../public/Assets/homeCarousel.json";
import CodedProjects from "../public/Assets/projects.json";

export default function Home() {
    const name = "Elite Lu Portfolio";
    var projectsJSON = JSON.parse(JSON.stringify(CodedProjects));

    return (
        <Layout home>
            <div>
                <Head>
                    <title>{name}</title>
                    <meta
                        name="description"
                        content="Elite Lu's official portfolio site"
                    />
                    <meta name="og:title" content={name} />
                </Head>
                <div className={styles.container}>
                    <Title
                        name="Elite Lu"
                        colour="red"
                        buttons={["LinkedIn", "GitHub", "Email", "AboutMe"]}
                    />

                    <section className={utilStyles.headingXl}>
                        <p>About Me</p>
                    </section>
                    <section className={utilStyles.headingMd}>
                        <ul>
                            <li>Software developer</li>
                            <li>
                                Fourth year Computer Science McMaster Student
                            </li>
                        </ul>
                    </section>

                    <section className={utilStyles.headingXl}>
                        <p>Projects</p>
                    </section>
                    <ImageCarousel images={ImagesForCarousel} />
                    <div className={styles.jobGrid}>
                        {projectsJSON.map((project, index) => (
                            <Projects
                                key={index}
                                name={project.name}
                                img={project.img}
                                url={project.url}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
