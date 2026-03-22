import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { complaint } = req.body;
  if (!complaint?.trim() || complaint.trim().length < 3) {
    return res.status(200).json({ allowed: true, reason: "Too short to evaluate" });
  }

  try {
    const result = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 100,
      messages: [{
        role: "user",
        content: `You are a content moderator for a civic complaints platform. Residents report local problems like potholes, broken lights, unsafe roads, noise, housing issues, etc.

Respond with ONLY a JSON object: {"allowed": true/false, "reason": "one sentence"}

BLOCK (allowed: false) if the text:
- Is ONLY insults/name-calling with NO specific civic problem mentioned. Examples that must be BLOCKED:
  * "the authority are idiots" — no problem described, just insult
  * "fix this idiot" — no civic issue
  * "these people are morons and don't know anything" — pure insult
  * "city officials are complete idiots" — insult only, no issue
  * "everyone in government is stupid and useless" — no specific problem
- Contains hate speech, slurs, or threats of violence
- Is sexual content or spam

ALLOW (allowed: true) if the text:
- Describes a SPECIFIC civic problem even if written angrily. Examples that must be ALLOWED:
  * "the authority are idiots, they haven't fixed the pothole on Mill Ave for 3 months" — has specific issue
  * "these morons let the streetlight stay broken for weeks" — has specific issue
  * "the city council is corrupt and won't fix our broken water pipes" — has specific issue
  * "this road is absolute garbage, full of potholes" — describes road problem
  * Any complaint mentioning: roads, lights, parks, noise, water, housing, safety, permits, trash, etc.

THE KEY RULE: Does the text mention a SPECIFIC civic problem (road, light, park, noise, water, housing, safety, etc.)? If YES → allow. If it's ONLY insults with zero mention of any actual problem → block.

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
