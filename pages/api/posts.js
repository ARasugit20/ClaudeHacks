import { insforge } from "../../lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function geocodeLocation(location) {
  try {
    const query = encodeURIComponent(`${location}, Tempe, Arizona`);
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${token}&limit=1&country=US`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.features?.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { lat, lng };
    }
  } catch (e) {
    console.error("Geocoding failed:", e);
  }
  return { lat: null, lng: null };
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await insforge.database
      .from("posts")
      .select("*")
      .order("echo_count", { ascending: false });

      if (error) {
        console.error("InsForge insert error:", JSON.stringify(error));
        return res.status(500).json({ error: error.message });
      }
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    try {
      const { complaint, formal_request, department, official_name, official_email, issue_type, location, language, official_language, formal_request_spanish } = req.body;

      // ── DUPLICATE DETECTION ───────────────────────────────
      try {
        const { data: recentPosts } = await insforge.database
          .from("posts")
          .select("id, complaint, location, echo_count")
          .eq("issue_type", issue_type)
          .order("created_at", { ascending: false })
          .limit(8);

        if (recentPosts && recentPosts.length > 0) {
          const dupCheck = await client.messages.create({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 200,
            messages: [{
              role: "user",
              content: `Is this new complaint the same issue at the same location as any existing one?

New complaint: "${complaint}" at "${location}"

Existing complaints:
${recentPosts.map((p, i) => `${i + 1}. id="${p.id}" — "${p.complaint}" at "${p.location}"`).join("\n")}

Reply ONLY with JSON, nothing else: {"duplicate":true,"duplicate_id":"the matching id or null","reason":"brief explanation of why it matches"}`
            }]
          });

          const dupRaw = dupCheck.content[0].text.replace(/```json\n?|\n?```/g, "").trim();
          const dupResult = JSON.parse(dupRaw);

          if (dupResult.duplicate && dupResult.duplicate_id) {
            const existing = recentPosts.find(p => p.id === dupResult.duplicate_id);
            if (existing) {
              const { data: updated } = await insforge.database
                .from("posts")
                .update({ echo_count: (existing.echo_count || 1) + 1 })
                .eq("id", dupResult.duplicate_id)
                .select()
                .single();

              return res.status(200).json({
                ...updated,
                merged: true,
                merge_reason: dupResult.reason,
              });
            }
          }
        }
      } catch (dupErr) {
        console.error("Duplicate check error (non-fatal):", dupErr);
        // Continue with normal insert if duplicate check fails
      }

      // ── NORMAL INSERT ────────────────────────────────────
      const { lat, lng } = await geocodeLocation(location || "Tempe, Arizona");

      console.log("Inserting post:", { complaint, issue_type, location, lat, lng });

      const { data, error } = await insforge.database
        .from("posts")
        .insert([{
          complaint,
          formal_request,
          department,
          official_name,
          official_email,
          issue_type,
          location,
          lat,
          lng,
          language: language || "en",
          official_language: official_language || "en",
          formal_request_spanish: formal_request_spanish || null,
          echo_count: 1,
          status: "pending"
        }])
        .select()
        .single();

      console.log("Result:", JSON.stringify({ data, error }));

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data);
    } catch (e) {
      console.error("CAUGHT ERROR:", e.message, e.stack);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).end();
}
