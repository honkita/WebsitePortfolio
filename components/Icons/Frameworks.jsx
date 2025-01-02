import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

// CSS
import styles from "../../styles/Home.module.css";
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
            <div className={styles.grid2}>
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
                        {frameworks.name}
                    </div>
                ))}
            </div>
        </ThemeProvider>
    );
}
