"use client";

import { Profile } from "@/types/collections";
import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, use, useContext, useEffect, useState } from "react";
import AdminContext from "@/components/providers/AdminContext";
import useSWR from "swr";
import { useSupabase } from "./supabase-provider";
interface ContextI {
  user: User | undefined | null,
  error: any;
  isLoading: boolean;
  mutate: any;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
  createAccount: (email: string, password: string) => Promise<string | null>;
}
const Context = createContext<ContextI>({
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => {},
  signInWithEmail: async (email: string, password: string) => null,
  createAccount: async (email: string, password: string) => null,
});

export default function SupabaseAuthProvider({
  serverSession,
  children,
}: {
  serverSession?: Session | null;
  children: React.ReactNode;
}) {
  const { supabase } = useSupabase();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);

  // Get USER
  const getUser = async () => {
    const user = serverSession?.user ?? null;
    return user;
  };

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR(serverSession ? "profile-context" : null, getUser);

  // Sign Out
  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Sign-In with Email
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return error.message;
    }

    return null;
  };

  // Sign-Up with Email
  const createAccount = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return error.message;
    }

    return null;
  };

  // Refresh the Page to Sync Server and Client
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, serverSession?.access_token]);

  const exposed: ContextI = {
    user,
    error,
    isLoading,
    mutate,
    signOut,
    signInWithEmail,
    createAccount,
  };

  useEffect(() => {
    if (user) {
      const authDomain = user.email?.split("@")[1];
      if (authDomain == "deepgram.com") {
        setIsAdmin(true);
      }
    }
  }, [user]);

  return <Context.Provider value={exposed}>
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
</Context.Provider>;
}

export const useAuth = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used inside SupabaseAuthProvider");
  } else {
    return context;
  }
};