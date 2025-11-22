"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

// Child Components
import PixelSwitch from "@components/PixelSwitch/PixelSwitch";

// CSS
import NavBarCSS from "./NavBar.module.css";

export default function NavBar() {
    const [isNavInitiallyMounted, setIsNavInitiallyMounted] = useState(false);
    const [isThemeMounted, setIsThemeMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setIsNavInitiallyMounted(true);
    }, []);

    useEffect(() => {
        setIsThemeMounted(true);
    }, []);

    const path = "./images/NavBar/";

    const pages = [
        { name: "Home", link: "/", file: "Home" },
        { name: "Music", link: "/music", file: "Music" },
        { name: "About Me", link: "/aboutme", file: "AboutMe" },
        { name: "Projects", link: "/projects", file: "Projects" }
    ];

    function getButton(name: string, light: boolean) {
        if (light) return path + "Pixel_" + name + ".svg";
        return path + "Pixel_" + name + "_Dark.svg";
    }

    const actualResolvedTheme = isThemeMounted ? resolvedTheme : "light";

    return (
        <nav
            className={`${NavBarCSS.navBar} ${
                isNavInitiallyMounted
                    ? NavBarCSS.navBarVisible
                    : NavBarCSS.navBarHidden
            }`}
        >
            {pages.map((page, index) => (
                <Link href={page.link} key={index}>
                    <button
                        className={`${NavBarCSS.buttonRendering} ${NavBarCSS.button}`}
                        title={page.name}
                        aria-label={"Go to " + page.name}
                        type="button"
                        tabIndex={-1}
                    >
                        <Image
                            id="Icon"
                            key={page.name}
                            src={
                                actualResolvedTheme === "light"
                                    ? getButton(page.file, true)
                                    : getButton(page.file, false)
                            }
                            title={page.name}
                            alt={page.name + " image"}
                            aria-hidden={true}
                            tabIndex={-1}
                            fill
                            priority={true}
                            sizes="100vw"
                        />
                    </button>
                </Link>
            ))}

            <PixelSwitch />
        </nav>
    );
}
