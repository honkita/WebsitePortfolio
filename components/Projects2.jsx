import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import PixelButton from "./PixelButton";

export default function Projects2(props) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    let src;

    function background() {
        if (resolvedTheme === "light") {
            return `${utilStyles.ProjectsBacker} ${utilStyles.imageRendering}`;
        } else {
            return `${utilStyles.ProjectsBackerDark} ${utilStyles.imageRendering}`;
        }
    }
    return (
        <ThemeProvider>
            <div className={background()}>
                <section className={utilStyles.boxLg}>
                    <p>{props.name}</p>
                </section>
                <div className={styles.containerAbsolute}>
                    <PixelButton name="LinkedIn" url={props.LinkedIn} />
                    <PixelButton name="GitHub" url={props.url} />
                </div>
            </div>
        </ThemeProvider>
    );
}
