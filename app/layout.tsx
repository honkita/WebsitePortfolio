"use client"; // This makes RootLayout a Client Component

import React, {
    ReactNode,
    useState,
    useEffect,
    useCallback,
    useRef
} from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "next-themes";

// Child Components
// Ensure your Nav component, and any other components that render images,
// use the `next/image` component for optimal performance.
import Nav from "@components/NavBar/NavBar";

// CSS Imports
// Adjust paths based on your actual project structure if they differ
import styles from "@app/ui/home.module.css";
import utilStyles from "@app/ui/theme.util.module.css";
import "@app/ui/globals.css";
import "@app/ui/variables.css";

/**
 * Props Interface
 */
interface LayoutProps {
    children?: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
    const pathname = usePathname();
    const [isLoadingInitialLoad, setIsLoadingInitialLoad] = useState(true);
    const hasMounted = useRef(false);

    const checkEverythingReady = useCallback(async () => {
        console.log("checkEverythingReady: Running for initial load.");

        try {
            await new Promise((resolve) => setTimeout(resolve, 800));
            console.log("Initial critical client-side data loaded.");
        } catch (error) {
            console.error("Failed to load initial critical data:", error);
        }
        setIsLoadingInitialLoad(false);
        console.log("Initial page ready, showing content.");
    }, []);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            checkEverythingReady();
        }
    }, [checkEverythingReady]);

    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider>
                    {isLoadingInitialLoad && (
                        <div className={styles.fullPageLoader}>
                            Please wait ...
                        </div>
                    )}

                    <div
                        key={pathname}
                        className={`${styles.containerColour} ${
                            !isLoadingInitialLoad ? styles.animateUp : ""
                        }`}
                        style={{
                            visibility: isLoadingInitialLoad
                                ? "hidden"
                                : "visible"
                        }}
                    >
                        <>
                            <Nav />
                            <main>{children}</main>
                            <section
                                className={utilStyles.headingCopyright}
                                role="contentinfo"
                            >
                                Copyrights © {new Date().getFullYear()} Elite Lu
                            </section>
                        </>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
