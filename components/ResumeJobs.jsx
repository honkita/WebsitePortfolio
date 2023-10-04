import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import PixelButton from "./PixelButton";

export default function ResumeJobs(props) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  let src;

  function background() {
    if (resolvedTheme === "light") {
      return `${utilStyles.ResumeBacker} ${utilStyles.imageRendering}`;
    } else {
      return `${utilStyles.ResumeBacker} ${utilStyles.imageRendering}`;
    }
  }

  return (
    <ThemeProvider>
      <div className={background()}>
        <section className={utilStyles.boxLg}>
          <p>{props.jobName}</p>
        </section>
        <section className={utilStyles.box2Md}>
          <p>{props.employer}</p>
        </section>
        <div className={styles.containerAbsolute}>
          <PixelButton name="Email" url={"mailto:" + props.email} />
        </div>
      </div>
    </ThemeProvider>
  );
}
