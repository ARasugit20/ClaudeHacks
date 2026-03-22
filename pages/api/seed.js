import { insforge } from "../../lib/supabase";

const SEED_POSTS = [
  {
    complaint: "The crosswalk at Mill Ave and University Dr has completely faded markings. Kids nearly get hit every morning walking to school. We need immediate repainting and better signage.",
    formal_request: "Dear Director of Transportation,\n\nWe, the concerned residents of Tempe, Arizona, write to formally request immediate attention to the dangerous crosswalk conditions at Mill Avenue and University Drive. The crosswalk markings have faded to the point of near-invisibility, creating a serious hazard for pedestrians, particularly students commuting to school during morning hours.\n\nPursuant to Arizona Revised Statutes §28-792 and Tempe City Code §24-10, which mandate that crosswalks be clearly marked and maintained for pedestrian safety, we respectfully demand that the Transportation Department schedule emergency repainting of all crosswalk markings at this intersection within 30 days.\n\nMultiple near-miss incidents have been reported by parents and residents. The volume of pedestrian traffic at this location, combined with the current state of the markings, constitutes an imminent public safety risk that requires urgent remediation.\n\nWe respectfully request a written response confirming the scheduled maintenance date and any interim safety measures that will be implemented.\n\nSincerely,\nConcerned Residents of Tempe",
    department: "Tempe Transportation Department",
    official_name: "Director of Transportation, City of Tempe",
    official_email: "transportation@tempe.gov",
    issue_type: "traffic_safety",
    location: "Mill Ave & University Dr, Tempe",
    lat: 33.4255,
    lng: -111.9400,
    echo_count: 47,
    status: "sent",
  },
  {
    complaint: "Three streetlights on Rural Road near the Tempe Public Library have been out for over six weeks. Evening pedestrians and cyclists are using phone flashlights. This is a safety emergency.",
    formal_request: "Dear Director of Public Works,\n\nWe are writing on behalf of residents and business owners along Rural Road near the Tempe Public Library to report a persistent and dangerous street lighting outage. Three consecutive streetlights have been non-functional for over six weeks, creating hazardous conditions for pedestrians, cyclists, and motorists after dark.\n\nUnder Tempe City Code §16-45 and Arizona Revised Statutes §9-499, municipalities are required to maintain adequate public lighting on arterial roads. The prolonged outage on this heavily-trafficked corridor represents a clear violation of this duty and exposes the City to liability.\n\nWe formally request that the Public Works Department dispatch a maintenance crew to inspect and repair the affected light poles within 14 days. We also request that the City install temporary lighting solutions in the interim to protect public safety.\n\nPlease confirm receipt of this request and provide a timeline for repairs.\n\nSincerely,\nConcerned Residents of Tempe",
    department: "Tempe Public Works Department",
    official_name: "Director of Public Works, City of Tempe",
    official_email: "publicworks@tempe.gov",
    issue_type: "street_lighting",
    location: "Rural Road near Tempe Public Library",
    lat: 33.4152,
    lng: -111.9260,
    echo_count: 31,
    status: "sent",
  },
  {
    complaint: "Kiwanis Park has zero shade structures. The playground equipment reaches 160°F in summer. Children cannot safely use the park from May through September. We need shade sails or covered structures urgently.",
    formal_request: "Dear Director of Parks and Recreation,\n\nWe write to formally request the installation of shade structures at Kiwanis Park, located at 6111 S All America Way, Tempe. Surface temperature measurements taken on playground equipment during summer months have recorded temperatures exceeding 160°F, rendering the park unusable and dangerous for children during the hottest months of the year.\n\nPursuant to Tempe Parks and Recreation Code §18-22 and the City's adopted Heat Safety Standards, public recreational facilities must be maintained in a condition that is safe and accessible for all residents. The current lack of shade infrastructure at Kiwanis Park fails to meet this standard.\n\nWe formally request that the Parks and Recreation Department allocate funding in the next budget cycle for the installation of shade sails or permanent covered structures over the main playground area. We also request an interim assessment of heat mitigation options that can be implemented before the upcoming summer season.\n\nThis issue affects hundreds of families in the surrounding neighborhoods.\n\nSincerely,\nConcerned Residents of Tempe",
    department: "Tempe Parks and Recreation Department",
    official_name: "Director of Parks and Recreation, City of Tempe",
    official_email: "parks@tempe.gov",
    issue_type: "parks_facilities",
    location: "Kiwanis Park, 6111 S All America Way, Tempe",
    lat: 33.3942,
    lng: -111.9318,
    echo_count: 23,
    status: "pending",
  },
  {
    complaint: "The pothole on Apache Blvd near the 101 overpass has damaged at least 12 cars this month alone. It's been reported multiple times but never fixed. We need emergency road repair immediately.",
    formal_request: "Dear Director of Street Transportation,\n\nWe are writing to demand emergency repair of a severe pothole located on Apache Boulevard near the Loop 101 overpass. This road defect has caused documented damage to at least twelve vehicles in the past month and poses an ongoing risk of accidents, tire blowouts, and loss of vehicle control.\n\nUnder Arizona Revised Statutes §28-1103 and Tempe City Code §24-55, the City is obligated to maintain public roadways in a safe condition and is liable for damages caused by known road defects that have not been remediated within a reasonable time. This pothole has been reported to 311 on multiple occasions without action.\n\nWe formally demand that the Street Transportation Department dispatch a repair crew to permanently fill and resurface the affected area within 7 days. We also request a written acknowledgment of this complaint and documentation of all prior reports submitted regarding this specific defect.\n\nFurther delay in addressing this hazard will result in continued property damage and potential personal injury to Tempe residents.\n\nSincerely,\nConcerned Residents of Tempe",
    department: "Tempe Street Transportation Department",
    official_name: "Director of Street Transportation, City of Tempe",
    official_email: "streets@tempe.gov",
    issue_type: "road_maintenance",
    location: "Apache Blvd near Loop 101 overpass, Tempe",
    lat: 33.4152,
    lng: -111.8900,
    echo_count: 19,
    status: "pending",
  },
  {
    complaint: "The noise from the construction site on Southern Ave starts at 5am every day, well before the legal 7am start time. Residents in a 3-block radius cannot sleep. We need code enforcement to act now.",
    formal_request: "Dear Director of Community Development,\n\nWe write to formally report ongoing violations of Tempe's noise ordinance by a construction site operating on Southern Avenue. Construction activity has been consistently commencing at or before 5:00 AM, in direct violation of Tempe City Code §16-30, which prohibits construction noise before 7:00 AM on weekdays and 8:00 AM on weekends.\n\nResidents within a three-block radius have been subjected to weeks of sleep disruption, impacting health, work performance, and quality of life. Multiple informal complaints to the site supervisor have been ignored.\n\nWe formally request that the Community Development Department dispatch a code enforcement officer to document the violations and issue a formal notice of non-compliance to the responsible contractor. We further request that the City impose daily fines for each subsequent violation until compliance is achieved.\n\nPlease provide confirmation that this complaint has been logged and advise on the expected timeline for enforcement action.\n\nSincerely,\nConcerned Residents of Tempe",
    department: "Tempe Community Development Department",
    official_name: "Director of Community Development, City of Tempe",
    official_email: "community@tempe.gov",
    issue_type: "noise_complaint",
    location: "Southern Ave, Tempe",
    lat: 33.3780,
    lng: -111.9400,
    echo_count: 15,
    status: "pending",
  },
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Check for a simple auth token to prevent accidental re-seeding
  if (req.headers["x-seed-token"] !== "civicpulse-seed-2026") {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const results = [];
    for (const post of SEED_POSTS) {
      const { data, error } = await insforge.database
        .from("posts")
        .insert([post])
        .select()
        .single();
      if (error) {
        results.push({ error: error.message, post: post.complaint.slice(0, 40) });
      } else {
        results.push({ id: data.id, complaint: post.complaint.slice(0, 40) });
      }
    }
    return res.status(200).json({ seeded: results.length, results });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
