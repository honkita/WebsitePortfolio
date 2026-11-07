// Client
import PhysicalCDClient from "./PhysicalCDClient";

// Lib
import { getPhysicalCDs } from "@/lib/physicalCDs";

// Force Dynamic Rendering
export const dynamic = "force-dynamic";

export const metadata = {
    title: "Physical CD Collection",
    description: "Browse my physical CD collection."
};

export default async function PhysicalCDPage() {
    const albums = await getPhysicalCDs();

    return <PhysicalCDClient albums={albums} />;
}
