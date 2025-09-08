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
                className={`${divstyling.imageRendering} ${ProjectCSS.projectsBacker} ${divstyling.border}`}
            >
                <img
                    className={`${ProjectCSS.projectsImage} ${divstyling.border}`}
                    fetchPriority="high"
                    src={getImage()}
                />
                <div className={ProjectCSS.projectContent}>
                    {/* Title container */}
                    <div className={`${ProjectCSS.titleContainer}`}>
                        <section className={ProjectCSS.projectTitle}>
                            {props.name}
                        </section>
                    </div>

                    {/* Button container */}
                    <div className={ProjectCSS.buttonContainer}>
                        <PixelButton name="GitHub" url={props.url} />
                    </div>
                </div>
            </div>
        </div>
    );
}
