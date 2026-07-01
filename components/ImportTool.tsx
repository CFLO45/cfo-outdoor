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
  photo_url: null;
};

type RowError = { row: number; message: string };

const VALID_COUNTIES = counties.map((c) => c.slug);
const VALID_TYPES = ["static", "digital"];

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote inside quoted field
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(text: string): { rows: ParsedRow[]; errors: RowError[] } {
  const lines = text.trim().split("\n").map((l) => l.replace(/\r/g, ""));
  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, "_"));
  const rows: ParsedRow[] = [];
  const errors: RowError[] = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cols = parseCSVLine(lines[i]);
    const get = (key: string) => cols[headers.indexOf(key)] ?? "";

    const board_number = get("board_number");
    const board_type = get("board_type").toLowerCase();
    const weekly_impressions_raw = get("weekly_impressions").replace(/,/g, "");
    const weekly_impressions = weekly_impressions_raw === "" ? NaN : Number(weekly_impressions_raw);
    const size = get("size");
    const county = get("county").toLowerCase();
    const zip_code = get("zip_code");
    const latitude = Number(get("latitude"));
    const longitude = Number(get("longitude"));
    const spots = get("spots") ? Number(get("spots")) : null;
    const loop_seconds = get("loop_seconds") ? Number(get("loop_seconds")) : null;
    const location_description = get("location_description") || null;

    const rowErrors: string[] = [];
    if (!board_number) rowErrors.push("missing board_number");
    if (!VALID_TYPES.includes(board_type)) rowErrors.push(`board_type must be 'static' or 'digital'`);
    if (weekly_impressions === undefined || isNaN(weekly_impressions)) rowErrors.push("invalid weekly_impressions");
    if (!size) rowErrors.push("missing size");
    if (!VALID_COUNTIES.includes(county)) rowErrors.push(`unknown county '${county}' — use lowercase slug`);
    if (!zip_code) rowErrors.push("missing zip_code");
    if (!latitude || isNaN(latitude)) rowErrors.push("invalid latitude");
    if (!longitude || isNaN(longitude)) rowErrors.push("invalid longitude");

    if (rowErrors.length > 0) {
      errors.push({ row: i + 1, message: rowErrors.join(", ") });
    } else {
      rows.push({
        board_number,
        board_type: board_type as BoardType,
        weekly_impressions,
        size,
        county,
        zip_code,
        latitude,
        longitude,
        spots,
        loop_seconds,
        location_description,
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
        Export your spreadsheet as a CSV with the columns below, paste it in, preview the rows, then import.
      </p>

      <div className="bg-white border border-ink/10 rounded-2xl p-5 mb-8 text-sm">
        <p className="font-medium mb-2">Required column headers (exact names, row 1):</p>
        <code className="text-xs text-ink/70 break-all">
          board_number, board_type, weekly_impressions, size, county, zip_code, latitude, longitude, spots, loop_seconds, location_description
        </code>
        <ul className="mt-3 text-ink/60 space-y-1 text-xs">
          <li><span className="font-medium text-ink">board_type</span> — must be <code>static</code> or <code>digital</code></li>
          <li><span className="font-medium text-ink">county</span> — lowercase slug: alachua, marion, citrus, hernando, sumter, lake, orange, seminole, osceola, polk, volusia, brevard</li>
          <li><span className="font-medium text-ink">spots / loop_seconds</span> — digital boards only, leave blank for static</li>
          <li><span className="font-medium text-ink">weekly_impressions</span> — numbers only, no commas</li>
          <li><span className="font-medium text-ink">location_description</span> — optional, e.g. SR 200, .3 mi SW/O SW 99th St Rd; S/S</li>
        </ul>
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
          <p className="text-sm font-medium text-rust mb-2">{parseErrors.length} row{parseErrors.length === 1 ? "" : "s"} with errors — fix these before importing:</p>
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
                  {["#", "Type", "Impressions", "Size", "County", "Zip", "Lat", "Long", "Spots", "Loop", "Location"].map((h) => (
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
