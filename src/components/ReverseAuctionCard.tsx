import { Link } from "@tanstack/react-router";
import { Gavel, Tag } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { effectiveState, formatINR, type DbAuction } from "@/lib/db-auctions";

export function ReverseAuctionCard({ auction }: { auction: DbAuction }) {
  const state = effectiveState(auction);
  const endsAt = auction.end_at ? new Date(auction.end_at).getTime() : 0;

  return (
    <Link
      to="/auctions/$id"
      params={{ id: auction.id }}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-card shadow-card transition-all duration-500 hover:border-gold/60 hover:shadow-elegant"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-onyx">
        {auction.image_url && (
          <img
            src={auction.image_url}
            alt={auction.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/90 via-onyx/10 to-transparent" />

        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-sm border border-gold/40 bg-onyx/80 px-2.5 py-1 backdrop-blur">
          {state === "active" && <span className="live-dot" />}
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ivory">
            {state.replace("_", " ")}
          </span>
        </div>

        {endsAt > 0 && state === "active" && (
          <div className="absolute bottom-4 right-4">
            <Countdown endsAt={endsAt} compact />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {auction.category ?? "General"}
        </p>
        <h3 className="mt-1.5 line-clamp-2 font-serif text-xl leading-tight text-ivory transition-colors group-hover:text-gold">
          {auction.title}
        </h3>

        <div className="mt-5 flex items-end justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Entry Fee
            </p>
            <p className="mt-1 font-serif text-2xl font-semibold text-gold">
              {formatINR(Number(auction.entry_fee))}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Gavel className="h-3.5 w-3.5 text-gold" />
            Reverse auction
          </div>
        </div>

        {state === "winner_announced" && auction.winning_amount != null && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-gold/15 px-2 py-1 text-[10px] uppercase tracking-widest text-gold">
            <Tag className="h-3 w-3" /> Won at {formatINR(Number(auction.winning_amount))}
          </div>
        )}
      </div>
    </Link>
  );
}
