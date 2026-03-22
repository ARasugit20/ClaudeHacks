import { useState } from "react";
import Link from "next/link";

const DEMO_ISSUES = [
  { id: "demo-1", issue_type: "traffic_safety", complaint: "The crosswalk at Mill Ave and University Dr needs better lighting. My kids walk to school and it's terrifying in winter mornings.", location: "Mill Ave & University Dr", echo_count: 34 },
  { id: "demo-2", issue_type: "street_lighting", complaint: "Three streetlights on Rural Road have been out for over a month. It's affecting foot traffic to my shop after dark.", location: "Rural Road near Library", echo_count: 22 },
];

const ISSUE_COLORS = {
  traffic_safety: { label: "Traffic Safety", border: "#f59e0b" },
  street_lighting: { label: "Lighting", border: "#6366f1" },
  road_maintenance: { label: "Roads", border: "#8b5cf6" },
  parks_facilities: { label: "Parks", border: "#22c55e" },
  other: { label: "Community", border: "#94a3b8" },
};

function EditProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({ ...profile });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="civic-card" style={{ width: "100%", maxWidth: 480, padding: 28, position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "hsl(215,14%,58%)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>✕</button>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 20 }}>Edit Profile</h3>

        {[
          { label: "Display Name", key: "name", type: "text", placeholder: "Your name" },
          { label: "Location", key: "location", type: "text", placeholder: "City, State" },
          { label: "Bio", key: "bio", type: "textarea", placeholder: "Tell your community about yourself..." },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "hsl(215,14%,58%)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
            {type === "textarea" ? (
              <textarea value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder} rows={3}
                style={{ width: "100%", padding: "10px 12px", background: "hsl(216,28%,7%)", border: "1px solid hsl(215,20%,20%)", borderRadius: 8, color: "hsl(210,30%,92%)", fontSize: 14, fontFamily: "Inter, sans-serif", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            ) : (
              <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                style={{ width: "100%", padding: "10px 12px", background: "hsl(216,28%,7%)", border: "1px solid hsl(215,20%,20%)", borderRadius: 8, color: "hsl(210,30%,92%)", fontSize: 14, fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }} />
            )}
          </div>
        ))}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: "10px", borderRadius: 8, background: "hsl(215,25%,15%)", border: "1px solid hsl(215,20%,20%)", color: "hsl(215,14%,58%)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            Cancel
          </button>
          <button onClick={() => { onSave(form); onClose(); }}
            style={{ flex: 2, padding: "10px", borderRadius: 8, background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(263,70%,50%))", border: "none", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("issues");
  const [editOpen, setEditOpen] = useState(false);
  const [profile, setProfile] = useState({ name: "Anonymous Resident", location: "Tempe, AZ", bio: "Local resident making my community better" });

  const initials = profile.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
      {editOpen && <EditProfileModal profile={profile} onSave={setProfile} onClose={() => setEditOpen(false)} />}

      <nav className="civic-nav">
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="civilian-logo"><span className="logo-white">Civil</span><span className="logo-blue">ian</span></Link>
          <div style={{ display: "flex", gap: 8 }}>
            {[{href:"/", label:"Feed"},{href:"/reels", label:"Reels"},{href:"/groups", label:"Groups"},{href:"/profile", label:"Profile"}].map(l => (
              <Link key={l.href} href={l.href} style={{ color: l.href==="/profile" ? "hsl(221,83%,53%)" : "hsl(215,14%,58%)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8 }}>{l.label}</Link>
            ))}
          </div>
          <Link href="/compose" className="civic-btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Report Issue</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
        {/* Cover + Avatar */}
        <div className="civic-card" style={{ overflow: "hidden", marginBottom: 16 }}>
          <div style={{ height: 180, background: "linear-gradient(135deg, hsl(221,83%,53%), hsl(263,70%,50%))" }} />
          <div style={{ padding: "0 24px 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginTop: -28, marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "hsl(221,83%,53%)", border: "4px solid hsl(216,28%,10%)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: "white", flexShrink: 0 }}>{initials}</div>
              <div style={{ flex: 1, paddingBottom: 4 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 2 }}>{profile.name}</h2>
                <p style={{ fontSize: 14, color: "hsl(215,14%,58%)" }}>📍 {profile.location}</p>
              </div>
              <button onClick={() => setEditOpen(true)}
                style={{ padding: "8px 20px", borderRadius: 8, background: "hsl(215,25%,15%)", border: "1px solid hsl(215,20%,20%)", color: "hsl(210,30%,92%)", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                ✏️ Edit Profile
              </button>
            </div>
            <p style={{ fontSize: 14, color: "hsl(215,14%,58%)", marginBottom: 16 }}>{profile.bio}</p>
            <div style={{ display: "flex", gap: 24 }}>
              {[{val: 12, label: "Issues Raised"},{val: 47, label: "Voices Given"},{val: 3, label: "Groups Joined"}].map(s => (
                <div key={s.label}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "hsl(210,30%,92%)" }}>{s.val}</span>
                  <span style={{ fontSize: 13, color: "hsl(215,14%,58%)", marginLeft: 6 }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid hsl(215,20%,20%)", marginBottom: 20 }}>
          {[{key:"issues", label:"My Issues"},{key:"echoed", label:"Echoed"},{key:"resolved", label:"Resolved"}].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ padding: "10px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "Inter, sans-serif", color: activeTab === tab.key ? "hsl(221,83%,53%)" : "hsl(215,14%,58%)", borderBottom: activeTab === tab.key ? "2px solid hsl(221,83%,53%)" : "2px solid transparent", marginBottom: -1, transition: "all 0.15s" }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Issues */}
        {activeTab === "issues" && DEMO_ISSUES.map(post => {
          const c = ISSUE_COLORS[post.issue_type] || ISSUE_COLORS.other;
          return (
            <div key={post.id} className="civic-card" style={{ padding: "16px 20px", marginBottom: 12, borderLeft: `4px solid ${c.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.border }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: c.border, textTransform: "uppercase", letterSpacing: 0.5 }}>{c.label}</span>
              </div>
              <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(210,30%,92%)", lineHeight: 1.5, marginBottom: 10 }}>{post.complaint}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 16 }}>
                  <span style={{ fontSize: 12, color: "hsl(215,14%,58%)" }}>👥 {post.echo_count}</span>
                  <span style={{ fontSize: 12, color: "hsl(215,14%,58%)" }}>💬 0</span>
                </div>
                <span style={{ fontSize: 12, color: "hsl(215,14%,58%)" }}>📍 {post.location}</span>
              </div>
            </div>
          );
        })}

        {activeTab === "echoed" && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "hsl(215,14%,58%)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <p style={{ fontSize: 15, color: "hsl(210,30%,92%)", marginBottom: 6 }}>No echoed issues yet</p>
            <p style={{ fontSize: 13 }}>Issues you voice will appear here</p>
          </div>
        )}

        {activeTab === "resolved" && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "hsl(215,14%,58%)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <p style={{ fontSize: 15, color: "hsl(210,30%,92%)", marginBottom: 6 }}>No resolved issues yet</p>
            <p style={{ fontSize: 13 }}>Issues that get resolved will show up here</p>
          </div>
        )}
      </div>
    </div>
  );
}
