import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import PixelButton from "./PixelButton";

export default function School(props) {
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
      return utilStyles.ResumeBacker;
    } else {
      return utilStyles.ResumeBackerDark;
    }
  }

  return (
    <ThemeProvider>
      <div className={background()}>
        <section className={utilStyles.boxLg}>
          <p>{props.schoolName}</p>
        </section>
        <section className={utilStyles.box2Md}>
          <p>{props.schoolLocation}</p>
        </section>
        <section className={utilStyles.box2Md}>
          <p>GPA: {props.GPA.toFixed(1)} / 4.0</p>
        </section>
      </div>
    </ThemeProvider>
  );
}
