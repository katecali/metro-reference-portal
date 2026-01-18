import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";
import logo from "@assets/1752618589758238-NEWMPDLOGOArtboard_1_1768622307273.png";

interface LoginProps {
  onLogin: (data: { name: string; callsign: string }) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState("");
  const [callsign, setCallsign] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate callsign format 1N-12 (e.g. 1A-12)
    const callsignRegex = /^[0-9][A-Z]-[0-9]{2}$/;
    if (!callsignRegex.test(callsign)) {
      alert("INVALID CALLSIGN FORMAT. MUST BE #N-## (e.g. 1N-12)");
      return;
    }
    if (name && callsign) {
      onLogin({ name, callsign });
    }
  };

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl relative z-10">
        <CardHeader className="space-y-4 items-center pb-8">
          <div className="h-24 w-24 relative">
             <img src={logo} alt="Metro Police Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-black tracking-tighter uppercase">
              Metro <span className="text-primary">Reference</span> Portal
            </CardTitle>
            <CardDescription className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground">
              Departmental Access Required
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="callsign" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Callsign (Format: 1N-12)</Label>
              <Input
                id="callsign"
                placeholder="e.g. 1N-12"
                value={callsign}
                maxLength={5}
                onChange={(e) => {
                  let val = e.target.value.toUpperCase();
                  if (val.length === 2 && !val.includes('-') && callsign.length === 1) {
                    val += '-';
                  }
                  setCallsign(val);
                }}
                className="h-12 bg-background/50 border-input focus-visible:ring-primary font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 bg-background/50 border-input focus-visible:ring-primary font-mono"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 font-bold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
              <ShieldCheck className="mr-2 h-5 w-5" /> Initialize Session
            </Button>
          </form>
        </CardContent>
        <div className="p-4 border-t border-border/50 text-center">
            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
                UNAUTHORIZED ACCESS IS PROHIBITED BY STATE LAW
            </p>
        </div>
      </Card>
    </div>
  );
}
