import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  HandHeart,
  ShieldCheck,
  Sparkles,
  Loader2,
  Users,
  Scale,
  Gift,
  HeartHandshake,
} from "lucide-react";
import { ReverseAuctionCard } from "@/components/ReverseAuctionCard";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CommunitySections } from "@/components/CommunitySections";
import { IslamicPattern, ArchDivider } from "@/components/IslamicPattern";
import { listPublicAuctions, type DbAuction } from "@/lib/db-auctions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Gilded — Where Compassion Meets Action" },
      {
        name: "description",
        content:
          "A premium Islamic community platform. Participate in lots, support the Ummah — every entry fee flows to those in need with Amanah and Ihsan.",
      },
      {
        property: "og:title",
        content: "The Gilded — A Community of Compassion",
      },
      {
        property: "og:description",
        content:
          "Where compassion meets action. Generosity, trust, and service — the Sunnah way.",
      },
    ],
  }),
  component: HomePage,
});

const CAUSES = [
  {
    icon: Gift,
    title: "Food Relief",
    arabic: "إِطْعَامُ ٱلطَّعَامِ",
    body: "Warm meals for families during hardship — beginning at home and reaching outward.",
  },
  {
    icon: Sparkles,
    title: "Education",
    arabic: "ٱلْعِلْم",
    body: "Tuition, books and supplies for students whose ambition outpaces their means.",
  },
  {
    icon: HandHeart,
    title: "Medical Support",
    arabic: "ٱلشِّفَاء",
    body: "Treatment and recovery for those facing illness without recourse.",
  },
  {
    icon: HeartHandshake,
    title: "Orphan Care",
    arabic: "كَفَالَةُ ٱلْيَتِيم",
    body: "Sponsorship, schooling and dignity for children entrusted to our community.",
  },
  {
    icon: ShieldCheck,
    title: "Emergency Aid",
    arabic: "ٱلْإِغَاثَة",
    body: "Rapid response when disaster, displacement or crisis strikes the Ummah.",
  },
  {
    icon: Users,
    title: "Community Projects",
    arabic: "خِدْمَةُ ٱلْأُمَّة",
    body: "Wells, masjids, livelihood programs — built together, sustained together.",
  },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Amanah",
    subtitle: "Trust",
    body: "Every rupee accounted for. Every contribution traceable.",
  },
  {
    icon: HandHeart,
    title: "Sadaqah",
    subtitle: "Generosity",
    body: "A continuous flow of giving — small acts, lasting reward.",
  },
  {
    icon: Sparkles,
    title: "Ihsan",
    subtitle: "Excellence",
    body: "To worship and serve as if witnessed — with grace and care.",
  },
  {
    icon: Users,
    title: "Ummah",
    subtitle: "Unity",
    body: "One community, many hands, a single purpose.",
  },
];

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
        {/* Background: layered gradients + geometric pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-onyx via-background to-onyx" />
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background:
                "radial-gradient(ellipse at 30% 20%, oklch(0.74 0.13 85 / 0.18), transparent 55%), radial-gradient(ellipse at 80% 80%, oklch(0.55 0.12 70 / 0.15), transparent 50%)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 opacity-70">
            <IslamicPattern opacity={0.14} />
          </div>
        </div>

        {/* Huge faint Arabic calligraphy as background art */}
        <p
          aria-hidden="true"
          lang="ar"
          dir="rtl"
          className="font-arabic pointer-events-none absolute inset-x-0 top-12 select-none text-center text-[14rem] leading-none text-gold/[0.04] sm:text-[20rem]"
        >
          ٱلْإِحْسَان
        </p>

        <div className="relative mx-auto max-w-7xl px-6 py-28 sm:py-36 md:py-44">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 inline-flex items-center gap-3 rounded-sm border border-gold/40 bg-onyx/60 px-4 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold pulse-gold" />
              <span className="text-[11px] uppercase tracking-[0.35em] text-gold">
                A Community of Compassion
              </span>
            </div>

            <p
              lang="ar"
              dir="rtl"
              className="font-arabic mb-6 text-2xl leading-relaxed text-gold/80 sm:text-3xl"
            >
              إِنَّ ٱللَّهَ يُحِبُّ ٱلْمُحْسِنِينَ
            </p>

            <h1 className="font-serif text-5xl leading-[1.05] text-ivory sm:text-6xl md:text-7xl">
              Where{" "}
              <span className="font-script text-gradient-gold text-6xl italic sm:text-7xl md:text-8xl">
                compassion
              </span>
              <br />
              meets action.
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
              A premium community platform built on the values of Islam. Every
              entry fee from every lot becomes Sadaqah — quiet, transparent,
              and given with Ihsan.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#lots"
                className="group inline-flex items-center gap-2 rounded-sm bg-gradient-gold-strong px-8 py-3.5 text-[11px] uppercase tracking-[0.3em] text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
              >
                <HandHeart className="h-4 w-4" />
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

          {/* Arch divider */}
          <div className="mt-20 flex justify-center text-gold/40">
            <ArchDivider className="h-12 w-56" />
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="about" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
            Our Amanah
          </p>
          <h2 className="mt-5 font-serif text-4xl text-ivory sm:text-5xl">
            A different kind of community.
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-gold" />
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
            We gather as an Ummah around lots offered by the community. The
            registration fees you contribute do not enrich a marketplace — they
            become meals, medicine, schooling and shelter for those in need.
            Participation is{" "}
            <span className="font-script text-2xl text-gold">purpose</span> made
            visible.
          </p>
        </div>
      </section>

      {/* CAUSES */}
      <section
        id="causes"
        className="relative border-y border-gold/20 bg-onyx/40 py-24 sm:py-32"
      >
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
              Causes We Serve
            </p>
            <h2 className="mt-5 font-serif text-4xl text-ivory sm:text-5xl">
              Where every fee finds a{" "}
              <span className="font-script text-5xl italic text-gradient-gold sm:text-6xl">
                home
              </span>
              .
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAUSES.map((c) => {
              const Icon = c.icon;
              return (
                <article
                  key={c.title}
                  className="group relative overflow-hidden rounded-sm border border-gold/20 bg-card p-8 transition-all duration-500 hover:border-gold/60 hover:shadow-gold"
                >
                  <div className="pointer-events-none absolute -right-4 -top-4 opacity-10 transition-opacity group-hover:opacity-20">
                    <Icon className="h-24 w-24 text-gold" />
                  </div>
                  <div className="relative">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-sm border border-gold/30 bg-onyx text-gold">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p
                      lang="ar"
                      dir="rtl"
                      className="font-arabic mt-5 text-xl text-gold/80"
                    >
                      {c.arabic}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-ivory">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {c.body}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
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
                Participate. Give. Together.
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
                New lots open soon, inshaAllah.
              </h3>
              <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                Sign in to be notified when the next round of community lots
                begins.
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
              Four steps. One{" "}
              <span className="font-script text-5xl italic text-gradient-gold">
                intention
              </span>
              .
            </h2>
          </div>

          <ol className="mt-16 grid gap-10 md:grid-cols-4">
            {[
              {
                n: "01",
                t: "Sign In",
                b: "Join the community with a verified profile — Amanah begins with identity.",
              },
              {
                n: "02",
                t: "Choose a Lot",
                b: "Browse open lots. Each entry fee is the contribution that supports a cause.",
              },
              {
                n: "03",
                t: "Place One Bid",
                b: "A single sealed bid. The lowest unique amount wins the lot.",
              },
              {
                n: "04",
                t: "Give Together",
                b: "Pooled fees are distributed to verified causes, reported transparently.",
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

      {/* VALUES */}
      <section id="zakat" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">
              Islamic Values
            </p>
            <h2 className="mt-5 font-serif text-4xl text-ivory sm:text-5xl">
              The pillars of this house.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="group rounded-sm border border-gold/20 bg-card p-8 transition-all duration-500 hover:border-gold/60"
                >
                  <Icon className="h-6 w-6 text-gold transition-transform group-hover:scale-110" />
                  <h3 className="mt-5 font-serif text-3xl text-ivory">
                    {v.title}
                  </h3>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-gold/80">
                    {v.subtitle}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section id="sadaqah" className="border-y border-gold/20 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-3">
            <Trust
              icon={<Scale className="h-6 w-6" />}
              title="Lowest Unique Wins"
              text="The winning amount is the one with the fewest participants. Ties resolve to the lowest sum, then the earliest timestamp."
            />
            <Trust
              icon={<ShieldCheck className="h-6 w-6" />}
              title="One Sealed Bid"
              text="Pay the entry fee once. Place a single sealed bid. Outcomes revealed only when the lot closes."
            />
            <Trust
              icon={<HandHeart className="h-6 w-6" />}
              title="Every Fee, A Sadaqah"
              text="Entry fees pool into a community fund and are routed to verified causes — reported with full transparency."
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
