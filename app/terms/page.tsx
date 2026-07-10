export const metadata = {
  title: "Terms of Service | Central Florida Outdoor",
};

const EFFECTIVE_DATE = "July 1, 2026";

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">Legal</p>
      <h1 className="text-4xl mb-2">Terms of Service</h1>
      <p className="text-sm text-ink/50 mb-12">Effective {EFFECTIVE_DATE}</p>

      <div className="prose prose-ink space-y-10 text-ink/80 leading-relaxed">

        <section>
          <h2 className="text-xl font-display text-ink mb-3">1. Who We Are</h2>
          <p>
            Central Florida Outdoor (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            is an independent out-of-home advertising broker. We source and negotiate billboard
            and out-of-home advertising placements on behalf of advertisers (&ldquo;you&rdquo;
            or &ldquo;Client&rdquo;). We are not the owner, operator, or publisher of any
            billboard or display listed on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">2. Broker Relationship</h2>
          <p>
            All inventory displayed on cfloutdoor.com is sourced from third-party media owners
            (billboard operators, transit authorities, and other out-of-home media companies).
            By submitting a quote request, you are engaging Central Florida Outdoor as your
            broker to negotiate a placement on your behalf — you are not entering into a direct
            agreement with the media owner, and you are not booking or reserving any placement
            directly through this site.
          </p>
          <p className="mt-3">
            All placements, pricing, and availability are subject to confirmation with the
            relevant media owner and are not guaranteed until a signed insertion order or
            agreement is in place between all parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">3. Availability and Pricing</h2>
          <p>
            Inventory listings on this site reflect boards we have sourced and may be able to
            place. Availability and pricing are subject to change without notice and are not
            confirmed until we notify you in writing. Submitting a quote request does not
            reserve, hold, or guarantee any placement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">4. No Warranties</h2>
          <p>
            This site and its content are provided &ldquo;as is&rdquo; without warranty of any
            kind. We make no representations about the accuracy, completeness, or availability
            of any listed inventory. We are not responsible for errors, omissions, or changes
            made by media owners after listings are published.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">5. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, Central Florida Outdoor shall not be liable
            for any indirect, incidental, or consequential damages arising from your use of this
            site or reliance on any information contained herein.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">6. Privacy</h2>
          <p>
            When you submit a quote request, we collect your name, email, phone number, and
            campaign details. We use this information solely to respond to your inquiry and
            arrange advertising placements on your behalf. We do not sell or share your personal
            information with third parties for marketing purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">7. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Florida. Any disputes arising
            under these terms shall be resolved in the courts of the State of Florida.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">8. Changes to These Terms</h2>
          <p>
            We may update these terms from time to time. The effective date at the top of this
            page will reflect the most recent revision. Continued use of this site after any
            changes constitutes your acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">9. Contact</h2>
          <p>
            Questions about these terms? Email us at{" "}
            <a href="mailto:info@cfloutdoor.com" className="text-rust hover:underline">
              info@cfloutdoor.com
            </a>{" "}
            or use the{" "}
            <a href="/contact" className="text-rust hover:underline">
              contact page
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
