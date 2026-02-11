import type { Metadata } from "next";

// Client
import AboutMeClient from "./aboutmeclient";

// Metadata
export const metadata: Metadata = {
    title: "About Me"
};

/**
 * Serverside About Me Page
 * @returns JSX.Element
 */
const AboutMe: React.FC = () => {
    return <AboutMeClient />;
}

export default AboutMe;