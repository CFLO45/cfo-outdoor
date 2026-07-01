"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { counties, cities, countyName, Board } from "@/lib/data";
import { getBoards } from "@/lib/boards";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const PIN_COLOR_STATIC = "#B5462D";
const PIN_COLOR_DIGITAL = "#1C2321";

export default function InventoryMap() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [countyFilter, setCountyFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [active, setActive] = useState<Board | null>(null);

  useEffect(() => {
    getBoards()
      .then(setBoards)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const cityObj = cities.find((c) => c.slug === cityFilter);
    return boards.filter(
      (b) =>
        (typeFilter === "all" || b.board_type === typeFilter) &&
        (countyFilter === "all" || b.county === countyFilter) &&
        (cityFilter === "all" || (cityObj && cityObj.zips.includes(b.zip_code)))
    );
  }, [boards, typeFilter, countyFilter, cityFilter]);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white"
        >
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white"
        >
          <option value="all">All types</option>
          <option value="static">Static</option>
          <option value="digital">Digital</option>
        </select>
        <select
          value={countyFilter}
          onChange={(e) => setCountyFilter(e.target.value)}
          className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white"
        >
          <option value="all">All counties</option>
          {counties.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <span className="text-sm text-ink/50 self-center">
          {loading ? "Loading..." : `${filtered.length} board${filtered.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {!MAPBOX_TOKEN ? (
        <div className="rounded-2xl border border-dashed border-ink/20 bg-white p-10 text-center">
          <p className="text-ink/60 max-w-md mx-auto">
            Map preview needs a Mapbox token. Set{" "}
            <code className="bg-ink/5 px-1.5 py-0.5 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> in
            your environment variables, then this map renders live pins for every board below.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 mt-8 text-left">
            {filtered.map((b) => (
              <BoardListItem key={b.id} board={b} />
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-ink/10 h-[520px] relative">
          <Map
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{ longitude: -81.6, latitude: 28.3, zoom: 8 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/light-v11"
          >
            {filtered.map((b) => (
              <Marker
                key={b.id}
                longitude={b.longitude}
                latitude={b.latitude}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setActive(b);
                }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 border-white shadow cursor-pointer"
                  style={{ background: b.board_type === "digital" ? PIN_COLOR_DIGITAL : PIN_COLOR_STATIC }}
                />
              </Marker>
            ))}
            {active && (
              <Popup
                longitude={active.longitude}
                latitude={active.latitude}
                onClose={() => setActive(null)}
                closeOnClick={false}
                anchor="bottom"
              >
                <div className="text-sm w-[220px]">
                  {active.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={active.photo_url}
                      alt={`Board ${active.board_number}`}
                      className="w-full h-28 object-cover rounded-lg mb-2"
                    />
                  )}
                  <p className="font-semibold mb-1">Board #{active.board_number}</p>
                  <p className="text-ink/60 capitalize mb-1">
                    {active.board_type} &middot; {active.size}
                  </p>
                  {active.location_description && (
                    <p className="text-ink/70 text-xs mb-1">{active.location_description}</p>
                  )}
                  <p className="text-ink/60 mb-1">
                    {countyName(active.county)} &middot; {active.zip_code}
                  </p>
                  <p className="text-ink/70 mb-2">
                    {active.weekly_impressions === 0
                      ? "Impressions unavailable"
                      : `${active.weekly_impressions.toLocaleString()} weekly impressions`}
                  </p>
                  {active.board_type === "digital" && (
                    <p className="text-xs text-ink/50 mb-2">
                      {active.spots ?? "—"} spots &middot; {active.loop_seconds ?? "—"}s loop
                    </p>
                  )}
                  <Link href={`/quote?board=${active.id}`} className="text-rust font-medium hover:underline">
                    Request a quote &rarr;
                  </Link>
                </div>
              </Popup>
            )}
          </Map>
        </div>
      )}

      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#B5462D" }} />
          <span className="text-sm text-ink/60">Static billboard</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#1C2321" }} />
          <span className="text-sm text-ink/60">Digital billboard</span>
        </div>
      </div>
    </div>
  );
}

function BoardListItem({ board }: { board: Board }) {
  return (
    <div className="p-4 rounded-xl border border-ink/10 bg-sand">
      <p className="font-medium">Board #{board.board_number}</p>
      <p className="text-sm text-ink/60">
        {countyName(board.county)} &middot; {board.zip_code}
      </p>
      <Link href={`/quote?board=${board.id}`} className="text-sm text-rust font-medium hover:underline">
        Request a quote &rarr;
      </Link>
    </div>
  );
}
