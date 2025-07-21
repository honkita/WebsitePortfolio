"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Child Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import divstyling from "@styles/divstyling.module.css";
import ProjectsCSS from "./Projects.module.css";

/**
 * Props Interface
 */
interface ProjectsProps {
    name: string;
    img: string;
    url: boolean;
}

export default function Projects(props: ProjectsProps) {
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
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
                className={`${divstyling.imageRendering} ${ProjectsCSS.projectsBacker} ${divstyling.border} `}
            >
                <section className={ProjectsCSS.projectTitle}>
                    <p>{props.name}</p>
                </section>
                <Image
                    className={`${ProjectsCSS.projectsImage} ${divstyling.border}`}
                    fetchPriority={"high"}
                    src={getImage()}
                    alt={props.name + " image"}
                    fill
                    priority={true}
                    sizes="100vw"
                />
                <div className={ProjectsCSS.buttonPlacement}>
                    <PixelButton name="GitHub" url={props.url} />
                </div>
            </div>
        </div>
    );
}
