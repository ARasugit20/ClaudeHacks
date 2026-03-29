import { insforge } from "../../lib/insforge";

export default async function handler(req, res) {
  const { q } = req.query;
  const safe = String(q || "").slice(0, 100).replace(/[%_\\'"]/g, "").trim();
  if (safe.length < 2) return res.status(200).json([]);

  try {
    const { data, error } = await insforge.database
      .from("posts")
      .select("*")
      .or(
        `complaint.ilike.%${safe}%,location.ilike.%${safe}%,issue_type.ilike.%${safe}%,department.ilike.%${safe}%`
      )
      .order("echo_count", { ascending: false })
      .limit(20);

    if (error) return res.status(200).json([]);
    return res.status(200).json(data || []);
  } catch {
    // Tunnel down — return empty array so client falls back to static data
    return res.status(200).json([]);
  }
}
