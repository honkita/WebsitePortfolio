"use client";

// React
import { useMemo, useState } from "react";

// Child Components
import AlbumInfo from "@/components/CDs/AlbumInfo/AlbumInfo";
import CDButton from "@/components/CDs/CDButton";
import Title from "@/components/Title/Title";

// CSS
import divstyling from "@/styles/divstyling.module.css";
import physicalCDsCSS from "./physicalCDs.module.css";
import styles from "@/app/ui/home.module.css";

// Types
import type { CDAlbum, CDVersion } from "@/types/physicalCDs";

// Props Interface
interface PhysicalCDClientProps {
    albums: CDAlbum[];
}

const PhysicalCDClient = ({ albums }: PhysicalCDClientProps) => {
    const [search, setSearch] = useState("");
    const [selectedAlbum, setSelectedAlbum] = useState<CDAlbum | null>(null);
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(
        null
    );

    const getArtistNames = (artists: CDAlbum["artists"]) => {
        return artists.map((artist) => artist.name).join(", ");
    };

    const filteredAlbums = useMemo(() => {
        const query = search.trim().toLowerCase();

        const filtered = !query
            ? [...albums]
            : albums.filter((album) => {
                  const albumName = album.name.toLowerCase();

                  // Actual album artist names.
                  const artistNames = getArtistNames(
                      album.artists
                  ).toLowerCase();

                  // Parent and child artist names.
                  const searchArtistNames = (album.search_artist_names ?? [])
                      .join(" ")
                      .toLowerCase();

                  // Version names.
                  const versionNames = album.versions
                      .map((version) => version.name ?? "")
                      .join(" ")
                      .toLowerCase();

                  return (
                      albumName.includes(query) ||
                      artistNames.includes(query) ||
                      searchArtistNames.includes(query) ||
                      versionNames.includes(query)
                  );
              });

        return filtered.sort((a, b) => {
            // Sort by original album artist name.
            const artistComparison = getArtistNames(a.artists).localeCompare(
                getArtistNames(b.artists)
            );

            if (artistComparison !== 0) {
                return artistComparison;
            }

            // Then sort by release date.
            const dateA = a.release_date
                ? new Date(a.release_date).getTime()
                : Infinity;

            const dateB = b.release_date
                ? new Date(b.release_date).getTime()
                : Infinity;

            return dateA - dateB;
        });
    }, [albums, search]);

    const selectedVersion: CDVersion | null = selectedAlbum
        ? (selectedAlbum.versions.find(
              (version) => version.id === selectedVersionId
          ) ??
          selectedAlbum.versions[0] ??
          null)
        : null;

    const openAlbum = (album: CDAlbum) => {
        setSelectedAlbum(album);
        setSelectedVersionId(album.versions[0]?.id ?? null);
    };

    const closeAlbum = () => {
        setSelectedAlbum(null);
        setSelectedVersionId(null);
    };

    return (
        <div>
            <Title
                name={"CDs"}
                colour="orange"
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
                    className={physicalCDsCSS.search}
                    aria-label="Search albums"
                />

                <div className={styles.container}>
                    {filteredAlbums.length === 0 ? (
                        <div className={physicalCDsCSS.emptyState}>
                            <h2>No albums found</h2>
                            <p>
                                Try searching for a different album or artist.
                            </p>
                        </div>
                    ) : (
                        <section className={physicalCDsCSS.albumGrid}>
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
                        <AlbumInfo
                            selectedAlbum={selectedAlbum}
                            selectedVersion={selectedVersion}
                            borderColour={selectedVersion?.colour || ""}
                            closeAlbum={closeAlbum}
                            setSelectedVersionId={setSelectedVersionId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PhysicalCDClient;
