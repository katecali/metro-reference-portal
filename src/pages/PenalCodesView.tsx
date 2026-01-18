import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import type { PenalCodeEntry } from "@/data/codes";
import {
  Copy,
  Search,
  Star,
  StarOff,
  Plus,
  Trash2,
  Calculator,
  Filter,
} from "lucide-react";

type Props = {
  localPenalCodes: PenalCodeEntry[];
  federalPenalCodes: PenalCodeEntry[];
};

type ChargeLine = {
  key: string; // stable id
  code: string;
  title: string;
  fine?: string;
  time?: string;
  class?: string;
};

const FAVORITES_KEY = "metro_favorite_penal_codes_v1";

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function parseMoneyToNumber(fine: string): { min?: number; max?: number; note?: string } {
  // Handles: "$5,000", "$3,000 - $10,000", "$100 per bud over"
  const raw = fine.trim();
  const perMatch = raw.match(/\$\s*([\d,]+)\s*per\s+(.+)/i);
  if (perMatch) {
    const n = Number(perMatch[1].replace(/,/g, ""));
    return { min: Number.isFinite(n) ? n : undefined, note: `per ${perMatch[2].trim()}` };
  }
  const nums = raw
    .replace(/[^0-9\-\.\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((x) => Number(x.replace(/,/g, "")))
    .filter((n) => Number.isFinite(n));
  if (!nums.length) return {};
  if (raw.includes("-")) {
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    return { min, max };
  }
  return { min: nums[0] };
}

function parseTimeToSeconds(time: string): number | undefined {
  // Handles: "120s", "15m", "2h" (just in case)
  const m = time.trim().match(/^([0-9]+(?:\.[0-9]+)?)\s*([smh])$/i);
  if (!m) return undefined;
  const val = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (!Number.isFinite(val)) return undefined;
  if (unit === "s") return Math.round(val);
  if (unit === "m") return Math.round(val * 60);
  return Math.round(val * 3600);
}

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m <= 0) return `${s}s`;
  if (s === 0) return `${m}m`;
  return `${m}m ${s}s`;
}

