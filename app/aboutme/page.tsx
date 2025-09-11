import type { Metadata } from "next";

// Client
import AboutMeClient from "./aboutmeclient";

// Metadata
export const metadata: Metadata = {
    title: "About Me"
};

export default function AboutMe() {
    return <AboutMeClient />;
}
