export function SiteFooter() {
  return (
    <footer className="border-t border-gold/20 bg-onyx">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl text-ivory">
              MAISON<span className="text-gold"> & </span>HEIR
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              India's premier digital auction house for antiques, classic motorcars and
              objects of rare provenance. Bid with confidence, collect with conviction.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-gold">
              Departments
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Antiques & Heritage</li>
              <li>Classic & Luxury Cars</li>
              <li>General Collectibles</li>
              <li>Private Sales</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-gold">
              Maison
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Buyer's Guide</li>
              <li>Seller's Commission</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="hairline-gold mt-12" />
        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Maison & Heir Auctioneers. All rights reserved.</p>
          <p className="tracking-widest uppercase">Mumbai · Delhi · Bangalore</p>
        </div>
      </div>
    </footer>
  );
}
