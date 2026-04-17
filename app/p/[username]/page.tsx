import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    return (
      <div className="text-center text-zinc-400 mt-20">
        User not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">@{user.username}</h1>

          <div className="flex gap-6 text-sm text-zinc-400 mt-3">
            <span>{user.projects.length} Projects</span>

            <span>
              {user.projects.reduce(
                (acc, p) => acc + (p.progress || 0),
                0
              )}%
              <span className="ml-1">Total Progress</span>
            </span>
          </div>
        </div>

        {/* PROJECTS */}
        <div className="grid gap-5 sm:grid-cols-2">
          {user.projects.length === 0 ? (
            <p className="text-zinc-500 col-span-full text-center">
              No public projects yet
            </p>
          ) : (
            user.projects.map((project) => (
              <Link
                key={project.id}
                href={`/p/${user.username}/${project.id}`}
              >
                <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-blue-500 hover:scale-[1.02] transition cursor-pointer">

                  {/* TITLE */}
                  <h2 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-zinc-400 text-sm mb-4">
                    {project.description || "No description"}
                  </p>

                  {/* PROGRESS */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>

                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{
                          width: `${project.progress || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex justify-between items-center text-xs text-zinc-500 mt-4">
                    <span>
                      {new Date(project.createdAt).toLocaleDateString()}
                    </span>

                    <span
                      className={`px-2 py-1 rounded ${
                        project.status === "COMPLETED"
                          ? "bg-green-600/20 text-green-400"
                          : "bg-blue-600/20 text-blue-400"
                      }`}
                    >
                      {project.status || "ACTIVE"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}