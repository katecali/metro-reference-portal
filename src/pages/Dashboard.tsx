import React, { useEffect, useState } from "react";
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
  Search,
  FileText,
  ClipboardCheck,
  Gavel,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type TabKey =
  | "radio"
  | "nato"
  | "penal"
  | "speed"
  | "reference"
  | "sop"
  | "promotions"
  | "punishment"
  | "roster"
  | "settings";

type DashboardProps = {
  user: {
    name: string;
    callsign: string;
  };
  onLogout: () => void;
};

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

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [tab, setTab] = useState<TabKey>("reference");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLargeText, setIsLargeText] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const t = getQueryParam("tab") as TabKey | null;
    if (t) setTab(t);
  }, []);

  useEffect(() => {
    setQueryParams({ tab });
  }, [tab]);

  // Allow Command Palette to jump to a tab + optionally prefill search.
  const handleNavigate = (nextTab: TabKey, search?: string) => {
    setTab(nextTab);
    if (search) setQueryParams({ tab: nextTab, q: search });
    else setQueryParams({ tab: nextTab });
  };

  const DocumentPanel = ({
    title,
    description,
    url,
  }: {
    title: string;
    description: string;
    url: string;
  }) => (
    <div className="flex-1 overflow-hidden flex flex-col gap-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest text-primary">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="uppercase tracking-widest text-xs"
        >
          <a href={url} target="_blank" rel="noreferrer">
            Open in New Tab
          </a>
        </Button>
      </div>
      <div className="flex-1 rounded-lg overflow-hidden border border-border/60 bg-card/60 shadow-inner">
        <iframe
          title={title}
          src={url}
          className="h-full w-full"
          loading="lazy"
        />
      </div>
    </div>
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
            <h1 className="text-lg md:text-xl font-black tracking-[0.3em] uppercase leading-none">
              METROPD <span className="text-primary">REFERENCE</span> BUREAU
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-[10px] font-mono tracking-widest">
                {user.callsign}
              </Badge>
              <p className="text-[10px] font-mono text-muted-foreground tracking-wider uppercase">
                {user.name} • Quick Search: <span className="text-foreground/80">Ctrl/⌘ + K</span>
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
          <Button
            variant="destructive"
            size="sm"
            onClick={onLogout}
            className="font-bold uppercase tracking-widest text-[10px]"
            title="End session"
          >
            Lock
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
            <TabsTrigger value="sop" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <FileText className="mr-2 h-4 w-4 hidden sm:block" /> SOP
            </TabsTrigger>
            <TabsTrigger value="promotions" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <ClipboardCheck className="mr-2 h-4 w-4 hidden sm:block" /> Promotions
            </TabsTrigger>
            <TabsTrigger value="punishment" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <Gavel className="mr-2 h-4 w-4 hidden sm:block" /> Matrix
            </TabsTrigger>
            <TabsTrigger value="roster" className="h-full px-4 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-bold tracking-wide uppercase text-xs md:text-sm">
              <Users className="mr-2 h-4 w-4 hidden sm:block" /> Roster
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
                { header: "Category", accessorKey: "category", className: "w-[160px]" },
              ]}
              searchKeys={["code", "description", "category"]}
              title="MetroPD Radio Codes"
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

          <TabsContent value="sop" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border-none outline-none">
            <DocumentPanel
              title="MetroPD Standard Operating Procedures"
              description="SOP guidelines for field operations, communications, and administrative flow."
              url="https://docs.google.com/document/d/1_O-bqBAZhEWvP19I4iKbh0KRqVc1_Ihm5KInKwgkZ-c/preview"
            />
          </TabsContent>

          <TabsContent value="promotions" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border-none outline-none">
            <DocumentPanel
              title="Promotional Guidelines"
              description="Promotion criteria, expectations, and review workflow."
              url="https://docs.google.com/document/d/1g7U3-DsS3ybuOSSKJVfdi8LIEQCzf-G4WOiiaTnnbhQ/preview"
            />
          </TabsContent>

          <TabsContent value="punishment" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border-none outline-none">
            <DocumentPanel
              title="Punishment Matrix"
              description="Disciplinary matrix and recommended actions by infraction level."
              url="https://docs.google.com/spreadsheets/d/18Io5OdkKsZ9aVDh8I5nsAPjBUISGGM77461K06ziALU/preview"
            />
          </TabsContent>

          <TabsContent value="roster" className="flex-1 overflow-hidden data-[state=active]:flex flex-col mt-0 border-none outline-none">
            <DocumentPanel
              title="MetroPD Roster"
              description="Live roster view for active command staff and sworn personnel."
              url="https://docs.google.com/spreadsheets/d/1bJfy9jTbIuNNVVoqV7xaqtYsjIcV0CgCPRwUst6i0W8/preview"
            />
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
