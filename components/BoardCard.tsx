import Link from "next/link";
import { Board, countyName } from "@/lib/data";

export default function BoardCard({ board }: { board: Board }) {
  const streetViewUrl = `https://www.google.com/maps?q=&layer=c&cbll=${board.latitude},${board.longitude}&cbp=12,0,,0,0`;
  const mapsUrl = `https://www.google.com/maps?q=${board.latitude},${board.longitude}`;
  const thumbnailUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${board.latitude},${board.longitude}&zoom=14&size=560x240&maptype=satellite&markers=color:red%7Csize:small%7C${board.latitude},${board.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`;

  return (
    <div className="rounded-2xl bg-white border border-ink/10 overflow-hidden flex flex-col">
      {board.photo_url ? (
        <a href={streetViewUrl} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={board.photo_url} alt={`Board ${board.board_number}`} className="h-40 w-full object-cover hover:opacity-90 transition-opacity" />
        </a>
      ) : process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ? (
        <a href={streetViewUrl} target="_blank" rel="noopener noreferrer" className="block relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={`Satellite view of board ${board.board_number}`}
            className="h-40 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
            <span className="text-white text-sm font-medium">View in Street View →</span>
          </div>
        </a>
      ) : (
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="block h-40 w-full bg-ink/5 flex items-center justify-center text-ink/30 text-sm hover:bg-ink/10 transition-colors">
          <span className="flex flex-col items-center gap-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
              <circle cx="12" cy="9" r="2.5"/>
            </svg>
            View on Google Maps
          </span>
        </a>
      )}
      <div className="p-5 flex flex-col gap-2">
        <Link href={`/boards/${board.id}`} className="text-lg hover:text-rust transition-colors">
          Board #{board.board_number}
        </Link>
        <p className="text-sm text-ink/60 capitalize">
          {board.board_type} &middot; {board.size}
        </p>
        {board.location_description && (
          <p className="text-sm text-ink/70">{board.location_description}</p>
        )}
        <p className="text-xs text-ink/40">
          {countyName(board.county)} &middot; {board.zip_code}
        </p>
        {board.operator && (
          <p className="text-xs text-ink/40">Operator: {board.operator}</p>
        )}
        <p className="text-sm text-ink/70 mt-1">
          {board.weekly_impressions === 0
            ? "Impressions unavailable"
            : `${board.weekly_impressions.toLocaleString()} weekly impressions (18+)`}
        </p>
        {board.board_type === "digital" && (
          <p className="text-xs text-ink/50">
            {board.spots ?? "—"} spots &middot; {board.loop_seconds ?? "—"}s loop
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <Link href={`/quote?board=${board.id}`} className="text-sm font-medium text-rust hover:underline">
            Request a quote &rarr;
          </Link>
          <a href={streetViewUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-ink/40 hover:text-rust transition-colors">
            Street View
          </a>
        </div>
      </div>
    </div>
  );
}
