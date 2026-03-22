import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const LOADING_STEPS = [
  { text: "Reading your complaint...", color: "#6366f1" },
  { text: "Searching city website...", color: "#f59e0b" },
  { text: "Finding the right official...", color: "#2563eb" },
  { text: "Checking city ordinances...", color: "#8b5cf6" },
  { text: "Writing your formal letter...", color: "#22c55e" },
  { text: "Almost done...", color: "#06b6d4" },
];

const STEP_ICONS = [
  () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="38" stroke="#6366f1" strokeWidth="3" strokeDasharray="8 4" style={{ animation: "spin 3s linear infinite" }} />
      <rect x="24" y="28" width="32" height="4" rx="2" fill="#6366f1" opacity="0.3" />
      <rect x="24" y="36" width="28" height="4" rx="2" fill="#6366f1" opacity="0.5" />
      <rect x="24" y="44" width="20" height="4" rx="2" fill="#6366f1" opacity="0.7" />
      <rect x="24" y="52" width="14" height="4" rx="2" fill="#6366f1" style={{ animation: "blink 1s ease-in-out infinite" }} />
    </svg>
  ),
  () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="34" cy="34" r="16" stroke="#f59e0b" strokeWidth="3" fill="none" style={{ animation: "pulse 1.2s ease-in-out infinite" }} />
      <line x1="46" y1="46" x2="58" y2="58" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <circle cx="34" cy="34" r="8" fill="#fef3c7" style={{ animation: "pulse 1.2s ease-in-out infinite" }} />
    </svg>
  ),
  () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="20" y="40" width="40" height="20" fill="#bfdbfe" />
      <rect x="26" y="32" width="28" height="10" fill="#93c5fd" />
      <rect x="34" y="20" width="12" height="14" fill="#60a5fa" />
      <rect x="26" y="44" width="6" height="16" fill="#2563eb" style={{ animation: "blink 0.8s ease-in-out infinite" }} />
      <rect x="36" y="44" width="8" height="16" fill="#3b82f6" />
      <rect x="48" y="44" width="6" height="16" fill="#2563eb" style={{ animation: "blink 0.8s ease-in-out 0.4s infinite" }} />
    </svg>
  ),
  () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <line x1="40" y1="20" x2="40" y2="60" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="20" y1="28" x2="60" y2="28" stroke="#8b5cf6" strokeWidth="2" />
      <circle cx="20" cy="40" r="8" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" style={{ animation: "sway 2s ease-in-out infinite" }} />
      <circle cx="60" cy="36" r="8" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2" style={{ animation: "sway 2s ease-in-out infinite reverse" }} />
    </svg>
  ),
  () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <rect x="18" y="30" width="44" height="32" rx="4" fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
      <rect x="24" y="38" width="20" height="3" rx="1.5" fill="#22c55e" opacity="0.4" style={{ animation: "grow 2s ease-in-out infinite" }} />
      <rect x="24" y="44" width="30" height="3" rx="1.5" fill="#22c55e" opacity="0.6" style={{ animation: "grow 2s ease-in-out 0.3s infinite" }} />
      <rect x="24" y="50" width="16" height="3" rx="1.5" fill="#22c55e" style={{ animation: "grow 2s ease-in-out 0.6s infinite" }} />
      <path d="M52 18 L60 26 L44 42 L36 42 L36 34 Z" fill="#16a34a" style={{ animation: "write 1.5s ease-in-out infinite" }} />
    </svg>
  ),
  () => (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="30" fill="#dcfce7" stroke="#22c55e" strokeWidth="3" style={{ animation: "pulse 1s ease-in-out infinite" }} />
      <polyline points="26,40 36,50 54,30" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  ),
];

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇲🇽" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "vi", label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "tl", label: "Filipino", flag: "🇵🇭" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ht", label: "Kreyòl Ayisyen", flag: "🇭🇹" },
  { code: "so", label: "Soomaali", flag: "🇸🇴" },
  { code: "am", label: "አማርኛ", flag: "🇪🇹" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

const EXAMPLES_EN = [
  { label: "🔦 Broken streetlight", text: "There's a broken streetlight on Rural Road near the library. It's been out for 3 weeks and it's dangerous at night." },
  { label: "🚸 Unsafe crosswalk", text: "The crosswalk markings at Mill Ave and University are completely faded. Kids nearly get hit every morning walking to school." },
  { label: "🌳 Park needs shade", text: "McClintock Park has no shade structures. In summer it's over 140°F and kids can't play there at all." },
  { label: "🕳️ Pothole damage", text: "There's a massive pothole on Apache Blvd that damaged my tire. It's been there for months and nobody has fixed it." },
];

const NAV_LINKS = [
  { href: "/", label: "Feed" },
  { href: "/reels", label: "Reels" },
  { href: "/groups", label: "Groups" },
  { href: "/profile", label: "Profile" },
];

function CivicNav() {
  return (
    <nav className="civic-nav">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" className="civilian-logo"><span className="logo-white">Civil</span><span className="logo-blue">ian</span></Link>
        <div style={{ display: "flex", gap: 4 }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} style={{ color: "hsl(215,14%,58%)", textDecoration: "none", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8 }}>{l.label}</Link>
          ))}
        </div>
        <Link href="/compose" className="civic-btn-primary" style={{ padding: "10px 20px", fontSize: 14 }}>Report Issue</Link>
      </div>
    </nav>
  );
}

