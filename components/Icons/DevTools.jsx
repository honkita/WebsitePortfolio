import utilStyles from "../../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { ThemeProvider } from "next-themes";
import devTools from "../../public/Assets/devTools.json";

import IconsCSS from "./Icons.module.css";

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
                    <div className={styles.under}>
                        <button
                            className={`${IconsCSS.logoButtonSmall} ${utilStyles.buttonRendering}`}
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
