"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    q: "What is out-of-home (OOH) advertising?",
    a: `Out-of-home advertising refers to any advertising that reaches consumers while they are outside their homes. This includes billboards, digital displays, transit advertising, bus shelters, and more. OOH is one of the oldest and most effective forms of advertising, reaching consumers when they are on the move and most likely to make purchasing decisions.`,
  },
  {
    q: "What is the difference between static and digital billboards?",
    a: `Static billboards display a single printed advertisement that remains in place for the duration of your contract, typically four weeks or longer. Digital billboards display rotating advertisements on an LED screen, cycling through multiple advertisers in a loop. Digital boards offer more flexibility including faster turnaround, no printing costs, and the ability to change your message, while static boards offer full share of voice at a given location.`,
  },
  {
    q: "How are billboard impressions measured?",
    a: `Billboard impressions are measured by traffic counts — the number of people who have a reasonable opportunity to see a billboard in a given period. The industry standard is 18+ weekly impressions, which represents the estimated number of people aged 18 and older who pass a billboard location in a week. These figures are based on traffic data and demographic research.`,
  },
  {
    q: "What does 18+ weekly impressions mean?",
    a: `18+ weekly impressions is the standard audience measurement used in the out-of-home industry. It represents the estimated number of adults 18 years of age and older who pass a billboard location within a one-week period. This metric helps advertisers compare the reach of different locations.`,
  },
  {
    q: "How much does a billboard cost in Central Florida?",
    a: `Billboard costs in Central Florida vary widely depending on location, traffic volume, format, and availability. As a general ballpark, static billboards typically range from a few hundred to a few thousand dollars per four-week period, while digital billboard spots can range from several hundred to several thousand dollars depending on the number of spots and the location. High-traffic interstate locations command premium rates. Request a quote for specific pricing on any board in our inventory.`,
  },
  {
    q: "How far in advance do I need to book a billboard?",
    a: `Lead times vary by operator and location. High-demand locations along major interstates can book out weeks or months in advance, while other locations may have more immediate availability. As a general rule, the more lead time you give the better, especially if you have a specific date or campaign window in mind. Reach out early and we will let you know what is available.`,
  },
  {
    q: "What file formats do I need for my billboard creative?",
    a: `File format requirements vary by billboard operator, but here are the most commonly accepted formats.

Static billboards: Print-ready PDF (.pdf), Adobe Photoshop (.psd), and Adobe Illustrator (.ai) are all widely accepted. Resolution, bleed, and color profile requirements vary by operator. We will provide the exact specs for your specific board once your campaign is confirmed.

Digital billboards: JPEG (.jpg) is the most universally accepted format for digital displays. Pixel dimensions and file size limits vary by operator and screen. We will provide the exact specifications once your placement is confirmed.`,
  },
  {
    q: "What are spots and loop length on a digital billboard?",
    a: `Digital billboards rotate through multiple advertisers in a continuous loop. The loop length is the total duration of one full cycle, commonly 64 seconds. Spots refer to how many advertisers share the loop. For example, 8 spots in a 64-second loop means each advertiser gets an 8-second display time per cycle.`,
  },
  {
    q: "What is a bulletin?",
    a: `In the out-of-home industry, a bulletin is the term for a large-format billboard, typically 14x48 feet, though sizes vary. You may also see the term poster, which refers to a smaller format billboard. We list the exact dimensions for every board in our inventory so you know exactly what you are getting.`,
  },
  {
    q: "How do I know if a billboard is right for my business?",
    a: `Billboards work best for businesses with broad local appeal including restaurants, retailers, healthcare providers, real estate, automotive dealers, and home services. The key factors to consider are location (does the traffic match your target customer?), frequency (will your customers pass it regularly?), and message (can you communicate your key point in under 5 seconds?). If you are not sure, reach out. With 16 years in the OOH industry we are happy to help you figure out if and where billboards make sense for your business.`,
  },
  {
    q: "What is Central Florida Outdoor and how does the process work?",
    a: `Central Florida Outdoor is an independent out-of-home advertising broker serving Central Florida. We source billboard and OOH inventory from operators across the region and negotiate placements on behalf of our clients.

The process is simple. Browse our inventory by county, city, or on the map. Request a quote on any board that interests you with no commitment required. We reach out with availability, pricing, and specs. Once you are ready to move forward, we handle the paperwork and coordinate with the media owner. Your creative goes up on time.`,
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-ink/10">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="font-medium text-ink">{q}</span>
        <span className={`text-rust text-xl shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="pb-5 text-sm text-ink/70 leading-relaxed whitespace-pre-line">
          {a}
        </div>
      )}
    </div>
  );
}

export default function OohGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <p className="eyebrow text-rust mb-3">Education</p>
      <h1 className="text-4xl mb-2">OOH FAQs</h1>
      <p className="text-ink/60 max-w-xl mb-12">
        New to out-of-home advertising? We have answers. Browse the questions below or{" "}
        <Link href="/contact" className="text-rust hover:underline">
          reach out directly
        </Link>{" "}
        and we will walk you through it.
      </p>

      <div className="bg-white border border-ink/10 rounded-2xl px-6">
        {faqs.map((faq) => (
          <AccordionItem key={faq.q} q={faq.q} a={faq.a} />
        ))}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-ink text-sand text-center">
        <h2 className="text-xl mb-2">Ready to get started?</h2>
        <p className="text-sand/70 text-sm mb-5">
          Browse our inventory across Central Florida and request a quote. No commitment required.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/map"
            className="bg-sand text-ink px-5 py-2.5 rounded-full text-sm font-medium hover:bg-rust hover:text-sand transition-colors"
          >
            Browse the map
          </Link>
          <Link
            href="/quote"
            className="border border-sand/30 text-sand px-5 py-2.5 rounded-full text-sm font-medium hover:border-sand transition-colors"
          >
            Request a quote
          </Link>
        </div>
      </div>
    </div>
  );
}
