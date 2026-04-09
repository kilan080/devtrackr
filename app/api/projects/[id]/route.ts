// app/api/projects/[id]/route.ts

import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { title, description } = await req.json();

    const updatedProject = await prisma.project.update({
      where: { id },
      data: { title, description },
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