import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Central Florida Outdoor | Out-of-Home Advertising",
  description:
    "Browse billboard, transit, and out-of-home advertising inventory across Central Florida and request a quote.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-ink/10 bg-sand/95 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-display text-xl tracking-tight">
              Central Florida <span className="text-rust">Outdoor</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/about" className="hover:text-rust transition-colors">About</Link>
              <Link href="/board-types" className="hover:text-rust transition-colors">Board Types</Link>
              <Link href="/cities" className="hover:text-rust transition-colors">Cities</Link>
              <Link href="/counties" className="hover:text-rust transition-colors">Counties</Link>
              <Link href="/map" className="hover:text-rust transition-colors">Map</Link>
              <Link
                href="/quote"
                className="bg-ink text-sand px-4 py-2 rounded-full hover:bg-rust transition-colors"
              >
                Request a quote
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-ink/10 mt-24">
          <div className="max-w-6xl mx-auto px-6 py-10 text-sm text-ink/60 flex flex-col md:flex-row justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} Central Florida Outdoor. Independent OOH broker.</p>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-rust transition-colors">About</Link>
              <Link href="/terms" className="hover:text-rust transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
