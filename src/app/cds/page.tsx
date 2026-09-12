import { readdir } from "fs/promises";
import path from "path";

import CDClient from "./cdclient";

export type CDRelease = {
    artist: string;
    title: string;
    image: string;
    folder: string;
};

async function getReleases(): Promise<CDRelease[]> {
    const albumsPath = path.join(process.cwd(), "public", "Albums");

    const artists = await readdir(albumsPath, {
        withFileTypes: true
    });

    const releases: CDRelease[] = [];

    for (const artistEntry of artists) {
        if (!artistEntry.isDirectory()) continue;

        const artist = artistEntry.name;
        const artistPath = path.join(albumsPath, artist);

        const albums = await readdir(artistPath, {
            withFileTypes: true
        });

        for (const albumEntry of albums) {
            if (!albumEntry.isDirectory()) continue;

            const album = albumEntry.name;
            const albumPath = path.join(artistPath, album);

            const files = await readdir(albumPath);

            // Look for album artwork.
            const artwork = files.find((file) =>
                /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
            );

            releases.push({
                artist,
                title: album,

                // Use the real artwork if one exists.
                // Otherwise use the temporary placeholder.
                image: artwork
                    ? `/Albums/${encodeURIComponent(artist)}/${encodeURIComponent(album)}/${encodeURIComponent(artwork)}`
                    : "/Albums/placeholder.jpg",

                folder: `/Albums/${artist}/${album}`
            });
        }
    }

    releases.sort((a, b) => {
        const artistCompare = a.artist.localeCompare(b.artist);

        if (artistCompare !== 0) {
            return artistCompare;
        }

        return a.title.localeCompare(b.title);
    });

    return releases;
}

export default async function CDsPage() {
    const releases = await getReleases();

    return <CDClient releases={releases} />;
}
