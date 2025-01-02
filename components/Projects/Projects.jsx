import utilStyles from "../../styles/theme.util.module.css";
import ProjectsCSS from "./Projects.module.css";
import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import PixelButton from "../PixelButton/PixelButton";
import { returnURL } from "../LanguageFaces";

export default function Projects(props) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, _ } = useTheme();

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
            return `${utilStyles.lightBorder}`;
        } else {
            return `${utilStyles.darkBorder}`;
        }
    }

    let languages = [];

    props.languages.forEach((item, _) => {
        languages.push(
            <button
                className={`${utilStyles.logoButtonSmallSmall} ${utilStyles.buttonRendering}`}
            >
                <img
                    id={item.name}
                    src={returnURL(item.name)}
                    alt={item.name}
                />
            </button>
        );
    });

    return (
        <ThemeProvider>
            <div
                className={`${utilStyles.imageRendering} ${utilStyles.ProjectsBacker} ${background()} `}
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
