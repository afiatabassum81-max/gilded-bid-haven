import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { effectiveState, formatINR, type DbAuction } from "@/lib/db-auctions";
import { Loader2, Play, Pause, Square, Trophy, BarChart3, Plus, X } from "lucide-react";

const sb = supabase as any;

export function AdminAuctions() {
  const [auctions, setAuctions] = useState<DbAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [analyticsFor, setAnalyticsFor] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await sb.from("auction_listings").select("*").order("created_at", { ascending: false });
    setAuctions((data ?? []) as DbAuction[]);
    setLoading(false);
  };
  useEffect(() => { void load(); }, []);

  const setState = async (id: string, status: string) => {
    const { error } = await sb.from("auction_listings").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Auction ${status}`);
    void load();
  };

  const extend = async (a: DbAuction, minutes: number) => {
    const base = a.end_at ? new Date(a.end_at).getTime() : Date.now();
    const newEnd = new Date(base + minutes * 60_000).toISOString();
    const { error } = await sb.from("auction_listings").update({ end_at: newEnd }).eq("id", a.id);
    if (error) return toast.error(error.message);
    toast.success(`Extended by ${minutes} min`);
    void load();
  };

  const calcWinner = async (id: string) => {
    const { error } = await sb.rpc("calculate_auction_winner", { _auction_id: id });
    if (error) return toast.error(error.message);
    toast.success("Winner calculated and published");
    void load();
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div className="mt-6">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-sm bg-gradient-gold-strong px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground">
          <Plus className="h-3 w-3" /> New Auction
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {auctions.length === 0 && <p className="text-sm text-muted-foreground">No auctions yet.</p>}
        {auctions.map((a) => {
          const state = effectiveState(a);
          return (
            <div key={a.id} className="rounded-sm border border-gold/20 bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-serif text-lg text-ivory">{a.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.category ?? "—"} · Entry {formatINR(Number(a.entry_fee))} · State: <span className="text-ivory">{state}</span>
                    {a.end_at && <> · Ends {new Date(a.end_at).toLocaleString()}</>}
                  </div>
                  {a.status === "winner_announced" && a.winning_amount != null && (
                    <div className="mt-1 text-xs text-gold">
                      Winning amount: {formatINR(Number(a.winning_amount))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setState(a.id, "active")} className="rounded-sm border border-emerald-500/40 px-2 py-1 text-[10px] uppercase tracking-widest text-emerald-400 hover:bg-emerald-500/10">
                    <Play className="inline h-3 w-3" /> Start
                  </button>
                  <button onClick={() => setState(a.id, "paused")} className="rounded-sm border border-amber-warn/40 px-2 py-1 text-[10px] uppercase tracking-widest text-amber-warn hover:bg-amber-warn/10">
                    <Pause className="inline h-3 w-3" /> Pause
                  </button>
                  <button onClick={() => extend(a, 30)} className="rounded-sm border border-border px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-ivory">+30m</button>
                  <button onClick={() => setState(a.id, "closed")} className="rounded-sm border border-border px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-ivory">
                    <Square className="inline h-3 w-3" /> Close
                  </button>
                  <button onClick={() => calcWinner(a.id)} className="rounded-sm border border-gold/40 px-2 py-1 text-[10px] uppercase tracking-widest text-gold hover:bg-gold/10">
                    <Trophy className="inline h-3 w-3" /> Publish Winner
                  </button>
                  <button onClick={() => setAnalyticsFor(analyticsFor === a.id ? null : a.id)} className="rounded-sm border border-border px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-ivory">
                    <BarChart3 className="inline h-3 w-3" /> Bids
                  </button>
                </div>
              </div>
              {analyticsFor === a.id && <BidAnalytics auctionId={a.id} />}
            </div>
          );
        })}
      </div>
      {showForm && <NewAuctionForm onClose={() => { setShowForm(false); void load(); }} />}
    </div>
  );
}

function BidAnalytics({ auctionId }: { auctionId: string }) {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    void sb.from("auction_bids").select("*").eq("auction_id", auctionId).order("created_at").then(({ data }: any) => setRows(data ?? []));
  }, [auctionId]);

  const freq = rows.reduce<Record<string, number>>((acc, r) => {
    const k = String(r.amount);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});
  const sorted = Object.entries(freq).sort((a, b) => a[1] - b[1] || Number(a[0]) - Number(b[0]));

  return (
    <div className="mt-4 rounded-sm border border-border bg-onyx/40 p-4">
      <div className="text-[11px] uppercase tracking-widest text-gold">Bid Analytics ({rows.length} bids)</div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Frequency (lowest first wins)</div>
          <div className="space-y-1 text-xs">
            {sorted.map(([amt, n], i) => (
              <div key={amt} className={`flex justify-between rounded border px-2 py-1 ${i === 0 ? "border-gold/40 bg-gold/5 text-gold" : "border-border text-ivory"}`}>
                <span>{formatINR(Number(amt))}</span>
                <span>{n} participant{n > 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs text-muted-foreground">Timestamps</div>
          <div className="max-h-48 space-y-1 overflow-y-auto text-[11px] text-muted-foreground">
            {rows.map((r) => (
              <div key={r.id} className="flex justify-between gap-2 border-b border-border/50 py-1">
                <span className="truncate font-mono">{r.user_id.slice(0, 8)}…</span>
                <span>{formatINR(Number(r.amount))}</span>
                <span className="font-mono">{new Date(r.created_at).toISOString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewAuctionForm({ onClose }: { onClose: () => void }) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", category: "general", item_condition: "",
    image_url: "", entry_fee: 100,
    start_at: "", end_at: "", rules: "", terms: "", featured: false,
  });

  const submit = async () => {
    if (!form.title || !form.end_at) return toast.error("Title and end date required");
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    const { error } = await sb.from("auction_listings").insert({
      ...form,
      seller_id: u.user?.id,
      status: "upcoming",
      start_at: form.start_at || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Auction created");
    onClose();
  };

  const upd = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm border border-gold/40 bg-card p-6">
        <div className="flex justify-between">
          <h3 className="font-serif text-2xl text-ivory">New Auction</h3>
          <button onClick={onClose} className="text-muted-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-4 grid gap-3 text-sm">
          <Field label="Title"><input className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.title} onChange={(e) => upd("title", e.target.value)} /></Field>
          <Field label="Description"><textarea rows={3} className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.description} onChange={(e) => upd("description", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category"><input className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.category} onChange={(e) => upd("category", e.target.value)} /></Field>
            <Field label="Condition"><input className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.item_condition} onChange={(e) => upd("item_condition", e.target.value)} /></Field>
          </div>
          <Field label="Primary image URL"><input className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.image_url} onChange={(e) => upd("image_url", e.target.value)} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Entry fee (₹, min 100)"><input type="number" min={100} className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.entry_fee} onChange={(e) => upd("entry_fee", Number(e.target.value))} /></Field>
            <Field label="Starting price (display)"><input type="number" className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.starting_price} onChange={(e) => upd("starting_price", Number(e.target.value))} /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date/time"><input type="datetime-local" className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.start_at} onChange={(e) => upd("start_at", e.target.value ? new Date(e.target.value).toISOString() : "")} /></Field>
            <Field label="End date/time (required)"><input type="datetime-local" className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" onChange={(e) => upd("end_at", e.target.value ? new Date(e.target.value).toISOString() : "")} /></Field>
          </div>
          <Field label="Rules"><textarea rows={2} className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.rules} onChange={(e) => upd("rules", e.target.value)} /></Field>
          <Field label="Terms"><textarea rows={2} className="w-full rounded-sm border border-border bg-onyx px-3 py-2 text-ivory" value={form.terms} onChange={(e) => upd("terms", e.target.value)} /></Field>
          <label className="flex items-center gap-2 text-ivory">
            <input type="checkbox" checked={form.featured} onChange={(e) => upd("featured", e.target.checked)} /> Featured
          </label>
        </div>
        <div className="mt-6 flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-sm border border-border py-2 text-xs uppercase tracking-widest text-muted-foreground">Cancel</button>
          <button disabled={busy} onClick={submit} className="flex-1 rounded-sm bg-gradient-gold-strong py-2 text-xs uppercase tracking-widest text-primary-foreground disabled:opacity-60">
            {busy ? "Creating…" : "Create Auction"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
