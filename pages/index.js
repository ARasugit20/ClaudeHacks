import { useState, useEffect } from "react";
import Link from "next/link";

const TYPE_LABELS = {
  traffic_safety: { label: "Traffic Safety", cls: "type-traffic" },
  street_lighting: { label: "Street Lighting", cls: "type-lighting" },
  road_maintenance: { label: "Road Maintenance", cls: "type-roads" },
  parks_facilities: { label: "Parks", cls: "type-parks" },
  noise_complaint: { label: "Noise", cls: "type-other" },
  housing: { label: "Housing", cls: "type-safety" },
  utilities: { label: "Utilities", cls: "type-other" },
  other: { label: "Community", cls: "type-other" },
};

const BORDER_COLORS = {
  traffic_safety: "#f59e0b", street_lighting: "#6366f1",
  road_maintenance: "#8b5cf6", parks_facilities: "#22c55e",
  noise_complaint: "#f97316", housing: "#ef4444",
  utilities: "#06b6d4", other: "#94a3b8",
};

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalVoices = posts.reduce((sum, p) => sum + (p.echo_count || 0), 0);

  const filtered = posts.filter((p) =>
    search.trim() === "" ||
    p.complaint?.toLowerCase().includes(search.toLowerCase()) ||
    p.location?.toLowerCase().includes(search.toLowerCase()) ||
    p.issue_type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav-logo">civic<span>pulse</span></Link>
        <div className="nav-center">
          <Link href="/map" className="nav-link">🗺 Map</Link>
          <Link href="/" className="nav-link">Feed</Link>
        </div>
        <Link href="/compose" className="nav-btn">+ Raise Issue</Link>
      </nav>

      <div className="container">
        {/* WELCOME HEADER */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1 className="welcome-title">Welcome to CivicPulse</h1>
            <p className="welcome-sub">Tempe's community voice — plain English in, official letters out.</p>
          </div>
          <div className="welcome-stats">
            <div className="stat-pill">
              <span className="stat-num">{totalVoices}</span>
              <span className="stat-label">voices</span>
            </div>
            <div className="stat-pill">
              <span className="stat-num">{posts.length}</span>
              <span className="stat-label">issues</span>
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search issues by keyword, location, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>

        {/* HERO CTA */}
        <div className="hero">
          <div className="hero-left">
            <p className="hero-tagline">Have a problem in your neighborhood?</p>
            <p className="hero-sub">AI turns your plain English complaint into a formal letter — sent to the right official.</p>
          </div>
          <Link href="/compose" className="hero-btn">+ Raise an Issue</Link>
        </div>

        <div className="feed-header">
          <span className="feed-title">Community Issues</span>
          <span className="feed-subtitle">
            {search ? `${filtered.length} results for "${search}"` : "sorted by most voices"}
          </span>
        </div>

        {loading && (
          <div className="loading-wrap">
            <div className="loading-spinner" />
            <p className="loading-text">Loading community issues...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">{search ? "🔍" : "🏙️"}</div>
            <p className="empty-title">{search ? `No results for "${search}"` : "No issues reported yet"}</p>
            <p>{search ? "Try a different keyword" : "Be the first to raise a community issue"}</p>
          </div>
        )}

        {filtered.map((post) => {
          const typeInfo = TYPE_LABELS[post.issue_type] || TYPE_LABELS.other;
          const borderColor = BORDER_COLORS[post.issue_type] || BORDER_COLORS.other;
          return (
            <Link
              href={`/post/${post.id}`}
              key={post.id}
              className="post-card"
              style={{ borderLeft: `4px solid ${borderColor}` }}
            >
              <div className="post-vote">
                <span className="post-vote-icon">👥</span>
                <span className="post-vote-count">{post.echo_count}</span>
                <span className="post-vote-label">voices</span>
              </div>
              <div className="post-content">
                <span className={`post-type ${typeInfo.cls}`}>{typeInfo.label}</span>
                <p className="post-complaint">{post.complaint}</p>
                <div className="post-meta">
                  <span className="post-location">📍 {post.location || "Tempe, AZ"}</span>
                  <span className={`post-status status-${post.status}`}>
                    {post.status === "sent" ? "✓ Letter Sent" : "Pending"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}