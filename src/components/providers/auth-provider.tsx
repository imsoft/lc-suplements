"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const { setSession, setPending } = useAuthStore();

  useEffect(() => {
    if (isPending) {
      setPending(true);
    } else {
      setSession(session ?? null);
    }
  }, [session, isPending, setSession, setPending]);

  return <>{children}</>;
}
