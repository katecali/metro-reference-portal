import { Switch, Route } from "wouter";
import React, { useCallback, useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/Dashboard";
import { Login } from "@/pages/Login";
import NotFound from "@/pages/not-found";

type Session = {
  name: string;
  callsign: string;
  loggedInAt: number;
};

const SESSION_KEY = "metropd-session";
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.loggedInAt) return null;
    if (Date.now() - parsed.loggedInAt > SESSION_DURATION_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function Router({ session, onLogout }: { session: Session; onLogout: () => void }) {
  return (
    <Switch>
      <Route path="/">
        {() => <Dashboard user={session} onLogout={onLogout} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [session, setSession] = useState<Session | null>(null);

  const refreshSession = useCallback(() => {
    const next = readSession();
    setSession(next);
  }, []);

  useEffect(() => {
    refreshSession();
    const onFocus = () => refreshSession();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refreshSession();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [refreshSession]);

  const handleLogin = (data: { name: string; callsign: string }) => {
    const next: Session = {
      name: data.name,
      callsign: data.callsign,
      loggedInAt: Date.now(),
    };
    writeSession(next);
    setSession(next);
  };

  const handleLogout = () => {
    clearSession();
    setSession(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {session ? (
          <Router session={session} onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
