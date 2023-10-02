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
      return utilStyles.ReferenceBacker;
    } else {
      return utilStyles.ReferenceBackerDark;
    }
  }

  function addLinkedIn() {
    if (props.LinkedIn !== "") {
      return <PixelButton name="LinkedIn" url={props.LinkedIn} />;
    }
    return;
  }

  function addCall() {
    if (props.phone !== "") {
      return <PixelButton name="Call" url={props.phone} />;
    }
    return;
  }

  return (
    <ThemeProvider>
      <div className={background()}>
        <section className={utilStyles.boxLg}>
          <p>{props.name}</p>
        </section>
        <section className={utilStyles.box2Md}>
          <p>{props.employer}</p>
        </section>
        <div className={styles.containerAbsolute}>
          {addCall()}
          <PixelButton name="Email" url={"mailto:" + props.email} />
          {addLinkedIn()}
        </div>
      </div>
    </ThemeProvider>
  );
}
