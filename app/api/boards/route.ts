import { NextResponse } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const HIDDEN_COUNTIES = ['polk'];
const PAGE_SIZE = 1000;

// Only fetch fields the map needs — significantly less data than select=*
const MAP_FIELDS = "id,board_number,board_type,latitude,longitude,location_description,county,zip_code,weekly_impressions,size,spots,loop_seconds,photo_url";

export async function GET(request: Request) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return NextResponse.json([], { status: 200 });
  }

  const { searchParams } = new URL(request.url);
  const minLat = searchParams.get("minLat");
  const maxLat = searchParams.get("maxLat");
  const minLng = searchParams.get("minLng");
  const maxLng = searchParams.get("maxLng");
  const boardNumber = searchParams.get("boardNumber");

  const countyFilter = HIDDEN_COUNTIES.map(c => `county=neq.${c}`).join('&');

  // Viewport bounds — only applied when all four are present (default unfiltered map view).
  // Geographic filters (county/city) request the full set instead, since we don't have
  // per-county bounding boxes to auto-fit the map to a selected area.
  const boundsFilter =
    minLat && maxLat && minLng && maxLng
      ? `&latitude=gte.${minLat}&latitude=lte.${maxLat}&longitude=gte.${minLng}&longitude=lte.${maxLng}`
      : "";

  // Direct board-number lookup ignores viewport bounds entirely — a searched board must be
  // findable regardless of what's currently in view.
  const boardNumberFilter = boardNumber
    ? `&board_number=eq.${encodeURIComponent(boardNumber)}`
    : "";

  const allBoards: any[] = [];
  let offset = 0;

  try {
    while (true) {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/boards?select=${MAP_FIELDS}&${countyFilter}${boundsFilter}${boardNumberFilter}&order=created_at.desc`,
        {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Range: `${offset}-${offset + PAGE_SIZE - 1}`,
            "Range-Unit": "items",
            Prefer: "count=none",
          },
          // Board-number lookups must always be fresh; everything else keeps the 5 min cache.
          next: { revalidate: boardNumber ? 0 : 300 },
        }
      );
      if (!res.ok) break;
      const page = await res.json();
      allBoards.push(...page);
      if (page.length < PAGE_SIZE) break;
      offset += PAGE_SIZE;
    }

    return NextResponse.json(allBoards, {
      headers: boardNumber
        ? { "Cache-Control": "no-store" }
        : { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (err) {
    console.error("Board fetch error:", err);
    return NextResponse.json(allBoards);
  }
}
