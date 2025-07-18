import type { Metadata } from "next";

import AboutMeClient from "./aboutmeclient";

export const metadata: Metadata = {
    title: "About Me"
};

export default function AboutMe() {
    return <AboutMeClient />;
}
