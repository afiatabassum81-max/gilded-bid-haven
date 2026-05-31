import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, Gavel, ShieldCheck, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-auction.jpg";
import marbleTexture from "@/assets/marble-texture.jpg";
import { auctions, categoryLabel, type Category } from "@/lib/auctions";
import { AuctionCard } from "@/components/AuctionCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommunitySections } from "@/components/CommunitySections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Gilded Auction House — Live Luxury Auctions in India" },
      {
        name: "description",
        content:
          "A newly founded auction house for antiques, classic motorcars and rare collectibles. Highest bid wins — settle securely in INR.",
      },
      { property: "og:title", content: "The Gilded Auction House — Live Luxury Auctions" },
      {
        property: "og:description",
        content:
          "Bid live on antiques, classic motorcars and rare collectibles. Highest bid wins.",
      },
    ],
  }),
  component: HomePage,
});

const filters: { key: "all" | Category; label: string }[] = [
  { key: "all", label: "All Lots" },
  { key: "antiques", label: "Antiques" },
  { key: "cars", label: "Classic & Luxury Cars" },
  { key: "general", label: "General" },
];

function HomePage() {
  const [active, setActive] = useState<"all" | Category>("all");

  const visible = useMemo(
    () => (active === "all" ? auctions : auctions.filter((a) => a.category === active)),
    [active],
  );

  return (
    <div
      className="min-h-screen bg-background"
      style={{ ["--marble-bg" as string]: `url(${marbleTexture})` }}
    >
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-onyx via-onyx/80 to-onyx/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 md:py-40">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-onyx/60 px-3 py-1.5 backdrop-blur">
              <span className="live-dot" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-gold">
                Live Auctions Now
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
              Where the <span className="text-gradient-gold italic">extraordinary</span>{" "}
              meets the discerning.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A curated marketplace for antiques, classic motorcars and singular
              objects of beauty. Straight auction. Highest bid wins. Settled in INR.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#lots"
                className="group inline-flex items-center gap-2 rounded-sm bg-gradient-gold-strong px-7 py-3.5 text-sm uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
              >
                <Gavel className="h-4 w-4" />
                Browse Live Lots
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-7 py-3.5 text-sm uppercase tracking-widest text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                Consign with Us
              </a>
            </div>

            <div className="mt-16 max-w-lg border-t border-gold/20 pt-8">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                Just Launched
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                We're a newly founded house. Our first lots are listed below — be among the
                very first bidders on the floor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY FILTERS + GRID */}
      <section id="lots" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                Featured This Week
              </p>
              <h2 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">
                Live & Upcoming Lots
              </h2>
              <div className="mt-4 h-px w-24 bg-gold" />
            </div>

            <div id="categories" className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const isActive = active === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setActive(f.key)}
                    className={
                      "rounded-sm border px-4 py-2 text-xs uppercase tracking-widest transition-all " +
                      (isActive
                        ? "border-gold bg-gold text-primary-foreground shadow-gold"
                        : "border-border text-muted-foreground hover:border-gold/60 hover:text-gold")
                    }
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((a) => (
              <AuctionCard key={a.id} auction={a} />
            ))}
          </div>

          {visible.length === 0 && (
            <div className="mt-4 rounded-sm border border-dashed border-gold/30 bg-card/40 px-6 py-20 text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                No Listings Yet
              </p>
              <h3 className="mt-3 font-serif text-3xl text-ivory">
                The floor is being prepared.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Our first lots haven't been consigned yet. Check back soon, or get in
                touch to consign your piece for the inaugural sale.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES MARBLE STRIP */}
      <section className="marble-overlay relative border-y border-gold/20 bg-card py-20">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-3">
            {(["antiques", "cars", "general"] as Category[]).map((c) => {
              const count = auctions.filter((a) => a.category === c).length;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setActive(c);
                    document.getElementById("lots")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group relative overflow-hidden rounded-sm border border-gold/30 bg-onyx/60 p-8 text-left backdrop-blur transition-all hover:border-gold hover:shadow-gold"
                >
                  <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                    Department
                  </p>
                  <h3 className="mt-2 font-serif text-3xl text-ivory">
                    {categoryLabel[c]}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {count === 0 ? "Accepting consignments" : `${count} live ${count === 1 ? "lot" : "lots"} now`}
                  </p>
                  <ChevronRight className="absolute bottom-8 right-8 h-5 w-5 text-gold transition-transform group-hover:translate-x-1" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <Trust
              icon={<Gavel className="h-6 w-6" />}
              title="Straight Auction"
              text="Highest bid at timer end wins. No reserves. No buyouts. The hammer falls only once."
            />
            <Trust
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Verified Provenance"
              text="Every lot is vetted by our specialists. Authenticity and condition reports for every consignment."
            />
            <Trust
              icon={<Sparkles className="h-6 w-6" />}
              title="Anti-Sniping Rules"
              text="Bid in the final 30 seconds and the timer auto-extends by two minutes. Fair play, every time."
            />
          </div>
        </div>
      </section>

      <CommunitySections />

      <SiteFooter />
    </div>
  );
}


function Trust({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="border-l-2 border-gold pl-6">
      <div className="text-gold">{icon}</div>
      <h3 className="mt-4 font-serif text-2xl text-ivory">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
