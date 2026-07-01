import QuoteForm from "@/components/QuoteForm";

export default function QuotePage({
  searchParams,
}: {
  searchParams: { board?: string };
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">Get pricing</p>
      <h1 className="text-4xl mb-2">Request a quote</h1>
      <p className="text-ink/60 max-w-xl mb-10">
        Tell us what you&apos;re looking for and we&apos;ll follow up with availability and
        pricing. No account or payment needed to ask.
      </p>
      <QuoteForm presetBoardId={searchParams.board} />
    </div>
  );
}
