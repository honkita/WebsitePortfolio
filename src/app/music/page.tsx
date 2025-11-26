import type { Metadata } from "next";

// Client
import MusicClient from "./musicclient";

// Metadata
export const metadata: Metadata = {
    title: "Music"
};

export default function Music() {
    return <MusicClient />;
}
