import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Eye,
  Gavel,
  Heart,
  Share2,
  ShieldCheck,
  Truck,
  User2,
} from "lucide-react";
import {
  type Auction,
  type Bid,
  categoryLabel,
  findAuction,
  formatINR,
  minNextBid,
  nextIncrement,
} from "@/lib/auctions";
import { Countdown } from "@/components/Countdown";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { LockedOverlay } from "@/components/LockedOverlay";

export const Route = createFileRoute("/auction/$slug")({
  loader: ({ params }) => {
    const auction = findAuction(params.slug);
    if (!auction) throw notFound();
    return { auction };
  },
  head: ({ loaderData }) => {
    const a = loaderData?.auction;
    if (!a) return { meta: [{ title: "Lot Not Found" }] };
    return {
      meta: [
        { title: `${a.title} — ${a.lotNumber} | The Gilded Auction House` },
        { name: "description", content: a.description.slice(0, 155) },
        { property: "og:title", content: `${a.title} — Live Auction` },
        { property: "og:description", content: a.description.slice(0, 155) },
        { property: "og:image", content: a.images[0] },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: a.images[0] },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">404</p>
        <h1 className="mt-4 font-serif text-5xl text-ivory">Lot Not Found</h1>
        <p className="mt-4 text-muted-foreground">
          This catalogue entry has been withdrawn or never existed.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-sm border border-gold/40 px-6 py-3 text-sm uppercase tracking-widest text-gold transition-colors hover:bg-gold hover:text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Auctions
        </Link>
      </div>
    </div>
  ),
  component: AuctionDetailPage,
});

function AuctionDetailPage() {
  const { auction } = Route.useLoaderData();
  return <AuctionDetail initial={auction} />;
}

function AuctionDetail({ initial }: { initial: Auction }) {
  const [active, setActive] = useState(0);
  const [currentBid, setCurrentBid] = useState(initial.currentBid);
  const [bidCount, setBidCount] = useState(initial.bidCount);
  const [endsAt, setEndsAt] = useState(initial.endsAt);
  const [watchers, setWatchers] = useState(initial.watchers);
  const [bids, setBids] = useState<Bid[]>(initial.recentBids);
  const [bidInput, setBidInput] = useState(minNextBid(initial.currentBid));
  const [flash, setFlash] = useState(false);

  // Live watchers fluctuation (social proof)
  useEffect(() => {
    const id = setInterval(() => {
      setWatchers((w) => Math.max(20, w + (Math.random() > 0.5 ? 1 : -1)));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // Sync min input as bid changes
  useEffect(() => {
    setBidInput(minNextBid(currentBid));
  }, [currentBid]);

  function placeBid() {
    if (bidInput < minNextBid(currentBid)) return;
    const newBid: Bid = {
      id: Math.random().toString(36).slice(2),
      bidder: "you",
      amount: bidInput,
      ago: "just now",
    };
    setBids((b) => [newBid, ...b]);
    setCurrentBid(bidInput);
    setBidCount((n) => n + 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 800);

    // Anti-sniping: extend by 2 minutes if under 30s remaining
    if (endsAt - Date.now() < 30_000) {
      setEndsAt((e) => e + 2 * 60_000);
    }
  }

  const minBid = minNextBid(currentBid);
  const increment = nextIncrement(currentBid);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Auctions
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 lg:grid-cols-[1.15fr_1fr]">
        {/* GALLERY */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-onyx shadow-elegant">
            <img
              src={initial.images[active]}
              alt={initial.title}
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm border border-destructive/60 bg-onyx/80 px-3 py-1.5 backdrop-blur">
              <span className="live-dot" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-ivory">
                Live Bidding
              </span>
            </div>
            <div className="absolute right-4 top-4 flex gap-2">
              <button className="grid h-9 w-9 place-items-center rounded-sm border border-gold/40 bg-onyx/80 text-gold backdrop-blur transition-colors hover:bg-gold hover:text-primary-foreground">
                <Heart className="h-4 w-4" />
              </button>
              <button className="grid h-9 w-9 place-items-center rounded-sm border border-gold/40 bg-onyx/80 text-gold backdrop-blur transition-colors hover:bg-gold hover:text-primary-foreground">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {initial.images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {initial.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={
                    "h-20 w-20 overflow-hidden rounded-sm border-2 transition-all " +
                    (active === i ? "border-gold" : "border-border hover:border-gold/60")
                  }
                >
                  <img
                    src={img}
                    alt=""
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="mt-12">
            <h2 className="font-serif text-2xl text-ivory">Lot Description</h2>
            <div className="mt-3 h-px w-16 bg-gold" />
            <p className="mt-6 leading-relaxed text-muted-foreground">
              {initial.description}
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <DetailRow label="Provenance" value={initial.provenance} />
              <DetailRow label="Consigned By" value={initial.seller} />
              <DetailRow label="Lot Number" value={initial.lotNumber} />
              <DetailRow label="Department" value={categoryLabel[initial.category]} />
            </dl>

            {/* SHIPPING */}
            <div className="mt-10 rounded-sm border border-gold/30 bg-card p-6">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-gold" />
                <h3 className="font-serif text-lg text-ivory">Shipping & Delivery</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {initial.shipping}
              </p>
              <p className="mt-3 text-xs italic text-muted-foreground">
                Seller is responsible for arranging delivery to the winning buyer.
              </p>
            </div>
          </div>
        </div>

        {/* BIDDING PANEL */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-sm border border-gold/40 bg-card shadow-elegant">
            <div className="border-b border-border p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-gold">
                {initial.lotNumber} · {categoryLabel[initial.category]}
              </p>
              <h1 className="mt-3 font-serif text-3xl leading-tight text-ivory sm:text-4xl">
                {initial.title}
              </h1>

              <div className="mt-5 flex items-center gap-5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-gold" />
                  <span className="font-semibold text-ivory">{watchers}</span> watching
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Gavel className="h-3.5 w-3.5 text-gold" />
                  <span className="font-semibold text-ivory">{bidCount}</span> bids
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User2 className="h-3.5 w-3.5 text-gold" />
                  Reserve: <span className="text-ivory">None</span>
                </span>
              </div>
            </div>

            <div className="p-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                Current Bid
              </p>
              <div
                className={
                  "mt-2 font-serif text-5xl font-semibold text-gradient-gold transition-all " +
                  (flash ? "scale-105" : "")
                }
              >
                {formatINR(currentBid)}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Starting bid: {formatINR(initial.startingPrice)}
              </p>

              <div className="mt-6 rounded-sm border border-border bg-onyx/40 p-4">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  Time Remaining
                </p>
                <Countdown endsAt={endsAt} className="mt-3" />
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    Your Bid (min {formatINR(minBid)})
                  </label>
                  <div className="mt-2 flex">
                    <span className="grid place-items-center rounded-l-sm border border-r-0 border-gold/40 bg-onyx px-4 font-serif text-xl text-gold">
                      ₹
                    </span>
                    <input
                      type="number"
                      step={increment}
                      min={minBid}
                      value={bidInput}
                      onChange={(e) => setBidInput(Number(e.target.value))}
                      className="w-full rounded-r-sm border border-gold/40 bg-onyx px-4 py-3 font-serif text-xl text-ivory outline-none focus:border-gold"
                    />
                  </div>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 5].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setBidInput(minBid + (m - 1) * increment)}
                        className="flex-1 rounded-sm border border-border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:border-gold hover:text-gold"
                      >
                        +{formatINR((m - 1) * increment + increment)}
                      </button>
                    ))}
                  </div>
                </div>

                <LockedOverlay>
                  <button
                    type="button"
                    onClick={placeBid}
                    className="pulse-gold w-full rounded-sm bg-gradient-gold-strong py-4 font-serif text-lg uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5"
                  >
                    Place Bid · {formatINR(bidInput)}
                  </button>
                </LockedOverlay>

                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  By bidding you agree to the terms of sale. Bids are binding.
                  Anti-sniping: bids in the final 30 seconds extend the auction by 2 min.
                </p>
              </div>

              <div className="mt-6 flex items-start gap-2 rounded-sm border border-border bg-onyx/30 p-3 text-xs text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <span>
                  Straight auction — highest bid at the hammer wins. 10% buyer's premium
                  added at checkout. Settled in INR via secure payment.
                </span>
              </div>
            </div>

            {/* BID HISTORY */}
            <div className="border-t border-border p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg text-ivory">Live Bid Activity</h3>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span className="live-dot" /> Live
                </span>
              </div>
              <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {bids.map((b, i) => (
                  <li
                    key={b.id}
                    className={
                      "flex items-center justify-between rounded-sm border px-3 py-2.5 text-sm transition-all " +
                      (i === 0
                        ? "border-gold/60 bg-gold/5"
                        : "border-border bg-onyx/40")
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-gold text-[10px] font-bold text-primary-foreground">
                        {b.bidder.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-ivory">
                          <span className="font-medium">{b.bidder}</span>
                          {i === 0 && (
                            <span className="ml-2 rounded-sm bg-gold/20 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-gold">
                              Leading
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{b.ago}</p>
                      </div>
                    </div>
                    <span className="font-serif font-semibold text-gold">
                      {formatINR(b.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-gold/40 pl-4">
      <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-ivory">{value}</dd>
    </div>
  );
}
