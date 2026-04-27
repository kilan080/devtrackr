



"use client";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

//  Animated project cards data 
const PROJECTS = [
  { name: "Portfolio Site", tag: "React", pct: 72, color: "#3b82f6", commits: 3 },
  { name: "Auth Service",   tag: "Node.js", pct: 45, color: "#8b5cf6", commits: 2 },
  { name: "CLI Tooling",    tag: "Python",  pct: 90, color: "#f59e0b", commits: 4 },
];

const ACTIVITY = [
  { icon: "✓", color: "#22c55e", bg: "rgba(34,197,94,0.12)", text: "Pushed to main — CLI Tooling",       time: "2m ago" },
  { icon: "↑", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", text: "Milestone reached — Portfolio Site", time: "18m ago" },
  { icon: "+", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", text: "New project added — Auth Service",   time: "1h ago" },
];


function ScanLine() {
  return (
    <div
      style={{
        position: "absolute", left: 0, right: 0, height: 2, top: 0,
        background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.55), rgba(99,102,241,0.55), transparent)",
        animation: "scan 3.8s cubic-bezier(0.4,0,0.6,1) infinite",
        pointerEvents: "none", zIndex: 3,
      }}
    />
  );
}

function GridBackground() {
  return (
    <div
      style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), " +
          "linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

function RadialGlow() {
  return (
    <div
      style={{
        position: "absolute", bottom: -100, left: "50%",
        transform: "translateX(-50%)",
        width: 700, height: 320,
        background: "radial-gradient(ellipse, rgba(37,99,235,0.16) 0%, transparent 68%)",
        animation: "glowPulse 4.5s ease-in-out infinite",
        pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

function ProjectCard({ project, index }: { project: typeof PROJECTS[0]; index: number }) {
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setBarWidth(project.pct), 300 + index * 160);
    return () => clearTimeout(t);
  }, [project.pct, index]);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.038)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 10,
        padding: "14px 14px 12px",
        animation: `cardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.1 + index * 0.15}s both`,
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 500, color: "#e4e4e7", marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {project.name}
      </p>
      <span
        style={{
          display: "inline-block", fontSize: 10, padding: "2px 7px", borderRadius: 4,
          marginBottom: 10, fontWeight: 500, letterSpacing: "0.03em",
          background: `${project.color}22`, color: project.color,
        }}
      >
        {project.tag}
      </span>

      {/* Progress bar */}
      <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 3, height: 4, overflow: "hidden", marginBottom: 8 }}>
        <div
          style={{
            height: "100%", borderRadius: 3,
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, ${project.color}, ${project.color}aa)`,
            transition: "width 1.1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
        <span>{project.pct}% complete</span>
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 6, height: 6, borderRadius: 2,
                background: i < project.commits ? project.color : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.022)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 8, padding: "10px 14px",
      }}
    >
      <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.22)", marginBottom: 8 }}>
        Recent activity
      </p>
      {ACTIVITY.map((row, i) => (
        <div
          key={i}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            fontSize: 11, color: "rgba(255,255,255,0.42)", padding: "3px 0",
            animation: `slideIn 0.4s ease ${0.9 + i * 0.3}s both`,
          }}
        >
          <div
            style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              background: row.bg, color: row.color,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9,
            }}
          >
            {row.icon}
          </div>
          <span>{row.text}</span>
          <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>
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
        position: "relative", background: "#09090b",
        borderRadius: 16, overflow: "hidden",
        padding: "28px 24px 24px",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 0 80px rgba(37,99,235,0.12), 0 32px 64px rgba(0,0,0,0.5)",
      }}
    >
      <GridBackground />
      <RadialGlow />
      <ScanLine />

      {/* Mini header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div
            style={{
              width: 8, height: 8, borderRadius: "50%", background: "#3b82f6",
              animation: "ping 2s ease-in-out infinite",
            }}
          />
          <span style={{ fontSize: 14, fontWeight: 600, color: "#fff", letterSpacing: "0.02em" }}>DevTrackr</span>
        </div>
        <div
          style={{
            fontSize: 10, color: "#22c55e",
            background: "rgba(34,197,94,0.1)",
            border: "1px solid rgba(34,197,94,0.22)",
            borderRadius: 20, padding: "3px 9px",
            display: "flex", alignItems: "center", gap: 5,
            letterSpacing: "0.05em", textTransform: "uppercase",
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "blink 1.4s ease-in-out infinite" }} />
          Live
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12, position: "relative", zIndex: 2 }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
      </div>

      {/* Activity */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <ActivityFeed />
      </div>
    </div>
  );
}


export default function Home() {
  const { isSignedIn } = useUser();

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes scan {
          0%   { top: 0%;   opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.7; transform: translateX(-50%) scaleX(1); }
          50%       { opacity: 1;   transform: translateX(-50%) scaleX(1.12); }
        }
        @keyframes ping {
          0%, 100% { box-shadow: 0 0 0 0   rgba(59,130,246,0.7); }
          50%       { box-shadow: 0 0 0 6px rgba(59,130,246,0);   }
        }
        @keyframes blink {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.2; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .devtrackr-btn-primary {
          cursor: pointer;
          padding: 10px 22px;
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: background 0.2s, transform 0.15s;
        }
        .devtrackr-btn-primary:hover  { background: #1d4ed8; transform: translateY(-1px); }
        .devtrackr-btn-primary:active { transform: scale(0.98); }
        .devtrackr-btn-ghost {
          cursor: pointer;
          padding: 10px 22px;
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.75);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 400;
          transition: background 0.2s, border-color 0.2s;
        }
        .devtrackr-btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }
        .devtrackr-nav-link {
          padding: 10px 22px;
          background: #2563eb;
          color: #fff;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.2s;
        }
        .devtrackr-nav-link:hover { background: #1d4ed8; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#09090b",
          color: "#fff",
          fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Page-level grid bg */}
        <div
          style={{
            position: "fixed", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), " +
              "linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            pointerEvents: "none", zIndex: 0,
          }}
        />

        {/* NAV */}
        <header
          style={{
            position: "relative", zIndex: 10,
            maxWidth: 1200, width: "100%", margin: "0 auto",
            padding: "24px 32px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 9, height: 9, borderRadius: "50%", background: "#3b82f6",
                animation: "ping 2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.02em" }}>DevTrackr</span>
          </div>

          {/* Nav actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {!isSignedIn && (
              <>
                <SignInButton mode="modal">
                  <button className="devtrackr-btn-ghost">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="devtrackr-btn-primary">Get Started</button>
                </SignUpButton>
              </>
            )}
            {isSignedIn && (
              <>
                <Link href="/dashboard" className="devtrackr-nav-link">
                  Dashboard
                </Link>
                <UserButton />
              </>
            )}
          </div>
        </header>

        {/* HERO */}
        <main
          style={{
            flex: 1, position: "relative", zIndex: 1,
            maxWidth: 1200, width: "100%", margin: "0 auto",
            padding: "60px 32px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "center",
          }}
        >
          {/* Left — copy */}
          <div>
            {/* Eyebrow */}
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(59,130,246,0.1)",
                border: "1px solid rgba(59,130,246,0.22)",
                borderRadius: 20, padding: "5px 12px",
                marginBottom: 28,
                animation: "fadeUp 0.5s ease both",
              }}
            >
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6", animation: "blink 1.4s ease-in-out infinite" }} />
              <span style={{ fontSize: 11, color: "#93c5fd", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 500 }}>
                Built for developers
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 58px)",
                fontWeight: 700,
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                marginBottom: 20,
                animation: "fadeUp 0.55s ease 0.08s both",
              }}
            >
              Track Your Projects
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Like a Pro
              </span>
            </h1>

            {/* Sub */}
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 17,
                lineHeight: 1.65,
                maxWidth: 440,
                marginBottom: 36,
                animation: "fadeUp 0.55s ease 0.16s both",
              }}
            >
              DevTrackr helps you manage, track, and showcase your development
              projects — all in one live dashboard.
            </p>

            {/* CTAs */}
            <div
              style={{
                display: "flex", gap: 12, flexWrap: "wrap",
                animation: "fadeUp 0.55s ease 0.24s both",
              }}
            >
              {!isSignedIn && (
                <>
                  <SignUpButton mode="modal">
                    <button className="devtrackr-btn-primary" style={{ padding: "12px 28px", fontSize: 15 }}>
                      Start Building
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="devtrackr-btn-ghost" style={{ padding: "12px 24px", fontSize: 15 }}>
                      Already have an account?
                    </button>
                  </SignInButton>
                </>
              )}
              {isSignedIn && (
                <Link href="/dashboard" className="devtrackr-nav-link" style={{ padding: "12px 28px", fontSize: 15 }}>
                  Go to Dashboard
                </Link>
              )}
            </div>

            {/* Social proof nudge */}
            <p
              style={{
                marginTop: 24, fontSize: 12,
                color: "rgba(255,255,255,0.22)",
                animation: "fadeUp 0.55s ease 0.32s both",
              }}
            >
              Free to start · No credit card required
            </p>
          </div>

          {/* Right — live dashboard visual */}
          <div style={{ animation: "fadeUp 0.7s ease 0.2s both" }}>
            <LiveDashboard />
          </div>
        </main>

        {/* FEATURE STRIP */}
        {/* <section
          style={{
            position: "relative", zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "48px 32px",
          }}
        >
          <div
            style={{
              maxWidth: 1200, margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 32,
            }}
          >
            {[
              { icon: "◈", title: "All projects, one place", desc: "Centralise every repo, task, and milestone in a single live view." },
              { icon: "⟳", title: "Real-time progress tracking", desc: "Watch completion bars move as you push commits and close issues." },
              { icon: "⬡", title: "Showcase your work", desc: "Share a public portfolio link so clients see what you're building." },
            ].map((f, i) => (
              <div
                key={f.title}
                style={{
                  padding: "24px 20px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 12,
                  animation: `fadeUp 0.5s ease ${0.1 + i * 0.1}s both`,
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 12, color: "#3b82f6" }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#f4f4f5" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section> */}
      </div>
    </>
  );
}