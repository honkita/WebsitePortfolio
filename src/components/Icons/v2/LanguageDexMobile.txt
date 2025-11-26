"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// CSS
import IconsCSS from "./Icons.module.css";

// JSONs
import languages from "@assets/languages.json";

export default function LanguageDexMobile() {
    const [mounted, setMounted] = useState(false);
    var languagesJSON = JSON.parse(JSON.stringify(languages));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className={IconsCSS.grid} aria-hidden="true">
            {languagesJSON.map(
                (language: { name: string; url: string }, index: number) => (
                    <div className={IconsCSS.under} key={index}>
                        <button
                            className={`${IconsCSS.logoButton} ${IconsCSS.buttonRendering}`}
                            title={language.name}
                            tabIndex={-1}
                        >
                            <Image
                                id={language.name}
                                src={language.url}
                                alt={language.name + " image"}
                                fill
                                priority={true}
                                sizes="100vw"
                            />
                        </button>
                        <div
                            className={`${IconsCSS.hide} ${IconsCSS.logoText}`}
                        >
                            {language.name}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
