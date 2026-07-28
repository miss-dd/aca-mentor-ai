import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import { CATEGORY_LABEL, CATEGORIES } from "@/lib/mock-data";
import type { StudentQuery, Category, QueryStatus } from "@/types";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/queries")({
  head: () => ({ meta: [{ title: "Student Queries — Admin" }] }),
  component: QueriesPage,
});

const STATUS_OPTIONS: { value: QueryStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "open", label: "Open" },
  { value: "pending", label: "Pending" },
  { value: "escalated", label: "Escalated" },
  { value: "resolved", label: "Resolved" },
];

const STATUS_COLOR: Record<QueryStatus, string> = {
  open: "bg-brand/10 text-brand",
  pending: "bg-warning/10 text-warning",
  escalated: "bg-destructive/10 text-destructive",
  resolved: "bg-success/10 text-success",
};

function QueriesPage() {
  const [items, setItems] = useState<StudentQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<QueryStatus | "all">("all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [selected, setSelected] = useState<StudentQuery | null>(null);

  const load = () => {
    setLoading(true);
    adminService.listQueries().then((r) => {
      if (r.success) setItems(r.data);
      setLoading(false);
    });
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    let list = items;
    if (status !== "all") list = list.filter((q) => q.status === status);
    if (category !== "all") list = list.filter((q) => q.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (x) =>
          x.question.toLowerCase().includes(q) ||
          x.studentName.toLowerCase().includes(q) ||
          x.studentId.toLowerCase().includes(q),
      );
    }
    return list;
  }, [items, query, status, category]);

  const updateStatus = async (id: string, newStatus: QueryStatus) => {
    const r = await adminService.updateQueryStatus(id, newStatus);
    if (r.success) {
      toast.success(`Marked as ${newStatus}`);
      load();
      if (selected?.id === id) setSelected(r.data);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Student Queries</h1>
        <p className="mt-1 text-muted-foreground">Review, escalate, and resolve student questions.</p>
      </header>

      <div className="surface-card p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by question or student…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as QueryStatus | "all")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category | "all")}
          className="h-10 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABEL[c]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-2 space-y-2">
          {loading ? (
            [0, 1, 2].map((i) => <div key={i} className="surface-card h-20 animate-pulse" />)
          ) : filtered.length === 0 ? (
            <div className="surface-card p-8 text-center text-sm text-muted-foreground">
              No queries match your filters.
            </div>
          ) : (
            filtered.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelected(q)}
                className={`w-full text-left surface-card p-4 hover:border-brand/40 transition ${
                  selected?.id === q.id ? "border-brand/60 bg-brand/5" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium line-clamp-2">{q.question}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[q.status]}`}
                  >
                    {q.status}
                  </span>
                </div>
                <div className="mt-1.5 flex gap-2 text-xs text-muted-foreground">
                  <span>{q.studentName}</span>
                  <span>·</span>
                  <span>{CATEGORY_LABEL[q.category]}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-3">
          {selected ? (
            <div className="surface-card p-6 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-semibold">{selected.question}</h2>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[selected.status]}`}
                >
                  {selected.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Student</div>
                  <div className="font-medium">{selected.studentName}</div>
                  <div className="text-xs text-muted-foreground">{selected.studentId}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Category</div>
                  <div className="font-medium">{CATEGORY_LABEL[selected.category]}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Submitted</div>
                  <div className="font-medium">
                    {new Date(selected.createdAt).toLocaleString()}
                  </div>
                </div>
                {selected.resolvedAt && (
                  <div>
                    <div className="text-xs text-muted-foreground">Resolved</div>
                    <div className="font-medium">
                      {new Date(selected.resolvedAt).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              {selected.aiResponse && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">AI Response</div>
                  <div className="rounded-lg bg-muted/60 border p-3 text-sm whitespace-pre-wrap">
                    {selected.aiResponse}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {selected.status !== "resolved" && (
                  <Button size="sm" onClick={() => updateStatus(selected.id, "resolved")}>
                    Mark Resolved
                  </Button>
                )}
                {selected.status !== "escalated" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(selected.id, "escalated")}
                  >
                    Escalate
                  </Button>
                )}
                {selected.status !== "pending" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatus(selected.id, "pending")}
                  >
                    Set Pending
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="surface-card p-10 text-center text-sm text-muted-foreground">
              Select a query to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
