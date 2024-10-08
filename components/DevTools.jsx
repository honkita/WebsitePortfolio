import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import devTools from "../public/Assets/devTools.json";

export default function DevTools(props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  var devToolsJSON = JSON.parse(JSON.stringify(devTools));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className={styles.grid3}>
        {devToolsJSON.map((devTool) => (
          <div className={styles.under}>
            <button
              className={`${utilStyles.logoButtonSmall} ${utilStyles.buttonRendering}`}
              title={devTool.name}
            >
              <img id={devTool.name} src={devTool.url} alt={devTool.name} />
            </button>
            {devTool.name}
          </div>
        ))}
      </div>
    </ThemeProvider>
  );
}
