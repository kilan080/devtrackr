"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";

const INITIAL_PROJECTS = [
  { id: "1", name: "Portfolio Site", tag: "React", pct: 72, color: "#3b82f6", status: "ACTIVE", commits: 14 },
  { id: "2", name: "Auth Microservice", tag: "Node.js", pct: 45, color: "#8b5cf6", status: "ACTIVE", commits: 9 },
  { id: "3", name: "CLI Tooling", tag: "Python", pct: 100, color: "#10b981", status: "COMPLETED", commits: 28 },
];

const INITIAL_ACTIVITY = [
  {
    icon: "✓",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    text: "Completed milestone — CLI Tooling v1.0",
    time: "2m ago",
  },
  {
    icon: "⚡",
    color: "#eab308",
    bg: "rgba(234,179,8,0.12)",
    text: "Updated progress (72%) — Portfolio Site",
    time: "18m ago",
  },
  {
    icon: "↑",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    text: "Pushed 3 commits to Auth Microservice",
    time: "1h ago",
  },
];

function ScanLine() {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        height: 2,
        top: 0,
        background:
          "linear-gradient(90deg, transparent, rgba(59,130,246,0.55), rgba(99,102,241,0.55), transparent)",
        animation: "scan 3.8s infinite",
        zIndex: 3,
      }}
    />
  );
}

function GridBackground() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
      }}
    />
  );
}

function RadialGlow() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: -100,
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: 700,
        height: 320,
        background:
          "radial-gradient(ellipse, rgba(37,99,235,.16) 0%, transparent 68%)",
      }}
    />
  );
}

function ProjectCard({
  project,
  index,
  onIncrement,
}: {
  project: (typeof INITIAL_PROJECTS)[0];
  index: number;
  onIncrement: (id: string) => void;
}) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(project.pct), 150 + index * 100);
    return () => clearTimeout(t);
  }, [project.pct, index]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 12,
        padding: 14,
        transition: "all 0.2s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <p
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#fff",
            margin: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {project.name}
        </p>
        <span
          style={{
            fontSize: 9,
            padding: "2px 6px",
            borderRadius: 10,
            background: project.status === "COMPLETED" ? "rgba(34,197,94,0.2)" : "rgba(59,130,246,0.2)",
            color: project.status === "COMPLETED" ? "#4ade80" : "#60a5fa",
            fontWeight: 600,
          }}
        >
          {project.status}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span
          style={{
            display: "inline-block",
            fontSize: 10,
            padding: "3px 8px",
            borderRadius: 20,
            background: `${project.color}22`,
            color: project.color,
          }}
        >
          {project.tag}
        </span>
        <small style={{ color: "rgba(255,255,255,.45)", fontSize: 10 }}>
          {project.commits} commits
        </small>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,.08)",
          height: 5,
          borderRadius: 50,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background: project.color,
            transition: "width 0.4s ease-out",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <small style={{ color: "rgba(255,255,255,.6)", fontWeight: 500 }}>
          {project.pct}% complete
        </small>

        <button
          onClick={() => onIncrement(project.id)}
          style={{
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 6,
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          title="Simulate updating project progress"
        >
          + Log Progress
        </button>
      </div>
    </div>
  );
}

function ActivityFeed({ activities }: { activities: typeof INITIAL_ACTIVITY }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <p
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,.35)",
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontWeight: 600,
          }}
        >
          Live Activity Stream
        </p>
        <span style={{ fontSize: 10, color: "#3b82f6" }}>Prisma + Neon Synced</span>
      </div>

      {activities.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 6,
              background: row.bg,
              color: row.color,
              display: "grid",
              placeItems: "center",
              fontSize: 11,
              fontWeight: "bold",
            }}
          >
            {row.icon}
          </div>

          <span
            style={{
              color: "rgba(255,255,255,.7)",
              fontSize: 12,
              flex: 1,
            }}
          >
            {row.text}
          </span>

          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.3)",
            }}
          >
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function StreakWidget({ streakDays }: { streakDays: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(234,179,8,0.1) 100%)",
        border: "1px solid rgba(249,115,22,0.3)",
        borderRadius: 12,
        padding: "10px 14px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "rgba(249,115,22,0.2)",
          display: "grid",
          placeItems: "center",
          fontSize: 16,
        }}
      >
        🔥
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fdba74" }}>
          {streakDays} Day Active Streak
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          Daily project updates & commits recorded
        </div>
      </div>
    </div>
  );
}

