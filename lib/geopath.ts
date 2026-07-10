// Geopath sync -- NOT YET IMPLEMENTED.
//
// Plan (from chat history): a scheduled job (Vercel Cron or similar) pulls
// board location + audience metrics from Geopath's member API on a weekly
// cadence and writes them into Supabase. The app then reads from Supabase,
// never live from Geopath, so request volume stays low (est. under 500
// calls/month for a Central Florida-only scope).
//
// Before wiring this up:
//   1. Confirm the exact API base URL, auth method, and pagination params
//      from the Geopath member portal (varies by account).
//   2. Confirm membership terms allow this data to be displayed on a public,
//      commercial site -- not just internal planning use.
//
// Suggested shape once implemented:
//
// export async function syncGeopathMarket(marketSlug: string) {
//   const res = await fetch(`${GEOPATH_BASE_URL}/locations?market=${marketSlug}`, {
//     headers: { Authorization: `Bearer ${process.env.GEOPATH_API_KEY}` },
//   });
//   const data = await res.json();
//   // map data -> Listing[] shape from lib/data.ts, upsert into Supabase
// }

export {};
