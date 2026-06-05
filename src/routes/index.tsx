import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  HandHeart,
  ShieldCheck,
  Loader2,
  Scale,
  Gavel,
  Lock,
} from "lucide-react";
import { ReverseAuctionCard } from "@/components/ReverseAuctionCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommunitySections } from "@/components/CommunitySections";
import { listPublicAuctions, type DbAuction } from "@/lib/db-auctions";
import { DomedHallVector, StarMedallionVector } from "@/components/DecorativeVectors";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Gilded — Reverse Auctions for a Greater Cause" },
      {
        name: "description",
        content:
          "A premium sealed-bid reverse auction house. The lowest unique bid wins — and every entry fee supports those in need.",
      },
      { property: "og:title", content: "The Gilded — Reverse Auctions" },
      {
        property: "og:description",
        content:
          "Lowest unique bid wins. Entry fees support charitable causes for those in need.",
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
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO — Emerald Cinematic */}
      <section className="relative isolate overflow-hidden border-b border-gold/25">
        {/* Layered emerald background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-emerald" />
          {/* Dawn light wash */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 90% 60% at 50% 0%, oklch(0.5 0.1 158 / 0.55), transparent 60%), radial-gradient(ellipse 60% 40% at 50% 100%, oklch(0.12 0.03 165 / 0.7), transparent 70%)",
            }}
          />
          {/* Gold glow behind medallion */}
          <div
            className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.82 0.11 90 / 0.18) 0%, oklch(0.82 0.11 90 / 0.04) 35%, transparent 60%)",
            }}
          />
          {/* Architectural hall line art */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
            style={{ opacity: 0.1 }}
          >
            <DomedHallVector className="h-full w-full" />
          </div>
          {/* Oversized geometric medallion behind headline */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[680px] w-[680px] max-w-[120%] -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: 0.18 }}
          >
            <StarMedallionVector className="h-full w-full" />
          </div>
          {/* Fine grain noise via gradient */}
          <div
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{
              backgroundImage:
                "radial-gradient(oklch(0.98 0.012 95) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />
        </div>

        {/* Gold hairline frame */}
        <div className="pointer-events-none absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent sm:inset-x-12" />
        <div className="pointer-events-none absolute inset-x-6 bottom-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent sm:inset-x-12" />
        <div className="pointer-events-none absolute inset-y-6 left-6 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent sm:left-12" />
        <div className="pointer-events-none absolute inset-y-6 right-6 w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent sm:right-12" />

        <div className="relative mx-auto max-w-7xl px-6 py-32 sm:py-40 md:py-48">
          <div className="mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-gold/40 bg-emerald-deep/70 px-5 py-2 backdrop-blur-md shadow-gold">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
              </span>
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
                A House of Reverse Auctions
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-[clamp(2.75rem,8vw,5.75rem)] leading-[1.02] tracking-tight text-ivory">
              The lowest{" "}
              <span className="relative inline-block">
                <span className="text-gradient-gold italic">unique bid</span>
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
              </span>
              <br />
              <span className="text-ivory/95">wins the lot.</span>
            </h1>

            {/* Ornament */}
            <div className="mx-auto mt-8 flex items-center justify-center gap-3 text-gold/70">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
              </svg>
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
            </div>

            {/* Paragraph */}
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-ivory/75 sm:text-lg">
              One sealed bid. One chance. A single entry fee secures your place
              at the floor — and quietly contributes to those in need.
            </p>

            {/* CTAs */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#lots"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-sm bg-gradient-gold-strong px-9 py-4 text-[11px] uppercase tracking-[0.32em] text-primary-foreground shadow-gold transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_oklch(0.82_0.11_90/0.55)]"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <Gavel className="relative h-4 w-4" />
                <span className="relative">View Open Lots</span>
                <ChevronRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-emerald-deep/40 px-9 py-4 text-[11px] uppercase tracking-[0.32em] text-ivory backdrop-blur transition-colors hover:border-gold hover:text-gold"
              >
                How It Works
              </a>
            </div>

            {/* Trust micro-strip */}
            <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.32em] text-ivory/50">
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold/70" /> Sealed Bids</span>
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold/70" /> Verified Lots</span>
              <span className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-gold/70" /> Community First</span>
            </div>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
      </section>


      {/* SMALL CHARITY MENTION */}
      <section className="border-b border-gold/15 bg-onyx/30">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-6 py-5 text-center">
          <HandHeart className="h-4 w-4 flex-shrink-0 text-gold" />
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            A portion of every entry fee supports{" "}
            <span className="text-gold">those in need</span>.
          </p>
        </div>
      </section>

      {/* LIVE LOTS */}
      <section id="lots" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
                Open Lots
              </p>
              <h2 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl">
                The floor is open.
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
                        "rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.25em] transition-all " +
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
            <div className="mt-16 flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-16 rounded-sm border border-dashed border-gold/30 bg-card/40 px-6 py-20 text-center">
              <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
                The Floor Is Quiet
              </p>
              <h3 className="mt-4 font-serif text-3xl text-ivory">
                New lots open soon.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Sign in to be notified when the next round of lots begins.
              </p>
            </div>
          ) : (
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((a) => (
                <ReverseAuctionCard key={a.id} auction={a} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="relative border-y border-gold/20 bg-onyx/40 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
              How It Works
            </p>
            <h2 className="mt-5 font-serif text-4xl text-ivory sm:text-5xl">
              Four steps to the floor.
            </h2>
          </div>

          <ol className="mt-16 grid gap-10 md:grid-cols-4">
            {[
              {
                n: "01",
                t: "Sign In",
                b: "Create a verified account to access the auction floor.",
              },
              {
                n: "02",
                t: "Choose a Lot",
                b: "Browse open lots and pay the entry fee to participate.",
              },
              {
                n: "03",
                t: "Place One Bid",
                b: "Submit a single sealed bid — final, locked, and private.",
              },
              {
                n: "04",
                t: "Lowest Unique Wins",
                b: "When the lot closes, the lowest unique bid takes it home.",
              },
            ].map((s) => (
              <li key={s.n} className="relative">
                <div className="font-serif text-5xl text-gradient-gold">
                  {s.n}
                </div>
                <h3 className="mt-3 font-serif text-2xl text-ivory">{s.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {s.b}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-gold/20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <Trust
              icon={<Scale className="h-6 w-6" />}
              title="Lowest Unique Wins"
              text="The winning amount is the one with the fewest participants. Ties resolve to the lowest sum, then the earliest timestamp."
            />
            <Trust
              icon={<Lock className="h-6 w-6" />}
              title="One Sealed Bid"
              text="Pay the entry fee once. Place a single sealed bid. Outcomes revealed only when the lot closes."
            />
            <Trust
              icon={<HandHeart className="h-6 w-6" />}
              title="Giving Built In"
              text="A portion of every entry fee is directed toward charitable causes for those in need — quietly and transparently."
            />
          </div>
        </div>
      </section>

      <div id="community">
        <CommunitySections />
      </div>

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