export default function PenalCodesView({ localPenalCodes, federalPenalCodes }: Props) {
  const [scope, setScope] = useState<"local" | "federal">("local");
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, true>>({});
  const [selected, setSelected] = useState<Record<string, true>>({});
  const [chargeList, setChargeList] = useState<ChargeLine[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // Support deep links: /?tab=penal&q=<search>
  useEffect(() => {
    const apply = () => {
      const p = new URLSearchParams(window.location.search);
      const q = p.get("q");
      if (q !== null) setQuery(q);
    };
    apply();
    window.addEventListener("popstate", apply);
    return () => window.removeEventListener("popstate", apply);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const dataset = scope === "local" ? localPenalCodes : federalPenalCodes;

  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    dataset.forEach((c) => c.class && set.add(c.class));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [dataset]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return dataset
      .filter((c) => {
        if (classFilter !== "all" && c.class !== classFilter) return false;
        if (onlyFavorites && !favorites[c.code]) return false;
        if (!q) return true;
        const hay = [c.code, c.title, c.description, c.class].filter(Boolean).join(" | ").toLowerCase();
        return hay.includes(q);
      })
      .slice(0, 500); // guard rails for huge lists later
  }, [dataset, query, classFilter, onlyFavorites, favorites]);

  const totals = useMemo(() => {
    let minFine = 0;
    let maxFine = 0;
    let hasRange = false;
    let seconds = 0;
    const notes: string[] = [];
    for (const line of chargeList) {
      if (line.fine) {
        const parsed = parseMoneyToNumber(line.fine);
        if (parsed.note) notes.push(`${line.code}: ${parsed.note}`);
        if (parsed.min != null) minFine += parsed.min;
        if (parsed.max != null) {
          maxFine += parsed.max;
          hasRange = true;
        } else if (parsed.min != null) {
          maxFine += parsed.min;
        }
      }
      if (line.time) {
        const sec = parseTimeToSeconds(line.time);
        if (sec != null) seconds += sec;
      }
    }
    return { minFine, maxFine, hasRange, seconds, notes };
  }, [chargeList]);

  const toggleFavorite = (code: string) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[code]) delete next[code];
      else next[code] = true;
      return next;
    });
  };

  const toggleSelected = (code: string) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[code]) delete next[code];
      else next[code] = true;
      return next;
    });
  };

  const addSelectedToChargeList = () => {
    const codes = Object.keys(selected);
    if (!codes.length) {
      toast({ title: "No charges selected", description: "Pick at least 1 code, then add it." });
      return;
    }
    const byCode = new Map(dataset.map((c) => [c.code, c] as const));
    const now = Date.now();
    const toAdd: ChargeLine[] = [];
    for (const code of codes) {
      const c = byCode.get(code);
      if (!c) continue;
      toAdd.push({
        key: `${code}-${now}-${Math.random().toString(16).slice(2)}`,
        code: c.code,
        title: c.title,
        fine: c.fine,
        time: c.time,
        class: c.class,
      });
    }
    setChargeList((prev) => [...prev, ...toAdd]);
    setSelected({});
    toast({ title: "Added", description: `Added ${toAdd.length} charge(s) to the charge sheet.` });
  };

  const copyChargeSheet = async () => {
    const lines = chargeList.map((c) => `${c.code} — ${c.title} | Fine: ${c.fine ?? "—"} | Time: ${c.time ?? "—"}`);
    const header = "CHARGE SHEET";
    const totalsLine = `TOTALS: Fine ${totals.hasRange ? `$${totals.minFine.toLocaleString()} - $${totals.maxFine.toLocaleString()}` : `$${totals.minFine.toLocaleString()}`} | Time ${formatSeconds(totals.seconds)}`;
    const notes = totals.notes.length ? `NOTES: ${totals.notes.join("; ")}` : "";
    const payload = [header, ...lines, "", totalsLine, notes].filter(Boolean).join("\n");
    try {
      await navigator.clipboard.writeText(payload);
      toast({ title: "Copied", description: "Charge sheet copied to clipboard." });
    } catch {
      toast({ title: "Couldn’t copy", description: "Your browser blocked clipboard access." });
    }
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm flex flex-col gap-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono tracking-widest">PENAL CODES</Badge>
            <Badge variant="secondary" className="font-mono">{filtered.length} SHOWN</Badge>
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search code, title, class…"
              className="pl-9 font-mono uppercase tracking-wider"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant={onlyFavorites ? "default" : "outline"}
              onClick={() => setOnlyFavorites((v) => !v)}
              className="font-bold uppercase tracking-widest text-[10px]"
              title="Toggle favorites"
            >
              {onlyFavorites ? <Star className="h-4 w-4 mr-2" /> : <StarOff className="h-4 w-4 mr-2" />}
              Favorites
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={addSelectedToChargeList}
              className="font-bold uppercase tracking-widest text-[10px]"
              title="Add selected codes to the charge sheet"
            >
              <Plus className="h-4 w-4 mr-2" /> Add selected
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Class</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={classFilter === "all" ? "default" : "outline"}
              onClick={() => setClassFilter("all")}
              className="text-[10px] font-bold uppercase tracking-widest"
            >
              All
            </Button>
            {availableClasses.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={classFilter === c ? "default" : "outline"}
                onClick={() => setClassFilter(c)}
                className="text-[10px] font-bold uppercase tracking-widest"
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={scope} onValueChange={(v) => setScope(v as any)} className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="local" className="font-bold uppercase tracking-widest text-xs">Local / RP</TabsTrigger>
            <TabsTrigger value="federal" className="font-bold uppercase tracking-widest text-xs">Federal</TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="mt-3">
            {/* list is shared below */}
          </TabsContent>
          <TabsContent value="federal" className="mt-3">
            {/* list is shared below */}
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-3 flex-1 min-h-0">
        {/* Results */}
        <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden flex flex-col min-h-0">
          <div className="grid grid-cols-[44px_1.2fr_0.8fr_0.6fr_0.6fr_110px] gap-2 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-primary bg-muted/40 border-b border-border/50">
            <div />
            <div>Code / Title</div>
            <div className="hidden md:block">Class</div>
            <div className="text-right">Fine</div>
            <div className="text-right">Time</div>
            <div className="text-right">Actions</div>
          </div>

          <ScrollArea className="flex-1">
            {filtered.length ? (
              <div className="divide-y divide-border/30">
                {filtered.map((c) => (
                  <div key={c.code} className="grid grid-cols-[44px_1.2fr_0.8fr_0.6fr_0.6fr_110px] gap-2 px-4 py-3 items-center hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-center">
                      <Checkbox
                        checked={!!selected[c.code]}
                        onCheckedChange={() => toggleSelected(c.code)}
                        aria-label={`Select ${c.code}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono font-bold text-primary">{c.code}</div>
                      <div className="font-semibold truncate">{c.title}</div>
                      {c.description ? (
                        <div className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{c.description}</div>
                      ) : null}
                    </div>
                    <div className="hidden md:block">
                      {c.class ? <Badge variant="outline" className="text-[10px] uppercase">{c.class}</Badge> : <span className="text-muted-foreground text-xs">—</span>}
                    </div>
                    <div className="font-mono text-right">{c.fine ?? "—"}</div>
                    <div className="font-mono text-right">{c.time ?? "—"}</div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant={favorites[c.code] ? "default" : "outline"}
                        onClick={() => toggleFavorite(c.code)}
                        title={favorites[c.code] ? "Unfavorite" : "Favorite"}
                        className="h-8 w-8"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={async () => {
                          const payload = `${c.code} — ${c.title}${c.class ? ` (${c.class})` : ""}${c.fine ? ` | Fine: ${c.fine}` : ""}${c.time ? ` | Time: ${c.time}` : ""}`;
                          try {
                            await navigator.clipboard.writeText(payload);
                            toast({ title: "Copied", description: `${c.code} copied.` });
                          } catch {
                            toast({ title: "Couldn’t copy", description: "Your browser blocked clipboard access." });
                          }
                        }}
                        title="Copy"
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-muted-foreground font-mono">NO RESULTS FOUND</div>
            )}
          </ScrollArea>
        </div>

        {/* Charge Builder */}
        <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden flex flex-col min-h-0">
          <div className="p-4 border-b border-border/50 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <Calculator className="h-5 w-5" />
                <h3 className="font-bold uppercase text-sm tracking-widest">Charge Sheet</h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={copyChargeSheet}
                className="text-[10px] font-bold uppercase tracking-widest"
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded border border-border/30">
                <div className="text-muted-foreground uppercase">Total Fine</div>
                <div className="text-primary font-bold">
                  {chargeList.length
                    ? totals.hasRange
                      ? `$${totals.minFine.toLocaleString()} - $${totals.maxFine.toLocaleString()}`
                      : `$${totals.minFine.toLocaleString()}`
                    : "—"}
                </div>
              </div>
              <div className="p-2 rounded border border-border/30">
                <div className="text-muted-foreground uppercase">Total Time</div>
                <div className="text-primary font-bold">{chargeList.length ? formatSeconds(totals.seconds) : "—"}</div>
              </div>
            </div>
            {totals.notes.length ? (
              <div className="mt-2 text-[10px] text-muted-foreground">
                <span className="font-bold uppercase">Notes:</span> {totals.notes.join("; ")}
              </div>
            ) : null}
          </div>

          <ScrollArea className="flex-1">
            {chargeList.length ? (
              <div className="p-4 space-y-3">
                {chargeList.map((c) => (
                  <div key={c.key} className="p-3 rounded border border-border/30 bg-background/30">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-primary">{c.code}</div>
                        <div className="font-semibold leading-tight">{c.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {c.class ? `${c.class} • ` : ""}{c.fine ? `Fine: ${c.fine}` : "Fine: —"}{c.time ? ` • Time: ${c.time}` : ""}
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        title="Remove"
                        onClick={() => setChargeList((prev) => prev.filter((x) => x.key !== c.key))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Separator />
                <Button
                  variant="outline"
                  className="w-full text-[10px] font-bold uppercase tracking-widest"
                  onClick={() => setChargeList([])}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Clear charge sheet
                </Button>
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <div className="font-mono uppercase tracking-widest text-xs">Build a quick charge list</div>
                <div className="text-[11px] mt-2">Select codes on the left → <span className="font-bold">Add selected</span>.</div>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
