import Link from "next/link";
import { counties, cities } from "@/lib/data";
import { getBoards } from "@/lib/boards";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const boards = await getBoards();

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <p className="eyebrow text-rust mb-4">Central Florida &middot; Out-of-Home</p>
        <h1 className="text-5xl md:text-6xl leading-[1.05] max-w-3xl mb-6">
          Billboards across Central Florida.
        </h1>
        <p className="text-lg text-ink/70 max-w-xl mb-8">
          Browse {boards.length} static and digital billboards across Central Florida.
          Pick what fits your campaign, then request a quote &mdash; no account needed.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/map"
            className="bg-ink text-sand px-6 py-3 rounded-full font-medium hover:bg-rust transition-colors"
          >
            Browse the map
          </Link>
          <Link
            href="/quote"
            className="border border-ink px-6 py-3 rounded-full font-medium hover:border-rust hover:text-rust transition-colors"
          >
            Request a quote
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink/10">
        <h2 className="text-2xl mb-8">Board Types</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/board-types/static"
            className="block p-6 rounded-2xl bg-white border border-ink/10 hover:border-rust transition-colors"
          >
            <h3 className="text-lg mb-2">Static Billboards</h3>
            <p className="text-sm text-ink/60">Printed posters and bulletins.</p>
          </Link>
          <Link
            href="/board-types/digital"
            className="block p-6 rounded-2xl bg-white border border-ink/10 hover:border-rust transition-colors"
          >
            <h3 className="text-lg mb-2">Digital Billboards</h3>
            <p className="text-sm text-ink/60">Rotating digital displays sold by spot.</p>
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink/10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl">Cities</h2>
          <Link href="/cities" className="text-sm text-rust hover:underline">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities.map((c) => {
            const count = boards.filter((b) => c.zips.includes(b.zip_code)).length;
            return (
              <Link
                key={c.slug}
                href={`/cities/${c.slug}`}
                className="block p-5 rounded-2xl bg-white border border-ink/10 hover:border-rust transition-colors"
              >
                <h3 className="text-base mb-1">{c.name}</h3>
                <p className="text-xs text-ink/50">
                  {count} board{count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-ink/10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-2xl">Counties</h2>
          <Link href="/counties" className="text-sm text-rust hover:underline">View all</Link>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {counties.map((c) => {
            const count = boards.filter((b) => b.county === c.slug).length;
            return (
              <Link
                key={c.slug}
                href={`/counties/${c.slug}`}
                className="block p-5 rounded-2xl bg-white border border-ink/10 hover:border-rust transition-colors"
              >
                <h3 className="text-base mb-1">{c.name}</h3>
                <p className="text-xs text-ink/50">
                  {count} board{count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
