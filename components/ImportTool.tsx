"use client";

import { useState } from "react";
import Link from "next/link";
import { counties, BoardType } from "@/lib/data";
import { importBoards } from "@/lib/boards";

type ParsedRow = {
  board_number: string;
  board_type: BoardType;
  weekly_impressions: number;
  size: string;
  county: string;
  zip_code: string;
  latitude: number;
  longitude: number;
  spots: number | null;
  loop_seconds: number | null;
  location_description: string | null;
  operator: string | null;
  photo_url: null;
};

type RowError = { row: number; message: string };

const VALID_COUNTIES = counties.map((c) => c.slug);

// Maps full county names to slugs
const COUNTY_MAP: Record<string, string> = {
  "alachua": "alachua",
  "alachua county": "alachua",
  "alachua county, fl": "alachua",
  "marion": "marion",
  "marion county": "marion",
  "marion county, fl": "marion",
  "citrus": "citrus",
  "citrus county": "citrus",
  "citrus county, fl": "citrus",
  "hernando": "hernando",
  "hernando county": "hernando",
  "hernando county, fl": "hernando",
  "sumter": "sumter",
  "sumter county": "sumter",
  "sumter county, fl": "sumter",
  "levy": "levy",
  "levy county": "levy",
  "levy county, fl": "levy",
  "lake county": "lake",
  "lake county, fl": "lake",
  "orange": "orange",
  "orange county": "orange",
  "orange county, fl": "orange",
  "seminole": "seminole",
  "seminole county": "seminole",
  "seminole county, fl": "seminole",
  "osceola": "osceola",
  "osceola county": "osceola",
  "osceola county, fl": "osceola",
  "polk": "polk",
  "polk county": "polk",
  "polk county, fl": "polk",
  "volusia": "volusia",
  "volusia county": "volusia",
  "volusia county, fl": "volusia",
  "brevard": "brevard",
  "brevard county": "brevard",
  "brevard county, fl": "brevard",
};

// Maps header variations to field names
const HEADER_MAP: Record<string, string> = {
  "board_number": "board_number",
  "inventory #": "board_number",
  "inventory#": "board_number",
  "inventory": "board_number",
  "board_type": "board_type",
  "media": "board_type",
  "weekly_impressions": "weekly_impressions",
  "imp 18+ weekly": "weekly_impressions",
  "imp 18+weekly": "weekly_impressions",
  "imp_18+_weekly": "weekly_impressions",
  "imp 18+ \nweekly": "weekly_impressions",
  "size": "size",
  "copy size": "size",
  "copy_size": "size",
  "county": "county",
  "zip_code": "zip_code",
  "zip code": "zip_code",
  "zipcode": "zip_code",
  "latitude": "latitude",
  "lat": "latitude",
  "longitude": "longitude",
  "lng": "longitude",
  "lon": "longitude",
  "long": "longitude",
  "spots": "spots",
  "spot length": "spots",
  "spot_length": "spots",
  "loop_seconds": "loop_seconds",
  "loop length": "loop_seconds",
  "loop_length": "loop_seconds",
  "location_description": "location_description",
  "location description": "location_description",
  "description": "location_description",
  "operator": "operator",
  "market": "operator",
};

function parseBoardType(val: string): BoardType | null {
  const v = val.toLowerCase().trim();
  if (v === "static" || v === "bulletins" || v === "bulletin") return "static";
  if (v === "digital" || v === "digital bulletins" || v === "digital bulletin") return "digital";
  return null;
}

function parseCounty(val: string): string {
  return COUNTY_MAP[val.toLowerCase().trim()] ?? val.toLowerCase().trim();
}

function parseNumber(val: string): number {
  return Number(val.replace(/,/g, "").replace(/\s*sec/i, "").trim());
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim()); current = "";
    } else { current += char; }
  }
  result.push(current.trim());
  return result;
}

function normalizeHeader(raw: string): string {
  return HEADER_MAP[raw.toLowerCase().trim()] ?? raw.toLowerCase().trim().replace(/\s+/g, "_");
}

