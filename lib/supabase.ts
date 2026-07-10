import { createClient } from "@supabase/supabase-js";

// Reads from environment variables set in Vercel project settings:
//   NEXT_PUBLIC_SUPABASE_URL
//   NEXT_PUBLIC_SUPABASE_ANON_KEY
// Falls back to null during local dev / before Supabase is connected so the
// app doesn't crash -- callers should check for null and fall back to
// console logging (see app/api/leads/route.ts).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;
