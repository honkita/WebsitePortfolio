import Head from "next/head";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import PixelButton from "../components/PixelButton";
import PixelSwitch from "../components/PixelSwitch";
import { useTheme, ThemeProvider } from "next-themes";
import Projects from "../components/Projects";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
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
          <div>
            <PixelButton
              name="Linkedin"
              url="https://www.linkedin.com/in/elite-lu-a32488230/"
            />
            <PixelButton name="GitHub" url="https://github.com/honkita/" />
            <PixelButton name="Email" url="mailto:elitelulww@gmail.com" />
            <PixelButton name="Resume" url={"./resume"} />
          </div>
          <section className={utilStyles.headingLg}>
            <p>About Me</p>
          </section>
          <section className={utilStyles.headingMd}>
            <p>
              I am a software developer and a third year computer science
              student at McMaster University.
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
              <div>
                <img src="./images/ImageCarousel/ICDerivatives0.png" />
                <p>The Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives1.png" />
                <p>The Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives2.png" />
                <p>The Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives3.png" />
                <p>The Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives4.png" />
                <p>The Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives5.png" />
                <p>The Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives6.png" />
                <p>The Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives7.png" />
                <p>The Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICWebsite.png" />
                <p>Website</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICUta0.png" />
                <p>Uta</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICUta1.png" />
                <p>Uta</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICUta2.png" />
                <p>Uta</p>
              </div>
            </Carousel>
          </div>
          <div className={styles.jobGrid}>
            <Projects
              name="The Derivatives Game"
              url="https://github.com/honkita/Math-App"
              languages={[{ name: "Elm" }]}
            />
            <Projects
              name="Elite Lu Portfolio Website"
              url="https://github.com/honkita/WebsitePortfolio"
              languages={[
                { name: "JavaScript" },
                { name: "CSS" },
                { name: "HTML" },
              ]}
            />
            <Projects
              name="Uta Rhythm Game "
              url="https://github.com/honkita/WebsitePortfolio"
              languages={[{ name: "Processing" }]}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
