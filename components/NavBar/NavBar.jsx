import React, { useEffect, useState } from "react";
import Link from "next/link";

// Child Components
import PixelSwitch from "../../components/PixelSwitch/PixelSwitch";

// CSS
import NavBarCSS from "./NavBar.module.css";

export default function NavBar() {
    const [mounted, setMounted] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const pages = [
        { name: "Home", link: "/" },
        { name: "About Me", link: "/aboutme" },
    ];

    return (
        <nav className={NavBarCSS.navBarColour}>
            <ul className={NavBarCSS.noBullets}>
                {pages.map((page, index) => (
                    <li className={NavBarCSS.navBarItem} key={index}>
                        <Link href={page.link}>
                            <p>{page.name}</p>
                        </Link>
                    </li>
                ))}
            </ul>
            <PixelSwitch />
        </nav>
    );
}
