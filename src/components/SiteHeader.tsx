import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-gradient-gold-strong text-primary-foreground shadow-gold">
            <span className="font-serif text-xl font-bold">G</span>
          </div>
          <div className="leading-tight">
            <div className="font-serif text-xl tracking-wide text-ivory">
              THE GILDED<span className="text-gold"> · </span>AUCTION HOUSE
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Newly Founded · MMXXV
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
            activeProps={{ className: "text-gold" }}
            activeOptions={{ exact: true }}
          >
            Live Auctions
          </Link>
          <a
            href="#categories"
            className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
          >
            Categories
          </a>
          <a
            href="#about"
            className="text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
          >
            About
          </a>
        </nav>
      </div>
    </header>
  );
}
