"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

// CSS
import PixelButtonCSS from "./PixelButton.module.css";

// JSONs
import PixelButtons from "@/assets/PixelButtons.json";

/**
 * Props Interface
 */
interface PixelButtonProps {
    name: string;
    url: string;
    extra: boolean;
}

const PixelButton = ({ name, url, extra }: PixelButtonProps) => {
    const [mounted, setMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    var PixelButtonsJSON = JSON.parse(JSON.stringify(PixelButtons));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const getValue = () => {
        if (PixelButtonsJSON[name] != null) return PixelButtonsJSON[name];
        return null;
    };

    let src;

    return (
        <Link href={url} target={getValue().target}>
            <button
                className={`${PixelButtonCSS.buttonRendering} ${extra != true
                    ? PixelButtonCSS.button
                    : PixelButtonCSS.titleButtons
                    }`}
                title={name}
                aria-label={"Go to " + name}
                type="button"
                tabIndex={-1}
            >
                <Image
                    id="Icon"
                    key={name}
                    fetchPriority={"high"}
                    src={
                        resolvedTheme === "light"
                            ? getValue().lightTheme
                            : getValue().darkTheme
                    }
                    title={name}
                    alt={name + " image"}
                    aria-hidden={true}
                    tabIndex={-1}
                    fill
                    priority={true}
                    sizes="100vw"
                />
            </button>
        </Link>
    );
};

export default PixelButton;
