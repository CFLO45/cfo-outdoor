import Link from "next/link";

export const metadata = {
  title: "About | Central Florida Outdoor",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">Who we are</p>
      <h1 className="text-4xl mb-6">About Central Florida Outdoor</h1>
      <p className="text-lg text-ink/70 mb-12 max-w-xl">
        We help businesses get their message in front of the right people across Central Florida
        &mdash; on the roads, at the bus stop, and everywhere in between.
      </p>

      <div className="space-y-10 text-ink/80 leading-relaxed">

        <section>
          <h2 className="text-xl font-display text-ink mb-3">What we do</h2>
          <p>
            Central Florida Outdoor is an independent out-of-home (OOH) advertising broker. We
            source billboard and out-of-home placements from media owners across Orange, Polk,
            Marion, Lake, Seminole, and Osceola counties, then negotiate and manage those
            placements on behalf of our clients.
          </p>
          <p className="mt-3">
            You tell us what you&apos;re trying to accomplish &mdash; the market, the audience,
            the budget &mdash; and we find the right boards, handle the paperwork, and make sure
            your creative goes up on time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">How it works</h2>
          <ol className="list-none space-y-4">
            {[
              ["Browse", "Look through available inventory by county, board type, or on the map."],
              ["Request a quote", "Tell us what you're looking for — budget, timing, market. No commitment required."],
              ["We negotiate", "We go to the media owner on your behalf to confirm availability and lock in pricing."],
              ["You get on the board", "Once the deal is done, we coordinate creative specs and posting with the media owner."],
            ].map(([step, desc], i) => (
              <li key={step} className="flex gap-4">
                <span className="text-rust font-display text-2xl leading-none w-6 shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{step}</p>
                  <p className="text-sm text-ink/60">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">Independent broker</h2>
          <p>
            We are not affiliated with, owned by, or acting as an agent of any billboard company
            or media owner. We work independently on behalf of our clients, which means our
            advice is focused on what&apos;s right for your campaign &mdash; not on moving
            inventory for a specific vendor.
          </p>
          <p className="mt-3 text-sm text-ink/50">
            All placements and pricing are subject to confirmation with the relevant media owner.
            See our{" "}
            <Link href="/terms" className="text-rust hover:underline">
              Terms of Service
            </Link>{" "}
            for full details.
          </p>
        </section>

        <div className="pt-4">
          <Link
            href="/quote"
            className="inline-block bg-ink text-sand px-6 py-3 rounded-full font-medium hover:bg-rust transition-colors"
          >
            Request a quote
          </Link>
        </div>

      </div>
    </div>
  );
}
