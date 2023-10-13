import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";

export default function DevTools(props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("");
  const [paradigm, setParadigm] = useState("");

  let items = [
    { name: "DBeaver", url: "./images/DevTools/DBeaver.png" },
    { name: "Eclipse", url: "./images/DevTools/Eclipse.png" },
    { name: "GitHub", url: "./images/DevTools/GitHub.png" },
    { name: "JupyterHub", url: "./images/DevTools/JupyterHub.png" },
    { name: "Matlab", url: "./images/DevTools/Matlab.png" },
    { name: "Netbeans", url: "./images/DevTools/Netbeans.png" },
    { name: "Overleaf", url: "./images/DevTools/Overleaf.png" },
    { name: "VS Code", url: "./images/DevTools/VisualStudioCode.png" },
  ];

  let itemList = items.map((item, index) => {
    return (
      <div className={styles.under}>
        <button
          className={`${utilStyles.logoButtonSmall} ${utilStyles.buttonRendering}`}
        >
          <img id={item.name} src={item.url} />
        </button>
        {item.name}
      </div>
    );
  });

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  let src;

  return (
    <ThemeProvider>
      <div className={styles.grid3}>{itemList}</div>
    </ThemeProvider>
  );
}
