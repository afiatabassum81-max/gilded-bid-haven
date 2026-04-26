import { Link } from "@tanstack/react-router";
import { Eye, Gavel } from "lucide-react";
import { type Auction, categoryLabel, formatINR } from "@/lib/auctions";
import { Countdown } from "@/components/Countdown";

export function AuctionCard({ auction }: { auction: Auction }) {
  return (
    <Link
      to="/auction/$slug"
      params={{ slug: auction.slug }}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card shadow-card transition-all duration-500 hover:border-gold/60 hover:shadow-elegant"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-onyx">
        <img
          src={auction.images[0]}
          alt={auction.title}
          loading="lazy"
          width={1024}
          height={1024}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-onyx/10 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm border border-destructive/60 bg-onyx/80 px-2.5 py-1 backdrop-blur">
          <span className="live-dot" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ivory">
            Live
          </span>
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-sm bg-onyx/80 px-2.5 py-1 text-xs text-muted-foreground backdrop-blur">
          <Eye className="h-3.5 w-3.5" />
          {auction.watchers}
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">
            {auction.lotNumber}
          </span>
          <Countdown endsAt={auction.endsAt} compact />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {categoryLabel[auction.category]}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-xl leading-tight text-ivory transition-colors group-hover:text-gold">
          {auction.title}
        </h3>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Current Bid
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-gold">
              {formatINR(auction.currentBid)}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gavel className="h-3.5 w-3.5 text-gold" />
            {auction.bidCount} bids
          </div>
        </div>
      </div>
    </Link>
  );
}
