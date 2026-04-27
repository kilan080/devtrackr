"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";



const PROJECTS = [
  { name: "Portfolio Site", tag: "React", pct: 72, color: "#3b82f6", commits: 3 },
  { name: "Auth Service", tag: "Node.js", pct: 45, color: "#8b5cf6", commits: 2 },
  { name: "CLI Tooling", tag: "Python", pct: 90, color: "#f59e0b", commits: 4 },
];

const ACTIVITY = [
  {
    icon: "✓",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    text: "Pushed to main — CLI Tooling",
    time: "2m ago",
  },
  {
    icon: "↑",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    text: "Milestone reached — Portfolio Site",
    time: "18m ago",
  },
  {
    icon: "+",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    text: "New project added — Auth Service",
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
}: {
  project: (typeof PROJECTS)[0];
  index: number;
}) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(project.pct), 300 + index * 150);
    return () => clearTimeout(t);
  }, [project, index]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <p
        style={{
          fontSize: 13,
          color: "#fff",
          marginBottom: 8,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {project.name}
      </p>

      <span
        style={{
          display: "inline-block",
          fontSize: 10,
          padding: "4px 8px",
          borderRadius: 20,
          marginBottom: 10,
          background: `${project.color}22`,
          color: project.color,
        }}
      >
        {project.tag}
      </span>

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
            transition: "1s",
          }}
        />
      </div>

      <small style={{ color: "rgba(255,255,255,.45)" }}>
        {project.pct}% complete
      </small>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.03)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 12,
        padding: 14,
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,.35)",
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        Recent Activity
      </p>

      {ACTIVITY.map((row, i) => (
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
              width: 18,
              height: 18,
              borderRadius: 6,
              background: row.bg,
              color: row.color,
              display: "grid",
              placeItems: "center",
              fontSize: 10,
            }}
          >
            {row.icon}
          </div>

          <span
            style={{
              color: "rgba(255,255,255,.55)",
              fontSize: 12,
              flex: 1,
            }}
          >
            {row.text}
          </span>

          <span
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,.25)",
            }}
          >
            {row.time}
          </span>
        </div>
      ))}
    </div>
  );
}

function LiveDashboard() {
  return (
    <div
      style={{
        position: "relative",
        background: "#09090b",
        borderRadius: 18,
        overflow: "hidden",
        padding: 22,
        border: "1px solid rgba(255,255,255,.08)",
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
            gap: 10,
            marginBottom: 18,
            flexWrap: "wrap",
          }}
        >
          <strong>DevTrackr</strong>

          <span
            style={{
              fontSize: 11,
              padding: "5px 10px",
              borderRadius: 30,
              background: "rgba(34,197,94,.1)",
              color: "#22c55e",
            }}
          >
            Live
          </span>
        </div>

        <div
          className="cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 12,
            marginBottom: 14,
          }}
        >
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>

        <ActivityFeed />
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
        }

        .btn-ghost{
          border:1px solid rgba(255,255,255,.12);
          background:rgba(255,255,255,.04);
          color:#fff;
          padding:10px 18px;
          border-radius:10px;
          cursor:pointer;
        }

        .nav-link{
          text-decoration:none;
          background:#2563eb;
          color:#fff;
          padding:10px 18px;
          border-radius:10px;
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
            <h3 style={{ margin: 0 }}>DevTrackr</h3>

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
            padding: "60px 32px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 56,
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Track Your Projects <br />
              <span style={{ color: "#3b82f6" }}>Like a Pro</span>
            </h1>

            <p
              style={{
                maxWidth: 500,
                color: "rgba(255,255,255,.6)",
                lineHeight: 1.7,
                marginBottom: 28,
              }}
            >
              DevTrackr helps you manage, track and showcase your development
              projects in one beautiful live dashboard.
            </p>

            <div
              className="actions"
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {!isSignedIn ? (
                <>
                  <SignUpButton mode="modal">
                    <button className="btn-primary">
                      Start Building
                    </button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <button className="btn-ghost">
                      Already have account?
                    </button>
                  </SignInButton>
                </>
              ) : (
                <Link href="/dashboard" className="nav-link">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>

          <LiveDashboard />
        </main>
      </div>
    </>
  );
}