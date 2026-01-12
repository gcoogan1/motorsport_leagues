import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "./AuthContext";
import type { AuthContextType } from "../../types/auth.types";
import { logoutUser } from "@/services/auth.service";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [session, setSession] = useState<AuthContextType["session"]>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Check and refresh authentication state
  const refreshAuth = useCallback(async () => {
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user ?? null;

      let verified = false;
      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_verified")
          .eq("id", currentUser.id)
          .single();

        verified = profile?.is_verified ?? false;
      }

      setSession(sessionData.session);
      setUser(currentUser);
      setIsVerified(verified);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset authentication state (used for logout and hard reset)
  const resetAuth = useCallback(async () => {
    await logoutUser();
    setUser(null);
    setSession(null);
    setIsVerified(false);
    setLoading(false);
  }, []);

  // Initialize and listen for auth state changes
  useEffect(() => {
    let mounted = true;
    // Initialize auth state
    const initAuth = async () => {
      await refreshAuth();
      if (mounted) setLoading(false);
    };
    initAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      refreshAuth();
    });

    // Cleanup on unmount
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshAuth]);

  // Provide auth context values
  return (
    <AuthContext.Provider
      value={{ user, session, isVerified, loading, refreshAuth, resetAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};
