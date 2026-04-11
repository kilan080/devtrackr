"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Project = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Fetch projects for the current user
  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data.projects);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch projects");
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // form submission
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");

    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Failed to create project");

      const newProject = await res.json();
      if (newProject?.project) {
        setProjects([newProject.project, ...(projects || [])]);
        setTitle("");
        setDescription("");
        toast.success("Project created!");
      } else {
        toast.error("Failed to create project");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Projects</h1>

        {/* Project Form */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-zinc-900 rounded-2xl shadow border border-zinc-800 space-y-4"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>

        {/* Projects List */}
        <div className="grid gap-5 mt-6 sm:grid-cols-2">
          {projects?.length ? (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-zinc-900 text-white p-5 rounded-2xl shadow-lg border cursor-pointer border-zinc-800 hover:border-blue-500 transition"
              >
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <div className="cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h2>

                    <p className="text-zinc-400 text-sm mb-4">
                      {project.description || "No description"}
                    </p>
                  </div>
                </Link>

                <div className="flex justify-between items-center text-xs text-zinc-500">
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>

                  <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                    Active
                  </span>
                </div>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-500 text-red-900 px-2 py-1 rounded hover:text-red-300 text-xs"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProject(project);
                      setEditDescription(project.description);
                      setEditTitle(project.title);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:text-green-300 text-xs"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 col-span-full text-center">
              No projects yet, Create one below.
            </p>
          )}
        </div>
        {/* pop-up edit */}

        {selectedProject && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4">
              <h2 className="text-lg font-semibold">Edit Project</h2>

              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 rounded bg-zinc-800"
              />

              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 rounded bg-zinc-800"
              />

              <div className="flex justify-between">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-zinc-400 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    console.log("click saved");
                    const res = await fetch(
                      `/api/projects/${selectedProject.id}`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title: editTitle,
                          description: editDescription,
                        }),
                      },
                    );

                    const data = await res.json();

                    if (!res.ok) {
                      console.error(data.error);
                      return;
                    }

                    if (!data?.project) return;

                    setProjects((prev: any) =>
                      prev.map((p: any) =>
                        p.id === selectedProject.id ? data.project : p,
                      ),
                    );

                    setSelectedProject(null);
                  }}
                  className="bg-green-900 px-4 py-2 rounded cursor-pointer"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
