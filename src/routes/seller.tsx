import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Plus, Package, Loader2 } from "lucide-react";

export const Route = createFileRoute("/seller")({
  component: SellerDashboard,
});

type Listing = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  starting_price: number;
  image_url: string | null;
  status: "pending" | "approved" | "rejected" | "live" | "ended";
  admin_notes: string | null;
  created_at: string;
};

function SellerDashboard() {
  const { user, loading, isVerified, isAdmin, roles } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const isSeller = roles.includes("seller") || isAdmin;
  const canSubmit = (isVerified || isAdmin) && isSeller;

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  const fetchListings = async () => {
    if (!user) return;
    setLoadingList(true);
    const { data, error } = await supabase
      .from("auction_listings")
      .select("*")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setListings((data as Listing[]) ?? []);
    setLoadingList(false);
  };

  useEffect(() => {
    if (user) void fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">Seller</p>
            <h1 className="mt-2 font-serif text-4xl text-ivory">My Listings</h1>
          </div>
          {canSubmit && (
            <button
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 rounded-sm bg-gradient-gold-strong px-5 py-2 text-xs uppercase tracking-widest text-primary-foreground shadow-gold hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Submit Listing"}
            </button>
          )}
        </div>

        {!isSeller && (
          <div className="mt-8 rounded-sm border border-gold/20 bg-card p-6 text-sm text-muted-foreground">
            You need a seller role to submit listings. Contact admin via WhatsApp to apply.
          </div>
        )}

        {!isVerified && !isAdmin && (
          <div className="mt-6 rounded-sm border border-amber-warn/40 bg-amber-warn/5 p-4 text-sm text-amber-warn">
            Complete WhatsApp verification to submit listings.{" "}
            <Link to="/verify" className="underline">Verify now →</Link>
          </div>
        )}

        {showForm && canSubmit && (
          <ListingForm
            sellerId={user.id}
            onDone={() => {
              setShowForm(false);
              void fetchListings();
            }}
          />
        )}

        <div className="mt-10">
          {loadingList ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-sm border border-gold/20 bg-card p-12 text-center">
              <Package className="mx-auto h-10 w-10 text-gold/60" />
              <h2 className="mt-4 font-serif text-2xl text-ivory">No listings yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Submit your first auction listing for admin review.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-gold/20 bg-card p-5"
                >
                  <div>
                    <div className="font-serif text-lg text-ivory">{l.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {l.category ?? "—"}
                    </div>
                    {l.admin_notes && (
                      <div className="mt-2 text-xs text-amber-warn">Admin: {l.admin_notes}</div>
                    )}
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function StatusBadge({ status }: { status: Listing["status"] }) {
  const map: Record<Listing["status"], string> = {
    pending: "bg-amber-warn/15 text-amber-warn",
    approved: "bg-emerald-500/15 text-emerald-400",
    rejected: "bg-red-500/15 text-red-400",
    live: "bg-gold/20 text-gold",
    ended: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`rounded-sm px-3 py-1 text-[10px] uppercase tracking-widest ${map[status]}`}>
      {status}
    </span>
  );
}

function ListingForm({ sellerId, onDone }: { sellerId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("auction_listings").insert({
      seller_id: sellerId,
      title,
      description: description || null,
      category: category || null,
      starting_price: Number(price) || 0,
      image_url: imageUrl || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Listing submitted for admin review");
    onDone();
  };

  return (
    <form
      onSubmit={submit}
      className="mt-8 grid gap-4 rounded-sm border border-gold/30 bg-card p-6"
    >
      <Input label="Title *" value={title} onChange={setTitle} required />
      <Input label="Category" value={category} onChange={setCategory} placeholder="Antiques, Cars, Watches…" />
      <Input label="Starting Price (INR) *" value={price} onChange={setPrice} type="number" required />
      <Input label="Image URL" value={imageUrl} onChange={setImageUrl} placeholder="https://…" />
      <div>
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 w-full rounded-sm border border-gold/20 bg-background px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-gold-strong px-5 py-2.5 text-xs uppercase tracking-widest text-primary-foreground shadow-gold disabled:opacity-50"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit for Review
      </button>
    </form>
  );
}

function Input({
  label, value, onChange, type = "text", required, placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-sm border border-gold/20 bg-background px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
      />
    </div>
  );
}
