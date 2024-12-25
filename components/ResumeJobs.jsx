import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { useTheme, ThemeProvider } from "next-themes";
import PixelButton from "./PixelButton/PixelButton";

export default function ResumeJobs(props) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    let src;

    function background() {
        if (resolvedTheme === "light") {
            return `${utilStyles.lightBorder}`;
        } else {
            return `${utilStyles.darkBorder}`;
        }
    }

    return (
        <ThemeProvider>
            <div
                className={`${utilStyles.ResumeBacker} ${utilStyles.imageRendering} ${background()}`}
            >
                <section className={utilStyles.boxLg}>
                    <p>{props.jobName}</p>
                </section>
                <section className={utilStyles.box2Md}>
                    <p>{props.employer}</p>
                </section>
                <div className={styles.containerAbsolute}>
                    <PixelButton name="LinkedIn" url={props.linkedin} />
                </div>
            </div>
        </ThemeProvider>
    );
}
