import { CompassRoseVector } from "@/components/DecorativeVectors";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-accent/20 bg-card">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[600px] w-[600px] max-w-[95%] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: 0.05 }}
      >
        <CompassRoseVector className="h-full w-full" />
      </div>

      <div className="relative z-[1] mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 font-serif text-2xl tracking-[0.15em] text-foreground">
              <span className="inline-block h-8 w-8 text-accent">
                <CompassRoseVector className="h-full w-full" strokeWidth={1.2} />
              </span>
              GEM
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A community platform built on opportunity, trust, and giving.
              Registration fees from every lot support community initiatives —
              transparently, and with care.
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.25em] text-accent">
              Community
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>How It Works</li>
              <li>Community Impact</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm uppercase tracking-[0.25em] text-accent">
              Platform
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Active Lots</li>
              <li>Terms</li>
              <li>Privacy</li>
              <li>Support</li>
            </ul>
          </div>
        </div>

        <div className="hairline-gold mt-14" />
        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} GEM. A community platform.</p>
          <p className="tracking-[0.3em] uppercase">Community · Trust · Opportunity</p>
        </div>
      </div>
    </footer>
  );
}
