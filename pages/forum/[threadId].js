import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FORUM_THREADS } from "../../lib/forumThreads";

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

export default function ThreadDetailPage() {
  const router = useRouter();
  const { threadId } = router.query;
  const [supported, setSupported] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinedChat, setJoinedChat] = useState(false);
  const [likedMessages, setLikedMessages] = useState({});
  const [openComments, setOpenComments] = useState({});

  const thread = useMemo(
    () => FORUM_THREADS.find((t) => t.id === threadId),
    [threadId]
  );

  const CivicNav = () => (
    <nav className="civic-nav">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" className="civilian-logo"><span className="logo-white">Civil</span><span className="logo-blue">ian</span></Link>
        <div style={{ display: "flex", gap: 4 }}>
          {[{href:"/", label:"Feed"},{href:"/reels", label:"Reels"},{href:"/groups", label:"Groups"},{href:"/profile", label:"Profile"}].map(l => (
            <Link key={l.href} href={l.href} style={{ color: "hsl(215,14%,58%)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8 }}>{l.label}</Link>
          ))}
        </div>
        <Link href="/compose" className="civic-btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Report Issue</Link>
      </div>
    </nav>
  );

  if (!thread) {
    return (
      <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
        <CivicNav />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <p style={{ color: "hsl(215,14%,58%)", marginBottom: 16 }}>Thread not found.</p>
          <Link href="/forum" style={{ color: "hsl(221,83%,53%)", textDecoration: "none" }}>← Back to forum</Link>
        </div>
      </div>
    );
  }

  const typeInfo = TYPE_LABELS[thread.issueType] || TYPE_LABELS.other;
  const supportCount = supported ? thread.support + 1 : thread.support;
  const threadDiscussions = {
    "maple-stop-sign": [
      {
        id: "m1",
        name: "Priya K",
        role: "Parent volunteer",
        time: "2h ago",
        message:
          "I counted 11 cars running through during 8:05-8:20 AM. I can upload a short log if it helps the petition packet.",
        likes: 18,
        comments: [
          "Please add timestamps too, the mobility office asked for exact windows.",
          "I can co-sign your observation log for Tuesday drop-off.",
        ],
      },
      {
        id: "m2",
        name: "Sam Ortiz",
        role: "Resident",
        time: "1h ago",
        message:
          "Can we organize 6-8 neighbors to attend the Thursday hearing together? A bigger turnout may push this up the agenda.",
        likes: 23,
        comments: [
          "I can attend and bring printed signatures.",
          "Count me in, I can speak during public comment.",
        ],
      },
    ],
    "greenbelt-lighting": [
      {
        id: "g1",
        name: "Nina Shah",
        role: "Runner",
        time: "3h ago",
        message:
          "Lamp near the north entrance is fully out. I posted a photo in the 311 report and linked this thread number.",
        likes: 11,
        comments: [
          "Thanks, this helps Public Works route the ticket faster.",
          "Could you also mark the pole number if visible?",
        ],
      },
      {
        id: "g2",
        name: "Leo Martinez",
        role: "Neighborhood watch",
        time: "58m ago",
        message:
          "Let us do a quick evening walk audit Sunday 7 PM and submit one shared map of all dark spots.",
        likes: 16,
        comments: [
          "Great idea, we can pin each location in one doc.",
          "I will bring reflective vests for volunteers.",
        ],
      },
    ],
    "mobility-office-update": [
      {
        id: "o1",
        name: "Ari Bennett",
        role: "Community organizer",
        time: "1h ago",
        message:
          "Since the study is open, we should gather peak-hour evidence this week and post it as one community brief.",
        likes: 29,
        comments: [
          "I can format a shared spreadsheet for observations.",
          "Please include school release time, that is when speeding spikes.",
        ],
      },
      {
        id: "o2",
        name: "Dana Lewis",
        role: "Resident",
        time: "36m ago",
        message:
          "Would anyone like to coordinate a short explainer for neighbors so more people understand the council timeline?",
        likes: 14,
        comments: [
          "Yes, a simple one-pager in plain language would help.",
          "I can draft and post for feedback by tonight.",
        ],
      },
    ],
  }[thread.id] || [];

  function toggleMessageLike(messageId) {
    setLikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  }

  function toggleComments(messageId) {
    setOpenComments((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
  }

  return (
    <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
      <CivicNav />
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
        <Link href="/forum" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "hsl(215,14%,58%)", textDecoration: "none", marginBottom: 20 }}>← Back to forum</Link>

        <div className="civic-card" style={{ padding: "20px 24px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(210,30%,92%)" }}>{thread.name}</p>
              <p style={{ fontSize: 12, color: "hsl(215,14%,58%)" }}>{thread.role}</p>
            </div>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(37,99,235,0.15)", color: "hsl(221,83%,70%)", fontWeight: 600 }}>{thread.badge}</span>
          </div>

          <span className={`civic-pill civic-pill-${thread.issueType === "traffic_safety" ? "traffic" : thread.issueType === "street_lighting" ? "lighting" : thread.issueType === "road_maintenance" ? "roads" : thread.issueType === "parks_facilities" ? "parks" : "other"}`} style={{ marginBottom: 12, display: "inline-block" }}>{thread.issueType?.replace(/_/g, " ")}</span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 12, lineHeight: 1.3 }}>{thread.issueTitle}</h1>
          <p style={{ fontSize: 15, color: "hsl(210,30%,92%)", lineHeight: 1.6, marginBottom: 12 }}>{thread.text}</p>

          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "hsl(215,14%,58%)" }}>📍 {thread.location}</span>
            <span style={{ fontSize: 13, color: "hsl(215,14%,58%)" }}>👥 {supportCount} supporters</span>
          </div>
          <p style={{ fontSize: 13, color: "hsl(221,83%,70%)", fontStyle: "italic" }}>{thread.status}</p>
        </div>

        <div className="civic-card" style={{ padding: "20px 24px", marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 8 }}>Why this matters</p>
          <p style={{ fontSize: 14, color: "hsl(210,30%,92%)", lineHeight: 1.6, marginBottom: 16 }}>{thread.whyItMatters}</p>

          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 8 }}>How to participate</p>
          <div style={{ marginBottom: 16 }}>
            {thread.howToParticipate.map((step) => (
              <div key={step} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <span style={{ color: "hsl(221,83%,53%)", flexShrink: 0 }}>•</span>
                <p style={{ fontSize: 14, color: "hsl(210,30%,92%)", lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 8 }}>Government pathway</p>
          <p style={{ fontSize: 14, color: "hsl(215,14%,58%)", lineHeight: 1.6, marginBottom: 20 }}>{thread.governmentPath}</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setSupported((s) => !s)}
              style={{ flex: 1, minWidth: 160, padding: "10px 16px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, background: supported ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, hsl(221,83%,53%), hsl(263,70%,50%))", color: supported ? "#22c55e" : "white", transition: "all 0.2s" }}>
              {supported ? "✓ You support this issue" : "👥 Support this issue"}
            </button>
            <button onClick={() => setJoined((j) => !j)}
              style={{ flex: 1, minWidth: 160, padding: "10px 16px", borderRadius: 8, border: "1px solid hsl(215,20%,20%)", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, background: "hsl(216,28%,10%)", color: joined ? "#22c55e" : "hsl(210,30%,92%)", transition: "all 0.2s" }}>
              {joined ? "✓ Joined volunteer updates" : "📬 Join volunteer updates"}
            </button>
            <button onClick={() => setJoinedChat((c) => !c)}
              style={{ flex: 1, minWidth: 160, padding: "10px 16px", borderRadius: 8, border: "1px solid hsl(215,20%,20%)", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 13, fontWeight: 600, background: "hsl(216,28%,10%)", color: joinedChat ? "#22c55e" : "hsl(210,30%,92%)", transition: "all 0.2s" }}>
              {joinedChat ? "✓ Joined community chat" : "💬 Join community chat group"}
            </button>
          </div>
        </div>

        <div className="civic-card" style={{ padding: "20px 24px", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 4 }}>Community discussion</p>
              <p style={{ fontSize: 13, color: "hsl(215,14%,58%)" }}>Residents coordinating evidence and planning attendance.</p>
            </div>
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(37,99,235,0.15)", color: "hsl(221,83%,70%)", fontWeight: 600 }}>{joinedChat ? "Joined chat" : "Public group"}</span>
          </div>

          {threadDiscussions.map((message) => {
            const isLiked = Boolean(likedMessages[message.id]);
            const showComments = Boolean(openComments[message.id]);
            return (
              <div key={message.id} style={{ background: "hsl(216,28%,8%)", borderRadius: 8, padding: "14px 16px", marginBottom: 10, border: "1px solid hsl(215,20%,20%)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(210,30%,92%)" }}>{message.name}</span>
                    <span style={{ fontSize: 12, color: "hsl(215,14%,58%)", marginLeft: 8 }}>{message.role}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "hsl(215,14%,58%)" }}>{message.time}</span>
                </div>
                <p style={{ fontSize: 14, color: "hsl(210,30%,92%)", lineHeight: 1.5, marginBottom: 10 }}>{message.message}</p>
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => toggleMessageLike(message.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: isLiked ? "#22c55e" : "hsl(215,14%,58%)", fontFamily: "Inter, sans-serif", fontWeight: isLiked ? 600 : 400 }}>
                    👍 {isLiked ? message.likes + 1 : message.likes}
                  </button>
                  <button onClick={() => toggleComments(message.id)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: showComments ? "hsl(221,83%,53%)" : "hsl(215,14%,58%)", fontFamily: "Inter, sans-serif" }}>
                    💬 {message.comments.length} comments
                  </button>
                </div>
                {showComments && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid hsl(215,20%,20%)" }}>
                    {message.comments.map((comment) => (
                      <p key={comment} style={{ fontSize: 13, color: "hsl(215,14%,58%)", marginBottom: 6, paddingLeft: 12, borderLeft: "2px solid hsl(215,20%,20%)" }}>• {comment}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
