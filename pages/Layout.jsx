import Head from "next/head";
import PixelButton from "../components/PixelButton";
import styles from "../styles/Home.module.css";
import utilStyles from "../styles/theme.util.module.css";
import React, { useState, useEffect, Component } from "react";
import { useTheme, ThemeProvider } from "next-themes";

import Nav from "../components/NavBar";

export default function Layout({ home, children }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <ThemeProvider>
      <Nav />
      <main>{children}</main>
      <section className={styles.container}>
        <section className={styles.headingMd} role="contentinfo">
          Copyrights © {new Date().getFullYear()} Elite Lu
        </section>
      </section>
    </ThemeProvider>
  );
}
