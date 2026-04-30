import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Loader2, ShieldCheck, UserCheck, Check, X, Crown, Mail, Phone, MapPin, Cake } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  age: number | null;
  phone: string | null;
  address: string | null;
  verified: boolean;
  created_at: string;
};

type ListingRow = {
  id: string;
  seller_id: string;
  title: string;
  category: string | null;
  starting_price: number;
  status: "pending" | "approved" | "rejected" | "live" | "ended";
  created_at: string;
};

type RoleRow = { user_id: string; role: "admin" | "seller" | "buyer" };

function AdminPanel() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"users" | "listings">("users");
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    if (!isAdmin) {
      toast.error("Admin access only");
      navigate({ to: "/" });
    }
  }, [loading, user, isAdmin, navigate]);

  const fetchAll = async () => {
    setLoadingData(true);
    const [{ data: p }, { data: r }, { data: l }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
      supabase.from("auction_listings").select("*").order("created_at", { ascending: false }),
    ]);
    setProfiles((p as ProfileRow[]) ?? []);
    setRoles((r as RoleRow[]) ?? []);
    setListings((l as ListingRow[]) ?? []);
    setLoadingData(false);
  };

  useEffect(() => {
    if (isAdmin) void fetchAll();
  }, [isAdmin]);

  if (loading || !user || !isAdmin) return null;

  const rolesByUser = roles.reduce<Record<string, string[]>>((acc, r) => {
    acc[r.user_id] = [...(acc[r.user_id] ?? []), r.role];
    return acc;
  }, {});

  const toggleVerify = async (id: string, current: boolean) => {
    const { error } = await supabase.from("profiles").update({ verified: !current }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(!current ? "User verified" : "Verification revoked");
    void fetchAll();
  };

  const grantSeller = async (uid: string) => {
    const { error } = await supabase.from("user_roles").insert({ user_id: uid, role: "seller" });
    if (error) return toast.error(error.message);
    toast.success("Seller role granted");
    void fetchAll();
  };

  const revokeSeller = async (uid: string) => {
    const { error } = await supabase
      .from("user_roles").delete().eq("user_id", uid).eq("role", "seller");
    if (error) return toast.error(error.message);
    toast.success("Seller role revoked");
    void fetchAll();
  };

  const setListingStatus = async (id: string, status: ListingRow["status"]) => {
    const { error } = await supabase.from("auction_listings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Listing ${status}`);
    void fetchAll();
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-gold" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Admin</p>
            <h1 className="font-serif text-4xl text-ivory">Control Panel</h1>
          </div>
        </div>

        <div className="mt-8 flex gap-2 border-b border-gold/20">
          <TabButton active={tab === "users"} onClick={() => setTab("users")}>
            Users ({profiles.length})
          </TabButton>
          <TabButton active={tab === "listings"} onClick={() => setTab("listings")}>
            Listings ({listings.length})
          </TabButton>
        </div>

        {loadingData ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : tab === "users" ? (
          <div className="mt-6 grid gap-3">
            {profiles.length === 0 && (
              <p className="text-sm text-muted-foreground">No users yet.</p>
            )}
            {profiles.map((p) => {
              const userRoles = rolesByUser[p.id] ?? [];
              const isUserAdmin = userRoles.includes("admin");
              const isSeller = userRoles.includes("seller");
              return (
                <div
                  key={p.id}
                  className="flex flex-col gap-3 rounded-sm border border-gold/20 bg-card p-4 md:flex-row md:items-start md:justify-between"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base text-ivory">
                        {p.full_name ?? "(no name)"}
                      </span>
                      {isUserAdmin && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-gold/20 px-2 py-0.5 text-[9px] uppercase tracking-widest text-gold">
                          <Crown className="h-2.5 w-2.5" /> Admin
                        </span>
                      )}
                      {isSeller && (
                        <span className="rounded-sm bg-emerald-500/15 px-2 py-0.5 text-[9px] uppercase tracking-widest text-emerald-400">
                          Seller
                        </span>
                      )}
                    </div>
                    <div className="grid gap-1.5 text-xs text-muted-foreground sm:grid-cols-2">
                      <InfoLine icon={<Mail className="h-3.5 w-3.5" />} value={p.email} />
                      <InfoLine icon={<Phone className="h-3.5 w-3.5" />} value={p.phone} />
                      <InfoLine icon={<Cake className="h-3.5 w-3.5" />} value={p.age ? `${p.age} yrs` : null} />
                      <InfoLine icon={<MapPin className="h-3.5 w-3.5" />} value={p.address} />
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-sm px-2 py-1 text-[10px] uppercase tracking-widest ${
                        p.verified
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-warn/15 text-amber-warn"
                      }`}
                    >
                      {p.verified ? "Verified" : "Pending"}
                    </span>
                    <button
                      onClick={() => toggleVerify(p.id, p.verified)}
                      className="inline-flex items-center gap-1 rounded-sm border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-widest text-ivory hover:border-gold hover:text-gold"
                    >
                      <UserCheck className="h-3 w-3" />
                      {p.verified ? "Revoke" : "Verify"}
                    </button>
                    {isSeller ? (
                      <button
                        onClick={() => revokeSeller(p.id)}
                        className="rounded-sm border border-red-500/40 px-3 py-1 text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-500/10"
                      >
                        Revoke Seller
                      </button>
                    ) : (
                      <button
                        onClick={() => grantSeller(p.id)}
                        className="rounded-sm border border-emerald-500/40 px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10"
                      >
                        Grant Seller
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {listings.length === 0 && (
              <p className="text-sm text-muted-foreground">No listings submitted yet.</p>
            )}
            {listings.map((l) => (
              <div
                key={l.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-gold/20 bg-card p-4"
              >
                <div>
                  <div className="font-serif text-base text-ivory">{l.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {l.category ?? "—"} · ₹{Number(l.starting_price).toLocaleString("en-IN")} ·
                    Status: <span className="text-ivory">{l.status}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setListingStatus(l.id, "approved")}
                    className="inline-flex items-center gap-1 rounded-sm border border-emerald-500/40 px-3 py-1 text-[10px] uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Check className="h-3 w-3" /> Approve
                  </button>
                  <button
                    onClick={() => setListingStatus(l.id, "rejected")}
                    className="inline-flex items-center gap-1 rounded-sm border border-red-500/40 px-3 py-1 text-[10px] uppercase tracking-widest text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-3 w-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-10 text-xs text-muted-foreground">
          <Link to="/" className="underline hover:text-gold">← Back to site</Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function TabButton({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
        active ? "border-b-2 border-gold text-gold" : "text-muted-foreground hover:text-ivory"
      }`}
    >
      {children}
    </button>
  );
}
