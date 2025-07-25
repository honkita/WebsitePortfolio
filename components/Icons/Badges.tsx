"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// CSS
import IconsCSS from "./Icons.module.css";

// JSONs
import badges from "@assets/badges.json";

// Props Interface
export interface BadgesProps {
    name: string;
    url: string;
}

export default function Badges(props: BadgesProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <button
            className={`${IconsCSS.logoButtonBadge} ${IconsCSS.buttonRendering}`}
            title={props.name}
            tabIndex={-1}
            aria-hidden="true"
        >
            <Image
                id={props.name}
                src={props.url}
                alt={props.name + " image "}
                fill
                priority={true}
                sizes="100vw"
            />
        </button>
    );
}
