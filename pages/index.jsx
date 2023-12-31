import Head from "next/head";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import PixelButton from "../components/PixelButton";
import { useTheme, ThemeProvider } from "next-themes";
import Projects from "../components/Projects";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Layout from "./Layout";
import Title from "../components/Title";

export default function Home() {
  const { resolvedTheme, setTheme } = useTheme();
  const name = "Elite Lu Portfolio";

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
              <div>
                <img src="./images/ImageCarousel/ICDerivatives0.png" alt="" />
                <p className="legend">The Simple Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives1.png" alt="" />
                <p className="legend">The Simple Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives2.png" alt="" />
                <p className="legend">The Simple Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives3.png" alt="" />
                <p className="legend">The Simple Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives4.png" alt="" />
                <p className="legend">The Simple Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives5.png" alt="" />
                <p className="legend">The Simple Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives6.png" alt="" />
                <p className="legend">The Simple Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICDerivatives7.png" alt="" />
                <p className="legend">The Simple Derivatives Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICWebsite.png" alt="" />
                <p className="legend">Elite Lu Website Portfolio</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICUta0.png" alt="" />
                <p className="legend">Uta Rhythm Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICUta1.png" alt="" />
                <p className="legend">Uta Rhythm Game</p>
              </div>
              <div>
                <img src="./images/ImageCarousel/ICUta2.png" alt="" />
                <p className="legend">Uta Rhythm Game</p>
              </div>
            </Carousel>
          </div>
          <div className={styles.jobGrid}>
            <Projects
              name="Pixel Background Generator"
              url="https://github.com/honkita/Pixel-Background-Generator"
              languages={[{ name: "Java" }]}
            />
            <Projects
              name="The Simple Derivatives Game"
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
              url="https://github.com/honkita/UtaRhythmGame"
              languages={[{ name: "Processing" }]}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
