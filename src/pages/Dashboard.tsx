import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/DataTable";
import PenalCodesView from "@/pages/PenalCodesView";
import ReferenceCenter from "@/pages/ReferenceCenter";
import SettingsPanel from "@/pages/SettingsPanel";
import CommandPalette from "@/components/CommandPalette";
import { radioCodes, natoAlphabet, localPenalCodes, federalPenalCodes, speedLimits } from "@/data/codes";
import {
  Radio,
  Languages,
  ShieldAlert,
  Gauge,
  BookOpen,
  Settings,
  Clock,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type TabKey = "radio" | "nato" | "penal" | "speed" | "reference" | "settings";

function getQueryParam(key: string): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

function setQueryParams(next: Record<string, string | null>) {
  const params = new URLSearchParams(window.location.search);
  Object.entries(next).forEach(([k, v]) => {
    if (!v) params.delete(k);
    else params.set(k, v);
  });
  const q = params.toString();
  const url = q ? `${window.location.pathname}?${q}` : window.location.pathname;
  window.history.replaceState({}, "", url);
}

export default function Dashboard() {
  const [tab, setTab] = useState<TabKey>("radio");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLargeText, setIsLargeText] = useState(false);
  const [now, setNow] = useState(new Date());
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const t = getQueryParam("tab") as TabKey | null;
    if (t) setTab(t);
  }, []);

  useEffect(() => {
    setQueryParams({ tab });
  }, [tab]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Allow Command Palette to jump to a tab + optionally prefill search.
  const handleNavigate = (nextTab: TabKey, search?: string) => {
    setTab(nextTab);
    if (search) setQueryParams({ tab: nextTab, q: search });
    else setQueryParams({ tab: nextTab });
  };

  const headerClock = useMemo(
    () => now.toLocaleTimeString([], { hour12: false }),
    [now],
  );

  return (
    <div
      className={`h-screen w-full flex flex-col overflow-hidden font-sans transition-all duration-300 ${
        isDarkMode ? "dark bg-background text-foreground" : "bg-slate-50 text-slate-900"
      } ${isLargeText ? "text-base md:text-lg" : "text-sm"}`}
    >
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onNavigate={handleNavigate}
      />

      {/* Header */}
      <header className={`h-16 border-b border-border/50 flex items-center px-4 md:px-6 justify-between shrink-0 z-20 shadow-sm ${isDarkMode ? "bg-card" : "bg-white"}`}>
        <div className="flex items-center gap-3">
          <img
            src="/assets/metro-logo.png"
            alt="Metro Logo"
            className="h-10 w-10 object-contain"
          />
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-widest uppercase leading-none">
              METRO <span className="text-primary">REFERENCE</span> PORTAL
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
                {headerClock} • Quick Search: <span className="text-foreground/80">Ctrl/⌘ + K</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandOpen(true)}
            className="font-bold uppercase tracking-widest text-[10px]"
            title="Search (Ctrl/⌘ + K)"
          >
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
          <Button
            variant={isDarkMode ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsDarkMode((v) => !v)}
            className="font-bold uppercase tracking-widest text-[10px]"
            title="Toggle theme"
          >
            Theme
          </Button>
          <Button
            variant={isLargeText ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsLargeText((v) => !v)}
            className="font-bold uppercase tracking-widest text-[10px]"
            title="Toggle large text"
          >
            Text
          </Button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-hidden flex flex-col bg-[radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.03),transparent_40%)]">
        <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="h-full flex flex-col p-2 md:p-4 gap-2">
          <TabsList className="h-12 md:h-14 w-full justify-start bg-card/50 border border-border/50 p-1 gap-1 overflow-x-auto shrink-0 no-scrollbar">
            <TabsTrigger value="radio" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <Radio className="mr-2 h-4 w-4 hidden sm:block" /> Radio
            </TabsTrigger>
            <TabsTrigger value="nato" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <Languages className="mr-2 h-4 w-4 hidden sm:block" /> NATO
            </TabsTrigger>
            <TabsTrigger value="penal" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <ShieldAlert className="mr-2 h-4 w-4 hidden sm:block" /> Penal
            </TabsTrigger>
            <TabsTrigger value="speed" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <Gauge className="mr-2 h-4 w-4 hidden sm:block" /> Speed
            </TabsTrigger>
            <TabsTrigger value="reference" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <BookOpen className="mr-2 h-4 w-4 hidden sm:block" /> Reference
            </TabsTrigger>
            <TabsTrigger value="settings" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <Settings className="mr-2 h-4 w-4 hidden sm:block" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="radio" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border-none outline-none">
            <DataTable
              data={radioCodes}
              columns={[
                { header: "Code", accessorKey: "code", className: "w-[120px] font-mono text-primary font-bold" },
                { header: "Description", accessorKey: "description", className: "font-medium" },
              ]}
              searchKeys={["code", "description"]}
              title="Radio Codes"
            />
          </TabsContent>

          <TabsContent value="nato" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border-none outline-none">
            <DataTable
              data={natoAlphabet}
              columns={[
                { header: "L", accessorKey: "letter", className: "w-[80px] font-mono text-primary font-bold text-2xl" },
                { header: "Phonetic", accessorKey: "phonetic", className: "font-bold text-xl uppercase tracking-widest" },
              ]}
              searchKeys={["letter", "phonetic"]}
              title="NATO Alphabet"
            />
          </TabsContent>

          <TabsContent value="penal" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border-none outline-none">
            <PenalCodesView localPenalCodes={localPenalCodes} federalPenalCodes={federalPenalCodes} />
          </TabsContent>

          <TabsContent value="speed" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border-none outline-none">
            <DataTable
              data={speedLimits}
              columns={[
                { header: "Road Type", accessorKey: "roadType", className: "font-bold" },
                { header: "Speed", accessorKey: "limit", className: "font-mono text-xl text-primary font-bold w-[120px]" },
                { header: "Notes", accessorKey: "notes", className: "text-muted-foreground" },
              ]}
              searchKeys={["roadType", "limit", "notes"]}
              title="Speed Limits"
            />
          </TabsContent>

          <TabsContent value="reference" className="flex-1 overflow-auto data-[state=active]:block mt-0 border-none outline-none">
            <ReferenceCenter />
          </TabsContent>

          <TabsContent value="settings" className="flex-1 overflow-auto data-[state=active]:block mt-0 border-none outline-none">
            <SettingsPanel
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              isLargeText={isLargeText}
              setIsLargeText={setIsLargeText}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
