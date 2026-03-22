import Anthropic from "@anthropic-ai/sdk";
import { insforge } from "../../lib/supabase";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a civic action assistant. A community member has described a problem in their neighborhood.

IMPORTANT: You must do exactly 2 web searches maximum, then respond with ONLY a JSON object.

Step 1: Search for the current government official responsible for this issue type in the given city.
Step 2: Search for a relevant local law, ordinance, or statute number for this issue type.
Step 3: Respond with ONLY this JSON — no other text before or after:

{
  "issue_type": "one of: traffic_safety, street_lighting, road_maintenance, parks_facilities, noise_complaint, housing, utilities, other",
  "department": "exact real department name found via search",
  "official_name": "real current name and title found via search",
  "official_email": "real email address found via search",
  "location_extracted": "location mentioned in complaint",
  "language": "ISO 639-1 code of the language the complaint is written in (e.g. en, es, zh, vi, tl, ar, hi, ko, pt, fr, ht, so, am, ru, ja). Default en if unclear.",
  "official_language": "ISO 639-1 code of the official government language for the specific region in the location. Be precise — use regional/sub-national language when applicable: 'ca' for Barcelona/Catalonia (not 'es'), 'ta' for Tamil Nadu (not 'hi'), 'mr' for Maharashtra, 'te' for Andhra Pradesh/Telangana, 'eu' for Basque Country, 'gl' for Galicia, 'fr' for Quebec/France, 'de' for Germany/Austria, 'hu' for Hungary, 'ja' for Japan, 'zh' for mainland China/Taiwan, 'ar' for Arabic-speaking countries, etc. Default 'en' for USA/UK/Australia/Canada/anglophone regions.",
  "formal_request": "the full formal letter written in the USER'S LANGUAGE (the language field), 3-4 paragraphs, citing the real local law or ordinance found, from the perspective of concerned residents. The user will read and edit this version before it is translated. Sign as Concerned Residents.",
  "formal_request_spanish": null
}

CRITICAL: Your final response must be ONLY the JSON object. No markdown, no explanation, no text before or after the JSON.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { complaint, location, session_id } = req.body;
  const sessionId = req.headers["x-session-id"] || session_id || "anonymous";

  if (!complaint?.trim()) return res.status(400).json({ error: "No complaint" });

  // ── STAGE 1: MODERATION ──────────────────────────────────
  try {
    const mod = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `You moderate a civic complaints platform (potholes, streetlights, parks, crosswalks, housing, utilities).
Classify this complaint: "${complaint}"
Reply ONLY with this JSON, nothing else:
{"allowed":true,"severity":"clean","reason":null,"suggested_rewrite":null}

Severity rules — be PERMISSIVE, not strict:
"clean" — any civic complaint about infrastructure, public services, government, homelessness impact on public spaces, safety, noise, housing conditions, utilities. ALLOW. When in doubt, ALLOW.
"warning" — contains actual profanity/slurs BUT the underlying complaint is civic. BLOCK but suggest a clean civic rewrite of the same complaint.
"strike" — complaint is purely personal harassment of a named private individual (not a public official) with no civic substance. BLOCK.
"ban" — explicitly targets or demeans a group by race, religion, ethnicity, nationality, gender, or sexual orientation, OR contains explicit threats of violence. BLOCK immediately.

IMPORTANT: Words like "homeless", "drug addicts", "gangs", "crime", "unsafe", "dangerous", "dirty", "neglected" are ALLOWED — these describe civic conditions. Only block actual slurs and threats. Frustration and strong language about government inaction is ALLOWED. Off-topic personal rants with no civic element = warning only.`
      }]
    });

    const modText = mod.content[0].text.replace(/```json\n?|\n?```/g, "").trim();
    const modResult = JSON.parse(modText);

    if (!modResult.allowed) {
      // Log the penalty
      try {
        await insforge.database.from("user_penalties").insert([{
          session_id: sessionId,
          severity: modResult.severity,
          reason: modResult.reason,
          complaint_text: complaint.slice(0, 200)
        }]);

        const { data: prev } = await insforge.database
          .from("user_penalties").select("severity").eq("session_id", sessionId);

        const warns   = prev?.filter(p => p.severity === "warning").length || 0;
        const strikes = prev?.filter(p => p.severity === "strike").length || 0;
        const bans    = prev?.filter(p => p.severity === "ban").length || 0;
        const suspended = bans >= 1 || strikes >= 2 || warns >= 4;

        return res.status(200).json({
          blocked: true,
          severity: modResult.severity,
          reason: modResult.reason,
          suggested_rewrite: modResult.suggested_rewrite,
          account_status: suspended ? "suspended" : "active",
          warnings_count: warns,
          strikes_count: strikes
        });
      } catch (dbErr) {
        console.error("Penalty logging error:", dbErr);
        // Still block even if DB log fails
        return res.status(200).json({
          blocked: true,
          severity: modResult.severity,
          reason: modResult.reason,
          suggested_rewrite: modResult.suggested_rewrite,
          account_status: "active",
          warnings_count: 0,
          strikes_count: 0
        });
      }
    }
  } catch (modErr) {
    console.error("Moderation error:", modErr);
    // If moderation fails, continue — don't block legitimate users
  }

  // ── STAGE 2: MAIN CLAUDE ANALYSIS ───────────────────────
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Community complaint: ${complaint}\n\nLocation: ${location || "Tempe, Arizona"}\n\nDo exactly 2 web searches, then respond with ONLY the JSON object described in your instructions.`,
      }],
    });

    const textBlock = message.content.findLast(block => block.type === "text");
    if (!textBlock) throw new Error("No text response from Claude");

    const raw = textBlock.text.trim();

    try {
      const data = JSON.parse(raw);
      return res.status(200).json(data);
    } catch {
      const jsonStart = raw.indexOf("{");
      const jsonEnd = raw.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        console.error("Raw response:", raw);
        throw new Error("No JSON found in response");
      }
      const data = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
      return res.status(200).json(data);
    }
  } catch (err) {
    console.error("Claude API error:", err);
    return res.status(500).json({ error: err.message });
  }
}