import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

// CSS
import styles from "../../styles/Home.module.css";
import IconsCSS from "./Icons.module.css";

// JSONs
import devTools from "../../public/Assets/devTools.json";

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
        <ThemeProvider>
            <div className={styles.grid3}>
                {devToolsJSON.map((devTool) => (
                    <div className={IconsCSS.under}>
                        <button
                            className={`${IconsCSS.logoButtonSmall} ${IconsCSS.buttonRendering}`}
                            title={devTool.name}
                            tabindex="-1"
                        >
                            <img
                                id={devTool.name}
                                src={devTool.url}
                                alt={devTool.name}
                            />
                        </button>
                        {devTool.name}
                    </div>
                ))}
            </div>
        </ThemeProvider>
    );
}
