import Link from "next/link";
import { Board, countyName } from "@/lib/data";

export default function BoardCard({ board }: { board: Board }) {
  return (
    <div className="rounded-2xl bg-white border border-ink/10 overflow-hidden flex flex-col">
      {board.photo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={board.photo_url} alt={`Board ${board.board_number}`} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-ink/5 flex items-center justify-center text-ink/30 text-sm">
          No photo yet
        </div>
      )}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-lg">Board #{board.board_number}</h3>
        <p className="text-sm text-ink/60 capitalize">
          {board.board_type} &middot; {board.size}
        </p>
        {board.location_description && (
          <p className="text-sm text-ink/70">{board.location_description}</p>
        )}
        <p className="text-xs text-ink/40">
          {countyName(board.county)} &middot; {board.zip_code}
        </p>
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
        <Link
          href={`/quote?board=${board.id}`}
          className="mt-3 text-sm font-medium text-rust hover:underline"
        >
          Request a quote &rarr;
        </Link>
      </div>
    </div>
  );
}
