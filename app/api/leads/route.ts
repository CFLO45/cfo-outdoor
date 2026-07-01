import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  // Basic validation
  if (!body.name || !body.email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const lead = {
    name: body.name,
    email: body.email,
    phone: body.phone ?? null,
    listing_id: body.boardId ?? null,
    format: body.boardType ?? null,
    market: body.county ?? null,
    budget: body.budget ?? null,
    start_date: body.startDate ?? null,
    notes: body.notes ?? null,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    const { error } = await supabase.from("leads").insert(lead);
    if (error) {
      console.error("Supabase insert failed:", error.message);
      return NextResponse.json({ error: "Could not save lead." }, { status: 500 });
    }
  } else {
    // No Supabase configured yet -- log so leads aren't silently lost during
    // local dev / before the database is wired up.
    console.log("New lead (Supabase not configured):", lead);
  }

  return NextResponse.json({ ok: true });
}
