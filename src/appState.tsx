import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ScanRecord } from "./types";

interface AppStateValue {
  scans: ScanRecord[];
  addScan: (record: ScanRecord) => void;
  clearScans: () => void;
  dark: boolean;
  toggleTheme: () => void;
  notify: (message: string) => void;
  toast: string;
}

const AppState = createContext<AppStateValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [dark, setDark] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo<AppStateValue>(() => ({
    scans,
    addScan: (record) => setScans((current) => [record, ...current]),
    clearScans: () => setScans([]),
    dark,
    toggleTheme: () => setDark((value) => !value),
    notify: setToast,
    toast,
  }), [scans, dark, toast]);
  return <AppState.Provider value={value}>{children}</AppState.Provider>;
}

export function useAppState(): AppStateValue {
  const value = useContext(AppState);
  if (!value) throw new Error("useAppState must be used inside AppStateProvider.");
  return value;
}
