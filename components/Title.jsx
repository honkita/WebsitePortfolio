import PixelButton from "../components/PixelButton";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import React, { useState, useEffect, Component } from "react";
import { useTheme, ThemeProvider } from "next-themes";

export default function Title(props) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <section
      className={`${utilStyles.namePlate} ${utilStyles.yellowName} ${utilStyles.imageRendering}`}
    >
      <section className={utilStyles.heading2Xl2}>{props.name}</section>
      <section className={styles.containerButtons}>
        <PixelButton
          name="LinkedIn"
          url="https://www.linkedin.com/in/elitelu"
        />
        <PixelButton name="GitHub" url="https://github.com/honkita/" />
        <PixelButton name="Email" url="mailto:elitelulww@gmail.com" />
        <PixelButton name="Download" url="./Elite_Lu_Resume.pdf" />
      </section>
    </section>
  );
}
