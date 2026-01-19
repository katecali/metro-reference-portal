import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ClipboardCopy, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ReferenceItem = {
  id: string;
  title: string;
  tags: string[];
  body: string;
};

const ITEMS: ReferenceItem[] = [
  {
    id: "miranda",
    title: "Miranda Warning",
    tags: ["miranda", "rights", "arrest"],
    body:
      "You have the right to remain silent. Anything you say can and will be used against you in a court of law. You have the right to an attorney. If you cannot afford an attorney, one will be provided for you. Do you understand these rights as I have read them to you?",
  },
  {
    id: "traffic-stop",
    title: "Traffic Stop Checklist",
    tags: ["traffic", "stop", "vehicle"],
    body:
      "1) Position + safety (angle, lights, cover)\n2) Approach + greeting\n3) Explain reason for stop\n4) Request license/registration/insurance\n5) Run checks + observe indicators\n6) Warn / cite / arrest decision\n7) Return documents + clear instructions\n8) Clear stop + document notes",
  },
  {
    id: "use-of-force",
    title: "Use of Force (Quick Guide)",
    tags: ["force", "policy"],
    body:
      "• Presence / verbal commands\n• Soft control (guiding, escort holds)\n• Hard control (takedowns, strikes)\n• Less-lethal (OC / taser)\n• Deadly force (last resort, imminent threat)\n\nAlways: reasonableness, proportionality, and document justification.",
  },
  {
    id: "search-seizure",
    title: "Search & Seizure (Probable Cause vs Consent)",
    tags: ["search", "consent", "pc"],
    body:
      "Consent: clear, voluntary, can be withdrawn.\nProbable cause: facts that would lead a reasonable person to believe evidence of a crime is present.\nPlain view: lawful access + immediately apparent contraband/evidence.",
  },
  {
    id: "reporting",
    title: "Report Writing (Mini Template)",
    tags: ["report", "documentation"],
    body:
      "WHO: parties + identifiers\nWHAT: events in chronological order\nWHEN/WHERE: time/location\nWHY: legal basis (PC/RS)\nHOW: actions taken + evidence\nNOTES: statements, observations, bodycam, witnesses",
  },
  {
    id: "radio-protocols",
    title: "Radio Protocol (MetroPD)",
    tags: ["radio", "dispatch", "protocol"],
    body:
      "• Keep transmissions concise; unit ID first.\n• Use 10-codes for status + priority.\n• Emergency traffic: \"Signal 100\" or \"Code 3\" only.\n• Acknowledge dispatch with 10-4.\n• When clearing, advise 10-7/10-8 with location.",
  },
  {
    id: "pursuit-guidelines",
    title: "Vehicle Pursuit Guidelines",
    tags: ["pursuit", "vehicle", "policy"],
    body:
      "1) Confirm reason for pursuit + vehicle description.\n2) Request air/ground support early.\n3) Maintain safe following distance; avoid tunnel vision.\n4) Terminate if risk outweighs public safety.\n5) Document speed, traffic, weather, and termination reason.",
  },
  {
    id: "foot-pursuit",
    title: "Foot Pursuit Checklist",
    tags: ["pursuit", "foot", "tactics"],
    body:
      "• Broadcast direction of travel + description.\n• Maintain line of sight; avoid solo containment.\n• Request perimeter + K9 if available.\n• Do not enter unknown structures alone.\n• Reassess risk vs necessity continuously.",
  },
  {
    id: "arrest-procedure",
    title: "Arrest Procedure (Quick Steps)",
    tags: ["arrest", "procedure", "custody"],
    body:
      "1) Establish probable cause.\n2) Control + secure subject.\n3) Search incident to arrest.\n4) Apply restraints + check tightness.\n5) Read Miranda when questioning.\n6) Transport + log custody status.",
  },
  {
    id: "prisoner-transport",
    title: "Prisoner Transport Protocol",
    tags: ["transport", "custody", "safety"],
    body:
      "• Search + document property.\n• Secure in rear seat with restraints.\n• Monitor via rear camera/audio.\n• Transport direct to holding.\n• Advise dispatch 10-15 with ETA.",
  },
  {
    id: "evidence-handling",
    title: "Evidence Handling Basics",
    tags: ["evidence", "chain", "custody"],
    body:
      "• Photograph before collection.\n• Use gloves + proper containers.\n• Label with case number, date, collector.\n• Maintain chain-of-custody log.\n• Store in secure evidence locker.",
  },
  {
    id: "search-warrant",
    title: "Search Warrant Checklist",
    tags: ["warrant", "search", "legal"],
    body:
      "• Verify warrant scope + address.\n• Brief team; confirm entry plan.\n• Knock/announce unless no-knock authorized.\n• Catalog seized items with photos.\n• Leave copy of warrant + inventory.",
  },
  {
    id: "domestic-violence",
    title: "Domestic Violence Response",
    tags: ["domestic", "violence", "victim"],
    body:
      "• Separate parties; check for injuries.\n• Identify primary aggressor.\n• Document statements + visible injuries.\n• Provide resources + safety plan.\n• Mandatory arrest if probable cause exists.",
  },
  {
    id: "collision-response",
    title: "Traffic Collision Response",
    tags: ["traffic", "collision", "scene"],
    body:
      "1) Scene safety + medical aid.\n2) Secure lanes + flares/cones.\n3) Exchange info + capture statements.\n4) Photograph damage + evidence.\n5) File report + clear roadway ASAP.",
  },
  {
    id: "bolo",
    title: "BOLO Broadcast Template",
    tags: ["bolo", "broadcast", "dispatch"],
    body:
      "BOLO: [TYPE] | [DESCRIPTION] | [LAST SEEN] | [DIRECTION] | [REASON] | [CONTACT/UNIT].\nExample: BOLO VEHICLE | Black Sultan | Vinewood Blvd | Northbound | 10-65 | 2A-14.",
  },
  {
    id: "field-interview",
    title: "Field Interview Reminder",
    tags: ["field", "interview", "contact"],
    body:
      "• Identify + document subject details.\n• Ask open-ended questions.\n• Note demeanor + indicators.\n• Confirm consent for searches.\n• Record time, location, and disposition.",
  },
  {
    id: "medical-assist",
    title: "Medical Assist Quick Guide",
    tags: ["medical", "ems", "aid"],
    body:
      "• Confirm scene safety.\n• Request EMS (10-52) + fire (10-53) if needed.\n• Provide basic first aid within scope.\n• Collect witness info for EMS.\n• Document patient condition on arrival.",
  },
];

export default function ReferenceCenter() {
  const [q, setQ] = useState(() => new URLSearchParams(window.location.search).get("q") ?? "");

  const filtered = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return ITEMS;
    return ITEMS.filter((i) => {
      const hay = [i.title, i.tags.join(" "), i.body].join(" ").toLowerCase();
      return hay.includes(n);
    });
  }, [q]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied", description: "Copied to clipboard." });
    } catch {
      toast({ title: "Couldn’t copy", description: "Your browser blocked clipboard access." });
    }
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="bg-card p-4 rounded-lg border border-border/50 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono tracking-widest">
            QUICK REFERENCE
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {filtered.length} ITEM(S)
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search reference… (miranda, force, report, etc.)"
            className="pl-9 font-mono uppercase tracking-wider"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((item) => (
            <Card key={item.id} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base font-black uppercase tracking-wide">
                    {item.title}
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copy(item.body)}
                    className="font-bold uppercase tracking-widest text-[10px]"
                  >
                    <ClipboardCopy className="h-4 w-4 mr-2" /> Copy
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="font-mono text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Separator className="mb-3" />
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground font-mono">
                  {item.body}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
