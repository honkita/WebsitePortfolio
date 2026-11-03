"use client";

// React
import React, { useEffect, useState } from "react";
import type { CSSProperties } from "react";

// Next.js
import { useTheme } from "next-themes";

// Child Components
import CloseButton from "@/components/CloseButton/CloseButton";
import VersionButton from "./VersionButton/VersionButton";

// CSS
import AlbumInfoCSS from "./AlbumInfoCSS.module.css";

// Utils
import { formatDuration } from "@/utils/timeFormat";

// Types
import type { CDAlbum, CDVersion } from "@/types/physicalCDs";

type VersionColourStyle = CSSProperties & {
    "--version-colour": string;
};

// Props Interface
interface AlbumInfoInterface {
    selectedAlbum: CDAlbum;
    selectedVersion: CDVersion | null;
    borderColour: string;
    closeAlbum: () => void;
    setSelectedVersionId: (id: string) => void;
}

const AlbumInfo = ({
    selectedAlbum,
    selectedVersion,
    borderColour,
    closeAlbum,
    setSelectedVersionId
}: AlbumInfoInterface) => {
    const { resolvedTheme } = useTheme();
    const [isThemeMounted, setIsThemeMounted] = useState(false);

    useEffect(() => {
        setIsThemeMounted(true);
    }, []);

    const actualResolvedTheme = isThemeMounted ? resolvedTheme : "light";
    const selectedVersionColour = borderColour == "" ? "#888888" : borderColour;
    const modalStyle: VersionColourStyle = {
        "--version-colour": selectedVersionColour
    };

    const getArtistNames = (artists: CDAlbum["artists"]) => {
        return artists.map((artist) => artist.name).join(", ");
    };

    return (
        <div
            className={AlbumInfoCSS.modalOverlay}
            onClick={closeAlbum}
            role="presentation"
        >
            <section
                className={AlbumInfoCSS.modal}
                style={modalStyle}
                role="dialog"
                aria-modal="true"
                aria-labelledby="album-modal-title"
                onClick={(event) => event.stopPropagation()}
            >
                <div className={AlbumInfoCSS.popupContent}>
                    <div className={AlbumInfoCSS.modalHeader}>
                        <div className={AlbumInfoCSS.modalArtworkContainer}>
                            {selectedAlbum.image_url ? (
                                <img
                                    src={selectedAlbum.image_url}
                                    alt={`${selectedAlbum.name} album artwork`}
                                    className={AlbumInfoCSS.modalArtwork}
                                />
                            ) : (
                                <div
                                    className={AlbumInfoCSS.artworkPlaceholder}
                                >
                                    <span>No artwork</span>
                                </div>
                            )}
                        </div>

                        <div className={AlbumInfoCSS.modalAlbumInformation}>
                            <h2 id="album-modal-title">{selectedAlbum.name}</h2>

                            <p>
                                {getArtistNames(selectedAlbum.artists) ||
                                    "Unknown artist"}
                            </p>

                            <span>
                                {selectedAlbum.versions.length}{" "}
                                {selectedAlbum.versions.length === 1
                                    ? "physical version"
                                    : "physical versions"}
                            </span>
                        </div>
                    </div>
                    <CloseButton
                        theme={actualResolvedTheme || ""}
                        closeModal={closeAlbum}
                    />
                </div>

                {selectedAlbum.versions.length > 1 ||
                selectedAlbum.versions.some((version) =>
                    version.name?.trim()
                ) ? (
                    <div className={AlbumInfoCSS.versionSection}>
                        <h3>Versions</h3>

                        <div className={AlbumInfoCSS.versionSelector}>
                            {selectedAlbum.versions.map((version) => (
                                <VersionButton
                                    key={version.id}
                                    versionID={version.id}
                                    name={version.name}
                                    colour={version.colour}
                                    selectedVersionID={
                                        selectedVersion?.id || ""
                                    }
                                    buttonPress={setSelectedVersionId}
                                />
                            ))}
                        </div>
                    </div>
                ) : null}

                {selectedVersion && (
                    <div className={AlbumInfoCSS.tracklistSection}>
                        <h3>Tracklist</h3>

                        {selectedVersion.tracks.length === 0 ? (
                            <p className={AlbumInfoCSS.noTracks}>
                                No tracks have been added to this version.
                            </p>
                        ) : (
                            <div className={AlbumInfoCSS.tracklist}>
                                {selectedVersion.tracks.map((track, index) => {
                                    const previousTrack =
                                        selectedVersion.tracks[index - 1];

                                    const showDiscHeading =
                                        !previousTrack ||
                                        previousTrack.disc_number !==
                                            track.disc_number;

                                    return (
                                        <div key={track.id}>
                                            {showDiscHeading &&
                                                (track.disc_number > 1 ||
                                                    selectedVersion.tracks.some(
                                                        (item) =>
                                                            item.disc_number > 1
                                                    )) && (
                                                    <h4
                                                        className={
                                                            AlbumInfoCSS.discHeading
                                                        }
                                                    >
                                                        Disc {track.disc_number}
                                                    </h4>
                                                )}

                                            <div className={AlbumInfoCSS.track}>
                                                <span
                                                    className={
                                                        AlbumInfoCSS.trackNumber
                                                    }
                                                >
                                                    {track.track_number}
                                                </span>

                                                <div
                                                    className={
                                                        AlbumInfoCSS.trackInformation
                                                    }
                                                >
                                                    <span
                                                        className={
                                                            AlbumInfoCSS.trackName
                                                        }
                                                    >
                                                        {track.song.name}
                                                    </span>

                                                    {track.song.artists.length >
                                                        0 && (
                                                        <span
                                                            className={
                                                                AlbumInfoCSS.trackArtist
                                                            }
                                                        >
                                                            {getArtistNames(
                                                                track.song
                                                                    .artists
                                                            )}
                                                        </span>
                                                    )}
                                                </div>

                                                <span
                                                    className={
                                                        AlbumInfoCSS.trackDuration
                                                    }
                                                >
                                                    {formatDuration(
                                                        track.song
                                                            .duration_seconds
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default AlbumInfo;
