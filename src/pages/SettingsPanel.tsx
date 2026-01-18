import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type Props = {
  isDarkMode: boolean;
  setIsDarkMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  isLargeText: boolean;
  setIsLargeText: (v: boolean | ((prev: boolean) => boolean)) => void;
};

export default function SettingsPanel({ isDarkMode, setIsDarkMode, isLargeText, setIsLargeText }: Props) {
  return (
    <div className="p-2 md:p-4 max-w-3xl">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Settings <Badge variant="outline" className="font-mono">local</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between gap-6">
            <div>
              <Label className="font-bold">Dark Theme</Label>
              <div className="text-xs text-muted-foreground">Better at night, easier on eyes.</div>
            </div>
            <Switch checked={isDarkMode} onCheckedChange={(c) => setIsDarkMode(!!c)} />
          </div>

          <div className="flex items-center justify-between gap-6">
            <div>
              <Label className="font-bold">Large Text</Label>
              <div className="text-xs text-muted-foreground">More readable under stress.</div>
            </div>
            <Switch checked={isLargeText} onCheckedChange={(c) => setIsLargeText(!!c)} />
          </div>

          <div className="text-xs text-muted-foreground leading-relaxed">
            Tip: use <span className="font-mono">Ctrl/⌘ + K</span> to open the command palette and jump anywhere fast.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
