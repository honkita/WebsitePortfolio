import React, { useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";

// CSS
import IconsCSS from "./Icons.module.css";

// JSONs
import languages from "../../public/Assets/languages.json";

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
            <div className={IconsCSS.grid} aria-hidden="true">
                {languagesJSON.map((language) => (
                    <div className={IconsCSS.under}>
                        <button
                            className={`${IconsCSS.logoButtonSmall} ${IconsCSS.buttonRendering}`}
                            title={language.name}
                            tabindex="-1"
                        >
                            <img
                                id={language.name}
                                src={language.url}
                                alt={language.name + " image"}
                            />
                        </button>
                        {/* {language.name} */}
                    </div>
                ))}
            </div>
        </ThemeProvider>
    );
}
