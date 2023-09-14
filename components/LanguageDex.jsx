import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";

export default function LanguageDex(props) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("");

  let items = [
    { name: "C", url: "./images/Logos/C.png" },
    { name: "C++", url: "./images/Logos/C++.png" },
    { name: "C#", url: "./images/Logos/CS.png" },
    { name: "HTML", url: "./images/Logos/HTML.png" },
    { name: "CSS", url: "./images/Logos/CSS.png" },
    { name: "JavaScript", url: "./images/Logos/JS.png" },
    { name: "Haskell", url: "./images/Logos/Haskell.png" },
    { name: "Elm", url: "./images/Logos/Elm.png" },
    { name: "Processing", url: "./images/Logos/Processing.png" },
    { name: "Python", url: "./images/Logos/Python.png" },
    { name: "Java", url: "./images/Logos/Java.png" },
    { name: "Latex", url: "./images/Logos/Latex.png" },
  ];

  function showText(text) {
    setLanguage(text);
    console.log(language);
  }

  let itemList = items.map((item, index) => {
    return (
      <button
        onClick={() => {
          showText(item.name);
        }}
        className={utilStyles.logoButtonSmall}
      >
        <img id={item.name} src={item.url} />
      </button>
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
      <div className={utilStyles.LanguageDex}>
        <div className={styles.grid}>{itemList}</div>
        <section className={styles.containerLanguageDex}>
          <div className={utilStyles.boxLgBlack}>
            <p>{language}</p>
          </div>
        </section>
      </div>
    </ThemeProvider>
  );
}
