import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Mail, CheckCircle2 } from "lucide-react";
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

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(2, "Name is required")
    .max(80, "Name is too long"),
  age: z.coerce
    .number({ invalid_type_error: "Age must be a number" })
    .int("Age must be a whole number")
    .min(18, "You must be 18 or older")
    .max(120, "Enter a valid age"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{7,18}$/, "Enter a valid phone number")
    .max(20),
});

function LoginPage() {
  const { user, isVerified, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmationSent, setConfirmationSent] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (user) {
      void navigate({ to: isVerified ? "/" : "/verify" });
    }
  }, [user, isVerified, loading, navigate]);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (mode === "signup") {
      const parsed = signUpSchema.safeParse({ email, password, fullName, age, phone });
      if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        parsed.error.issues.forEach((i) => {
          fieldErrors[i.path[0] as string] = i.message;
        });
        setErrors(fieldErrors);
        return;
      }
      setBusy(true);
      try {
        const { data, error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/verify`,
            data: {
              full_name: parsed.data.fullName,
              age: String(parsed.data.age),
              phone: parsed.data.phone,
            },
          },
        });
        if (error) throw error;

        // No session means email confirmation is required
        if (!data.session) {
          setConfirmationSent(parsed.data.email);
        } else {
          toast.success("Account created — proceeding to verification.");
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Sign-up failed");
      } finally {
        setBusy(false);
      }
      return;
    }

    // Sign in
    const parsed = signInSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        fieldErrors[i.path[0] as string] = i.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
      });
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          toast.error("Please confirm your email — check your inbox for the link.");
        } else if (error.message.toLowerCase().includes("invalid login")) {
          toast.error("Wrong email or password.");
        } else {
          toast.error(error.message);
        }
        return;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  };

  const resendConfirmation = async () => {
    if (!confirmationSent) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: confirmationSent,
        options: { emailRedirectTo: `${window.location.origin}/verify` },
      });
      if (error) throw error;
      toast.success("Confirmation email re-sent.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend email");
    } finally {
      setBusy(false);
    }
  };

  // Confirmation-sent view
  if (confirmationSent) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto flex max-w-md flex-col px-6 py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/40 bg-card">
            <Mail className="h-6 w-6 text-gold" />
          </div>
          <h1 className="mt-6 text-center font-serif text-3xl text-ivory">Check your inbox</h1>
          <p className="mt-3 text-center text-sm leading-relaxed text-muted-foreground">
            We've sent a confirmation link to{" "}
            <span className="text-ivory">{confirmationSent}</span>. Click it to activate your account,
            then sign in.
          </p>
          <div className="mt-8 space-y-2 rounded-sm border border-border bg-card/40 p-4 text-xs text-muted-foreground">
            <Bullet text="Confirm your email by clicking the link" />
            <Bullet text="Sign in with your password" />
            <Bullet text="Verify on WhatsApp to unlock bidding" />
          </div>
          <button
            type="button"
            onClick={resendConfirmation}
            disabled={busy}
            className="mt-6 text-center text-xs uppercase tracking-widest text-muted-foreground hover:text-gold disabled:opacity-50"
          >
            Didn't get it? Resend confirmation
          </button>
          <button
            type="button"
            onClick={() => {
              setConfirmationSent(null);
              setMode("signin");
              setPassword("");
            }}
            className="mt-3 text-center text-xs uppercase tracking-widest text-gold"
          >
            ← Back to sign in
          </button>
        </main>
      </div>
    );
  }

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
            : "Create an account, confirm your email, then verify via WhatsApp to start bidding."}
        </p>

        {/* Mode segmented control */}
        <div className="mt-8 grid grid-cols-2 rounded-sm border border-gold/30 bg-card p-1">
          <SegmentBtn active={mode === "signin"} onClick={() => setMode("signin")}>
            Sign in
          </SegmentBtn>
          <SegmentBtn active={mode === "signup"} onClick={() => setMode("signup")}>
            Create account
          </SegmentBtn>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-sm border border-gold/40 bg-card px-4 py-3 text-sm text-ivory transition-colors hover:border-gold disabled:opacity-50"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" />
          or with email
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3" noValidate>
          {mode === "signup" && (
            <>
              <Field
                label="Full name"
                value={fullName}
                onChange={setFullName}
                placeholder="Rahul Mehta"
                error={errors.fullName}
                autoComplete="name"
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Age"
                  type="number"
                  value={age}
                  onChange={setAge}
                  placeholder="28"
                  error={errors.age}
                  inputMode="numeric"
                />
                <Field
                  label="Phone"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  placeholder="+91 98765 43210"
                  error={errors.phone}
                  autoComplete="tel"
                />
              </div>
            </>
          )}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            error={errors.email}
            autoComplete="email"
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Min. 6 characters"
            error={errors.password}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />

          <button
            type="submit"
            disabled={busy}
            className="!mt-5 w-full rounded-sm bg-gradient-gold-strong px-4 py-3 text-sm uppercase tracking-widest text-primary-foreground shadow-gold transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {mode === "signup" && (
          <p className="mt-4 text-center text-[11px] leading-relaxed text-muted-foreground">
            By creating an account you agree to our terms. We'll email you a confirmation link.
          </p>
        )}

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

function SegmentBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm py-2 text-[11px] uppercase tracking-widest transition-colors ${
        active
          ? "bg-gradient-gold-strong text-primary-foreground shadow-gold"
          : "text-muted-foreground hover:text-ivory"
      }`}
    >
      {children}
    </button>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2">
      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
      <span>{text}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={`mt-2 w-full rounded-sm border bg-input px-3 py-2.5 text-sm text-ivory outline-none transition-colors focus:border-gold ${
          error ? "border-red-500/60" : "border-border"
        }`}
      />
      {error && <span className="mt-1 block text-[11px] text-red-400">{error}</span>}
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
