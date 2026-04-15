"use client";

import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

type Project = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  progress?: number;
  status?: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState("ACTIVE");

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();

      if (Array.isArray(data)) {
        setProjects(data);
      } else if (Array.isArray(data.projects)) {
        setProjects(data.projects);
      } else {
        setProjects([]);
      }
    } catch (err) {
      console.error(err);
      setProjects([]);
      toast.error("Failed to fetch projects");
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

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

      const newProject = await res.json();

      if (newProject?.project) {
        setProjects((prev) =>
          Array.isArray(prev)
            ? [newProject.project, ...prev]
            : [newProject.project],
        );
        setTitle("");
        setDescription("");
        toast.success("Project created!");
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
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-zinc-950 text-white px-4 py-10"
    >
      <div className="max-w-5xl mx-auto">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-bold mb-6"
        >
          Your Projects
        </motion.h1>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-4"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project Title"
            className="w-full p-2 rounded bg-zinc-800"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project Description"
            className="w-full p-2 rounded bg-zinc-800"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            {loading ? "Creating..." : "Create Project"}
          </motion.button>
        </motion.form>

        {/* PROJECTS */}
        <motion.div
          className="grid gap-5 sm:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {projects?.length ? (
            projects.map((project) => (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 hover:border-blue-500 transition"
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="cursor-pointer">
                    <h2 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h2>

                    <p className="text-zinc-400 text-sm mb-4">
                      {project.description || "No description"}
                    </p>

                    {/* PROGRESS */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span className="text-xs text-zinc-400">
                          {project.progress === 0 && "Not started"}
                          {project.progress === 20 && "Getting started"}
                          {project.progress === 40 && "Making progress"}
                          {project.progress === 60 && "Halfway there"}
                          {project.progress === 80 && "Almost done"}
                          {project.progress === 100 && "Completed 🎉"}
                        </span>
                      </div>

                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress || 0}%` }}
                          className="h-full bg-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </Link>

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

                {/* ACTIONS */}
                <div className="flex justify-between mt-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => handleDelete(project.id)}
                    className="text-red-400 text-xs"
                  >
                    Delete
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      setSelectedProject(project);
                      setEditTitle(project.title);
                      setEditDescription(project.description);
                      setEditProgress(project.progress || 0);
                      setEditStatus(project.status || "ACTIVE");
                    }}
                    className="text-green-400 text-xs"
                  >
                    Edit
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-zinc-500 text-center col-span-full">
              No projects yet
            </p>
          )}
        </motion.div>

        {/* MODAL */}
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 p-6 rounded-xl w-full max-w-md space-y-4"
            >
              <h2>Edit Project</h2>

              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 bg-zinc-800 rounded"
              />

              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 bg-zinc-800 rounded"
              />

              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full p-2 bg-zinc-800 rounded"
              >
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <div className="flex justify-between">
                <button onClick={() => setSelectedProject(null)}>Cancel</button>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={async () => {
                    const res = await fetch(
                      `/api/projects/${selectedProject.id}`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          title: editTitle,
                          description: editDescription,
                          status: editStatus,
                        }),
                      },
                    );

                    const data = await res.json();

                    if (data?.project) {
                      setProjects((prev) =>
                        prev.map((p) =>
                          p.id === selectedProject.id ? data.project : p,
                        ),
                      );

                      setSelectedProject(null);
                      toast.success("Updated!");
                    }
                  }}
                  className="bg-green-600 px-4 py-2 rounded"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
