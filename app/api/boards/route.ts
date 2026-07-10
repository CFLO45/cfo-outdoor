import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const HIDDEN_COUNTIES = ['polk'];
const PAGE_SIZE = 1000;

// Only fetch fields the map needs — significantly less data than select=*
const MAP_FIELDS = "id,board_number,board_type,latitude,longitude,location_description,county,zip_code,weekly_impressions,size,spots,loop_seconds,photo_url";

export async function GET() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json([], { status: 200 });
  }

  const countyFilter = HIDDEN_COUNTIES.map(c => `county=neq.${c}`).join('&');
  const allBoards: any[] = [];
  let offset = 0;

  try {
    while (true) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/boards?select=${MAP_FIELDS}&${countyFilter}&order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Range: `${offset}-${offset + PAGE_SIZE - 1}`,
            "Range-Unit": "items",
            Prefer: "count=none",
          },
          next: { revalidate: 300 }, // cache for 5 minutes server-side
        }
      );
      if (!res.ok) break;
      const page = await res.json();
      allBoards.push(...page);
      if (page.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    return NextResponse.json(allBoards, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("Board fetch error:", err);
    return NextResponse.json(allBoards);
  }
}
