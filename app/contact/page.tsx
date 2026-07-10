import Link from "next/link";

export const metadata = {
  title: "Contact | Central Florida Outdoor",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">Get in touch</p>
      <h1 className="text-4xl mb-2">Contact Us</h1>
      <p className="text-ink/60 max-w-xl mb-12">
        Have a question about a specific board, want to talk through your campaign, or just want
        to know what&apos;s available in your market? We&apos;re happy to help.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-white border border-ink/10">
          <p className="eyebrow text-rust mb-3">Email</p>
          <a
            href="mailto:info@cfloutdoor.com"
            className="text-lg font-display text-ink hover:text-rust transition-colors"
          >
            info@cfloutdoor.com
          </a>
          <p className="text-sm text-ink/50 mt-2">We typically respond within one business day.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-ink/10">
          <p className="eyebrow text-rust mb-3">Quote request</p>
          <Link
            href="/quote"
            className="text-lg font-display text-ink hover:text-rust transition-colors"
          >
            Request a quote &rarr;
          </Link>
          <p className="text-sm text-ink/50 mt-2">
            Tell us your market, budget, and timing and we&apos;ll follow up with options.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-ink/5 border border-ink/10">
        <h2 className="text-lg mb-2">Browse inventory first</h2>
        <p className="text-sm text-ink/60 mb-4">
          Not sure what you&apos;re looking for? Browse available boards by county, city, or
          board type and request a quote directly from any listing.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/map" className="text-sm font-medium text-rust hover:underline">View map &rarr;</Link>
          <Link href="/counties" className="text-sm font-medium text-rust hover:underline">Browse by county &rarr;</Link>
          <Link href="/cities" className="text-sm font-medium text-rust hover:underline">Browse by city &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
