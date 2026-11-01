"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type VersionColourStyle = CSSProperties & {
    "--version-colour": string;
};

import type { CDAlbum, CDVersion } from "@/types/physicalCDs";

import styles from "./physicalCDs.module.css";

interface PhysicalCDClientProps {
    albums: CDAlbum[];
}

function formatDuration(seconds: number | null): string {
    if (seconds === null || seconds < 0) {
        return "--:--";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getArtistNames(artists: CDAlbum["artists"]): string {
    return artists.map((artist) => artist.name).join(", ");
}

export default function PhysicalCDClient({ albums }: PhysicalCDClientProps) {
    const [search, setSearch] = useState("");
    const [selectedAlbum, setSelectedAlbum] = useState<CDAlbum | null>(null);
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
        null
    );

    const filteredAlbums = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return albums;
        }

        return albums.filter((album) => {
            const albumName = album.name.toLowerCase();
            const artistNames = getArtistNames(album.artists).toLowerCase();

            const versionNames = album.versions
                .map((version) => version.name)
                .join(" ")
                .toLowerCase();

            return (
                albumName.includes(query) ||
                artistNames.includes(query) ||
                versionNames.includes(query)
            );
        });
    }, [albums, search]);

    const selectedVersion: CDVersion | null = selectedAlbum
        ? (selectedAlbum.versions.find(
              (version) => version.id === selectedVersionId
          ) ??
          selectedAlbum.versions[0] ??
          null)
        : null;

    const selectedVersionColour = selectedVersion?.colour?.trim() || "#888888";

    const modalStyle: VersionColourStyle = {
        "--version-colour": selectedVersionColour
    };

    function openAlbum(album: CDAlbum) {
        setSelectedAlbum(album);
        setSelectedVersionId(album.versions[0]?.id ?? null);
    }

    function closeAlbum() {
        setSelectedAlbum(null);
        setSelectedVersionId(null);
    }

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1>Physical CD Collection</h1>
                    <p>Browse my collection of physical album releases.</p>
                </div>

                <span className={styles.albumCount}>
                    {albums.length} {albums.length === 1 ? "album" : "albums"}
                </span>
            </header>

            <div className={styles.searchContainer}>
                <input
                    type="search"
                    placeholder="Search albums, artists, or versions..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className={styles.search}
                    aria-label="Search albums"
                />
            </div>

            {filteredAlbums.length === 0 ? (
                <div className={styles.emptyState}>
                    <h2>No albums found</h2>
                    <p>Try searching for a different album or artist.</p>
                </div>
            ) : (
                <section className={styles.albumGrid}>
                    {filteredAlbums.map((album) => (
                        <button
                            key={album.id}
                            type="button"
                            className={styles.albumCard}
                            onClick={() => openAlbum(album)}
                        >
                            <div className={styles.artworkContainer}>
                                {album.image_url ? (
                                    <img
                                        src={album.image_url}
                                        alt={`${album.name} album artwork`}
                                        className={styles.artwork}
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className={styles.artworkPlaceholder}>
                                        <span>No artwork</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.albumInformation}>
                                <h2>{album.name}</h2>

                                <p className={styles.artistName}>
                                    {getArtistNames(album.artists) ||
                                        "Unknown artist"}
                                </p>

                                <p className={styles.versionCount}>
                                    {album.versions.length}{" "}
                                    {album.versions.length === 1
                                        ? "version"
                                        : "versions"}
                                </p>
                            </div>
                        </button>
                    ))}
                </section>
            )}

            {selectedAlbum && (
                <div
                    className={styles.modalOverlay}
                    onClick={closeAlbum}
                    role="presentation"
                >
                    <section
                        className={styles.modal}
                        style={modalStyle}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="album-modal-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            className={styles.closeButton}
                            onClick={closeAlbum}
                            aria-label="Close album details"
                        >
                            ×
                        </button>

                        <div className={styles.modalHeader}>
                            <div className={styles.modalArtworkContainer}>
                                {selectedAlbum.image_url ? (
                                    <img
                                        src={selectedAlbum.image_url}
                                        alt={`${selectedAlbum.name} album artwork`}
                                        className={styles.modalArtwork}
                                    />
                                ) : (
                                    <div className={styles.artworkPlaceholder}>
                                        <span>No artwork</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.modalAlbumInformation}>
                                <h2 id="album-modal-title">
                                    {selectedAlbum.name}
                                </h2>

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

                        {selectedAlbum.versions.length > 1 ||
                        selectedAlbum.versions.some((version) =>
                            version.name?.trim()
                        ) ? (
                            <div className={styles.versionSection}>
                                <h3>Versions</h3>

                                <div className={styles.versionSelector}>
                                    {selectedAlbum.versions.map((version) => {
                                        const versionColour =
                                            version.colour?.trim() || "#888888";

                                        const isActive =
                                            selectedVersion?.id === version.id;

                                        const versionStyle: VersionColourStyle =
                                            {
                                                "--version-colour":
                                                    versionColour
                                            };

                                        return (
                                            <button
                                                key={version.id}
                                                type="button"
                                                style={versionStyle}
                                                className={`${styles.versionButton} ${
                                                    isActive
                                                        ? styles.activeVersion
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    setSelectedVersionId(
                                                        version.id
                                                    )
                                                }
                                            >
                                                {version.name?.trim() ||
                                                    "Default"}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}

                        {selectedVersion && (
                            <div className={styles.tracklistSection}>
                                <h3>{selectedVersion.name} Tracklist</h3>

                                {selectedVersion.tracks.length === 0 ? (
                                    <p className={styles.noTracks}>
                                        No tracks have been added to this
                                        version.
                                    </p>
                                ) : (
                                    <div className={styles.tracklist}>
                                        {selectedVersion.tracks.map(
                                            (track, index) => {
                                                const previousTrack =
                                                    selectedVersion.tracks[
                                                        index - 1
                                                    ];

                                                const showDiscHeading =
                                                    !previousTrack ||
                                                    previousTrack.disc_number !==
                                                        track.disc_number;

                                                return (
                                                    <div key={track.id}>
                                                        {showDiscHeading &&
                                                            (track.disc_number >
                                                                1 ||
                                                                selectedVersion.tracks.some(
                                                                    (item) =>
                                                                        item.disc_number >
                                                                        1
                                                                )) && (
                                                                <h4
                                                                    className={
                                                                        styles.discHeading
                                                                    }
                                                                >
                                                                    Disc{" "}
                                                                    {
                                                                        track.disc_number
                                                                    }
                                                                </h4>
                                                            )}

                                                        <div
                                                            className={
                                                                styles.track
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    styles.trackNumber
                                                                }
                                                            >
                                                                {
                                                                    track.track_number
                                                                }
                                                            </span>

                                                            <div
                                                                className={
                                                                    styles.trackInformation
                                                                }
                                                            >
                                                                <span
                                                                    className={
                                                                        styles.trackName
                                                                    }
                                                                >
                                                                    {
                                                                        track
                                                                            .song
                                                                            .name
                                                                    }
                                                                </span>

                                                                {track.song
                                                                    .artists
                                                                    .length >
                                                                    0 && (
                                                                    <span
                                                                        className={
                                                                            styles.trackArtist
                                                                        }
                                                                    >
                                                                        {getArtistNames(
                                                                            track
                                                                                .song
                                                                                .artists
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <span
                                                                className={
                                                                    styles.trackDuration
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
                                            }
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            )}
        </main>
    );
}
