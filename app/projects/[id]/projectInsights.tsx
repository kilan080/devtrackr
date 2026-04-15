"use client";

import { motion } from "framer-motion";

function getDay(date: string) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function calculateStreak(activities: any[]) {
  if (!activities.length) return 0;

  const days = [...new Set(activities.map((a) => getDay(a.createdAt)))].sort(
    (a, b) => b - a,
  );

  let streak = 1;

  for (let i = 0; i < days.length - 1; i++) {
    const diff = (days[i] - days[i + 1]) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function getSmartMessage(streak: number, lastActivity?: any) {
  if (!lastActivity) return "Start logging updates to build momentum";

  const hoursAgo =
    (Date.now() - new Date(lastActivity.createdAt).getTime()) /
    (1000 * 60 * 60);

  if (streak >= 5) return `🔥 You're on fire! Keep the streak going`;
  if (streak >= 3) return `Nice consistency! You're building momentum`;
  if (hoursAgo > 48) return `⚠️ You’ve been inactive, time to get back in`;

  return "Good progress, keep pushing 💪";
}

export default function ProjectInsights({ project }: any) {
  const activities = project.activities || [];

  const totalActivities = activities.length;
  const lastActivity = activities[0];

  const lastActivityTime = lastActivity
    ? new Date(lastActivity.createdAt).toLocaleString()
    : "No activity yet";

  const progress = project.progress || Math.min(totalActivities * 10, 100);

  const streak = calculateStreak(activities);
  const message = getSmartMessage(streak, lastActivity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg"
    >
      <h2 className="text-xl font-semibold mb-6">Project Insights</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Progress */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-zinc-800 p-4 rounded-xl border border-zinc-700"
        >
          <p className="text-sm text-zinc-400">Progress</p>
          <h3 className="text-2xl font-bold mt-1">{progress}%</h3>

          <div className="w-full h-2 bg-zinc-700 rounded-full mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6 }}
              className="h-full bg-blue-500"
            />
          </div>
        </motion.div>

        {/* Total Activities */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-zinc-800 p-4 rounded-xl border border-zinc-700"
        >
          <p className="text-sm text-zinc-400">Total Updates</p>
          <h3 className="text-2xl font-bold mt-1">{totalActivities}</h3>
        </motion.div>

        {/* Streak */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-zinc-800 p-4 rounded-xl border border-zinc-700"
        >
          <p className="text-sm text-zinc-400">Streak</p>
          <h3 className="text-2xl font-bold mt-1">🔥 {streak} days</h3>
        </motion.div>

        {/* Last Activity */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-zinc-800 p-4 rounded-xl border border-zinc-700"
        >
          <p className="text-sm text-zinc-400">Last Activity</p>
          <h3 className="text-sm mt-1 text-zinc-300">{lastActivityTime}</h3>
        </motion.div>

        {/* Smart Insight */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-xl col-span-2"
        >
          <p className="text-sm text-blue-300">Insight</p>
          <p className="text-sm mt-1">{message}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
