import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import frameworks from "../public/Assets/frameworks.json";

export default function Frameworks(props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  var frameworksJSON = JSON.parse(JSON.stringify(frameworks));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className={styles.grid2}>
        {frameworksJSON.map((frameworks) => (
          <div className={styles.under}>
            <button
              className={`${utilStyles.logoButtonSmall} ${utilStyles.buttonRendering}`}
              title={frameworks.name}
            >
              <img id={frameworks.name} src={frameworks.url} />
            </button>
            {frameworks.name}
          </div>
        ))}
      </div>
    </ThemeProvider>
  );
}
