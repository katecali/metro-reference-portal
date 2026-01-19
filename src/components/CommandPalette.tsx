import React, { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
  Radio,
  Languages,
  ShieldAlert,
  Gauge,
  BookOpen,
  FileText,
  ClipboardCheck,
  Gavel,
  Users,
  Settings,
} from "lucide-react";

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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (tab: TabKey, search?: string) => void;
};

export default function CommandPalette({ open, onOpenChange, onNavigate }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === "k";
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape" && open) onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (tab: TabKey, search?: string) => {
    onNavigate(tab, search);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search the portal… (sop, roster, radio, etc.)" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("radio")}>
            <Radio className="mr-2 h-4 w-4" /> Radio Codes <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("nato")}>
            <Languages className="mr-2 h-4 w-4" /> NATO Alphabet <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("penal")}>
            <ShieldAlert className="mr-2 h-4 w-4" /> Penal Codes <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("speed")}>
            <Gauge className="mr-2 h-4 w-4" /> Speed Limits <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("reference")}>
            <BookOpen className="mr-2 h-4 w-4" /> Quick Reference <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("sop")}>
            <FileText className="mr-2 h-4 w-4" /> SOP <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("promotions")}>
            <ClipboardCheck className="mr-2 h-4 w-4" /> Promotions <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("punishment")}>
            <Gavel className="mr-2 h-4 w-4" /> Punishment Matrix <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("roster")}>
            <Users className="mr-2 h-4 w-4" /> Roster <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
          <CommandItem onSelect={() => go("settings")}>
            <Settings className="mr-2 h-4 w-4" /> Settings <Badge variant="outline" className="ml-auto font-mono">tab</Badge>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Search">
          <CommandItem onSelect={() => go("penal", "kidnapping")}>
            Penal: Kidnapping
          </CommandItem>
          <CommandItem onSelect={() => go("penal", "robbery")}>
            Penal: Robbery
          </CommandItem>
          <CommandItem onSelect={() => go("radio", "10-")}>Radio: 10-codes</CommandItem>
          <CommandItem onSelect={() => go("reference", "miranda")}>Reference: Miranda</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
