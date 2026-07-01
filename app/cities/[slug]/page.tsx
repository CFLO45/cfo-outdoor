import Link from "next/link";
import { notFound } from "next/navigation";
import { cities } from "@/lib/data";
import { getBoards } from "@/lib/boards";
import BoardCard from "@/components/BoardCard";

export const dynamic = "force-dynamic";

export default async function CityDetailPage({ params }: { params: { slug: string } }) {
  const city = cities.find((c) => c.slug === params.slug);
  if (!city) notFound();

  const boards = (await getBoards()).filter((b) => city.zips.includes(b.zip_code));

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link href="/cities" className="text-sm text-ink/50 hover:text-rust">
        &larr; All cities
      </Link>
      <h1 className="text-4xl mt-4 mb-2">{city.name}</h1>
      <p className="text-ink/60 mb-10">
        {boards.length} board{boards.length === 1 ? "" : "s"} available
      </p>

      {boards.length === 0 ? (
        <p className="text-ink/50">No boards added in this city yet &mdash; check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {boards.map((b) => (
            <BoardCard key={b.id} board={b} />
          ))}
        </div>
      )}
    </div>
  );
}
