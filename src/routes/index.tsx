import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  HandHeart,
  Loader2,
  Scale,
  Lock,
  Sparkles,
  Users,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { ReverseAuctionCard } from "@/components/ReverseAuctionCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommunitySections } from "@/components/CommunitySections";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { listPublicAuctions, type DbAuction } from "@/lib/db-auctions";
import heroMosque from "@/assets/hero-mosque.jpg";
import umrahHero from "@/assets/umrah-hero.jpg";
import communityGiving from "@/assets/community-giving.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GEM — A Community of Opportunity, Trust & Giving" },
      {
        name: "description",
        content:
          "GEM is a community platform built on reverse auctions, trust, and shared benefit. Register for a lot, place one sealed bid, and join a community where opportunity meets giving.",
      },
      { property: "og:title", content: "GEM — Community · Trust · Opportunity" },
      {
        property: "og:description",
        content:
          "Register for lots, place sealed bids, and participate in a platform built around community and contribution.",
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
      <OnboardingFlow />
      <SiteHeader />

      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-emerald" />
        <img
          src={heroMosque}
          alt="Masjid an-Nabawi at dawn"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-25"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background/60 via-background/40 to-background" />

        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] w-full"
          viewBox="0 0 1200 500"
          fill="none"
          stroke="#8F6B3D"
          strokeWidth="0.6"
          opacity="0.18"
          preserveAspectRatio="xMidYEnd meet"
        >
          {/* central dome */}
          <path d="M540 360 Q600 220 660 360" />
          <path d="M555 360 Q600 250 645 360" />
          <line x1="600" y1="220" x2="600" y2="200" />
          <circle cx="600" cy="195" r="4" />
          {/* arches left */}
          {[300, 380, 460].map((x) => (
            <g key={`l${x}`}>
              <path d={`M${x} 380 Q${x + 30} 320 ${x + 60} 380`} />
              <line x1={x} y1="380" x2={x} y2="450" />
              <line x1={x + 60} y1="380" x2={x + 60} y2="450" />
            </g>
          ))}
          {/* arches right */}
          {[680, 760, 840].map((x) => (
            <g key={`r${x}`}>
              <path d={`M${x} 380 Q${x + 30} 320 ${x + 60} 380`} />
              <line x1={x} y1="380" x2={x} y2="450" />
              <line x1={x + 60} y1="380" x2={x + 60} y2="450" />
            </g>
          ))}
          {/* baseline */}
          <line x1="0" y1="450" x2="1200" y2="450" />
          {/* geometric stars */}
          <g transform="translate(180,140)" opacity="0.7">
            <path d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" />
          </g>
          <g transform="translate(1020,160)" opacity="0.7">
            <path d="M0 -22 L6 -6 L22 0 L6 6 L0 22 L-6 6 L-22 0 L-6 -6 Z" />
          </g>
        </svg>

        <div className="relative mx-auto max-w-5xl px-6 py-28 text-center sm:py-36 md:py-44">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card/60 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-accent backdrop-blur">
            <Sparkles className="h-3 w-3" />
            A Community Platform
          </div>

          <h1 className="font-serif text-[clamp(2.5rem,7vw,5rem)] leading-[1.05] tracking-tight text-foreground">
            Welcome to <span className="text-gradient-gold italic">GEM</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A community built on opportunity, trust, and giving.
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground/80">
            Register for lots, place sealed bids, and participate in a platform
            designed to benefit both participants and the wider community.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#lots"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-emerald-soft hover:shadow-gold"
            >
              Explore Lots
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-card/40 px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-foreground backdrop-blur transition-colors hover:border-accent hover:text-accent"
            >
              How It Works
            </a>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
            <span className="flex items-center gap-2"><Users className="h-3 w-3 text-accent" /> Community First</span>
            <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-accent" /> Transparent</span>
            <span className="flex items-center gap-2"><Gift className="h-3 w-3 text-accent" /> Giving Built In</span>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
      </section>

      {/* FEATURED CAMPAIGN — Umrah */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent">Featured Campaign</p>
            <h2 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
              A Chance to Perform Umrah
            </h2>
            <div className="mx-auto mt-4 h-px w-24 bg-accent/60" />
          </div>

          <article className="relative overflow-hidden rounded-2xl border border-accent/30 bg-card shadow-elegant">
            <div className="grid gap-0 md:grid-cols-5">
              <div className="relative md:col-span-2 overflow-hidden bg-gradient-emerald">
                <img
                  src={umrahHero}
                  alt="Pilgrims at the Kaaba in Makkah"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <div className="relative flex h-full min-h-[320px] flex-col justify-end p-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-accent">Umrah Lot</p>
                  <p className="mt-2 font-serif text-3xl text-foreground">Sacred Journey</p>
                </div>
              </div>


              <div className="p-8 md:col-span-3">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Register for the Umrah Lot for{" "}
                  <span className="font-semibold text-foreground">₹99</span>. Place
                  one sealed bid. When bidding closes, the participant with the
                  lowest unique bid wins.
                </p>

                <ul className="mt-6 space-y-2.5 text-sm text-muted-foreground">
                  {[
                    "₹99 registration fee per lot",
                    "Each lot requires a separate registration fee",
                    "One sealed bid per registration",
                    "Registration fees are non-refundable",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#lots"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-emerald-soft"
                  >
                    View Umrah Lot
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                    Non-refundable · ₹99
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* HOW GEM WORKS */}
      <section id="how" className="relative border-y border-accent/20 bg-card/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-accent">How GEM Works</p>
            <h2 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
              Four simple steps
            </h2>
            <div className="mx-auto mt-4 h-px w-24 bg-accent/60" />
          </div>

          <ol className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              { n: "01", t: "Register for a lot", b: "Browse open lots and choose the one you'd like to enter." },
              { n: "02", t: "Pay the registration fee", b: "A small, non-refundable fee secures your seat in that lot." },
              { n: "03", t: "Place one sealed bid", b: "Submit a single, private bid. Once placed, it's final." },
              { n: "04", t: "Lowest unique bid wins", b: "When bidding closes, the lowest bid no one else placed wins." },
            ].map((s) => (
              <li key={s.n} className="rounded-2xl border border-border bg-background/40 p-6 transition-colors hover:border-accent/40">
                <div className="font-serif text-3xl text-accent">{s.n}</div>
                <h3 className="mt-3 font-serif text-xl text-foreground">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* COMMUNITY IMAGE BAND */}
      <section className="relative py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-accent/20 shadow-elegant md:aspect-[3/2]">
              <img
                src={communityGiving}
                alt="Hands sharing dates around an emerald table"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent">Together</p>
              <h2 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
                More than a bid — a shared table.
              </h2>
              <div className="mt-4 h-px w-24 bg-accent/60" />
              <p className="mt-6 text-base leading-relaxed text-muted-foreground">
                Every registration adds a seat to our community. The fees you contribute
                quietly support families and causes that need a hand — turning a small
                act of participation into something far larger than yourself.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-3">
            <Trust
              icon={<Scale className="h-5 w-5" />}
              title="Fair by design"
              text="The lowest unique bid wins. No surprises, no hidden mechanics — the rules are the rules."
            />
            <Trust
              icon={<Lock className="h-5 w-5" />}
              title="One sealed bid"
              text="Pay the registration fee, place one private bid. Outcomes are revealed only when the lot closes."
            />
            <Trust
              icon={<HandHeart className="h-5 w-5" />}
              title="Giving built in"
              text="Registration fees support community initiatives — quietly, transparently, on purpose."
            />
          </div>
        </div>
      </section>

      {/* ACTIVE LOTS */}
      <section id="lots" className="relative border-t border-accent/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent">Active Lots</p>
              <h2 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">
                Open for registration
              </h2>
              <div className="mt-4 h-px w-24 bg-accent/60" />
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
                        "rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.25em] transition-all " +
                        (isActive
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground hover:border-accent/60 hover:text-accent")
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
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : visible.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-dashed border-accent/30 bg-card/40 px-6 py-20 text-center">
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent">No Open Lots Yet</p>
              <h3 className="mt-3 font-serif text-3xl text-foreground">New lots open soon.</h3>
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
    <div className="rounded-2xl border border-border bg-card/40 p-6">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-accent">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-2xl text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
