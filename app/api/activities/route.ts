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

    const count = await prisma.activity.count({
      where: { projectId }
    }) 

    let progress = 0;

    if(count === 0) progress = 0;
    else if(count <= 2) progress = 20;
    else if(count <= 5) progress = 40;
    else if(count <= 8) progress = 60;
    else if(count <= 12) progress = 80;
    else progress = 100


    await prisma.project.update({
      where: {  id: projectId },
      data: { 
        progress,
        status: progress === 100 ?  "COMPLETED" : "ACTIVE",
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