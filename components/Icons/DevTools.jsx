import React, { useEffect, useState } from "react";

// CSS
import IconsCSS from "./Icons.module.css";
import utilStyles from "../../styles/theme.util.module.css";

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
        <div className={IconsCSS.grid} aria-hidden="true">
            {devToolsJSON.map((devTool, index) => (
                <div className={IconsCSS.under} key={index}>
                    <button
                        className={`${IconsCSS.logoButton} ${IconsCSS.buttonRendering}`}
                        title={devTool.name}
                        tabIndex="-1"
                    >
                        <img
                            id={devTool.name}
                            src={devTool.url}
                            alt={devTool.name + " image "}
                        />
                    </button>
                    <div className={`${IconsCSS.hide} ${IconsCSS.logoText}`}>
                        {devTool.name}
                    </div>
                </div>
            ))}
        </div>
    );
}
