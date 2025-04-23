"use client";

import React, { ReactNode } from "react";

// Child Components
import Nav from "@components/NavBar/NavBar";
import { ThemeProvider } from "next-themes";

// CSS
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";
import "@app/ui/globals.css";
import "@app/ui/variables.css";

/**
 * Props Interface
 */
interface LayoutProps {
    children?: ReactNode;
    // any props that come into the component
}

export default function RootLayout({ children }: LayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning={false}>
            <body>
                <ThemeProvider>
                    <div className={styles.containerColour}>
                        <Nav />
                        <main>{children}</main>
                        <section className={styles.container}>
                            <section
                                className={utilStyles.headingSm}
                                role="contentinfo"
                            >
                                Copyrights © {new Date().getFullYear()} Elite Lu
                            </section>
                        </section>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
