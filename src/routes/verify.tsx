import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, MessageCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/verify")({
  head: () => ({
    meta: [
      { title: "Verify via WhatsApp · The Gilded Auction House" },
      {
        name: "description",
        content:
          "Complete a quick WhatsApp verification before bidding or consigning at The Gilded Auction House.",
      },
    ],
  }),
  component: VerifyPage,
});

const BUSINESS_NUMBER = "917799191019"; // +91 7799 919 1019

function VerifyPage() {
  const { user, profile, isVerified, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) void navigate({ to: "/login" });
    else if (isVerified) void navigate({ to: "/" });
  }, [user, isVerified, loading, navigate]);

  const message = useMemo(() => {
    const name = profile?.full_name ?? "—";
    const email = profile?.email ?? user?.email ?? "—";
    const age = profile?.age ?? "—";
    const phone = profile?.phone ?? "—";
    const id = user?.id ?? "—";
    return `Hello, I'd like to verify my Gilded Auction House account.

Name: ${name}
Email: ${email}
Phone: ${phone}
Age: ${age}
User ID: ${id}`;
  }, [profile, user]);

  const waLink = `https://wa.me/${BUSINESS_NUMBER}?text=${encodeURIComponent(message)}`;

  const handleVerify = () => {
    setOpened(true);
    window.open(waLink, "_blank", "noopener,noreferrer");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="mx-auto max-w-2xl px-6 py-24 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Account Verification</p>
        <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">
          {opened ? "Waiting for verification" : "Verify via WhatsApp"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {opened
            ? "We've received your details on WhatsApp. Our team usually approves within a few hours during business hours."
            : "Send us your details on WhatsApp. Once our team reviews them, your account is unlocked for bidding and consigning."}
        </p>

        {/* Status pill */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-sm border border-amber-warn/40 bg-amber-warn/10 px-3 py-1.5">
          <Clock className="h-3.5 w-3.5 text-amber-warn" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-amber-warn">
            Verification pending
          </span>
        </div>

        {/* Message preview */}
        <div className="mt-10 rounded-sm border border-gold/30 bg-card/60 p-6 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Message preview</p>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              To: +91 77991 91019
            </p>
          </div>
          <pre className="mt-4 whitespace-pre-wrap rounded-sm border border-border bg-onyx/60 p-4 font-sans text-sm leading-relaxed text-ivory">
{message}
          </pre>
          <p className="mt-3 text-xs text-muted-foreground">
            This is exactly what will be pre-filled in WhatsApp. You can edit it before sending.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleVerify}
            className="inline-flex items-center gap-2 rounded-sm bg-[#25D366] px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-white shadow-gold transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            {opened ? "Re-open WhatsApp" : "Verify Now on WhatsApp"}
          </a>
          {opened && (
            <button
              type="button"
              onClick={() => void refreshProfile()}
              className="inline-flex items-center gap-2 rounded-sm border border-gold/40 px-5 py-3 text-xs uppercase tracking-widest text-ivory hover:border-gold hover:text-gold"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              I've sent it — refresh status
            </button>
          )}
        </div>

        {/* What happens next */}
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <Step
            n="1"
            title="Send"
            text="Tap the green button. WhatsApp opens with your details pre-filled."
          />
          <Step
            n="2"
            title="Review"
            text="Our team reviews your message manually — typically within a few hours."
          />
          <Step
            n="3"
            title="Unlocked"
            text="You'll receive a WhatsApp reply confirming approval. Reload the site to bid."
          />
        </div>

        <div className="mt-12 flex items-center gap-3 rounded-sm border border-border bg-card/40 px-4 py-3">
          <CheckCircle2 className="h-4 w-4 text-gold" />
          <p className="text-xs text-muted-foreground">
            Until approved, bidding and listing are disabled. You can still browse all live lots.
          </p>
        </div>

        <Link
          to="/"
          className="mt-10 inline-block text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold"
        >
          ← Back to the floor
        </Link>
      </main>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="rounded-sm border border-border bg-card/40 p-4">
      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-gold text-xs text-gold">
        {n}
      </div>
      <h3 className="mt-3 font-serif text-lg text-ivory">{title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
