import Link from "next/link";
import { notFound } from "next/navigation";
import { counties } from "@/lib/data";
import { getBoards } from "@/lib/boards";
import BoardCard from "@/components/BoardCard";

export const dynamic = "force-dynamic";

export default async function CountyDetailPage({ params }: { params: { slug: string } }) {
  const county = counties.find((c) => c.slug === params.slug);
  if (!county) notFound();

  const boards = (await getBoards()).filter((b) => b.county === county.slug);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link href="/counties" className="text-sm text-ink/50 hover:text-rust">
        &larr; All counties
      </Link>
      <h1 className="text-4xl mt-4 mb-10">{county.name}</h1>

      {boards.length === 0 ? (
        <p className="text-ink/50">No boards added in this county yet.</p>
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
