"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// CSS
import IconsCSS from "./Icons.module.css";

// JSONs
import devTools from "@assets/devTools.json";

export default function DevTools() {
    const [mounted, setMounted] = useState(false);

    var devToolsJSON = JSON.parse(JSON.stringify(devTools));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={IconsCSS.grid} aria-hidden="true">
            {devToolsJSON.map(
                (devTool: { name: string; url: string }, index: number) => (
                    <div className={IconsCSS.under} key={index}>
                        <button
                            className={`${IconsCSS.logoButton} ${IconsCSS.buttonRendering}`}
                            title={devTool.name}
                            tabIndex={-1}
                        >
                            <Image
                                id={devTool.name}
                                src={devTool.url}
                                alt={devTool.name + " image "}
                                fill
                                priority={true}
                                sizes="100vw"
                            />
                        </button>
                        <div
                            className={`${IconsCSS.hide} ${IconsCSS.logoText}`}
                        >
                            {devTool.name}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
