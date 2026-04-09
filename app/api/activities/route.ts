import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { content, projectId } = await req.json();

    if (!content || content.trim() === "") {
      return Response.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        content,
        projectId,
      },
    });

    return Response.json({ activity });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}