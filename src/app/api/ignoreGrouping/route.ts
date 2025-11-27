import { prisma } from "@/lib/prisma";

/**
 * GET Handler
 * @returns
 */
export async function GET() {
  try {
    const ignored = await prisma.ignoreGrouping.findMany({
      select: { name: true },
    });
    return Response.json(ignored.map((i: { name: string }) => i.name));
  } catch (error) {
    console.error("Failed to fetch ignore grouping list:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
