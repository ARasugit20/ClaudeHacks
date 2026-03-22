import { useState } from "react";
import Link from "next/link";

const GROUPS = [
  { id: 1, name: "Tempe Traffic Warriors", members: 234, privacy: "Public", description: "Fighting for safer streets, crosswalks, and pedestrian rights across Tempe", tags: ["TRAFFIC", "SAFETY"], gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", initial: "T" },
  { id: 2, name: "Parks & Green Spaces Alliance", members: 189, privacy: "Public", description: "Advocating for shade, maintenance, and accessibility in Tempe parks", tags: ["PARKS"], gradient: "linear-gradient(135deg, #22c55e, #06b6d4)", initial: "P" },
  { id: 3, name: "Mill Ave Neighborhood Watch", members: 312, privacy: "Public", description: "Keeping the Mill Ave corridor safe, clean, and well-lit", tags: ["SAFETY", "LIGHTING"], gradient: "linear-gradient(135deg, #6366f1, #2563eb)", initial: "M" },
  { id: 4, name: "Tempe Renters United", members: 567, privacy: "Private", description: "Organizing renters across Tempe for fair housing and tenant rights", tags: ["HOUSING"], gradient: "linear-gradient(135deg, #ef4444, #f97316)", initial: "R" },
  { id: 5, name: "Apache Blvd Improvement District", members: 143, privacy: "Public", description: "Improving infrastructure and safety along Apache Boulevard", tags: ["ROADS", "SAFETY"], gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)", initial: "A" },
  { id: 6, name: "ASU Area Residents", members: 891, privacy: "Public", description: "Students and residents around ASU working together for a better community", tags: ["COMMUNITY"], gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)", initial: "U" },
];

export default function Groups() {
  const [search, setSearch] = useState("");
  const [joined, setJoined] = useState(new Set());
  const filtered = GROUPS.filter(g => search === "" || g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
      <nav className="civic-nav">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="civilian-logo"><span className="logo-white">Civil</span><span className="logo-blue">ian</span></Link>
          <div style={{ display: "flex", gap: 8 }}>
            {[{href:"/", label:"Feed"},{href:"/reels", label:"Reels"},{href:"/groups", label:"Groups"},{href:"/profile", label:"Profile"}].map(l => (
              <Link key={l.href} href={l.href} style={{ color: l.href==="/groups" ? "hsl(221,83%,53%)" : "hsl(215,14%,58%)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8 }}>{l.label}</Link>
            ))}
          </div>
          <Link href="/compose" className="civic-btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Report Issue</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 8 }}>Community Groups</h1>
        <p style={{ fontSize: 16, color: "hsl(215,14%,58%)", marginBottom: 32 }}>Join groups to fight for your neighborhood</p>

        <input type="text" placeholder="Search groups..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", maxWidth: 480, padding: "12px 16px", background: "hsl(216,28%,10%)", border: "1px solid hsl(215,20%,20%)", borderRadius: 10, color: "hsl(210,30%,92%)", fontSize: 15, outline: "none", fontFamily: "Inter, sans-serif", marginBottom: 40 }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {filtered.map(group => (
            <Link key={group.id} href={`/groups/${group.id}`} style={{ textDecoration: "none", display: "block" }}>
            <div className="civic-card" style={{ overflow: "hidden", cursor: "pointer" }}>
              <div style={{ height: 120, background: group.gradient, position: "relative" }}>
                <div style={{ position: "absolute", bottom: -20, left: 20, width: 48, height: 48, borderRadius: 12, background: "hsl(216,28%,10%)", border: "2px solid hsl(215,20%,20%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: "hsl(210,30%,92%)" }}>{group.initial}</div>
              </div>
              <div style={{ padding: "28px 20px 20px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 4 }}>{group.name}</h3>
                <p style={{ fontSize: 13, color: "hsl(215,14%,58%)", marginBottom: 4 }}>👥 {group.members} members · {group.privacy === "Private" ? "🔒" : "🌐"} {group.privacy}</p>
                <p style={{ fontSize: 13, color: "hsl(215,14%,58%)", lineHeight: 1.5, marginBottom: 12 }}>{group.description}</p>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                  {group.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "hsl(215,25%,15%)", color: "hsl(215,14%,58%)", fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={(e) => { e.preventDefault(); setJoined(prev => { const n = new Set(prev); n.has(group.id) ? n.delete(group.id) : n.add(group.id); return n; }); }}
                    style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "Inter, sans-serif", background: joined.has(group.id) ? "hsl(215,25%,15%)" : "hsl(221,83%,53%)", color: joined.has(group.id) ? "hsl(215,14%,58%)" : "white", transition: "all 0.15s" }}>
                    {joined.has(group.id) ? "✓ Joined" : "Join Group"}
                  </button>
                  <Link href={`/groups/${group.id}`}
                    style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid hsl(215,20%,20%)", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "Inter, sans-serif", background: "hsl(215,25%,15%)", color: "hsl(210,30%,92%)", transition: "all 0.15s", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    Open →
                  </Link>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}