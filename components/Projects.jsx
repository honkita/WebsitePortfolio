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
  return (
    <ThemeProvider>
      <div className={background()}>
        <div className={styles.containerAbsolute}>
          <PixelButton name="GitHub" url={props.url} />
        </div>
      </div>
    </ThemeProvider>
  );
}
