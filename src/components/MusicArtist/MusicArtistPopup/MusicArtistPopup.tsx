"use client";

// React
import React, { useState, useEffect, useRef } from "react";
import Modal from "react-modal";

// Next.js
import { useTheme } from "next-themes";

// Child Components
import CloseButton from "@/components/CloseButton/CloseButton";

// CSS
import MusicArtistCSS from "../MusicArtist.module.css";
import MusicArtistPopupCSS from "./MusicArtistPopup.module.css";

// Lib
import stringToColour from "@/lib/stringToColour";

// Types
import { cleanedAlbums } from "@/types/Music";

let modalOpen = false;

interface MusicArtistPopupProps {
    name: string;
    image: string;
    scrobbles: number;
    albums: Record<string, cleanedAlbums>;
}

const MusicArtistPopup = ({
    name,
    image,
    scrobbles,
    albums
}: MusicArtistPopupProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isThemeMounted, setIsThemeMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        Modal.setAppElement("body");
    }, []);

    useEffect(() => {
        setIsThemeMounted(true);
    }, []);

    const actualResolvedTheme = isThemeMounted ? resolvedTheme : "light";

    const openModal = () => {
        if (!modalOpen) {
            modalOpen = true;
            setIsOpen(true);
        }
    };

    const closeModal = () => {
        modalOpen = false;
        setIsOpen(false);
    };

    const [topAlbum, setTopAlbum] = useState<string>("");
    const [topAlbumInfo, setTopAlbumInfo] = useState<
        cleanedAlbums | undefined
    >();

    useEffect(() => {
        let maxScrobbles = -1;
        let albumName = "None";
        let topAlbumInfo: cleanedAlbums | undefined = undefined;

        for (const [name, album] of Object.entries(albums)) {
            if (album.playcount > maxScrobbles) {
                maxScrobbles = album.playcount;
                albumName = name;
                topAlbumInfo = album;
            }
        }

        setTopAlbum(albumName);
        setTopAlbumInfo(topAlbumInfo);
    }, [albums]);

    /*
        PING-PONG ANIMATION
        Triangle wave function:
        position = amplitude - |(t mod (2A)) - A|

        This gives perfect ping-pong motion
        at constant velocity.
    */
    // Setup scrolling animation
    interface AnimatedLine {
        text: string;
        ref: React.RefObject<HTMLDivElement | null>;
        keyframeName?: string;
    }
    const styleRef = useRef<HTMLStyleElement | null>(null);
    const nameRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const timer = setTimeout(() => {
            setupScroll();
        }, 50);

        return () => clearTimeout(timer);
    }, [isOpen, name]);

    const setupScroll = () => {
        if (!styleRef.current || !nameRef.current) return;

        const containerWidth = nameRef.current.parentElement!.offsetWidth;
        const textWidth = nameRef.current.scrollWidth;

        const distance = Math.max(0, textWidth - containerWidth);

        if (distance === 0) {
            nameRef.current.style.animation = "none";
            nameRef.current.style.transform = "translateX(0)";
            return;
        }

        let css = "";
        // Animation constants
        const LONGEST_SPEED = 25;
        const longestDuration = name.length / LONGEST_SPEED;
        const PAUSE_DURATION = 1;
        const totalDuration = longestDuration * 2 + PAUSE_DURATION * 2;

        if (!nameRef.current) return;

        if (distance === 0) {
            nameRef.current.style.animation = "none";
            nameRef.current.style.transform = "translateX(0)";
            return;
        }

        const keyframeName = `scrollLine`;

        const pauseStartPct = Math.round(
            (PAUSE_DURATION / totalDuration) * 100
        );
        const moveLeftPct = Math.round(
            ((PAUSE_DURATION + longestDuration) / totalDuration) * 100
        );
        const pauseEndPct = Math.round(
            ((2 * PAUSE_DURATION + longestDuration) / totalDuration) * 100
        );
        const moveRightPct = Math.round(
            ((2 * (PAUSE_DURATION + longestDuration)) / totalDuration) * 100
        );

        css += `
        @keyframes ${keyframeName} {
          0%, ${pauseStartPct}% { transform: translateX(0); }
          ${pauseStartPct}%, ${moveLeftPct}% { transform: translateX(-${distance}px); }
          ${moveLeftPct}%, ${pauseEndPct}% { transform: translateX(-${distance}px); }
          ${pauseEndPct}%, ${moveRightPct}% { transform: translateX(0); }
        }
      `;

        nameRef.current.style.animation = `${keyframeName} ${
            (totalDuration * 1000) / 200
        }s ease-in-out infinite`;

        styleRef.current.innerHTML = css;
    };

    const renderText = (
        text: string,
        ref: React.RefObject<HTMLDivElement | null>,
        className: string
    ) => (
        <div className={`${MusicArtistPopupCSS.scrollWrapper} ${className}`}>
            <div className={MusicArtistPopupCSS.scrollContent} ref={ref}>
                <span>{text}</span>
            </div>
        </div>
    );

    return (
        <div>
            <button
                className={MusicArtistPopupCSS.infoButton}
                onClick={openModal}
            >
                ⓘ
            </button>
            <style ref={styleRef} />
            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className={MusicArtistPopupCSS.modalUI}
                overlayClassName={MusicArtistPopupCSS.overlay}
            >
                <div className={MusicArtistPopupCSS.popupContent}>
                    <div className={MusicArtistPopupCSS.artistInfo}>
                        Artist Info
                    </div>

                    <CloseButton
                        theme={actualResolvedTheme || ""}
                        closeModal={closeModal}
                    />
                </div>

                <hr />

                {renderText(name, nameRef, MusicArtistPopupCSS.artistName)}

                {image ? (
                    <img
                        src={image}
                        className={MusicArtistCSS.albumImage}
                        alt={`${name} image`}
                    />
                ) : (
                    <div className={MusicArtistPopupCSS.imagePlaceholder}>
                        <img
                            className={MusicArtistCSS.albumImage}
                            src={
                                resolvedTheme === "light"
                                    ? "/images/Artists/PixelArtist.svg"
                                    : "/images/Artists/PixelArtistDark.svg"
                            }
                            alt={`${name} placeholder`}
                            loading="lazy"
                        />
                        <div
                            className={MusicArtistPopupCSS.placeholder}
                            style={{ backgroundColor: stringToColour(name) }}
                        />
                    </div>
                )}

                <p>Total Scrobbles: {scrobbles}</p>
                <p>Top Album: {topAlbum}</p>
                <p>Top Album Scrobbles: {topAlbumInfo?.playcount || 0}</p>
                <p>Total Albums: {Object.keys(albums).length}</p>
            </Modal>
        </div>
    );
};

export default MusicArtistPopup;
