import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logoImg from "@/assets/logo.png";

const IS_DEMO = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === "";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = Math.min(4,
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0)
  );
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-green-500"];
  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4].map(i => <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-all", i <= score ? colors[score] : "bg-border")} />)}
      </div>
      <p className="text-xs text-muted-foreground">{labels[score]}</p>
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"guest" | "host">("guest");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleSignup = async () => {
    if (IS_DEMO) { toast.info("Google OAuth requires Supabase. Use the demo role switcher."); return; }
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { toast.error(error.message); setGoogleLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords don't match"); return; }
    if (!agreed) { setError("Please accept the Terms & Privacy Policy"); return; }
    if (IS_DEMO) {
      toast.success("Demo mode — account created! Use the role switcher.");
      navigate("/"); return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { data: { display_name: displayName, role } },
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    toast.success("Account created! Check your email to verify.");
    navigate("/app");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — brand */}
      <div className="hidden lg:flex lg:w-[40%] bg-secondary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&h=900&fit=crop)", backgroundSize: "cover" }} />
        <div className="relative z-10 text-center">
          <img src={logoImg} alt="BnbCircle" className="h-10 mx-auto mb-8 brightness-0 invert" />
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Join BnbCircle<br />today</h2>
          <p className="text-white/70 text-lg max-w-xs mx-auto leading-relaxed">
            List your property or find your perfect Dutch stay — free to join.
          </p>
          <ul className="mt-8 space-y-3 text-left">
            {["Free to join — no monthly fees", "Verified guests & hosts", "24/7 support", "Secure payments"].map(item => (
              <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden mb-8 text-center">
            <img src={logoImg} alt="BnbCircle" className="h-8 mx-auto" />
          </div>

          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Create your account</h1>
          <p className="text-muted-foreground text-sm mb-6">Free forever — no credit card required</p>

          {IS_DEMO && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-sm text-amber-800">
              🎭 <strong>Demo mode</strong> — use the role switcher in the bottom-right corner.
            </div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([["guest", "🏠", "I want to book stays"], ["host", "🏡", "I have a property"]] as const).map(([r, emoji, label]) => (
              <button key={r} type="button" onClick={() => setRole(r)}
                className={cn("flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium",
                  role === r ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50")}>
                <span className="text-2xl">{emoji}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignup} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border-2 border-border rounded-xl px-4 py-3 text-sm font-semibold text-foreground hover:border-primary hover:bg-primary/5 transition-all mb-4 disabled:opacity-60">
            {googleLoading ? <div className="w-5 h-5 border-2 border-foreground border-t-transparent rounded-full animate-spin" /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} required
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-11 py-3 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-background" />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                  placeholder="Repeat password"
                  className={cn("w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none focus:ring-2 transition-all bg-background",
                    confirmPassword && password !== confirmPassword ? "border-red-400 focus:ring-red-200" : "border-border focus:ring-primary/20 focus:border-primary")} />
              </div>
              {confirmPassword && password !== confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords don't match</p>}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer">
              <div onClick={() => setAgreed(v => !v)}
                className={cn("w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all",
                  agreed ? "bg-primary border-primary" : "border-border hover:border-primary")}>
                {agreed && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>{" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </span>
            </label>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-base hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Create account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
