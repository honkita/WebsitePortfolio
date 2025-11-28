import type { Metadata } from "next";

// Client
import MusicClient from "./musicclient";

// Metadata
export const metadata: Metadata = {
    title: "Music"
};

/**
 * Serverside Music Page
 * @returns JSX.Element
 */
export default function Music() {
    return <MusicClient />;
}
