"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// Child Components
import PixelButton from "@components/PixelButton/PixelButton";

// CSS
import divstyling from "@styles/divstyling.module.css";
import ProjectCSS from "./Project.module.css";

/**
 * Props Interface
 */
interface ProjectsProps {
    name: string;
    img: string;
    url: boolean;
}

export default function Project(props: ProjectsProps) {
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
                className={`${divstyling.imageRendering} ${ProjectCSS.projectsBacker} ${divstyling.border} `}
            >
                <section className={ProjectCSS.projectTitle}>
                    <p>{props.name}</p>
                </section>
                <img
                    className={`${ProjectCSS.projectsImage} ${divstyling.border}`}
                    fetchPriority={"high"}
                    src={getImage()}
                />
                <div className={ProjectCSS.buttonPlacement}>
                    <PixelButton name="GitHub" url={props.url} />
                </div>
            </div>
        </div>
    );
}
