"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import Nav from "@components/NavBar/NavBar";
import { ThemeProvider } from "next-themes";

import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";
import "@app/ui/globals.css";
import "@app/ui/variables.css";

import LoadImages from "@hooks/LoadImages";

interface LayoutProps {
    children?: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
    const pathname = usePathname();
    const imagesLoaded = LoadImages();

    const [isMounted, setIsMounted] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        setShouldAnimate(false);

        const animationTriggerTimer = setTimeout(() => {
            setShouldAnimate(true);
        }, 50);

        return () => clearTimeout(animationTriggerTimer);
    }, [pathname, isMounted]);

    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider>
                    <Nav />
                    <div
                        key={pathname}
                        className={`${styles.containerColour} ${
                            styles.initialHide
                        } ${shouldAnimate ? styles.animateUp : ""}`}
                    >
                        <main>{children}</main>
                        <section
                            className={utilStyles.headingCopyright}
                            role="contentinfo"
                        >
                            Copyrights © {new Date().getFullYear()} Elite Lu
                        </section>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
