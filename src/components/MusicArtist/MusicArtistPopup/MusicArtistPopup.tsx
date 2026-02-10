"use client";

import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import styles from "./MusicArtistPopup.module.css";

// Global singleton state (simple)
let modalOpen = false;

interface MusicArtistPopupProps {
    name: string;
}

/**
 * Popup modal for music artist details
 * @returns JSX.Element
 */
export default function MusicArtistPopup({ name }: MusicArtistPopupProps) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        Modal.setAppElement("body");
    }, []);

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

    return (
        <div>
            <button onClick={openModal}>🔗</button>

            <Modal
                isOpen={isOpen}
                onRequestClose={closeModal}
                className={styles.modalUI}
                overlayClassName={styles.overlay}
            >
                <button
                    onClick={closeModal}
                    style={{ position: "absolute", top: 10, right: 10 }}
                    aria-label="Close"
                >
                    ×
                </button>

                <h1>{name}</h1>
                <h2>{name}</h2>
            </Modal>
        </div>
    );
}
