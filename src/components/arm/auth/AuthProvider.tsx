"use client";

import { armPath, armApi } from "@/lib/arm/paths";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/arm/firebase/client";
import type { AccountMembership } from "@/lib/arm/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  accountsLoading: boolean;
  accounts: AccountMembership[];
  currentAccount: AccountMembership | null;
  setCurrentAccountId: (id: string) => void;
  refreshAccounts: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const CURRENT_ACCOUNT_KEY = "rip_current_account_id";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountMembership[]>([]);
  const [currentAccountId, setCurrentAccountIdState] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CURRENT_ACCOUNT_KEY);
  });

  const setCurrentAccountId = useCallback((id: string) => {
    setCurrentAccountIdState(id);
    localStorage.setItem(CURRENT_ACCOUNT_KEY, id);
  }, []);

  const refreshAccounts = useCallback(async () => {
    const auth = getFirebaseAuth();
    const u = auth.currentUser;
    if (!u) {
      setAccounts([]);
      setAccountsLoading(false);
      return;
    }

    setAccountsLoading(true);
    try {
      const token = await u.getIdToken();
      const res = await fetch(armApi("/accounts"), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list: AccountMembership[] = data.accounts || [];
        setAccounts(list);
        setCurrentAccountIdState((prev) => {
          if (prev && list.some((a) => a.id === prev)) return prev;
          const stored = localStorage.getItem(CURRENT_ACCOUNT_KEY);
          if (stored && list.some((a) => a.id === stored)) return stored;
          return list[0]?.id ?? null;
        });
      }
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        await refreshAccounts();
      } else {
        setAccounts([]);
        setAccountsLoading(false);
        setCurrentAccountIdState(null);
        localStorage.removeItem(CURRENT_ACCOUNT_KEY);
      }
    });
  }, [refreshAccounts]);

  useEffect(() => {
    if (currentAccountId) {
      localStorage.setItem(CURRENT_ACCOUNT_KEY, currentAccountId);
    }
  }, [currentAccountId]);

  const getIdToken = useCallback(async () => {
    const u = getFirebaseAuth().currentUser;
    return u ? u.getIdToken() : null;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  };

  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getFirebaseAuth(), provider);
  };

  const logout = async () => {
    await signOut(getFirebaseAuth());
    setAccounts([]);
    setCurrentAccountIdState(null);
    localStorage.removeItem(CURRENT_ACCOUNT_KEY);
  };

  const currentAccount = useMemo(
    () => accounts.find((a) => a.id === currentAccountId) || accounts[0] || null,
    [accounts, currentAccountId]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accountsLoading,
        accounts,
        currentAccount,
        setCurrentAccountId,
        refreshAccounts,
        login,
        signup,
        loginWithGoogle,
        logout,
        getIdToken,
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