function LiveDashboard() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITY);
  const [streakDays, setStreakDays] = useState(7);
  const [newTitle, setNewTitle] = useState("");

  const handleIncrementProgress = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextPct = Math.min(100, p.pct + 10);
          const isComp = nextPct === 100;
          return {
            ...p,
            pct: nextPct,
            commits: p.commits + 1,
            status: isComp ? "COMPLETED" : p.status,
          };
        }
        return p;
      })
    );

    const target = projects.find((p) => p.id === id);
    if (target) {
      const updatedPct = Math.min(100, target.pct + 10);
      setActivities((prev) => [
        {
          icon: updatedPct === 100 ? "✓" : "⚡",
          color: updatedPct === 100 ? "#22c55e" : "#3b82f6",
          bg: updatedPct === 100 ? "rgba(34,197,94,0.12)" : "rgba(59,130,246,0.12)",
          text: `Updated progress (${updatedPct}%) — ${target.name}`,
          time: "Just now",
        },
        ...prev.slice(0, 2),
      ]);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const colors = ["#ec4899", "#06b6d4", "#84cc16", "#a855f7"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newProj = {
      id: String(Date.now()),
      name: newTitle.trim(),
      tag: "Next.js",
      pct: 10,
      color: randomColor,
      status: "ACTIVE",
      commits: 1,
    };

    setProjects((prev) => [newProj, ...prev]);
    setActivities((prev) => [
      {
        icon: "+",
        color: "#a855f7",
        bg: "rgba(168,85,247,0.12)",
        text: `Created new project — ${newTitle.trim()}`,
        time: "Just now",
      },
      ...prev.slice(0, 2),
    ]);
    setNewTitle("");
    setStreakDays((s) => s + 1);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#09090b",
        borderRadius: 18,
        overflow: "hidden",
        padding: 22,
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 20px 40px -15px rgba(0,0,0,0.7)",
      }}
    >
      <GridBackground />
      <RadialGlow />
      <ScanLine />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <strong style={{ fontSize: 16 }}>Interactive Preview Dashboard</strong>

          <span
            style={{
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 30,
              background: "rgba(34,197,94,.1)",
              color: "#22c55e",
              fontWeight: 600,
            }}
          >
            ● Live Demo
          </span>
        </div>

        <StreakWidget streakDays={streakDays} />

        {/* Quick Add Simulation Form */}
        <form onSubmit={handleAddProject} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <input
            type="text"
            placeholder="Try adding a project title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 8,
              padding: "6px 12px",
              color: "#fff",
              fontSize: 12,
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              background: "#2563eb",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              padding: "6px 14px",
              cursor: "pointer",
            }}
          >
            + Create
          </button>
        </form>

        <div
          className="cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))",
            gap: 12,
            marginBottom: 14,
          }}
        >
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onIncrement={handleIncrementProgress} />
          ))}
        </div>

        <ActivityFeed activities={activities} />
      </div>
    </div>
  );
}

