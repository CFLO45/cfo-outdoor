import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoard } from "@/lib/boards";
import { countyName } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function BoardDetailPage({ params }: { params: { id: string } }) {
  const board = await getBoard(params.id);
  if (!board) notFound();

  const streetViewUrl = `https://www.google.com/maps?q=&layer=c&cbll=${board.latitude},${board.longitude}&cbp=12,0,,0,0`;
  const mapsUrl = `https://www.google.com/maps?q=${board.latitude},${board.longitude}`;
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const thumbnailUrl = googleKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${board.latitude},${board.longitude}&zoom=14&size=1200x400&maptype=satellite&markers=color:red%7Csize:small%7C${board.latitude},${board.longitude}&key=${googleKey}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link href={`/counties/${board.county}`} className="text-sm text-ink/50 hover:text-rust">
        &larr; {countyName(board.county)}
      </Link>

      <div className="mt-6 rounded-2xl overflow-hidden border border-ink/10">
        {board.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={board.photo_url} alt={`Board ${board.board_number}`} className="w-full h-64 object-cover" />
        ) : thumbnailUrl ? (
          <a href={streetViewUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailUrl} alt={`Satellite view of board ${board.board_number}`} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <span className="text-white font-medium">View in Street View →</span>
            </div>
          </a>
        ) : (
          <div className="w-full h-64 bg-ink/5 flex items-center justify-center text-ink/30">
            No image available
          </div>
        )}
      </div>

      <div className="mt-8 grid md:grid-cols-[1fr_280px] gap-8">
        <div>
          <h1 className="text-4xl mb-6">Board #{board.board_number}</h1>

          <div className="grid gap-4">
            <Row label="Type" value={<span className="capitalize">{board.board_type}</span>} />
            <Row label="Size" value={board.size} />
            {board.location_description && (
              <Row label="Location" value={board.location_description} />
            )}
            <Row label="County" value={countyName(board.county)} />
            <Row label="Zip Code" value={board.zip_code} />
            <Row label="Coordinates" value={`${board.latitude}, ${board.longitude}`} />
            {board.operator && (
              <Row label="Operator" value={board.operator} />
            )}
            <Row
              label="Weekly Impressions (18+)"
              value={board.weekly_impressions === 0 ? "Unavailable" : board.weekly_impressions.toLocaleString()}
            />
            {board.board_type === "digital" && (
              <>
                <Row label="Spots" value={board.spots != null ? String(board.spots) : "—"} />
                <Row label="Loop" value={board.loop_seconds != null ? `${board.loop_seconds}s` : "—"} />
              </>
            )}
          </div>

          <div className="flex gap-4 mt-8">
            <a
              href={streetViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-ink/20 px-5 py-2.5 rounded-full text-sm font-medium hover:border-rust hover:text-rust transition-colors"
            >
              Street View →
            </a>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-ink/20 px-5 py-2.5 rounded-full text-sm font-medium hover:border-rust hover:text-rust transition-colors"
            >
              Google Maps →
            </a>
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded-2xl p-6 h-fit">
          <h2 className="text-lg mb-2">Interested in this board?</h2>
          <p className="text-sm text-ink/60 mb-5">
            Request a quote and we&apos;ll follow up with availability and pricing.
          </p>
          <Link
            href={`/quote?board=${board.id}`}
            className="block text-center bg-ink text-sand px-5 py-3 rounded-full font-medium hover:bg-rust transition-colors text-sm"
          >
            Request a quote
          </Link>
          <p className="text-xs text-ink/40 text-center mt-3">
            No commitment required
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-ink/5">
      <span className="text-sm text-ink/50 w-48 shrink-0">{label}</span>
      <span className="text-sm text-ink">{value}</span>
    </div>
  );
}
