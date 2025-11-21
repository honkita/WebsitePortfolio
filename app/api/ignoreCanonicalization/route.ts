import { prisma } from "@lib/prisma";

/**
 *
 * @returns
 */
export async function GET() {
  try {
    const ignored = await prisma.ignoreCanonicalization.findMany({
      select: { name: true },
    });
    return Response.json(ignored.map((i: { name: string }) => i.name));
  } catch (error) {
    console.error("Failed to fetch ignored artists:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
