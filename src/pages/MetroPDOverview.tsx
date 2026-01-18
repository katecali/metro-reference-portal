import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BadgeCheck,
  ClipboardList,
  Radio,
  Shield,
  Siren,
  Users,
} from "lucide-react";

const quickStats = [
  { label: "Patrol Districts", value: "4" },
  { label: "Radio Channels", value: "6" },
  { label: "Active Units", value: "On Duty" },
  { label: "Dispatch Priority", value: "Code 3" },
];

const readinessChecklist = [
  "Body-worn camera activated + storage confirmed",
  "Radio check + CAD synced",
  "Vehicle inspection (tires, lights, med kit)",
  "Less-lethal + duty weapon status confirmed",
];

const responseProtocols = [
  { title: "Code 1", detail: "Routine response, no lights/sirens." },
  { title: "Code 2", detail: "Expedite response, no sirens unless needed." },
  { title: "Code 3", detail: "Emergency response, lights + sirens." },
];

const divisions = [
  { title: "Patrol Division", detail: "Primary response, proactive policing." },
  { title: "Traffic Division", detail: "Collisions, enforcement, and escorts." },
  { title: "Investigations", detail: "Case follow-up, warrants, intel." },
  { title: "Support Services", detail: "Records, training, tech, armory." },
];

export default function MetroPDOverview() {
  return (
    <div className="h-full overflow-auto pr-1">
      <div className="rounded-xl border border-border/60 bg-card/60 p-6 shadow-lg space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="uppercase tracking-[0.3em] text-xs bg-primary text-primary-foreground px-3 py-1">
                MetroPD
              </Badge>
              <Badge variant="outline" className="uppercase tracking-widest text-xs">
                Command Center
              </Badge>
            </div>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest">
              Metro Police Department
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Real-time operational readiness, protocol quick-glance, and division overview for MetroPD officers
              and command staff.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" className="uppercase tracking-widest text-xs">
              Start Tour
            </Button>
            <Button variant="outline" size="sm" className="uppercase tracking-widest text-xs">
              Submit Report
            </Button>
          </div>
        </div>

        <Separator className="bg-border/60" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="border-border/60 bg-background/60">
              <CardContent className="p-4 space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-black text-primary">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card className="border-border/60 bg-background/60">
            <CardHeader className="flex flex-row items-center gap-2">
              <ClipboardList className="h-5 w-5 text-primary" />
              <CardTitle className="uppercase tracking-widest text-sm">Shift Readiness Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {readinessChecklist.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <BadgeCheck className="h-4 w-4 text-emerald-400 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/60">
            <CardHeader className="flex flex-row items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              <CardTitle className="uppercase tracking-widest text-sm">Dispatch Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Siren className="h-4 w-4 text-red-400" />
                Priority Calls: <span className="font-semibold text-foreground">Standby</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                Sector Coverage: <span className="font-semibold text-foreground">Alpha / Bravo / Charlie</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                Partnering: <span className="font-semibold text-foreground">Recommended after 22:00</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/60 bg-background/60 md:col-span-2">
            <CardHeader className="flex flex-row items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="uppercase tracking-widest text-sm">Response Protocols</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {responseProtocols.map((protocol) => (
                <div key={protocol.title} className="flex items-start gap-3">
                  <span className="text-primary font-bold">{protocol.title}</span>
                  <span>{protocol.detail}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/60">
            <CardHeader className="flex flex-row items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle className="uppercase tracking-widest text-sm">Divisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              {divisions.map((division) => (
                <div key={division.title}>
                  <p className="font-semibold text-foreground">{division.title}</p>
                  <p className="text-xs">{division.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
