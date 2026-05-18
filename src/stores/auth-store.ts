"use client";

import { create } from "zustand";
import type { Session } from "@/lib/auth";

type AuthState = {
  session: Session | null;
  isPending: boolean;
  setSession: (session: Session | null) => void;
  setPending: (pending: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isPending: true,
  setSession: (session) => set({ session, isPending: false }),
  setPending: (isPending) => set({ isPending }),
}));
