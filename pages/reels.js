import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const ISSUE_COLORS = {
  traffic_safety: { label: "Traffic Safety", cls: "civic-pill-traffic", border: "#f59e0b" },
  street_lighting: { label: "Lighting", cls: "civic-pill-lighting", border: "#6366f1" },
  road_maintenance: { label: "Roads", cls: "civic-pill-roads", border: "#8b5cf6" },
  parks_facilities: { label: "Parks", cls: "civic-pill-parks", border: "#22c55e" },
  other: { label: "Community", cls: "civic-pill-other", border: "#94a3b8" },
};

const DEMO_REELS = [
  { id: "reel-1", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", issueType: "traffic_safety", complaint: "The crosswalk at Mill Ave and University Dr needs better lighting. My kids walk to school and it's terrifying in winter mornings.", location: "Mill Ave & University Dr", echoCount: 34, poster: "Maria S." },
  { id: "reel-2", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", issueType: "street_lighting", complaint: "Three streetlights on Rural Road have been out for over a month. It's affecting foot traffic to my shop after dark.", location: "Rural Road near Library", echoCount: 22, poster: "James T." },
  { id: "reel-3", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600", issueType: "parks_facilities", complaint: "Kiwanis Park desperately needs shade structures. The playground equipment gets dangerously hot in summer — measured 160°F on the slide.", location: "Kiwanis Park", echoCount: 48, poster: "Chen W." },
  { id: "reel-4", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600", issueType: "road_maintenance", complaint: "The pothole on Apache Blvd near the 101 overpass has damaged at least 12 cars this month. We need emergency repair.", location: "Apache Blvd & 101", echoCount: 56, poster: "Patricia M." },
];

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [echoed, setEchoed] = useState(new Set());
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const newIndex = Math.round(container.scrollTop / container.clientHeight);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < DEMO_REELS.length) setCurrentIndex(newIndex);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#000" }}>
      {/* NAV */}
      <nav className="civic-nav" style={{ flexShrink: 0 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="civilian-logo"><span className="logo-white">Civil</span><span className="logo-blue">ian</span></Link>
          <div style={{ display: "flex", gap: 8 }}>
            {[{href:"/", label:"Feed"},{href:"/reels", label:"Reels"},{href:"/groups", label:"Groups"},{href:"/profile", label:"Profile"}].map(l => (
              <Link key={l.href} href={l.href} style={{ color: l.href==="/reels" ? "hsl(221,83%,53%)" : "hsl(215,14%,58%)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8 }}>{l.label}</Link>
            ))}
          </div>
          <Link href="/compose" className="civic-btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Report Issue</Link>
        </div>
      </nav>

      <div ref={containerRef} style={{ flex: 1, overflowY: "auto", scrollSnapType: "y mandatory" }}>
        {DEMO_REELS.map((reel, i) => {
          const c = ISSUE_COLORS[reel.issueType] || ISSUE_COLORS.other;
          const isEchoed = echoed.has(reel.id);
          return (
            <div key={reel.id} style={{ height: "calc(100vh - 60px)", width: "100%", position: "relative", scrollSnapAlign: "start", scrollSnapStop: "always" }}>
              <img src={reel.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 40%, transparent 50%, rgba(0,0,0,0.85))", zIndex: 1 }} />

              {/* Top badge */}
              <div style={{ position: "absolute", top: 24, left: 24, zIndex: 2 }}>
                <span className={`civic-pill ${c.cls}`} style={{ fontSize: 12, padding: "4px 14px" }}>{c.label}</span>
              </div>

              {/* Right actions */}
              <div style={{ position: "absolute", right: 20, bottom: 160, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
                <button onClick={() => setEchoed(prev => new Set(prev).add(reel.id))} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: isEchoed ? "hsl(142,71%,45%)" : "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👍</div>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>{reel.echoCount + (isEchoed ? 1 : 0)}</span>
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>💬</div>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>12</span>
                </button>
                <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>↑</div>
                  <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>Share</span>
                </button>
              </div>

              {/* Bottom content */}
              <div style={{ position: "absolute", bottom: 32, left: 24, right: 96, zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>{reel.poster[0]}</div>
                  <span style={{ color: "white", fontWeight: 600, fontSize: 14 }}>{reel.poster}</span>
                </div>
                <p style={{ color: "white", fontSize: 14, lineHeight: 1.5, marginBottom: 8, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>{reel.complaint}</p>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 16 }}>📍 {reel.location}</p>
                <Link href="/compose" className="civic-btn-primary" style={{ fontSize: 14, padding: "10px 20px" }}>Add My Voice</Link>
              </div>

              {/* Progress dots */}
              <div style={{ position: "absolute", top: 24, right: 24, zIndex: 2, display: "flex", flexDirection: "column", gap: 6 }}>
                {DEMO_REELS.map((_, di) => (
                  <div key={di} style={{ width: 6, borderRadius: 3, background: di === currentIndex ? "white" : "rgba(255,255,255,0.3)", height: di === currentIndex ? 20 : 6, transition: "all 0.3s" }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Link href="/compose" className="civic-btn-primary" style={{ position: "fixed", bottom: 32, right: 32, zIndex: 50, padding: "12px 20px", fontSize: 14 }}>+ Share a Reel</Link>
    </div>
  );
}