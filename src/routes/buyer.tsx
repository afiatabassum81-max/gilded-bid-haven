import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Gavel } from "lucide-react";

export const Route = createFileRoute("/buyer")({
  component: BuyerDashboard,
});

function BuyerDashboard() {
  const { user, loading, isVerified, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Buyer</p>
          <h1 className="mt-2 font-serif text-4xl text-ivory">My Active Bids</h1>
        </div>

        {!isVerified && !isAdmin && (
          <div className="mb-8 rounded-sm border border-amber-warn/40 bg-amber-warn/5 p-4 text-sm text-amber-warn">
            Complete WhatsApp verification to start bidding.{" "}
            <Link to="/verify" className="underline">Verify now →</Link>
          </div>
        )}

        <div className="rounded-sm border border-gold/20 bg-card p-12 text-center">
          <Gavel className="mx-auto h-10 w-10 text-gold/60" />
          <h2 className="mt-4 font-serif text-2xl text-ivory">No active bids yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse the live auctions floor to place your first bid.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center rounded-sm border border-gold/40 px-5 py-2 text-xs uppercase tracking-widest text-ivory hover:border-gold hover:text-gold"
          >
            Browse Auctions
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
