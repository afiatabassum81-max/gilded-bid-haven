import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

type Announcement = { id: string; title: string; body: string; published: boolean; created_at: string };
type Story = { id: string; title: string; story: string; winner_name: string | null; image_url: string | null; published: boolean };
type Impact = { id: string; title: string; description: string; amount_contributed: number | null; icon: string | null; published: boolean };

export function AdminCommunity() {
  const [loading, setLoading] = useState(true);
  const [mission, setMission] = useState({ title: "", body: "" });
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [impacts, setImpacts] = useState<Impact[]>([]);

  const [newAnn, setNewAnn] = useState({ title: "", body: "" });
  const [newStory, setNewStory] = useState({ title: "", story: "", winner_name: "", image_url: "" });
  const [newImpact, setNewImpact] = useState({ title: "", description: "", amount_contributed: "" });

  const fetchAll = async () => {
    setLoading(true);
    const [m, a, s, i] = await Promise.all([
      supabase.from("site_content").select("*").eq("slug", "mission").maybeSingle(),
      supabase.from("announcements").select("*").order("created_at", { ascending: false }),
      supabase.from("success_stories").select("*").order("created_at", { ascending: false }),
      supabase.from("social_impact").select("*").order("created_at", { ascending: false }),
    ]);
    if (m.data) setMission({ title: m.data.title ?? "", body: m.data.body ?? "" });
    setAnnouncements((a.data as Announcement[]) ?? []);
    setStories((s.data as Story[]) ?? []);
    setImpacts((i.data as Impact[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { void fetchAll(); }, []);

  const saveMission = async () => {
    const { error } = await supabase.from("site_content")
      .upsert({ slug: "mission", title: mission.title, body: mission.body, updated_at: new Date().toISOString() }, { onConflict: "slug" });
    if (error) return toast.error(error.message);
    toast.success("Mission saved");
  };

  const addAnnouncement = async () => {
    if (!newAnn.title || !newAnn.body) return toast.error("Title and body required");
    const { error } = await supabase.from("announcements").insert(newAnn);
    if (error) return toast.error(error.message);
    setNewAnn({ title: "", body: "" });
    toast.success("Announcement posted");
    void fetchAll();
  };

  const deleteRow = async (table: "announcements" | "success_stories" | "social_impact", id: string) => {
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    void fetchAll();
  };

  const addStory = async () => {
    if (!newStory.title || !newStory.story) return toast.error("Title and story required");
    const { error } = await supabase.from("success_stories").insert({
      title: newStory.title, story: newStory.story,
      winner_name: newStory.winner_name || null,
      image_url: newStory.image_url || null,
    });
    if (error) return toast.error(error.message);
    setNewStory({ title: "", story: "", winner_name: "", image_url: "" });
    toast.success("Story added");
    void fetchAll();
  };

  const addImpact = async () => {
    if (!newImpact.title || !newImpact.description) return toast.error("Title and description required");
    const { error } = await supabase.from("social_impact").insert({
      title: newImpact.title, description: newImpact.description,
      amount_contributed: newImpact.amount_contributed ? Number(newImpact.amount_contributed) : null,
    });
    if (error) return toast.error(error.message);
    setNewImpact({ title: "", description: "", amount_contributed: "" });
    toast.success("Impact added");
    void fetchAll();
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>;

  return (
    <div className="mt-6 space-y-10">
      {/* MISSION */}
      <Section title="Mission Statement">
        <input className={inputCls} value={mission.title} onChange={(e) => setMission({ ...mission, title: e.target.value })} placeholder="Title" />
        <textarea className={`${inputCls} min-h-32`} value={mission.body} onChange={(e) => setMission({ ...mission, body: e.target.value })} placeholder="Mission body" />
        <button onClick={saveMission} className={btnPrimary}><Save className="h-3 w-3" /> Save Mission</button>
      </Section>

      {/* ANNOUNCEMENTS */}
      <Section title={`Announcements (${announcements.length})`}>
        <input className={inputCls} value={newAnn.title} onChange={(e) => setNewAnn({ ...newAnn, title: e.target.value })} placeholder="Announcement title" />
        <textarea className={inputCls} value={newAnn.body} onChange={(e) => setNewAnn({ ...newAnn, body: e.target.value })} placeholder="Announcement body" />
        <button onClick={addAnnouncement} className={btnPrimary}><Plus className="h-3 w-3" /> Post Announcement</button>
        <div className="mt-4 space-y-2">
          {announcements.map((a) => (
            <Row key={a.id} onDelete={() => deleteRow("announcements", a.id)}>
              <div className="font-serif text-ivory">{a.title}</div>
              <div className="text-xs text-muted-foreground">{a.body}</div>
            </Row>
          ))}
        </div>
      </Section>

      {/* SUCCESS STORIES */}
      <Section title={`Success Stories (${stories.length})`}>
        <input className={inputCls} value={newStory.title} onChange={(e) => setNewStory({ ...newStory, title: e.target.value })} placeholder="Story title" />
        <input className={inputCls} value={newStory.winner_name} onChange={(e) => setNewStory({ ...newStory, winner_name: e.target.value })} placeholder="Winner name (optional)" />
        <input className={inputCls} value={newStory.image_url} onChange={(e) => setNewStory({ ...newStory, image_url: e.target.value })} placeholder="Image URL (optional)" />
        <textarea className={inputCls} value={newStory.story} onChange={(e) => setNewStory({ ...newStory, story: e.target.value })} placeholder="Story body" />
        <button onClick={addStory} className={btnPrimary}><Plus className="h-3 w-3" /> Add Story</button>
        <div className="mt-4 space-y-2">
          {stories.map((s) => (
            <Row key={s.id} onDelete={() => deleteRow("success_stories", s.id)}>
              <div className="font-serif text-ivory">{s.title}{s.winner_name && <span className="ml-2 text-xs text-gold">· {s.winner_name}</span>}</div>
              <div className="text-xs text-muted-foreground">{s.story}</div>
            </Row>
          ))}
        </div>
      </Section>

      {/* SOCIAL IMPACT */}
      <Section title={`Social Impact (${impacts.length})`}>
        <input className={inputCls} value={newImpact.title} onChange={(e) => setNewImpact({ ...newImpact, title: e.target.value })} placeholder="Cause title" />
        <input className={inputCls} value={newImpact.amount_contributed} onChange={(e) => setNewImpact({ ...newImpact, amount_contributed: e.target.value })} placeholder="Amount contributed in ₹ (optional)" type="number" />
        <textarea className={inputCls} value={newImpact.description} onChange={(e) => setNewImpact({ ...newImpact, description: e.target.value })} placeholder="Describe the cause and contribution" />
        <button onClick={addImpact} className={btnPrimary}><Plus className="h-3 w-3" /> Add Impact</button>
        <div className="mt-4 space-y-2">
          {impacts.map((i) => (
            <Row key={i.id} onDelete={() => deleteRow("social_impact", i.id)}>
              <div className="font-serif text-ivory">{i.title}{i.amount_contributed != null && <span className="ml-2 text-xs text-gold">· ₹{Number(i.amount_contributed).toLocaleString("en-IN")}</span>}</div>
              <div className="text-xs text-muted-foreground">{i.description}</div>
            </Row>
          ))}
        </div>
      </Section>
    </div>
  );
}

const inputCls = "w-full rounded-sm border border-gold/20 bg-onyx/40 px-3 py-2 text-sm text-ivory placeholder:text-muted-foreground focus:border-gold focus:outline-none";
const btnPrimary = "inline-flex items-center gap-2 rounded-sm bg-gold px-4 py-2 text-xs uppercase tracking-widest text-primary-foreground hover:bg-gold/90";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-gold/20 bg-card p-6">
      <h3 className="mb-4 font-serif text-2xl text-ivory">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-sm border border-gold/10 bg-onyx/30 p-3">
      <div className="min-w-0 flex-1">{children}</div>
      <button onClick={onDelete} className="rounded-sm border border-red-500/40 p-1.5 text-red-400 hover:bg-red-500/10">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
