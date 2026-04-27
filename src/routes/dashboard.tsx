import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Gavel, Package, Shield, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardHub,
});

function DashboardHub() {
  const { user, loading, isAdmin, roles, isVerified } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  if (loading || !user) return null;
  const isSeller = roles.includes("seller") || isAdmin;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-serif text-4xl text-ivory">Your Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose where you want to go.
        </p>

        {!isVerified && !isAdmin && (
          <div className="mt-6 rounded-sm border border-amber-warn/40 bg-amber-warn/5 p-4 text-sm text-amber-warn">
            Your account is pending WhatsApp verification.{" "}
            <Link to="/verify" className="underline">Complete verification →</Link>
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashCard
            to="/buyer"
            icon={<Gavel className="h-6 w-6" />}
            title="Buyer"
            desc="Track your active bids and watchlist."
          />
          {isSeller && (
            <DashCard
              to="/seller"
              icon={<Package className="h-6 w-6" />}
              title="Seller"
              desc="Submit listings for admin approval."
            />
          )}
          {isAdmin && (
            <DashCard
              to="/admin"
              icon={<Shield className="h-6 w-6" />}
              title="Admin"
              desc="Approve users and listings."
            />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function DashCard({
  to,
  icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group block rounded-sm border border-gold/20 bg-card p-6 transition-all hover:border-gold hover:shadow-gold"
    >
      <div className="flex items-center gap-3 text-gold">{icon}<span className="font-serif text-xl text-ivory">{title}</span></div>
      <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-gold">
        Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
