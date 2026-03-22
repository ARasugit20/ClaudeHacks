import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { insforge } from "../../lib/supabase";

const LANG_FLAGS = {
  es: "🇲🇽", zh: "🇨🇳", vi: "🇻🇳", tl: "🇵🇭", ar: "🇸🇦",
  hi: "🇮🇳", ko: "🇰🇷", pt: "🇧🇷", fr: "🇫🇷", ht: "🇭🇹",
  so: "🇸🇴", am: "🇪🇹", ru: "🇷🇺", ja: "🇯🇵",
};

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

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [echoed, setEchoed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [showSpanish, setShowSpanish] = useState(false);

  useEffect(() => {
    if (!id) return;
    insforge.database
      .from("posts")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setPost(data);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!post) return;
    const target = Math.min((post.echo_count / 50) * 100, 100);
    const timer = setTimeout(() => setAnimatedProgress(target), 300);
    return () => clearTimeout(timer);
  }, [post]);

  async function handleEcho() {
    if (echoed) return;
    await fetch("/api/echo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPost((p) => ({ ...p, echo_count: p.echo_count + 1 }));
    setEchoed(true);
  }

  function copyLetter() {
    navigator.clipboard.writeText(post.formal_request);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSendEmail() {
    if (sent) return;
    setSending(true);
    setSendError("");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          official_email: post.official_email,
          official_name: post.official_name,
          department: post.department,
          issue_type: post.issue_type,
          formal_request: post.formal_request,
          location: post.location,
          post_id: post.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      setSent(true);
    } catch (err) {
      setSendError(err.message);
    } finally {
      setSending(false);
    }
  }

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

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
        <CivicNav />
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <div className="civic-spinner" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "hsl(215,14%,58%)", fontSize: 14 }}>Loading post...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } } .civic-spinner { width: 32px; height: 32px; border: 3px solid hsl(215,20%,20%); border-top-color: hsl(221,83%,53%); border-radius: 50%; animation: spin 0.8s linear infinite; }`}</style>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
        <CivicNav />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <p style={{ color: "hsl(215,14%,58%)", marginBottom: 16 }}>Post not found.</p>
          <Link href="/" style={{ color: "hsl(221,83%,53%)", textDecoration: "none" }}>← Back to feed</Link>
        </div>
      </div>
    );
  }

  const c = ISSUE_COLORS[post.issue_type] || ISSUE_COLORS.other;
  const echoCount = post.echo_count || 0;
  const hasSpanish = !!post.formal_request_spanish;
  const letterText = showSpanish ? post.formal_request_spanish : post.formal_request;
  const officialLangFlag = post.official_language ? (LANG_FLAGS[post.official_language] || "🏛️") : "🏛️";
  const userLangFlag = post.language ? (LANG_FLAGS[post.language] || "🌐") : "🌐";

  return (
    <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
      <CivicNav />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "hsl(215,14%,58%)", textDecoration: "none", marginBottom: 20 }}>← Back to feed</Link>

        {/* Issue header */}
        <div className="civic-card" style={{ padding: "20px 24px", marginBottom: 12, borderLeft: `4px solid ${c.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span className={`civic-pill ${c.cls}`} style={{ display: "inline-block" }}>{c.label}</span>
            {post.language && post.language !== "en" && LANG_FLAGS[post.language] && (
              <span style={{ fontSize: 16 }}>{LANG_FLAGS[post.language]}</span>
            )}
          </div>
          <p style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.5, color: "hsl(210,30%,92%)", marginBottom: 8 }}>{post.complaint}</p>
          <p style={{ fontSize: 13, color: "hsl(215,14%,58%)" }}>📍 {post.location || "Tempe, AZ"}</p>
        </div>

        {/* Collective Power */}
        <div className="civic-card" style={{ padding: "20px 24px", marginBottom: 12, background: "rgba(34,197,94,0.05)", borderColor: "rgba(34,197,94,0.2)" }}>
          <p style={{ fontSize: 28, fontWeight: 800, color: "hsl(210,30%,92%)", marginBottom: 2 }}>👥 {echoCount} residents</p>
          <p style={{ fontSize: 14, color: "hsl(215,14%,58%)", marginBottom: 12 }}>have raised this same issue</p>

          <div style={{ position: "relative", marginBottom: 8 }}>
            <div className="civic-progress-bar">
              <div className="civic-progress-fill" style={{ width: `${animatedProgress}%`, transition: "width 1s ease" }} />
            </div>
            {/* Milestone ticks */}
            <div style={{ position: "relative", height: 20, marginTop: 4 }}>
              <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                <div style={{ width: 1, height: 6, background: echoCount >= 25 ? "#22c55e" : "hsl(215,20%,20%)", margin: "0 auto" }} />
                <span style={{ fontSize: 10, color: echoCount >= 25 ? "#22c55e" : "hsl(215,14%,58%)" }}>25</span>
              </div>
              <div style={{ position: "absolute", right: 0, textAlign: "center" }}>
                <div style={{ width: 1, height: 6, background: echoCount >= 50 ? "#22c55e" : "hsl(215,20%,20%)", margin: "0 auto" }} />
                <span style={{ fontSize: 10, color: echoCount >= 50 ? "#22c55e" : "hsl(215,14%,58%)" }}>50</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: echoCount >= 50 ? "#22c55e" : "hsl(215,14%,58%)", fontWeight: 500 }}>
            {echoCount >= 50
              ? "🔥 Escalating to City Council"
              : echoCount >= 25
              ? `${50 - echoCount} more voices for City Council escalation`
              : `${25 - echoCount} more voices for department escalation`}
          </p>
        </div>

        {/* Echo button */}
        <button onClick={handleEcho} disabled={echoed}
          style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", cursor: echoed ? "default" : "pointer", fontFamily: "Inter, sans-serif", fontSize: 15, fontWeight: 600, marginBottom: 12, transition: "all 0.2s", background: echoed ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, hsl(221,83%,53%), hsl(263,70%,50%))", color: echoed ? "#22c55e" : "white", borderColor: echoed ? "rgba(34,197,94,0.3)" : "transparent" }}>
          {echoed ? "✓ Your voice has been added" : "👥 Add My Voice to This Issue"}
        </button>

        {/* Official */}
        {post.official_name && (
          <div className="civic-card" style={{ padding: "20px 24px", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 12 }}>📬 This letter goes to</p>
            <div style={{ display: "flex", gap: 12, background: "hsl(216,28%,8%)", borderRadius: 8, padding: 14, border: "1px solid hsl(215,20%,20%)" }}>
              <span style={{ fontSize: 24 }}>🏛️</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(210,30%,92%)", marginBottom: 2 }}>{post.official_name}</p>
                <p style={{ fontSize: 13, color: "hsl(221,83%,53%)", marginBottom: 2 }}>{post.department}</p>
                <p style={{ fontSize: 12, color: "hsl(215,14%,58%)" }}>{post.official_email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Letter */}
        {post.formal_request && (
          <div className="civic-card" style={{ padding: "20px 24px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)" }}>📄 Formal letter (AI-generated)</p>
              {hasSpanish && (
                <div style={{ display: "flex", gap: 4 }}>
                  {[{ val: false, label: `${officialLangFlag} Official` }, { val: true, label: `${userLangFlag} My Language` }].map(opt => (
                    <button key={String(opt.val)} onClick={() => setShowSpanish(opt.val)}
                      style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", border: "1px solid", transition: "all 0.15s", borderColor: showSpanish === opt.val ? "hsl(221,83%,53%)" : "hsl(215,20%,24%)", background: showSpanish === opt.val ? "rgba(37,99,235,0.15)" : "transparent", color: showSpanish === opt.val ? "hsl(221,83%,70%)" : "hsl(215,14%,58%)" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: "hsl(210,30%,92%)", whiteSpace: "pre-wrap" }}>{letterText}</p>
          </div>
        )}

        {/* Actions */}
        <button onClick={copyLetter}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1px solid hsl(215,20%,20%)", cursor: "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 8, background: "hsl(216,28%,10%)", color: copied ? "#22c55e" : "hsl(210,30%,92%)", transition: "all 0.15s" }}>
          {copied ? "✓ Copied!" : "📋 Copy Letter to Send"}
        </button>

        {sendError && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 8, fontSize: 13, color: "#ef4444" }}>
            {sendError}
          </div>
        )}

        <button onClick={handleSendEmail} disabled={sending || sent}
          style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1px solid hsl(215,20%,20%)", cursor: sent ? "default" : "pointer", fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600, marginBottom: 16, background: sent ? "rgba(34,197,94,0.1)" : "hsl(216,28%,10%)", color: sent ? "#22c55e" : sending ? "hsl(215,14%,58%)" : "hsl(210,30%,92%)", transition: "all 0.15s" }}>
          {sent ? "✓ Letter sent to official!" : sending ? "📤 Sending..." : "📧 Send Letter to Official"}
        </button>

        <div style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "hsl(221,83%,70%)", lineHeight: 1.5 }}>
          ⚖️ This letter is AI-generated based on your description. Review before sending. This is not legal advice.
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } .civic-spinner { width: 32px; height: 32px; border: 3px solid hsl(215,20%,20%); border-top-color: hsl(221,83%,53%); border-radius: 50%; animation: spin 0.8s linear infinite; }`}</style>
    </div>
  );
}
