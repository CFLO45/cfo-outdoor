"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Map, { Marker, Popup, MapRef } from "react-map-gl";
import { useRef } from "react";
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
  const [activeGroup, setActiveGroup] = useState<Board[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const mapRef = useRef<MapRef>(null);

  const handlePinClick = useCallback((board: Board, allBoards: Board[], e: any) => {
    e.originalEvent.stopPropagation();
    // Find all boards at this exact location
    const group = allBoards.filter(
      (b) => b.latitude === board.latitude && b.longitude === board.longitude
    );
    setActive(board);
    setActiveGroup(group);
    mapRef.current?.flyTo({
      center: [board.longitude, board.latitude],
      duration: 500,
    });
  }, []);

  const [userPin, setUserPin] = useState<{ lat: number; lng: number } | null>(null);
  const [boardSearch, setBoardSearch] = useState("");

  async function handleBoardSearch() {
    const query = boardSearch.trim();
    if (!query) return;
    // Looked up directly against the database rather than the currently-loaded boards —
    // with viewport-based loading, the board being searched for may not be in view yet.
    try {
      const res = await fetch(`/api/boards?boardNumber=${encodeURIComponent(query)}`);
      const data: Board[] = await res.json();
      const match = data[0];
      if (match) {
        setBoards((prev) => (prev.some((b) => b.id === match.id) ? prev : [...prev, ...data]));
        setActive(match);
        mapRef.current?.flyTo({
          center: [match.longitude, match.latitude],
          zoom: 14,
          duration: 800,
        });
      }
    } catch {
      // matches prior behavior — a failed/no-match search just does nothing
    }
  }

  async function handleAddressSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchInput.trim() || !MAPBOX_TOKEN) return;
    setSearching(true);
    setSearchError(null);
    try {
      const query = encodeURIComponent(searchInput.trim());
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_TOKEN}&country=us&limit=1`
      );
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setUserPin({ lat, lng });
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 11, duration: 800 });
      } else {
        setSearchError("Address not found. Try a more specific address.");
      }
    } catch {
      setSearchError("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchBoards = useCallback(async (params?: URLSearchParams) => {
    setLoading(true);
    try {
      const query = params && params.toString() ? `?${params.toString()}` : "";
      const res = await fetch(`/api/boards${query}`);
      const data = await res.json();
      setBoards(data);
    } catch {
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetches boards for whatever's relevant right now: the current map viewport by default,
  // or the full dataset when a county/city filter is active (we don't have per-county bounding
  // boxes to auto-fit the map, so filtered views fall back to fetching everything and filtering
  // client-side, same as before viewport loading existed).
  const fetchForCurrentView = useCallback(() => {
    if (countyFilter !== "all" || cityFilter !== "all") {
      fetchBoards();
      return;
    }
    const map = mapRef.current?.getMap();
    if (!map) return;
    const bounds = map.getBounds();
    const params = new URLSearchParams({
      minLat: bounds.getSouth().toString(),
      maxLat: bounds.getNorth().toString(),
      minLng: bounds.getWest().toString(),
      maxLng: bounds.getEast().toString(),
    });
    fetchBoards(params);
  }, [countyFilter, cityFilter, fetchBoards]);

  const debouncedFetchForCurrentView = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchForCurrentView, 300);
  }, [fetchForCurrentView]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Re-fetch immediately (no debounce) whenever the county/city filter changes, since that
  // switches between viewport-bound and full-dataset fetching.
  useEffect(() => {
    fetchForCurrentView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countyFilter, cityFilter]);

  const filtered = useMemo(() => {
    const cityObj = cities.find((c) => c.slug === cityFilter);
    return boards.filter(
      (b) =>
        (typeFilter === "all" || b.board_type === typeFilter) &&
        (countyFilter === "all" || b.county === countyFilter) &&
        (cityFilter === "all" || (cityObj && cityObj.zips.includes(b.zip_code)))
    );
  }, [boards, typeFilter, countyFilter, cityFilter]);

  // Deduplicate pins — only show one pin per unique lat/long
  const uniquePins = useMemo(() => {
    const seen = new Set<string>();
    return filtered.filter((b) => {
      const key = `${b.latitude},${b.longitude}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [filtered]);

  return (
    <div>
      <form onSubmit={handleAddressSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Enter an address or intersection to find nearby boards..."
          className="flex-1 border border-ink/15 rounded-full px-4 py-2 text-sm bg-white"
        />
        <button
          type="submit"
          disabled={searching || !searchInput.trim()}
          className="bg-ink text-sand px-5 py-2 rounded-full text-sm font-medium hover:bg-rust transition-colors disabled:opacity-40"
        >
          {searching ? "Searching..." : "Go"}
        </button>
      </form>
      {searchError && <p className="text-rust text-sm mb-3">{searchError}</p>}
      <div className="flex flex-wrap gap-3 mb-6">
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
        <div className="flex gap-2 ml-auto">
          <input
            type="text"
            value={boardSearch}
            onChange={(e) => setBoardSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBoardSearch()}
            placeholder="Board #"
            className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white w-28"
          />
          <button
            onClick={handleBoardSearch}
            disabled={!boardSearch.trim()}
            className="border border-ink/15 rounded-full px-4 py-2 text-sm bg-white hover:border-rust hover:text-rust transition-colors disabled:opacity-40"
          >
            Find
          </button>
        </div>
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
            ref={mapRef}
            mapboxAccessToken={MAPBOX_TOKEN}
            initialViewState={{ longitude: -81.6, latitude: 28.3, zoom: 8 }}
            style={{ width: "100%", height: "100%" }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            onLoad={fetchForCurrentView}
            onMoveEnd={debouncedFetchForCurrentView}
          >
            {userPin && (
              <Marker longitude={userPin.lng} latitude={userPin.lat}>
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full border-2 border-white shadow-lg" style={{ background: "#3F7D58" }} />
                </div>
              </Marker>
            )}
            {uniquePins.map((b) => (
              <Marker
                key={b.id}
                longitude={b.longitude}
                latitude={b.latitude}
                onClick={(e) => handlePinClick(b, filtered, e)}
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
                onClose={() => { setActive(null); setActiveGroup([]); }}
                closeOnClick={false}
                anchor="bottom"
              >
                <div className="text-sm w-[240px] max-h-[320px] overflow-y-auto">
                  {activeGroup.length > 1 && (
                    <p className="text-xs text-ink/50 mb-2 font-medium">{activeGroup.length} boards at this location</p>
                  )}
                  {activeGroup.map((b, i) => (
                    <div key={b.id} className={i > 0 ? "border-t border-ink/10 pt-3 mt-3" : ""}>
                      {b.photo_url && i === 0 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.photo_url} alt={`Board ${b.board_number}`} className="w-full h-28 object-cover rounded-lg mb-2" />
                      )}
                      <Link href={`/boards/${b.id}`} className="font-semibold text-rust hover:underline block">
                        Board #{b.board_number}
                      </Link>
                      <p className="text-ink/60 capitalize mb-1">
                        {b.board_type} &middot; {b.size}
                      </p>
                      {b.location_description && (
                        <p className="text-ink/70 text-xs mb-1">{b.location_description}</p>
                      )}
                      <p className="text-ink/60 mb-1">
                        {countyName(b.county)} &middot; {b.zip_code}
                      </p>
                      <p className="text-ink/70 mb-2">
                        {b.weekly_impressions === 0
                          ? "Impressions unavailable"
                          : `${b.weekly_impressions.toLocaleString()} weekly impressions`}
                      </p>
                      {b.board_type === "digital" && (
                        <p className="text-xs text-ink/50 mb-2">
                          {b.spots ?? "—"} spots &middot; {b.loop_seconds ?? "—"}s loop
                        </p>
                      )}
                      <Link href={`/quote?board=${b.id}`} className="text-rust font-medium hover:underline text-xs">
                        Request a quote &rarr;
                      </Link>
                    </div>
                  ))}
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
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#3F7D58" }} />
          <span className="text-sm text-ink/60">Your location</span>
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
