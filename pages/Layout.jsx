import React from "react";

// Child Components
import Nav from "../components/NavBar/NavBar";

// CSS
import styles from "../styles/Home.module.css";

export default function Layout({ children }) {
    return (
        <div className={styles.containerColour}>
            <Nav />
            <main>{children}</main>
            <section className={styles.container}>
                <section className={styles.headingMd} role="contentinfo">
                    Copyrights © {new Date().getFullYear()} Elite Lu
                </section>
            </section>
        </div>
    );
}
