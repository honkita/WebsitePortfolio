import Head from "next/head";
import PixelButton from "../components/PixelButton";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import React, { useState, useEffect, Component } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import PixelSwitch from "../components/PixelSwitch";

export default function Layout({ home, children }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <ThemeProvider>
      <PixelSwitch />
      <meta name="description" content="Elite Lu's website portfolio"></meta>
      <main>{children}</main>
      {!home && (
        <div className={styles.containerFixedLeft}>
          <PixelButton name="Back" url="/" theme={resolvedTheme} />
        </div>
      )}
      <section className={styles.container}>
        <section className={styles.headingMd}>
          Copyrights © 2023 Elite Lu
        </section>
      </section>
    </ThemeProvider>
  );
}
