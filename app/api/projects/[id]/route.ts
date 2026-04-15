import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { title, description, progress, status } = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { title, description, ...(progress !== undefined && { progress }), ...(status && { status }) },
    });

    return Response.json({ project: updatedProject });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return Response.json({
      error: "Internal Server Error",
      status: 500
    })
  }
}