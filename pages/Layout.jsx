import React from "react";
import { ThemeProvider } from "next-themes";

// Child Components
import Nav from "../components/NavBar/NavBar";

// CSS
import styles from "../styles/Home.module.css";

export default function Layout({ home, children }) {
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
