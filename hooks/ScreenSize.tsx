import { useState, useEffect } from "react";

const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<{
        widthRem: number | undefined;
        heightRem: number | undefined;
        widthPx: number | undefined;
        heightPx: number | undefined;
    }>({
        widthRem: undefined,
        heightRem: undefined,
        widthPx: undefined,
        heightPx: undefined
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const getRemValue = () => {
                // Get the computed font size of the root element (html)
                const rootFontSize = parseFloat(
                    getComputedStyle(document.documentElement).fontSize
                );
                return rootFontSize || 16; // Fallback to 16px if not found
            };

            const handleResize = () => {
                const rem = getRemValue();
                const widthPx = window.innerWidth;
                const heightPx = window.innerHeight;

                setWindowSize({
                    widthRem: widthPx / rem,
                    heightRem: heightPx / rem,
                    widthPx,
                    heightPx
                });
            };

            window.addEventListener("resize", handleResize);
            handleResize(); // Initialize immediately

            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    return windowSize;
};

export default useWindowSize;
