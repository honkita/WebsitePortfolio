import utilStyles from "../styles/theme.util.module.css";
import React, { useEffect, useState } from "react";
import { useTheme, ThemeProvider } from "next-themes";
import Link from "next/link";
import PixelButtons from "../public/Assets/PixelButtons.json";

export default function PixelButton(props) {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();
    const name = props.name;
    var PixelButtonsJSON = JSON.parse(JSON.stringify(PixelButtons));

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    function getValue() {
        if (PixelButtonsJSON[props.name] != null)
            return PixelButtonsJSON[props.name];
        return null;
    }

    let src;

    return (
        <ThemeProvider>
            <a href={props.url} target={getValue().target}>
                <button
                    className={`${utilStyles.buttonRendering} ${props.extra != true ? utilStyles.logoButton : utilStyles.titleButtons}`}
                    title={name}
                    alt={"Go to " + name}
                    type="button"
                    tabindex="-1"
                >
                    <img
                        id="Icon"
                        src={
                            resolvedTheme === "light"
                                ? getValue().lightTheme
                                : getValue().darkTheme
                        }
                        title={name}
                        aria-hidden="true"
                    />
                </button>
            </a>
        </ThemeProvider>
    );
}
