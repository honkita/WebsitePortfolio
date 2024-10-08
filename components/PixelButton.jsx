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
            <Link href={props.url} target={getValue().target}>
                <button
                    className={`${utilStyles.logoButton} ${utilStyles.buttonRendering}`}
                    title={PixelButtonsJSON[props.name]}
                >
                    <img
                        src={
                            resolvedTheme === "light"
                                ? getValue().lightTheme
                                : getValue().darkTheme
                        }
                        alt={name}
                    />
                    {/* <img
            className={
              resolvedTheme === "light" ? utilStyles.logoButtonDark : null
            }
            src={dict[name].darkTheme}
            alt={name + "Dark"}
          /> */}
                </button>
            </Link>
        </ThemeProvider>
    );
}
