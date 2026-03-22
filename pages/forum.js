import { useState, useEffect } from "react";
import Link from "next/link";
import { FORUM_THREADS } from "../lib/forumThreads";

const ISSUE_COLORS = {
  traffic_safety: { label: "Traffic Safety", cls: "civic-pill-traffic", border: "#f59e0b" },
  street_lighting: { label: "Street Lighting", cls: "civic-pill-lighting", border: "#818cf8" },
  road_maintenance: { label: "Road Maintenance", cls: "civic-pill-roads", border: "#a78bfa" },
  parks_facilities: { label: "Parks", cls: "civic-pill-parks", border: "#22c55e" },
  noise_complaint: { label: "Noise", cls: "civic-pill-noise", border: "#f97316" },
  housing: { label: "Housing", cls: "civic-pill-safety", border: "#ef4444" },
  utilities: { label: "Utilities", cls: "civic-pill-other", border: "#94a3b8" },
  other: { label: "Community", cls: "civic-pill-other", border: "#94a3b8" },
};

const FILTER_TYPES = ["all", "traffic_safety", "street_lighting", "road_maintenance", "parks_facilities", "noise_complaint", "housing", "other"];

const DEMO_USERS = [
  { name: "Maria S.", role: "Parent & Resident", color: "#f59e0b" },
  { name: "James T.", role: "Business Owner", color: "#6366f1" },
  { name: "Chen W.", role: "Graduate Student", color: "#22c55e" },
  { name: "Patricia M.", role: "Retired Teacher", color: "#ef4444" },
];

