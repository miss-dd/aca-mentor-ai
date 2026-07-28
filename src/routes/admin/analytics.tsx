import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { adminService } from "@/services/admin.service";
import { CATEGORY_LABEL } from "@/lib/mock-data";
import type { AnalyticsSummary } from "@/types";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
  component: AnalyticsPage,
});

const PIE_COLORS = [
  "oklch(0.56 0.22 258)",
  "oklch(0.72 0.13 190)",
  "oklch(0.63 0.16 145)",
  "oklch(0.78 0.15 75)",
  "oklch(0.58 0.22 27)",
  "oklch(0.34 0.10 258)",
  "oklch(0.65 0.18 220)",
];

function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    adminService.getAnalytics().then((r) => r.success && setData(r.data));
  }, []);

  if (!data) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((i) => <div key={i} className="surface-card h-48 animate-pulse" />)}
      </div>
    );
  }

  const categoryData = data.byCategory.map((c) => ({
    name: CATEGORY_LABEL[c.category],
    count: c.count,
  }));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Sample platform analytics — frontend demonstration data only.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Questions over time */}
        <div className="surface-card p-5">
          <h2 className="font-semibold text-sm mb-4">Questions Over Time (last 7 days)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.questionsOverTime} barSize={28}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} cursor={{ fill: "oklch(0.965 0.008 240)" }} />
              <Bar dataKey="count" fill="oklch(0.56 0.22 258)" radius={[4, 4, 0, 0]} name="Questions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Satisfaction trend */}
        <div className="surface-card p-5">
          <h2 className="font-semibold text-sm mb-4">Satisfaction Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.satisfactionTrend}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[3.5, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="oklch(0.72 0.13 190)"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Rating"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By category bar */}
        <div className="surface-card p-5">
          <h2 className="font-semibold text-sm mb-4">Questions by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical" barSize={16}>
              <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={120}
              />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} cursor={{ fill: "oklch(0.965 0.008 240)" }} />
              <Bar dataKey="count" fill="oklch(0.72 0.13 190)" radius={[0, 4, 4, 0]} name="Questions" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="surface-card p-5">
          <h2 className="font-semibold text-sm mb-4">Category Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) =>
                  `${name.split(" ")[0]} ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top topics */}
      <div className="surface-card p-5">
        <h2 className="font-semibold text-sm mb-4">Top Topics</h2>
        <ul className="space-y-3">
          {data.topTopics.map((t, i) => (
            <li key={t.topic} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-4">{i + 1}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{t.topic}</span>
                  <span className="font-medium">{t.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(t.count / data.topTopics[0].count) * 100}%` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
