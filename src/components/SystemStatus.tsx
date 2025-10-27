import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Mic, Video as Cam, AlertTriangle, Network } from "lucide-react";

interface SystemStatusProps {
  sessionType: "text" | "realtime";
  listening?: boolean; // realtime listening or text input focus
  aiResponding?: boolean; // typing or responding
}

type PermState = "granted" | "denied" | "prompt" | "unknown";

const StatusDot: React.FC<{ state: PermState | boolean | undefined; colorMap?: Record<string, string> }> = ({ state, colorMap }) => {
  const c = useMemo(() => {
    if (typeof state === "boolean") return state ? "bg-green-500" : "bg-muted-foreground/50";
    const map = colorMap || { granted: "bg-green-500", denied: "bg-red-500", prompt: "bg-yellow-500", unknown: "bg-muted-foreground/50" };
    return map[state || "unknown"] || map.unknown;
  }, [state, colorMap]);
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${c}`} aria-hidden />;
};

const SystemStatus: React.FC<SystemStatusProps> = ({ sessionType, listening, aiResponding }) => {
  const [open, setOpen] = useState(false);
  const [micPerm, setMicPerm] = useState<PermState>("unknown");
  const [camPerm, setCamPerm] = useState<PermState>("unknown");
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const q = (name: PermissionName) =>
      (navigator as any).permissions?.query?.({ name } as any).then((p: any) => {
        if (!mounted || !p) return;
        const handler = () => mounted && setState(name, p.state as PermState);
        setState(name, p.state as PermState);
        p.addEventListener?.("change", handler);
      }).catch(() => {});

    const setState = (name: PermissionName, state: PermState) => {
      if (name === ("microphone" as any)) setMicPerm(state);
      if (name === ("camera" as any)) setCamPerm(state);
    };

    q("microphone" as any);
    q("camera" as any);

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onResult = (e: Event) => {
      const detail = (e as CustomEvent).detail as { latencyMs: number; ok: boolean; error?: string };
      setLastLatency(detail?.latencyMs ?? null);
      setLastError(detail?.ok ? null : (detail?.error || "Request failed"));
    };
    window.addEventListener("edge:result", onResult as EventListener);
    return () => window.removeEventListener("edge:result", onResult as EventListener);
  }, []);

  const ListeningLabel = sessionType === "realtime" ? "Listening" : "Typing";
  const listeningState: boolean | undefined = listening;
  const respondingState: boolean | undefined = aiResponding;

  return (
    <div className="fixed right-3 bottom-3 z-50">
      <div className="flex items-center gap-2 justify-end mb-2">
        <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
          <Network className="h-3.5 w-3.5" />
          {lastLatency != null ? `${Math.round(lastLatency)}ms` : "No recent calls"}
        </Badge>
        {lastError && (
          <Badge variant="destructive" className="items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" /> Error
          </Badge>
        )}
        <Button size="sm" variant="outline" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="system-status-panel">
          <Activity className="h-4 w-4 mr-2" /> Status
        </Button>
      </div>

      {open && (
        <Card id="system-status-panel" className="w-80 shadow-empathy">
          <CardHeader className="py-3">
            <CardTitle className="text-base">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><Mic className="h-4 w-4" /> Microphone</div>
              <div className="flex items-center gap-2"><StatusDot state={micPerm} /> <span className="capitalize">{micPerm}</span></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2"><Cam className="h-4 w-4" /> Camera</div>
              <div className="flex items-center gap-2"><StatusDot state={camPerm} /> <span className="capitalize">{camPerm}</span></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">{ListeningLabel}</div>
              <div className="flex items-center gap-2"><StatusDot state={!!listeningState} /> {listeningState ? "On" : "Off"}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">AI Responding</div>
              <div className="flex items-center gap-2"><StatusDot state={!!respondingState} /> {respondingState ? "Active" : "Idle"}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">Last AI Call</div>
              <div className="flex items-center gap-2">
                {lastLatency != null ? (
                  <>
                    <StatusDot state={true} colorMap={{ granted: "bg-green-500", denied: "bg-red-500", prompt: "bg-yellow-500", unknown: "bg-muted-foreground/50" }} />
                    {Math.round(lastLatency)} ms
                  </>
                ) : (
                  <span className="text-muted-foreground">No data</span>
                )}
              </div>
            </div>
            {lastError && (
              <div className="text-xs text-destructive bg-destructive/10 rounded p-2">
                {lastError}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemStatus;
