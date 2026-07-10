import Link from "next/link";
import { getBoards } from "@/lib/boards";

export const dynamic = "force-dynamic";

const types = [
  { slug: "static", name: "Static Billboards", description: "Printed posters and bulletins." },
  { slug: "digital", name: "Digital Billboards", description: "Rotating digital displays sold by spot." },
];

export default async function BoardTypesPage() {
  const boards = await getBoards();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">Browse by type</p>
      <h1 className="text-4xl mb-10">Board Types</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {types.map((t) => {
          const count = boards.filter((b) => b.board_type === t.slug).length;
          return (
            <Link
              key={t.slug}
              href={`/board-types/${t.slug}`}
              className="block p-6 rounded-2xl bg-white border border-ink/10 hover:border-rust transition-colors"
            >
              <h2 className="text-lg mb-2">{t.name}</h2>
              <p className="text-sm text-ink/60 mb-3">{t.description}</p>
              <p className="text-xs text-ink/40">
                {count} board{count === 1 ? "" : "s"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
