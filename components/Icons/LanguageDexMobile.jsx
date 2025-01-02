import utilStyles from "../../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import styles from "../../styles/Home.module.css";
import { ThemeProvider } from "next-themes";
import languages from "../../public/Assets/languages.json";

import IconsCSS from "./Icons.module.css";

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
        <ThemeProvider>
            <div className={styles.grid} aria-hidden="true">
                {languagesJSON.map((language) => (
                    <div className={styles.under}>
                        <button
                            className={`${IconsCSS.logoButtonSmall} ${utilStyles.buttonRendering}`}
                            title={language.name}
                            tabindex="-1"
                        >
                            <img
                                id={language.name}
                                src={language.url}
                                alt={language.name + " image"}
                            />
                        </button>
                        {language.name}
                    </div>
                ))}
            </div>
        </ThemeProvider>
    );
}