export default function Compose() {
  const router = useRouter();
  const [complaint, setComplaint] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("en");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [moderationState, setModerationState] = useState(null);
  const [showSpanish, setShowSpanish] = useState(false);
  const [editedLetter, setEditedLetter] = useState("");
  const [translatedLetter, setTranslatedLetter] = useState("");
  const [showTranslation, setShowTranslation] = useState(false);
  const [translating, setTranslating] = useState(false);
  const fileRef = useRef(null);

  const EXAMPLES = EXAMPLES_EN;
  const selectedLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  useEffect(() => {
    if (step !== "analyzing") return;
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [step]);

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit() {
    if (!complaint.trim()) return;
    setLoading(true);
    setStep("analyzing");
    setError("");
    setModerationState(null);

    const sessionId = typeof window !== "undefined"
      ? localStorage.getItem("civic_session_id") || "anonymous"
      : "anonymous";

    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-session-id": sessionId,
        },
        body: JSON.stringify({
          complaint,
          location: location || "Tempe, Arizona",
          session_id: sessionId,
          language,
        }),
      });

      if (!analyzeRes.ok) throw new Error("Analysis failed");
      const analyzed = await analyzeRes.json();

      // Handle moderation block
      if (analyzed.blocked) {
        setLoading(false);
        setStep("form");
        setModerationState({
          type: analyzed.account_status === "suspended" ? "suspended" : analyzed.severity,
          reason: analyzed.reason,
          rewrite: analyzed.suggested_rewrite,
          warnings: analyzed.warnings_count || 0,
          strikes: analyzed.strikes_count || 0,
        });
        if (analyzed.severity === "warning" && analyzed.suggested_rewrite) {
          setComplaint(analyzed.suggested_rewrite);
        }
        return;
      }

      // Go to edit step — do NOT save yet
      setResult(analyzed);
      setEditedLetter(analyzed.formal_request || "");
      setTranslatedLetter("");
      setShowTranslation(false);
      setStep("edit");
    } catch (err) {
      setError("Something went wrong. Check your API key and try again.");
      setStep("form");
    } finally {
      setLoading(false);
    }
  }

  async function handleTranslate() {
    const officialLang = result?.official_language || "en";
    if (!editedLetter || !officialLang) return;
    setTranslating(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editedLetter, targetLanguage: officialLang }),
      });
      const data = await res.json();
      if (data.translation) {
        setTranslatedLetter(data.translation);
        setShowTranslation(true);
      }
    } catch (e) {
      console.error("Translation failed:", e);
    } finally {
      setTranslating(false);
    }
  }

  async function handleFinalSubmit() {
    setLoading(true);
    const officialLang = result?.official_language || "en";
    const userLang = result?.language || language;
    const needsTranslation = officialLang !== userLang;

    try {
      // Auto-translate if languages differ and user hasn't translated yet
      let finalOfficialLetter = editedLetter;
      let userLangLetter = null;

      if (needsTranslation) {
        const letterToSend = translatedLetter || null;
        if (!letterToSend) {
          // Auto-translate on submit
          const tRes = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: editedLetter, targetLanguage: officialLang }),
          });
          const tData = await tRes.json();
          finalOfficialLetter = tData.translation || editedLetter;
        } else {
          finalOfficialLetter = letterToSend;
        }
        userLangLetter = editedLetter; // user's edited version stored as reference
      }

      const saveRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint,
          formal_request: finalOfficialLetter,       // official language — what gets sent
          formal_request_spanish: userLangLetter,    // user's language — reference copy
          department: result.department,
          official_name: result.official_name,
          official_email: result.official_email,
          issue_type: result.issue_type,
          location: result.location_extracted || location || "Tempe, AZ",
          language: userLang,
          official_language: officialLang,
        }),
      });
      if (!saveRes.ok) throw new Error("Save failed");
      const saved = await saveRes.json();
      setResult(prev => ({ ...prev, id: saved.id, merged: saved.merged, merge_reason: saved.merge_reason, echo_count: saved.echo_count }));
      setStep("done");
    } catch (err) {
      setError("Something went wrong saving your post.");
      setStep("edit");
    } finally {
      setLoading(false);
    }
  }

  // ANALYZING STATE
  if (step === "analyzing") {
    const current = LOADING_STEPS[loadingStep];
    const Icon = STEP_ICONS[loadingStep];
    return (
      <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
        <CivicNav />
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}><Icon /></div>
          <p style={{ fontSize: 20, fontWeight: 600, color: current.color, marginBottom: 6 }}>{current.text}</p>
          <p style={{ fontSize: 13, color: "hsl(215,14%,58%)", marginBottom: 32 }}>AI is searching the web for real officials and city ordinances</p>
          <div style={{ maxWidth: 400, margin: "0 auto 32px" }}>
            <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
              {LOADING_STEPS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= loadingStep ? current.color : "hsl(215,20%,20%)", transition: "background 0.4s" }} />
              ))}
            </div>
            <p style={{ fontSize: 11, color: "hsl(215,14%,40%)" }}>Step {loadingStep + 1} of {LOADING_STEPS.length}</p>
          </div>
          <div style={{ maxWidth: 320, margin: "0 auto", textAlign: "left" }}>
            {LOADING_STEPS.slice(0, loadingStep + 1).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, marginBottom: 6, color: i < loadingStep ? "#22c55e" : current.color, fontWeight: i === loadingStep ? 600 : 400 }}>
                <span>{i < loadingStep ? "✓" : "→"}</span>{s.text}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.7; transform:scale(1.08); } }
          @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
          @keyframes sway { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
          @keyframes grow { 0% { clip-path:inset(0 100% 0 0); } 100% { clip-path:inset(0 0% 0 0); } }
          @keyframes write { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-4px,4px); } }
        `}</style>
      </div>
    );
  }

  // EDIT STEP
  if (step === "edit" && result) {
    const officialLangCode = result.official_language || "en";
    const officialLangObj = LANGUAGES.find(l => l.code === officialLangCode);
    const officialLangName = officialLangObj ? `${officialLangObj.flag} ${officialLangObj.label}` : officialLangCode.toUpperCase();
    const needsTranslation = (result.language || language) !== officialLangCode;

    return (
      <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
        <CivicNav />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: 13, color: "hsl(215,14%,58%)" }}>
            <span style={{ color: "#22c55e", fontWeight: 600 }}>✓ Analyzed</span>
            <span>→</span>
            <span style={{ color: "hsl(221,83%,70%)", fontWeight: 600 }}>✏️ Edit Letter</span>
            <span>→</span>
            <span>Submit</span>
          </div>

          {/* Complaint + official summary */}
          <div className="civic-card" style={{ padding: "16px 20px", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 10 }}>📋 Your complaint</p>
            <p style={{ fontSize: 14, color: "hsl(210,30%,92%)", lineHeight: 1.6, marginBottom: 12 }}>{complaint}</p>
            <div style={{ display: "flex", gap: 10, background: "hsl(216,28%,8%)", borderRadius: 8, padding: "10px 14px", border: "1px solid hsl(215,20%,20%)" }}>
              <span style={{ fontSize: 20 }}>🏛️</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(210,30%,92%)", margin: 0 }}>{result.official_name}</p>
                <p style={{ fontSize: 12, color: "hsl(221,83%,53%)", margin: "2px 0 0" }}>{result.department} · {result.official_email}</p>
              </div>
            </div>
          </div>

          {/* Editable letter */}
          <div className="civic-card" style={{ padding: "16px 20px", marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 4 }}>📄 Your formal letter — edit freely before sending</p>
            <p style={{ fontSize: 12, color: "hsl(215,14%,48%)", marginBottom: 12 }}>AI drafted this based on your complaint. Change any wording you are not comfortable with.</p>
            <textarea
              value={editedLetter}
              onChange={e => setEditedLetter(e.target.value)}
              rows={12}
              style={{ width: "100%", border: "1px solid hsl(215,20%,20%)", borderRadius: 8, padding: 14, fontFamily: "Inter, sans-serif", fontSize: 14, color: "hsl(210,30%,92%)", background: "hsl(216,28%,8%)", resize: "vertical", outline: "none", lineHeight: 1.7, transition: "border-color 0.15s" }}
              onFocus={e => e.target.style.borderColor = "hsl(221,83%,53%)"}
              onBlur={e => e.target.style.borderColor = "hsl(215,20%,20%)"}
            />
            <p style={{ fontSize: 11, color: "hsl(215,14%,40%)", marginTop: 6, textAlign: "right" }}>{editedLetter.length} characters</p>

            {/* Translate button — only shown when official language differs from user's language */}
            {needsTranslation && (
              <button onClick={handleTranslate} disabled={translating}
                style={{ marginTop: 10, padding: "9px 16px", borderRadius: 8, border: "1px solid hsl(221,83%,40%)", background: "rgba(37,99,235,0.08)", color: translating ? "hsl(215,14%,40%)" : "hsl(221,83%,70%)", fontSize: 13, fontWeight: 600, cursor: translating ? "default" : "pointer", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s" }}>
                {translating
                  ? <><span style={{ width: 12, height: 12, border: "2px solid hsl(215,20%,30%)", borderTopColor: "hsl(221,83%,53%)", borderRadius: "50%", animation: "spin 0.7s linear infinite", display: "inline-block" }} /> Translating...</>
                  : `📨 Translate to ${officialLangName} — this gets sent to the official`}
              </button>
            )}
          </div>

          {/* Translated version — what actually gets sent */}
          {showTranslation && translatedLetter && (
            <div className="civic-card" style={{ padding: "16px 20px", marginBottom: 12, borderColor: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#22c55e", margin: 0 }}>📨 What gets sent to {result.official_name}</p>
                <span style={{ fontSize: 11, color: "hsl(215,14%,48%)", background: "hsl(216,28%,12%)", padding: "2px 8px", borderRadius: 99 }}>{officialLangName}</span>
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: "hsl(210,30%,92%)", whiteSpace: "pre-wrap", margin: 0 }}>{translatedLetter}</p>
            </div>
          )}

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 14px", marginBottom: 12, fontSize: 14, color: "#ef4444" }}>
              {error}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setStep("form"); setResult(null); setEditedLetter(""); setError(""); }}
              style={{ flex: 1, padding: "13px", borderRadius: 10, border: "1px solid hsl(215,20%,24%)", background: "transparent", color: "hsl(215,14%,70%)", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}>
              ← Edit complaint
            </button>
            <button onClick={handleFinalSubmit} disabled={loading || !editedLetter.trim()}
              style={{ flex: 2, padding: "13px", borderRadius: 10, border: "none", background: loading ? "hsl(215,20%,20%)" : "linear-gradient(135deg, hsl(221,83%,53%), hsl(263,70%,50%))", color: loading ? "hsl(215,14%,50%)" : "white", fontSize: 14, fontWeight: 600, cursor: loading ? "default" : "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}>
              {loading ? "Saving..." : "Submit & Post Issue →"}
            </button>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // DONE STATE — MERGED
  if (step === "done" && result?.merged) {
    return (
      <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
        <CivicNav />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>
          <div className="civic-card" style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔗</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 8 }}>
              Your voice was added to an existing issue
            </p>
            <p style={{ fontSize: 14, color: "hsl(215,14%,58%)", lineHeight: 1.6, marginBottom: 20 }}>
              {result.merge_reason}
            </p>
            <p style={{ fontSize: 40, fontWeight: 800, color: "#6366f1", lineHeight: 1, marginBottom: 4 }}>
              {result.echo_count}
            </p>
            <p style={{ fontSize: 14, color: "hsl(215,14%,58%)", marginBottom: 24 }}>
              people are now raising this issue together
            </p>
            <button className="civic-btn-primary"
              onClick={() => router.push(`/post/${result.id}`)}
              style={{ padding: "12px 32px", fontSize: 15, borderRadius: 999 }}>
              See the collective issue →
            </button>
          </div>
          <Link href="/" style={{ display: "block", textAlign: "center", fontSize: 14, color: "hsl(215,14%,58%)", textDecoration: "none", marginTop: 16 }}>← Back to feed</Link>
        </div>
      </div>
    );
  }

  // DONE STATE — NORMAL
  if (step === "done" && result) {
    const officialLang = result.official_language || "en";
    const userLang = result.language || "en";
    const hasTranslation = userLang !== officialLang && !!result.formal_request_spanish;
    const resultLang = LANGUAGES.find(l => l.code === userLang);
    const officialLangObj = LANGUAGES.find(l => l.code === officialLang);
    const letterText = showSpanish ? result.formal_request_spanish : result.formal_request;

    return (
      <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
        <CivicNav />
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>

          {/* Success banner */}
          <div style={{ background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 14, color: "#22c55e", fontWeight: 600 }}>
            {officialLangObj && officialLangObj.code !== "en"
              ? `✓ Letter written in ${officialLangObj.flag} ${officialLangObj.label} — ready to send to the official`
              : resultLang && resultLang.code !== "en"
              ? `✓ ${resultLang.flag} Complaint received in ${resultLang.label}. Letter written in English for the official.`
              : "✓ Your issue has been posted and your letter is ready to send"}
          </div>

          {/* Official */}
          <div className="civic-card" style={{ padding: 20, marginBottom: 12 }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)", marginBottom: 12 }}>📬 Send this letter to</p>
            <div style={{ display: "flex", gap: 12, background: "hsl(216,28%,8%)", borderRadius: 8, padding: 14, border: "1px solid hsl(215,20%,20%)" }}>
              <span style={{ fontSize: 24 }}>🏛️</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(210,30%,92%)", marginBottom: 2 }}>{result.official_name}</p>
                <p style={{ fontSize: 13, color: "hsl(221,83%,53%)", marginBottom: 2 }}>{result.department}</p>
                <p style={{ fontSize: 12, color: "hsl(215,14%,58%)" }}>{result.official_email}</p>
              </div>
            </div>
          </div>

          {/* Letter with language toggle */}
          <div className="civic-card" style={{ padding: 20, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "hsl(215,14%,58%)" }}>📄 Your formal letter</p>
              {hasTranslation && (
                <div style={{ display: "flex", gap: 4 }}>
                  {[
                    { val: false, label: officialLangObj ? `${officialLangObj.flag} Official` : "🏛️ Official" },
                    { val: true, label: resultLang ? `${resultLang.flag} ${resultLang.label}` : "🌐 My Language" },
                  ].map(opt => (
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

          <button className="civic-btn-primary" onClick={() => router.push(`/post/${result.id}`)}
            style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15, marginBottom: 10, borderRadius: 10 }}>
            👥 See who else is raising this issue
          </button>
          <Link href="/" style={{ display: "block", textAlign: "center", fontSize: 14, color: "hsl(215,14%,58%)", textDecoration: "none", marginTop: 12 }}>← Back to feed</Link>
        </div>
      </div>
    );
  }

  // FORM STATE
  return (
    <div style={{ minHeight: "100vh", background: "hsl(216,28%,7%)" }}>
      <CivicNav />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px" }}>
        <Link href="/forum" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "hsl(215,14%,58%)", textDecoration: "none", marginBottom: 20 }}>← Back to forum</Link>

        {/* SUSPENDED — replace entire form */}
        {moderationState?.type === "suspended" ? (
          <div className="civic-card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <p style={{ fontSize: 18, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 8 }}>Access suspended</p>
            <p style={{ fontSize: 14, color: "hsl(215,14%,58%)", lineHeight: 1.6, maxWidth: 380, margin: "0 auto" }}>
              Your access has been suspended due to repeated violations. CivicPulse is for civic infrastructure complaints only — potholes, streetlights, parks, crosswalks.
            </p>
          </div>
        ) : (
          <div className="civic-card" style={{ padding: 32, marginBottom: 16 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "hsl(210,30%,92%)", marginBottom: 8 }}>Raise a community issue</h1>
            <p style={{ fontSize: 14, color: "hsl(215,14%,58%)", marginBottom: 24, lineHeight: 1.6 }}>
              Describe the problem in plain English. Our AI will search for the real official, write a formal letter citing real city ordinances, and connect you with others raising the same issue.
            </p>

            {/* Language selector */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "hsl(215,14%,58%)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                Write your complaint in
              </label>
              <select
                value={language}
                onChange={e => { setLanguage(e.target.value); setComplaint(""); }}
                style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: "1px solid hsl(215,20%,24%)", background: "hsl(216,28%,8%)", color: "hsl(210,30%,92%)", fontSize: 14, fontFamily: "Inter, sans-serif", cursor: "pointer", outline: "none" }}
              >
                {LANGUAGES.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                ))}
              </select>
            </div>

            {error && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 14, color: "#ef4444" }}>
                {error}
              </div>
            )}

            {/* WARNING BANNER */}
            {moderationState?.type === "warning" && (
              <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span>⚠️</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#f59e0b" }}>
                    Heads up — Warning {(moderationState.warnings || 0) + 1} of 4
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "hsl(215,14%,70%)", lineHeight: 1.5, margin: 0 }}>
                  {moderationState.reason} — We've suggested a civic version below. Edit and resubmit.
                </p>
              </div>
            )}

            {/* STRIKE BANNER */}
            {moderationState?.type === "strike" && (
              <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.4)", borderRadius: 8, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span>🚫</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#ef4444" }}>
                    Strike {(moderationState.strikes || 0) + 1} of 2
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "hsl(215,14%,70%)", lineHeight: 1.5, marginBottom: 10 }}>
                  {moderationState.reason}
                </p>
                <p style={{ fontSize: 12, color: "hsl(215,14%,50%)", marginBottom: moderationState.rewrite ? 12 : 0 }}>
                  CivicPulse is for infrastructure complaints only.
                  {(moderationState.strikes || 0) >= 1 ? " One more strike suspends your access." : ""}
                </p>
                {moderationState.rewrite && (
                  <button onClick={() => { setComplaint(moderationState.rewrite); setModerationState(null); }}
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 6, padding: "8px 14px", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Inter, sans-serif" }}>
                    ✏️ Use civic version instead
                  </button>
                )}
              </div>
            )}

            {/* BAN BANNER */}
            {moderationState?.type === "ban" && (
              <div style={{ background: "rgba(127,29,29,0.3)", border: "1px solid rgba(239,68,68,0.5)", borderRadius: 10, padding: 20, marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🚫</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#ef4444", marginBottom: 8 }}>Post removed</p>
                <p style={{ fontSize: 13, color: "hsl(215,14%,70%)", lineHeight: 1.6, marginBottom: 8 }}>
                  Content targeting people based on race, religion, nationality, gender, or any protected group is not allowed on this platform.
                </p>
                <p style={{ fontSize: 12, color: "hsl(215,14%,50%)" }}>
                  CivicPulse holds government accountable — not communities. Your access has been suspended.
                </p>
              </div>
            )}

            {/* Complaint textarea */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(210,30%,92%)", marginBottom: 8 }}>
                What's the problem? <span style={{ fontWeight: 400, color: "hsl(215,14%,58%)" }}>({selectedLang.flag} {selectedLang.label})</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe the issue in your language. AI will write an official letter in English for the government."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                style={{ width: "100%", border: "1px solid hsl(215,20%,20%)", borderRadius: 8, padding: 14, fontFamily: "Inter, sans-serif", fontSize: 15, color: "hsl(210,30%,92%)", background: "hsl(216,28%,8%)", resize: "none", outline: "none", minHeight: 120, transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = "hsl(221,83%,53%)"}
                onBlur={e => e.target.style.borderColor = "hsl(215,20%,20%)"}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {EXAMPLES.map((ex) => (
                  <button key={ex.label} onClick={() => setComplaint(ex.text)}
                    style={{ background: "hsl(216,28%,13%)", border: "1px solid hsl(215,20%,24%)", borderRadius: 20, padding: "5px 14px", fontSize: 12, fontFamily: "Inter, sans-serif", color: "hsl(215,14%,70%)", cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.target.style.borderColor = "hsl(221,83%,53%)"; e.target.style.color = "hsl(221,83%,70%)"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "hsl(215,20%,24%)"; e.target.style.color = "hsl(215,14%,70%)"; }}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo upload */}
            <div style={{ marginBottom: 16 }}>
              <input type="file" accept="image/*" ref={fileRef} onChange={handlePhoto} style={{ display: "none" }} />
              {!photoPreview ? (
                <button onClick={() => fileRef.current.click()}
                  style={{ width: "100%", padding: 14, background: "hsl(216,28%,8%)", border: "1px dashed hsl(215,20%,28%)", borderRadius: 8, color: "hsl(215,14%,58%)", fontSize: 14, fontFamily: "Inter, sans-serif", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "hsl(221,83%,53%)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "hsl(215,20%,28%)"}>
                  📷 {language === "es" ? "Subir foto (opcional)" : "Upload Photo (optional)"}
                </button>
              ) : (
                <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid hsl(215,20%,20%)" }}>
                  <img src={photoPreview} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
                  <button onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "white", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
              )}
            </div>

            {/* Location */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "hsl(210,30%,92%)", marginBottom: 8 }}>
                {language === "es" ? "Ubicación (opcional)" : "Location (optional)"}
              </label>
              <input type="text"
                placeholder={language === "es" ? "Ej. Rural Road y Southern Ave, Tempe" : "e.g. Rural Road & Southern Ave, Tempe"}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: "100%", border: "1px solid hsl(215,20%,20%)", borderRadius: 8, padding: "12px 14px", fontFamily: "Inter, sans-serif", fontSize: 15, color: "hsl(210,30%,92%)", background: "hsl(216,28%,8%)", outline: "none", transition: "border-color 0.15s" }}
                onFocus={e => e.target.style.borderColor = "hsl(221,83%,53%)"}
                onBlur={e => e.target.style.borderColor = "hsl(215,20%,20%)"}
              />
            </div>

            <button className="civic-btn-primary" onClick={handleSubmit}
              disabled={loading || !complaint.trim() || moderationState?.type === "ban"}
              style={{ width: "100%", justifyContent: "center", padding: 14, fontSize: 15, borderRadius: 8, opacity: (!complaint.trim() || loading || moderationState?.type === "ban") ? 0.5 : 1, cursor: (!complaint.trim() || loading || moderationState?.type === "ban") ? "not-allowed" : "pointer" }}>
              {loading ? (language === "es" ? "Analizando..." : "Analyzing...") : (language === "es" ? "Encontrar Mi Voz →" : "Find My Voice →")}
            </button>
          </div>
        )}

        <div style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8, padding: "12px 14px", fontSize: 13, color: "hsl(221,83%,70%)", lineHeight: 1.5 }}>
          {language === "es"
            ? "🔒 Tu queja es anónima por defecto. La IA escribe la carta — tú decides si la envías."
            : "🔒 Your complaint is anonymous by default. AI writes the letter — you decide whether to send it."}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.7; transform:scale(1.08); } }
        @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.2; } }
        @keyframes sway { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
        @keyframes grow { 0% { clip-path:inset(0 100% 0 0); } 100% { clip-path:inset(0 0% 0 0); } }
        @keyframes write { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-4px,4px); } }
      `}</style>
    </div>
  );
}