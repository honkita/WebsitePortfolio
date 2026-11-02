"use client";

// React
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

type VersionColourStyle = CSSProperties & {
    "--version-colour": string;
};

// Child Components
import CDButton from "@/components/CDs/CDButton";
import Title from "@/components/Title/Title";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import styles2 from "./physicalCDs.module.css";
import styles from "@/app/ui/home.module.css";

// Types
import type { CDAlbum, CDVersion } from "@/types/physicalCDs";

// Props Interface
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

const PhysicalCDClient = ({ albums }: PhysicalCDClientProps) => {
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
        <div>
            <Title
                name={"CDs"}
                colour="blue"
                buttons={["LinkedIn", "GitHub", "Email"]}
            />

            <div className={`${styles.contentWrapper}`}>
                <div
                    className={divstyling.hr}
                    style={{ marginTop: "3rem" }}
                ></div>
                <input
                    type="search"
                    placeholder="Search albums, artists, or versions..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className={styles.search}
                    aria-label="Search albums"
                />
                <div className={styles.container}>
                    {filteredAlbums.length === 0 ? (
                        <div className={styles2.emptyState}>
                            <h2>No albums found</h2>
                            <p>
                                Try searching for a different album or artist.
                            </p>
                        </div>
                    ) : (
                        <section className={styles2.albumGrid}>
                            {filteredAlbums.map((album) => (
                                <CDButton
                                    key={album.id}
                                    album={album}
                                    buttonPress={openAlbum}
                                />
                            ))}
                        </section>
                    )}

                    {selectedAlbum && (
                        <div
                            className={styles2.modalOverlay}
                            onClick={closeAlbum}
                            role="presentation"
                        >
                            <section
                                className={styles2.modal}
                                style={modalStyle}
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="album-modal-title"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <button
                                    type="button"
                                    className={styles2.closeButton}
                                    onClick={closeAlbum}
                                    aria-label="Close album details"
                                >
                                    ×
                                </button>

                                <div className={styles2.modalHeader}>
                                    <div
                                        className={
                                            styles2.modalArtworkContainer
                                        }
                                    >
                                        {selectedAlbum.image_url ? (
                                            <img
                                                src={selectedAlbum.image_url}
                                                alt={`${selectedAlbum.name} album artwork`}
                                                className={styles2.modalArtwork}
                                            />
                                        ) : (
                                            <div
                                                className={
                                                    styles2.artworkPlaceholder
                                                }
                                            >
                                                <span>No artwork</span>
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={
                                            styles2.modalAlbumInformation
                                        }
                                    >
                                        <h2 id="album-modal-title">
                                            {selectedAlbum.name}
                                        </h2>

                                        <p>
                                            {getArtistNames(
                                                selectedAlbum.artists
                                            ) || "Unknown artist"}
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
                                    <div className={styles2.versionSection}>
                                        <h3>Versions</h3>

                                        <div
                                            className={styles2.versionSelector}
                                        >
                                            {selectedAlbum.versions.map(
                                                (version) => {
                                                    const versionColour =
                                                        version.colour?.trim() ||
                                                        "#888888";

                                                    const isActive =
                                                        selectedVersion?.id ===
                                                        version.id;

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
                                                            className={`${styles2.versionButton} ${
                                                                isActive
                                                                    ? styles2.activeVersion
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
                                                }
                                            )}
                                        </div>
                                    </div>
                                ) : null}

                                {selectedVersion && (
                                    <div className={styles2.tracklistSection}>
                                        <h3>Tracklist</h3>

                                        {selectedVersion.tracks.length === 0 ? (
                                            <p className={styles2.noTracks}>
                                                No tracks have been added to
                                                this version.
                                            </p>
                                        ) : (
                                            <div className={styles2.tracklist}>
                                                {selectedVersion.tracks.map(
                                                    (track, index) => {
                                                        const previousTrack =
                                                            selectedVersion
                                                                .tracks[
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
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.disc_number >
                                                                                1
                                                                        )) && (
                                                                        <h4
                                                                            className={
                                                                                styles2.discHeading
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
                                                                        styles2.track
                                                                    }
                                                                >
                                                                    <span
                                                                        className={
                                                                            styles2.trackNumber
                                                                        }
                                                                    >
                                                                        {
                                                                            track.track_number
                                                                        }
                                                                    </span>

                                                                    <div
                                                                        className={
                                                                            styles2.trackInformation
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={
                                                                                styles2.trackName
                                                                            }
                                                                        >
                                                                            {
                                                                                track
                                                                                    .song
                                                                                    .name
                                                                            }
                                                                        </span>

                                                                        {track
                                                                            .song
                                                                            .artists
                                                                            .length >
                                                                            0 && (
                                                                            <span
                                                                                className={
                                                                                    styles2.trackArtist
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
                                                                            styles2.trackDuration
                                                                        }
                                                                    >
                                                                        {formatDuration(
                                                                            track
                                                                                .song
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
                </div>
            </div>
        </div>
    );
};

export default PhysicalCDClient;
