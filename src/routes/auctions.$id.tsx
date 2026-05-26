import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Lock, ShieldCheck, Trophy } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Countdown } from "@/components/Countdown";
import { useAuth } from "@/lib/auth-context";
import {
  type DbAuction,
  effectiveState,
  formatINR,
  getAuction,
  getMyBid,
  getMyEntry,
  getWinner,
  payEntry,
  submitBid,
} from "@/lib/db-auctions";

export const Route = createFileRoute("/auctions/$id")({
  component: AuctionPage,
});

function AuctionPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<DbAuction | null>(null);
  const [entry, setEntry] = useState<any>(null);
  const [bid, setBid] = useState<any>(null);
  const [winner, setWinner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const a = await getAuction(id);
    setAuction(a);
    if (a && user) {
      const [e, b] = await Promise.all([getMyEntry(id, user.id), getMyBid(id, user.id)]);
      setEntry(e);
      setBid(b);
    }
    if (a?.status === "winner_announced") {
      setWinner(await getWinner(id));
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="flex justify-center py-32"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
      </div>
    );
  }
  if (!auction) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-xl px-6 py-32 text-center">
          <h1 className="font-serif text-4xl text-ivory">Auction not found</h1>
          <Link to="/" className="mt-6 inline-block text-gold underline">Return home</Link>
        </div>
      </div>
    );
  }

  const state = effectiveState(auction);
  const endsAt = auction.end_at ? new Date(auction.end_at).getTime() : 0;
  const startsAt = auction.start_at ? new Date(auction.start_at).getTime() : 0;

  const handlePayEntry = async () => {
    if (!user) return navigate({ to: "/login" });
    setBusy(true);
    try {
      await payEntry(auction.id, user.id, Number(auction.entry_fee));
      toast.success("Entry fee paid — you may now place your bid");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Could not record entry");
    } finally {
      setBusy(false);
    }
  };

  const handleSubmitBid = async () => {
    if (!user) return;
    const amt = Number(bidAmount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    setBusy(true);
    try {
      await submitBid(auction.id, user.id, amt);
      toast.success("Bid submitted and locked");
      setConfirmOpen(false);
      setBidAmount("");
      await load();
    } catch (e: any) {
      toast.error(e.message || "Could not submit bid");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto grid max-w-7xl gap-12 px-6 py-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-sm border border-gold/30 bg-onyx">
            {auction.image_url ? (
              <img src={auction.image_url} alt={auction.title} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-muted-foreground">No image</div>
            )}
          </div>
          <h1 className="mt-8 font-serif text-4xl text-ivory">{auction.title}</h1>
          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gold">
            {auction.category ?? "General"}{auction.item_condition ? ` · ${auction.item_condition}` : ""}
          </p>
          {auction.description && (
            <p className="mt-6 leading-relaxed text-muted-foreground whitespace-pre-line">{auction.description}</p>
          )}
          {auction.rules && (
            <div className="mt-8 rounded-sm border border-gold/30 bg-card p-5">
              <h3 className="font-serif text-lg text-ivory">Auction Rules</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{auction.rules}</p>
            </div>
          )}
          {auction.terms && (
            <div className="mt-4 rounded-sm border border-border bg-card p-5">
              <h3 className="font-serif text-lg text-ivory">Terms &amp; Conditions</h3>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{auction.terms}</p>
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-sm border border-gold/40 bg-card p-6 shadow-elegant">
            <StateBadge state={state} />

            {state === "upcoming" && (
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Auction Starts In</p>
                {startsAt > 0 && <Countdown endsAt={startsAt} className="mt-3" />}
              </div>
            )}

            {state === "active" && (
              <div className="mt-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Auction Ends In</p>
                {endsAt > 0 && <Countdown endsAt={endsAt} className="mt-3" />}
              </div>
            )}

            {state === "paused" && (
              <p className="mt-6 rounded-sm border border-amber-warn/40 bg-amber-warn/10 p-3 text-sm text-amber-warn">
                This auction is temporarily paused by the administrator.
              </p>
            )}

            {state === "closed" && (
              <p className="mt-6 rounded-sm border border-border bg-onyx p-3 text-sm text-muted-foreground">
                Bidding is closed. The winner is being determined.
              </p>
            )}

            {state === "winner_announced" && winner && (
              <div className="mt-6 rounded-sm border border-gold/60 bg-gradient-to-br from-gold/10 to-transparent p-5">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-gold" />
                  <span className="font-serif text-lg text-ivory">Winning Amount</span>
                </div>
                <div className="mt-2 font-serif text-4xl text-gradient-gold">
                  {formatINR(Number(winner.winning_amount))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Selected by {winner.total_participants} participant(s) total · winner determined by earliest timestamp.
                </p>
                {user && winner.winner_user_id === user.id && (
                  <p className="mt-3 rounded-sm bg-emerald-500/15 px-3 py-2 text-sm text-emerald-400">
                    Congratulations — you won this auction.
                  </p>
                )}
              </div>
            )}

            <div className="mt-6 border-t border-border pt-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Entry Fee</p>
              <p className="mt-1 font-serif text-2xl text-ivory">{formatINR(Number(auction.entry_fee))}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Participation fees are non-refundable and grant access to the auction.
              </p>
            </div>

            {state === "active" && (
              <div className="mt-6">
                {!user ? (
                  <button
                    onClick={() => navigate({ to: "/login" })}
                    className="w-full rounded-sm bg-gradient-gold-strong py-3 text-sm uppercase tracking-widest text-primary-foreground"
                  >Sign in to participate</button>
                ) : bid ? (
                  <div className="rounded-sm border border-emerald-500/40 bg-emerald-500/10 p-4">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-semibold uppercase tracking-widest">Your bid is locked</span>
                    </div>
                    <p className="mt-2 font-serif text-3xl text-ivory">{formatINR(Number(bid.amount))}</p>
                    <p className="mt-2 text-[11px] text-muted-foreground">
                      Submitted bids cannot be modified, deleted, or withdrawn.
                    </p>
                  </div>
                ) : !entry ? (
                  <button
                    disabled={busy}
                    onClick={handlePayEntry}
                    className="w-full rounded-sm bg-gradient-gold-strong py-3 text-sm uppercase tracking-widest text-primary-foreground disabled:opacity-60"
                  >
                    {busy ? "Processing…" : `Pay ${formatINR(Number(auction.entry_fee))} to participate`}
                  </button>
                ) : (
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Your Bid Amount (INR)</label>
                    <div className="mt-2 flex">
                      <span className="grid place-items-center rounded-l-sm border border-r-0 border-gold/40 bg-onyx px-4 font-serif text-xl text-gold">₹</span>
                      <input
                        type="number"
                        min={1}
                        step="0.01"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full rounded-r-sm border border-gold/40 bg-onyx px-4 py-3 font-serif text-xl text-ivory outline-none focus:border-gold"
                      />
                    </div>
                    <p className="mt-3 rounded-sm border border-amber-warn/30 bg-amber-warn/5 p-3 text-[11px] text-amber-warn">
                      Submitted bids cannot be modified. Please verify your amount before confirming.
                    </p>
                    <button
                      disabled={busy || !bidAmount}
                      onClick={() => setConfirmOpen(true)}
                      className="mt-3 w-full rounded-sm bg-gradient-gold-strong py-3 text-sm uppercase tracking-widest text-primary-foreground disabled:opacity-60"
                    >
                      Review &amp; Submit Bid
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 flex items-start gap-2 rounded-sm border border-border bg-onyx/40 p-3 text-[11px] text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
              <span>
                Winner is determined by the bid amount selected by the <strong>fewest</strong> participants. Ties resolved by lowest amount, then earliest timestamp. Other bids remain private until the auction concludes.
              </span>
            </div>
          </div>
        </aside>
      </main>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-sm border border-gold/40 bg-card p-6">
            <h3 className="font-serif text-2xl text-ivory">Confirm Your Bid</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You are about to submit a bid of <span className="font-serif text-gold">{formatINR(Number(bidAmount) || 0)}</span> for <strong className="text-ivory">{auction.title}</strong>.
            </p>
            <p className="mt-3 text-[12px] text-amber-warn">
              This action is final. Bids cannot be modified, deleted, changed or withdrawn.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setConfirmOpen(false)} className="flex-1 rounded-sm border border-border py-2 text-xs uppercase tracking-widest text-muted-foreground">Cancel</button>
              <button disabled={busy} onClick={handleSubmitBid} className="flex-1 rounded-sm bg-gradient-gold-strong py-2 text-xs uppercase tracking-widest text-primary-foreground disabled:opacity-60">
                {busy ? "Submitting…" : "Confirm Bid"}
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

function StateBadge({ state }: { state: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    upcoming: { label: "Upcoming", cls: "bg-blue-500/15 text-blue-400 border-blue-500/40" },
    active: { label: "Active", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40" },
    paused: { label: "Paused", cls: "bg-amber-warn/15 text-amber-warn border-amber-warn/40" },
    closed: { label: "Closed", cls: "bg-muted text-muted-foreground border-border" },
    winner_announced: { label: "Winner Announced", cls: "bg-gold/15 text-gold border-gold/40" },
    draft: { label: "Draft", cls: "bg-muted text-muted-foreground border-border" },
  };
  const v = map[state] ?? map.draft;
  return (
    <span className={`inline-flex rounded-sm border px-2.5 py-1 text-[10px] uppercase tracking-widest ${v.cls}`}>
      {v.label}
    </span>
  );
}
