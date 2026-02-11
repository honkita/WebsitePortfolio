"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// CSS
import IconsCSS from "./Icons.module.css";

// Props Interface
export interface BadgesProps {
    name: string;
    url: string;
    type: string;
}

/**
 * Badges Icon Component
 * @param BadgesProps
 * @returns JSX.Element
 */
const Badges: React.FC<BadgesProps> = ({ name, url, type }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className={IconsCSS.badgeWrapper}>
            <span className={IconsCSS.badgeText}>{type}</span>
            <button
                className={`${IconsCSS.logoButtonBadge} ${IconsCSS.buttonRendering}`}
                title={name}
                tabIndex={-1}
                aria-hidden="true"
            >
                <Image
                    id={name}
                    src={url}
                    alt={name + " image "}
                    fill
                    priority={true}
                    sizes="100vw"
                />
            </button>
        </div>
    );
}

export default Badges;
