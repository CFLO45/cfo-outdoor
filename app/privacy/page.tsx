export const metadata = {
  title: "Privacy Policy | Central Florida Outdoor",
};

const EFFECTIVE_DATE = "July 1, 2026";

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">Legal</p>
      <h1 className="text-4xl mb-2">Privacy Policy</h1>
      <p className="text-sm text-ink/50 mb-12">Effective {EFFECTIVE_DATE}</p>

      <div className="space-y-10 text-ink/80 leading-relaxed">

        <section>
          <h2 className="text-xl font-display text-ink mb-3">1. Who We Are</h2>
          <p>
            Central Florida Outdoor (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
            operates cfloutdoor.com. We are an independent out-of-home advertising broker based
            in Florida. This Privacy Policy explains how we collect, use, and protect information
            when you visit our website or submit a quote request.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">2. Information We Collect</h2>
          <p>We only collect information you voluntarily provide to us. When you submit a quote request, we collect:</p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              "Your name",
              "Your email address",
              "Your phone number (optional)",
              "Campaign details such as board type, county, budget range, and start date",
              "Any notes you include in the request form",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="text-rust mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            We do not collect any information automatically beyond standard web server logs.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">3. How We Use Your Information</h2>
          <p>We use the information you provide to:</p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              "Respond to your quote request and follow up with availability and pricing",
              "Communicate with you about your advertising campaign",
              "Fulfill our role as your out-of-home advertising broker",
              "Enhance and improve future campaign recommendations based on past performance",
              "Develop anonymized case studies to illustrate campaign results — no personally identifiable information will be included in any case study without your explicit consent",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="text-rust mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            We do not add you to any mailing list without your explicit consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">4. Geolocation Data</h2>
          <p>
            Our website includes an interactive map tool that allows visitors to search for
            billboard inventory by location. If you use the address search feature on our map,
            we process the location data you enter in order to display relevant nearby inventory.
          </p>
          <p className="mt-3">
            If you choose to allow your browser to share your device&apos;s location, that
            location data is used solely to center the map on your current position and is not
            stored, logged, or shared with any third party. You are never required to share
            your location — the map is fully functional without it.
          </p>
          <p className="mt-3">
            Address searches you enter into the map search box are processed by our mapping
            service provider to convert your address into geographic coordinates. These searches
            are not stored in our systems.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">5. How We Store Your Information</h2>
          <p>
            Quote request information is stored securely in an encrypted database hosted in
            the United States. We retain your information for as long as necessary to fulfill
            your request and for reasonable business record-keeping purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">6. Information Sharing</h2>
          <p>
            We do not sell, rent, or share your personal information with third parties for
            marketing or advertising purposes.
          </p>
          <p className="mt-3">
            In order to fulfill your advertising request, we may share your name, contact
            information, and campaign details with third-party billboard operators — including
            but not limited to OUTFRONT Media, Lamar Advertising, Clear Channel Outdoor, and
            other media owners — as necessary to obtain availability and pricing on your behalf.
            We share only the minimum information required to fulfill your request.
          </p>
          <p className="mt-3">
            We may also share your information in the following limited circumstances:
          </p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              "If required by law, court order, or governmental authority",
              "To protect the rights, property, or safety of Central Florida Outdoor or others",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="text-rust mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">7. We Do Not Sell Your Personal Information</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to outside
            parties for commercial purposes. This applies to all visitors and users of our
            website, including residents of California and other states with similar consumer
            privacy protections.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">8. Cookies and Tracking</h2>
          <p>
            We currently do not use cookies, tracking pixels, or similar tracking technologies
            on this website for advertising or analytics purposes. If this changes in the future,
            this policy will be updated to reflect those practices and you will be notified
            through a prominent notice on the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">9. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="mt-3 space-y-2 list-none">
            {[
              "Request access to the personal information we hold about you",
              "Request correction of any inaccurate information",
              "Request deletion of your information from our records",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <span className="text-rust mt-0.5">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            To make any of these requests, contact us at{" "}
            <a href="mailto:info@cfloutdoor.com" className="text-rust hover:underline">
              info@cfloutdoor.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">10. Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under the age of 13. We do not knowingly
            collect personal information from children. If you believe we have inadvertently
            collected information from a child, please contact us and we will delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The effective date at the top
            of this page will reflect the most recent revision. Continued use of the site after
            any changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-display text-ink mb-3">12. Contact</h2>
          <p>
            Questions about this Privacy Policy? Email us at{" "}
            <a href="mailto:info@cfloutdoor.com" className="text-rust hover:underline">
              info@cfloutdoor.com
            </a>{" "}
            or visit our{" "}
            <a href="/contact" className="text-rust hover:underline">
              contact page
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
}
