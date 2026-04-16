"use client";

import { useState } from "react";
import ProjectInsights from "./projectInsights";
import ProjectHeatmap from "./projectHeatMap";

export default function ProjectClient({ project }: any) {
  const [activities, setActivities] = useState(project.activities || []);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<String | null>(null);
  const [editContent, setEditContent] = useState("");

  const groupedActivities = activities.reduce((acc: any, activity: any) => {
    const date = new Date(activity.createdAt).toLocaleDateString(undefined, {
      weekday: "long",
      month: "short",
      day: "numeric",
    });

    if (!acc[date]) {
      acc[date] = [];
    }

    acc[date].push(activity);
    return acc;
  }, {});

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/activities/${id}`, {
        method: "DELETE",
      });

      setActivities((prev: any) => prev.filter((a: any) => a.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (activity: any) => {
    setEditingId(activity.id);
    setEditContent(activity.content);
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/activities/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      const data = await res.json();

      if (data.activity) {
        setActivities((prev: any) =>
          prev.map((a: any) => (a.id === id ? data.activity : a)),
        );

        setEditingId(null);
        setEditContent("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>

        <p className="text-zinc-400 mb-6">
          {project.description || "No description provided"}
        </p>
        <ProjectInsights project={project} />

        <ProjectHeatmap activities={activities} />

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

              window.location.reload();
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

        {activities.length === 0 && (
          <p className="text-zinc-500 mt-8">No updates yet</p>
        )}

        {/* TIMELINE */}
        {activities.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-6">Activity Timeline</h3>

            <div className="relative border-l border-zinc-700 pl-6 space-y-10">
              {Object.entries(groupedActivities)
                .sort(
                  ([a], [b]) => new Date(b).getTime() - new Date(a).getTime(),
                )
                .map(([date, items]: any) => (
                  <div key={date}>
                    {/* DATE */}
                    <p className="text-sm text-zinc-400 mb-4">{date}</p>

                    {/* ACTIVITIES */}
                    <div className="space-y-4">
                      {items.map((activity: any) => (
                        <div key={activity.id} className="relative">
                          {/* DOT */}
                          <span className="absolute -left-[31px] top-2 w-3 h-3 bg-blue-500 rounded-full"></span>

                          {/* CARD */}
                          <div className="group bg-zinc-800 p-4 rounded-xl border border-zinc-700 hover:border-blue-500 transition relative">
                            {/* ACTION BUTTONS */}
                            {editingId !== activity.id && (
                              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                                {/* EDIT */}
                                <button
                                  onClick={() => handleEdit(activity)}
                                  className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded"
                                >
                                  Edit
                                </button>

                                {/* DELETE */}
                                <button
                                  onClick={() => handleDelete(activity.id)}
                                  className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded"
                                >
                                  Delete
                                </button>
                              </div>
                            )}

                            {/* EDIT MODE */}
                            {editingId === activity.id ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editContent}
                                  onChange={(e) =>
                                    setEditContent(e.target.value)
                                  }
                                  className="w-full p-2 rounded bg-zinc-700 text-sm"
                                />

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleUpdate(activity.id)}
                                    className="bg-green-600 px-3 py-1 rounded text-xs"
                                  >
                                    Save
                                  </button>

                                  <button
                                    onClick={() => setEditingId(null)}
                                    className="bg-zinc-600 px-3 py-1 rounded text-xs"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm">{activity.content}</p>

                                <span className="text-xs text-zinc-500">
                                  {new Date(
                                    activity.createdAt,
                                  ).toLocaleTimeString()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

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
