import { useState, useEffect } from "react";
import Link from "next/link";
import Nav from "../components/Nav";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("civilian_notifications");
    if (stored) setNotifications(JSON.parse(stored));
  }, []);

  function markAllRead() {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("civilian_notifications", JSON.stringify(updated));
  }

  const unread = notifications.filter(n => !n.read).length;

  return (
    <>
      <Nav />
      <div className="container" style={{ maxWidth: 640 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", letterSpacing: -0.5 }}>Notifications</h1>
          {unread > 0 && (
            <button onClick={markAllRead} style={{ fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
              Mark all read
            </button>
          )}
        </div>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" style={{ marginBottom: 16 }}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <p style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>No notifications yet</p>
            <p style={{ fontSize: 14, color: "var(--muted)" }}>When someone echoes your issue or officials respond, you will see it here.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {notifications.map(n => (
              <Link key={n.id} href={n.href}
                style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 12, textDecoration: "none", background: n.read ? "var(--surface)" : "rgba(37,99,235,0.06)", border: `1px solid ${n.read ? "var(--border)" : "rgba(37,99,235,0.2)"}`, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                onMouseLeave={e => e.currentTarget.style.background = n.read ? "var(--surface)" : "rgba(37,99,235,0.06)"}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: n.read ? "transparent" : "#2563eb", flexShrink: 0, marginTop: 6 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5, fontWeight: n.read ? 400 : 600 }}>{n.text}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{n.time}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
