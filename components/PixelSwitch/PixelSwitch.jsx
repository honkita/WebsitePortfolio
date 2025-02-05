import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// CSS
import PixelSwitchCSS from "./PixelSwitch.module.css";

export default function PixelSwitch() {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        resolvedTheme == "dark" ? setTheme("light") : setTheme("dark");
    };

    return (
        <div>
            <button
                id="ThemeToggle"
                className={
                    PixelSwitchCSS.toggle +
                    " " +
                    (resolvedTheme === "dark"
                        ? PixelSwitchCSS.toggledark
                        : null)
                }
                onClick={toggleTheme}
                title="Switch"
            />
        </div>
    );
}
