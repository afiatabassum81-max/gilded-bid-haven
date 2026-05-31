import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Gavel, Trophy, Clock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/buyer")({
  component: BuyerDashboard,
});

type Listing = {
  id: string; title: string; status: string;
  start_at: string | null; end_at: string | null;
  winning_amount: number | null; winner_user_id: string | null;
  image_url: string | null;
};
type Entry = { auction_id: string; amount_paid: number; paid_at: string };
type Bid = { auction_id: string; amount: number; created_at: string };

function BuyerDashboard() {
  const { user, loading, isVerified, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"active" | "participated" | "won">("active");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [listings, setListings] = useState<Record<string, Listing>>({});
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      setDataLoading(true);
      const [e, b] = await Promise.all([
        supabase.from("auction_entries").select("auction_id, amount_paid, paid_at").eq("user_id", user.id),
        supabase.from("auction_bids").select("auction_id, amount, created_at").eq("user_id", user.id),
      ]);
      const ents = (e.data as Entry[]) ?? [];
      const bs = (b.data as Bid[]) ?? [];
      setEntries(ents);
      setBids(bs);
      const ids = Array.from(new Set([...ents.map((x) => x.auction_id), ...bs.map((x) => x.auction_id)]));
      if (ids.length > 0) {
        const { data: ls } = await supabase.from("auction_listings").select("id, title, status, start_at, end_at, winning_amount, winner_user_id, image_url").in("id", ids);
        const map: Record<string, Listing> = {};
        (ls as Listing[] | null)?.forEach((l) => { map[l.id] = l; });
        setListings(map);
      }
      setDataLoading(false);
    })();
  }, [user]);

  if (loading || !user) return null;

  const activeIds = entries.filter((e) => {
    const l = listings[e.auction_id];
    return l && (l.status === "active" || l.status === "upcoming");
  });
  const participatedIds = bids.map((b) => b.auction_id);
  const wonIds = Object.values(listings).filter((l) => l.winner_user_id === user.id);

  const list =
    tab === "active" ? activeIds.map((e) => listings[e.auction_id]).filter(Boolean)
    : tab === "participated" ? participatedIds.map((id) => listings[id]).filter(Boolean)
    : wonIds;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Buyer</p>
          <h1 className="mt-2 font-serif text-4xl text-ivory">Your Auctions</h1>
        </div>

        {!isVerified && !isAdmin && (
          <div className="mb-8 rounded-sm border border-amber-warn/40 bg-amber-warn/5 p-4 text-sm text-amber-warn">
            Complete verification to participate.{" "}
            <Link to="/verify" className="underline">Verify now →</Link>
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-2 border-b border-gold/20">
          <Tab active={tab === "active"} onClick={() => setTab("active")} icon={<Clock className="h-3.5 w-3.5" />}>
            Active ({activeIds.length})
          </Tab>
          <Tab active={tab === "participated"} onClick={() => setTab("participated")} icon={<Gavel className="h-3.5 w-3.5" />}>
            Participated ({bids.length})
          </Tab>
          <Tab active={tab === "won"} onClick={() => setTab("won")} icon={<Trophy className="h-3.5 w-3.5" />}>
            Won ({wonIds.length})
          </Tab>
        </div>

        {dataLoading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
        ) : list.length === 0 ? (
          <div className="rounded-sm border border-gold/20 bg-card p-12 text-center">
            <Gavel className="mx-auto h-10 w-10 text-gold/60" />
            <h2 className="mt-4 font-serif text-2xl text-ivory">Nothing here yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse live auctions to participate.</p>
            <Link to="/" className="mt-6 inline-flex rounded-sm border border-gold/40 px-5 py-2 text-xs uppercase tracking-widest text-ivory hover:border-gold hover:text-gold">
              Browse Auctions
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {list.map((l) => {
              const myBid = bids.find((b) => b.auction_id === l.id);
              const isWinner = l.winner_user_id === user.id;
              return (
                <Link key={l.id} to="/auctions/$id" params={{ id: l.id }} className="block rounded-sm border border-gold/20 bg-card p-5 transition-all hover:border-gold">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-lg text-ivory">{l.title}</div>
                      <div className="mt-1 text-xs uppercase tracking-widest text-gold/70">{l.status.replace("_", " ")}</div>
                      {myBid && <div className="mt-2 text-sm text-muted-foreground">Your bid: <span className="text-ivory">₹{Number(myBid.amount).toLocaleString("en-IN")}</span></div>}
                      {isWinner && l.winning_amount != null && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-sm bg-gold/20 px-2 py-1 text-[10px] uppercase tracking-widest text-gold">
                          <Trophy className="h-3 w-3" /> You won at ₹{Number(l.winning_amount).toLocaleString("en-IN")}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Tab({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
        active ? "border-b-2 border-gold text-gold" : "text-muted-foreground hover:text-ivory"
      }`}
    >
      {icon}{children}
    </button>
  );
}
