import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Gavel, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-auction.jpg";
import marbleTexture from "@/assets/marble-texture.jpg";
import { ReverseAuctionCard } from "@/components/ReverseAuctionCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommunitySections } from "@/components/CommunitySections";
import { listPublicAuctions, type DbAuction } from "@/lib/db-auctions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Gilded Auction House — Reverse Auctions in India" },
      {
        name: "description",
        content:
          "A community reverse-auction platform. The lowest unique bid wins. Pay a small entry fee, place one sealed bid, and let fairness decide.",
      },
      { property: "og:title", content: "The Gilded Auction House — Reverse Auctions" },
      {
        property: "og:description",
        content:
          "Lowest unique bid wins. One sealed bid per participant. Transparent, community-first auctions.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [auctions, setAuctions] = useState<DbAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    void listPublicAuctions()
      .then((rows) => setAuctions(rows))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    auctions.forEach((a) => a.category && set.add(a.category));
    return Array.from(set);
  }, [auctions]);

  const visible = useMemo(
    () => (active === "all" ? auctions : auctions.filter((a) => a.category === active)),
    [active, auctions],
  );

  return (
    <div
      className="min-h-screen bg-background"
      style={{ ["--marble-bg" as string]: `url(${marbleTexture})` }}
    >
      <SiteHeader />

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
                Reverse Auctions, Live Now
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
              The <span className="text-gradient-gold italic">lowest unique</span>{" "}
              bid wins.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Pay a small entry fee. Place one sealed bid. The bid with the fewest
              participants — at the lowest amount — claims the lot. Transparent,
              fair, community-first.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#lots"
                className="group inline-flex items-center gap-2 rounded-sm bg-gradient-gold-strong px-7 py-3.5 text-sm uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
              >
                <Gavel className="h-4 w-4" />
                Browse Lots
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-7 py-3.5 text-sm uppercase tracking-widest text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="lots" className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                Open Auctions
              </p>
              <h2 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">
                Current Lots
              </h2>
              <div className="mt-4 h-px w-24 bg-gold" />
            </div>

            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(["all", ...categories]).map((c) => {
                  const isActive = active === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setActive(c)}
                      className={
                        "rounded-sm border px-4 py-2 text-xs uppercase tracking-widest transition-all " +
                        (isActive
                          ? "border-gold bg-gold text-primary-foreground shadow-gold"
                          : "border-border text-muted-foreground hover:border-gold/60 hover:text-gold")
                      }
                    >
                      {c === "all" ? "All Lots" : c}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-12 rounded-sm border border-dashed border-gold/30 bg-card/40 px-6 py-20 text-center">
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">
                No Open Auctions
              </p>
              <h3 className="mt-3 font-serif text-3xl text-ivory">
                The floor is being prepared.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                New lots will open soon. Check back shortly.
              </p>
            </div>
          ) : (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((a) => (
                <ReverseAuctionCard key={a.id} auction={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <Trust
              icon={<Gavel className="h-6 w-6" />}
              title="Lowest Unique Wins"
              text="The winning amount is the one with the fewest participants. Ties break to the lowest monetary value, then earliest timestamp."
            />
            <Trust
              icon={<ShieldCheck className="h-6 w-6" />}
              title="One Sealed Bid"
              text="Pay the entry fee once, place a single bid. Bids are private until the auction closes and the winner is announced."
            />
            <Trust
              icon={<Sparkles className="h-6 w-6" />}
              title="Transparent & Auditable"
              text="Every bid is timestamped and immutable. Frequency breakdowns are published with each winner announcement."
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
