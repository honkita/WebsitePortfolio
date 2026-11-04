"use client";

// CSS
import CDCSS from "./CD.module.css";

// Types
import type { CDAlbum } from "@/types/physicalCDs";

// Props Interface
interface CDButtonProps {
    album: CDAlbum;
    buttonPress: (cdAlbum: CDAlbum) => void;
}

const CDButton = ({ album, buttonPress }: CDButtonProps) => {
    return (
        <button
            type="button"
            className={CDCSS.albumCard}
            onClick={() => buttonPress(album)}
        >
            <div className={CDCSS.artworkContainer}>
                {album.image_url ? (
                    <img
                        src={album.image_url}
                        alt={`${album.name} album artwork`}
                        className={CDCSS.artwork}
                        loading="lazy"
                    />
                ) : (
                    <div className={CDCSS.artworkPlaceholder}>
                        <span>No artwork</span>
                    </div>
                )}
            </div>
        </button>
    );
};

export default CDButton;
