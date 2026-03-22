import { useState } from "react";
import Nav from "../components/Nav";

const CATEGORIES = ["Bug Report", "Feature Request", "Press Inquiry", "Partnership", "Other"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", category: "Bug Report", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  function update(k, v) { setForm(p => ({ ...p, [k]: v })); }

  async function handleSubmit() {
    if (!form.message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Send failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Nav />
      <div className="container" style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: -0.5, marginBottom: 8 }}>Contact Us</h1>
        <p style={{ fontSize: 15, color: "var(--muted)", marginBottom: 32 }}>We respond within 48 hours. Built by Sumedha + Aditya for HackASU 2026.</p>

        {status === "sent" ? (
          <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 14, padding: "32px", textAlign: "center" }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ marginBottom: 12 }}>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Message sent</p>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>We will get back to you within 48 hours.</p>
          </div>
        ) : (
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: "28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Name (optional)</label>
                <input type="text" placeholder="Your name" value={form.name} onChange={e => update("name", e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Email (optional)</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => update("email", e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Category</label>
              <select value={form.category} onChange={e => update("category", e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit", cursor: "pointer" }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", display: "block", marginBottom: 6 }}>Message</label>
              <textarea rows={5} placeholder="Describe your issue, idea, or question..." value={form.message} onChange={e => update("message", e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            {status === "error" && (
              <p style={{ fontSize: 13, color: "#ef4444", marginBottom: 12 }}>Something went wrong. Try again or email us directly.</p>
            )}
            <button onClick={handleSubmit} disabled={!form.message.trim() || status === "sending"}
              style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563eb,#7c3aed)", color: "white", fontSize: 14, fontWeight: 700, cursor: !form.message.trim() ? "default" : "pointer", opacity: !form.message.trim() ? 0.5 : 1 }}>
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
          </div>
        )}

        <div style={{ marginTop: 24, display: "flex", gap: 16, justifyContent: "center" }}>
          <a href="https://github.com/ARasugit20/ClaudeHacks/issues" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: "#2563eb", textDecoration: "none", fontWeight: 600 }}>GitHub Issues</a>
          <span style={{ color: "var(--muted)" }}>·</span>
          <span style={{ fontSize: 13, color: "var(--muted)" }}>Response within 48 hours</span>
        </div>
      </div>
    </>
  );
}
