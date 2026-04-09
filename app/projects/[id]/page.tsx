import { prisma } from "@/lib/prisma";
import ProjectClient from "./projectClient";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      activities: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!project) {
    return (
      <div className="text-center text-red-400 mt-10">Project not found</div>
    );
  }

  return <ProjectClient project={project} />;
}
