import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.activity.delete({
      where: { id },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE ACTIVITY ERROR:", error);
    return Response.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await req.json();

    if (!content || typeof content !== "string") {
      return Response.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.activity.update({
      where: { id },
      data: { content },
    });

    return Response.json({ activity: updated });
  } catch (error) {
    console.error("PATCH ACTIVITY ERROR:", error);
    return Response.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}