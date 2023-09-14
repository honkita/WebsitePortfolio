import Head from "next/head";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import PixelButton from "../components/PixelButton";
import PixelSwitch from "../components/PixelSwitch";
import { useTheme, ThemeProvider } from "next-themes";

export default function Home() {
  const { theme, setTheme } = useTheme();
  const name = "Elite Lu";

  return (
    <ThemeProvider>
      <div>
        <Head>
          <title>{"Elite Lu Portfolio"}</title>
        </Head>
        <PixelSwitch />
        <div className={styles.container}>
          <section className={utilStyles.heading2Xl}>
            <p>Elite Lu</p>
          </section>
          <section className={utilStyles.headingLg}>
            <p>About Me</p>
          </section>
          <section className={utilStyles.headingMd}>
            <p>
              I am a software developer and a third year computer science
              student at McMaster University.
            </p>
          </section>

          <div>
            <PixelButton
              name="Linkedin"
              url="https://www.linkedin.com/in/elite-lu-a32488230/"
            />
            <PixelButton name="GitHub" url="https://github.com/honkita/" />
            <PixelButton name="Email" url="mailto:elitelulww@gmail.com" />
            <PixelButton name="Resume" url={"./resume"} />
          </div>

          <section className={utilStyles.headingMd}>
            <p></p>
          </section>
        </div>
      </div>
    </ThemeProvider>
  );
}
