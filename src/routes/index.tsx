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

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gold/20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-onyx via-background to-onyx" />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, oklch(0.74 0.13 85 / 0.18), transparent 55%), radial-gradient(ellipse at 80% 80%, oklch(0.55 0.12 70 / 0.15), transparent 50%)",
            }}
          />
          {/* ELEMENT 1 — Architectural hall line art */}
          <div className="pointer-events-none absolute inset-0 z-0" style={{ opacity: 0.12 }}>
            <DomedHallVector className="h-full w-full" />
          </div>
        </div>

        <div className="relative z-[1] mx-auto max-w-7xl px-6 py-28 sm:py-36 md:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-sm border border-gold/40 bg-onyx/60 px-4 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold pulse-gold" />
              <span className="text-[11px] uppercase tracking-[0.35em] text-gold">
                A House of Reverse Auctions
              </span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
              The lowest{" "}
              <span className="text-gradient-gold italic">unique bid</span>
              <br />
              wins the lot.
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              One sealed bid. One chance. A single entry fee secures your place
              at the floor — and quietly contributes to those in need.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#lots"
                className="group inline-flex items-center gap-2 rounded-sm bg-gradient-gold-strong px-8 py-3.5 text-[11px] uppercase tracking-[0.3em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
              >
                <Gavel className="h-4 w-4" />
                View Open Lots
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-8 py-3.5 text-[11px] uppercase tracking-[0.3em] text-ivory transition-colors hover:border-gold hover:text-gold"
              >
                How It Works
              </a>
            </div>
          </div>
        </div>
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
