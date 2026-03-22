import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const PHONE_STEPS = [
  { label: "Describe", icon: "✏️" },
  { label: "Searching", icon: "🔍" },
  { label: "Letter", icon: "📄" },
  { label: "Rally", icon: "📣" },
];

const ISSUE_COLORS = {
  traffic_safety:   { label: "Traffic Safety",   cls: "civic-pill-traffic",  border: "#f59e0b" },
  street_lighting:  { label: "Street Lighting",  cls: "civic-pill-lighting", border: "#818cf8" },
  road_maintenance: { label: "Road Maintenance", cls: "civic-pill-roads",    border: "#a78bfa" },
  parks_facilities: { label: "Parks",            cls: "civic-pill-parks",    border: "#22c55e" },
  noise_complaint:  { label: "Noise",            cls: "civic-pill-noise",    border: "#f97316" },
  housing:          { label: "Housing",          cls: "civic-pill-safety",   border: "#ef4444" },
  utilities:        { label: "Utilities",        cls: "civic-pill-other",    border: "#94a3b8" },
  other:            { label: "Community",        cls: "civic-pill-other",    border: "#94a3b8" },
};

const NAV_LINKS = [
  { href: "/",        label: "Feed"    },
  { href: "/reels",   label: "Reels"   },
  { href: "/groups",  label: "Groups"  },
  { href: "/profile", label: "Profile" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function PhoneMockup({ dark }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % PHONE_STEPS.length), 3000);
    return () => clearInterval(t);
  }, []);

  const bg   = dark ? "hsl(216,28%,10%)" : "#f0f4ff";
  const bg2  = dark ? "hsl(216,28%,7%)"  : "#e8eeff";
  const bdr  = dark ? "hsl(215,20%,20%)" : "#c7d4f5";
  const txt  = dark ? "hsl(210,30%,92%)" : "#1a1a2e";
  const mute = dark ? "hsl(215,14%,58%)" : "#6b7280";

  return (
    <div style={{ width: 260, height: 480, borderRadius: 36, border: `2px solid ${bdr}`, background: bg, position: "relative", overflow: "hidden", margin: "0 auto", boxShadow: dark ? "0 32px 80px rgba(0,0,0,0.5)" : "0 32px 80px rgba(37,99,235,0.15)" }}>
      {/* notch */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 96, height: 20, background: dark ? "hsl(216,28%,7%)" : "#dde6ff", borderRadius: "0 0 12px 12px", zIndex: 10 }} />
      <div style={{ height: 40 }} />
      <div style={{ padding: "0 20px" }}>
        {/* progress bar */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          {PHONE_STEPS.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? "hsl(221,83%,53%)" : bdr, transition: "background 0.5s" }} />
          ))}
        </div>
        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: mute, marginBottom: 12 }}>
          Step {step + 1}: {PHONE_STEPS[step].label}
        </p>

        {step === 0 && (
          <div style={{ background: bg2, borderRadius: 8, padding: 12, border: `1px solid ${bdr}` }}>
            <p style={{ fontSize: 12, color: txt, lineHeight: 1.6 }}>
              The crosswalk at Mill Ave needs better lighting...
              <span style={{ borderRight: "2px solid hsl(221,83%,53%)", marginLeft: 2, animation: "cursorBlink 0.75s step-end infinite" }} />
            </p>
          </div>
        )}
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0" }}>
            <div className="civic-spinner" style={{ width: 28, height: 28, marginBottom: 12 }} />
            <p style={{ fontSize: 12, color: mute }}>Searching city records...</p>
          </div>
        )}
        {step === 2 && (
          <div style={{ background: bg2, borderRadius: 8, padding: 12, border: `1px solid ${bdr}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "hsl(221,83%,53%)", marginBottom: 4 }}>Formal Letter</p>
            <p style={{ fontSize: 12, color: txt, lineHeight: 1.6 }}>
              Dear Director of Transportation,<br /><br />
              I am writing to bring to your attention a safety concern...
            </p>
          </div>
        )}
        {step === 3 && (
          <div>
            <p style={{ fontSize: 32, fontWeight: 800, color: txt, letterSpacing: -2, marginBottom: 4 }}>47</p>
            <p style={{ fontSize: 12, color: mute, marginBottom: 12 }}>neighbors echoed this issue</p>
            <div className="civic-progress-bar">
              <div className="civic-progress-fill" style={{ width: "94%" }} />
            </div>
            <p style={{ fontSize: 10, color: mute, marginTop: 4 }}>3 more voices for council escalation</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [feedFilter, setFeedFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all_status");
  const [dark, setDark] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((data) => { setPosts(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalVoices = posts.reduce((sum, p) => sum + (p.echo_count || 0), 0);
  const lettersSent = posts.filter((p) => p.status === "sent").length;
  const filtered = posts.filter((p) => {
    const matchSearch = search.trim() === "" || p.complaint?.toLowerCase().includes(search.toLowerCase()) || p.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = feedFilter === "all" || p.issue_type === feedFilter;
    const matchStatus = statusFilter === "all_status" || (statusFilter === "sent" ? p.status === "sent" : p.status !== "sent");
    return matchSearch && matchType && matchStatus;
  });

  // theme tokens
  const T = dark ? {
    pageBg:    "hsl(216,28%,7%)",
    navBg:     "rgba(13,17,23,0.85)",
    cardBg:    "hsl(216,28%,10%)",
    cardBg2:   "hsl(216,28%,8%)",
    border:    "hsl(215,20%,20%)",
    fg:        "hsl(210,30%,92%)",
    muted:     "hsl(215,14%,58%)",
    inputBg:   "hsl(216,28%,10%)",
    sidebarBg: "hsl(216,28%,10%)",
    footerBg:  "hsl(216,28%,7%)",
    statsGlass:"rgba(13,17,23,0.5)",
    outlineBtn:"hsl(215,14%,58%)",
  } : {
    pageBg:    "#f0f4ff",
    navBg:     "rgba(255,255,255,0.9)",
    cardBg:    "#ffffff",
    cardBg2:   "#f8faff",
    border:    "#d1daf5",
    fg:        "#0f172a",
    muted:     "#64748b",
    inputBg:   "#ffffff",
    sidebarBg: "#ffffff",
    footerBg:  "#e8eeff",
    statsGlass:"rgba(255,255,255,0.7)",
    outlineBtn:"#334155",
  };

  return (
    <div style={{ minHeight: "100vh", background: T.pageBg, transition: "background 0.3s" }}>

      {/* NAV */}
      <nav className="civic-nav" style={{ background: T.navBg, borderBottomColor: T.border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="civilian-logo">
            <span className="logo-white" style={{ color: dark ? undefined : "#0f172a" }}>Civil</span><span className="logo-blue">ian</span>
            <span style={{ display: "block", fontSize: 10, fontWeight: 400, color: T.muted, letterSpacing: 1.5, textTransform: "lowercase" }}>community · action · impact</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} style={{ color: l.href === "/" ? "hsl(221,83%,53%)" : T.muted, textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8 }}>{l.label}</Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setDark(d => !d)}
              title="Toggle theme"
              style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 8, cursor: "pointer", fontSize: 16, padding: "6px 10px", color: T.muted, transition: "all 0.2s" }}
            >
              {dark ? "☀️" : "🌙"}
            </button>
            <Link href="/compose" className="civic-btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Report Issue</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden" }}>
        {/* bg photo */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url(https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600)", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.06 }} />
        {/* radial glows */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 20% 80%, rgba(37,99,235,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, rgba(124,58,237,0.08) 0%, transparent 60%)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: 1200, margin: "0 auto", padding: "0 32px", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          {/* LEFT */}
          <div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
              style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase", color: T.muted, marginBottom: 24 }}>
              Tempe, Arizona · AI-Powered Civic Platform
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              style={{ fontSize: "clamp(42px,6vw,80px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: -4, marginBottom: 24, color: T.fg }}>
              Your neighborhood<br />
              <span style={{ background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(263,70%,50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                deserves better.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.7 }}
              style={{ fontSize: 18, maxWidth: 520, color: T.muted, lineHeight: 1.6, marginBottom: 40 }}>
              Describe any problem in plain English. AI finds the right official, writes a formal letter citing real law, and rallies your community.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.6 }}
              style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <Link href="/compose" className="civic-btn-primary" style={{ padding: "14px 32px", fontSize: 15 }}>Join the Movement</Link>
              <a href="#feed" style={{ textDecoration: "none", padding: "14px 32px", borderRadius: 999, fontWeight: 600, fontSize: 15, border: `1px solid ${T.border}`, color: T.outlineBtn, transition: "all 0.2s" }}>
                See Issues →
              </a>
            </motion.div>

            {/* stats strip */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.7 }}
              style={{ marginTop: 48, display: "inline-flex", alignItems: "center", gap: 24, padding: "14px 24px", borderRadius: 12, border: `1px solid ${T.border}`, background: T.statsGlass, backdropFilter: "blur(12px)" }}>
              <span style={{ color: T.muted, fontSize: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 20, color: T.fg }}>{loading ? "—" : totalVoices}</span><br />
                <span style={{ fontSize: 11 }}>total voices</span>
              </span>
              <span style={{ width: 1, height: 32, background: T.border }} />
              <span style={{ color: T.muted, fontSize: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 20, color: T.fg }}>{loading ? "—" : posts.length}</span><br />
                <span style={{ fontSize: 11 }}>issues reported</span>
              </span>
              <span style={{ width: 1, height: 32, background: T.border }} />
              <span style={{ color: T.muted, fontSize: 14 }}>
                <span style={{ fontWeight: 700, fontSize: 20, color: T.fg }}>{loading ? "—" : lettersSent}</span><br />
                <span style={{ fontSize: 11 }}>letters sent</span>
              </span>
            </motion.div>
          </div>

          {/* RIGHT — phone */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
            style={{ display: "flex", justifyContent: "center" }}>
            <PhoneMockup dark={dark} />
          </motion.div>
        </div>
      </section>

      {/* FEED */}
      <section id="feed" style={{ padding: "80px 0", background: T.pageBg, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 800, letterSpacing: -1.5, color: T.fg, marginBottom: 8, textAlign: "center" }}>
            What your neighbors are raising
          </motion.h2>
          <p style={{ color: T.muted, textAlign: "center", marginBottom: 40, fontSize: 15 }}>sorted by most voices</p>

          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 28 }}>
            {/* SIDEBAR */}
            <aside>
              <div style={{ background: T.sidebarBg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 12px", marginBottom: 16, transition: "background 0.3s" }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: T.muted, marginBottom: 12, paddingLeft: 4 }}>Issue Type</p>
                {[
                  { key: "all",              label: "🌐 All Issues",       color: T.fg },
                  { key: "traffic_safety",   label: "🚦 Traffic Safety",   color: "#f59e0b" },
                  { key: "street_lighting",  label: "💡 Street Lighting",  color: "#818cf8" },
                  { key: "road_maintenance", label: "🛣️ Road Maintenance", color: "#a78bfa" },
                  { key: "parks_facilities", label: "🌳 Parks",            color: "#22c55e" },
                  { key: "noise_complaint",  label: "🔊 Noise",            color: "#f97316" },
                  { key: "housing",          label: "🏠 Housing",          color: "#ef4444" },
                  { key: "utilities",        label: "⚡ Utilities",        color: "#94a3b8" },
                  { key: "other",            label: "💬 Community",        color: "#94a3b8" },
                ].map(({ key, label, color }) => {
                  const count = key === "all" ? posts.length : posts.filter(p => p.issue_type === key).length;
                  const active = feedFilter === key;
                  return (
                    <button key={key} onClick={() => setFeedFilter(key)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: active ? `1px solid ${color}44` : "1px solid transparent", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: active ? 600 : 400, background: active ? `${color}18` : "transparent", color: active ? color : T.muted, marginBottom: 2, transition: "all 0.15s" }}>
                      <span>{label}</span>
                      {count > 0 && <span style={{ fontSize: 11, background: dark ? "hsl(215,25%,15%)" : "#e8eeff", borderRadius: 999, padding: "1px 6px", color: T.muted }}>{count}</span>}
                    </button>
                  );
                })}
              </div>

              <div style={{ background: T.sidebarBg, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 12px", transition: "background 0.3s" }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: T.muted, marginBottom: 12, paddingLeft: 4 }}>Status</p>
                {[
                  { key: "all_status", label: "📋 All",         color: T.fg },
                  { key: "pending",    label: "⏳ Pending",     color: "#f59e0b" },
                  { key: "sent",       label: "✅ Letter Sent", color: "#22c55e" },
                ].map(({ key, label, color }) => {
                  const active = statusFilter === key;
                  return (
                    <button key={key} onClick={() => setStatusFilter(key)}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: active ? `1px solid ${color}44` : "1px solid transparent", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: active ? 600 : 400, background: active ? `${color}18` : "transparent", color: active ? color : T.muted, marginBottom: 2, transition: "all 0.15s" }}>
                      {label}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* MAIN FEED */}
            <div>
              {/* search */}
              <div style={{ display: "flex", alignItems: "center", background: T.inputBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "0 16px", marginBottom: 20, transition: "background 0.3s" }}>
                <span style={{ marginRight: 10, color: T.muted }}>🔍</span>
                <input type="text" placeholder="Search issues by keyword or location..." value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, border: "none", outline: "none", padding: "12px 0", fontSize: 14, background: "transparent", color: T.fg, fontFamily: "Inter, sans-serif" }} />
                {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 13 }}>✕</button>}
              </div>

              {loading && (
                <div style={{ textAlign: "center", padding: "48px 0" }}>
                  <div className="civic-spinner" style={{ margin: "0 auto 16px" }} />
                  <p style={{ color: T.muted, fontSize: 14 }}>Loading community issues...</p>
                </div>
              )}

              {!loading && filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: T.muted }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🏙️</div>
                  <p style={{ fontSize: 18, fontWeight: 500, color: T.fg, marginBottom: 8 }}>No issues yet</p>
                  <p style={{ fontSize: 14 }}>Be the first to raise a community issue</p>
                </div>
              )}

              {filtered.map((post, i) => {
                const c = ISSUE_COLORS[post.issue_type] || ISSUE_COLORS.other;
                return (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} custom={i} variants={fadeUp}>
                    <Link href={`/post/${post.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ display: "flex", marginBottom: 10, borderLeft: `4px solid ${c.border}`, overflow: "hidden", background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 12, transition: "border-color 0.15s, background 0.3s" }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = c.border}
                        onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
                        <div style={{ width: 52, background: T.cardBg2, display: "flex", flexDirection: "column", alignItems: "center", padding: "12px 6px", gap: 2, flexShrink: 0, borderRight: `1px solid ${T.border}` }}>
                          <span style={{ fontSize: 18 }}>👥</span>
                          <span style={{ fontSize: 16, fontWeight: 800, color: T.fg }}>{post.echo_count}</span>
                          <span style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>voices</span>
                        </div>
                        <div style={{ padding: "12px 16px", flex: 1 }}>
                          <span className={`civic-pill ${c.cls}`} style={{ marginBottom: 8, display: "inline-block" }}>{c.label}</span>
                          <p style={{ fontSize: 15, color: T.fg, lineHeight: 1.4, marginBottom: 8, fontWeight: 500 }}>{post.complaint}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontSize: 12, color: T.muted }}>📍 {post.location || "Tempe, AZ"}</span>
                            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 600, background: post.status === "sent" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", color: post.status === "sent" ? "#22c55e" : "#f59e0b" }}>
                              {post.status === "sent" ? "✓ Letter Sent" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              <div style={{ textAlign: "center", marginTop: 32 }}>
                <Link href="/compose" className="civic-btn-primary" style={{ padding: "14px 40px", fontSize: 15 }}>+ Raise an Issue</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${T.border}`, padding: "48px 32px", background: T.footerBg, transition: "background 0.3s" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>
            <span style={{ color: dark ? "hsl(210,30%,92%)" : "#0f172a" }}>Civil</span>
            <span style={{ color: "hsl(221,83%,53%)" }}>ian</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 14, color: T.muted }}>
            {NAV_LINKS.map(l => <Link key={l.href} href={l.href} style={{ color: "inherit", textDecoration: "none" }}>{l.label}</Link>)}
            <Link href="/map" style={{ color: "inherit", textDecoration: "none" }}>Map</Link>
            <Link href="/compose" style={{ color: "inherit", textDecoration: "none" }}>Raise Issue</Link>
          </div>
          <p style={{ fontSize: 12, color: T.muted }}>© 2026 Civilian · Tempe, AZ</p>
        </div>
      </footer>

      <style>{`
        @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .civic-spinner {
          width: 32px; height: 32px;
          border: 3px solid hsl(215,20%,20%);
          border-top-color: hsl(221,83%,53%);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
