import React, { useEffect, useState } from "react";
import utilStyles from "../styles/theme.util.module.css";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";

export default function Copyright() {
  return (
    <ThemeProvider>
      <section className={styles.headingMd}>Copyrights © 2023 Elite Lu</section>
    </ThemeProvider>
  );
}