export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <>
      <style>{`
        *{box-sizing:border-box}
        body{margin:0;padding:0}

        @keyframes scan{
          0%{top:0;opacity:0}
          10%{opacity:1}
          100%{top:100%;opacity:0}
        }

        .btn-primary{
          border:none;
          background:#2563eb;
          color:#fff;
          padding:10px 18px;
          border-radius:10px;
          cursor:pointer;
          font-weight:600;
          transition: background 0.2s ease;
        }
        .btn-primary:hover{
          background:#1d4ed8;
        }

        .btn-ghost{
          border:1px solid rgba(255,255,255,.12);
          background:rgba(255,255,255,.04);
          color:#fff;
          padding:10px 18px;
          border-radius:10px;
          cursor:pointer;
          transition: background 0.2s ease;
        }
        .btn-ghost:hover{
          background:rgba(255,255,255,.08);
        }

        .nav-link{
          text-decoration:none;
          background:#2563eb;
          color:#fff;
          padding:10px 18px;
          border-radius:10px;
          font-weight:600;
        }

        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 24px;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .feature-card:hover {
          border-color: rgba(59,130,246,0.4);
          transform: translateY(-2px);
        }

        @media(max-width:900px){
          .hero{
            grid-template-columns:1fr !important;
            gap:40px !important;
            text-align:center;
          }

          .hero p{
            margin-inline:auto;
          }

          .nav{
            flex-direction:column;
            gap:16px;
          }
        }

        @media(max-width:600px){
          .header{
            padding:20px !important;
          }

          .main{
            padding:30px 20px 60px !important;
          }

          .actions{
            width:100%;
            justify-content:center;
            flex-wrap:wrap;
          }

          h1{
            font-size:34px !important;
          }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#09090b",
          color: "#fff",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        {/* NAVBAR */}
        <header
          className="header"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "24px 32px",
          }}
        >
          <div
            className="nav"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22, color: "#3b82f6" }}>🚀</span>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>DevTrackr</h3>
            </div>

            <div
              className="actions"
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              {!isSignedIn ? (
                <>
                  <SignInButton mode="modal">
                    <button className="btn-ghost">Sign In</button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="btn-primary">Get Started</button>
                  </SignUpButton>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <UserButton />
                </>
              )}
            </div>
          </div>
        </header>

        {/* HERO */}
        <main
          className="main hero"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "60px 32px 60px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 50,
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.25)",
                padding: "6px 14px",
                borderRadius: 30,
                fontSize: 12,
                color: "#60a5fa",
                marginBottom: 20,
                fontWeight: 600,
              }}
            >
              <span>🔥 Usage Streaks & Prisma Sync Built-In</span>
            </div>

            <h1
              style={{
                fontSize: 52,
                lineHeight: 1.15,
                marginBottom: 20,
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              Track Your Projects <br />
              <span style={{ color: "#3b82f6" }}>Like a Pro</span>
            </h1>

            <p
              style={{
                maxWidth: 500,
                color: "rgba(255,255,255,.65)",
                lineHeight: 1.7,
                marginBottom: 28,
                fontSize: 15,
              }}
            >
              DevTrackr helps software developers manage ongoing side-projects, log activity milestones, maintain coding streaks, and publish developer portfolio pages seamlessly.
            </p>

            <div
              className="actions"
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {!isSignedIn ? (
                <>
                  <SignUpButton mode="modal">
                    <button className="btn-primary" style={{ padding: "12px 24px", fontSize: 15 }}>
                      Start Building Free
                    </button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <button className="btn-ghost" style={{ padding: "12px 24px", fontSize: 15 }}>
                      Sign In with Clerk
                    </button>
                  </SignInButton>
                </>
              ) : (
                <Link href="/dashboard" className="nav-link" style={{ padding: "12px 24px", fontSize: 15 }}>
                  Go to Dashboard →
                </Link>
              )}
            </div>
          </div>

          <LiveDashboard />
        </main>

        {/* FEATURES SHOWCASE SECTION */}
        <section
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "40px 32px 80px",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>
              Full-Stack Developer Platform
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 550, margin: "0 auto", fontSize: 14 }}>
              Verify core functionality directly from the interactive preview or authenticate with Clerk for persistent PostgreSQL state.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            <div className="feature-card">
              <div style={{ fontSize: 24, marginBottom: 12 }}>🔥</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Usage Streaks & Analytics</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
                Maintain active coding streaks as you log milestones, complete project tasks, and make progress daily.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: 24, marginBottom: 12 }}>🗄️</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Prisma & Serverless PostgreSQL</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
                Backed by Neon Serverless Postgres with Prisma ORM type safety (`User`, `Project`, and `Activity` models).
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: 24, marginBottom: 12 }}>🔐</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Clerk Authentication</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
                Secure OAuth and email authentication with automated user sync to PostgreSQL via Clerk Next.js SDK.
              </p>
            </div>

            <div className="feature-card">
              <div style={{ fontSize: 24, marginBottom: 12 }}>🌐</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Public Profiles & Share Links</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>
                Showcase your project progress publicly with custom profile routes (`/p/[username]`) and shareable links.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}