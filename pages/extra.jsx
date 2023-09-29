import Head from "next/head";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import Projects2 from "../components/Projects2";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Layout from "./Layout";

export default function extra() {
  const { resolvedTheme, setTheme } = useTheme();
  const name = "Elite Lu Portfolio";

  return (
    <Layout children>
      <div>
        <Head>
          <title>{"Special Thanks"}</title>
          <meta
            name="description"
            content="Elite Lu's official portfolio site"
          />
          <meta name="og:title" content={name} />
        </Head>
        <section className={styles.container}>
          <section className={utilStyles.heading2Xl}>Special Thanks</section>
          <section className={utilStyles.headingMd}>
            <p>
              I would like to dedicate this area to all the people that have
              helped me make this site. I could have not done this project
              without each of these people.
            </p>
          </section>
          <div className={styles.jobGrid}>
            <Projects2 name="James Nikoli" url="https://github.com/devdalus" />
            <Projects2
              name="Krish Krish"
              url="https://github.com/Krish120003"
            />
            <Projects2 name="Jason Huang" url="https://github.com/err53" />
            <Projects2
              name="Ishpreet Nagi"
              url="https://github.com/IshpreetNagi"
            />
            <Projects2
              name="Kenneth Vincenzo Salim"
              url="https://github.com/kennethkvs"
            />
            <Projects2 name="Geon Youn" url="https://github.com/geon-youn" />
            <Projects2
              name="Owen Gretzinger"
              url="https://github.com/owengretzinger"
            />
            <Projects2 name="Stella Gu" url="https://github.com/Stella-Gu" />
          </div>
        </section>
      </div>
    </Layout>
  );
}
