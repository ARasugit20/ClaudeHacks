export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email, category, message } = req.body;
  if (!message?.trim()) return res.status(400).json({ error: "Message required" });

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Civilian Contact <onboarding@resend.dev>",
      to: "sgupt354@asu.edu",
      subject: `[Civilian] ${category} from ${name || "Anonymous"}`,
      text: `Category: ${category}\nName: ${name || "Anonymous"}\nEmail: ${email || "Not provided"}\n\n${message}`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return res.status(500).json({ error: "Failed to send" });
  }
}
