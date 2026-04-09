"use client";

import { useState } from "react";

export default function ProjectClient({ project }: any) {
  const [activities, setActivities] = useState(project.activities || []);
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

        <p className="text-zinc-400 mb-6">
          {project.description || "No description provided"}
        </p>

        {/* FORM */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            if (!content.trim()) return;

            const res = await fetch("/api/activities", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                content,
                projectId: project.id,
              }),
            });

            const data = await res.json();

            if (data.activity) {
              setActivities((prev: any) => [data.activity, ...prev]);
              setContent("");
            }
          }}
          className="mt-6 space-y-3"
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you work on?"
            className="w-full p-3 rounded bg-zinc-800 text-white"
          />

          <button className="bg-blue-600 px-4 py-2 rounded cursor-pointer">
            Add Update
          </button>
        </form>

        {/* ACTIVITIES */}
        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold">Activity</h3>

          {activities.length === 0 ? (
            <p className="text-zinc-500">No updates yet</p>
          ) : (
            activities.map((activity: any) => (
              <div key={activity.id} className="bg-zinc-800 p-3 rounded-lg">
                <p>{activity.content}</p>
                <span className="text-xs text-zinc-500">
                  {new Date(activity.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between text-sm text-zinc-500 border-t border-zinc-800 pt-4 mt-6">
          <span>
            Created: {new Date(project.createdAt).toLocaleDateString()}
          </span>

          <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}
