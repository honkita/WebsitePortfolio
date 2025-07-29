"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// CSS
import IconsCSS from "./Icons.module.css";

// Props Interface
export interface IconsProps {
    icons: { name: string; url: string }[];
}

/**
 *
 * @returns
 */
export default function Icons(props: IconsProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={IconsCSS.grid}>
            {props.icons.map(
                (icon: { name: string; url: string }, index: number) => (
                    <div className={IconsCSS.under} key={index}>
                        <button
                            className={`${IconsCSS.logoButton} ${IconsCSS.buttonRendering}`}
                            title={icon.name}
                            tabIndex={-1}
                        >
                            <Image
                                id={icon.name}
                                src={icon.url}
                                alt={icon.name + " image"}
                                fill
                                priority={true}
                                sizes="100vw"
                            />
                        </button>
                        <div
                            className={`${IconsCSS.hide} ${IconsCSS.logoText}`}
                        >
                            {icon.name}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
