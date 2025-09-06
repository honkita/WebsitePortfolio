"use client";

import React, { useEffect, useRef, useState } from "react";
import Icons from "@components/Icons/Icons";

interface PaginatedIconsProps {
    icons: { name: string; url: string }[];
    tabKey: "languages" | "frameworks" | "devTools";
    pageStates?: Record<string, number>;
    setPageStates?: React.Dispatch<
        React.SetStateAction<Record<string, number>>
    >;
}

const PaginatedIcons: React.FC<PaginatedIconsProps> = ({
    icons,
    tabKey,
    pageStates = {},
    setPageStates
}) => {
    const [iconsPerPage, setIconsPerPage] = useState<number>(1);
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const footerRef = useRef<HTMLDivElement | null>(null);

    const currentPage = pageStates[tabKey] ?? 0;

    const calculateIconsPerPage = () => {
        const wrapper = wrapperRef.current;
        const footer = footerRef.current;

        const measuredWidth =
            wrapper?.clientWidth ?? Math.max(200, window.innerWidth * 0.4);
        const wrapperHeight =
            wrapper?.clientHeight ?? Math.max(200, window.innerHeight * 0.4);
        const footerHeight = footer?.offsetHeight ?? 0;

        const availableHeight = Math.max(0, wrapperHeight - footerHeight);

        const iconSize = 80;
        const iconsPerRow = Math.max(1, Math.floor(measuredWidth / iconSize));
        const possibleRows = Math.max(
            1,
            Math.floor(availableHeight / iconSize)
        );
        const rowsPerPage = Math.min(3, possibleRows);

        const totalPerPage = Math.max(1, iconsPerRow * rowsPerPage);
        setIconsPerPage(totalPerPage);

        if (scrollRef.current) {
            // add extra padding to avoid overlapping sticky footer
            scrollRef.current.style.paddingBottom = `${footerHeight + 16}px`;
        }
    };

    useEffect(() => {
        const handler = () => calculateIconsPerPage();
        const wrapperEl = wrapperRef.current;
        const footerEl = footerRef.current;

        if (typeof (window as any).ResizeObserver !== "undefined") {
            const ro = new (window as any).ResizeObserver(handler);
            if (wrapperEl) ro.observe(wrapperEl);
            if (footerEl) ro.observe(footerEl);
            handler();
            return () => ro.disconnect();
        }

        handler();
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    const safeIconsPerPage = Math.max(1, iconsPerPage);
    const totalPages = Math.max(1, Math.ceil(icons.length / safeIconsPerPage));
    const safePage = Math.min(currentPage, totalPages - 1);

    useEffect(() => {
        if (setPageStates && currentPage !== safePage) {
            setPageStates((prev) => ({ ...prev, [tabKey]: safePage }));
        }
    }, [safePage, currentPage, tabKey, setPageStates]);

    const paginatedIcons = icons.slice(
        safePage * safeIconsPerPage,
        safePage * safeIconsPerPage + safeIconsPerPage
    );

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                minHeight: 0
            }}
        >
            <div
                ref={scrollRef}
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto"
                }}
            >
                <Icons icons={paginatedIcons} />
            </div>

            {totalPages > 1 && (
                <div
                    ref={footerRef}
                    role="navigation"
                    aria-label="Pagination"
                    style={{
                        position: "sticky",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        display: "flex",
                        justifyContent: "center",
                        gap: "0.5rem",
                        padding: "0.5rem",
                        background: "var(--background)",
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                        zIndex: 20
                    }}
                >
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() =>
                                setPageStates &&
                                setPageStates((prev) => ({
                                    ...prev,
                                    [tabKey]: idx
                                }))
                            }
                            aria-label={`Go to page ${idx + 1}`}
                            aria-current={idx === safePage ? "true" : undefined}
                            style={{
                                padding: "0.25rem 0.5rem",
                                cursor: "pointer",
                                background:
                                    idx === safePage
                                        ? "var(--primary)"
                                        : "transparent",
                                color:
                                    idx === safePage
                                        ? "var(--background)"
                                        : "var(--primary)",
                                border: "2px solid var(--primary)",
                                borderRadius: "0.25rem",
                                minWidth: "2rem",
                                textAlign: "center"
                            }}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PaginatedIcons;
