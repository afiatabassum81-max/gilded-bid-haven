import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth-context";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In · The Gilded Auction House" },
      { name: "description", content: "Sign in or create an account to bid at The Gilded Auction House." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, isVerified, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [busy, setBusy] = useState(false);

  // Redirect when signed in
  useEffect(() => {
    if (loading) return;
    if (user) {
      void navigate({ to: isVerified ? "/" : "/verify" });
    }
  }, [user, isVerified, loading, navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const ageNum = age ? parseInt(age, 10) : null;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        // Persist age on the profile (trigger creates row with name+email)
        if (data.user && ageNum) {
          await supabase.from("profiles").update({ age: ageNum, full_name: fullName }).eq("id", data.user.id);
        }
        toast.success("Account created — proceeding to verification.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error(result.error.message ?? "Google sign-in failed");
        setBusy(false);
        return;
      }
      // either redirected (browser navigates) or tokens set (effect handles redirect)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-6 py-16">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">The Gilded Auction House</p>
        <h1 className="mt-3 font-serif text-4xl text-ivory">
          {mode === "signin" ? "Welcome back" : "Open your account"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to bid, watch lots, and consign."
            : "Create an account, then verify via WhatsApp to start bidding."}
        </p>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-sm border border-gold/40 bg-card px-4 py-3 text-sm text-ivory transition-colors hover:border-gold disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or with email
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          {mode === "signup" && (
            <>
              <Field
                label="Full name"
                value={fullName}
                onChange={setFullName}
                placeholder="Rahul Mehta"
                required
              />
              <Field
                label="Age"
                type="number"
                value={age}
                onChange={setAge}
                placeholder="28"
                required
              />
            </>
          )}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />

          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-sm bg-gradient-gold-strong px-4 py-3 text-sm uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-gold"
        >
          {mode === "signin" ? "New here? Open an account →" : "Have an account? Sign in →"}
        </button>

        <Link
          to="/"
          className="mt-8 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground hover:text-gold"
        >
          ← Back to the floor
        </Link>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-sm border border-border bg-input px-3 py-2.5 text-sm text-ivory outline-none transition-colors focus:border-gold"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5.04c1.62 0 3.06.56 4.21 1.65l3.15-3.15C17.45 1.74 14.97.75 12 .75 7.42.75 3.47 3.36 1.55 7.18l3.66 2.84C6.13 7.18 8.85 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.51h6.45c-.28 1.46-1.13 2.7-2.4 3.53l3.7 2.87c2.16-2 3.42-4.95 3.42-8.64z"
      />
      <path
        fill="#FBBC05"
        d="M5.21 14.27a7.2 7.2 0 0 1 0-4.55L1.55 6.88a12 12 0 0 0 0 10.24l3.66-2.85z"
      />
      <path
        fill="#34A853"
        d="M12 23.25c3.24 0 5.96-1.07 7.95-2.91l-3.7-2.87c-1.03.69-2.34 1.1-4.25 1.1-3.15 0-5.87-2.13-6.79-5l-3.66 2.84C3.47 20.39 7.42 23.25 12 23.25z"
      />
    </svg>
  );
}
