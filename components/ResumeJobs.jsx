import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import PixelButton from "./PixelButton";

export default function ResumeJobs(props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  let src;

  function background() {
    if (theme === "light") {
      return utilStyles.ResumeBacker;
    } else {
      return utilStyles.ResumeBackerDark;
    }
  }

  return (
    <ThemeProvider>
      <div className={styles.container}>
        <div className={background()}>
          <section className={utilStyles.boxLg}>
            <p>{props.jobName}</p>
          </section>
          <section className={utilStyles.box2Md}>
            <p>{props.employer}</p>
          </section>
          <div className={styles.containerAbsolute}>
            <PixelButton
              name="Email"
              url={"mailto:" + props.email}
              reverse={true}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
