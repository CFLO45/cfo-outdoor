import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoards } from "@/lib/boards";
import BoardCard from "@/components/BoardCard";

export const dynamic = "force-dynamic";

const typeNames: Record<string, string> = {
  static: "Static Billboards",
  digital: "Digital Billboards",
};

export default async function BoardTypeDetailPage({ params }: { params: { slug: string } }) {
  const name = typeNames[params.slug];
  if (!name) notFound();

  const boards = (await getBoards()).filter((b) => b.board_type === params.slug);

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Link href="/board-types" className="text-sm text-ink/50 hover:text-rust">
        &larr; All board types
      </Link>
      <h1 className="text-4xl mt-4 mb-10">{name}</h1>

      {boards.length === 0 ? (
        <p className="text-ink/50">No boards added in this category yet.</p>
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
