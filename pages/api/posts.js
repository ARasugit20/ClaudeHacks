import { insforge } from "../../lib/supabase";

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
      const { complaint, formal_request, department, official_name, official_email, issue_type, location } = req.body;
  
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