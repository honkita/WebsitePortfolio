import { getPhysicalCDs } from "@/lib/physicalCDs";
import PhysicalCDClient from "./PhysicalCDClient";

export const metadata = {
    title: "Physical CD Collection",
    description: "Browse my physical CD collection."
};

export default async function PhysicalCDPage() {
    const albums = await getPhysicalCDs();

    return <PhysicalCDClient albums={albums} />;
}
