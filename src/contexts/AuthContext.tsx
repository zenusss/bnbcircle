import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/integrations/supabase/types";

// ─── Demo mode detection ──────────────────────────────────────────────────────
// Demo mode is active when Supabase URL is not configured (localhost dev without .env)
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
const IS_DEMO = !SUPABASE_URL || SUPABASE_URL.includes("placeholder") || SUPABASE_URL === "";

const DEMO_STORAGE_KEY = "bnb_demo_role";

export type DemoRole = "visitor" | "guest" | "host" | "admin";

// Fake user objects per role
function makeDemoUser(role: DemoRole): User | null {
  if (role === "visitor") return null;
  return {
    id: `demo-${role}-id`,
    email: `demo-${role}@bnb-circle.com`,
    user_metadata: { display_name: role === "admin" ? "Admin User" : role === "host" ? "Host User" : "Guest User" },
    app_metadata: {},
    aud: "authenticated",
    created_at: new Date().toISOString(),
  } as unknown as User;
}

function rolesToAppRoles(role: DemoRole): AppRole[] {
  if (role === "admin") return ["admin", "host", "guest"] as AppRole[];
  if (role === "host") return ["host", "guest"] as AppRole[];
  if (role === "guest") return ["guest"] as AppRole[];
  return [];
}

// ─── Context type ─────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  isLoading: boolean;
  isAdmin: boolean;
  isHost: boolean;
  isGuest: boolean;
  isDemo: boolean;
  demoRole: DemoRole;
  setDemoRole: (role: DemoRole) => void;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ── Demo state ──────────────────────────────────────────────────────────────
  const [demoRole, setDemoRoleState] = useState<DemoRole>(() => {
    if (!IS_DEMO) return "visitor";
    return (localStorage.getItem(DEMO_STORAGE_KEY) as DemoRole) ?? "admin";
  });

  const setDemoRole = useCallback((role: DemoRole) => {
    localStorage.setItem(DEMO_STORAGE_KEY, role);
    setDemoRoleState(role);
  }, []);

  // ── Real Supabase state ─────────────────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(!IS_DEMO);

  const fetchRoles = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (error) throw error;
      setRoles((data || []).map((r: any) => r.role as AppRole));
    } catch {
      setRoles(["guest"]);
    }
  }, []);

  const bootstrapUser = useCallback(async (userId: string) => {
    try {
      await supabase.rpc("bootstrap_current_user");
    } catch {
      // May fail if DB not set up yet — ignore
    }
    await fetchRoles(userId);
  }, [fetchRoles]);

  const refreshRoles = useCallback(async () => {
    if (IS_DEMO) return;
    if (user) await fetchRoles(user.id);
  }, [user, fetchRoles]);

  useEffect(() => {
    if (IS_DEMO) return; // Skip Supabase in demo mode

    let mounted = true;
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) await bootstrapUser(session.user.id);
      setIsLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            await bootstrapUser(session.user.id);
          } else {
            await fetchRoles(session.user.id);
          }
        } else {
          setRoles([]);
        }
        setIsLoading(false);
      }
    );

    return () => { mounted = false; subscription.unsubscribe(); };
  }, [bootstrapUser, fetchRoles]);

  const signOut = async () => {
    if (IS_DEMO) {
      setDemoRole("visitor");
      return;
    }
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
    setIsLoading(false);
  };

  // ── Resolved values (demo overrides real) ──────────────────────────────────
  const resolvedUser   = IS_DEMO ? makeDemoUser(demoRole) : user;
  const resolvedRoles  = IS_DEMO ? rolesToAppRoles(demoRole) : roles;
  const resolvedSession = IS_DEMO ? null : session;
  const resolvedLoading = IS_DEMO ? false : isLoading;

  const isAdmin = resolvedRoles.includes("admin" as AppRole);
  const isHost  = resolvedRoles.includes("host" as AppRole);
  const isGuest = resolvedRoles.includes("guest" as AppRole);

  return (
    <AuthContext.Provider
      value={{
        user: resolvedUser,
        session: resolvedSession,
        roles: resolvedRoles,
        isLoading: resolvedLoading,
        isAdmin,
        isHost,
        isGuest,
        isDemo: IS_DEMO,
        demoRole,
        setDemoRole,
        signOut,
        refreshRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
