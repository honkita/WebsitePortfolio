"use client";

import React, { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

// Child Components
import Nav from "@components/NavBar/NavBar";
import { useEffect } from "react";
import { ThemeProvider } from "next-themes";

// CSS
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";
import "@app/ui/globals.css";
import "@app/ui/variables.css";

// Hooks
import LoadImages from "@hooks/LoadImages";

/**
 * Props Interface
 */
interface LayoutProps {
    children?: ReactNode;
    // any props that come into the component
}

export default function RootLayout({ children }: LayoutProps) {
    const pathname = usePathname();
    useEffect(() => {
        // Animation will automatically restart on component mount
    }, [pathname]);

    const imagesLoaded = LoadImages();
    const [showContent, setShowContent] = useState(false);
    useEffect(() => {
        if (imagesLoaded) {
            // Optional: Add a small delay for smoother transition
            const timer = setTimeout(() => {
                setShowContent(true);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [imagesLoaded]);

    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider>
                    {showContent ? (
                        <div
                            key={pathname}
                            className={`${styles.containerColour} ${styles.animateUp}`}
                        >
                            <>
                                <Nav />
                                <main>{children}</main>
                                <section
                                    className={utilStyles.headingCopyright}
                                    role="contentinfo"
                                >
                                    Copyrights © {new Date().getFullYear()}{" "}
                                    Elite Lu
                                </section>
                            </>
                        </div>
                    ) : (
                        <></>
                    )}
                </ThemeProvider>
            </body>
        </html>
    );
}