function parseCSV(text: string): { rows: ParsedRow[]; errors: RowError[] } {
  const lines = text.trim().split("\n").map((l) => l.replace(/\r/g, ""));
  const rawHeaders = parseCSVLine(lines[0]);
  const headers = rawHeaders.map(normalizeHeader);
  const rows: ParsedRow[] = [];
  const errors: RowError[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = parseCSVLine(lines[i]);
    const get = (key: string) => {
      const idx = headers.indexOf(key);
      return idx >= 0 ? (cols[idx] ?? "").trim() : "";
    };

    const board_number = get("board_number");
    const board_type_raw = parseBoardType(get("board_type"));
    const weekly_impressions = parseNumber(get("weekly_impressions"));
    const size = get("size");
    const county = parseCounty(get("county"));
    const zip_code = get("zip_code");
    const latitude = Number(get("latitude"));
    const longitude = Number(get("longitude"));
    const spots_raw = get("spots");
    const spots = spots_raw ? parseNumber(spots_raw) : null;
    const loop_raw = get("loop_seconds");
    const loop_seconds = loop_raw ? parseNumber(loop_raw) : null;
    const location_description = get("location_description") || null;
    const operator = get("operator") || null;

    const rowErrors: string[] = [];
    if (!board_number) rowErrors.push("missing board_number / Inventory #");
    if (!board_type_raw) rowErrors.push("board_type must be static, digital, Bulletins, or Digital Bulletins");
    if (isNaN(weekly_impressions)) rowErrors.push("invalid weekly_impressions / IMP 18+ Weekly");
    if (!size) rowErrors.push("missing size / Copy Size");
    if (!VALID_COUNTIES.includes(county)) rowErrors.push(`unknown county '${county}'`);
    if (!zip_code) rowErrors.push("missing zip_code / Zip Code");
    if (!latitude || isNaN(latitude)) rowErrors.push("invalid latitude");
    if (!longitude || isNaN(longitude)) rowErrors.push("invalid longitude");

    if (rowErrors.length > 0) {
      errors.push({ row: i + 1, message: rowErrors.join(", ") });
    } else {
      rows.push({
        board_number,
        board_type: board_type_raw!,
        weekly_impressions,
        size,
        county,
        zip_code,
        latitude,
        longitude,
        spots,
        loop_seconds,
        location_description,
        operator,
        photo_url: null,
      });
    }
  }
  return { rows, errors };
}

