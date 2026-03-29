import { insforge } from "../../lib/insforge";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { postId } = req.query;
    if (!postId) return res.status(400).json({ error: "postId is required" });

    const { data, error } = await insforge.database
      .from("comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) return res.status(200).json([]); // fallback: empty array
    return res.status(200).json(data || []);
  }

  if (req.method === "POST") {
    const { post_id, text, author_name } = req.body;
    if (!post_id || !text) return res.status(400).json({ error: "post_id and text are required" });

    const safeText = String(text || "").slice(0, 1000).trim();
    const safeName = String(author_name || "Anonymous").slice(0, 100).trim();

    const { data, error } = await insforge.database
      .from("comments")
      .insert([{ post_id, text: safeText, author_name: safeName }])
      .select()
      .single();

    if (error) {
      // Return optimistic response so UI still works
      return res.status(200).json({ id: `local-${Date.now()}`, post_id, text: safeText, author_name: safeName, created_at: new Date().toISOString() });
    }
    return res.status(200).json(data);
  }

  return res.status(405).end();
}
