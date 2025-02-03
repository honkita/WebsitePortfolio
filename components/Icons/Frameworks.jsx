import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

// CSS
import IconsCSS from "./Icons.module.css";

// JSONs
import frameworks from "../../public/Assets/frameworks.json";

/**
 *
 * @returns
 */
export default function Frameworks() {
    const [mounted, setMounted] = useState(false);
    var frameworksJSON = JSON.parse(JSON.stringify(frameworks));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <ThemeProvider>
            <div className={IconsCSS.grid}>
                {frameworksJSON.map((frameworks) => (
                    <div className={IconsCSS.under}>
                        <button
                            className={`${IconsCSS.logoButtonSmall} ${IconsCSS.buttonRendering}`}
                            title={frameworks.name}
                            tabindex="-1"
                        >
                            <img
                                id={frameworks.name}
                                src={frameworks.url}
                                alt={frameworks.name + " image"}
                            />
                        </button>
                        <div className={IconsCSS.hide}>{frameworks.name}</div>
                    </div>
                ))}
            </div>
        </ThemeProvider>
    );
}