export default function ImportTool() {
  const [csvText, setCsvText] = useState("");
  const [preview, setPreview] = useState<ParsedRow[] | null>(null);
  const [parseErrors, setParseErrors] = useState<RowError[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; errors: string[] } | null>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCsvText(ev.target?.result as string ?? "");
      setPreview(null);
      setResult(null);
    };
    reader.readAsText(file);
  }

  function handleParse() {
    const { rows, errors } = parseCSV(csvText);
    setPreview(rows);
    setParseErrors(errors);
    setResult(null);
  }

  async function handleImport() {
    if (!preview || preview.length === 0) return;
    setImporting(true);
    const res = await importBoards(preview);
    setResult(res);
    setImporting(false);
    if (res.errors.length === 0) {
      setCsvText("");
      setPreview(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-10">
        <Link href="/admin" className="text-sm text-ink/50 hover:text-rust">&larr; Back to admin</Link>
      </div>
      <h1 className="text-4xl mb-2">Import boards from CSV</h1>
      <p className="text-ink/60 mb-8 max-w-xl">
        Upload a CSV file or paste CSV content. Accepts both standard and proposal-style column headers.
      </p>

      <div className="bg-white border border-ink/10 rounded-2xl p-5 mb-8 text-sm">
        <p className="font-medium mb-3">Accepted column headers:</p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1.5 text-xs">
          {[
            ["board_number", "or Inventory #"],
            ["board_type", "or Media — static/Bulletins, digital/Digital Bulletins"],
            ["weekly_impressions", "or IMP 18+ Weekly — commas ok"],
            ["size", "or Copy Size"],
            ["county", "or County — slug or full name (Lake County, FL)"],
            ["zip_code", "or Zip Code"],
            ["latitude", "or Latitude"],
            ["longitude", "or Longitude"],
            ["spots", "or Spot Length — 8 or '8 sec' both ok"],
            ["loop_seconds", "or Loop Length — 64 or '64 sec' both ok"],
            ["location_description", "or Location Description — optional"],
            ["operator", "or Market — optional"],
          ].map(([name, note]) => (
            <div key={name}>
              <span className="font-medium text-ink">{name}</span>
              <span className="text-ink/40"> — {note}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <label className="cursor-pointer border border-ink/20 px-5 py-2.5 rounded-full text-sm font-medium hover:border-rust hover:text-rust transition-colors">
          Upload CSV file
          <input type="file" accept=".csv,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
        <span className="text-sm text-ink/40">or paste below</span>
      </div>

      <textarea
        value={csvText}
        onChange={(e) => { setCsvText(e.target.value); setPreview(null); setResult(null); }}
        rows={10}
        placeholder="Paste CSV content here..."
        className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm font-mono bg-white mb-4"
      />

      <button
        onClick={handleParse}
        disabled={!csvText.trim()}
        className="border border-ink px-5 py-2.5 rounded-full text-sm font-medium hover:border-rust hover:text-rust transition-colors disabled:opacity-40 mr-3"
      >
        Preview rows
      </button>

      {parseErrors.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-rust/10 border border-rust/20">
          <p className="text-sm font-medium text-rust mb-2">{parseErrors.length} row{parseErrors.length === 1 ? "" : "s"} with errors:</p>
          <ul className="text-sm text-rust/80 space-y-1">
            {parseErrors.map((e) => (
              <li key={e.row}>Row {e.row}: {e.message}</li>
            ))}
          </ul>
        </div>
      )}

      {preview && preview.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium">{preview.length} board{preview.length === 1 ? "" : "s"} ready to import</p>
            <button
              onClick={handleImport}
              disabled={importing}
              className="bg-ink text-sand px-5 py-2.5 rounded-full text-sm font-medium hover:bg-rust transition-colors disabled:opacity-50"
            >
              {importing ? "Importing..." : `Import ${preview.length} boards`}
            </button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-ink/10">
            <table className="w-full text-xs">
              <thead className="bg-ink/5">
                <tr>
                  {["#", "Type", "Impressions", "Size", "County", "Zip", "Lat", "Long", "Spots", "Loop", "Operator", "Location"].map((h) => (
                    <th key={h} className="px-3 py-2 text-left font-medium text-ink/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((r, i) => (
                  <tr key={i} className="border-t border-ink/5">
                    <td className="px-3 py-2">{r.board_number}</td>
                    <td className="px-3 py-2 capitalize">{r.board_type}</td>
                    <td className="px-3 py-2">{r.weekly_impressions.toLocaleString()}</td>
                    <td className="px-3 py-2">{r.size}</td>
                    <td className="px-3 py-2">{r.county}</td>
                    <td className="px-3 py-2">{r.zip_code}</td>
                    <td className="px-3 py-2">{r.latitude}</td>
                    <td className="px-3 py-2">{r.longitude}</td>
                    <td className="px-3 py-2">{r.spots ?? "—"}</td>
                    <td className="px-3 py-2">{r.loop_seconds ?? "—"}</td>
                    <td className="px-3 py-2">{r.operator ?? "—"}</td>
                    <td className="px-3 py-2 max-w-[200px] truncate">{r.location_description ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (
        <div className={`mt-6 p-4 rounded-xl border ${result.errors.length === 0 ? "bg-citrus/10 border-citrus/30" : "bg-rust/10 border-rust/20"}`}>
          <p className="font-medium text-sm mb-1">
            {result.imported} board{result.imported === 1 ? "" : "s"} imported successfully.
            {result.errors.length > 0 && ` ${result.errors.length} failed.`}
          </p>
          {result.errors.length > 0 && (
            <ul className="text-sm text-rust/80 space-y-1 mt-2">
              {result.errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          )}
          {result.errors.length === 0 && (
            <Link href="/admin" className="text-sm text-citrus font-medium hover:underline">Back to admin &rarr;</Link>
          )}
        </div>
      )}
    </div>
  );
}
