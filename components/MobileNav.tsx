"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/cities", label: "Cities" },
  { href: "/counties", label: "Counties" },
  { href: "/map", label: "Map" },
  { href: "/ooh-faqs", label: "OOH FAQs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex flex-col justify-center gap-1.5 w-8 h-8 focus:outline-none"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <span
          className={`block h-0.5 bg-ink transition-all duration-200 ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 bg-ink transition-all duration-200 ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 bg-ink transition-all duration-200 ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-sand border-b border-ink/10 shadow-sm z-50">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium border-b border-ink/5 hover:text-rust transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/quote"
              onClick={() => setOpen(false)}
              className="mt-3 text-center bg-ink text-sand px-4 py-3 rounded-full text-sm font-medium hover:bg-rust transition-colors"
            >
              Request a quote
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
