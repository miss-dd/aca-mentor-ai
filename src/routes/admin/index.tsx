import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  MessageSquare,
  TrendingUp,
  Clock,
  ThumbsUp,
  Activity,
  AlertCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { adminService } from "@/services/admin.service";
import { CATEGORY_LABEL } from "@/lib/mock-data";
import type { AnalyticsSummary, StudentQuery, SystemStatus } from "@/types";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Overview — AI Student Support" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [recentQueries, setRecentQueries] = useState<StudentQuery[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([]);

  useEffect(() => {
    adminService.getAnalytics().then((r) => r.success && setAnalytics(r.data));
    adminService.listQueries().then((r) => r.success && setRecentQueries(r.data.slice(0, 5)));
    adminService.getSystemStatus().then((r) => r.success && setSystemStatus(r.data));
  }, []);

  if (!analytics) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="surface-card h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Questions",
      value: analytics.totalQuestions.toLocaleString(),
      icon: MessageSquare,
      color: "text-brand",
      bg: "bg-brand/10",
    },
    {
      label: "Questions Today",
      value: analytics.questionsToday,
      icon: TrendingUp,
      color: "text-teal",
      bg: "bg-teal/10",
    },
    {
      label: "AI Response Rate",
      value: `${analytics.aiResponseRate}%`,
      icon: Activity,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Avg Response Time",
      value: `${(analytics.avgResponseTimeMs / 1000).toFixed(1)}s`,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Avg Feedback Rating",
      value: `${analytics.avgFeedbackRating}/5`,
      icon: ThumbsUp,
      color: "text-brand",
      bg: "bg-brand/10",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Sample platform statistics — frontend demonstration data only.
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {statCards.map((s) => (
          <div key={s.label} className="surface-card p-5">
            <div className={`grid h-10 w-10 place-items-center rounded-lg ${s.bg} ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-5">
          <h2 className="font-semibold text-sm mb-4">Questions Over Time (last 7 days)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analytics.questionsOverTime} barSize={24}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
                cursor={{ fill: "oklch(0.965 0.008 240)" }}
              />
              <Bar dataKey="count" fill="oklch(0.56 0.22 258)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="surface-card p-5">
          <h2 className="font-semibold text-sm mb-4">Satisfaction Trend</h2>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={analytics.satisfactionTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[3.5, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="oklch(0.72 0.13 190)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* By category */}
        <div className="surface-card p-5">
          <h2 className="font-semibold text-sm mb-4">Questions by Category</h2>
          <ul className="space-y-2">
            {analytics.byCategory.map((c) => (
              <li key={c.category} className="flex items-center gap-2 text-sm">
                <span className="flex-1 truncate text-muted-foreground">
                  {CATEGORY_LABEL[c.category]}
                </span>
                <span className="font-medium">{c.count}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recent queries */}
        <div className="surface-card p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Recent Queries</h2>
            <Link to="/admin/queries" className="text-xs text-brand hover:underline">
              View all
            </Link>
          </div>
          <ul className="space-y-3">
            {recentQueries.map((q) => (
              <li key={q.id} className="text-sm">
                <div className="truncate font-medium">{q.question}</div>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                  <StatusBadge status={q.status} />
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* System health */}
        <div className="surface-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">System Health</h2>
            <Link to="/admin/monitoring" className="text-xs text-brand hover:underline">
              Details
            </Link>
          </div>
          <ul className="space-y-2">
            {systemStatus.map((s) => (
              <li key={s.service} className="flex items-center gap-2 text-sm">
                {s.status === "operational" ? (
                  <span className="h-2 w-2 rounded-full bg-success shrink-0" />
                ) : s.status === "degraded" ? (
                  <AlertCircle className="h-3.5 w-3.5 text-warning shrink-0" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                )}
                <span className="flex-1 truncate text-muted-foreground">{s.service}</span>
                {s.latencyMs && (
                  <span className="text-xs text-muted-foreground">{s.latencyMs}ms</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: "bg-brand/10 text-brand",
    resolved: "bg-success/10 text-success",
    escalated: "bg-destructive/10 text-destructive",
    pending: "bg-warning/10 text-warning",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status] ?? "bg-muted text-muted-foreground"}`}>
      {status}
    </span>
  );
}
