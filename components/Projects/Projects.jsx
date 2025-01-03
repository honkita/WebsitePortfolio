import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";

// Child Components
import PixelButton from "../PixelButton/PixelButton";

// CSS
import utilStyles from "../../styles/theme.util.module.css";
import ProjectsCSS from "./Projects.module.css";

/**
 *
 * @param {object} props
 * @param {string} props.name Project Name
 * @param {string} props.img Project thumbnail image
 * @param {string} props.url GitHub link to repository of project
 * @returns
 */
export default function Projects(props) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

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
                className={`${utilStyles.imageRendering} ${ProjectsCSS.ProjectsBacker} ${background()} `}
            >
                <section className={ProjectsCSS.projectTitle}>
                    <p>{props.name}</p>
                </section>
                <div className={ProjectsCSS.buttonPlacement}>
                    <PixelButton name="GitHub" url={props.url} />
                </div>
            </div>
        </ThemeProvider>
    );
}