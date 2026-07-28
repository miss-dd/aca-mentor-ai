import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import type { SystemStatus } from "@/types";

export const Route = createFileRoute("/admin/monitoring")({
  head: () => ({ meta: [{ title: "System Monitoring — Admin" }] }),
  component: MonitoringPage,
});

function MonitoringPage() {
  const [statuses, setStatuses] = useState<SystemStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    const r = await adminService.getSystemStatus();
    if (r.success) setStatuses(r.data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  const operational = statuses.filter((s) => s.status === "operational").length;
  const degraded = statuses.filter((s) => s.status === "degraded").length;
  const outage = statuses.filter((s) => s.status === "outage").length;

  const overallStatus =
    outage > 0 ? "outage" : degraded > 0 ? "degraded" : "operational";

  const overallConfig = {
    operational: {
      label: "All Systems Operational",
      color: "text-success",
      bg: "bg-success/10",
      Icon: CheckCircle2,
    },
    degraded: {
      label: "Partial Degradation",
      color: "text-warning",
      bg: "bg-warning/10",
      Icon: AlertTriangle,
    },
    outage: {
      label: "Service Outage",
      color: "text-destructive",
      bg: "bg-destructive/10",
      Icon: AlertCircle,
    },
  }[overallStatus];

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">System Monitoring</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Frontend demonstration data — connect to real health endpoints in production.
          </p>
        </div>
        <Button variant="outline" onClick={() => load(true)} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <div key={i} className="surface-card h-16 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* Overall banner */}
          <div className={`surface-card p-5 flex items-center gap-4 ${overallConfig.bg}`}>
            <div className={`grid h-12 w-12 place-items-center rounded-xl ${overallConfig.bg} ${overallConfig.color}`}>
              <overallConfig.Icon className="h-6 w-6" />
            </div>
            <div>
              <div className={`font-semibold ${overallConfig.color}`}>{overallConfig.label}</div>
              <div className="text-sm text-muted-foreground">
                {operational} operational · {degraded} degraded · {outage} outage
              </div>
            </div>
          </div>

          {/* Service list */}
          <div className="surface-card overflow-hidden">
            <div className="px-5 py-3 border-b bg-muted/40">
              <h2 className="font-semibold text-sm">Service Status</h2>
            </div>
            <ul className="divide-y">
              {statuses.map((s) => (
                <li key={s.service} className="flex items-center gap-4 px-5 py-4">
                  {s.status === "operational" ? (
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                  ) : s.status === "degraded" ? (
                    <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{s.service}</div>
                    {s.note && (
                      <div className="text-xs text-muted-foreground mt-0.5">{s.note}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {s.latencyMs && (
                      <span className="text-xs text-muted-foreground">{s.latencyMs}ms</span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        s.status === "operational"
                          ? "bg-success/10 text-success"
                          : s.status === "degraded"
                          ? "bg-warning/10 text-warning"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
