import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Content moderation — reject harmful content before hitting Claude
const POLICY_PATTERNS = [
  /\b(kill|murder|shoot|stab|bomb|attack|assault|rape|lynch|hang)\b/i,
  /\b(nigger|faggot|chink|spic|kike|wetback|tranny)\b/i,
  /\b(hate|destroy|eliminate|exterminate)\s+(all\s+)?(jews?|muslims?|blacks?|whites?|gays?|immigrants?)\b/i,
  /\b(go\s+die|kys|kill\s+yourself|end\s+your\s+life)\b/i,
  /\b(terrorist|jihad|isis|al.?qaeda)\b/i,
  /\b(child\s+porn|cp|csam|pedophil)\b/i,
];

function moderateContent(text) {
  for (const pattern of POLICY_PATTERNS) {
    if (pattern.test(text)) return false;
  }
  return true;
}

const SYSTEM_PROMPT = `You are a civic complaint classifier and letter writer for Civilian, a local government engagement platform.

STEP 1 — VALIDATE THE COMPLAINT
REJECT (rejected: true) if the complaint:
- Does not describe a specific, observable, physical local issue
- Does not include or imply a specific location
- Targets a named individual by name as the subject
- Expresses a political opinion rather than describing a problem
- Is a policy suggestion not a specific reportable issue
- Contains abusive, threatening, or discriminatory language
- Is outside local government jurisdiction

ACCEPT (rejected: false) if the complaint describes a specific physical problem with a location that is within local government jurisdiction.

IF REJECTED return ONLY this JSON:
{"rejected": true, "reason": "<exactly one of: no_location | targets_individual | political_opinion | policy_suggestion | abusive_content | outside_jurisdiction | not_specific_enough>", "reframe_suggestion": "<one specific sentence telling the user how to rewrite their complaint>"}

IF ACCEPTED do two web searches:
1. Current official responsible for this issue type in this city and their verified email
2. Relevant local ordinance or statute number

Then return ONLY this JSON:
{"rejected": false, "issue_type": "<traffic_safety|street_lighting|road_maintenance|parks_facilities|noise_complaint|housing|utilities|sanitation|other>", "severity": "<critical|urgent|standard|suggestion>", "department": "<real department name from search>", "official_name": "<real name and title from search>", "official_email": "<real email from search, or empty string if not found>", "location_extracted": "<location from complaint>", "urgency_score": <1-10>, "language": "<ISO 639-1 code of language user wrote in>", "formal_request": "<complete formal letter in same language user wrote in, 3-4 paragraphs, citing real ordinance found, signed as Concerned Residents>"}

CRITICAL: Response must be ONLY valid JSON. No markdown, no backticks, no text before or after. If official email not found, use empty string.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { complaint, location, imageBase64, imageMediaType, language, highSensitivity } = req.body;

  const sanitizedComplaint = String(complaint || "").slice(0, 2000).trim();
  const sanitizedLocation = String(location || "").slice(0, 200).trim();
  if (!sanitizedComplaint) return res.status(400).json({ error: "Complaint text is required" });

  // Content policy check
  if (!moderateContent(sanitizedComplaint)) {
    return res.status(400).json({
      error: "content_policy",
      message: "Your post contains content that violates our community guidelines. Civilian does not allow violent, hateful, or abusive language. Please describe your civic issue respectfully.",
    });
  }

  try {
    const userContent = [];
    if (imageBase64) {
      userContent.push({
        type: "image",
        source: {
          type: "base64",
          media_type:  imageMediaType || "image/jpeg",
          data: imageBase64,
        },
      });
    }
    userContent.push({
      type: "text",
      text: `Community complaint: ${sanitizedComplaint}\n\nLocation: ${sanitizedLocation || "Tempe, Arizona"}\nComplaint language: ${language || "en"}\n\nDo exactly 2 web searches, then respond with ONLY the JSON object described in your instructions.`,
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 3000,
      system: highSensitivity
        ? `PRIVACY MODE: Before processing, strip any personally identifying details (names, phone numbers, addresses, emails, ID numbers) from the complaint. Do not include them in any output field.\n\n${SYSTEM_PROMPT}`
        : SYSTEM_PROMPT,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
        }
      ],
      messages: [
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    // Get the last text block (after all tool use)
    const textBlock = message.content.findLast(block => block.type === "text");
    if (!textBlock) throw new Error("No text response from Claude");

    const raw = textBlock.text.trim();

    // Try direct parse first
    try {
      const data = JSON.parse(raw);
      return res.status(200).json(data);
    } catch {
      // Fall back to extracting JSON from text
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