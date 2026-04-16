import { prisma } from "@/lib/prisma";
import ProjectHeatmap from "@/app/projects/[id]/projectHeatMap";

export default async function PublicProjectPage({
  params,
}: {
  params: Promise<{ id: string; username: string }>;
}) {
  const { id, username } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id,
      user: {
        username,
      },
    },
    include: {
      activities: {
        orderBy: { createdAt: "desc" },
      },
      user: true,
    },
  });

  if (!project) {
    return (
      <div className="text-xs p-2 mt-20 text-center">project not found</div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-zinc-400 mt-2">
            {project.description || "No description"}
          </p>

          <p className="text-xs text-zinc-500 mt-2">
            Built by @{project.user?.name || "user"}
          </p>
        </div>
        {/* insights */}
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
          <div className="flex justify-between text-sm text-zinc-400">
            <span>Total Updates</span>
            <span>{project.activities.length}</span>
          </div>

          <div className="flex justify-between text-sm text-zinc-400 mt-2">
            <span>Status</span>
            <span>{project.status || "ACTIVE"}</span>
          </div>

          <div className="flex justify-between text-sm text-zinc-400 mt-2">
            <span>Progress</span>
            <span>{project.progress || 0}%</span>
          </div>
        </div>

        {/* heatmap */}
        <ProjectHeatmap activities={project.activities} />

        {/* timeline */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Activity</h3>

          {project.activities.length === 0 ? (
            <p className="text-zinc-500">No updates yet</p>
          ) : (
            project.activities.map((activity) => (
              <div
                key={activity.id}
                className="bg-zinc-900 p-4 rounded-xl border border-zinc-800"
              >
                <p>{activity.content}</p>

                <span className="text-xs text-zinc-500">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
