"use client";

import { useMemo } from "react";

type Activity = {
  id: string;
  createdAt: Date | string;
};

export default function ProjectHeatmap({
  activities,
}: {
  activities: Activity[];
}) {
  // Get last 30 days
  const days = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d;
    });
  }, []);
  // Count activities per day
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};
    activities.forEach((activity) => {
      const date = new Date(activity.createdAt).toDateString();
      map[date] = (map[date] || 0) + 1;
    });
    return map;
  }, [activities]);

    if (!activities || activities.length === 0) {
      return (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
          <div className="grid grid-cols-10 gap-2">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="w-full h-8 rounded bg-zinc-800 animate-pulse" />
            ))}
          </div>
        </div>
      );
    }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>

      <div className="grid grid-cols-10 gap-2">
        {days.map((day, i) => {
          const key = day.toDateString();
          const count = activityMap[key] || 0;

          // Intensity levels
          let bg = "bg-zinc-800";

          if (count > 0) bg = "bg-blue-900";
          if (count > 2) bg = "bg-blue-700";
          if (count > 4) bg = "bg-blue-500";

          return (
            <div
              key={i}
              title={`${day.toDateString()} - ${count} updates`}
              className={`w-full h-8 rounded ${bg} hover:scale-105 transition`}
            />
          );
        })}
      </div>
    </div>
  );
}
