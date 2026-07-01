import Link from "next/link";
import { cities } from "@/lib/data";
import { getBoards } from "@/lib/boards";

export const dynamic = "force-dynamic";

export default async function CitiesPage() {
  const boards = await getBoards();

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">Browse by city</p>
      <h1 className="text-4xl mb-10">Cities</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cities.map((c) => {
          const count = boards.filter((b) => c.zips.includes(b.zip_code)).length;
          return (
            <Link
              key={c.slug}
              href={`/cities/${c.slug}`}
              className="block p-6 rounded-2xl bg-white border border-ink/10 hover:border-rust transition-colors"
            >
              <h2 className="text-lg mb-1">{c.name}</h2>
              <p className="text-sm text-ink/60">
                {count} board{count === 1 ? "" : "s"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
