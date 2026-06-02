import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, Heart, Trophy, Sparkles } from "lucide-react";

type Mission = { title: string | null; body: string | null };
type Announcement = { id: string; title: string; body: string; created_at: string };
type Story = { id: string; title: string; story: string; winner_name: string | null; image_url: string | null };
type Impact = { id: string; title: string; description: string; amount_contributed: number | null };
type Stats = { auctions: number; participants: number; raised: number };

export function CommunitySections() {
  const [mission, setMission] = useState<Mission | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [impacts, setImpacts] = useState<Impact[]>([]);
  const [stats, setStats] = useState<Stats>({ auctions: 0, participants: 0, raised: 0 });

  useEffect(() => {
    void (async () => {
      const [m, a, s, i, auctions, entries, impactSum] = await Promise.all([
        supabase.from("site_content").select("title, body").eq("slug", "mission").maybeSingle(),
        supabase.from("announcements").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3),
        supabase.from("success_stories").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3),
        supabase.from("social_impact").select("*").eq("published", true).order("created_at", { ascending: false }).limit(4),
        supabase.from("auction_listings").select("id", { count: "exact", head: true }),
        supabase.from("auction_entries").select("user_id"),
        supabase.from("social_impact").select("amount_contributed").eq("published", true),
      ]);
      if (m.data) setMission(m.data as Mission);
      setAnnouncements((a.data as Announcement[]) ?? []);
      setStories((s.data as Story[]) ?? []);
      setImpacts((i.data as Impact[]) ?? []);
      const uniqueParticipants = new Set((entries.data ?? []).map((r: { user_id: string }) => r.user_id)).size;
      const raised = (impactSum.data ?? []).reduce((sum: number, r: { amount_contributed: number | null }) => sum + Number(r.amount_contributed ?? 0), 0);
      setStats({ auctions: auctions.count ?? 0, participants: uniqueParticipants, raised });
    })();
  }, []);

  return (
    <>
      {/* MISSION */}
      {mission && (
        <section className="border-t border-gold/20 py-20 sm:py-28">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{mission.title ?? "Our Amanah"}</p>
            <h2 className="mt-4 font-serif text-4xl text-ivory sm:text-5xl">A community, not a marketplace.</h2>
            <div className="mx-auto mt-6 h-px w-24 bg-gold" />
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{mission.body}</p>
          </div>
        </section>
      )}

      {/* LIVE STATS */}
      <section className="border-y border-gold/20 bg-onyx/40 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 sm:grid-cols-3">
          <Stat value={stats.auctions} label="Lots Offered" />
          <Stat value={stats.participants} label="Community Members" />
          <Stat value={`₹${stats.raised.toLocaleString("en-IN")}`} label="Given to Causes" />
        </div>
      </section>

      {/* ANNOUNCEMENTS */}
      {announcements.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-center gap-3">
              <Megaphone className="h-5 w-5 text-gold" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Announcements</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {announcements.map((a) => (
                <article key={a.id} className="rounded-sm border border-gold/20 bg-card p-6">
                  <h3 className="font-serif text-xl text-ivory">{a.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                  <p className="mt-4 text-[10px] uppercase tracking-widest text-gold/60">
                    {new Date(a.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SUCCESS STORIES */}
      {stories.length > 0 && (
        <section className="marble-overlay border-y border-gold/20 bg-card py-20">
          <div className="relative mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-center gap-3">
              <Trophy className="h-5 w-5 text-gold" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Success Stories</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {stories.map((s) => (
                <article key={s.id} className="overflow-hidden rounded-sm border border-gold/20 bg-onyx/60">
                  {s.image_url && <img src={s.image_url} alt={s.title} className="h-48 w-full object-cover" />}
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-ivory">{s.title}</h3>
                    {s.winner_name && <p className="mt-1 text-xs uppercase tracking-widest text-gold">Winner: {s.winner_name}</p>}
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.story}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SOCIAL IMPACT */}
      {impacts.length > 0 && (
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex items-center gap-3">
              <Heart className="h-5 w-5 text-gold" />
              <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Social Impact</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {impacts.map((i) => (
                <div key={i.id} className="relative rounded-sm border border-gold/20 bg-card p-6">
                  <Sparkles className="absolute right-4 top-4 h-4 w-4 text-gold/40" />
                  <h3 className="font-serif text-lg text-ivory">{i.title}</h3>
                  {i.amount_contributed != null && (
                    <p className="mt-1 text-xs uppercase tracking-widest text-gold">₹{Number(i.amount_contributed).toLocaleString("en-IN")} contributed</p>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{i.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function Stat({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="text-center">
      <div className="font-serif text-4xl text-gradient-gold sm:text-5xl">{value}</div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">{label}</div>
    </div>
  );
}
