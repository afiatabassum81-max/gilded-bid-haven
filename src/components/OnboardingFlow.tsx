import { useEffect, useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";

const STORAGE_KEY = "gem.onboarding.v1";

type Scene = { eyebrow: string; title: string; body: string };

const SCENES: Scene[] = [
  {
    eyebrow: "Welcome",
    title: "Welcome to GEM",
    body: "A community built on opportunity, trust, and giving. We're glad you're here.",
  },
  {
    eyebrow: "Step 01",
    title: "Register for a lot",
    body: "Each lot has a small, non-refundable registration fee that secures your seat.",
  },
  {
    eyebrow: "Step 02",
    title: "Place one sealed bid",
    body: "You get a single, private bid per registration. Once placed, it's locked in.",
  },
  {
    eyebrow: "Step 03",
    title: "Lowest unique bid wins",
    body: "When bidding closes, the lowest bid no one else placed takes the lot home.",
  },
  {
    eyebrow: "Our Promise",
    title: "More than a platform — a community",
    body: "Every registration fee supports community initiatives. You participate, others benefit.",
  },
];

const TERMS = [
  "Each lot requires its own registration fee",
  "One sealed bid per registration",
  "Bids cannot be changed once submitted",
  "Lowest unique bid wins",
  "Registration fees are non-refundable",
];

export function OnboardingFlow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      const t = window.setTimeout(() => setOpen(true), 600);
      return () => window.clearTimeout(t);
    }
  }, []);

  const close = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "done");
    }
    setOpen(false);
  };

  if (!open) return null;

  const last = step === SCENES.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/85 px-4 backdrop-blur-md fade-up">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-accent/30 bg-card shadow-elegant">
        <button
          type="button"
          onClick={close}
          aria-label="Skip introduction"
          className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        {!showTerms ? (
          <>
            <div className="relative flex h-64 items-end justify-center overflow-hidden bg-gradient-emerald">
              <GuideIllustration scene={step} />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
            </div>

            <div className="px-8 pb-8 pt-6">
              <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
                {SCENES[step].eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-3xl text-foreground">
                {SCENES[step].title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {SCENES[step].body}
              </p>

              <div className="mt-6 flex items-center gap-1.5">
                {SCENES.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i === step ? "bg-accent" : i < step ? "bg-accent/40" : "bg-background"
                    }`}
                  />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={close}
                  className="text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={() => (last ? setShowTerms(true) : setStep((s) => s + 1))}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-emerald-soft"
                >
                  {last ? "Continue" : "Next"}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-8 py-10">
            <p className="text-[10px] uppercase tracking-[0.35em] text-accent">
              Before Entering GEM
            </p>
            <h2 className="mt-3 font-serif text-3xl text-foreground">
              A few things to know
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Please review and acknowledge how participation works.
            </p>

            <ul className="mt-6 space-y-3">
              {TERMS.map((t) => (
                <li key={t} className="flex items-start gap-3 rounded-xl border border-border bg-background/50 px-4 py-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-sm text-foreground">{t}</span>
                </li>
              ))}
            </ul>

            <label className="mt-6 flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 h-4 w-4 cursor-pointer accent-[color:var(--primary)]"
              />
              <span className="text-sm leading-relaxed text-muted-foreground">
                I have read and understood the points above.
              </span>
            </label>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a
                href="#how"
                onClick={close}
                className="text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Read Full Terms
              </a>
              <button
                type="button"
                disabled={!agreed}
                onClick={close}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-emerald-soft disabled:cursor-not-allowed disabled:opacity-40"
              >
                I Understand & Continue
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Friendly stylised guide — slim figure in thobe + topi. Pure SVG, no religious symbols. */
function GuideIllustration({ scene }: { scene: number }) {
  return (
    <svg
      viewBox="0 0 240 220"
      className="h-56 w-auto fade-up"
      key={scene}
      aria-hidden="true"
    >
      {/* soft halo */}
      <ellipse cx="120" cy="200" rx="80" ry="8" fill="rgba(0,0,0,0.25)" />
      {/* topi (cap) */}
      <ellipse cx="120" cy="55" rx="26" ry="8" fill="#F5F3ED" />
      <path d="M94 55 Q94 38 120 38 Q146 38 146 55 Z" fill="#F5F3ED" />
      <path d="M94 55 Q94 38 120 38 Q146 38 146 55 Z" fill="none" stroke="#8F6B3D" strokeWidth="1" opacity="0.4" />
      {/* face */}
      <ellipse cx="120" cy="78" rx="20" ry="22" fill="#E8D2B8" />
      {/* beard hint */}
      <path d="M104 86 Q120 102 136 86 Q132 96 120 100 Q108 96 104 86 Z" fill="#5a4530" opacity="0.55" />
      {/* eyes */}
      <circle cx="113" cy="76" r="1.4" fill="#1a1a1a" />
      <circle cx="127" cy="76" r="1.4" fill="#1a1a1a" />
      {/* smile */}
      <path d="M114 88 Q120 91 126 88" stroke="#5a4530" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {/* thobe body */}
      <path
        d="M70 210 L78 120 Q92 100 120 100 Q148 100 162 120 L170 210 Z"
        fill="#F5F3ED"
      />
      <path
        d="M70 210 L78 120 Q92 100 120 100 Q148 100 162 120 L170 210 Z"
        fill="none" stroke="#8F6B3D" strokeWidth="1" opacity="0.35"
      />
      {/* collar */}
      <path d="M110 102 L120 116 L130 102" fill="none" stroke="#8F6B3D" strokeWidth="1.2" opacity="0.6" />
      {/* sleeves */}
      <path d="M78 120 L60 175 L72 178 L88 130 Z" fill="#F5F3ED" />
      <path d="M162 120 L180 175 L168 178 L152 130 Z" fill="#F5F3ED" />
      {/* hand gesture varies per scene */}
      {scene === 0 && (
        <g>
          {/* waving hand */}
          <circle cx="60" cy="170" r="6" fill="#E8D2B8" />
        </g>
      )}
      {scene === 1 && (
        <g>
          {/* holding a card */}
          <circle cx="180" cy="172" r="6" fill="#E8D2B8" />
          <rect x="168" y="158" width="28" height="18" rx="3" fill="#1D5B4F" stroke="#8F6B3D" />
        </g>
      )}
      {scene === 2 && (
        <g>
          {/* sealed envelope */}
          <circle cx="60" cy="170" r="6" fill="#E8D2B8" />
          <rect x="48" y="156" width="28" height="20" rx="2" fill="#0F2F27" stroke="#8F6B3D" />
          <path d="M48 156 L62 168 L76 156" fill="none" stroke="#8F6B3D" strokeWidth="1" />
        </g>
      )}
      {scene === 3 && (
        <g>
          {/* trophy */}
          <circle cx="180" cy="172" r="6" fill="#E8D2B8" />
          <path d="M170 152 H192 V160 Q192 172 181 172 Q170 172 170 160 Z" fill="#C9A878" stroke="#8F6B3D" />
          <rect x="176" y="172" width="10" height="6" fill="#8F6B3D" />
        </g>
      )}
      {scene === 4 && (
        <g>
          {/* both hands giving */}
          <circle cx="60" cy="170" r="6" fill="#E8D2B8" />
          <circle cx="180" cy="170" r="6" fill="#E8D2B8" />
          <path d="M100 150 Q120 138 140 150" fill="none" stroke="#8F6B3D" strokeWidth="1.5" />
          <circle cx="120" cy="142" r="4" fill="#C9A878" />
        </g>
      )}
    </svg>
  );
}
