import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";

export default function LanguageDexMobile(props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [language, setLanguage] = useState("");
  const [paradigm, setParadigm] = useState("");

  let items = [
    { name: "ARM", type: "Assembly", url: "./images/Logos/ARM.png" },
    { name: "C", type: "Imperative", url: "./images/Logos/C.png" },
    { name: "C++", type: "Object-Oriented", url: "./images/Logos/C++.png" },
    { name: "C#", type: "Object-Oriented", url: "./images/Logos/CS.png" },
    { name: "HTML", type: "Markup", url: "./images/Logos/HTML.png" },
    { name: "CSS", type: "Style Sheet", url: "./images/Logos/CSS.png" },
    {
      name: "JavaScript",
      type: "Object-Oriented",
      url: "./images/Logos/JS.png",
    },
    { name: "Haskell", type: "Functional", url: "./images/Logos/Haskell.png" },
    { name: "Elm", type: "Functional", url: "./images/Logos/Elm.png" },
    {
      name: "Prolog",
      type: "Logic",
      url: "./images/Logos/Processing.png",
    },
    {
      name: "Processing",
      type: "Object-Oriented",
      url: "./images/Logos/Processing.png",
    },
    {
      name: "Python",
      type: "Object-Oriented",
      url: "./images/Logos/Python.png",
    },
    { name: "Java", type: "Object-Oriented", url: "./images/Logos/Java.png" },
    {
      name: "Gradle",
      type: "Build Automation",
      url: "./images/Logos/Gradle.png",
    },
    { name: "Latex", type: "Formatted Text", url: "./images/Logos/Latex.png" },
  ];

  function showText(n, p) {
    setLanguage(n);
    setParadigm(p);
  }

  let itemList = items.map((item, index) => {
    return (
      <div className={styles.under}>
        <button className={utilStyles.logoButtonSmall}>
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
      <div className={styles.grid}>{itemList}</div>
    </ThemeProvider>
  );
}
