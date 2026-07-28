import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";

const STORAGE_KEY = "aiss-user";

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, _password: string) => Promise<void>;
  register: (data: { name: string; email: string; studentId: string; password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
}

const AuthContext = createContext<AuthState | null>(null);

function readStored(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(readStored());
    setLoading(false);
  }, []);

  const persist = (u: User | null) => {
    if (typeof window === "undefined") return;
    if (u) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else window.localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const u: User = {
      id: "u-demo",
      name: email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Student",
      email,
      studentId: "STU-2026-0001",
      program: "Bachelor of Science",
      department: "Computer Science",
      level: "Year 3",
      role: email.toLowerCase().startsWith("admin") ? "admin" : "student",
    };
    setUser(u);
    persist(u);
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; studentId: string; password: string }) => {
      await new Promise((r) => setTimeout(r, 500));
      const u: User = {
        id: "u-" + Math.random().toString(36).slice(2, 8),
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        program: "Bachelor of Science",
        department: "Computer Science",
        level: "Year 1",
        role: "student",
      };
      setUser(u);
      persist(u);
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  const updateProfile = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      persist(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
