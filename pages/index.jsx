import Head from "next/head";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import Projects from "../components/Projects";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Layout from "./Layout";
import Title from "../components/Title";
import React from "react";

//json imports
import ImageCarousel from "../public/Assets/homeCarousel.json";
import CodedProjects from "../public/Assets/projects.json";

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const name = "Elite Lu Portfolio";

  var imagesJSON = JSON.parse(JSON.stringify(ImageCarousel));
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
            buttons={["LinkedIn", "GitHub", "Email", "Resume"]}
          />

          <section className={utilStyles.headingXl}>
            <p>About Me</p>
          </section>
          <section className={utilStyles.headingMd}>
            <p>
              I am a software developer and a third year computer science
              student at McMaster University. More information about me can be
              found on my <a href="./resume">resume</a>.
            </p>
            <p>
              In addition to this, I am an artist and illustrator. More about my
              art coming soon!
            </p>
          </section>

          <section className={utilStyles.headingXl}>
            <p>Projects</p>
          </section>
          <div className={styles.carousel}>
            <Carousel
              infiniteLoop={true}
              autoPlay={true}
              centerMode={true}
              centerSlidePercentage={100}
              dynamicHeight={true}
              showArrows={true}
            >
              {imagesJSON.map((img) => (
                <div>
                  <img alt={img.description} src={img.image} />
                  <p className="legend">{img.description} </p>
                </div>
              ))}
            </Carousel>
          </div>

          <div className={styles.jobGrid}>
            {projectsJSON.map((project) => (
              <Projects
                name={project.name}
                url={project.url}
                languages={project.languages.map((language) => ({
                  name: language,
                }))}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
