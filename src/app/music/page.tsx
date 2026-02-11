import type { Metadata } from "next";

// Client
import MusicClient from "./musicclient";


// Metadata
export const metadata: Metadata = {
    title: "Music"
};

/**
 * Serverside Music Page
 * @returns
 */
const Music = () => {
    return <MusicClient />;
}

export default Music;
