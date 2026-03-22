import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import { FORUM_THREADS, ISSUE_COLORS } from "../lib/civicData";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getInitials(name) {
  return (name || "A").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}
function getAvatarColor(name) {
  const colors = ["#2563eb","#6366f1","#8b5cf6","#f59e0b","#22c55e","#ef4444","#f97316"];
  let h = 0;
  for (let i = 0; i < (name || "").length; i++) h = (name || "").charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
}

export default function SimilarPostsPage() {
  const router = useRouter();
  const { issue_type, location, from_id } = router.query;

  const [dbPosts, setDbPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!issue_type) return;
    fetch("/api/posts?sort=new")
      .then(r => r.json())
      .then(d => { setDbPosts(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [issue_type]);

  // Build combined list — static + DB, filtered by issue_type
  const staticPosts = FORUM_THREADS
    .filter(t => (t.issueType || t.issue_type) === issue_type)
    .map(t => ({ ...t, issue_type: t.issueType || t.issue_type, complaint: t.text || t.complaint, echo_count: t.support || t.echo_count || 0 }));

  const dbFiltered = dbPosts.filter(p =>
    p.issue_type === issue_type && String(p.id) !== String(from_id)
  );

  // Deduplicate by id
  const seen = new Set(staticPosts.map(p => String(p.id)));
  const combined = [
    ...staticPosts,
    ...dbFiltered.filter(p => !seen.has(String(p.id))),
  ];

  const c = ISSUE_COLORS[issue_type] || ISSUE_COLORS.other;
  const label = c.label || (issue_type || "").replace(/_/g, " ");

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        {/* Header */}
        <Link href="/forum" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 24 }}>
          ← Back to community feed
        </Link>

        <div style={{ marginBottom: 28 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: c.border, background: `${c.border}18`, padding: "3px 10px", borderRadius: 999, border: `1px solid ${c.border}44` }}>
            {label}
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--text)", marginTop: 12, marginBottom: 6, letterSpacing: -0.5 }}>
            Similar Issues
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
            {combined.length} residents have raised {label.toLowerCase()} issues
            {location ? ` near ${location}` : ""}.
            Add your voice to an existing issue or raise a new one.
          </p>
        </div>

        {/* Raise new issue CTA */}
        <Link href="/compose" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "white", textDecoration: "none", fontSize: 14, fontWeight: 700, marginBottom: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Raise a new issue
        </Link>

        {loading && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--muted)", fontSize: 14 }}>Loading...</div>
        )}

        {!loading && combined.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>No similar issues yet</p>
            <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>Be the first to raise this type of issue in your community.</p>
            <Link href="/compose" style={{ fontSize: 14, color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>Raise an issue →</Link>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {combined.map(post => {
            const name = post.author_name || post.name || "Anonymous Resident";
            const echoes = Number(post.echo_count) || 0;
            const isDemo = String(post.id).startsWith("demo");
            return (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                style={{ display: "block", background: "var(--surface)", border: `1px solid var(--border)`, borderRadius: 14, padding: "18px 20px", textDecoration: "none", transition: "border-color 0.15s, box-shadow 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.boxShadow = `0 4px 20px ${c.border}22`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Author row */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: getAvatarColor(name), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {getInitials(name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{name}</span>
                    {post.role && <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>{post.role}</span>}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{isDemo ? "Demo" : timeAgo(post.created_at)}</span>
                </div>

                {/* Text */}
                <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.6, marginBottom: 10 }}>
                  {(post.complaint || post.text || "").slice(0, 160)}{(post.complaint || post.text || "").length > 160 ? "..." : ""}
                </p>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={c.border} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                    <span style={{ fontSize: 13, fontWeight: 700, color: c.border }}>{echoes} voices</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {post.status === "responded" || post.status === "resolved" ? (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)" }}>
                        {post.status === "resolved" ? "Resolved" : "Responded"}
                      </span>
                    ) : null}
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{post.location || "Tempe, AZ"}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
