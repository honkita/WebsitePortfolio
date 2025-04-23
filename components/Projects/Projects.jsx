"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Child Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import utilStyles from "@styles/theme.util.module.css";
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
        }
        return `${utilStyles.darkBorder}`;
    }

    function getImage() {
        if (props.img != "") {
            return "/images/Projects/" + props.img;
        }
        return "/images/TestImages/honoka.jpg";
    }

    return (
        <div>
            <div
                className={`${utilStyles.imageRendering} ${
                    ProjectsCSS.projectsBacker
                } ${background()} `}
            >
                <section className={ProjectsCSS.projectTitle}>
                    <p>{props.name}</p>
                </section>
                <img
                    className={`${ProjectsCSS.projectsImage} ${background()}`}
                    src={getImage()}
                ></img>
                <div className={ProjectsCSS.buttonPlacement}>
                    <PixelButton name="GitHub" url={props.url} />
                </div>
            </div>
        </div>
    );
}
