import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { complaint } = req.body;
  if (!complaint?.trim() || complaint.trim().length < 10) {
    return res.status(200).json({ allowed: true, reason: "Too short to evaluate" });
  }

  try {
    const result = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [{
        role: "user",
        content: `You are a content moderator for a civic complaints platform where residents report local issues like potholes, broken lights, unsafe roads, and neighborhood problems.

Analyze this text and respond with ONLY a JSON object: {"allowed": true/false, "reason": "one sentence explanation"}

Mark as NOT allowed (allowed: false) ONLY if the text:
- Contains hate speech, slurs, or racial abuse
- Contains personal threats or harassment toward specific people
- Is completely unrelated to civic/community issues (spam, gibberish)
- Contains sexual content

Mark as ALLOWED (allowed: true) even if:
- The person is frustrated or uses mild profanity about the situation ("this road is absolute garbage")
- The writing is informal or in broken English
- The complaint criticizes government officials or policies
- The text is written in any language

Text to analyze: "${complaint.slice(0, 500)}"`,
      }],
    });

    const text = result.content[0].text.replace(/```json|```/g, "").trim();
    try {
      const data = JSON.parse(text);
      return res.status(200).json({ allowed: !!data.allowed, reason: data.reason || "" });
    } catch {
      return res.status(200).json({ allowed: true, reason: "Parse error — defaulting to allowed" });
    }
  } catch {
    return res.status(200).json({ allowed: true, reason: "API error — defaulting to allowed" });
  }
}