function nameColor(name) {
  const colors = ["#f59e0b", "#6366f1", "#22c55e", "#ef4444", "#8b5cf6", "#f97316", "#06b6d4"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: nameColor(name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.35, fontWeight: 700, color: "white", flexShrink: 0 }}>
      {initials}
    </div>
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return "recently";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ForumPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const allPosts = [
    ...FORUM_THREADS.map(t => ({ ...t, _demo: true })),
    ...posts.map(p => ({ ...p, _live: true })),
  ];

  const filtered = filter === "all" ? allPosts : allPosts.filter(p => (p.issueType || p.issue_type) === filter);

  // Top 5 by echo/support for trending sidebar
  const trending = [...posts].sort((a, b) => (b.echo_count || 0) - (a.echo_count || 0)).slice(0, 5);
  const resolved = posts.filter(p => p.status === "sent").slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
      {/* NAV */}
      <nav className="civic-nav">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="civilian-logo">
            <span className="logo-white">Civil</span><span className="logo-blue">ian</span>
            <span style={{ display: "block", fontSize: 10, fontWeight: 400, color: "hsl(215,14%,58%)", letterSpacing: 1.5 }}>community · action · impact</span>
          </Link>
          <div style={{ display: "flex", gap: 4 }}>
            {[{href:"/", label:"Feed"},{href:"/reels", label:"Reels"},{href:"/groups", label:"Groups"},{href:"/profile", label:"Profile"}].map(l => (
              <Link key={l.href} href={l.href} style={{ color: "hsl(215,14%,58%)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8 }}>{l.label}</Link>
            ))}
          </div>
          <Link href="/compose" className="civic-btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Report Issue</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "200px 1fr 240px", gap: 24 }}>
        {/* LEFT SIDEBAR */}
        <aside>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 12 }}>Filter by Type</p>
          {FILTER_TYPES.map(type => {
            const c = ISSUE_COLORS[type];
            return (
              <button key={type} onClick={() => setFilter(type)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: filter === type ? 600 : 400, background: filter === type ? "hsl(216,28%,14%)" : "transparent", color: filter === type ? "hsl(210,30%,92%)" : "hsl(215,14%,58%)", marginBottom: 2, transition: "all 0.15s" }}>
                {type === "all" ? "🌐 All Issues" : `${c?.label || type}`}
              </button>
            );
          })}
          <div style={{ marginTop: 24 }}>
            <Link href="/compose" className="civic-btn-primary" style={{ display: "block", textAlign: "center", padding: "10px 16px", fontSize: 13 }}>+ Report Issue</Link>
          </div>
        </aside>

        {/* MAIN FEED */}
        <main>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 4 }}>Community Forum</h1>
          <p style={{ fontSize: 14, color: "hsl(215,14%,58%)", marginBottom: 20 }}>{filtered.length} active threads</p>

          {loading && (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <div className="civic-spinner" style={{ margin: "0 auto 16px" }} />
              <p style={{ color: "hsl(215,14%,58%)", fontSize: 14 }}>Loading...</p>
            </div>
          )}

          {filtered.map((item, i) => {
            const isDemo = item._demo;
            const issueType = item.issueType || item.issue_type;
            const c = ISSUE_COLORS[issueType] || ISSUE_COLORS.other;
            const name = isDemo ? item.name : (DEMO_USERS[i % DEMO_USERS.length].name);
            const role = isDemo ? item.role : (DEMO_USERS[i % DEMO_USERS.length].role);
            const text = isDemo ? item.text : item.complaint;
            const location = isDemo ? item.location : item.location;
            const support = isDemo ? item.support : item.echo_count;
            const href = isDemo ? `/forum/${item.id}` : `/post/${item.id}`;

            return (
              <Link key={item.id} href={href} style={{ textDecoration: "none", color: "inherit" }}>
                <div className="civic-card" style={{ padding: "16px 20px", marginBottom: 10, borderLeft: `4px solid ${c.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <Avatar name={name} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "hsl(210,30%,92%)" }}>{name}</span>
                      <span style={{ fontSize: 12, color: "hsl(215,14%,58%)", marginLeft: 8 }}>{role}</span>
                    </div>
                    <span className={`civic-pill ${c.cls}`}>{c.label}</span>
                    <span style={{ fontSize: 12, color: "hsl(215,14%,58%)" }}>{isDemo ? "2d ago" : timeAgo(item.created_at)}</span>
                  </div>
                  <p style={{ fontSize: 14, color: "hsl(210,30%,92%)", lineHeight: 1.5, marginBottom: 10 }}>{text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "hsl(215,14%,58%)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                      👥 {support} Echo
                    </button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "hsl(215,14%,58%)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                      💬 Comments
                    </button>
                    <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "hsl(215,14%,58%)", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 4 }}>
                      ↑ Share
                    </button>
                    <span style={{ marginLeft: "auto", fontSize: 12, color: "hsl(215,14%,58%)" }}>📍 {location || "Tempe, AZ"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </main>

        {/* RIGHT SIDEBAR */}
        <aside>
          <div className="civic-card" style={{ padding: 16, marginBottom: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 12 }}>🔥 Trending Issues</p>
            {trending.length === 0 && <p style={{ fontSize: 13, color: "hsl(215,14%,58%)" }}>No posts yet</p>}
            {trending.map((p, i) => {
              const c = ISSUE_COLORS[p.issue_type] || ISSUE_COLORS.other;
              return (
                <Link key={p.id} href={`/post/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "hsl(215,14%,58%)", minWidth: 16 }}>#{i + 1}</span>
                    <div>
                      <p style={{ fontSize: 13, color: "hsl(210,30%,92%)", lineHeight: 1.4, marginBottom: 2 }}>{p.complaint?.slice(0, 60)}...</p>
                      <span style={{ fontSize: 11, color: c.border }}>👥 {p.echo_count} voices</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="civic-card" style={{ padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 12 }}>✅ Recently Resolved</p>
            {resolved.length === 0 && <p style={{ fontSize: 13, color: "hsl(215,14%,58%)" }}>None yet — keep raising issues!</p>}
            {resolved.map(p => (
              <Link key={p.id} href={`/post/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 13, color: "hsl(210,30%,92%)", lineHeight: 1.4, marginBottom: 2 }}>{p.complaint?.slice(0, 60)}...</p>
                  <span style={{ fontSize: 11, color: "#22c55e" }}>✓ Letter Sent</span>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
