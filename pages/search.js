import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Nav from "../components/Nav";

const TYPE_LABELS = {
  traffic_safety: "Traffic Safety", street_lighting: "Street Lighting",
  road_maintenance: "Road Maintenance", parks_facilities: "Parks",
  noise_complaint: "Noise", housing: "Housing", utilities: "Utilities", other: "Community",
};

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("issues");
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus on mount + keyboard shortcut
  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e) {
      if (e.key === "/" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault(); inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Sync query with URL
  useEffect(() => {
    if (router.query.q) setQuery(String(router.query.q));
  }, [router.query.q]);

  // Load posts once
  useEffect(() => {
    fetch("/api/posts").then(r => r.json()).then(d => setAllPosts(Array.isArray(d) ? d : [])).catch(() => {});
  }, []);

  // Update URL as user types
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.trim()) router.replace(`/search?q=${encodeURIComponent(query)}`, undefined, { shallow: true });
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const q = query.toLowerCase().trim();
  const filteredPosts = q.length < 2 ? [] : allPosts.filter(p =>
    (p.complaint || "").toLowerCase().includes(q) ||
    (p.location || "").toLowerCase().includes(q) ||
    (TYPE_LABELS[p.issue_type] || "").toLowerCase().includes(q)
  );

  return (
    <>
      <Nav />
      <div className="container" style={{ maxWidth: 720 }}>
        {/* Search input */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input ref={inputRef} type="text" placeholder="Search issues, locations, issue types..." value={query} onChange={e => setQuery(e.target.value)}
            style={{ width: "100%", padding: "13px 14px 13px 42px", borderRadius: 12, border: "1.5px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontSize: 15, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
          {query && (
            <button onClick={() => setQuery("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 18, lineHeight: 1 }}>&times;</button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
          {[["issues", `Issues (${filteredPosts.length})`]].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: "transparent", color: tab === key ? "#2563eb" : "var(--muted)", borderBottom: `2px solid ${tab === key ? "#2563eb" : "transparent"}`, marginBottom: -1, transition: "all 0.15s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Results */}
        {q.length < 2 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" style={{ marginBottom: 12 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <p style={{ fontSize: 15, color: "var(--muted)" }}>Type at least 2 characters to search</p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 6, opacity: 0.7 }}>Press / anywhere to focus search</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>No results for &ldquo;{query}&rdquo;</p>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Try a different search term or <Link href="/compose" style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>raise this issue</Link>.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredPosts.map(post => (
              <Link key={post.id} href={`/post/${post.id}`}
                style={{ display: "block", padding: "16px 18px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface)", textDecoration: "none", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#2563eb"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(37,99,235,0.1)", color: "#2563eb" }}>
                    {TYPE_LABELS[post.issue_type] || "Community"}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{post.location}</span>
                </div>
                <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5, marginBottom: 6 }}>{post.complaint}</p>
                <p style={{ fontSize: 12, color: "var(--muted)" }}>{post.echo_count || 0} voices</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
