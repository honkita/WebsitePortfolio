"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Image from "next/image";
import { useTheme } from "next-themes";

// CSS
import MusicArtistCSS from "../MusicArtist.module.css";
import MusicArtistPopupCSS from "./MusicArtistPopup.module.css";

// Types
import { artistAlbumContainer } from "@/types/Music";

// Global singleton state (simple)
let modalOpen = false;

interface MusicArtistPopupProps {
    name: string;
    image: string;
    scrobbles: number;
    albums: artistAlbumContainer;
}

/**
 * Popup modal for music artist details
 * @returns
 */
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

    const path = "./images/Buttons/";

    const getButton = (light: boolean) => {
        if (light) return path + "PixelX.svg";
        return path + "PixelXDark.svg";
    };

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
    const [topAlbumInfo, setTopAlbumInfo] = useState<artistAlbumContainer>();

    useEffect(() => {
        let maxScrobbles = -1;
        let albumName = "None";
        let topAlbumInfo: artistAlbumContainer | undefined = undefined;

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

    return (
        <div>
            <button
                className={MusicArtistPopupCSS.infoButton}
                onClick={openModal}
            >
                ⓘ
            </button>

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

                    <button
                        onClick={closeModal}
                        className={MusicArtistPopupCSS.button}
                        tabIndex={-1}
                    >
                        <Image
                            id="Icon"
                            src={
                                actualResolvedTheme === "light"
                                    ? getButton(true)
                                    : getButton(false)
                            }
                            alt={"Close button"}
                            aria-hidden={true}
                            tabIndex={-1}
                            fill
                            priority={true}
                            sizes="100vw"
                        />
                    </button>
                </div>

                <hr />

                <h2 className={MusicArtistPopupCSS.artistName}>{name}</h2>
                <img
                    src={image}
                    className={MusicArtistCSS.albumImage}
                    alt={`${name} image`}
                />
                <p>Total Scrobbles: {scrobbles}</p>
                <p>Top Album: {topAlbum}</p>
                <p>Top Album Scrobbles: {topAlbumInfo?.playcount || 0}</p>
                <p>Total Albums: {Object.keys(albums).length}</p>
            </Modal>
        </div>
    );
};

export default MusicArtistPopup;
