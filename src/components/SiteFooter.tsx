import { IslamicPattern } from "@/components/IslamicPattern";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-gold/20 bg-onyx">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <IslamicPattern opacity={0.08} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        {/* Calligraphy crown */}
        <div className="mb-14 text-center">
          <p
            className="font-arabic text-3xl leading-relaxed text-gold/70 sm:text-4xl"
            lang="ar"
            dir="rtl"
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            In the name of Allah, the Most Compassionate, the Most Merciful
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-serif text-2xl text-ivory">
              THE GILDED
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A community platform built on{" "}
              <span className="font-script text-lg text-gold">trust</span>,{" "}
              <span className="font-script text-lg text-gold">generosity</span>{" "}
              and service. Entry fees from every lot flow toward those in need —
              transparently, and with dignity.
            </p>
            <p
              className="mt-6 font-arabic text-xl text-gold/80"
              lang="ar"
              dir="rtl"
            >
              وَتَعَاوَنُوا۟ عَلَى ٱلْبِرِّ وَٱلتَّقْوَىٰ
            </p>
            <p className="mt-1 text-[11px] italic tracking-wide text-muted-foreground">
              "Cooperate in righteousness and piety."
            </p>
          </div>
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-gold">
              Community
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Causes We Serve</li>
              <li>Zakat & Sadaqah</li>
              <li>Our Amanah (Trust)</li>
              <li>Success Stories</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-sm uppercase tracking-widest text-gold">
              The House
            </h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>How It Works</li>
              <li>Transparency Report</li>
              <li>Contribute a Lot</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>

        <div className="hairline-gold mt-14" />
        <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} The Gilded. Built with{" "}
            <span className="text-gold">Ihsan</span>.
          </p>
          <p className="tracking-[0.3em] uppercase">Ummah · Worldwide</p>
        </div>
      </div>
    </footer>
  );
}
